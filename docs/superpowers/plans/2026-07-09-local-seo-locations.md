# Local SEO — Locations Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an SEO locations layer (Austin/Dallas/San Antonio service-area pages + a hub) with single-entity JSON-LD, sitemap, robots, and internal linking — all server-rendered, no invented business facts.

**Architecture:** All testable logic lives in pure functions under `lib/seo/` (node-env unit tests). The `app/` pages and one tiny `components/seo/json-ld.tsx` component are thin wrappers that arrange that data. A single `FinancialService` (LocalBusiness subtype) node is emitted once in the root layout with a stable `@id`; every city page references it by `@id` and adds only `Service` + `BreadcrumbList` + `FAQPage` nodes — never a second business entity or a fake local address.

**Tech Stack:** Next.js 16.2.10 (App Router, native Metadata API), TypeScript, React 19, Vitest 3 (node env), Tailwind. No `next-seo` (not installed; not used).

## Global Constraints

- **One canonical business entity.** Exactly one `FinancialService`/`LocalBusiness` JSON-LD node sitewide, `@id` = `https://impeccabyte.com/#organization`. City pages reference it by `@id`; they never redeclare it or invent a local address/phone.
- **Only the real address:** `1606 Headway Circle Ste. 9317`, `Austin`, `TX`, `78754`, `US`. No Dallas/San Antonio street address, phone, or LocalBusiness node — ever.
- **NAP matches character-for-character** across footer, JSON-LD, and (later) Google Business Profile.
- **⚠️ CONFIRM values** (business phone, Austin lat/lng) ship as `null` constants; JSON-LD **omits** `telephone`/`geo` while they are `null` — never emits a fake value.
- **No `geo.region` / `geo.placename` / `geo.position` / ICBM meta tags** anywhere. Geo lives only inside `LocalBusiness` JSON-LD.
- **No invented testimonials.** Testimonial slots are clearly-labeled `⚠️ WRITE` placeholders.
- **No doorway pages:** city body copy is genuinely unique (< ~20% sentence overlap).
- **All primary content + JSON-LD server-rendered.** No client-only rendering of body copy or schema.
- Tests live under `lib/**/*.test.ts` (vitest config `include`), node environment. Run with `npm test`.
- Path alias: `@/` → repo root. `metadataBase` is already set in `app/layout.tsx`.

---

### Task 1: Org config + single-entity schema builder

**Files:**
- Create: `lib/seo/org.ts`
- Test: `lib/seo/org.test.ts`

**Interfaces:**
- Produces: `ORG_ID: string`, `SITE_URL: string`, `ORG_NAME: string`, `AUSTIN_ADDRESS` (object), `TELEPHONE: string | null`, `GEO: { latitude: string; longitude: string } | null`, `SOCIALS: string[]`, `type JsonLd = Record<string, unknown>`, `orgSchema(): JsonLd`.

- [ ] **Step 1: Write the failing test**

```ts
// lib/seo/org.test.ts
import { describe, it, expect } from "vitest";
import { ORG_ID, orgSchema, AUSTIN_ADDRESS } from "@/lib/seo/org";

describe("orgSchema", () => {
  it("is a single FinancialService node with the stable @id and real Austin NAP", () => {
    const s = orgSchema();
    expect(s["@type"]).toBe("FinancialService");
    expect(s["@id"]).toBe(ORG_ID);
    expect(s.address).toMatchObject({
      "@type": "PostalAddress",
      streetAddress: "1606 Headway Circle Ste. 9317",
      addressLocality: "Austin",
      addressRegion: "TX",
      postalCode: "78754",
      addressCountry: "US",
    });
    expect(AUSTIN_ADDRESS.streetAddress).toBe("1606 Headway Circle Ste. 9317");
  });

  it("lists Austin, Dallas, and San Antonio in areaServed", () => {
    const names = (orgSchema().areaServed as Array<{ name: string }>).map((c) => c.name);
    expect(names).toEqual(["Austin", "Dallas", "San Antonio"]);
  });

  it("omits telephone and geo while the CONFIRM constants are null", () => {
    const s = orgSchema();
    expect("telephone" in s).toBe(false);
    expect("geo" in s).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- lib/seo/org.test.ts`
Expected: FAIL — cannot resolve `@/lib/seo/org`.

- [ ] **Step 3: Write the implementation**

```ts
// lib/seo/org.ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- lib/seo/org.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/seo/org.ts lib/seo/org.test.ts
git commit -m "feat(seo): single-entity org schema builder with CONFIRM-gated phone/geo"
```

---

### Task 2: Schema builders (serialize, service, breadcrumb, FAQ)

**Files:**
- Create: `lib/seo/schema.ts`
- Test: `lib/seo/schema.test.ts`

**Interfaces:**
- Consumes: `ORG_ID`, `SITE_URL`, `type JsonLd` from `@/lib/seo/org`.
- Produces:
  - `serializeJsonLd(data: JsonLd | JsonLd[]): string`
  - `serviceSchema(cityName: string): JsonLd`
  - `breadcrumbSchema(items: { name: string; path: string }[]): JsonLd`
  - `faqSchema(faqs: { q: string; a: string }[]): JsonLd`

- [ ] **Step 1: Write the failing test**

