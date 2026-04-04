import { NextResponse } from "next/server";
import { connectDB } from "@src/lib/mongodb";
import { User } from "@src/models/User";
import { Book } from "@src/models/Book"
import { Notification } from "@src/models/Notification";
import { Author } from "@src/models/Authors";
import { ensureAdmin } from "@src/lib/auth-server";

export async function POST(req) {
  try {
    await connectDB();
    
    const adminEnsurance = await ensureAdmin();
    if (!adminEnsurance) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const {
      title,
      author,
      authorId,
      description,
      image,
      bookFragments,
      price,
      releaseDate,
      genre
    } = await req.json()

    const authorDoc = await Author.findById(authorId)
    if (!authorDoc) {
      return NextResponse.json({ error: "Autorul nu a fost gasit" }, { status: 404 })
    }

    const book = await Book.create({
      title,
      author,
      authorId,
      description,
      image,
      bookFragments,
      price,
      releaseDate,
      genre
    })

    if (authorDoc?.userId) {
      const adminId = await User.find({ role: "admin" }).distinct("_id");
      const newNotification = await Notification.create({
        senderId: adminId[0],
        recipientId: authorDoc?.userId,
        type: "system",
        subject: "Carte noua",
        content: "O carte noua a fost adaugata in colectia ta",
        referenceLink: `/carte/${book.id}`
      })
  
      global.io.emit("newNotification", newNotification)
    }


    const res = NextResponse.json({ book }, { status: 201 });
    return res;
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Server error", details: error },
      { status: 500 }
    );
  }
}