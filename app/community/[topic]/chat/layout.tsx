import type { Metadata } from "next";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const h = headers();
  const fullUrl = (await h).get("x-url") || "";

  const urlObj = fullUrl ? new URL(fullUrl) : null;
  const messageId = urlObj?.searchParams.get("messageId") ?? "";

  const ogImage = messageId
    ? `https://www.mypetai.app/api/og/chat?messageId=${messageId}`
    : "https://mypetai.app/preview.jpg";

  return {
    openGraph: {
      title: "MyPetAI Chat",
      description: "View chat message",
      url: fullUrl,
      images: [ogImage], // ⭐ using OG generator here
    },
    alternates: {
      canonical: fullUrl,
    },
  };
}

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
