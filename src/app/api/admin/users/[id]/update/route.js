import { connectDB } from "@src/lib/mongodb";
import { Notification } from "@src/models/Notification";
import { User } from "@src/models/User"
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const { id } = await params
    const { userData } = await req.json();

    const updatedUser = await User.findByIdAndUpdate(id, userData, { new: true })
    if (!updatedUser) {
      return NextResponse.json({ error: "Utilizatorul nu a fost gasit" }, { status: 404 })
    }
    
    global.io.emit("userUpdated", updatedUser);

    const adminId = await User.find({ role: "admin" }).distinct("_id");
    const newNotification = await Notification.create({
      senderId: adminId[0],
      recipientId: updatedUser?._id,
      type: "system",
      subject: "Detalii modificate",
      content: "Unele detalii din contul tau au fost modificate de catre admin.",
      referenceLink: "/profil"
    })

    return NextResponse.json({ messaage: "Utilizator actualizat" }, { status: 201 });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Server error", details: error },
      { status: 500 }
    );
  }
}