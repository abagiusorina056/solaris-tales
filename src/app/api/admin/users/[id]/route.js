import { ensureAdmin } from "@src/lib/auth-server";
import { connectDB } from "@src/lib/mongodb"
import { User } from "@src/models/User"

export async function GET(req, { params }) {
  await connectDB()

  const adminEnsurance = await ensureAdmin();
  if (!adminEnsurance) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

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
  })
}