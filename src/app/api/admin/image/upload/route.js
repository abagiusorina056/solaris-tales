import { ensureAdmin } from "@src/lib/auth-server";
import cloudinary from "@src/lib/cloudinary";

export async function POST(req) {
  try {
    const adminEnsurance = await ensureAdmin();
    if (!adminEnsurance) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const form = await req.formData();
    const img = form.get("file");

    if (!img) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await img.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const uploadStr = `data:${img.type};base64,${base64}`;

    const result = await cloudinary.uploader.upload(uploadStr, {
      folder: "nextjs_uploads",
      resource_type: "auto",
      type: "upload",
      access_mode: "public"
    });

    return Response.json({ url: result.secure_url });
  } catch (err) {
    console.error("Cloudinary error:", err);
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}
