import { NextResponse, NextRequest } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import Message from "@/models/Message";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const pathname = url.pathname;
  const ua = req.headers.get("user-agent") || "";

  // Only target chat page
  if (!pathname.startsWith("/community/") || !pathname.endsWith("/chat")) {
    return NextResponse.next();
  }

  // Detect bot
  const isBot =
    ua.includes("facebookexternalhit") ||
    ua.includes("Twitterbot") ||
    ua.includes("Slackbot") ||
    ua.includes("LinkedInBot") ||
    ua.includes("WhatsApp");

  if (!isBot) {
    return NextResponse.next();
  }

  // Extract search param: messageId
  const messageId = url.searchParams.get("messageId");

  // Fetch message
  await dbConnect();
  const msg = messageId ? await Message.findById(messageId).lean() : null;

  // Build OG image URL
  const ogImage = messageId
    ? `https://www.mypetai.app/api/og/chat?messageId=${messageId}`
    : "https://www.mypetai.app/preview.jpg";

  const title = msg?.senderName
    ? `${msg.senderName}'s message`
    : "MyPetAI Chat Message";

  const description = msg?.text || "Chat message on MyPetAI";

  // Fetch the original page HTML
  const res = await fetch(url.toString());
  let html = await res.text();

  // Inject OG tags by rewriting the HTML
  html = html
    .replace(/<meta property="og:image".*?>/g, "")
    .replace(/<meta property="og:title".*?>/g, "")
    .replace(/<meta property="og:description".*?>/g, "")
    .replace("</head>", `
        <meta property="og:image" content="${ogImage}">
        <meta property="og:title" content="${title}">
        <meta property="og:description" content="${description}">
      </head>
    `);

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" },
  });
}

export const config = {
  matcher: ["/community/:topic/chat"],
};
