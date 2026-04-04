import { NextResponse } from "next/server";
import { connectDB } from "@src/lib/mongodb";
import { User } from "@src/models/User";
const bcrypt = require('bcrypt');

export async function POST(req) {
  try {
    await connectDB();

    const {
      firstName,
      lastName,
      email,
      password,
      role,
      gender,
      rememberMe
    } = await req.json();

    const exists = await User.findOne({ email });
    if (exists) {
      return NextResponse.json(
        { error: "Email-ul este deja folosit" },
        { status: 400 }
      );
    }
    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashed,
      gender,
      role
    });

    const res = NextResponse.json({ user }, { status: 201 });

    const cookieOptions = {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      ...(rememberMe && { maxAge: 60 * 60 * 24 * 30 }),
    };

    res.cookies.set("user_id", user._id.toString(), cookieOptions);
    res.cookies.set("role", user.role, cookieOptions);

    return res;
  } catch (error) {
    return NextResponse.json(
      { error: "Server error", details: error },
      { status: 500 }
    );
  }
}