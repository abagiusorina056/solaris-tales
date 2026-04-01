import "server-only"; 
import { cookies } from "next/headers";
import { User } from "@src/models/User";
import mongoose from "mongoose";
import { connectDB } from "./mongodb";

export async function getInitialUser() {
  await connectDB()

  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  if (!userId) return null;

  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "books",
        localField: "favorites",
        foreignField: "_id",
        as: "favoriteBooks",
      },
    },
    {
      $lookup: {
        from: "notifications",
        localField: "_id",
        foreignField: "recipientId",
        as: "notifications",
      },
    },
    {
      $lookup: {
        from: "books",
        localField: "bagProducts.productId",
        foreignField: "_id",
        as: "bagBooks",
      },
    },
    {
      $lookup: {
        from: "orders",
        localField: "orders",
        foreignField: "_id",
        as: "allOrders",
      },
    },
    {
      $lookup: {
        from: "authors",
        localField: "_id",
        foreignField: "userId",
        as: "authorProfile",
      },
    },
    {
      $unwind: {
        path: "$authorProfile",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "books",
        localField: "authorProfile._id",
        foreignField: "authorId",
        as: "authoredBooks",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "notifications.senderId",
        foreignField: "_id",
        pipeline: [
          { $project: { firstName: 1, lastName: 1, profileImage: 1 } },
        ],
        as: "notificationSenders",
      },
    },
    {
      $addFields: {
        notifications: {
          $map: {
            input: "$notifications",
            as: "n",
            in: {
              $mergeObjects: [
                "$$n",
                {
                  sender: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$notificationSenders",
                          as: "s",
                          cond: { $eq: ["$$s._id", "$$n.senderId"] },
                        },
                      },
                      0,
                    ],
                  },
                },
              ],
            },
          },
        },
      },
    },
    {
      $project: {
        notificationSenders: 0,
      },
    },
  ]);

  return JSON.parse(JSON.stringify(user[0])); // Clean for hydration
}