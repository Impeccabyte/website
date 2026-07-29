import { describe, it, expect } from "vitest";
import {
  LEGACY_REDIRECTS,
  REPORTED_LEGACY_PATHS,
  REPORTED_404_PATHS,
  REPORTED_BLOCKED_PATHS,
  isGonePath,
  WWW_HOST,
  legacyRedirects,
} from "@/lib/seo/redirects";
import { sitemapPaths } from "@/lib/seo/sitemap";
import { SITE_URL } from "@/lib/seo/org";

const toPath = (dest: string) => dest.replace(SITE_URL, "") || "/";

describe("legacy redirect map", () => {
  it("has no duplicate sources", () => {
    const sources = LEGACY_REDIRECTS.map((r) => r.source);
    expect(new Set(sources).size).toBe(sources.length);
  });

  it("points every destination at a real indexable page", () => {
    const valid = new Set(sitemapPaths().map((u) => u.replace(SITE_URL, "") || "/"));
    for (const r of LEGACY_REDIRECTS) {
      expect(valid.has(toPath(r.destination)), `${r.source} -> ${r.destination}`).toBe(true);
    }
  });

  it("never redirects to another redirect source (no chains or loops)", () => {
    const sources = new Set(LEGACY_REDIRECTS.map((r) => r.source));
    for (const r of LEGACY_REDIRECTS) {
      expect(sources.has(toPath(r.destination)), `${r.source} chains`).toBe(false);
    }
  });

  it("uses absolute apex destinations so legacy www hits resolve in one hop", () => {
    for (const r of LEGACY_REDIRECTS) {
      expect(r.destination.startsWith(`${SITE_URL}/`)).toBe(true);
    }
  });

  it("marks every legacy redirect permanent", () => {
    for (const r of LEGACY_REDIRECTS) expect(r.permanent).toBe(true);
  });

  // Reported paths that are ALSO live apex routes need no rule of their own — the www
  // catch-all sends them to the identical path on the apex. A specific rule would match
  // on the apex too and loop forever.
  const LIVE_APEX_PATHS = ["/", "/about"];

  /**
   * How a path actually resolves in production, in precedence order. Next checks
   * redirects BEFORE the filesystem, so a matching rule beats a 410 catch-all — which
   * is what lets /topic/payment-gateway redirect while the rest of /topic/* is gone.
   */
  const resolutionOf = (path: string) => {
    if (LEGACY_REDIRECTS.some((r) => r.source === path)) return "redirect";
    if (isGonePath(path)) return "gone";
    if (LIVE_APEX_PATHS.includes(path)) return "live";
    return "unhandled";
  };

  // All three GSC exports are checked in as fixtures: every reported URL must resolve
  // through one of the three mechanisms, never fall through to a bare 404.
  it.each(REPORTED_LEGACY_PATHS)("resolves crawled-not-indexed URL %s", (path) =>
    expect(resolutionOf(path)).not.toBe("unhandled")
  );

  it.each(REPORTED_404_PATHS)("resolves 404-reported URL %s", (path) =>
    expect(resolutionOf(path)).not.toBe("unhandled")
  );

  it.each(REPORTED_BLOCKED_PATHS)("resolves robots-blocked URL %s", (path) =>
    expect(resolutionOf(path)).not.toBe("unhandled")
  );

  it("keeps each export's fixture at its reported size", () => {
    expect(REPORTED_LEGACY_PATHS).toHaveLength(20);
    expect(new Set(REPORTED_LEGACY_PATHS).size).toBe(20);
    expect(REPORTED_404_PATHS).toHaveLength(8);
    expect(new Set(REPORTED_404_PATHS).size).toBe(8);
    expect(REPORTED_BLOCKED_PATHS).toHaveLength(16);
    expect(new Set(REPORTED_BLOCKED_PATHS).size).toBe(16);
  });

  // The one deliberate overlap between a redirect rule and a gone prefix. If Next ever
  // changed its ordering, this URL would start returning 410 instead of redirecting.
  it("lets a redirect rule win over a gone prefix", () => {
    expect(isGonePath("/topic/payment-gateway")).toBe(true);
    expect(resolutionOf("/topic/payment-gateway")).toBe("redirect");
    expect(resolutionOf("/topic/entrepreneurship")).toBe("gone");
  });

  it("mirrors every non-industry rule under both commercial prefixes", () => {
    const sources = new Set(LEGACY_REDIRECTS.map((r) => r.source));
    for (const suffix of ["small-business", "enterprise", "switch", "surcharge-and-dual-pricing-programs"]) {
      for (const prefix of ["/payments", "/merchant-services"]) {
        expect(sources.has(`${prefix}/${suffix}`), `${prefix}/${suffix} missing`).toBe(true);
      }
    }
  });

  it("maps the whole legacy /policy tree to the current legal pages", () => {
    for (const [slug, dest] of [["cookies", "/cookies"], ["privacy", "/privacy"], ["terms", "/terms"]]) {
      const rule = LEGACY_REDIRECTS.find((r) => r.source === `/policy/${slug}`);
      expect(rule?.destination, `/policy/${slug} rule missing`).toBe(`${SITE_URL}${dest}`);
    }
  });

  // The old site mirrored its industry tree under two prefixes. The 404 export surfaced
  // mirrors the first pass missed, so both trees are now generated from one table —
  // this asserts the generation actually produced both, not just the reported half.
  it("maps every known industry slug under both legacy prefixes", () => {
    const sources = new Set(LEGACY_REDIRECTS.map((r) => r.source));
    const slugs = [
      "ecommerce",
      "retail",
      "specialty-markets",
      "trade-services",
      "professional-services",
      "restaurants-and-bars",
    ];
    for (const prefix of ["/payments/industry", "/merchant-services/industry"]) {
      expect(sources.has(prefix), `${prefix} hub missing`).toBe(true);
      for (const s of slugs) {
        expect(sources.has(`${prefix}/${s}`), `${prefix}/${s} missing`).toBe(true);
      }
    }
  });

  it("sends both enterprise URLs to pricing, not the unlaunched API product", () => {
    for (const s of ["/merchant-services/enterprise", "/payments/enterprise"]) {
      const rule = LEGACY_REDIRECTS.find((r) => r.source === s);
      expect(rule?.destination, `${s} rule missing`).toBe(`${SITE_URL}/pricing`);
    }
  });

  it("keeps every live apex path in the sitemap", () => {
    const valid = new Set(sitemapPaths().map((u) => u.replace(SITE_URL, "") || "/"));
    for (const p of LIVE_APEX_PATHS) expect(valid.has(p)).toBe(true);
  });

  it("ends with a host-scoped www catch-all", () => {
    const all = legacyRedirects();
    const last = all[all.length - 1];
    expect(last.source).toBe("/:path*");
    expect(last.destination).toBe(`${SITE_URL}/:path*`);
    expect(last.permanent).toBe(true);
    expect(last.has).toEqual([{ type: "host", value: WWW_HOST }]);
  });

  it("orders specific rules before the catch-all", () => {
    const all = legacyRedirects();
    expect(all.slice(0, LEGACY_REDIRECTS.length)).toEqual(LEGACY_REDIRECTS);
  });

  // A source that is also a live route would re-match on the apex and loop forever.
  // This is why /about has no rule of its own — see LIVE_APEX_PATHS above.
  it("never uses a live sitemap path as a redirect source", () => {
    const live = new Set(sitemapPaths().map((u) => u.replace(SITE_URL, "") || "/"));
    for (const r of LEGACY_REDIRECTS) {
      expect(live.has(r.source), `${r.source} shadows a live route — would loop`).toBe(false);
    }
  });
});
