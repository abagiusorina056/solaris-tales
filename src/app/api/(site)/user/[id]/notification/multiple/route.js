import { connectDB } from "@src/lib/mongodb";
import { Notification } from "@src/models/Notification";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const notifications = await Notification.updateMany(
      { 
        recipientId: id, 
        isRead: false
      },
      { 
        $set: { isRead: true } 
      }
    );

    if (notifications.matchedCount === 0) {
      return NextResponse.json({ message: "No unread notifications found" }, { status: 200 });
    }

    global.io.emit("notificationsRead");

    return NextResponse.json({ 
      success: true, 
      modifiedCount: notifications.modifiedCount 
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}