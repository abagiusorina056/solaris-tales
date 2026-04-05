import { NextResponse } from "next/server";
import { connectDB } from "@src/lib/mongodb";
import { Book } from "@src/models/Book"
import cloudinary from "@src/lib/cloudinary";
import { Author } from "@src/models/Authors";
import { User } from "@src/models/User";
import { ensureAdmin } from "@src/lib/auth-server";

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const adminEnsurance = await ensureAdmin();
    if (!adminEnsurance) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    const { id } = await params

    const book = Book.findById(id)
    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    const publicId = getCloudinaryPublicId(book.image)
    await cloudinary.uploader.destroy("nextjs_uploads/" + publicId)

    await Book.findByIdAndDelete(id);

    global.io.emit("booksDeleted", [id])

    const author = await Author.findById(book.authorId)

    if (author?.userId) {
      const adminId = await User.find({ role: "admin" }).distinct("_id");
      const newNotification = await Notification.create({
        senderId: adminId[0],
        recipientId: author?.userId,
        type: "system",
        subject: "Carte stearsa",
        content: `Cartea ta, ${book.title}, a fost stearsa de catre admin`,
      })
  
      global.io.emit("newNotification", newNotification)
    }

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