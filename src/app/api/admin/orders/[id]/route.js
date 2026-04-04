import { ensureAdmin } from "@src/lib/auth-server"
import { connectDB } from "@src/lib/mongodb"
import { Author } from "@src/models/Authors"
import { Order } from "@src/models/Order"
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
  const limit = Number(searchParams.get("limit") || pageSize)
  // const limit = pageSize
    
  const order = await Order.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
    {
      $lookup: {
        from: "users",
        localField: "senderId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $lookup: {
        from: "books",
        localField: "products.bookId",
        foreignField: "_id",
        as: "booksOrdered",
      },
    },
    {
      $unwind: {
        path: "$user",
      },
    },
  ])

  return Response.json({
    orders: order[0] || [],
  })
}