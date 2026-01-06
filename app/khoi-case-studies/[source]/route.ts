// app/khoi-case-studies/[source]/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";          // keep it on Node (easy DB/logging)
export const dynamic = "force-dynamic";   // ensure it runs every request

export async function GET(
  req: Request,
  { params }: { params: { source: string } }
) {
  const { source } = params;

  const origin = new URL(req.url).origin;
  const referer = req.headers.get("referer") || "";
  const userAgent = req.headers.get("user-agent") || "";
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "";

  // ✅ IMPORTANT: await so it actually completes before redirecting
  try {
    await fetch(`${origin}/api/link-click`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // no caching
      cache: "no-store",
      body: JSON.stringify({
        source,
        referer,
        userAgent,
        ip,
        timestamp: Date.now(),
        path: new URL(req.url).pathname,
      }),
    });
  } catch (e) {
    // don’t block redirect if logging fails
  }

  // redirect to your real case study page
  return NextResponse.redirect(
    new URL(`/case-studies?utm_source=${encodeURIComponent(source)}`, origin),
    { status: 302 }
  );
}