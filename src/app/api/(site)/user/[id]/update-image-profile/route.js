import cloudinary from "@src/lib/cloudinary";
import { connectDB } from "@src/lib/mongodb";
import { getCloudinaryPublicId } from "@src/lib/utils";
import { Author } from "@src/models/Authors";
import { User } from "@src/models/User"
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const form = await req.formData();
    const { id } = await params

    const image = form.get("image");

    const user = await User.findById(id)
    if (!user) {
      return NextResponse.json({ error: "Utilizatorul nu a fost gasit" }, { status: 404 })
    }

    
    if (user?.profileImage) {
      let publicId = user?.profileImage?.length > 0 && getCloudinaryPublicId(user?.profileImage)
      await cloudinary.uploader.destroy("nextjs_uploads/" + publicId)
    }
    
    user.profileImage = image
    await user.save()
    await Author.findOneAndUpdate({ userId: id }, { image: image })

    global.io.emit("imageUpdated")

    return NextResponse.json({ messaage: "Poza de profil actualizata" }, { status: 201 });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Server error", details: error },
      { status: 500 }
    );
  }
}