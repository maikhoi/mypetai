import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface Params {
  encodedUrl: string;
}

export default async function GoProductPage({
  params,
}: {
  params: Params;
}) {
  // Params may sometimes be a Promise in some environments — resolve it safely.
  const resolved = await Promise.resolve(params);

  console.log("👉 RAW PARAM:", resolved.encodedUrl);

  // 1️⃣ Guard: missing or bad encoded URL
  if (!resolved.encodedUrl || resolved.encodedUrl === "undefined") {
    console.warn("❌ Missing encodedUrl param in /go/p route");
    return redirect("/");
  }

  // 2️⃣ Decode back to original product URL
  let decodedUrl: string;
  try {
    decodedUrl = decodeURIComponent(resolved.encodedUrl);
  } catch (err) {
    console.error("❌ decodeURIComponent failed:", err);
    return redirect("/");
  }

  // 3️⃣ Fire-and-forget logging
  Promise.resolve(
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/link-click`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "externalProduct",
        source: "product",
        encodedUrl: resolved.encodedUrl,
        targetUrl: decodedUrl,
        timestamp: Date.now(),
      }),
    })
  ).catch((err) => console.error("❌ Link logging error:", err));

  // 4️⃣ Redirect user to the actual product page
  return redirect(decodedUrl);
}
