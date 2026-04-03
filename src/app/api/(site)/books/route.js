import { connectDB } from "@src/lib/mongodb"
import { Book } from "@src/models/Book"

export async function GET(req) {
  await connectDB()
  
  const { searchParams } = new URL(req.url)
  const query = {}

  const search = searchParams.get("search") || ""
  const page = Number(searchParams.get("page") || 1)
  const pageSize = 8
  const sortField = searchParams.get("sortField") || "createdAt";
  const sortOrder = parseInt(searchParams.get("sortOrder")) || -1;
  const genre = searchParams.get("genre") || ""
  const discount = searchParams.get("discount") || false
  const min = parseFloat(searchParams.get("minPrice")) || 0;
  const max = parseFloat(searchParams.get("maxPrice")) || 9999;

  if (search) {
    query.title = { $regex: searchParams.get("search"), $options: "i" };
    query.author = { $regex: search, $options: "i" }
  }

  if (genre) {
    query.genre = genre
  }

  const books = await Book.aggregate([
    {
      $addFields: {
        priceNumeric: { $toDouble: "$price" },
        ratingNumeric: { $toDouble: { $ifNull: ["$rating", 0] } },
        discountPercent: { $toInt: { $ifNull: ["$discount", "0"] } }
      }
    },
    {
      $match: {
        ...query,
        priceNumeric: { $gte: min, $lte: max },
        ...(discount === "true" ? { discountPercent: { $gt: 0 } } : {})
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
      $sort: {
        [
          sortField === "price" ? "priceNumeric" : 
          sortField === "rating" ? "ratingNumeric" : 
          sortField
        ]: sortOrder
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