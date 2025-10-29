import { MetadataRoute } from "next";
import { dbConnect } from "@/lib/mongoose";
import Product from "@/models/Product";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://mypetai.app";
  await dbConnect();

  // 🧩 Fetch all needed product data
  const products = await Product.find(
    {},
    "species categories breedCompatibility updatedAt"
  ).lean();

  const urlSet = new Set<string>();
  const shopCategories = new Set<string>();

  products.forEach((p: any) => {
    const speciesList = Array.isArray(p.species) ? p.species : [];
    const categoryList = Array.isArray(p.categories) ? p.categories : [];
    const breedList = Array.isArray(p.breedCompatibility)
      ? p.breedCompatibility
      : [];

    // 🐾 Species + Category for deals
    speciesList.forEach((sp: string) => {
      categoryList.forEach((cat: string) => {
        urlSet.add(`species=${sp}&category=${cat}`);
      });
    });

    // 🧬 Species + Breed for deals
    speciesList.forEach((sp: string) => {
      breedList.forEach((br: string) => {
        urlSet.add(`species=${sp}&breedCompatibility=${br}`);
      });
    });

    // 🛒 Shop category pages
    categoryList.forEach((cat: string) => {
      shopCategories.add(cat);
    });
  });

  const now = new Date();

  // 🧭 Deals pages
  const dealsUrls: MetadataRoute.Sitemap = Array.from(urlSet).map((q) => ({
    url: `${baseUrl}/deals?${encodeURI(q).replace(/&/g, "&amp;")}`,
    lastModified: now.toISOString(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // 🏬 Shop category pages
  const shopUrls: MetadataRoute.Sitemap = Array.from(shopCategories).map(
    (cat) => ({
      url: `${baseUrl}/shop?category=${encodeURIComponent(cat)}`,
      lastModified: now.toISOString(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })
  );

  // 🧩 Individual product pages
  const productDocs = await Product.find({}, "_id updatedAt").lean();
  const productUrls: MetadataRoute.Sitemap = productDocs.map((p: any) => ({
    url: `${baseUrl}/products/${p._id}`,
    lastModified: (p.updatedAt || now).toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  // 🏠 Static base pages
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now.toISOString(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/deals`,
      lastModified: now.toISOString(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: now.toISOString(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
  ];

  // Combine all URLs into final sitemap
  return [...staticUrls, ...dealsUrls, ...shopUrls, ...productUrls];
}
