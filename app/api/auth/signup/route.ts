import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { z } from "zod";
import clientPromise from "@/lib/mongodb";
import { UserProfileModel } from "@/models/UserProfile";

const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = SignupSchema.parse(body);

    const db = (await clientPromise).db();
    const usersCol = db.collection("users");
    const UserProfile = await UserProfileModel();

    const emailLower = data.email.toLowerCase();

    // 1️⃣ Check duplicate email (NextAuth users collection)
    const existingUser = await usersCol.findOne({ email: emailLower });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

    // 2️⃣ Create minimal NextAuth user entry
    const insertRes = await usersCol.insertOne({
      name: emailLower.split("@")[0], // default display name
      email: emailLower,
      emailVerified: null,
      image: null,
    });

    const userId = String(insertRes.insertedId);

    // 3️⃣ Hash password
    const passwordHash = await bcrypt.hash(data.password, 12);

    // 4️⃣ Create linked UserProfile
    await UserProfile.create({
      userId,
      email: emailLower, // <—— FIXED LINE
      passwordHash,
      role: "user",
      lastLogin: null,
      loginCount: 0,
      isEmailVerified: false, // set true if you add email verification later
      preferences: { theme: "system", newsletter: false },
      pets: [],
    });

    // 5️⃣ Respond OK
    return NextResponse.json({ ok: true, userId }, { status: 201 });
  } catch (err: any) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { error: err?.message || "Signup failed" },
      { status: 400 }
    );
  }
}
