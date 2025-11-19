import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  openGraph: {
    title: "MyPetAI Chat",
    description: "View chat on MyPetAI",
    url: "https://www.mypetai.app/community/guppy/chat",   // 👈 IMPORTANT
    images: [
      "https://www.mypetai.app/api/og/chat?messageId=69117b3b13bba5e70e9d7bee"
    ],
  },
  alternates: {
    canonical: "https://www.mypetai.app/community/guppy/chat", // 👈 FIX canonical too
  }
};

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
