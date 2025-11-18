import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface Params {
  encodedUrl: string;
}

export default async function GoProductPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { encodedUrl } = await params;

  const decodedUrl = decodeURIComponent(encodedUrl);

  // Fire-and-forget socket logging
  try {
    const socketUrl = process.env.NEXT_PUBLIC_CHAT_SERVER_URL!;

    // dynamic import to avoid build-time issues
    const io = (await import("socket.io-client")).io;

    const socket = io(socketUrl, {
      transports: ["websocket"],
      timeout: 2000,
    });

    socket.emit("track:linkClick", {
      type: "externalProduct",
      source: "product",
      encodedUrl,
      targetUrl: decodedUrl,
      timestamp: Date.now(),
      userAgent: "",
    });

    // disconnect quickly to not hold server open
    setTimeout(() => socket.disconnect(), 100);

  } catch (err) {
    console.error("⚠️ Socket logging failed:", err);
  }

  // Redirect immediately
  return redirect(decodedUrl);
}
