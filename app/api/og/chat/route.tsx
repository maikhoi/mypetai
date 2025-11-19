import { ImageResponse } from "next/og";
import { dbConnect } from "@/lib/mongoose";
import Message, { IMessage } from "@/models/Message";

export const runtime = "edge"; // required for ImageResponse

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const messageId = searchParams.get("messageId");

    if (!messageId) {
      return new Response("Missing messageId", { status: 400 });
    }

    // Connect to DB
    await dbConnect();

    // Fetch message    
      const msg = (await Message.findById(messageId).lean()) as IMessage | null;

    // Fallback image if no media URL
    const imageUrl =
      msg?.mediaUrl ||
      "https://www.mypetai.app/og-default.png";

    return new ImageResponse(
      (
        <div
          style={{
            width: "1200px",
            height: "630px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#ffffff",
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
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (err) {
    console.error("OG IMAGE ERROR:", err);
    return new Response("Failed to generate image", { status: 500 });
  }
}
