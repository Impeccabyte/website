import { describe, it, expect } from "vitest";
import { llmsTxt } from "@/lib/seo/llms";
import { productOrder, solutionNavOrder } from "@/lib/data";
import { citySlugs } from "@/lib/seo/locations";
import { sitemapPaths } from "@/lib/seo/sitemap";
import { SITE_URL } from "@/lib/seo/org";

describe("llmsTxt", () => {
  const txt = llmsTxt();

  it("starts with an H1 title and a blockquote summary (llms.txt spec)", () => {
    expect(txt.startsWith("# Impeccabyte\n")).toBe(true);
    expect(txt).toContain("\n> Merchant services");
  });

  it("links every product and industry page as an absolute URL", () => {
    for (const k of productOrder) expect(txt).toContain(`(https://impeccabyte.com/products/${k})`);
    for (const k of solutionNavOrder) expect(txt).toContain(`(https://impeccabyte.com/industries/${k})`);
  });

  it("links every city page", () => {
    for (const s of citySlugs()) expect(txt).toContain(`(https://impeccabyte.com/locations/${s})`);
  });

  it("never exposes the private /tools area", () => {
    expect(txt).not.toContain("/tools");
  });

  // Anchored on the markdown link form `](<url>):` rather than a bare substring.
  // A plain `toContain(url)` passes vacuously whenever a hub path is a lexical
  // prefix of a deeper one already listed — "…/compare" is a substring of
  // "…/compare/square", so the hub could be dropped without failing this guard.
  it("links every URL in the sitemap", () => {
    const txt = llmsTxt();
    for (const url of sitemapPaths()) {
      expect(txt, `${url} is in the sitemap but not linked from llms.txt`).toContain(`](${url}):`);
    }
  });

  it("would catch a dropped hub link that a bare substring check misses", () => {
    // Guards the guard: proves the anchoring above is load-bearing.
    const withoutCompareHub = llmsTxt()
      .split("\n")
      .filter((line) => !line.includes(`](${SITE_URL}/compare):`))
      .join("\n");
    expect(withoutCompareHub).toContain(`${SITE_URL}/compare`); // bare substring still matches
    expect(withoutCompareHub).not.toContain(`](${SITE_URL}/compare):`); // anchored check does not
  });
});
