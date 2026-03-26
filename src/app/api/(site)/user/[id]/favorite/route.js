import { connectDB } from "@src/lib/mongodb";
import { Book } from "@src/models/Book";
import { User } from "@src/models/User";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const { bookId, action } = await req.json();

    const bookObjectId = new mongoose.Types.ObjectId(bookId);

    let updatedUser;
    if (action === "like") {
      updatedUser = await User.findByIdAndUpdate(
        id,
        { $addToSet: { favorites: bookObjectId._id } }, 
        { new: true }
      ).lean();
    } else {
      updatedUser = await User.findByIdAndUpdate(
        id,
        { $pull: { favorites: bookObjectId._id } },
        { new: true }
      ).lean();
    }

    if (!updatedUser) {
      return NextResponse.json({ error: "Utilizatorul nu a fost gasit" }, { status: 404 });
    }

    const favorites = await Book.find({ _id: { $in: updatedUser.favorites } }).lean();

    global.io.emit("favorite", { favorites, bookId });

    return NextResponse.json({ message: "Favorite actualizate" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    );
  }
}