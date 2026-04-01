import { connectDB } from "@src/lib/mongodb";
import { User } from "@src/models/User";

export async function GET(req) {
  try {
    await connectDB();

    const adminData = await User.aggregate([
      {
        $match: { role: "admin" }
      },
      {
        $lookup: {
          from: 'notifications',
          let: { admin_id: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$recipientId", "$$admin_id"] } } },
            { $sort: { createdAt: -1 } },
            {
              $lookup: {
                from: "users",
                localField: "senderId",
                foreignField: "_id",
                pipeline: [
                  { $project: { firstName: 1, lastName: 1, profileImage: 1 } }
                ],
                as: "sender"
              }
            },
            { $unwind: { path: "$sender", preserveNullAndEmptyArrays: true } }
          ],
          as: 'notifications'
        }
      }
    ]);

    if (!adminData || adminData.length === 0) {
      return Response.json({ error: "Admin not found" }, { status: 404 });
    }

    return Response.json({ admin: adminData[0] });

  } catch (err) {
    console.error("Aggregation error:", err);
    return Response.json({ error: "Server error", details: err.message }, { status: 500 });
  }
}