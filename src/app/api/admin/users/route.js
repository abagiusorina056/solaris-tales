import { ensureAdmin } from "@src/lib/auth-server";
import { connectDB } from "@src/lib/mongodb"
import { User } from "@src/models/User"

export async function GET(req) {
  await connectDB()

  const adminEnsurance = await ensureAdmin();
  if (!adminEnsurance) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url)

  const search = searchParams.get("search") || ""
  const page = Number(searchParams.get("page") || 1)
  const pageSize = Number(searchParams.get("pageSize") || 10)

  const skip = (page - 1) * pageSize

  const query = search
    ? {
        $or: [
          { firstName: { $regex: search, $options: "i" } },
          { lastName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }
    : {}

  const users = await User.find(query)
    .skip(skip)
    .limit(pageSize)

  const total = await User.countDocuments(query)

  return Response.json({
    users,
    total
  })
}