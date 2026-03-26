import { connectDB } from "@src/lib/mongodb"
import { Book } from "@src/models/Book"

export async function GET(req) {
  await connectDB()
  
  const { searchParams } = new URL(req.url)

  const search = searchParams.get("search") || ""
  const page = Number(searchParams.get("page") || 1)
  const pageSize = Number(searchParams.get("pageSize") || 10)

  const skip = (page - 1) * pageSize

  const query = search
    ? {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { author: { $regex: search, $options: "i" } },
        ],
      }
    : {}

  const books = await Book.find(query)
    .skip(skip)
    .limit(pageSize)

  const total = await Book.countDocuments(query)

  return Response.json({
    books,
    total
  })
}