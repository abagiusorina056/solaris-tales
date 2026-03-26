import { NextResponse } from "next/server";
import { connectDB } from "@src/lib/mongodb";
import cloudinary from "@src/lib/cloudinary";
import { getCloudinaryPublicId } from "@src/lib/utils";
import mongoose from "mongoose";
import { Author } from "@src/models/Authors";

export async function DELETE(req) {
  try {
    await connectDB();
    
    const { ids } = await res.json()

    const users = await Author.find({
      _id: { 
        $in: ids.map(id => new mongoose.Types.ObjectId(id)) 
      }
    })
    const profileImagesLinks = 
      users.map(
        u => u.image
      ).filter(image => image !== "")
    const publicIds = profileImagesLinks.map(link => getCloudinaryPublicId(link))
    
    await Promise.all([
      cloudinary.api.delete_resources(publicIds),
      Author.deleteMany({
        _id: { $in: ids }
      })
    ])

    global.io.emit("authorsDeleted", [ids]);

    const res = NextResponse.json({ ids }, { status: 201 });
    return res;
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Server error", details: error },
      { status: 500 }
    );
  }
}