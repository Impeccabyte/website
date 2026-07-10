import { SITE_URL } from "@/lib/seo/org";
import { citySlugs } from "@/lib/seo/locations";
import { productOrder, solutionNavOrder } from "@/lib/data";

/** Every indexable path, as absolute URLs. Single source for app/sitemap.ts. */
export function sitemapPaths(): string[] {
  const paths = [
    "/",
    "/about",
    "/partnerships",
    "/pricing",
    "/contact",
    "/chamber",
    "/privacy",
    "/terms",
    "/cookies",
    "/locations",
    ...citySlugs().map((s) => `/locations/${s}`),
    ...productOrder.map((k) => `/products/${k}`),
    ...solutionNavOrder.map((k) => `/industries/${k}`),
  ];
  return [...new Set(paths)].map((p) => `${SITE_URL}${p === "/" ? "/" : p}`);
}
