import { NextResponse } from "next/server";
import { connectDB } from "@src/lib/mongodb";
import { User } from "@src/models/User";
import cloudinary from "@src/lib/cloudinary";
import { getCloudinaryPublicId } from "@src/lib/utils";
import { ensureAdmin } from "@src/lib/auth-server";

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const adminEnsurance = await ensureAdmin();
    if (!adminEnsurance) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    const { id } = await params

    const user = await User.findById(id)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    let publicId = user?.profileImage.length > 0 && getCloudinaryPublicId(user.profileImage)

    const promises = [
      publicId && cloudinary.uploader.destroy("nextjs_uploads/" + publicId),
      user.deleteOne(),
    ].filter(Boolean)

    await Promise.all(promises)

    global.io.emit("usersDeleted", [id])

    const res = NextResponse.json({ user }, { status: 200 });
    return res;
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Server error", details: error },
      { status: 500 }
    );
  }
}