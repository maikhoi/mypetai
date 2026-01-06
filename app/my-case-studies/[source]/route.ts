// app/khoi-case-studies/[source]/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request, context: any) {
  const source = context?.params?.source ?? "unknown";
  const origin = new URL(req.url).origin;

  // optional: log (await to ensure it actually fires)
  try {
    await fetch(`${origin}/api/link-click`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({
        source,
        timestamp: Date.now(),
        referer: req.headers.get("referer") || "",
        userAgent: req.headers.get("user-agent") || "",
        path: new URL(req.url).pathname,
      }),
    });
  } catch {}

  return NextResponse.redirect(
    new URL(`/case-studies?utm_source=${encodeURIComponent(source)}`, origin),
    302
  );
}