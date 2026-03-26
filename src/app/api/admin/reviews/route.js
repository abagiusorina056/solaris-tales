import { connectDB } from "@src/lib/mongodb"
import { StarReview } from "@src/models/StarReview"

export async function GET(req) {
  await connectDB()

  const { searchParams } = new URL(req.url)

  const search = searchParams.get("search") || ""
  const page = Number(searchParams.get("page") || 1)
  const pageSize = Number(searchParams.get("pageSize") || 10)

  const skip = (page - 1) * pageSize
  const limit = pageSize

  const query = search
    ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { "user.email": { $regex: search, $options: "i" } },
        ],
      }
    : {}
    
  const reviews = await StarReview.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "reviewerId",
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
      $lookup: {
        from: "books",
        localField: "bookId",
        foreignField: "_id",
        as: "book",
      },
    },
    {
      $unwind: {
        path: "$book",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        reviewerName: {
          $concat: ["$user.firstName", " ", "$user.lastName"],
        },
      },
    },

    {
      $match: search
        ? {
            $or: [
              { reviewerName: { $regex: search, $options: "i" } },
              { "book.title": { $regex: search, $options: "i" } },
            ],
          }
        : {},
    },
    {
      $facet: {
        reviews: [
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
    reviews: reviews[0]?.reviews || [],
    total: reviews[0]?.totalCount?.[0]?.total || 0
  })
}