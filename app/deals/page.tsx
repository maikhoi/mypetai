import { Metadata } from "next";
import Script from "next/script";
import DealsInner from "./DealsInner";

export const dynamic = "force-dynamic"; // ensures search params re-render

// ✅ Explicit type for searchParams
interface DealsPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export async function generateMetadata({ searchParams, }: DealsPageProps): Promise<Metadata> {
  const params= await searchParams; // must await searchParams in Next 15

  const species = params.species || "pet";
  const breed = params.breedCompatibility || "";
  const category = params.category || "";

  const readableTitle = [
    species !== "pet" ? species : "",
    breed,
    category,
  ]
    .filter(Boolean)
    .map((s) => s.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()))
    .join(" • ");

  const title = readableTitle
    ? `${readableTitle} Deals | MyPetAI+`
    : "Pet Deals | MyPetAI+";

  const description = `Find the best ${readableTitle || "pet"} deals and price comparisons across top stores on MyPetAI+.`;

  const canonical = `https://mypetai.app/deals?${new URLSearchParams(params as Record<string, string>).toString()}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
    },
  };
}

export default async function DealsPage({ searchParams }: DealsPageProps) {
  const params = await searchParams; // ✅ must await this
  // ⚡ Fetch small dataset for structured data
  const query = new URLSearchParams(params as Record<string, string>).toString();
  
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mypetai.app";
  let deals: any[] = [];

  try {
    const res = await fetch(`${baseUrl}/api/products?${query}`, { next: { revalidate: 3600 } });
    const data = await res.json();
    deals = Array.isArray(data) ? data : data.products || [];
  } catch (err) {
    console.error("Deals fetch failed for schema:", err);
  }

  const listSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: deals.slice(0, 10).map((d, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${baseUrl}/products/${d._id}`,
      name: d.name,
    })),
  };

  return (
    <>
      {/* ✅ JSON-LD for SEO */}
      <Script
        id="deals-list-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }}
      />
      {/* ✅ Render your client component */}
      <DealsInner />
    </>
  );
}
