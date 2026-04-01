import { NextResponse } from "next/server";
import { connectDB } from "@src/lib/mongodb";
import { Book } from "@src/models/Book";
import cloudinary from "@src/lib/cloudinary";
import { StarReview } from "@src/models/StarReview";
import { getCloudinaryPublicId } from "@src/lib/utils";
import { Author } from "@src/models/Authors";
import { User } from "@src/models/User";
import { Notification } from "@src/models/Notification";

export async function DELETE(req) {
  try {
    await connectDB();
    
    const { ids } = await res.json()

    const books = Book.find({
      _id: { $in: ids }
    })
    if (books.length === 0) {
      return NextResponse.json({ error: "Nicio carte nu a fost gasita" }, { status: 404 });
    }

    books.forEach(async b => {
      const publicId = getCloudinaryPublicId(b.image)
      await cloudinary.uploader.destroy(publicId)
    })

    await Book.deleteMany({
      _id: { $in: ids }
    })

    global.io.emit("booksDeleted", ids)

    const authorMap = books.reduce((acc, book) => {
      if (!acc[book.authorId]) acc[book.authorId] = [];
      acc[book.authorId].push(book.title);

      return acc;
    }, {});

    const adminId = await User.find({ role: "admin" }).distinct("_id");

    for (const authorId in authorMap) {
      const author = await Author.findById(authorId);

      if (author?.userId) {
        const bookTitles = authorMap[authorId];
        const count = bookTitles.length;
        
        const content = count === 1 
          ? `Cartea ta, ${bookTitles[0]}, a fost stearsa de catre admin.`
          : `Unele carti din colectia ta au fost sterse de catre admin.`;

        const newNotification = await Notification.create({
          senderId: adminId,
          recipientId: author.userId,
          type: "system",
          subject: count === 1 ? "Carte stearsa" : "Carti sterse",
          content: content,
        });

        global.io.emit("newNotification", newNotification);
      }
    }

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