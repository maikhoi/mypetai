import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/userAuth";

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ loggedIn: false }, { status: 401 });
  return NextResponse.json({ loggedIn: true, admin });
}
