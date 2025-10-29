import { MetadataRoute } from "next";
import { dbConnect } from "@/lib/mongoose";
import Product from "@/models/Product";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://mypetai.app";
  await dbConnect();

  // 🧩 Fetch only the needed fields
  const products = await Product.find({}, "species categories breedCompatibility updatedAt").lean();

  // Use a Set to avoid duplicate URLs
  const urlSet = new Set<string>();

  products.forEach((p: any) => {
    const speciesList = Array.isArray(p.species) ? p.species : [];
    const categoryList = Array.isArray(p.categories) ? p.categories : [];
    const breedList = Array.isArray(p.breedCompatibility) ? p.breedCompatibility : [];

    // Species + Category URLs
    speciesList.forEach((sp: string) => {
      categoryList.forEach((cat: string) => {
        urlSet.add(`species=${sp}&category=${cat}`);
      });
    });

    // Species + Breed URLs
    speciesList.forEach((sp: string) => {
      breedList.forEach((br: string) => {
        urlSet.add(`species=${sp}&breedCompatibility=${br}`);
      });
    });
  });

  // 🧠 Encode URLs safely for XML
  const dynamicUrls: MetadataRoute.Sitemap = Array.from(urlSet).map((q) => ({
    url: `${baseUrl}/deals?${encodeURI(q).replace(/&/g, "&amp;")}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // 🏠 Base pages
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/deals`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
  ];

  return [...staticUrls, ...dynamicUrls];
}
