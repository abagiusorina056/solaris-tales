import { connectDB } from "@src/lib/mongodb";
import { Order } from "@src/models/Order";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { id } = await params
    const { searchParams } = new URL(req.url)

    let userId = searchParams.get("user") || ""
    let page = searchParams.get("page") || ""

    if (userId.includes("?")) {
      userId = userId.split("?")[0];
    }
    
    const order = await Order.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: "books",
          localField: "products.bookId",
          foreignField: "_id",
          as: "booksOrdered",
        }
      }
    ])

    if (!order[0]) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order[0].senderId.toString() !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return Response.json({
      orders: order[0],
    })
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    );
  }
} 