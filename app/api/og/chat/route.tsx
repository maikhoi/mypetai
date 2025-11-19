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
  
    const sender = msg?.senderName || "Message From MyPetAI";
    const text = msg?.text || "MyPetAI Share ";
    return new ImageResponse(
      (
        <div
      style={{
        width: "1200px",
        height: "630px",
        position: "relative",
        backgroundColor: "#111",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* top 2/3 image */}
      <div style={{ flex: 2, overflow: "hidden" }}>
        <img
          src={imgBuffer as unknown as string}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* bottom 1/3 text area */}
      <div
        style={{
          flex: 1,
          background: "#fff",
          padding: "40px 50px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: 40,
            fontWeight: "bold",
            color: "#000",
            marginBottom: 10,
          }}
        >
          {sender}
        </div>

        <div
          style={{
            fontSize: 32,
            color: "#444",
            lineHeight: 1.3,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {text || "Sent a message"}
        </div>
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
