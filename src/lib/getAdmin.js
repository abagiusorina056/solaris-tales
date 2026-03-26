import { User } from "@src/models/User"
import { unstable_cache } from "next/cache"
import { connectDB } from "./mongodb"

export const getAdmin = unstable_cache(
  
  async () => {
    await connectDB()
    
    return User.findOne({ role: "admin" })
  },
  ["admin"],
  { revalidate: 3600 }
)