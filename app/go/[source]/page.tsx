// app/go/[source]/page.tsx
import { redirect } from "next/navigation";

export default async function RedirectPage({
  params,
}: {
  params: { source: string };
}) {
  const { source } = params;

  // Fire-and-forget logging to your backend
  fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/link-click`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      source,
      timestamp: Date.now(),
    }),
  }).catch(() => {});

  // final target of your portfolio
  const TARGET = "https://www.mypetai.app/case-studies";

  redirect(TARGET);
}
