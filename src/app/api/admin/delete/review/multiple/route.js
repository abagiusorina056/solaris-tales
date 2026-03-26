import { NextResponse } from "next/server";
import { connectDB } from "@src/lib/mongodb";
import { StarReview } from "@src/models/StarReview";

export async function DELETE(req) {
  try {
    await connectDB();
    
    const { ids } = await res.json()

    const review = await StarReview.deleteMany({
      _id: { $in: ids }
    })

    global.io.emit("reviewsDeleted", ids)

    const res = NextResponse.json({ review }, { status: 201 });
    return res;
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Server error", details: error },
      { status: 500 }
    );
  }
}