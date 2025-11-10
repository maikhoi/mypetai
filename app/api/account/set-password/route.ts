import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import { UserProfileModel } from "@/models/UserProfile";

// ✅ getServerSession() can be called without authOptions on App Router —
// it auto-detects the default NextAuth config in this project.
export async function POST(req: Request) {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { password } = await req.json();
  if (!password || password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 }
    );
  }

  const UserProfile = await UserProfileModel();
  const profile = await UserProfile.findOne({ email: session.user.email });

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  profile.passwordHash = await bcrypt.hash(password, 12);
  await profile.save();

  return NextResponse.json({ ok: true });
}
