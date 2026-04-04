import { ensureAdmin } from "@src/lib/auth-server";
import { connectDB } from "@src/lib/mongodb"
import { StarReview } from "@src/models/StarReview"
import mongoose from "mongoose"

export async function GET(req, { params }) {
  await connectDB()

  const adminEnsurance = await ensureAdmin();
  if (!adminEnsurance) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params
  const { searchParams } = new URL(req.url)

  const search = searchParams.get("search") || ""
  const page = Number(searchParams.get("page") || 1)
  const pageSize = Number(searchParams.get("pageSize") || 10)
  const reviewerId = searchParams.get("reviewerId") || null

  const skip = (page - 1) * pageSize
  const limit = pageSize

  const query = search
    ? {
        $or: [
          { review: { $regex: search, $options: "i" } },
          { "book.title": { $regex: search, $options: "i" } },
        ],
        $match: { reviewerId: new mongoose.Types.ObjectId(id) }
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
      $match: {
        reviewerId: new mongoose.Types.ObjectId(id),
        ...(search && {
          $or: [
            { review: { $regex: search, $options: "i" } },
            { "book.title": { $regex: search, $options: "i" } },
          ]
        })
      }
    },
    {
      $addFields: {
        reviewerName: {
          $concat: ["$user.firstName", " ", "$user.lastName"],
        },
      },
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