import { NextResponse } from "next/server";
import { connectDB } from "@src/lib/mongodb";
import { Author } from "@src/models/Authors";
import { User } from "@src/models/User";
import cloudinary from "@src/lib/cloudinary";

export async function POST(req) {
  try {
    await connectDB();
    
    const formData = await req.formData();

    const userId = formData.get("userId");
    const isClassicAuthor = formData.get("isClassicAuthor") === "true";
    let name = formData.get("name");
    let bio = formData.get("bio");
    const file = formData.get("image");

    let image = "";

    if (!isClassicAuthor) {
      const user = await User.findByIdAndUpdate(
        userId,
        { role: "author" },
        { new: true }
      );

      if (!user) {
        return NextResponse.json(
          { error: "Utilizatorul nu a fost gasit" },
          { status: 404 }
        );
      }

      name = `${user.firstName} ${user.lastName}`;
      bio = user.bio || "";
      image = user.profileImage || "";
    } else if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });
      image = result.secure_url;
    }

    const lastAuthor = await Author
      .findOne({ slug: { $regex: /^AUTH-/ } })
      .sort({ _id: -1 });

    let slugNumber = 1;

    if (lastAuthor) {
      slugNumber = parseInt(lastAuthor.slug.split("-")[1]) + 1;
    }

    const slug = `AUTH-${slugNumber}`;

    const newAuthor = await Author.create({
      name,
      slug,
      bio,
      image,
      userId: userId || null
    });

    global.io.emit("newAuthorCreated", newAuthor);

    const res = NextResponse.json({ newAuthor }, { status: 200 });
    return res;
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Server error", details: error },
      { status: 500 }
    );
  }
}