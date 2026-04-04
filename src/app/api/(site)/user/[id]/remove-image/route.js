import cloudinary from "@src/lib/cloudinary";
import { connectDB } from "@src/lib/mongodb";
import { getCloudinaryPublicId } from "@src/lib/utils";
import { Author } from "@src/models/Authors";
import { User } from "@src/models/User"
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    await connectDB();

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

    await Author.findOneAndUpdate({ userId: id }, { image: "" })

    let publicId = image?.length > 0 && getCloudinaryPublicId(image)
    await cloudinary.uploader.destroy("nextjs_uploads/" + publicId)
    
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