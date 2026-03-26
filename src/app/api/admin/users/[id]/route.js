import { connectDB } from "@src/lib/mongodb"
import { User } from "@src/models/User"
import mongoose from "mongoose"

export async function GET(req, { params }) {
  await connectDB()

  const { id } = await params
    
  const user = await User.findById(id)

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return Response.json({
    users: user || null,
    // total: author[0]?.books[0]?.total || 0
  })
}