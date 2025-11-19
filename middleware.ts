import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const pathname = url.pathname;

  // Only target chat pages
  if (!pathname.endsWith("/chat")) {
    return NextResponse.next();
  }

  const messageId = url.searchParams.get("messageId");

  // Detect bots (kept for structure, not used)
  const ua = req.headers.get("user-agent") || "";
  const isBot =
    ua.includes("facebookexternalhit") ||
    ua.includes("Twitterbot") ||
    ua.includes("Slackbot") ||
    ua.includes("LinkedInBot") ||
    ua.includes("WhatsApp");

 // console.log("ua:", ua, "isBot:", isBot);

  // Only override for a specific message ID
  const targetId = "691f9a56d2424c38c4cd20f9";

  if (messageId !== targetId) {
    return NextResponse.next();
  }

  // 🚀 Fetch metadata from the OG route using meta=1
  const metaUrl = `https://www.mypetai.app/api/og/chat?messageId=${messageId}&meta=1`;

  const meta = await fetch(metaUrl)
    .then((r) => r.json())
    .catch(() => null);

  // Fallbacks
  const ogTitle = meta?.senderName
    ? `${meta.senderName}'s message`
    : `Message ${messageId}`;

  const ogDescription = meta?.text || "Chat message on MyPetAI";

  const ogImageUrl =
    meta?.mediaUrl ||
    `https://www.mypetai.app/api/og/chat?messageId=${messageId}`;

  const ogUrl = url.toString();

  // ⭐ Render OG preview page for bots / testing
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="og:title" content="${ogTitle}" />
        <meta property="og:description" content="${ogDescription}" />
        <meta property="og:image" content="${ogImageUrl}" />
        <meta property="og:url" content="${ogUrl}" />
      </head>
      <body style="padding:20px;font-family:Arial;">
        <h1>OG Tags Preview (Matched Target ID)</h1>
        <p><strong>messageId:</strong> ${messageId}</p>

        <h2>Generated OG Tags:</h2>
        <pre>
&lt;meta property="og:title" content="${ogTitle}" /&gt;
&lt;meta property="og:description" content="${ogDescription}" /&gt;
&lt;meta property="og:image" content="${ogImageUrl}" /&gt;
&lt;meta property="og:url" content="${ogUrl}" /&gt;
        </pre>

        <h2>Text Preview:</h2>
        <p>${ogDescription}</p>

        <h2>Image Preview:</h2>
        <img src="${ogImageUrl}" width="400" />

        <h2>>Agent:</h2>
        <p>${ua}</p>
      </body>
    </html>
  `;

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html",
    },
  });
}

export const config = {
  matcher: ["/community/:topic/chat"],
};
