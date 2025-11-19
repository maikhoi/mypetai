import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const pathname = url.pathname;

  // Only apply to /chat pages
  if (!pathname.endsWith("/chat")) {
    return NextResponse.next();
  }

  const messageId = url.searchParams.get("messageId");

  // The ONLY messageId that should trigger OG override
  const targetId = "69117b3b13bba5e70e9d7bee";

  // If messageId does not match → return normal page
  if (messageId !== targetId) {
    return NextResponse.next();
  }

  // Build OG image URL for this specific message
  const ogImageUrl = `https://www.mypetai.app/api/og/chat?messageId=${messageId}`;

  // Example OG title + description
  const ogTitle = `Message ${messageId}`;
  const ogDescription = `OG preview for message ${messageId}`;

  // Build simple HTML that shows OG tags
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="og:title" content="${ogTitle}" />
        <meta property="og:description" content="${ogDescription}" />
        <meta property="og:image" content="${ogImageUrl}" />        
        <meta property="og:url" content="${url.toString()}" />
      </head>
      <body style="padding:20px;font-family:Arial;">
        <h1>OG Tags Preview (Matched Target ID)</h1>
        <p><strong>Matched messageId:</strong> ${messageId}</p>

        <h2>Generated OG Tags:</h2>
        <pre>
&lt;meta property="og:title" content="${ogTitle}" /&gt;
&lt;meta property="og:description" content="${ogDescription}" /&gt;
&lt;meta property="og:image" content="${ogImageUrl}" /&gt;
&lt;meta property="og:url" content="${url.toString()}" /&gt;
        </pre>

        <h2>Image Preview:</h2>
        <img src="${ogImageUrl}" width="400" />
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
