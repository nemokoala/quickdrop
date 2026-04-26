import type { MetadataRoute } from "next";

const baseUrl = (
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
).replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/ko", "/en"],
      disallow: ["/api/", "/d/", "/ko/d/", "/en/d/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
