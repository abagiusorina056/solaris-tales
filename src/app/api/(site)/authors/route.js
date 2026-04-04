import { connectDB } from "@src/lib/mongodb"
import { Author } from "@src/models/Authors"

export async function GET(req) {
  await connectDB()

  const { searchParams } = new URL(req.url)

  const search = searchParams.get("search") || ""
  const page = Number(searchParams.get("page") || 1)
  const sortField = searchParams.get("sortField") || "createdAt";
  const sortOrder = parseInt(searchParams.get("sortOrder")) || -1;
  const limit = 12
    
  const authors = await Author.aggregate([
    {
      $addFields: {
        ratingNumeric: { $toDouble: { $ifNull: ["$rating", 0] } },
      }
    },
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
            ],
          }
        : {},
    },
    {
      $sort: {
        [sortField === "rating" ? "ratingNumeric" : sortField]: sortOrder
      }
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