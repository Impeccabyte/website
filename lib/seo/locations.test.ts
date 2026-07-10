import { describe, it, expect } from "vitest";
import { CITIES, citySlugs, getCity, cityCanonical, cityJsonLdNodes } from "@/lib/seo/locations";

describe("CITIES", () => {
  it("has exactly the three target cities", () => {
    expect(citySlugs().sort()).toEqual(["austin", "dallas", "san-antonio"]);
  });

  it("gives each city a unique metaTitle and >=4 FAQs", () => {
    const titles = citySlugs().map((s) => getCity(s)!.metaTitle);
    expect(new Set(titles).size).toBe(3);
    for (const s of citySlugs()) expect(getCity(s)!.faqs.length).toBeGreaterThanOrEqual(4);
  });

  it("keeps intro copy unique across cities (< 20% sentence overlap)", () => {
    const sentences = (c: string) =>
      new Set(getCity(c)!.intro.join(" ").split(/(?<=[.!?])\s+/).map((x) => x.trim().toLowerCase()).filter(Boolean));
    const pairs: [string, string][] = [["austin", "dallas"], ["austin", "san-antonio"], ["dallas", "san-antonio"]];
    for (const [a, b] of pairs) {
      const A = sentences(a), B = sentences(b);
      const overlap = [...A].filter((x) => B.has(x)).length / Math.max(A.size, B.size);
      expect(overlap).toBeLessThan(0.2);
    }
  });

  it("answers 'office in {city}' honestly for non-Austin (mentions Austin, claims no local office)", () => {
    for (const s of ["dallas", "san-antonio"]) {
      const officeFaq = getCity(s)!.faqs.find((f) => /office in/i.test(f.q));
      expect(officeFaq).toBeDefined();
      expect(officeFaq!.a).toMatch(/Austin/);
      expect(officeFaq!.a).toMatch(/no|don't|not have/i);
    }
  });

  it("cityCanonical returns the self-referencing path", () => {
    expect(cityCanonical("dallas")).toBe("/locations/dallas");
  });

  it("cityJsonLdNodes emits Service + BreadcrumbList + FAQPage, no fake local address", () => {
    const nodes = cityJsonLdNodes(getCity("dallas")!);
    const types = nodes.map((n) => n["@type"]);
    expect(types).toEqual(["Service", "BreadcrumbList", "FAQPage"]);
    // No node may carry a PostalAddress for Dallas.
    expect(JSON.stringify(nodes)).not.toMatch(/PostalAddress/);
  });
});
