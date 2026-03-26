import { NextResponse } from "next/server";
import { connectDB } from "@src/lib/mongodb";
import { Book } from "@src/models/Book"
import cloudinary from "@src/lib/cloudinary";

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    
    const { id } = await params

    const book = Book.findById(id)
    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    const publicId = getCloudinaryPublicId(book.image)
    await cloudinary.uploader.destroy(publicId)

    await Book.findByIdAndDelete(id);

    global.io.emit("booksDeleted", [id])

    const res = NextResponse.json({ book }, { status: 200 });
    return res;
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Server error", details: error },
      { status: 500 }
    );
  }
}