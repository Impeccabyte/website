import { describe, it, expect } from "vitest";
import { GET } from "@/app/business/[[...slug]]/route";
import { REPORTED_LEGACY_PATHS, GONE_PREFIX } from "@/lib/seo/redirects";

describe("retired /business section", () => {
  it("returns 410 Gone", async () => {
    const res = await GET();
    expect(res.status).toBe(410);
  });

  it("serves an HTML body so the page isn't blank for humans", async () => {
    const res = await GET();
    expect(res.headers.get("content-type")).toMatch(/text\/html/);
    await expect(res.text()).resolves.toMatch(/no longer/i);
  });

  it("tells crawlers not to index the tombstone", async () => {
    const res = await GET();
    expect(res.headers.get("x-robots-tag")).toBe("noindex");
  });

  // Guards that the fixture and GONE_PREFIX stay in agreement. It does NOT prove the
  // route resolves for these paths: GET() takes no arguments and Next's file-system
  // router does the matching, so there is nothing for a unit test to drive. Real
  // coverage is the runtime probe in the task's verification step (all seven end at 410).
  it("keeps seven reported /business paths classified under GONE_PREFIX", () => {
    const gone = REPORTED_LEGACY_PATHS.filter(
      (p) => p === GONE_PREFIX || p.startsWith(`${GONE_PREFIX}/`)
    );
    expect(gone).toHaveLength(7);
  });
});
