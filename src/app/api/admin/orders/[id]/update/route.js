import { ensureAdmin } from "@src/lib/auth-server";
import { connectDB } from "@src/lib/mongodb";
import { Notification } from "@src/models/Notification";
import { Order } from "@src/models/Order";
import { User } from "@src/models/User";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const adminEnsurance = await ensureAdmin();
    if (!adminEnsurance) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params
    const { newData } = await req.json();

    const updatedOrder = await Order.findByIdAndUpdate(id, newData, { new: true })
    if (!updatedOrder) {
      return NextResponse.json({ error: "Comanda nu a fost gasita" }, { status: 404 })
    }
    
    global.io.emit("orderUpdated", updatedOrder);

    if (!newData?.status) {
      const adminId = await User.find({ role: "admin" }).distinct("_id");
      const newNotification = await Notification.create({
        senderId: adminId[0],
        recipientId: updatedOrder?.senderId,
        type: "system",
        subject: "Comanda modificata",
        content: `Comanda ${updatedOrder?.slug} a fost modificata de catre admin`,
        referenceLink: `/comanda/${updatedOrder.id}`
      })
  
      global.io.emit("newNotification", newNotification)
    }

    return NextResponse.json({ messaage: "Comanda modificata" }, { status: 201 });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Server error", details: error },
      { status: 500 }
    );
  }
}