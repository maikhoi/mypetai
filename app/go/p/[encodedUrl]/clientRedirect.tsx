"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";

export default function ClientRedirect({ encodedUrl }: { encodedUrl: string }) {
  useEffect(() => {
    const decodedUrl = decodeURIComponent(encodedUrl);

    // --------------------------
    // 1) Fire keepalive GET (super fast)
    // --------------------------
    const trackingUrl =
      "https://chat.mypetai.app/api/tracking/link" +
      `?encoded=${encodeURIComponent(encodedUrl)}` +
      `&target=${encodeURIComponent(decodedUrl)}` +
      `&ts=${Date.now()}`;

    fetch(trackingUrl, {
      method: "GET",
      keepalive: true,
    }).catch(() => {});

    // --------------------------
    // 2) Fire socket tracking simultaneously (best case)
    // --------------------------
    const socket = io("https://chat.mypetai.app/tracking", {
      path: "/socket.io",
      transports: ["websocket"],
      reconnection: false,
      forceNew: true,
    });

    socket.on("connect", () => {
      socket.emit("track:linkClick", {
        encodedUrl,
        targetUrl: decodedUrl,
        ts: Date.now(),
      });

      // clean disconnect (non-blocking)
      setTimeout(() => socket.disconnect(), 100);
    });

    // --------------------------
    // 3) Redirect IMMEDIATELY (no waiting)
    // --------------------------
    setTimeout(() => {
      window.location.href = decodedUrl;
    }, 20); // ~20ms render time

    // ✅ Correct cleanup: disconnect socket
    return () => {
      try {
        socket.disconnect();
      } catch (_) {}
    };
  }, [encodedUrl]);

  return (
    <div className="p-4 text-sm text-gray-500">
      Redirecting to store…
    </div>
  );
}
