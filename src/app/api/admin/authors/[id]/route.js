import { ensureAdmin } from "@src/lib/auth-server";
import { connectDB } from "@src/lib/mongodb"
import { Author } from "@src/models/Authors"
import mongoose from "mongoose"

export async function GET(req, { params }) {
  await connectDB()

  const adminEnsurance = await ensureAdmin();
  if (!adminEnsurance) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

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
  })
}