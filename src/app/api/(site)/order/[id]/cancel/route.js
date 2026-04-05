import { connectDB } from "@src/lib/mongodb";
import { Notification } from "@src/models/Notification";
import { Order } from "@src/models/Order";
import { User } from "@src/models/User";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  await connectDB()

  const { id } = await params
  const { userId } = await req.json()

  const order = await Order.findById(id)
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order?.senderId.toString() !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  order.status = "canceled"
  await order.save()

  global.io.emit("orderCanceled")

  const adminId = await User.find({ role: "admin" }).distinct("_id");
  await Notification.create({
    senderId: userId,
    recipientId: adminId[0],
    type: "order",
    subject: "Comanda anulata",
    content: `Comanda ${order.slug} a fost anulata`,
    referenceLink: `/admin/comanda/${order.id}`
  })

  global.io.emit("newNotification")

  return NextResponse.json({
    orders: order[0],
  })
}