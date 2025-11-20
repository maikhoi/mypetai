export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { ImageResponse } from "next/og";
import { dbConnect } from "@/lib/mongoose";
import Message, { IMessage } from "@/models/Message";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const messageId = searchParams.get("messageId");
    const meta = searchParams.get("meta"); // ⭐ meta=1 means JSON mode

    if (!messageId) {
      return new Response("Missing messageId", { status: 400 });
    }

    await dbConnect();
    const msg = (await Message.findById(messageId).lean()) as IMessage | null;

    // ⭐ If meta=1 → return JSON with message text + media
    if (meta === "1") {
      return Response.json({
        messageId,
        text: msg?.text || null,
        mediaUrl: msg?.mediaUrl || null,
        senderName: msg?.senderName || null,
      });
    }


      // ⭐ IMAGE MODE
    const imgSrc =
      msg?.mediaUrl || "https://www.mypetai.app/og-default.png";
      // Fetch the remote image bytes
      const imgBuffer = await fetch(imgSrc).then((r) => r.arrayBuffer());
  
    return new ImageResponse(
      (
        <div
      style={{
        width: "1200px",
        height: "630px",
        background: "#ffffff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        padding: "40px",
        fontSize: "48px",
        fontFamily: "Arial",
      }}
    >
      {/* Image */}
      <img
        src={imgBuffer as unknown as string}
        style={{
          width: "100%",
          height: "400px",
          objectFit: "contain",
        }}
      />

      {/* Message text */}
      <div
        style={{
          marginTop: "30px",
          color: "#333",
          whiteSpace: "pre-wrap",
          fontSize: "40px",
          textAlign: "center",
        }}
      >
        {msg?.text ?? ""}
      </div>
    </div>
      ),
      { width: 1200, height: 630 }
    );

  } catch (err) {
    console.error("OG ERROR", err);
    return new Response("Failed", { status: 500 });
  }
}
