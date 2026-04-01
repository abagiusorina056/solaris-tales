import "server-only"
import { connectDB } from "@src/lib/mongodb";
import { User } from "@src/models/User";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(req, { params }) {
  try {
    await connectDB()

    const { id } = await params

    const user = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id)
        }
      }, 
      {
        $lookup: {
          from: 'books', 
          localField: 'favorites', 
          foreignField: '_id', 
          as: 'favoriteBooks'
        }
      }, 
      {
        $lookup: {
          from: 'notifications', 
          localField: '_id', 
          foreignField: 'recipientId', 
          as: 'notifications'
        }
      },
      {
        $unwind: {
          path: "$notifications",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "users",
          let: { sender_id: "$notifications.senderId" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$sender_id"] } } },
            { $project: { firstName: 1, lastName: 1, profileImage: 1 } }
          ],
          as: "notifications.sender"
        }
      },
      {
        $unwind: {
          path: "$notifications.sender",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: "$_id",
          firstName: { $first: "$firstName" },
          lastName: { $first: "$lastName" },
          profileImage: { $first: "$profileImage" },
          role: { $first: "$role" },
          
          favoriteBooks: { $first: "$favoriteBooks" },
          bagBooks: { $first: "$bagBooks" },
          allOrders: { $first: "$allOrders" },
          authorProfile: { $first: "$authorProfile" },
          authoredBooks: { $first: "$authoredBooks" },

          notifications: { $push: "$notifications" }
        }
      },
      {
        $addFields: {
          notifications: {
            $filter: {
              input: "$notifications",
              as: "n",
              cond: { $gt: [{ $size: { $objectToArray: "$$n" } }, 0] }
            }
          }
        }
      },
      {
        $lookup: {
          from: 'books', 
          localField: 'bagProducts.productId', 
          foreignField: '_id', 
          as: 'bagBooks'
        }
      },
      {
        $lookup: {
          from: 'orders', 
          localField: 'orders', 
          foreignField: '_id', 
          as: 'allOrders'
        }
      },
      {
        $lookup: {
          from: "authors",
          localField: "_id",
          foreignField: "userId",
          as: "authorProfile"
        }
      },
      {
        $unwind: {
          path: "$authorProfile",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "books",
          localField: "authorProfile._id",
          foreignField: "authorId",
          as: "authoredBooks"
        }
      },
    ])
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return Response.json({
      user: user[0],
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Server error", details: error },
      { status: 500 }
    );
  }
}