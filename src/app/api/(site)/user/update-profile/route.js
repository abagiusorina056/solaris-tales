import { connectDB } from "@src/lib/mongodb";
import { User } from "@src/models/User"
import { NextResponse } from "next/server";

export async function PATCH(req) {
  try {
    await connectDB();

    const { userId, newData } = await req.json();

    const updatedUser = await User.findByIdAndUpdate(userId, newData, { new: true })
    if (!updatedUser) {
      return NextResponse.json({ error: "Utilizatorul nu a fost gasit" }, { status: 404 })
    }
    
    global.io.emit("userUpdated", updatedUser);

    return NextResponse.json({ messaage: "Poza de profil actualizata" }, { status: 201 });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Server error", details: error },
      { status: 500 }
    );
  }
}