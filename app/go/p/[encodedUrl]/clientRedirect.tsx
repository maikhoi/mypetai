"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";

export default function ClientRedirect({ encodedUrl }: { encodedUrl: string }) {
  useEffect(() => {
    const decodedUrl = decodeURIComponent(encodedUrl);

    const socket = io("https://chat.mypetai.app/tracking", {
      path: "/socket.io",
      transports: ["websocket"],
      forceNew: true,
    });

    socket.on("connect", () => {
      socket.emit("track:linkClick", {
        encodedUrl,
        targetUrl: decodedUrl,
        ts: Date.now(),
      });

      setTimeout(() => {
        socket.disconnect();
        window.location.href = decodedUrl;  // instant redirect
      }, 120);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket tracking error:", err);
      window.location.href = decodedUrl; // fail-safe
    });
  }, [encodedUrl]);

  return null;
}
