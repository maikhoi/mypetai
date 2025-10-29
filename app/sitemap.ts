import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://mypetai.app";

  const featuredCombos = [
    { species: "dog", category: "food" },
    { species: "dog", category: "flea-tick-worming" },
    { species: "cat", category: "treats" },
    { species: "fish", category: "food" },
  ];

  const dealPages: MetadataRoute.Sitemap = featuredCombos.map((combo) => ({
    url: `${baseUrl}/deals?${new URLSearchParams(combo).toString()}`,
    lastModified: new Date(),
    changeFrequency: "weekly", // ✅ must use a literal from allowed types
    priority: 0.7,
  }));

  // Add main site pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/deals`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  return [...staticPages, ...dealPages];
}
