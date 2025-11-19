import { Metadata } from "next";
import { dbConnect } from "@/lib/mongoose";
import Message, { IMessage } from "@/models/Message";

type Props = {
  searchParams: { messageId?: string };
};

export async function generateMetadata(
  { searchParams }: Props
): Promise<Metadata> {
  const messageId = searchParams?.messageId;

  if (!messageId) {
    return {
      openGraph: {
        title: "MyPetAI Chat",
        description: "View chat messages on MyPetAI",
        images: ["https://www.mypetai.app/og-default.png"],
      },
    };
  }

  await dbConnect();
 
  const msg = (await Message.findById(messageId).lean()) as IMessage | null;

  const hasImage = msg?.mediaUrl;

  return {
    openGraph: {
      title: msg?.senderName
        ? `${msg.senderName}'s message`
        : "MyPetAI Chat Message",
      description: msg?.text || "Chat message",
      images: [
        hasImage
          ? `https://www.mypetai.app/community/guppy/chat/opengraph-image?messageId=${messageId}`
          : "https://www.mypetai.app/og-default.png",
      ],
    },
  };
}
