import { describe, it, expect } from "vitest";
import { sitemapPaths } from "@/lib/seo/sitemap";
import sitemap from "@/app/sitemap";
import { productOrder, solutionNavOrder } from "@/lib/data";
import { competitorOrder } from "@/lib/compare";

describe("sitemapPaths", () => {
  it("includes the locations hub and all three city pages as absolute URLs", () => {
    const urls = sitemapPaths();
    expect(urls).toContain("https://impeccabyte.com/locations");
    expect(urls).toContain("https://impeccabyte.com/locations/austin");
    expect(urls).toContain("https://impeccabyte.com/locations/dallas");
    expect(urls).toContain("https://impeccabyte.com/locations/san-antonio");
  });

  it("includes core static routes and every product/industry page", () => {
    const urls = sitemapPaths();
    expect(urls).toContain("https://impeccabyte.com/");
    expect(urls).toContain("https://impeccabyte.com/pricing");
    expect(urls).toContain("https://impeccabyte.com/products/payments");
    expect(urls).toContain("https://impeccabyte.com/industries/highrisk");
    for (const k of productOrder) expect(urls).toContain(`https://impeccabyte.com/products/${k}`);
    for (const k of solutionNavOrder) expect(urls).toContain(`https://impeccabyte.com/industries/${k}`);
  });

  it("has no duplicates", () => {
    const urls = sitemapPaths();
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("includes the industries hub", () => {
    expect(sitemapPaths()).toContain("https://impeccabyte.com/industries");
  });

  it("includes the compare hub and all three competitor pages", () => {
    const urls = sitemapPaths();
    expect(urls).toContain("https://impeccabyte.com/compare");
    for (const slug of competitorOrder) {
      expect(urls).toContain(`https://impeccabyte.com/compare/${slug}`);
    }
  });
});

describe("sitemap.xml entries", () => {
  it("lists exactly the paths from sitemapPaths()", () => {
    expect(sitemap().map((e) => e.url)).toEqual(sitemapPaths());
  });

  // A build-time lastModified would be identical across every URL and would change on
  // every deploy, telling Google all 32 pages changed when they did not. changeFrequency
  // and priority are ignored by Google outright. Emitting any of them is a regression.
  it("emits no lastModified, changeFrequency, or priority", () => {
    for (const entry of sitemap()) {
      expect(Object.keys(entry), `${entry.url} carries extra fields`).toEqual(["url"]);
    }
  });
});
