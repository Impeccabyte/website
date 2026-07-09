# Local SEO — Locations Layer (Austin / Dallas / San Antonio)

**Date:** 2026-07-09
**Status:** Approved design, pending implementation plan
**Source spec:** owner-supplied "Implementation Prompt — Local SEO for Impeccabyte" (see also memory `local-seo-guidelines`)

## Objective

Add a local-SEO layer to the Impeccabyte marketing site (Next.js 16 App Router) to win **organic + AI-answer** visibility for merchant-services searches in **Austin, Dallas, and San Antonio**, and to own the **map pack in Austin only**. The governing constraint: Impeccabyte has exactly **one real, staffed address** — 1606 Headway Circle Ste. 9317, Austin, TX 78754. There are **no** Dallas or San Antonio offices. Dallas and San Antonio pages are **service-area** pages, never faked local-business locations.

## Decisions locked during brainstorming

1. **Scope of this PR:** the Locations layer + sitewide Organization JSON-LD only. Adding `Service`/`BreadcrumbList` schema to existing `/products/*` and `/industries/*` pages (source spec §3c) is **deferred** to a follow-up.
2. **City copy:** draft genuine, city-specific prose now (districts, neighborhoods, verticals, honest "no local office" answers are public/verifiable facts). Merchant **testimonials are never invented** — testimonial slots are clearly-labeled `⚠️ WRITE` placeholders on every city page.
3. **NAP + geo CONFIRM values:** business phone (must match Google Business Profile) and Austin office lat/lng ship as clearly-labeled `⚠️ CONFIRM` constants in one config file. JSON-LD **omits** phone/geo entirely until they are filled — it never emits a fake value.
4. **Testimonials:** the homepage "Renée Okafor / Saffron & Co" quote is treated as **not a verified reference** and is **not reused** on city pages.

## Key deviation from the source spec

The source spec assumed `next-seo` was installed and prescribed its `JsonLd` components. **`next-seo` is NOT installed**, and this repo is **Next.js 16.2.10** (App Router, with breaking changes vs. common training data — see `AGENTS.md`). `next-seo` is largely a Pages-Router-era library and is not trusted here.

**Chosen approach instead:** a hand-rolled JSON-LD primitive — a tiny server component that renders `<script type="application/ld+json">` — fed by typed builder functions. This is Google's own recommended method, adds **zero dependencies**, keeps all structured data in the server-rendered HTML, and gives a single source of truth for the entity `@id`.

## Architecture & new files

```
lib/seo/
  org.ts          // NAP constants; org @id = https://impeccabyte.com/#organization;
                  //   ⚠️ CONFIRM constants (phone, lat, lng — null until filled);
                  //   organizationSchema(); localBusinessSchema()  (FinancialService subtype)
  schema.ts       // serviceSchema(city); breadcrumbSchema(items); faqSchema(qas)
  locations.ts    // per-city UNIQUE content data: slug, name, metro, districts[],
                  //   verticals[], intro prose, relevantProductKeys[], relevantIndustryKeys[],
                  //   faqs[], testimonial slot, metaTitle, metaDescription
components/seo/
  json-ld.tsx     // <JsonLd data={...} /> → server-rendered <script type="application/ld+json">

app/locations/
  page.tsx            // "Areas We Serve" hub
  [city]/page.tsx     // dynamic city page, generateStaticParams() over the 3 cities

app/sitemap.ts    // new — absolute URLs; existing routes + hub + 3 cities
app/robots.ts     // new — references sitemap, allows /locations
```

### Route model

A **dynamic `app/locations/[city]/page.tsx`** with `generateStaticParams()` (statically pre-rendered), mirroring the existing `app/products/[key]` and `app/industries/[key]` convention. Content uniqueness is guaranteed because 100% of the body prose comes from `lib/seo/locations.ts`; the template only arranges it. Austin's additional `LocalBusiness`/`geo` node is emitted via a conditional in the template. The hub is a static `app/locations/page.tsx`.

## Structured data (single-entity model)

- **Root layout** (`app/layout.tsx`), emitted once: an `Organization` **and** a `FinancialService` (LocalBusiness subtype) node for the Austin entity, stable `@id` `https://impeccabyte.com/#organization`. Includes `address` (the real Austin NAP), `areaServed` (City nodes: Austin, Dallas, San Antonio in Texas), `sameAs` (the three real socials already in the footer: Facebook, Instagram, TikTok), `description`. `telephone` and `geo` are included **only when** the CONFIRM constants are non-null; otherwise omitted.
- **Each city page**, referencing the org by `@id` (never redeclaring a fake local address):
  1. `Service` — `serviceType: "Merchant services / payment processing"`, `provider: { "@id": ".../#organization" }`, `areaServed: { "@type": "City", "name": "{City}" }`.
  2. `BreadcrumbList` — Home → Locations → {City}.
  3. `FAQPage` — 4–6 city-specific Q&As mirroring the visible FAQ.
