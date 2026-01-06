// app/khoi-case-studies/[source]/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request, context: { params: { source: string } }) {
  const { source } = context.params;

  const origin = new URL(req.url).origin;

  // (optional) log to your API
  try {
    await fetch(`${origin}/api/link-click`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({ source, timestamp: Date.now() }),
    });
  } catch {}

  return NextResponse.redirect(
    new URL(`/case-studies?utm_source=${encodeURIComponent(source)}`, origin),
    302
  );
}