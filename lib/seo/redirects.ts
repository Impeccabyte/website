// Relative, not "@/lib/seo/org" — next.config.ts loads this file outside the app's
// module resolution, where the @/ alias is not guaranteed to resolve.
import { SITE_URL } from "./org";

/** The apex is canonical everywhere (metadataBase, sitemap, JSON-LD), so www redirects to it. */
export const WWW_HOST = "www.impeccabyte.com";

/**
 * Retired sections of the old site, each served 410 by an optional catch-all route
 * handler under app/<prefix>/[[...slug]]/route.ts. Prefix-based on purpose: it covers
 * paths Google has not reported yet, which is how /business/services/dissolution/ was
 * already handled the first time it appeared in an export.
 *
 * /wp-content, /wp-admin and /author are dead WordPress trees (theme and plugin
 * assets, the admin area, and author archives). /topic is the old blog taxonomy —
 * note that /topic/payment-gateway still REDIRECTS rather than 410s, because
 * redirects are evaluated before the filesystem, so a matching rule wins over the
 * catch-all. That precedence is asserted in redirects.test.ts.
 */
export const GONE_PREFIXES = ["/business", "/wp-content", "/wp-admin", "/author", "/topic"] as const;

/** True when a path falls under a retired section and has no redirect rule of its own. */
export function isGonePath(path: string): boolean {
  return GONE_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`));
}

/**
 * Every www path Google reported as crawled-not-indexed (export dated 2026-07-29),
 * normalized without the trailing slash. Checked in as a fixture so the test suite
 * fails if a rule is ever dropped. Do not edit without a new GSC export.
 */
export const REPORTED_LEGACY_PATHS: string[] = [
  "/about",
  "/homepage/about",
  "/business",
  "/business/services/articles-of-amendment",
  "/business/services/business-license-verification",
  "/business/services/trademark-registration",
  "/business/services/annual-report",
  "/business/services/registered-agent",
  "/business/services/foreign-qualification",
  "/payments/industry/ecommerce",
  "/payments/industry/specialty-markets",
  "/payments/industry/trade-services",
  "/payments/small-business",
  "/topic/payment-gateway",
  "/merchant-services/small-business",
  "/merchant-services/enterprise",
  "/merchant-services/industry",
  "/merchant-services/surcharge-and-dual-pricing-programs",
  "/how-to-choose-the-best-payment-gateway-in-5-minutes-austin-business-owners-guide",
  "/are-traditional-merchant-services-dead-do-businesses-still-need-payment-gateways",
];

/**
 * Every www path from the second GSC export — issue "Not found (404)", dated
 * 2026-07-29 — normalized without the trailing slash. Kept separate from
 * REPORTED_LEGACY_PATHS so each fixture keeps the provenance of its own export.
 *
 * Excludes the apex `_next/static/media/*.woff2` entries (stale build hashes; every
 * deploy rotates them and 404 is correct) and the app.impeccabyte.com entries (the
 * host is NXDOMAIN and unreachable from this repo).
 */
export const REPORTED_404_PATHS: string[] = [
  "/payments/industry/restaurants-and-bars",
  "/payments/industry/professional-services",
  "/payments/enterprise",
  "/merchant-services/industry/specialty-markets",
  "/merchant-services/industry/retail",
  "/business/services/dissolution",
  "/wp-content/themes/Divi/images",
  "/wp-content/themes/Divi/includes/builder-5/images",
];

/**
 * Every www path from the third GSC export — issue "Blocked by robots.txt", dated
 * 2026-07-29, all last crawled Feb-May 2026.
 *
 * The block itself is already resolved and needs no code: these were blocked by the
 * OLD WordPress site's robots.txt, back when www served it. Since the DNS cutover, www
 * redirects to the apex and inherits app/robots.ts, which disallows only /tools/. This
 * fixture exists to assert each URL now resolves somewhere sensible instead.
 *
 * Excludes the two app.impeccabyte.com entries (host is NXDOMAIN). `/wp-admin/*` is
 * recorded as `/wp-admin` — Search Console listed the robots.txt disallow *pattern*
 * there, not a real crawled URL.
 */
export const REPORTED_BLOCKED_PATHS: string[] = [
  "/",
  "/payments/industry",
  "/payments/industry/retail",
  "/payments/surcharge-and-dual-pricing-programs",
  "/payments/switch",
  "/policy/cookies",
  "/topic/entrepreneurship",
  "/author/wpauserbb4os9dm",
  "/wp-admin",
  "/wp-content/plugins/gravityforms/images",
  "/wp-content/plugins/gravityforms/assets/js/dist",
  "/business/services",
  "/business/services/virtual-address",
  "/business/services/assumed-business-name",
  "/business/services/reinstatement",
  "/business/services/ein",
];

const to = (path: string) => `${SITE_URL}${path}`;

/**
 * The old site published the SAME content tree under two commercial prefixes. Three
 * separate GSC exports have now each surfaced a mirror we had not mapped — first the
 * industry slugs, then /payments/enterprise, then
 * /payments/surcharge-and-dual-pricing-programs. Rather than patch whichever half
 * Google happens to report next, every rule below is generated under BOTH prefixes.
 * A rule that never fires costs nothing; a missing one costs a multi-week recrawl.
 */
const MIRRORED_PREFIXES = ["/payments", "/merchant-services"];

/** Old industry slug -> current /industries key, published under `<prefix>/industry/`. */
const LEGACY_INDUSTRY_SLUGS: Record<string, string> = {
  ecommerce: "ecommerce",
  retail: "retail",
  // "Specialty markets" was the old site's euphemism for high-risk categories.
  "specialty-markets": "highrisk",
  "trade-services": "services",
  "professional-services": "services",
  "restaurants-and-bars": "food",
};

/** Non-industry pages published directly under each commercial prefix. */
const MIRRORED_SUFFIXES: Record<string, string> = {
  "small-business": "/pricing",
  // Enterprise intent lands on /pricing, not /products/api: the API product is flagged
  // comingSoon and is not reachable from the nav, which is a weak destination for a
  // commercial legacy URL. Rate-shopping is the likelier intent behind "enterprise".
  enterprise: "/pricing",
  // "Switch [processors]" is rate-shopping too — /pricing carries the interchange-plus
  // explainer that is the actual switching pitch.
  switch: "/pricing",
  "surcharge-and-dual-pricing-programs": "/surcharge",
};

/** The old WordPress legal tree. Only /policy/cookies was reported; the siblings are
 *  generated because a WordPress legal section virtually always carries all three. */
const POLICY_PAGES: Record<string, string> = {
  cookies: "/cookies",
  privacy: "/privacy",
  terms: "/terms",
};

/** Every mirrored rule, generated under both commercial prefixes. */
function mirroredRedirects(): LegacyRedirect[] {
  return MIRRORED_PREFIXES.flatMap((prefix) => [
    { source: `${prefix}/industry`, destination: to("/industries"), permanent: true as const },
    ...Object.entries(LEGACY_INDUSTRY_SLUGS).map(([old, key]) => ({
      source: `${prefix}/industry/${old}`,
      destination: to(`/industries/${key}`),
      permanent: true as const,
    })),
    ...Object.entries(MIRRORED_SUFFIXES).map(([suffix, dest]) => ({
      source: `${prefix}/${suffix}`,
      destination: to(dest),
      permanent: true as const,
    })),
  ]);
}

function policyRedirects(): LegacyRedirect[] {
  return Object.entries(POLICY_PAGES).map(([slug, dest]) => ({
    source: `/policy/${slug}`,
    destination: to(dest),
    permanent: true as const,
  }));
}

/**
 * Old-site URLs that have a modern equivalent. Destinations are absolute apex URLs
 * so a legacy www request lands on its final destination in ONE hop rather than
 * bouncing through the www catch-all first.
 */
export type LegacyRedirect = {
  source: string;
  destination: string;
  permanent: true;
  /** Present only on the www catch-all — restricts the rule to the www host. */
  has?: { type: "host"; value: string }[];
};

export const LEGACY_REDIRECTS: LegacyRedirect[] = [
  { source: "/homepage/about", destination: to("/about"), permanent: true },
  ...mirroredRedirects(),
  ...policyRedirects(),
  // Lives under the /topic gone-prefix but keeps a rule: redirects are evaluated before
  // the filesystem, so this wins over the 410 catch-all. Every other /topic/* archive
  // has no equivalent and correctly falls through to the 410.
  { source: "/topic/payment-gateway", destination: to("/products/online"), permanent: true },
  // Two retired blog posts, both about gateways.
  {
    source: "/how-to-choose-the-best-payment-gateway-in-5-minutes-austin-business-owners-guide",
    destination: to("/products/online"),
    permanent: true,
  },
  {
    source: "/are-traditional-merchant-services-dead-do-businesses-still-need-payment-gateways",
    destination: to("/products/online"),
    permanent: true,
  },
];

/**
 * Full ordered list for next.config.ts. Specific legacy rules run first (one hop to
 * the final URL); the host-scoped catch-all then sweeps every remaining www path to
 * the apex. `/about` is deliberately NOT a legacy rule — it is a live apex route, so
 * the catch-all handles www/about correctly and a self-rule would loop.
 */
export function legacyRedirects(): LegacyRedirect[] {
  return [
    // Every reported legacy URL ends in a trailing slash, but LEGACY_REDIRECTS' sources
    // never do. Slashed legacy URLs therefore resolve in two hops, not one: Next's
    // built-in trailingSlash normalizer strips the slash BEFORE redirects() is
    // consulted at all, then the rule above fires on the now-unslashed path. Verified
    // against a real build (`npm run build && npm run start` + curl), not assumed — a
    // `/source/` sibling rule was tried and confirmed to never match, because the
    // slash is already gone by the time redirects() runs. It was removed as dead code.
    //
    // Two hops is the accepted, final state, not a gap to close. Googlebot follows up
    // to 10 redirects and passes link equity through the chain, so the extra hop is
    // immaterial. The only way to reach one hop is `skipTrailingSlashRedirect: true`,
    // which disables normalization sitewide and would let both `/about` and `/about/`
    // render as live pages — a duplicate-content regression, and strictly worse than
    // one extra hop on legacy URLs that are being deindexed anyway. Do not add
    // `skipTrailingSlashRedirect`, a `proxy.ts`, or any other mechanism to chase the
    // single hop here.
    ...LEGACY_REDIRECTS,
    {
      source: "/:path*",
      has: [{ type: "host", value: WWW_HOST }],
      destination: `${SITE_URL}/:path*`,
      permanent: true,
    },
  ];
}
