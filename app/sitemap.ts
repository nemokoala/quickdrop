import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const baseUrl = (
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
).replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = {
    ko: `${baseUrl}/ko`,
    en: `${baseUrl}/en`,
    "x-default": baseUrl,
  };

  return routing.locales.map((locale) => ({
    url: `${baseUrl}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: locale === routing.defaultLocale ? 1 : 0.9,
    alternates: {
      languages,
    },
  }));
}
