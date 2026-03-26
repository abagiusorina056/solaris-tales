import { cookies } from "next/headers"
import { connectDB } from "@src/lib/mongodb"
import { User } from "@src/models/User"

export function adminHandler(handler) {
  return async function (req, context) {
    try {
      await connectDB()

      const cookieStore = cookies()
      const userId = cookieStore.get("userId")?.value

      if (!userId) {
        return Response.json({ error: "Unauthorized" }, { status: 401 })
      }

      const user = await User.findById(userId)

      if (!user || user.role !== "admin") {
        return Response.json({ error: "Forbidden" }, { status: 403 })
      }

      return handler(req, context, user)

    } catch (err) {
      console.error(err)
      return Response.json({ error: "Server error" }, { status: 500 })
    }
  }
}