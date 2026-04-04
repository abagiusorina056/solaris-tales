import { ensureAdmin } from "@src/lib/auth-server";
import { connectDB } from "@src/lib/mongodb"
import { PublishRequest } from "@src/models/PublishRequest"

export async function GET(req) {
  await connectDB()

  const adminEnsurance = await ensureAdmin();
  if (!adminEnsurance) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url)

  const search = searchParams.get("search") || ""
  const page = Number(searchParams.get("page") || 1)
  const pageSize = Number(searchParams.get("pageSize") || 10)
  const limit = pageSize
    
  const requests = await PublishRequest.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "senderId",
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
      $addFields: {
        senderName: {
          $concat: ["$user.firstName", " ", "$user.lastName"],
        },
      },
    },
    {
      $match: search
        ? {
          $or: [
              { title: { $regex: search, $options: "i" } },
              { "senderName": { $regex: search, $options: "i" } },
              { "user.email": { $regex: search, $options: "i" } },
              { phoneNumber: { $regex: search, $options: "i" } },
            ],
          }
        : {},
    },
    {
      $facet: {
        requests: [
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
    requests: requests[0]?.requests || [],
    total: requests[0]?.totalCount?.[0]?.total || 0
  })
}