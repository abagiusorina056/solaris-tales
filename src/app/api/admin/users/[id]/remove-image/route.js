import { ensureAdmin } from "@src/lib/auth-server";
import cloudinary from "@src/lib/cloudinary";
import { connectDB } from "@src/lib/mongodb";
import { getCloudinaryPublicId } from "@src/lib/utils";
import { Notification } from "@src/models/Notification";
import { User } from "@src/models/User"
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const adminEnsurance = await ensureAdmin();
    if (!adminEnsurance) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params
    const { image } = await req.json();

    const updatedUser = await User.findByIdAndUpdate(
      id, 
      { profileImage: "" },
      { new: true }
    )
    if (!updatedUser) {
      return NextResponse.json({ error: "Utilizatorul nu a fost gasit" }, { status: 404 })
    }

    let publicId = image?.length > 0 && getCloudinaryPublicId(image)
    const res = await cloudinary.uploader.destroy("nextjs_uploads/" + publicId)

    const adminId = await User.find({ role: "admin" }).distinct("_id");

    if (id !== adminId[0]) {
      const newNotification = await Notification.create({
        senderId: adminId[0],
        recipientId: updatedUser?._id,
        type: "system",
        subject: "Poza de profil",
        content: "Poza ta de profil a fost stearsa de catre admin",
        referenceLink: "/profil"
      })

      global.io.emit("newNotification");
    }
    
    global.io.emit("imageRemoved");

    return NextResponse.json({ messaage: "Poza de profil stearsa" }, { status: 201 });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Server error", details: error },
      { status: 500 }
    );
  }
}