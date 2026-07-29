import { describe, it, expect } from "vitest";
import {
  LEGACY_REDIRECTS,
  REPORTED_LEGACY_PATHS,
  GONE_PREFIX,
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
  const LIVE_APEX_PATHS = ["/about"];

  // The GSC export is checked in as a fixture: every reported URL must be handled by
  // exactly one mechanism — a redirect, the 410 handler, or the www catch-all.
  it.each(REPORTED_LEGACY_PATHS)("handles the reported URL %s exactly once", (path) => {
    const redirected = LEGACY_REDIRECTS.some((r) => r.source === path);
    const gone = path === GONE_PREFIX || path.startsWith(`${GONE_PREFIX}/`);
    const live = LIVE_APEX_PATHS.includes(path);
    expect([redirected, gone, live].filter(Boolean)).toHaveLength(1);
  });

  it("covers all 20 reported legacy paths", () => {
    expect(REPORTED_LEGACY_PATHS).toHaveLength(20);
    expect(new Set(REPORTED_LEGACY_PATHS).size).toBe(20);
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
});
