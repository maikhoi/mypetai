import { NextResponse, NextRequest } from "next/server";

export const config = {
  matcher: ["/community11111111/:topic/chat"],
};

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const messageId = url.searchParams.get("messageId");

  // If no messageId → normal render
  if (!messageId) {
    return NextResponse.next();
  }

  // OG preview card URL (your OG image generator)
  const ogImageUrl = `https://www.mypetai.app/api/og/chat?messageId=${messageId}`;

  // The real page URL
  const canonical = url.toString();

  // This HTML will be returned ONLY to scrapers (FB, Twitter, etc)
  // Normal users get redirected instantly via <script>
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />

  <title>MyPetAI Chat Message</title>

  <!-- OpenGraph -->
  <meta property="og:title" content="MyPetAI Chat Message" />
  <meta property="og:description" content="View chat message on MyPetAI" />
  <meta property="og:image" content="${ogImageUrl}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:type" content="article" />

  <!-- Canonical -->
  <link rel="canonical" href="${canonical}" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content="${ogImageUrl}" />
  <meta name="twitter:title" content="MyPetAI Chat Message" />
  <meta name="twitter:description" content="View chat message on MyPetAI" />
</head>
<body>
  <p>Redirecting…</p>

  <!-- Real users will follow this JS redirect -->
  <script>
    window.location.href = "${canonical}";
  </script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}
