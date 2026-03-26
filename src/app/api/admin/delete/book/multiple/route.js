import { NextResponse } from "next/server";
import { connectDB } from "@src/lib/mongodb";
import { Book } from "@src/models/Book";
import cloudinary from "@src/lib/cloudinary";
import { StarReview } from "@src/models/StarReview";
import { getCloudinaryPublicId } from "@src/lib/utils";

export async function DELETE(req) {
  try {
    await connectDB();
    
    const { ids } = await res.json()

    const books = Book.find({
      _id: { $in: ids }
    })
    books.forEach(async b => {
      const publicId = getCloudinaryPublicId(b.image)
      await cloudinary.uploader.destroy(publicId)
    })

    await Book.deleteMany({
      _id: { $in: ids }
    })

    global.io.emit("booksDeleted", ids)

    const res = NextResponse.json({ status: 201 });
    return res;
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Server error", details: error },
      { status: 500 }
    );
  }
}