import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import LinkClick from "@/models/LinkClick";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    await dbConnect();
    
    const data = await req.json();
    const timestamp = new Date(data.timestamp || Date.now());

    const record = await LinkClick.create({
      type: data.type || "unknown",
      source: data.source || null,
      productUrl: data.productUrl || null,
      encodedUrl: data.encodedUrl || null,
      storeName: data.storeName || null,
      path: data.path || null,
      fullUrl: data.fullUrl || null,
      query: data.query || null,
      targetUrl: data.targetUrl || null,
      userAgent: req.headers.get("user-agent") || null,
      timestamp,
    });

    return NextResponse.json({ success: true, record });
  } catch (err: any) {
    console.error("❌ LinkClick error:", err);
    return NextResponse.json({ success: false, error: err.message });
  }
}
