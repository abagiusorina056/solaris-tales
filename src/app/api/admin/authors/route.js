import { connectDB } from "@src/lib/mongodb"
import { Author } from "@src/models/Authors"

export async function GET(req) {
  await connectDB()

  const { searchParams } = new URL(req.url)

  const search = searchParams.get("search") || ""
  const page = Number(searchParams.get("page") || 1)
  const pageSize = Number(searchParams.get("pageSize") || 10) 
  const limit = Number(searchParams.get("limit") || pageSize)
    
  const authors = await Author.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: {
        path: "$user",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $match: search
        ? {
            $or: [
              { name: { $regex: search, $options: "i" } },
              { slug: { $regex: search, $options: "i" } },
              { "user.email": { $regex: search, $options: "i" } },
            ],
          }
        : {},
    },
    {
      $facet: {
        authors: [
          { $skip: (page - 1) * limit },
          { $limit: limit },
        ],
        totalCount: [
          { $count: "total" }
        ],
      },
    },
  ])

  return Response.json({
    authors: authors[0]?.authors || [],
    total: authors[0]?.totalCount?.[0]?.total || 0
  })
}