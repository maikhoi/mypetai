import { dbConnect } from "@/lib/mongoose";
import Product from "@/models/Product";
import ProductPageClient from "@/components/ProductPageClient";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  await dbConnect();
  const { slug } = await props.params;  // ✅ await params
  const product = await Product.findOne({ slug })
    .select("name description digitalAssets averageRating reviewCount stores.storeName")
    .lean();

  if (!product) return { title: "Product Not Found | MyPetAI+" };

  const isShopProduct = product.stores?.some((s: any) =>
    s.storeName?.toLowerCase().includes("mypetai")
  );

  const title = `${product.name} | MyPetAI+ Store`;
  const description =
    product.description?.slice(0, 160) ||
    `Check out ${product.name} available on MyPetAI+ from top verified stores.`;
  const image = product.digitalAssets?.[0]?.url || "/preview.jpg";
  const canonical = `https://mypetai.app/product/${slug}`;

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
    robots: isShopProduct ? { index: true, follow: true } : { index: false, follow: false },
  };
}

export default async function ProductPage(props: { params: Promise<{ slug: string }> }) {
  await dbConnect();
  const { slug } = await props.params;  // ✅ await the promise
  const product = await Product.findOne({ slug }).lean();

  if (!product) return notFound();

  const canonical = `https://mypetai.app/product/${slug}`;
  const image = product.digitalAssets?.[0]?.url || "/preview.jpg";

  const reviewCount = product.reviews?.length || 0;
  const averageRating =
    reviewCount > 0
      ? product.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviewCount
      : 0;

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
    }),
  };

  return (
    <>
      <meta property="og:type" content="product" />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={product.name} />
      <meta property="og:description" content={product.description?.slice(0, 160) || ""} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema, null, 2) }}
      />

      <ProductPageClient product={JSON.parse(JSON.stringify(product))} />
    </>
  );
}
