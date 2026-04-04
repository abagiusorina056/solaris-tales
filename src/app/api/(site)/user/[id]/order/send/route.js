import { connectDB } from "@src/lib/mongodb";
import { Notification } from "@src/models/Notification";
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
    await user.save()

    const adminId = await User.find({ role: "admin" }).distinct("_id");
    const newNotification = await Notification.create({
      senderId: id,
      recipientId: adminId[0],
      type: "order",
      subject: "Comanda noua",
      content: "O noua comanda a fost plasata ",
      referenceLink: `/admin/comanda/${newOrder.id}`
    })

    global.io.emit("newNotification", newNotification)
    
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