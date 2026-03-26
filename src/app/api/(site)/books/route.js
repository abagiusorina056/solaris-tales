import { connectDB } from "@src/lib/mongodb"
import { Book } from "@src/models/Book"

export async function GET(req) {
  await connectDB()
  
  const { searchParams } = new URL(req.url)

  const search = searchParams.get("search") || ""
  const page = Number(searchParams.get("page") || 1)
  const pageSize = 8

  const books = await Book.aggregate([
    {
      $match: {
        // ...(search && {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { author: { $regex: search, $options: "i" } },
          ]
        // })
      }
    },
    {
      $lookup: {
        from: "starreviews",
        localField: "_id",
        foreignField: "bookId",
        as: "reviews",
      }
    },
    {
      $facet: {
        books: [
          { $skip: (page - 1) * pageSize },
          { $limit: pageSize },
        ],
        totalCount: [
          { $count: "total" }
        ],
      },
    },
  ])

  return Response.json({
    books: books[0].books,
    total: books[0].totalCount[0].total
  })
}