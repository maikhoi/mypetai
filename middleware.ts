import { NextResponse, NextRequest } from "next/server";

export const config = {
  matcher: ["/community/:topic/chat"],
};

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const messageId = url.searchParams.get("messageId");

  // If there's no messageId, continue normally
  if (!messageId) {
    return NextResponse.next();
  }

  // Build OG preview URL
  const ogUrl = `https://www.mypetai.app/api/og/chat?messageId=${messageId}`;
  const canonical = url.toString();

  // HTML that Facebook/Twitter will read (SSR HTML only)
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta property="og:title" content="MyPetAI Chat Message" />
  <meta property="og:description" content="View chat message on MyPetAI" />
  <meta property="og:image" content="${ogUrl}" />
  <meta property="og:url" content="${canonical}" />
  <link rel="canonical" href="${canonical}" />
</head>
<body>
  Redirecting...
  <script>window.location.href = "${canonical}";</script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}
