"use client";
import { useEffect } from "react";

export default function ClientRedirect({ encodedUrl }: { encodedUrl: string }) {
  useEffect(() => {
    const decodedUrl = decodeURIComponent(encodedUrl);
    const trackingUrl = `https://chat.mypetai.app/api/tracking/link/${encodedUrl}`;

    // 1) Try super-fast beacon
    const payload = JSON.stringify({
      encodedUrl,
      targetUrl: decodedUrl,
      ts: Date.now(),
    });

    const sent = navigator.sendBeacon(trackingUrl, payload);

    // 2) If beacon fails → fallback to fetch (non-blocking)
    if (!sent) {
      fetch(trackingUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }

    // Nothing else — redirect already triggered server-side
  }, [encodedUrl]);

  return null;
}
