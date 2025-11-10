// app/api/account/set-password/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserProfileModel } from "@/models/UserProfile";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { password } = await req.json();
  if (!password || password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  const UserProfile = await UserProfileModel();
  const prof = await UserProfile.findOne({ userId: String(session.user.id) });
  if (!prof) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  prof.passwordHash = await bcrypt.hash(password, 12);
  await prof.save();

  return NextResponse.json({ ok: true });
}
