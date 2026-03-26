import { NextResponse } from "next/server";
import { connectDB } from "@src/lib/mongodb";
import { StarReview } from "@src/models/StarReview";

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    
    const { id } = await params

    const review = await StarReview.findByIdAndDelete(id);
    if (!review) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    global.io.emit("reviewsDeleted", [id])

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