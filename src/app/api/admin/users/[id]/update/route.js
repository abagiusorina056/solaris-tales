import { connectDB } from "@src/lib/mongodb";
import { Author } from "@src/models/Authors";
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

    await Author.findOneAndUpdate({ userId: id }, { bio: userData?.bio })
    
    global.io.emit("userUpdatedAdmin", updatedUser);

    const adminId = await User.find({ role: "admin" }).distinct("_id");
    const newNotification = await Notification.create({
      senderId: adminId[0],
      recipientId: updatedUser?._id,
      type: "system",
      subject: "Detalii modificate",
      content: "Unele detalii din contul tau au fost modificate de catre admin.",
      referenceLink: "/profil"
    })

    global.io.emit("newNotification");

    return NextResponse.json({ messaage: "Utilizator actualizat" }, { status: 201 });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Server error", details: error },
      { status: 500 }
    );
  }
}