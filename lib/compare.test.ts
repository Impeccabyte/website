import { describe, it, expect } from "vitest";
import {
  COMPETITORS,
  competitorOrder,
  COMPARE_AS_OF,
  comparisonsLegalNotice,
  isCompetitorSlug,
} from "@/lib/compare";

describe("competitorOrder", () => {
  it("is the three competitors, in switcher order", () => {
    expect(competitorOrder).toEqual(["square", "shopify", "toast"]);
  });

  it("every slug resolves to a competitor that knows its own slug", () => {
    for (const slug of competitorOrder) {
      expect(COMPETITORS[slug]).toBeDefined();
      expect(COMPETITORS[slug].slug).toBe(slug);
    }
  });
});

describe("competitor data shape", () => {
  // The layout assumes exactly three bullets per card and five table rows.
  // A silent trim to legally-reviewed copy should fail here, loudly.
  it.each(["square", "shopify", "toast"] as const)("%s has 3 + 3 bullets and 5 rows", (slug) => {
    const c = COMPETITORS[slug];
    expect(c.them).toHaveLength(3);
    expect(c.us).toHaveLength(3);
    expect(c.rows).toHaveLength(5);
  });

  it.each(["square", "shopify", "toast"] as const)("%s has no empty strings", (slug) => {
    const c = COMPETITORS[slug];
    for (const s of [c.name, c.tagline, c.who, ...c.them, ...c.us]) {
      expect(s.trim().length).toBeGreaterThan(0);
    }
    for (const r of c.rows) {
      for (const s of [r.d, r.them, r.us]) expect(s.trim().length).toBeGreaterThan(0);
    }
  });

  it("concedes our own two-year term on the Toast contract row", () => {
    const contract = COMPETITORS.toast.rows.find((r) => r.d === "Contract");
    expect(contract?.us).toContain("A two-year term too");
  });
});

describe("freshness marker", () => {
  it("is a non-empty month-and-year the legal notice interpolates", () => {
    expect(COMPARE_AS_OF).toMatch(/^[A-Z][a-z]+ \d{4}$/);
    expect(comparisonsLegalNotice).toContain(`as of ${COMPARE_AS_OF}`);
  });

  it("keeps the trademark disclaimer in the notice", () => {
    expect(comparisonsLegalNotice).toContain("property of their respective owners");
  });
});

describe("isCompetitorSlug", () => {
  it("accepts known slugs and rejects everything else", () => {
    expect(isCompetitorSlug("square")).toBe(true);
    expect(isCompetitorSlug("stripe")).toBe(false);
    expect(isCompetitorSlug("")).toBe(false);
  });
});
