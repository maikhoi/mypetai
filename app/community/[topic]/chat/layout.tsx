import type { Metadata } from "next";

export const metadata: Metadata = {
  openGraph: {
    title: "MyPetAI Chat",
    description: "View chat on MyPetAI",
    images: ["https://www.mypetai.app/uploads/1761350637151-IMG_2601.jpg"], // 👈 put ANY image URL you want here
  },
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
