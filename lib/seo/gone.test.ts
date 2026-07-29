import { describe, it, expect } from "vitest";
import { GET as businessGET } from "@/app/business/[[...slug]]/route";
import { GET as wpContentGET } from "@/app/wp-content/[[...slug]]/route";
import {
  REPORTED_LEGACY_PATHS,
  REPORTED_404_PATHS,
  GONE_PREFIXES,
  isGonePath,
} from "@/lib/seo/redirects";

const HANDLERS: [string, () => Response][] = [
  ["/business", businessGET],
  ["/wp-content", wpContentGET],
];

describe("retired-section tombstones", () => {
  it.each(HANDLERS)("%s returns 410 Gone", async (_prefix, GET) => {
    expect((await GET()).status).toBe(410);
  });

  it.each(HANDLERS)("%s serves an HTML body so it isn't blank for humans", async (_p, GET) => {
    const res = await GET();
    expect(res.headers.get("content-type")).toMatch(/text\/html/);
    await expect(res.text()).resolves.toMatch(/no longer/i);
  });

  it.each(HANDLERS)("%s tells crawlers not to index the tombstone", async (_p, GET) => {
    expect((await GET()).headers.get("x-robots-tag")).toBe("noindex");
  });

  it.each(HANDLERS)("%s explains itself rather than showing a bare heading", async (_p, GET) => {
    const html = await (await GET()).text();
    // The <p> between the heading and the links carries the section-specific explanation.
    expect(html).toMatch(/<p>[^<]{20,}<\/p>/);
  });

  it("gives every gone prefix a route handler", () => {
    // A prefix in GONE_PREFIXES without a handler silently falls through to the normal
    // 404 page. What this catches is a missing file, not bad logic.
    expect(HANDLERS.map(([p]) => p).sort()).toEqual([...GONE_PREFIXES].sort());
  });

  // These guard that the fixtures and GONE_PREFIXES stay in agreement. They do NOT
  // prove the routes resolve for these paths: GET() takes no arguments and Next's
  // file-system router does the matching, so there is nothing for a unit test to
  // drive. Real coverage is the live-check suite, which probes them over the wire.
  it("classifies the seven reported /business paths as gone", () => {
    expect(REPORTED_LEGACY_PATHS.filter(isGonePath)).toHaveLength(7);
  });

  it("classifies the reported /wp-content and /business 404 paths as gone", () => {
    expect(REPORTED_404_PATHS.filter(isGonePath)).toEqual([
      "/business/services/dissolution",
      "/wp-content/themes/Divi/images",
      "/wp-content/themes/Divi/includes/builder-5/images",
    ]);
  });

  it("does not classify live or redirected paths as gone", () => {
    for (const p of ["/", "/pricing", "/industries", "/payments/enterprise"]) {
      expect(isGonePath(p), `${p} must not be treated as gone`).toBe(false);
    }
    // Prefix matching must be path-segment aware, not a bare substring test.
    expect(isGonePath("/business-services")).toBe(false);
    expect(isGonePath("/wp-content-archive")).toBe(false);
  });
});
