import { NextResponse } from "next/server";
import { connectDB } from "@src/lib/mongodb";
import { User } from "@src/models/User";
const bcrypt = require('bcrypt');

export async function POST(req) {
  try {
    await connectDB();
    
    const { email, password, rememberMe } = await req.json()
    const user = await User.findOne({ email });
    console.log(user)
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: "404"})
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch, password, user.password)

    if (!user || !isMatch) {
      return NextResponse.json(
        { error: "Credentiale gresite" },
        { status: 400 }
      );
    }

    const res = NextResponse.json({ user }, { status: 201 });

    const cookieOptions = {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      ...(rememberMe && { maxAge: 60 * 60 * 24 * 30 }), // 30 days
    };

    res.cookies.set("user_id", user._id.toString(), cookieOptions);
    res.cookies.set("role", user.role, cookieOptions);

    return res;
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Server error", details: error },
      { status: 500 }
    );
  }
}