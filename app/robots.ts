import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://mypetai.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/deals", "/shop", "/products"],
        disallow: [
          "/api/",
          "/admin/",
          "/_next/",
          "/private/",
          "/drafts/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
