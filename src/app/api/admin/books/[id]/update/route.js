import { connectDB } from "@src/lib/mongodb";
import { Book } from "@src/models/Book";
import { User } from "@src/models/User"
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const { id } = await params
    const { bookData } = await req.json();

    const updatedBook = await Book.findByIdAndUpdate(id, bookData, { new: true })
    if (!updatedBook) {
      return NextResponse.json({ error: "Cartea nu a fost gasita" }, { status: 404 })
    }
    
    global.io.emit("bookUpdated", updatedBook);

    return NextResponse.json({ message: "Cartea a fost actualizata cu succes" }, { status: 201 });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Server error", details: error },
      { status: 500 }
    );
  }
}