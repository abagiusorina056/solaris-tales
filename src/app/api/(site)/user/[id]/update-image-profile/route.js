import { connectDB } from "@src/lib/mongodb";
import { User } from "@src/models/User"
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const form = await req.formData();
    const { id } = await params

    const image = form.get("image");

    const updatedUser = await User.findByIdAndUpdate(id, { profileImage: image })
    if (!updatedUser) {
      return NextResponse.json({ error: "Utilizatorul nu a fost gasit" }, { status: 404 })
    }

    return NextResponse.json({ messaage: "Poza de profil actualizata" }, { status: 201 });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Server error", details: error },
      { status: 500 }
    );
  }
}