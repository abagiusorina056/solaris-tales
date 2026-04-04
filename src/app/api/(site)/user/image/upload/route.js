import cloudinary from "@src/lib/cloudinary";

export async function POST(req) {
  try {
    const form = await req.formData();
    const img = form.get("file");

    if (!img || img.size === 0) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await img.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { 
          folder: "nextjs_uploads",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    return Response.json({ url: result.secure_url });
  } catch (err) {
    console.error("Cloudinary error:", err);
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}
