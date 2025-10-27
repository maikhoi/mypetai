import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { dbConnect } from "@/lib/mongoose";
import User from "@/models/User";
 

const JWT_SECRET = process.env.JWT_SECRET || "mypetai-secret-key";
const COOKIE_NAME = process.env.ADMIN_SESSION_COOKIE || "admin_session";

export async function POST(req: Request) {
  const { username, password, rememberMe } = await req.json();

  await dbConnect();
  const user = await User.findOne({ username });
  if (!user) {
    return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
  }

  user.lastLogin = new Date();
  await user.save();

  // 🧩 Token lifespan
  const expiresIn = rememberMe ? "30d" : "1d"; // 30 days or 1 day
  const token = jwt.sign({ username: user.username, role: user.role }, JWT_SECRET, { expiresIn });

  const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24; // cookie expiry

  const res = NextResponse.json({ success: true, username: user.username });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });
  console.log("✅ Logged in, cookie should be set");

  return res;
}

export async function DELETE() {
  // ✅ Clear cookie by setting empty value + immediate expiration
  const res = NextResponse.json({ success: true, message: "Logged out" });
  res.cookies.set(COOKIE_NAME, "", {
    path: "/",
    expires: new Date(0),
    httpOnly: true,
    sameSite: "lax",          // match what you used on login
  });
  return res;
}
