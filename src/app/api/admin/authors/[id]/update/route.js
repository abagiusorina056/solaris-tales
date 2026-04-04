import { ensureAdmin } from "@src/lib/auth-server";
import { connectDB } from "@src/lib/mongodb";
import { Author } from "@src/models/Authors";
import { Notification } from "@src/models/Notification";
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
    const { userData } = await req.json();

    const updatedAuthor = await Author.findByIdAndUpdate(id, userData, { new: true })
    if (!updatedAuthor) {
      return NextResponse.json({ error: "Autorul nu a fost gasit" }, { status: 404 })
    }

    await User.findByIdAndUpdate(updatedAuthor?.userId, { bio: userData?.bio })
    
    global.io.emit("userUpdatedAdmin", updatedAuthor);

    if (updatedAuthor?.userId) {
      const adminId = await User.find({ role: "admin" }).distinct("_id");
      const newNotification = await Notification.create({
        senderId: adminId[0],
        recipientId: updatedAuthor?.userId,
        type: "system",
        subject: "Profil actualizat",
        content: "Datele profilului tau au fost modificate de catre admin",
        referenceLink: `/profil`
      })
  
      global.io.emit("newNotification", newNotification)
    }


    return NextResponse.json({ messaage: "Autor actualizat" }, { status: 201 });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Server error", details: error },
      { status: 500 }
    );
  }
}