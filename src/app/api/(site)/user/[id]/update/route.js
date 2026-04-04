import { connectDB } from "@src/lib/mongodb";
import { Author } from "@src/models/Authors";
import { User } from "@src/models/User"
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const { newData } = await req.json();
    const { id } = await params

    const updatedUser = await User.findByIdAndUpdate(id, newData, { new: true }).lean()
    if (!updatedUser) {
      return NextResponse.json({ error: "Utilizatorul nu a fost gasit" }, { status: 404 })
    }

    await Author.findOneAndUpdate({ userId: id }, { bio: newData?.bio })
    
    global.io.emit("userUpdated", updatedUser);

    return NextResponse.json({ messaage: "Poza de profil actualizata" }, { status: 201 });
  } catch (error) {
    console.log("EROARE: ", error)
    return NextResponse.json(
      { error: "Server error", details: error },
      { status: 500 }
    );
  }
}