// Single source of truth for the one real business entity.
// Modelled as a Google service-area business: run from Austin, no public premises,
// merchants are served at their own location. See areaServed below.
// See docs/superpowers/specs/2026-07-09-local-seo-locations-design.md.

export type JsonLd = Record<string, unknown>;

export const SITE_URL = "https://impeccabyte.com";
export const ORG_ID = `${SITE_URL}/#organization`;
export const ORG_NAME = "Impeccabyte";

// ⚠️ There is deliberately NO `address` on the node below, and no address constant here.
// The business has no public premises: Austin is where it is run from, and the footer's
// Houston address only receives mail. Publishing either as a LocalBusiness address would
// assert a storefront that does not exist and can get the Google Business Profile
// suspended. The service area is expressed by areaServed instead. Do not add one back.

// TELEPHONE must match the Google Business Profile exactly. Null omits it from the
// JSON-LD (never emit a fake value). Mirrors the tel: link in site-footer.tsx.
export const TELEPHONE: string | null = "+1-877-584-2758";
// ⚠️ Keep GEO null. With no premises, the only coordinates on offer are a private
// residence — publishing those would expose a home address and imply a storefront.
// A service-area business is located by areaServed, not by a point.
export const GEO: { latitude: string; longitude: string } | null = null;

/** Real, live social profiles (mirrors components/site/site-footer.tsx). */
export const SOCIALS: string[] = [
  "https://www.facebook.com/impeccabyte/",
  "https://www.instagram.com/impeccabyte",
  "https://www.tiktok.com/@impeccabyte",
];

const AREA_SERVED = ["Austin", "Dallas", "San Antonio"].map((name) => ({
  "@type": "City",
  name,
  containedInPlace: { "@type": "State", name: "Texas" },
}));

/**
 * The single canonical business node. FinancialService is a LocalBusiness subtype — the
 * accurate type — carrying areaServed and no address, which is how schema.org models a
 * business that serves customers at their own locations.
 */
export function orgSchema(): JsonLd {
  const node: JsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "@id": ORG_ID,
    name: ORG_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/brand/impeccabyte-emblem.svg`,
    image: `${SITE_URL}/og/home.png`,
    priceRange: "$$",
    areaServed: AREA_SERVED,
    sameAs: SOCIALS,
    description:
      "Merchant services and payment processing for small businesses across Texas — transparent interchange-plus pricing, fast payouts, high-risk approvals, and dual pricing.",
  };
  if (TELEPHONE) node.telephone = TELEPHONE;
  if (GEO) node.geo = { "@type": "GeoCoordinates", ...GEO };
  return node;
}
