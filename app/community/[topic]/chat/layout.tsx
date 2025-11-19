import type { Metadata } from "next";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  // Try reading the full URL, but fallback gracefully
  const h = headers();
  const raw = (await h).get("x-url") || (await h).get("referer") || "https://www.mypetai.app/";

  // Extract messageId from the referer if present
  let messageId = "";
  try {
    const u = new URL(raw);
    messageId = u.searchParams.get("messageId") || "";
  } catch {}

  const ogImage = messageId
    ? `https://www.mypetai.app/api/og/chat?messageId=${messageId}`
    : "https://mypetai.app/preview.jpg";

  return {
    openGraph: {
      title: "MyPetAI Chat Message",
      description: "View chat message",
      url: raw,
      images: [ogImage],
    },
    alternates: {
      canonical: raw,
    },
  };
}

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
