"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch("/api/admin/me");

        if (res.ok) {
          setAuthorized(true);
        } else {
          router.push(`/admin/login?from=${window.location.pathname}`);
        }
      } catch {
        router.push(`/admin/login?from=${window.location.pathname}`);
      }

      setLoading(false);
    }

    check();
  }, []);

  if (loading) return <p style={{ padding: 20 }}>Checking admin access…</p>;

  return authorized ? <>{children}</> : null;
}
