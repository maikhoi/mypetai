import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import LinkClick from "@/models/LinkClick";

// Run on the edge = faster startup, no cold starts
export const runtime = "edge";

// force-dynamic to avoid caching
export const dynamic = "force-dynamic";

export async function POST(req: Request, context: any) {
  try {
    // --- Read request body immediately ---
    const data = await req.json();

    // Prepare the record (no DB yet)
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

    // --- 💡 Execute DB logging in background ---
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

    // Respond instantly (0–10ms)
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("❌ LinkClick top-level error:", err);
    return NextResponse.json({ success: false, error: err.message });
  }
}
