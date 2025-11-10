import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { UserProfileModel } from "@/models/UserProfile";

import { dbConnect } from "@/lib/mongoose";
import { SignJWT } from "jose";

// 🔐 JWT secret and helper
const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!);

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    if (!username || !password)
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });

    // 1️⃣ Mongoose connection
    await dbConnect();

    //const user = await UserProfileModel.findOne({ email: username });//WRONG , find from UserProfile 
    const UserProfile = await UserProfileModel();
    const user = await UserProfile.findOne({ email: String(username) });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid)
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });

    // ✅ Update last login
    user.lastLogin = new Date();
    await user.save();

    // ✅ Create JWT for frontend use
    const token = await new SignJWT({
      sub: user._id.toString(),
      username: user.username,
      role: user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(JWT_SECRET);

    // ✅ Set cookie for 7 days
    const res = NextResponse.json({ success: true });
    res.cookies.set({
      name: "mypetai_token",
      value: token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err: any) {
    console.error("⚠️ Login error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
