import { connectDB } from "@src/lib/mongodb";
import { Book } from "@src/models/Book";
import mongoose from "mongoose";

export async function GET(request, { params }) {
  await connectDB()

  const { id } = await params

  const book = await Book.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
    {
      $lookup: {
        from: 'starreviews', 
        localField: '_id', 
        foreignField: 'bookId', 
        as: 'reviews'
      }
    },
    {
      $lookup: {
        from: 'authors', 
        localField: 'authorId', 
        foreignField: '_id', 
        as: 'author'
      }
    },
    {
      $unwind: {
        path: "$author",
      }
    },
  ])

  if (!book) {
    return new Response(JSON.stringify({ error: "Book not found" }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return Response.json({ books: book[0] })
}