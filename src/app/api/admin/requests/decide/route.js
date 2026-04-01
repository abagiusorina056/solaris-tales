import { NextResponse } from "next/server";
import { connectDB } from "@src/lib/mongodb";
import { PublishRequest } from "@src/models/PublishRequest";
import { User } from "@src/models/User";
import { Notification } from "@src/models/Notification";

export async function PATCH(req) {
  try {
    await connectDB();
    
    const { requestId, newStatus } = await req.json()

    const updatedRequest = await PublishRequest.findByIdAndUpdate(requestId, { status: newStatus }, { new: true })
    if (!updatedRequest) {
      return NextResponse.json({ error: "Cererea nu a fost gasita" }, { status: 404 })
    }

    global.io.emit("requestUpdated", { requestId, newStatus });

    const adminId = await User.find({ role: "admin" }).distinct("_id");
    const newNotification = await Notification.create({
      senderId: adminId[0],
      recipientId: updatedRequest?.senderId,
      type: "system",
      subject: "Carte stearsa",
      content: `Cartea ta, ${book.title}, a fost stearsa de catre admin`,
    })

    global.io.emit("newNotification", newNotification)

    const res = NextResponse.json({ updatedRequest }, { status: 200 });
    return res;
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Server error", details: error },
      { status: 500 }
    );
  }
}