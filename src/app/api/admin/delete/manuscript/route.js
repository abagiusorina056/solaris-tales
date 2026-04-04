import { ensureAdmin } from "@src/lib/auth-server";
import cloudinary from "@src/lib/cloudinary";
import { connectDB } from "@src/lib/mongodb";
import { PublishRequest } from "@src/models/PublishRequest";

export async function PUT(req) {
  try {
    await connectDB();

    const adminEnsurance = await ensureAdmin();
    if (!adminEnsurance) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { requestId, publicId } = await req.json();
    const request = await PublishRequest.findByIdAndUpdate(requestId, { pdfDocument: "" }, { new: true })
    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    await cloudinary.uploader.destroy(publicId);

    global.io.emit("manuscriptDeleted");

    const res = NextResponse.json({ request }, { status: 200 });
    return res;
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Server error", details: error },
      { status: 500 }
    );
  }
}