- **Austin only** additionally surfaces the real `LocalBusiness`/`geo` data, since it is the actual location.
- Exactly **one** `FinancialService`/`LocalBusiness` node sitewide.

## Per-page metadata (native App Router Metadata API)

- Unique server-rendered `<title>`, pattern: `Merchant Services in {City}, TX — Credit Card Processing`.
- Unique meta description (≤ ~155 chars) per city with a differentiated hook (transparent interchange-plus / high-risk approvals / dual pricing).
- Self-referencing `alternates.canonical` on every new page (mirrors the existing pattern in `components/site/legal-page.tsx`).
- OG + Twitter via the existing `ogImages()` helper, reusing `home.png`. City-specific OG images are a deferred nice-to-have.
- `metadataBase` is already set in the root layout — canonicals/OG resolve absolutely.

## City content (real prose)

Each city page contains, as genuine prose (not a keyword list):

- **H1:** `Merchant Services in {City}, TX`.
- **Local intro** (unique per city): who Impeccabyte serves in that metro, named business districts/neighborhoods, and the verticals concentrated there.
  - *Austin* — startups & funded DTC, food & beverage, high-risk (CBD/vape), boutiques.
  - *Dallas–Fort Worth* — e-commerce/DTC brands, professional & B2B services, retail; large competitive metro.
  - *San Antonio* — hospitality & tourism, healthcare & personal care, retail, military-adjacent businesses.
- **The wedge, localized:** the free, no-obligation statement analysis, framed for that city's merchants.
- **Relevant products/industries**, each linking to the existing `/products/*` and `/industries/*` pages.
- **Local proof:** a clearly-labeled `⚠️ WRITE` testimonial placeholder — no invented testimonials.
- **City-specific FAQ** mirroring the FAQPage JSON-LD, including an honest "Do you have an office in {City}?" (Austin-based, serving {City} remotely + on-site as needed), a high-risk approval question, and a dual-pricing question.
- **Clear CTA** to `/contact` (Get a Quote).

**Uniqueness bar:** < ~20% body-sentence overlap across the three city pages. Districts, verticals, and FAQs differ materially.

## Internal linking & technical SEO

- "Locations" (label: "Areas We Serve" or "Locations") added to the desktop nav (`components/site/site-header.tsx`), the mobile drawer, and the footer Company column (`components/site/site-footer.tsx`).
- Hub links to all three city pages; each city page cross-links to its relevant `/products/*` + `/industries/*` pages and to the other two city pages.
- New `app/sitemap.ts` emitting absolute URLs for existing routes + the hub + 3 city pages.
- New `app/robots.ts` referencing the sitemap and allowing `/locations`.
- **No** `geo.region` / `geo.placename` / `geo.position` / ICBM meta tags anywhere — geo lives only inside `LocalBusiness` JSON-LD.
- All primary content and JSON-LD are server-rendered (no client-only rendering of body copy or schema).
- Any city hero images use `next/image` with descriptive `alt` and reserved dimensions (no CLS); owned/royalty-free imagery only.

## Guardrails (must hold at all times)

1. One canonical business entity; city pages reference it by `@id` and contain no invented local address/phone.
2. Only the real Austin address; never invent Dallas/San Antonio NAP or a `LocalBusiness` node for them.
3. NAP matches character-for-character across footer, JSON-LD, and (later) the Google Business Profile.
4. No `geo.*` / ICBM meta tags.
5. No doorway/templated pages — genuinely unique city content.

## QA checklist (run before "done")

- [ ] Each new page returns unique, server-rendered `<title>`, description, and canonical.
- [ ] JSON-LD renders as valid `<script type="application/ld+json">`; validate each URL in Google's Rich Results Test — zero errors.
- [ ] Exactly one `FinancialService`/`LocalBusiness` node sitewide; city pages reference it by `@id` with no invented local address/phone.
- [ ] NAP in footer === NAP in JSON-LD.
- [ ] "Locations" linked from nav (desktop + mobile) + footer; city pages cross-link to products/industries and to each other.
- [ ] No `geo.*` / ICBM meta tags anywhere.
- [ ] Sitemap includes the 4 new URLs; robots allows them.
- [ ] Body-content uniqueness across the three city pages verified (< ~20% overlap).
- [ ] No new Lighthouse CLS/LCP regressions.
- [ ] All `⚠️ CONFIRM` / `⚠️ WRITE` items are either filled or clearly labeled for the owner.

## Out of scope (flag in PR description, per source spec §7)

These carry most of the ranking weight and are done outside the repo: (a) verify/optimize the Austin Google Business Profile as a service-area business with the address hidden and served cities listed; (b) build review velocity; (c) NAP-consistent directory citations; (d) local backlinks. **The code layer alone will not produce map-pack rankings without these** — the PR description must say so.

## Open `⚠️ CONFIRM` / `⚠️ WRITE` items for the owner

- Business `telephone` (must match Google Business Profile exactly).
- Austin office latitude / longitude.
- Real merchant testimonials per metro (until then, labeled placeholders).
