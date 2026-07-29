import { describe, it, expect } from "vitest";
import { LEGACY_REDIRECTS, REPORTED_LEGACY_PATHS, GONE_PREFIX } from "@/lib/seo/redirects";
import { sitemapPaths } from "@/lib/seo/sitemap";
import { SITE_URL } from "@/lib/seo/org";

/**
 * Network checks against a deployed site. Skipped unless SEO_CHECK_BASE_URL is set, so
 * `npm run test` stays offline and deterministic. Run after a deploy, and again after the
 * www DNS cutover (see docs/runbooks/2026-07-29-www-dns-cutover.md):
 *
 *   SEO_CHECK_BASE_URL=https://impeccabyte.com npx vitest run lib/seo/live-check.test.ts
 */
const BASE = process.env.SEO_CHECK_BASE_URL;
const WWW = BASE?.replace("://", "://www.");
const TIMEOUT = 30_000;

async function head(url: string) {
  try {
    const res = await fetch(url, { redirect: "manual" });
    return { status: res.status, location: res.headers.get("location") };
  } catch (e) {
    return { status: 0, location: null, error: String(e) };
  }
}

/** Follows redirects manually so hops can be counted. */
async function follow(start: string, max = 5) {
  let url = start;
  let hops = 0;
  for (; hops < max; hops++) {
    const r = await head(url);
    if (![301, 302, 307, 308].includes(r.status) || !r.location) break;
    url = new URL(r.location, url).toString();
  }
  return { url, hops };
}

async function canonicalOf(url: string) {
  const html = await (await fetch(url)).text();
  return html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? null;
}

/**
 * `https://x.com` and `https://x.com/` are the same URL (RFC 3986: an empty path
 * is equivalent to "/"). Next emits the bare origin for the root canonical unless
 * trailingSlash is true, while sitemapPaths() emits the trailing-slash form —
 * both correct, so compare them normalized.
 */
const sameUrl = (a: string | null, b: string) => a?.replace(/\/$/, "") === b.replace(/\/$/, "");

const LEGACY_CASES = LEGACY_REDIRECTS.flatMap((r) => [
  { src: r.source, dest: r.destination, hops: 1 },
  // Every URL Google reported ends in a slash. Next's trailingSlash normalizer strips it
  // before redirects() is consulted, so the slashed form reaches the same destination in
  // two hops rather than one. Verified behavior — see lib/seo/redirects.ts.
  { src: `${r.source}/`, dest: r.destination, hops: 2 },
]);

const GONE_PATHS = REPORTED_LEGACY_PATHS.filter(
  (p) => p === GONE_PREFIX || p.startsWith(`${GONE_PREFIX}/`)
);

describe.skipIf(!BASE)("live site indexing fixes", () => {
  it(
    "serves www over HTTPS and redirects it to the apex",
    async () => {
      const r = await head(`${WWW}/`);
      expect(r.status, `${WWW}/ is unreachable — DNS/TLS not cut over yet`).not.toBe(0);
      expect([301, 302, 307, 308]).toContain(r.status);
    },
    TIMEOUT
  );

  it.each(LEGACY_CASES)(
    "sends www$src to its mapped destination in at most $hops hop(s)",
    async ({ src, dest, hops }) => {
      const r = await follow(`${WWW}${src}`);
      expect(r.url).toBe(dest);
      expect(r.hops).toBeLessThanOrEqual(hops);
    },
    TIMEOUT
  );

  it.each(GONE_PATHS)(
    "returns 410 for the retired %s",
    async (path) => {
      // A trailing-slash normalization hop may come first; the final status is what matters.
      const { url } = await follow(`${BASE}${path}`);
      expect((await head(url)).status).toBe(410);
    },
    TIMEOUT
  );

  // The canonical is always the absolute apex URL (from metadataBase), whatever host we
  // probe — so localhost and production are both expected to emit the SITE_URL form.
  it.each(sitemapPaths())(
    "declares a self-referencing canonical on %s",
    async (url) => {
      const canonical = await canonicalOf(url.replace(SITE_URL, BASE!));
      if (url === `${SITE_URL}/`) {
        // Root only. Next emits the bare origin for "/" (resolve-url.js special-cases
        // pathname === "/"), while sitemapPaths() emits the slash form. Same URL per
        // RFC 3986, so compare normalized. Every other path must match exactly.
        expect(canonical?.replace(/\/$/, "")).toBe(url.replace(/\/$/, ""));
      } else {
        expect(canonical).toBe(url);
      }
    },
    TIMEOUT
  );

  it(
    "canonicalises the /?ref=ry.php duplicate to the homepage",
    async () => {
      const canonical = await canonicalOf(`${BASE}/?ref=ry.php`);
      const home = `${SITE_URL}/`;
      expect(sameUrl(canonical, home) ? home : canonical).toBe(home);
    },
    TIMEOUT
  );
});
