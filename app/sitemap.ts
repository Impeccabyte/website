import type { MetadataRoute } from "next";
import { sitemapPaths } from "@/lib/seo/sitemap";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return sitemapPaths().map((url) => ({
    url,
    lastModified: now,
    changeFrequency: "monthly",
    priority: url.endsWith("/locations") || url.includes("/locations/") ? 0.8 : 0.7,
  }));
}
