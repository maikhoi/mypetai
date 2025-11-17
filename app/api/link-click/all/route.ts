import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import LinkClick from "@/models/LinkClick";

export async function GET() {
  await dbConnect();
  const clicks = await LinkClick.find().sort({ timestamp: -1 }).limit(2000);
  return NextResponse.json(clicks);
}
