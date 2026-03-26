import { NextResponse } from "next/server";
import { connectDB } from "@src/lib/mongodb";
import { User } from "@src/models/User";
import { Book } from "@src/models/Book"

export async function POST(req) {
  try {
    await connectDB();
    
    const {
      title,
      author,
      authorId,
      description,
      image,
      bookFragments,
      price,
      releaseDate
    } = await req.json()

    const book = await Book.create({
      title,
      author,
      authorId,
      description,
      image,
      bookFragments,
      price,
      releaseDate
    })

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