```ts
// lib/seo/schema.test.ts
import { describe, it, expect } from "vitest";
import { serializeJsonLd, serviceSchema, breadcrumbSchema, faqSchema } from "@/lib/seo/schema";
import { ORG_ID } from "@/lib/seo/org";

describe("serializeJsonLd", () => {
  it("escapes '<' to prevent breaking out of the script tag", () => {
    expect(serializeJsonLd({ a: "</script><b>" })).toBe('{"a":"\\u003c/script>\\u003cb>"}');
  });
});

describe("serviceSchema", () => {
  it("references the org by @id and scopes areaServed to the city", () => {
    const s = serviceSchema("Dallas");
    expect(s["@type"]).toBe("Service");
    expect(s.provider).toEqual({ "@id": ORG_ID });
    expect(s.areaServed).toEqual({ "@type": "City", name: "Dallas" });
    expect(s.serviceType).toBe("Merchant services / payment processing");
  });
});

describe("breadcrumbSchema", () => {
  it("builds absolute, positioned list items", () => {
    const s = breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Locations", path: "/locations" },
    ]);
    const items = s.itemListElement as Array<Record<string, unknown>>;
    expect(items).toHaveLength(2);
    expect(items[0]).toMatchObject({ position: 1, name: "Home", item: "https://impeccabyte.com/" });
    expect(items[1]).toMatchObject({ position: 2, name: "Locations", item: "https://impeccabyte.com/locations" });
  });
});

describe("faqSchema", () => {
  it("maps each Q&A to a Question/Answer pair", () => {
    const s = faqSchema([{ q: "Open?", a: "Yes." }]);
    expect(s["@type"]).toBe("FAQPage");
    const q = (s.mainEntity as Array<Record<string, unknown>>)[0];
    expect(q).toMatchObject({ "@type": "Question", name: "Open?" });
    expect(q.acceptedAnswer).toMatchObject({ "@type": "Answer", text: "Yes." });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- lib/seo/schema.test.ts`
Expected: FAIL — cannot resolve `@/lib/seo/schema`.

- [ ] **Step 3: Write the implementation**

```ts
// lib/seo/schema.ts
import { ORG_ID, SITE_URL, type JsonLd } from "@/lib/seo/org";

/** JSON for a <script type="application/ld+json"> body, with '<' escaped so it can't break out of the tag. */
export function serializeJsonLd(data: JsonLd | JsonLd[]): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function serviceSchema(cityName: string): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Merchant services / payment processing",
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "City", name: cityName },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}

export function faqSchema(faqs: { q: string; a: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- lib/seo/schema.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/seo/schema.ts lib/seo/schema.test.ts
git commit -m "feat(seo): service/breadcrumb/faq schema builders + JSON-LD serializer"
```

---

### Task 3: `<JsonLd />` server component

**Files:**
- Create: `components/seo/json-ld.tsx`

**Interfaces:**
- Consumes: `serializeJsonLd`, `type JsonLd` from `@/lib/seo`.
- Produces: `export function JsonLd({ data }: { data: JsonLd | JsonLd[] }): JSX.Element`.

> No unit test: vitest is node-env and only includes `lib/**/*.test.ts`. The escaping logic it depends on is already tested in Task 2. This component is verified by `next build` (Task 10) and by inspecting served HTML.

- [ ] **Step 1: Write the component**

```tsx
// components/seo/json-ld.tsx
import { serializeJsonLd, type JsonLd as JsonLdData } from "@/lib/seo/schema";

/** Renders one or more schema.org nodes as a server-rendered ld+json script. */
export function JsonLd({ data }: { data: JsonLdData | JsonLdData[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
```

Note: re-export `type JsonLd` is sourced from `schema.ts` which re-exports from `org.ts`; if `schema.ts` does not re-export the type, import it from `@/lib/seo/org` instead. Use whichever resolves — both files export nothing conflicting.

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors referencing `components/seo/json-ld.tsx`.

- [ ] **Step 3: Commit**

```bash
git add components/seo/json-ld.tsx
git commit -m "feat(seo): server-rendered JsonLd component"
```

---

### Task 4: City content data + page helpers

**Files:**
- Create: `lib/seo/locations.ts`
- Test: `lib/seo/locations.test.ts`

**Interfaces:**
- Consumes: `serviceSchema`, `breadcrumbSchema`, `faqSchema` from `@/lib/seo/schema`; `type JsonLd` from `@/lib/seo/org`; `ProductKey`, `SolutionKey` from `@/lib/data`.
- Produces:
  - `type City = { slug: string; name: string; metro: string; districts: string[]; verticals: string[]; intro: string[]; wedge: string; products: ProductKey[]; industries: SolutionKey[]; faqs: { q: string; a: string }[]; metaTitle: string; metaDescription: string }`
  - `CITIES: Record<string, City>`
  - `citySlugs(): string[]`
  - `getCity(slug: string): City | undefined`
  - `cityCanonical(slug: string): string` (returns `/locations/${slug}`)
  - `cityJsonLdNodes(city: City): JsonLd[]` (Service + Breadcrumb + FAQPage)

> Districts, verticals, and the honest "no local office outside Austin" answers are public, verifiable facts — real content, not placeholders. Testimonials are intentionally NOT in this data; they are added as `⚠️ WRITE` placeholders in the page (Task 8).

- [ ] **Step 1: Write the failing test**

