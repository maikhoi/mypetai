import type { Metadata } from "next";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();

  // Trick: access the raw HTML of the current render phase
  const rawHead = h.get("x-nextjs-head") || "";

  let messageId = "";

  // Extract <meta name="x-message-id">
  const match = rawHead.match(/<meta name="x-message-id" content="([^"]*)"/);
  if (match) {
    messageId = match[1];
  }

  const ogImage =
    messageId
      ? `https://www.mypetai.app/api/og/chat?messageId=${messageId}`
      : "https://mypetai.app/preview.jpg";

  return {
    openGraph: {
      title: "MyPetAI Chat Message",
      description: "View chat on MyPetAI",
      images: [ogImage],
    },
  };
}

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}