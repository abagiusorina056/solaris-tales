import { NextResponse } from "next/server";
import { connectDB } from "@src/lib/mongodb";
import { StarReview } from "@src/models/StarReview";
import { User } from "@src/models/User";
import { Notification } from "@src/models/Notification";

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    
    const { id } = await params

    const review = await StarReview.findByIdAndDelete(id);
    if (!review) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    global.io.emit("reviewDeleted", [id])

    const adminId = await User.find({ role: "admin" }).distinct("_id");
    const newNotification = await Notification.create({
      senderId: adminId,
      recipientId: review.reviewerId,
      type: "system",
      subject: "Recenzie stearsa",
      content: "O recenzie de a ta a fost stearsa de carte admin",
    });

    global.io.emit("newNotification", newNotification);

    const res = NextResponse.json({ review }, { status: 200 });
    return res;
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Server error", details: error },
      { status: 500 }
    );
  }
}