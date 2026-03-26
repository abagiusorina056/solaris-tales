import { NextResponse } from "next/server";
import { connectDB } from "@src/lib/mongodb";
import cloudinary from "@src/lib/cloudinary";
import { getCloudinaryPublicId } from "@src/lib/utils";
import { Author } from "@src/models/Authors";

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    
    const { id } = await params

    const author = await Author.findById(id)
    if (!author) {
      return NextResponse.json({ error: "Autorul nu a fost gasit" }, { status: 404 })
    }

    let publicId = author?.image.length > 0 && getCloudinaryPublicId(author?.image)

    const promises = [
      publicId && cloudinary.uploader.destroy(publicId),
      author.deleteOne(),
    ].filter(Boolean)

    await Promise.all(promises)
    global.io.emit("authorsDeleted", [id]);

    const res = NextResponse.json({ author }, { status: 200 });
    return res;
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Server error", details: error },
      { status: 500 }
    );
  }
}