import { describe, it, expect } from "vitest";
import type { Metadata } from "next";
import { metadata as home } from "@/app/page";
import { metadata as about } from "@/app/about/page";
import { metadata as partnerships } from "@/app/partnerships/page";
import { metadata as pricing } from "@/app/pricing/page";
import { metadata as surcharge } from "@/app/surcharge/page";
import { metadata as cashDiscount } from "@/app/cash-discount/page";
import { metadata as travel } from "@/app/benefits/travel/page";
import { metadata as contact } from "@/app/contact/page";
import { metadata as chamber } from "@/app/chamber/page";
import { metadata as integrations } from "@/app/integrations/page";
import { metadata as locations } from "@/app/locations/page";
import { metadata as industriesHub } from "@/app/industries/page";
import { metadata as privacy } from "@/app/privacy/page";
import { metadata as terms } from "@/app/terms/page";
import { metadata as cookies } from "@/app/cookies/page";
import { generateMetadata as productMeta } from "@/app/products/[key]/page";
import { generateMetadata as industryMeta } from "@/app/industries/[key]/page";
import { generateMetadata as cityMeta } from "@/app/locations/[city]/page";
import { productOrder, solutionNavOrder } from "@/lib/data";
import { citySlugs } from "@/lib/seo/locations";
import { sitemapPaths } from "@/lib/seo/sitemap";
import { SITE_URL } from "@/lib/seo/org";

/** Every route with a statically-declared metadata export, paired with its expected canonical. */
const STATIC: [string, Metadata][] = [
  ["/", home],
  ["/about", about],
  ["/partnerships", partnerships],
  ["/pricing", pricing],
  ["/surcharge", surcharge],
  ["/cash-discount", cashDiscount],
  ["/benefits/travel", travel],
  ["/contact", contact],
  ["/chamber", chamber],
  ["/integrations", integrations],
  ["/locations", locations],
  ["/industries", industriesHub],
  ["/privacy", privacy],
  ["/terms", terms],
  ["/cookies", cookies],
];

describe("self-referencing canonicals", () => {
  it.each(STATIC)("%s declares itself canonical", (path, meta) => {
    expect(meta.alternates?.canonical).toBe(path);
  });

  it.each(productOrder)("/products/%s declares itself canonical", async (key) => {
    const meta = await productMeta({ params: Promise.resolve({ key }) });
    expect(meta.alternates?.canonical).toBe(`/products/${key}`);
  });

  it.each(solutionNavOrder)("/industries/%s declares itself canonical", async (key) => {
    const meta = await industryMeta({ params: Promise.resolve({ key }) });
    expect(meta.alternates?.canonical).toBe(`/industries/${key}`);
  });

  it.each(citySlugs())("/locations/%s declares itself canonical", async (city) => {
    const meta = await cityMeta({ params: Promise.resolve({ city }) });
    expect(meta.alternates?.canonical).toBe(`/locations/${city}`);
  });

  // Guard: if a route is added to the sitemap without a canonical assertion here, fail.
  it("asserts a canonical for every URL in the sitemap", () => {
    const covered = new Set<string>([
      ...STATIC.map(([p]) => p),
      ...productOrder.map((k) => `/products/${k}`),
      ...solutionNavOrder.map((k) => `/industries/${k}`),
      ...citySlugs().map((s) => `/locations/${s}`),
    ]);
    const uncovered = sitemapPaths()
      .map((u) => u.replace(SITE_URL, "") || "/")
      .filter((p) => !covered.has(p));
    expect(uncovered).toEqual([]);
  });
});
