import { ensureAdmin } from "@src/lib/auth-server";
import cloudinary from "@src/lib/cloudinary";
import { connectDB } from "@src/lib/mongodb";
import { getCloudinaryPublicId } from "@src/lib/utils";
import { Author } from "@src/models/Authors";
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

    const updatedAuthor = await Author.findByIdAndUpdate(
      id, 
      { image: "" },
      { new: true }
    )
    if (!updatedAuthor) {
      return NextResponse.json({ error: "Autorul nu a fost gasit" }, { status: 404 })
    }

    let publicId = image?.length > 0 && getCloudinaryPublicId(image)
    await cloudinary.uploader.destroy("nextjs_uploads/" + publicId)

    if (updatedAuthor?.userId) {
      await User.findByIdAndUpdate(updatedAuthor?.userId, { profileImage: "" })
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