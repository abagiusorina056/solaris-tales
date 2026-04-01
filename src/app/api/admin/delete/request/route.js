import { NextResponse } from "next/server";
import { connectDB } from "@src/lib/mongodb";
import { PublishRequest } from "@src/models/PublishRequest";
import { Notification } from "@src/models/Notification";
import { User } from "@src/models/User";

export async function DELETE(req) {
  try {
    await connectDB();
    
    const { reqId } = await req.json()

    const request = await PublishRequest.findByIdAndDelete(reqId);

    const res = NextResponse.json({ request }, { status: 201 });
    return res;
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Server error", details: error },
      { status: 500 }
    );
  }
}