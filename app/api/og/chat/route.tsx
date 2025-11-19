export const dynamic = "force-dynamic"; // ⭐ STOP BUILD FROM EXECUTING THIS ROUTE
export const runtime = "nodejs"; // ⭐ Mongoose only works in node runtime

import { ImageResponse } from "next/og";
import { dbConnect } from "@/lib/mongoose";
import Message, { IMessage } from "@/models/Message";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const messageId = searchParams.get("messageId");

    if (!messageId) {
      return new Response("Missing messageId", { status: 400 });
    }

    await dbConnect();

    const msg = (await Message.findById(messageId).lean()) as IMessage | null;

    const imageUrl =
      msg?.mediaUrl || "https://www.mypetai.app/og-default.png";

    return new ImageResponse(
      (
        <div
          style={{
            width: "1200px",
            height: "630px",
            background: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={imageUrl}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </div>
      ),
      { width: 1200, height: 630 }
    );
  } catch (err) {
    console.error("OG ERROR", err);
    return new Response("Failed to generate OG image", { status: 500 });
  }
}