```ts
// lib/seo/locations.test.ts
import { describe, it, expect } from "vitest";
import { CITIES, citySlugs, getCity, cityCanonical, cityJsonLdNodes } from "@/lib/seo/locations";

describe("CITIES", () => {
  it("has exactly the three target cities", () => {
    expect(citySlugs().sort()).toEqual(["austin", "dallas", "san-antonio"]);
  });

  it("gives each city a unique metaTitle and >=4 FAQs", () => {
    const titles = citySlugs().map((s) => getCity(s)!.metaTitle);
    expect(new Set(titles).size).toBe(3);
    for (const s of citySlugs()) expect(getCity(s)!.faqs.length).toBeGreaterThanOrEqual(4);
  });

  it("keeps intro copy unique across cities (< 20% sentence overlap)", () => {
    const sentences = (c: string) =>
      new Set(getCity(c)!.intro.join(" ").split(/(?<=[.!?])\s+/).map((x) => x.trim().toLowerCase()).filter(Boolean));
    const pairs: [string, string][] = [["austin", "dallas"], ["austin", "san-antonio"], ["dallas", "san-antonio"]];
    for (const [a, b] of pairs) {
      const A = sentences(a), B = sentences(b);
      const overlap = [...A].filter((x) => B.has(x)).length / Math.max(A.size, B.size);
      expect(overlap).toBeLessThan(0.2);
    }
  });

  it("answers 'office in {city}' honestly for non-Austin (mentions Austin, claims no local office)", () => {
    for (const s of ["dallas", "san-antonio"]) {
      const officeFaq = getCity(s)!.faqs.find((f) => /office in/i.test(f.q));
      expect(officeFaq).toBeDefined();
      expect(officeFaq!.a).toMatch(/Austin/);
      expect(officeFaq!.a).toMatch(/no|don't|not have/i);
    }
  });

  it("cityCanonical returns the self-referencing path", () => {
    expect(cityCanonical("dallas")).toBe("/locations/dallas");
  });

  it("cityJsonLdNodes emits Service + BreadcrumbList + FAQPage, no fake local address", () => {
    const nodes = cityJsonLdNodes(getCity("dallas")!);
    const types = nodes.map((n) => n["@type"]);
    expect(types).toEqual(["Service", "BreadcrumbList", "FAQPage"]);
    // No node may carry a PostalAddress for Dallas.
    expect(JSON.stringify(nodes)).not.toMatch(/PostalAddress/);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- lib/seo/locations.test.ts`
Expected: FAIL — cannot resolve `@/lib/seo/locations`.

- [ ] **Step 3: Write the implementation**

