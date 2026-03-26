import { connectDB } from "@src/lib/mongodb"
import { Author } from "@src/models/Authors"
import { Order } from "@src/models/Order"

export async function GET(req) {
  await connectDB()

  const { searchParams } = new URL(req.url)

  const search = searchParams.get("search") || ""
  const page = Number(searchParams.get("page") || 1)
  const pageSize = Number(searchParams.get("pageSize") || 10) 
  const limit = Number(searchParams.get("limit") || pageSize)
  // const limit = pageSize
    
  const orders = await Order.aggregate([
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
      },
    },
    {
      $match: search
        ? {
            $or: [
              { slug: { $regex: search, $options: "i" } },
              { name: { $regex: search, $options: "i" } },
              { "user.email": { $regex: search, $options: "i" } },
            ],
          }
        : {},
    },
    {
      $facet: {
        orders: [
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
    orders: orders[0]?.orders || [],
    total: orders[0]?.totalCount?.[0]?.total || 0
  })
}