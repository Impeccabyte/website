import { describe, it, expect } from "vitest";
import { llmsTxt } from "@/lib/seo/llms";
import { productOrder, solutionNavOrder } from "@/lib/data";
import { citySlugs } from "@/lib/seo/locations";

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
});
