"use client";

import { useEffect } from "react";

export default function clientRedirect({ encodedUrl }: { encodedUrl: string }) {
  useEffect(() => {
    const decodedUrl = decodeURIComponent(encodedUrl);

    const track = async () => {
      try {
        // call Rocky Linux chat server (Express)
        fetch(`https://chat.mypetai.app/api/tracking/link/${encodedUrl}`)
          .catch(() => {});
      } catch (err) {
        console.warn("Tracking failed:", err);
      } finally {
        // immediate redirect
        //window.location.href = decodedUrl;
      }
    };

    track();
  }, [encodedUrl]);

  return null;
}
