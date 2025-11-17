import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import LinkClick from "@/models/LinkClick";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { source, timestamp } = await req.json();

    await LinkClick.create({
      source,
      timestamp,
      userAgent: req.headers.get("user-agent") || "",
      ip: req.headers.get("x-forwarded-for") || "",
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Click logging failed:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
