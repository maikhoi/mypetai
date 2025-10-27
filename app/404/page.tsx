// app/not-found.tsx or app/404/page.tsx
"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

export default function NotFoundPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <NotFoundInner />
    </Suspense>
  );
}

function NotFoundInner() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  return (
    <div style={{ padding: 40 }}>
      <h1>404 - Page Not Found</h1>
      {q && <p>No results found for: {q}</p>}
    </div>
  );
}