```ts
// lib/seo/locations.ts
import type { ProductKey, SolutionKey } from "@/lib/data";
import { serviceSchema, breadcrumbSchema, faqSchema } from "@/lib/seo/schema";
import type { JsonLd } from "@/lib/seo/org";

export type City = {
  slug: string;
  name: string;
  metro: string;
  districts: string[];
  verticals: string[];
  intro: string[];
  wedge: string;
  products: ProductKey[];
  industries: SolutionKey[];
  faqs: { q: string; a: string }[];
  metaTitle: string;
  metaDescription: string;
};

export const CITIES: Record<string, City> = {
  austin: {
    slug: "austin",
    name: "Austin",
    metro: "Austin",
    districts: ["Downtown & the 2nd Street District", "East Austin", "South Congress (SoCo)", "The Domain", "Rainey Street", "Mueller"],
    verticals: ["startups & funded DTC brands", "food & beverage", "high-risk retail (CBD, hemp, vape)", "boutiques & specialty retail"],
    intro: [
      "Impeccabyte is headquartered in Austin — our team works out of 1606 Headway Circle in the Tech Ridge corridor of North Austin — so the merchants we serve here are also our neighbors.",
      "From food trailers and full-service kitchens on Rainey Street to DTC brands scaling out of The Domain and CBD shops along East Austin, we board Austin businesses on transparent interchange-plus pricing with next-day funding that keeps pace with a fast-moving city.",
    ],
    wedge: "Send us a recent processing statement and we'll break down, line by line, what you're actually paying today — free, no obligation, and usually back to you within a business day.",
    products: ["payments", "pos", "online"],
    industries: ["food", "highrisk", "retail"],
    faqs: [
      { q: "Do you have an office in Austin?", a: "Yes. Austin is our home base — 1606 Headway Circle Ste. 9317, Austin, TX 78754 — so we meet local merchants on-site as well as remotely." },
      { q: "Can you approve a high-risk merchant account in Austin?", a: "Yes. We specialize in high-risk approvals for Austin's CBD, hemp, and vape retailers, plus other hard-to-place verticals, with underwriting that understands the category." },
      { q: "How does dual pricing work for an Austin restaurant?", a: "Dual pricing shows a card price and a lower cash price at checkout, so the card-processing cost is passed through transparently. We set it up compliantly and handle the signage and receipt disclosures." },
      { q: "What does it cost to switch processors?", a: "Nothing to look. We start with a free statement analysis and only recommend switching if we can genuinely beat what you pay now — there's no switching fee from us." },
      { q: "How fast are payouts?", a: "Next-day funding is available for qualifying Austin accounts, so your deposits keep pace with day-to-day cash flow." },
    ],
    metaTitle: "Merchant Services in Austin, TX — Credit Card Processing | Impeccabyte",
    metaDescription: "Austin-based merchant services with transparent interchange-plus pricing, next-day funding, and high-risk approvals for CBD, food & beverage, and DTC brands.",
  },
  dallas: {
    slug: "dallas",
    name: "Dallas",
    metro: "Dallas–Fort Worth",
    districts: ["Deep Ellum", "Bishop Arts District", "Uptown & Victory Park", "the Fort Worth Stockyards", "Frisco & Plano", "Las Colinas"],
    verticals: ["e-commerce & DTC brands", "professional & B2B services", "retail & showrooms"],
    intro: [
      "Dallas–Fort Worth is one of the largest, most competitive merchant markets in the country, and Impeccabyte serves it as a dedicated payments partner — remotely and on-site as needed — from our Austin base.",
      "We work with DFW e-commerce and DTC brands shipping out of Frisco and Plano, professional and B2B service firms across Uptown and Las Colinas, and retailers from Bishop Arts to the Fort Worth Stockyards, pairing interchange-plus pricing with the checkout and invoicing tools those businesses actually run on.",
    ],
    wedge: "Growing in a market this crowded means margins matter — send us a recent statement and we'll show you, line by line, exactly where your DFW processing costs are going. Free and no obligation.",
    products: ["online", "invoicing", "recurring"],
    industries: ["ecommerce", "services", "retail"],
    faqs: [
      { q: "Do you have an office in Dallas?", a: "No — we don't have a Dallas storefront. Impeccabyte is Austin-based and serves Dallas–Fort Worth merchants remotely, with on-site visits arranged when they help." },
      { q: "Can you support a Dallas e-commerce brand across multiple sales channels?", a: "Yes. We connect online checkout, payment links, and recurring billing so a DFW brand can take payments on its site, over email, and on subscriptions from one processor." },
      { q: "How do you price B2B and professional services in DFW?", a: "On transparent interchange-plus, with invoicing and card-on-file tools built for higher-ticket, net-terms billing common to Dallas professional-services firms." },
      { q: "Can you help a Dallas business lower its effective rate?", a: "Often, yes. Our free statement analysis compares your current effective rate against interchange-plus and flags junk fees — with no switching fee to move." },
    ],
    metaTitle: "Merchant Services in Dallas, TX — Credit Card Processing | Impeccabyte",
    metaDescription: "Merchant services for Dallas–Fort Worth e-commerce, B2B, and retail — transparent interchange-plus pricing, multi-channel checkout, and a free statement analysis.",
  },
  "san-antonio": {
    slug: "san-antonio",
    name: "San Antonio",
    metro: "San Antonio",
    districts: ["the Pearl", "the River Walk", "Southtown", "Alamo Heights", "Stone Oak", "downtown"],
    verticals: ["hospitality & tourism", "healthcare & personal care", "retail", "military-adjacent businesses"],
    intro: [
      "San Antonio's economy runs on hospitality, healthcare, and the steady rhythm of a major military community, and Impeccabyte serves the metro's merchants as a payments partner from our Austin base — an easy drive down I-35 when on-site support helps.",
      "We board River Walk and Pearl restaurants, Southtown boutiques, Stone Oak and Alamo Heights clinics and personal-care studios, and the small businesses that serve the JBSA community, with interchange-plus pricing and point-of-sale and recurring-billing tools suited to each.",
    ],
    wedge: "Whether you run a River Walk kitchen or a Stone Oak clinic, we'll analyze a recent statement and show you exactly what you're paying — free, no obligation, and plain-English.",
    products: ["pos", "recurring", "payments"],
    industries: ["food", "services", "retail"],
    faqs: [
      { q: "Do you have an office in San Antonio?", a: "No — we don't keep a San Antonio office. Impeccabyte is Austin-based and serves San Antonio merchants remotely, with on-site visits down I-35 when they're useful." },
      { q: "Do you work with River Walk and Pearl restaurants?", a: "Yes. We set up in-person POS, tipping, and dual pricing for San Antonio hospitality, with next-day funding to smooth tourism-driven swings in volume." },
      { q: "Can you handle recurring billing for a San Antonio clinic or studio?", a: "Yes. We support card-on-file and recurring billing for healthcare and personal-care businesses across Stone Oak and Alamo Heights, with compliant storage of payment details." },
      { q: "What does a rate review cost?", a: "Nothing. We start with a free statement analysis for any San Antonio business and only recommend a switch if we can beat your current pricing — no switching fee." },
    ],
    metaTitle: "Merchant Services in San Antonio, TX — Credit Card Processing | Impeccabyte",
    metaDescription: "Merchant services for San Antonio hospitality, healthcare, and retail — interchange-plus pricing, POS and recurring billing, and a free, no-obligation statement analysis.",
  },
};

export function citySlugs(): string[] {
  return Object.keys(CITIES);
}

export function getCity(slug: string): City | undefined {
  return CITIES[slug];
}

export function cityCanonical(slug: string): string {
  return `/locations/${slug}`;
}

export function cityJsonLdNodes(city: City): JsonLd[] {
  return [
    serviceSchema(city.name),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Locations", path: "/locations" },
      { name: city.name, path: cityCanonical(city.slug) },
    ]),
    faqSchema(city.faqs),
  ];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- lib/seo/locations.test.ts`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/seo/locations.ts lib/seo/locations.test.ts
