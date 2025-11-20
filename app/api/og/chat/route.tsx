export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { ImageResponse } from "next/og";
import { dbConnect } from "@/lib/mongoose";
import Message, { IMessage } from "@/models/Message";

import { execFile } from "child_process";
import { promisify } from "util";
const exec = promisify(execFile);

/** -------------------------------------------------------
 * Convert ArrayBuffer → base64 data URL
 ------------------------------------------------------- */
function arrayBufferToDataUrl(buffer: ArrayBuffer, mime: string) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const len = bytes.byteLength;

  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  const base64 = Buffer.from(binary, "binary").toString("base64");
  return `data:${mime};base64,${base64}`;
}

/** -------------------------------------------------------
 * Extract first video frame → ArrayBuffer
 ------------------------------------------------------- */
async function extractFirstFrame(videoUrl: string): Promise<ArrayBuffer | null> {
  try {
    const output = "/tmp/frame.jpg";

    await exec("ffmpeg", ["-i", videoUrl, "-frames:v", "1", output]);

    return await fetch(`file://${output}`).then((r) => r.arrayBuffer());
  } catch (err) {
    console.error("FFMPEG ERROR:", err);
    return null;
  }
}

/** -------------------------------------------------------
 * GET Handler — JSON or OG Image
 ------------------------------------------------------- */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const messageId = searchParams.get("messageId");
    const meta = searchParams.get("meta");

    if (!messageId) {
      return new Response("Missing messageId", { status: 400 });
    }

    await dbConnect();
    const msg = (await Message.findById(messageId).lean()) as IMessage | null;

    /** ---------------------------------------
     * meta=1 → Return JSON
     --------------------------------------- */
    if (meta === "1") {
      return Response.json({
        messageId,
        text: msg?.text || null,
        mediaUrl: msg?.mediaUrl || null,
        senderName: msg?.senderName || null,
      });
    }

    /** ---------------------------------------
     * IMAGE MODE
     --------------------------------------- */
    const media = msg?.mediaUrl || null;
    const isVideo = media ? /\.(mp4|mov|avi|webm)$/i.test(media) : false;

    let previewBuffer: ArrayBuffer;

    if (isVideo) {
      const frame = media ? await extractFirstFrame(media) : null;

      if (frame) {
        previewBuffer = frame;
      } else {
        previewBuffer = await fetch("https://www.mypetai.app/og-default.png")
          .then((r) => r.arrayBuffer());
      }
    } else {
      previewBuffer = await fetch(media!)
        .then((r) => r.arrayBuffer())
        .catch(async () =>
          await fetch("https://www.mypetai.app/og-default.png").then((r) =>
            r.arrayBuffer()
          )
        );
    }

    /** ---------------------------------------
     * Convert ArrayBuffer → valid string for <img src="">
     --------------------------------------- */
    const dataUrl = arrayBufferToDataUrl(previewBuffer, "image/jpeg");

    /** ---------------------------------------
     * RENDER OG IMAGE
     --------------------------------------- */
    return new ImageResponse(
      (
        <div
          style={{
            width: "1200px",
            height: "630px",
            background: "#000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <img
            src={dataUrl}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />

          {isVideo && (
            <div
              style={{
                position: "absolute",
                width: "180px",
                height: "180px",
                background: "rgba(0,0,0,0.45)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderTop: "40px solid transparent",
                  borderBottom: "40px solid transparent",
                  borderLeft: "70px solid white",
                  marginLeft: "15px",
                }}
              ></div>
            </div>
          )}
        </div>
      ),
      { width: 1200, height: 630 }
    );
  } catch (err) {
    console.error("OG ERROR:", err);
    return new Response("Failed", { status: 500 });
  }
}
