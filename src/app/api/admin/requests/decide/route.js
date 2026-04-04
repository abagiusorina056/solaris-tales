import { NextResponse } from "next/server";
import { connectDB } from "@src/lib/mongodb";
import { PublishRequest } from "@src/models/PublishRequest";
import { User } from "@src/models/User";
import { Notification } from "@src/models/Notification";
import { ensureAdmin } from "@src/lib/auth-server";

export async function PATCH(req) {
  try {
    await connectDB();

    const adminEnsurance = await ensureAdmin();
    if (!adminEnsurance) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    const { requestId, newStatus } = await req.json()

    const updatedRequest = await PublishRequest.findByIdAndUpdate(requestId, { status: newStatus }, { new: true })
    if (!updatedRequest) {
      return NextResponse.json({ error: "Cererea nu a fost gasita" }, { status: 404 })
    }

    global.io.emit("requestUpdated", { requestId, newStatus });

    const subject = newStatus !== "approved" ? "Cerere respinsa" : "🎉 Felicitari! 🎉"
    const content = newStatus !== "approved"
      ? "Din pacate, cererea ta de publicare a fost respinsa."
      : "Cererea ta de publicare a fost aprobata, iar acum ai titlul de autor. Te rugam sa ne contactezi pentru a putea publica impreuna prima ta carte."

    const adminId = await User.find({ role: "admin" }).distinct("_id");
    const newNotification = await Notification.create({
      senderId: adminId[0],
      recipientId: updatedRequest?.senderId,
      type: "system",
      subject: subject,
      content: content,
      referenceLink: "/profil"
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