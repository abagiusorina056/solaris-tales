import { NextResponse } from "next/server";
import { connectDB } from "@src/lib/mongodb";
import { PublishRequest } from "@src/models/PublishRequest";

export async function PATCH(req) {
  try {
    await connectDB();
    
    const { requestId, newStatus } = await req.json()

    const updatedRequest = await PublishRequest.findByIdAndUpdate(requestId, { status: newStatus }, { new: true })
    if (!updatedRequest) {
      return NextResponse.json({ error: "Cererea nu a fost gasita" }, { status: 404 })
    }

    global.io.emit("requestUpdated", { requestId, newStatus });

    const res = NextResponse.json({ updatedRequest }, { status: 200 });
    return res;
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Server error", details: error },
      { status: 500 }
    );
  }
}