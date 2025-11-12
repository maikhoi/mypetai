import Link from "next/link";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

interface ShopPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export async function generateMetadata({ searchParams }: ShopPageProps): Promise<Metadata> {
  const params = await searchParams;
  const category = params.category || "Pet Products";

  const readableCategory = category.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const title = `${readableCategory} | MyPetAI+ Shop`;
  const description = `Explore ${readableCategory} available at the best prices across multiple trusted stores on MyPetAI+.`;

  const canonical = `https://mypetai.app/shop?${new URLSearchParams(params as Record<string, string>).toString()}`;

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


export default async function ShopPage({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string; species?: string }>;
}) {
  const params = await searchParams;
  const category = params?.category;
  const species = params?.species;

  // ✅ Build query string for API
  const qs = new URLSearchParams();
  if (category) qs.append("category", category);
  if (species) qs.append("species", species);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products${qs.size ? `?${qs.toString()}` : ""}`,
    { next: { revalidate: 60 } }
  );
  const data = await res.json();
  const products = Array.isArray(data) ? data : data.products || [];

  // ✅ Filter products sold by MyPetAI Shop only
  const mypetaiProducts = products.filter((p: any) =>
    p.stores?.some(
      (s: any) => s.storeName?.trim().toLowerCase() === "mypetai shop"
    )
  );

  // ✅ Price helper (no double check)
  function findPrice(product: any): number | null {
    const store = product.stores?.find(
      (s: any) => s.storeName?.toLowerCase() === "mypetai shop"
    );
    if (!store) return null;

    const regularPrice = store.regularPrice ?? product.averagePrice ?? 0;
    const memberPrice = store.memberPrice ?? null;

    return memberPrice && memberPrice < regularPrice
      ? memberPrice
      : regularPrice;
  }

  return (
    <main
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "40px 20px",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: 24, color: "#333" }}>
        🛍️ Shop @ MyPetAI+ Store
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 20,
        }}
      >
        {mypetaiProducts.length === 0 && (
          <p style={{ color: "#777", gridColumn: "1 / -1" }}>
            No products available from MyPetAI Shop.
          </p>
        )}

        {mypetaiProducts.map((p: any) => (
          <Link
            key={p._id}
            href={`/product/${p.slug}`}
            style={{
              border: "1px solid #eee",
              borderRadius: 12,
              textDecoration: "none",
              color: "#333",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              background: "#fff",
              transition: "transform 0.2s ease",
            }}
          >
            <div
              style={{
                height: 180,
                background: "#f9f9f9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <img
                src={p.digitalAssets?.[0]?.url || p.imageUrl || "/placeholder.png"}
                alt={p.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div style={{ padding: "12px 14px" }}>
              <h3
                style={{
                  fontSize: "1.1rem",
                  margin: "4px 0",
                  color: "#333",
                  lineHeight: 1.3,
                }}
              >
                {p.name}
              </h3>
              {(() => {
  const store = p.stores?.find(
    (s: any) => s.storeName?.toLowerCase() === "mypetai shop"
  );
  const regularPrice = store?.regularPrice ?? p.averagePrice ?? 0;
  const memberPrice = store?.memberPrice ?? null;
  const onSale = memberPrice && memberPrice < regularPrice;

  if (onSale) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 6,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            color: "#e67e22",
            fontWeight: 700,
            fontSize: "1.1rem",
          }}
        >
          ${memberPrice.toFixed(2)} AUD
        </span>
        <span
          style={{
            textDecoration: "line-through",
            color: "#999",
            fontSize: "0.95rem",
          }}
        >
          ${regularPrice.toFixed(2)}
        </span>
        <span
          style={{
            background: "#f5a623",
            color: "#fff",
            borderRadius: 6,
            padding: "1px 6px",
            fontSize: "0.8rem",
            fontWeight: 600,
          }}
        >
          SALE
        </span>
      </div>
    );
  }

  // default regular price only
  return (
    <p
      style={{
        color: "#f5a623",
        fontWeight: 600,
        margin: "6px 0 0",
      }}
    >
      ${regularPrice.toFixed(2)} AUD
    </p>
  );
})()}

            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
