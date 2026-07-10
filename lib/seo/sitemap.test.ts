import { describe, it, expect } from "vitest";
import { sitemapPaths } from "@/lib/seo/sitemap";

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
  });

  it("has no duplicates", () => {
    const urls = sitemapPaths();
    expect(new Set(urls).size).toBe(urls.length);
  });
});
