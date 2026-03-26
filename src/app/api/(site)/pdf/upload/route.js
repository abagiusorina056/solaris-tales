import cloudinary from "@src/lib/cloudinary";

export async function POST(req) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return Response.json({ error: "Only PDFs allowed" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "nextjs_uploads",
          resource_type: "raw",
          type: "upload",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      stream.end(buffer);
    });

    return Response.json({ url: result.secure_url });

  } catch (err) {
    console.error("Cloudinary PDF error:", err);
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}