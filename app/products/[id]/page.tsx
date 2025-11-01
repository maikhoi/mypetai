import { dbConnect } from "@/lib/mongoose";
import Product from "@/models/Product";
import ProductPageClient from "@/components/ProductPageClient"; 
import { Metadata } from "next";
import Script from "next/script";

/**
 * 🧩 Generate Metadata (SEO + OpenGraph)
 */
export async function generateMetadata( props : { params: Promise<{ id: string }>; }): Promise<Metadata> {
  await dbConnect();
  const { id } = await props.params; // ✅ must await params in Next 15
  const product = await Product.findById(id)
    .select("name description digitalAssets averageRating reviewCount")
    .lean();

  if (!product) {
    return { title: "Product Not Found | MyPetAI+" };
  }
  //DB: MyPetAI Shop
  const isShopProduct = product.stores?.some(
    (s: any) => s.storeName?.toLowerCase().includes("mypetai")
  );

  const title = `${product.name} | MyPetAI+ Store`;
  const description =
    product.description?.slice(0, 160) ||
    `Check out ${product.name} available on MyPetAI+ from top verified stores.`;

  const image = product.digitalAssets?.[0]?.url || "/preview.jpg";
  const canonical = `https://mypetai.app/products/${id}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      images: [{ url: image, width: 1200, height: 630 }],
    },
    robots: isShopProduct
      ? {
          index: true,
          follow: true,
        }
      : {
          index: false,
          follow: false, // also stops passing link juice
        },
  };
}

/**
 * 🧱 Product Page Server Component
 */
export default async function ProductPage(props: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await props.params;

  const product = await Product.findById(id).lean();

  if (!product) return <p>Product not found.</p>;

  const canonical = `https://mypetai.app/products/${id}`;
  const image = product.digitalAssets?.[0]?.url || "/preview.jpg";

  // 🧮 Compute live rating data (in case schema not up-to-date)
  const reviewCount = product.reviews?.length || 0;
  const averageRating =
    reviewCount > 0
      ? product.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviewCount
      : 0;

  // 🧾 Build structured data (JSON-LD)
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image,
    description: product.description,
    brand: { "@type": "Brand", name: "MyPetAI+" },
    offers: {
      "@type": "Offer",
      url: canonical,
      priceCurrency: "AUD",
      price: product.averagePrice || 0,
      availability: "https://schema.org/InStock",
    },
    ...(reviewCount > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: averageRating.toFixed(1),
        reviewCount,
      },
      review: product.reviews.map((r: any) => ({
        "@type": "Review",
        author: r.name,
        reviewBody: r.comment,
        reviewRating: {
          "@type": "Rating",
          ratingValue: r.rating,
        },
      })),
    }),
  };

  return (
    <>
      {/* ✅ Manual OG product type */}
      <meta property="og:type" content="product" />
      <meta property="product:brand" content="MyPetAI+" />
      <meta property="product:availability" content="in stock" />
      <meta property="product:condition" content="new" />
      <meta property="product:price:currency" content="AUD" />
      { typeof product.averagePrice === "number" && product.averagePrice > 0 && (
        <meta
          property="product:price:amount"
          content={product.averagePrice.toString()}
        />
      )}
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={product.name} />
      <meta
        property="og:description"
        content={product.description?.slice(0, 160) || ""}
      />

      {/* ✅ JSON-LD Schema */}
      <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productSchema, null, 2),
          }}
        />

      {/* ✅ Main Client Component (renders gallery, PayPal, and ReviewForm) */}
      <ProductPageClient product={JSON.parse(JSON.stringify(product))} />
    </>
  );
}
