import { connectDB } from "@src/lib/mongodb"
import { Author } from "@src/models/Authors"
import mongoose from "mongoose"

export async function GET(req, { params }) {
  await connectDB()

  const { id } = await params
    
  const author = await Author.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id) } },

    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user"
      }
    },
  ])

  if (!author) {
    return new Response(JSON.stringify({ error: "Author not found" }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return Response.json({
    authors: author[0] || null,
    // total: author[0]?.books[0]?.total || 0
  })
}