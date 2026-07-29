// Relative, not "@/lib/seo/org" — next.config.ts loads this file outside the app's
// module resolution, where the @/ alias is not guaranteed to resolve.
import { SITE_URL } from "./org";

/** The apex is canonical everywhere (metadataBase, sitemap, JSON-LD), so www redirects to it. */
export const WWW_HOST = "www.impeccabyte.com";

/** The retired business-formation section. Served 410 by app/business/[[...slug]]/route.ts. */
export const GONE_PREFIX = "/business";

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

const to = (path: string) => `${SITE_URL}${path}`;

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
  { source: "/payments/industry/ecommerce", destination: to("/industries/ecommerce"), permanent: true },
  // "Specialty markets" was the old site's euphemism for high-risk categories.
  { source: "/payments/industry/specialty-markets", destination: to("/industries/highrisk"), permanent: true },
  { source: "/payments/industry/trade-services", destination: to("/industries/services"), permanent: true },
  { source: "/payments/small-business", destination: to("/pricing"), permanent: true },
  { source: "/merchant-services/small-business", destination: to("/pricing"), permanent: true },
  { source: "/topic/payment-gateway", destination: to("/products/online"), permanent: true },
  { source: "/merchant-services/enterprise", destination: to("/products/api"), permanent: true },
  { source: "/merchant-services/industry", destination: to("/industries"), permanent: true },
  { source: "/merchant-services/surcharge-and-dual-pricing-programs", destination: to("/surcharge"), permanent: true },
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
    // Every reported legacy URL ends in a trailing slash, but this project runs with
    // trailingSlash: false. These `/source/` variants exist so a slashed request can
    // match a rule directly if it ever reaches the redirects() table with the slash
    // intact (e.g. under a future skipTrailingSlashRedirect + proxy.ts setup).
    //
    // KNOWN LIMITATION, confirmed empirically against `npm run start` (see
    // task-3-report.md, Step 7): Next 16.2.10's built-in trailing-slash normalizer
    // runs BEFORE redirects() is consulted and intercepts slashed requests
    // unconditionally, even when an exact-match `/source/` rule exists here. A slashed
    // legacy hit therefore still takes two hops (normalize to the unslashed local path,
    // then match the rule above) rather than one. Eliminating the extra hop requires
    // `skipTrailingSlashRedirect: true` plus a `proxy.ts` doing the trailing-slash
    // handling manually — out of scope for this task.
    //
    // LEGACY_REDIRECTS is kept as an exact, unbroken prefix here (rather than
    // interleaving each rule with its slash variant) because the test suite's
    // "orders specific rules before the catch-all" case asserts
    // `all.slice(0, LEGACY_REDIRECTS.length)).toEqual(LEGACY_REDIRECTS)`. Order among
    // non-conflicting sources has no functional effect — Next matches by exact source
    // string — so appending the slash variants afterward is equivalent to interleaving.
    ...LEGACY_REDIRECTS,
    ...LEGACY_REDIRECTS.map((r) => ({ ...r, source: `${r.source}/` })),
    {
      source: "/:path*",
      has: [{ type: "host", value: WWW_HOST }],
      destination: `${SITE_URL}/:path*`,
      permanent: true,
    },
  ];
}
