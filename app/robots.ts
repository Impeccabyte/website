import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/org";

export default function robots(): MetadataRoute.Robots {
  return {
    // /tools/* holds private, password-gated tools — keep them out of every crawl.
    rules: { userAgent: "*", allow: "/", disallow: "/tools/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
