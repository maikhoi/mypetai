import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import LinkClick from "@/models/LinkClick";

export const dynamic = "force-dynamic";
export const runtime = "nodejs"; // ⬅️ IMPORTANT: use Node runtime, not edge!

export async function POST(req: Request, context: any) {
  try {
    const data = await req.json();

    const payload = {
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
      timestamp: new Date(data.timestamp || Date.now()),
    };

    // Background logging (non-blocking)
    context.waitUntil(
      (async () => {
        try {
          await dbConnect();
          await LinkClick.create(payload);
        } catch (err) {
          console.error("❌ Background LinkClick DB error:", err);
        }
      })()
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("❌ LinkClick route error:", err);
    return NextResponse.json({ success: false, error: err.message });
  }
}
