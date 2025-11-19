import { ImageResponse } from "next/og";
import Message from "@/models/Message";
import { dbConnect } from "@/lib/mongoose";

export const runtime = "edge";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const messageId = searchParams.get("messageId");

  await dbConnect();
  const msg = await Message.findById(messageId).lean();

  const imageUrl =
    msg?.mediaUrl ||
    "https://www.mypetai.app/og-default.png";

  return new ImageResponse(
    {
      type: "div",
      props: {
        style: {
          width: "1200px",
          height: "630px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fff"
        },
        children: {
          type: "img",
          props: {
            src: imageUrl,
            style: {
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain"
            }
          }
        }
      }
    },
    {
      width: 1200,
      height: 630,
    }
  );
}
