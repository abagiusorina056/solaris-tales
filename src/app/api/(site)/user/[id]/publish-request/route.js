import { connectDB } from "@src/lib/mongodb";
import { Notification } from "@src/models/Notification";
import { PublishRequest } from "@src/models/PublishRequest";
import { User } from "@src/models/User";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    await connectDB();
    
    const form = await req.formData();
    const { id } = await params

    const uploadedUrl = form.get("uploadedUrl");
    const data = JSON.parse(form.get("data"));

    const newPublishRequest = await PublishRequest.create({
      senderId: id,
      phoneNumber: data.phoneNumber,
      title: data.title,
      description: data.description,
      pdfDocument: uploadedUrl
    })

    const adminId = await User.find({ role: "admin" }).distinct("_id");
    const newNotification = await Notification.create({
      senderId: id,
      recipientId: adminId[0],
      type: "request",
      subject: "Cerere de publicare",
      content: "Ai primit o noua cerere de publicare de la ",
      referenceLink: `/admin/cereri`
    })

    global.io.emit("newNotification", newNotification)
    
    const res = NextResponse.json({ newPublishRequest }, { status: 201 });
    return res;
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Server error", details: error },
      { status: 500 }
    );
  }
}