import { connectDB } from "@src/lib/mongodb";
import { PublishRequest } from "@src/models/PublishRequest";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    
    const form = await req.formData();

    const userId = form.get("userId");
    const uploadedUrl = form.get("uploadedUrl");
    const data = JSON.parse(form.get("data"));

    const newPublishRequest = await PublishRequest.create({
      senderId: userId,
      phoneNumber: data.phoneNumber,
      title: data.title,
      description: data.description,
      pdfDocument: uploadedUrl
    })
    
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