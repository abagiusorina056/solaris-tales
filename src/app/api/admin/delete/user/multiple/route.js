import { NextResponse } from "next/server";
import { connectDB } from "@src/lib/mongodb";
import { User } from "@src/models/User";
import cloudinary from "@src/lib/cloudinary";
import { getCloudinaryPublicId } from "@src/lib/utils";
import mongoose from "mongoose";
import { ensureAdmin } from "@src/lib/auth-server";

export async function DELETE(req) {
  try {
    await connectDB();

    const adminEnsurance = await ensureAdmin();
    if (!adminEnsurance) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    const { ids } = await res.json()

    const users = await User.find({
      _id: { 
        $in: ids.map(id => new mongoose.Types.ObjectId(id)) 
      }
    })
    const profileImagesLinks = 
      users.map(
        u => u.profileImage
      ).filter(image => image !== "")
    const publicIds = profileImagesLinks.map(link => getCloudinaryPublicId(link))
    
    await Promise.all([
      cloudinary.api.delete_resources(publicIds),
      User.deleteMany({
        _id: { $in: ids }
      })
    ])

    global.io.emit("usersDeleted", ids)

    const res = NextResponse.json({ user }, { status: 201 });
    return res;
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Server error", details: error },
      { status: 500 }
    );
  }
}