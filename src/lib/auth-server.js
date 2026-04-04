import "server-only";
import { cookies } from "next/headers";
import { User } from "@src/models/User";

export async function ensureAdmin() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  if (!userId) return null;

  const user = await User.findById(userId).select("role");

  if (!user || user.role !== "admin") {
    return null;
  }

  return user;
}