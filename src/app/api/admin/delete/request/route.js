import { NextResponse } from "next/server";
import { connectDB } from "@src/lib/mongodb";
import { PublishRequest } from "@src/models/PublishRequest";
import { ensureAdmin } from "@src/lib/auth-server";

export async function DELETE(req) {
  try {
    await connectDB();

    const adminEnsurance = await ensureAdmin();
    if (!adminEnsurance) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
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