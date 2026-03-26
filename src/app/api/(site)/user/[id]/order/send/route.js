import { connectDB } from "@src/lib/mongodb";
import { Order } from "@src/models/Order";
import { User } from "@src/models/User";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    await connectDB();
    
    const { id } = await params
    const {
      shippingAdress,
      billingAdress,
      email,
      phone,
      shippingMethod,
      paymentMethod,
      products,
      price
    } = req.json()

    const user = await User.findById(id)
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const newOrder = await Order.create({
      senderId: new mongoose.Types.ObjectId(id),
      shippingAdress,
      billingAdress,
      email,
      phone,
      shippingMethod,
      paymentMethod,
      products,
      price
    })

    user.orders.push(newOrder._id)
    user.save()
    
    const res = NextResponse.json({ newOrder }, { status: 201 });
    return res;
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Server error", details: error },
      { status: 500 }
    );
  }
}