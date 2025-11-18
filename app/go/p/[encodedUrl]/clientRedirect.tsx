'use client';

import { useEffect } from "react";
import { io } from "socket.io-client";

export default function ClientRedirect({ encodedUrl }: { encodedUrl: string }) {

  useEffect(() => {
    const decodedUrl = decodeURIComponent(encodedUrl);
console.log("decodedUrl---------------------------------",decodedUrl)
    const socket = io("https://chat.mypetai.app/tracking", {
      path: "/socket.io",
      transports: ["websocket"],
      withCredentials: true
    });

    socket.on("connect", () => {
      socket.emit("track:linkClick", {
        encodedUrl,
        targetUrl: decodedUrl,
        timestamp: Date.now(),
      });
      setTimeout(() => socket.disconnect(), 200);
    });

    socket.on("connect_error", err => {
      console.error("Socket connect error:", err);
    });
    
    console.log("decodedUrl--------------------------------||",decodedUrl)
    // NOW BROWSER REDIRECT
    //window.location.href = decodedUrl;

  }, [encodedUrl]);

  return null;
}
