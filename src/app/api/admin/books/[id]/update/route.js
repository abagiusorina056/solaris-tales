import { ensureAdmin } from "@src/lib/auth-server";
import { connectDB } from "@src/lib/mongodb";
import { Author } from "@src/models/Authors";
import { Book } from "@src/models/Book";
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
    const { bookData } = await req.json();

    const updatedBook = await Book.findByIdAndUpdate(id, bookData, { new: true })
    if (!updatedBook) {
      return NextResponse.json({ error: "Cartea nu a fost gasita" }, { status: 404 })
    }
    
    global.io.emit("bookUpdated", updatedBook);

    const author = await Author.findById(updatedBook.authorId)

    if (author?.userId) {
      const adminId = await User.find({ role: "admin" }).distinct("_id");
      const newNotification = await Notification.create({
        senderId: adminId[0],
        recipientId: author?.userId,
        type: "system",
        subject: "Carte actualizata",
        content: "Cartea ta a fost modificata de catre admin",
        referenceLink: `/carte/${updatedBook.id}`
      })
  
      global.io.emit("newNotification", newNotification)
    }

    return NextResponse.json({ message: "Cartea a fost actualizata cu succes" }, { status: 201 });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Server error", details: error },
      { status: 500 }
    );
  }
}