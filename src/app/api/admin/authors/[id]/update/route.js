import { connectDB } from "@src/lib/mongodb";
import { Author } from "@src/models/Authors";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const { id } = await params
    const { userData } = await req.json();

    const updatedAuthor = await Author.findByIdAndUpdate(id, userData, { new: true })
    if (!updatedAuthor) {
      return NextResponse.json({ error: "Autorul nu a fost gasit" }, { status: 404 })
    }
    
    global.io.emit("authorUpdated", updatedAuthor);

    return NextResponse.json({ messaage: "Autor actualizat" }, { status: 201 });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Server error", details: error },
      { status: 500 }
    );
  }
}