git commit -m "feat(seo): unique per-city content + city JSON-LD node builder"
```

---

### Task 5: Emit the single org node sitewide (root layout)

**Files:**
- Modify: `app/layout.tsx` (add `<JsonLd data={orgSchema()} />` inside `<body>`)

**Interfaces:**
- Consumes: `orgSchema` from `@/lib/seo/org`, `JsonLd` from `@/components/seo/json-ld`.

> The org node carries the real Austin NAP/geo and is present on every route (including Austin) — this is how the single-entity model is satisfied sitewide; no page redeclares it. Verified by build + served HTML (no lib unit test for `app/`).

- [ ] **Step 1: Add imports**

At the top of `app/layout.tsx`, alongside existing imports:

```tsx
import { JsonLd } from "@/components/seo/json-ld";
import { orgSchema } from "@/lib/seo/org";
```

- [ ] **Step 2: Render the node once, at the end of `<body>`**

Add immediately before the existing HubSpot `<Script … id="hs-script-loader" />`:

```tsx
        <JsonLd data={orgSchema()} />
```

- [ ] **Step 3: Build and verify exactly one org node renders**

Run:
```bash
npm run build && npm start &
sleep 4
curl -s http://localhost:3000/ | grep -c '"@id":"https://impeccabyte.com/#organization"'
curl -s http://localhost:3000/ | grep -c '"streetAddress":"1606 Headway Circle Ste. 9317"'
kill %1
```
Expected: first count = `1`, second count = `1`. (No `telephone`/`geo` present while CONFIRM constants are null.)

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx
git commit -m "feat(seo): emit single FinancialService org node in root layout"
```

---

### Task 6: sitemap + robots

**Files:**
- Create: `lib/seo/sitemap.ts` (pure route list — testable)
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`
- Test: `lib/seo/sitemap.test.ts`

**Interfaces:**
- Consumes: `SITE_URL` from `@/lib/seo/org`; `citySlugs` from `@/lib/seo/locations`; `productOrder`, `solutionNavOrder` from `@/lib/data`; `MetadataRoute` from `next`.
- Produces: `sitemapPaths(): string[]` (absolute URLs, deduped).

- [ ] **Step 1: Write the failing test**

```ts
// lib/seo/sitemap.test.ts
import { describe, it, expect } from "vitest";
import { sitemapPaths } from "@/lib/seo/sitemap";

