import { connectDB } from "@src/lib/mongodb";
import { Notification } from "@src/models/Notification";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    await connectDB()

    const { id } = await params
    const { notificationId } = await req.json()

    const updatedNotification = await Notification.findOneAndUpdate(
      { 
        _id: notificationId, 
        recipientId: id 
      },
      { $set: { isRead: true } },
      { new: true }
    );

    if (!updatedNotification) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    global.io.emit("notificationRead")

    return NextResponse.json(updatedNotification);

  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Server error", details: error },
      { status: 500 }
    );
  }
}