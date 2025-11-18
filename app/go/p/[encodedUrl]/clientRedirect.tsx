"use client";
import { useEffect } from "react";
import { io, Socket } from "socket.io-client";

export default function ClientRedirect({ encodedUrl }: { encodedUrl: string }) {
  useEffect(() => {
    const decodedUrl = decodeURIComponent(encodedUrl);

    const socket: Socket = io("https://chat.mypetai.app", {
      transports: ["websocket"],
      path: "/socket.io",
      query: {
        channelId: "tracking-public",
        senderName: "RedirectBot"
      }
    });

    socket.on("connect", () => {
      console.log("⚡ tracking socket connected", socket.id);

      socket.emit("track:linkClick", {
        encodedUrl,
        targetUrl: decodedUrl,
        ts: Date.now()
      });

      // redirect instantly
      window.location.href = decodedUrl;
    });

    socket.on("connect_error", (err) => {
      console.error("Socket error:", err);

      // fallback redirect
      window.location.href = decodedUrl;
    });

    // ✅ Correct cleanup: disconnect socket
    return () => {
      try {
        socket.disconnect();
      } catch (_) {}
    };

  }, [encodedUrl]);

  return null;
}
