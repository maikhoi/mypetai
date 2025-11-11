import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://mypetai.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/deals",
          "/shop",
          "/products",
          "/highlights",
          "/community",
          "/chat",
        ],
        disallow: [
          "/api/",
          "/admin/",
          "/_next/",
          "/private/",
          "/drafts/",
          "/tmp/",
          "/server/",
        ],
        crawlDelay: 5, // polite crawl rate
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
