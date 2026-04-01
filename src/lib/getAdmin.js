import { User } from "@src/models/User"
import { unstable_cache } from "next/cache"
import { connectDB } from "./mongodb"

export const getAdmin = unstable_cache(
  
  async () => {
    await connectDB()

    const admin = await User.aggregate([
      {
        $match: { role: "admin" }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "recipientId",
          as: "notifications"
        }
      }
    ])
    
    return admin[0]
  },
  ["admin"],
  { revalidate: 3600 }
)