describe("sitemapPaths", () => {
  it("includes the locations hub and all three city pages as absolute URLs", () => {
    const urls = sitemapPaths();
    expect(urls).toContain("https://impeccabyte.com/locations");
    expect(urls).toContain("https://impeccabyte.com/locations/austin");
    expect(urls).toContain("https://impeccabyte.com/locations/dallas");
    expect(urls).toContain("https://impeccabyte.com/locations/san-antonio");
  });

  it("includes core static routes and every product/industry page", () => {
    const urls = sitemapPaths();
    expect(urls).toContain("https://impeccabyte.com/");
    expect(urls).toContain("https://impeccabyte.com/pricing");
    expect(urls).toContain("https://impeccabyte.com/products/payments");
    expect(urls).toContain("https://impeccabyte.com/industries/highrisk");
  });

  it("has no duplicates", () => {
    const urls = sitemapPaths();
    expect(new Set(urls).size).toBe(urls.length);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- lib/seo/sitemap.test.ts`
Expected: FAIL — cannot resolve `@/lib/seo/sitemap`.

- [ ] **Step 3: Write the pure route list**

```ts
// lib/seo/sitemap.ts
import { SITE_URL } from "@/lib/seo/org";
import { citySlugs } from "@/lib/seo/locations";
import { productOrder, solutionNavOrder } from "@/lib/data";

/** Every indexable path, as absolute URLs. Single source for app/sitemap.ts. */
export function sitemapPaths(): string[] {
  const paths = [
    "/",
    "/about",
    "/partnerships",
    "/pricing",
    "/contact",
    "/chamber",
    "/privacy",
    "/terms",
    "/cookies",
    "/locations",
    ...citySlugs().map((s) => `/locations/${s}`),
    ...productOrder.map((k) => `/products/${k}`),
    ...solutionNavOrder.map((k) => `/industries/${k}`),
  ];
  return [...new Set(paths)].map((p) => `${SITE_URL}${p === "/" ? "/" : p}`);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- lib/seo/sitemap.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Write `app/sitemap.ts`**

```ts
// app/sitemap.ts
import type { MetadataRoute } from "next";
import { sitemapPaths } from "@/lib/seo/sitemap";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return sitemapPaths().map((url) => ({
    url,
    lastModified: now,
    changeFrequency: "monthly",
    priority: url.endsWith("/locations") || url.includes("/locations/") ? 0.8 : 0.7,
  }));
}
```

- [ ] **Step 6: Write `app/robots.ts`**

```ts
// app/robots.ts
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/org";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
```

- [ ] **Step 7: Verify the routes build and serve**

Run:
```bash
npm run build && npm start &
sleep 4
curl -s http://localhost:3000/sitemap.xml | grep -c "/locations/san-antonio"
curl -s http://localhost:3000/robots.txt | grep -c "Sitemap: https://impeccabyte.com/sitemap.xml"
kill %1
```
Expected: both counts = `1`.

- [ ] **Step 8: Commit**

```bash
git add lib/seo/sitemap.ts lib/seo/sitemap.test.ts app/sitemap.ts app/robots.ts
git commit -m "feat(seo): dynamic sitemap + robots including the locations layer"
```

---

### Task 7: Locations hub page

**Files:**
- Create: `app/locations/page.tsx`

**Interfaces:**
- Consumes: `CITIES`, `citySlugs`, `getCity` from `@/lib/seo/locations`; `breadcrumbSchema` from `@/lib/seo/schema`; `JsonLd`, `Container`, `Eyebrow`, `ButtonLink`, `ogImages`.

> Follow existing page conventions: `Container` from `@/components/site/container`, `Eyebrow` from `@/components/ui/eyebrow`, `ButtonLink` from `@/components/ui/button-link`, `ogImages` from `@/lib/og/meta`, `DarkCTA` from `@/components/site/dark-cta`. Statically rendered (no dynamic APIs).

- [ ] **Step 1: Write the page**

```tsx
// app/locations/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DarkCTA } from "@/components/site/dark-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { citySlugs, getCity } from "@/lib/seo/locations";
import { ogImages } from "@/lib/og/meta";

export const metadata: Metadata = {
  title: "Areas We Serve — Texas Merchant Services",
  description:
    "Impeccabyte serves merchants across Texas — Austin, Dallas–Fort Worth, and San Antonio — with transparent interchange-plus pricing and a free statement analysis.",
  alternates: { canonical: "/locations" },
  ...ogImages("home", "Impeccabyte — Texas merchant services"),
};

export default function LocationsHubPage() {
  const cities = citySlugs().map((s) => getCity(s)!);
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Locations", path: "/locations" },
        ])}
      />
      <section className="px-6 pt-16 pb-12">
        <Container>
          <Eyebrow>Areas we serve</Eyebrow>
          <h1
            className="mt-4 font-display font-semibold text-ink-900"
            style={{ fontSize: "clamp(36px, 4.6vw, 54px)", lineHeight: 1.05 }}
          >
            Merchant services <span className="em">across Texas</span>.
          </h1>
          <p className="mt-5 max-w-[560px] text-[19px] leading-relaxed text-ink-600">
            We&rsquo;re Austin-based and serve businesses statewide — from the Hill Country to
            Dallas–Fort Worth and San Antonio. Pick your metro to see how we help local merchants.
          </p>
        </Container>
      </section>

      <section className="px-6 pb-20">
        <Container>
          <div className="grid gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
            {cities.map((c) => (
              <Link
                key={c.slug}
                href={`/locations/${c.slug}`}
                className="group rounded-2xl border border-border-default bg-white p-7 transition-colors hover:border-clay-200"
              >
                <h2 className="text-[22px] font-bold text-ink-900">{c.name}</h2>
                <p className="mt-1 text-[14px] font-medium text-clay-600">{c.metro}</p>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-600">{c.intro[0]}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[15px] font-semibold text-clay-600">
                  {c.name} merchant services{" "}
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <DarkCTA
        titleA="Not sure where to"
        titleEm="start?"
        body="Send us a recent processing statement and we'll show you exactly what you're paying — free, no obligation."
        primary={{ label: "Get a Quote", href: "/contact" }}
        secondary={{ label: "See pricing", href: "/pricing" }}
      />
    </>
  );
}
```

- [ ] **Step 2: Build and verify**

Run:
```bash
npm run build && npm start &
sleep 4
curl -s http://localhost:3000/locations | grep -c 'Merchant services'
curl -s http://localhost:3000/locations | grep -c '"@type":"BreadcrumbList"'
kill %1
```
Expected: both counts ≥ `1`.

- [ ] **Step 3: Commit**

```bash
git add app/locations/page.tsx
git commit -m "feat(seo): Areas We Serve locations hub page"
```

---

### Task 8: Dynamic city page

**Files:**
- Create: `app/locations/[city]/page.tsx`

**Interfaces:**
- Consumes: `getCity`, `citySlugs`, `cityCanonical`, `cityJsonLdNodes` from `@/lib/seo/locations`; `PRODUCTS`, `SOLUTIONS` from `@/lib/data`; `JsonLd`, `Container`, `Eyebrow`, `DarkCTA`, `ButtonLink`, `ogImages`, `notFound`.

- [ ] **Step 1: Write the page**

```tsx
// app/locations/[city]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DarkCTA } from "@/components/site/dark-cta";
import { ButtonLink } from "@/components/ui/button-link";
import { JsonLd } from "@/components/seo/json-ld";
import { getCity, citySlugs, cityCanonical, cityJsonLdNodes } from "@/lib/seo/locations";
import { PRODUCTS, SOLUTIONS } from "@/lib/data";
import { ogImages } from "@/lib/og/meta";

export function generateStaticParams() {
  return citySlugs().map((city) => ({ city }));
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params;
  const c = getCity(city);
  if (!c) return {};
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: { canonical: cityCanonical(c.slug) },
    ...ogImages("home", `Impeccabyte — merchant services in ${c.name}, TX`),
  };
}

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const c = getCity(city);
  if (!c) notFound();

  return (
    <>
      <JsonLd data={cityJsonLdNodes(c)} />

      {/* Hero + local intro */}
      <section className="px-6 pt-16 pb-10">
        <Container>
          <Eyebrow>{c.metro}</Eyebrow>
          <h1
            className="mt-4 font-display font-semibold text-ink-900"
            style={{ fontSize: "clamp(34px, 4.4vw, 52px)", lineHeight: 1.06 }}
          >
            Merchant Services in <span className="em">{c.name}, TX</span>.
          </h1>
          <div className="mt-5 max-w-[620px] space-y-4 text-[18px] leading-relaxed text-ink-600">
            {c.intro.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          <div className="mt-8">
            <ButtonLink href="/contact" variant="primary" size="lg">
              Get a Quote
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* The wedge */}
      <section className="px-6 py-10">
        <Container>
          <div className="rounded-2xl border border-border-default bg-white p-8">
            <h2 className="text-[24px] font-bold text-ink-900">A free look at what you actually pay</h2>
            <p className="mt-3 max-w-[640px] text-[16px] leading-relaxed text-ink-600">{c.wedge}</p>
          </div>
        </Container>
      </section>

      {/* Districts + verticals */}
      <section className="px-6 py-10">
        <Container>
          <h2 className="text-[24px] font-bold text-ink-900">Who we serve in {c.name}</h2>
          <p className="mt-3 max-w-[640px] text-[16px] leading-relaxed text-ink-600">
            We work with {c.metro} businesses across {c.districts.join(", ")} — with particular depth in{" "}
            {c.verticals.join(", ")}.
          </p>
        </Container>
      </section>

      {/* Relevant products + industries (internal links) */}
      <section className="px-6 py-10">
        <Container>
          <h2 className="text-[24px] font-bold text-ink-900">Built for how {c.name} takes payments</h2>
          <div className="mt-5 flex flex-wrap gap-2.5">
            {c.products.map((k) => (
              <Link
                key={k}
                href={`/products/${k}`}
                className="rounded-pill border border-border-default bg-white px-4 py-2 text-[14.5px] font-medium text-ink-700 hover:border-clay-200"
              >
                {PRODUCTS[k].nav}
              </Link>
            ))}
            {c.industries.map((k) => (
              <Link
                key={k}
                href={`/industries/${k}`}
                className="rounded-pill border border-border-default bg-white px-4 py-2 text-[14.5px] font-medium text-ink-700 hover:border-clay-200"
              >
                {SOLUTIONS[k].nav}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Local proof — ⚠️ WRITE: replace with a real, approved testimonial from a merchant in this metro.
          Do NOT invent testimonials. Until then, this section renders nothing. */}

      {/* City FAQ (mirrors FAQPage JSON-LD) */}
      <section className="px-6 py-10">
        <Container>
          <h2 className="text-[24px] font-bold text-ink-900">{c.name} merchant services — FAQ</h2>
          <dl className="mt-6 max-w-[720px] space-y-6">
            {c.faqs.map((f) => (
              <div key={f.q}>
                <dt className="text-[17px] font-semibold text-ink-900">{f.q}</dt>
                <dd className="mt-1.5 text-[15.5px] leading-relaxed text-ink-600">{f.a}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* Cross-link to the other two metros */}
      <section className="px-6 pb-14">
        <Container>
          <p className="text-[14px] text-ink-500">
            Also serving{" "}
            {citySlugs()
              .filter((s) => s !== c.slug)
              .map((s, i, arr) => (
                <span key={s}>
                  <Link href={`/locations/${s}`} className="font-medium text-clay-600 hover:text-clay-700">
                    {getCity(s)!.name}
                  </Link>
                  {i < arr.length - 1 ? " and " : ""}
                </span>
              ))}
            .
          </p>
        </Container>
      </section>

      <DarkCTA
        titleA={`Ready to price your ${c.name} business?`}
        titleEm="Let's talk."
        body="Tell us about your business and we'll build a custom interchange-plus quote — usually within a business day."
        primary={{ label: "Get a Quote", href: "/contact" }}
        secondary={{ label: "See pricing", href: "/pricing" }}
      />
    </>
  );
}
```

Note on `DarkCTA` props: confirm the component's prop names against `components/site/dark-cta.tsx` before writing (existing usages pass `titleA`, `titleEm`, `body`, `primary`, `secondary`). If `titleA` does not accept a full sentence gracefully, split the string to fit the component's layout.

- [ ] **Step 2: Build and verify all three cities render uniquely with correct schema**

Run:
```bash
npm run build && npm start &
sleep 4
for city in austin dallas san-antonio; do
  echo "== $city =="
  curl -s "http://localhost:3000/locations/$city" | grep -c '"@type":"Service"'
  curl -s "http://localhost:3000/locations/$city" | grep -c '"@type":"FAQPage"'
  curl -s "http://localhost:3000/locations/$city" | grep -o '<title>[^<]*</title>'
done
# Guardrail: non-Austin pages must NOT contain a PostalAddress inside their page-level Service/FAQ nodes.
curl -s http://localhost:3000/locations/dallas | grep -c 'Merchant Services in Dallas'
kill %1
```
Expected: each city shows `1` Service node, `1` FAQPage node, a unique `<title>`, and the Dallas H1 count = `1`.

- [ ] **Step 3: Commit**

```bash
git add "app/locations/[city]/page.tsx"
git commit -m "feat(seo): dynamic city service-area pages with Service/Breadcrumb/FAQ schema"
```

---

### Task 9: Add "Locations" to nav + footer

**Files:**
- Modify: `components/site/site-header.tsx` (desktop nav + mobile drawer)
- Modify: `components/site/site-footer.tsx` (Company column)

**Interfaces:** none produced; internal-linking wiring only.

- [ ] **Step 1: Desktop nav link**

In `components/site/site-header.tsx`, inside the desktop `<nav>` (after the `Pricing` `NavLink`, before `About`), add:

```tsx
          <NavLink href="/locations" onEnter={() => setMega(null)}>Locations</NavLink>
```

- [ ] **Step 2: Mobile drawer link**

In the `MobileDrawer` component, alongside the other `DrawerRow`s (after `Pricing`, before `About`), add:

```tsx
        <DrawerRow href="/locations" onClose={onClose}>Locations</DrawerRow>
```

- [ ] **Step 3: Footer Company column**

In `components/site/site-footer.tsx`, in the `FooterColumn` titled `"Company"`, add a `Locations` entry after `Pricing`:

```tsx
                { label: "Locations", href: "/locations" },
```

- [ ] **Step 4: Build and verify the link is present sitewide**

Run:
```bash
npm run build && npm start &
sleep 4
curl -s http://localhost:3000/ | grep -c 'href="/locations"'
kill %1
```
Expected: count ≥ `2` (nav + footer; mobile drawer is client-rendered so may not appear in initial HTML — that's fine).

- [ ] **Step 5: Commit**

```bash
git add components/site/site-header.tsx components/site/site-footer.tsx
git commit -m "feat(seo): link Locations from primary nav, mobile drawer, and footer"
```

---

### Task 10: Full-suite verification + guardrail sweep

**Files:** none (verification only).

- [ ] **Step 1: Unit tests + lint + typecheck + build all green**

Run:
```bash
npm test && npx eslint . && npx tsc --noEmit && npm run build
```
Expected: tests pass, no eslint errors, no type errors, build succeeds.

- [ ] **Step 2: Guardrail sweep — no faked geo, single entity, no ICBM meta**

Run:
```bash
npm start &
sleep 4
echo "one org node per page:"; for p in / /locations /locations/austin /locations/dallas /locations/san-antonio; do
  echo -n "$p "; curl -s "http://localhost:3000$p" | grep -c '"@id":"https://impeccabyte.com/#organization"'
done
echo "no ICBM/geo meta tags anywhere:"; for p in / /locations/dallas; do
  curl -s "http://localhost:3000$p" | grep -Eic 'name="(geo\.(region|placename|position)|ICBM)"'
done
echo "Dallas/SA carry NO second PostalAddress in page-level nodes (org node in layout is the only one):"
curl -s http://localhost:3000/locations/dallas | grep -o 'PostalAddress' | wc -l
kill %1
```
Expected: every page shows exactly `1` org node; ICBM/geo meta counts are `0`; Dallas `PostalAddress` count is `1` (the sitewide org node only — never a Dallas-scoped address).

- [ ] **Step 3: Manual — validate structured data (owner action, note in PR)**

Validate `/`, `/locations/austin`, `/locations/dallas`, `/locations/san-antonio` in Google's **Rich Results Test** after deploy. Expect zero errors. (Cannot be automated pre-deploy; flag in PR.)

- [ ] **Step 4: Final commit / PR prep**

```bash
git add -A && git commit -m "chore(seo): verification sweep for locations layer" --allow-empty
```

PR description must state the **out-of-scope** items (source spec §7): the code layer alone will not produce map-pack rankings without (a) Austin Google Business Profile optimization as a hidden-address service-area business, (b) review velocity, (c) NAP-consistent citations, (d) local backlinks. Also list the open **⚠️ CONFIRM** items: business `telephone` and Austin `GEO` in `lib/seo/org.ts`, and real per-metro testimonials.

---

## Self-Review

**Spec coverage** (against `2026-07-09-local-seo-locations-design.md`):
- Routes (hub + `[city]`): Tasks 7, 8. ✓
- Single-entity JSON-LD, `@id`, no fake local nodes: Tasks 1, 5, 8 + guardrail sweep Task 10. ✓
- Per-page metadata (unique title/desc, self-canonical, OG): Tasks 7, 8. ✓
- Service + Breadcrumb + FAQPage per city: Tasks 2, 4, 8. ✓
- Real, unique city content + honest office answers + testimonial placeholders: Task 4 (+ uniqueness/honesty unit tests), Task 8 (placeholder). ✓
- CONFIRM-gated phone/geo: Task 1 (+ test) and guardrail sweep. ✓
- sitemap + robots: Task 6. ✓
- Internal linking (nav, mobile, footer, cross-links): Tasks 8, 9. ✓
- No `geo.*`/ICBM meta: enforced by never adding them; verified Task 10. ✓
- Deferred §3c (product/industry schema): intentionally absent — matches locked scope. ✓
- Out-of-scope §7 flagged in PR: Task 10. ✓

**Placeholder scan:** The only intentional placeholder is the testimonial section in Task 8, which is a spec-mandated `⚠️ WRITE` owner item (real content is forbidden to invent) — not a plan gap. `TELEPHONE`/`GEO` nulls are spec-mandated CONFIRM constants, gated so nothing fake ships. No "TODO/implement later" steps remain.

**Type consistency:** `type JsonLd` defined in `org.ts`, imported by `schema.ts`/`locations.ts`/component. Builder names (`orgSchema`, `serviceSchema`, `breadcrumbSchema`, `faqSchema`, `serializeJsonLd`, `cityJsonLdNodes`, `citySlugs`, `getCity`, `cityCanonical`, `sitemapPaths`) are used identically across producer and consumer tasks. City slugs (`austin`, `dallas`, `san-antonio`) are consistent in data, params, sitemap, and verification.

**One caveat flagged for the implementer:** verify `DarkCTA` and `ButtonLink`/`Eyebrow`/`Container` prop signatures against their component files before use (Task 8 note) — existing pages use these exact props, but confirm rather than assume.
