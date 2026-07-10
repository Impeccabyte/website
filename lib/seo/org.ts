// Single source of truth for the one real business entity (Austin).
// See docs/superpowers/specs/2026-07-09-local-seo-locations-design.md.

export type JsonLd = Record<string, unknown>;

export const SITE_URL = "https://impeccabyte.com";
export const ORG_ID = `${SITE_URL}/#organization`;
export const ORG_NAME = "Impeccabyte";

/** The ONLY real, staffed address. Must match the footer + Google Business Profile character-for-character. */
export const AUSTIN_ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: "1606 Headway Circle Ste. 9317",
  addressLocality: "Austin",
  addressRegion: "TX",
  postalCode: "78754",
  addressCountry: "US",
} as const;

// ⚠️ CONFIRM — fill before launch. Leave null to omit from JSON-LD (never emit a fake value).
// TELEPHONE must match the Google Business Profile exactly, e.g. "+1-512-555-0100".
export const TELEPHONE: string | null = null;
// GEO is the Austin office lat/lng, e.g. { latitude: "30.401", longitude: "-97.699" }.
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

/** The single canonical business node. FinancialService is a LocalBusiness subtype — the accurate type. */
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
    address: { ...AUSTIN_ADDRESS },
    areaServed: AREA_SERVED,
    sameAs: SOCIALS,
    description:
      "Merchant services and payment processing for small businesses across Texas — transparent interchange-plus pricing, fast payouts, high-risk approvals, and dual pricing.",
  };
  if (TELEPHONE) node.telephone = TELEPHONE;
  if (GEO) node.geo = { "@type": "GeoCoordinates", ...GEO };
  return node;
}
