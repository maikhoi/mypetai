import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const pathname = url.pathname;

  // Only chat pages
  if (!pathname.endsWith("/chat")) {
    return NextResponse.next();
  }

  // Detect bots (only these need OG tag rewrite)
  const ua = req.headers.get("user-agent") || "";
  const isBot =
    ua.includes("facebookexternalhit") ||
    ua.includes("Twitterbot") ||
    ua.includes("Slackbot") ||
    ua.includes("LinkedInBot") ||
    ua.includes("WhatsApp");

  if (!isBot) {
    return NextResponse.next();
  }

  // Use existing OG route — no DB needed
  const messageId = url.searchParams.get("messageId") || "";
  const ogImageUrl = `https://www.mypetai.app/api/og/chat?messageId=${messageId}`;

  // Fetch original HTML
  return fetch(url.toString())
    .then((res) => res.text())
    .then((html) => {
      // Replace only OG:image — keep everything else intact
      html = html.replace(
        /<meta property="og:image"[^>]*>/,
        `<meta property="og:image" content="${ogImageUrl}">`
      );

      return new NextResponse(html, {
        headers: { "Content-Type": "text/html" },
      });
    });
}

export const config = {
  matcher: ["/community/:topic/chat"],
};
