import "server-only";
import { connectDB } from "@src/lib/mongodb";
import { User } from "@src/models/User";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectDB();
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;
    
    if (!userId) return NextResponse.json({ user: null }, { status: 401 });

    const userArray = await User.aggregate([
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

    if (!userArray || userArray.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: userArray[0],
    });
  } catch (error) {
    console.error("Aggregation Error:", error);
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    );
  }
}