# Search Console Indexing Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Resolve the 29 crawled-not-indexed URLs in Google Search Console by adding self-referencing canonicals sitewide, an `/industries` hub, a legacy-URL redirect map, and a 410 handler for the retired `/business` section.

**Architecture:** Redirect data lives in a plain, unit-tested module (`lib/seo/redirects.ts`) that `next.config.ts` consumes via `redirects()`; host matching (`has: [{ type: 'host' }]`) handles www→apex so no `proxy.ts` is needed. Retired URLs get a 410 from an optional-catch-all Route Handler. Canonicals are added to page `metadata`/`generateMetadata` and locked in by a table-driven vitest suite that imports the page modules directly.

**Tech Stack:** Next.js 16.2.10 (App Router), TypeScript, Tailwind v4, vitest 3.2.7, deployed on Railway.

**Spec:** `docs/superpowers/specs/2026-07-29-search-console-indexing-fixes-design.md`

**Branch:** `fix/search-console-indexing` (already created off `origin/main`; the spec is committed there as `d7f6e2b`).

## Global Constraints

- **This is NOT the Next.js you know.** Read `node_modules/next/dist/docs/` before writing framework code. Already verified for this plan: `middleware.ts` is deprecated and renamed to `proxy.ts`; `redirects()` supports `has: [{ type: 'host', value }]`; `permanent: true` emits **308**, not 301.
- **Vitest only discovers tests matching `lib/**/*.test.ts`** (`vitest.config.ts:6`). All new test files go under `lib/`, even when they test `app/` modules. Verified working: vitest can import `app/**/page.tsx` modules, including `generateMetadata` and pages containing server actions.
- **Page titles must NOT end in `| Impeccabyte` or `· Impeccabyte`** — `app/layout.tsx` applies the template `"%s · Impeccabyte"` already. Including it doubles the brand.
- **Meta descriptions ≤ ~155 characters.**
- **Exactly one `FinancialService`/`LocalBusiness` node sitewide.** New pages reference the org by `@id` (`https://impeccabyte.com/#organization`) and never redeclare it.
- **`FAQPage` JSON-LD requires matching visible on-page FAQ content.** Never emit FAQ schema for questions that aren't rendered.
- **No `geo.*` / ICBM meta tags** anywhere.
- **Only real NAP:** `1606 Headway Circle Ste. 9317, Austin, TX 78754`, `+1-512-980-6236`. No Dallas or San Antonio addresses.
- **Commit after every task.** Run `npm run test`, `npm run lint`, and `npm run build` before each commit.
- **`npm run lint` already fails on this repo** with 14 pre-existing problems (8 errors, 6 warnings) in
  `components/tools/statement-analyzer.tsx`, `components/tools/statement-gate.tsx`, `lib/hubspot/client.ts`,
  and `lib/hubspot/quote-form.test.ts` — verified identical at the branch base. The gate is therefore
  **no NEW lint problems**, not a clean lint run. Compare the count and the file list; if either grows,
  the task introduced a regression. Do not fix the pre-existing ones — they are outside every task's scope.

---

### Task 1: Self-referencing canonicals on the 11 routes missing them

Fixes the `/?ref=ry.php` duplicate. Independent of the DNS cutover — ships value on deploy.

**Files:**
- Create: `lib/seo/canonicals.test.ts`
- Modify: `app/page.tsx` (add a metadata export — it currently has none)
- Modify: `app/about/page.tsx:14-19`, `app/partnerships/page.tsx:14-19`, `app/pricing/page.tsx:17-22`, `app/surcharge/page.tsx:17-22`, `app/cash-discount/page.tsx:17-22`, `app/benefits/travel/page.tsx:15-20`, `app/contact/page.tsx:5-10`, `app/chamber/page.tsx:12-17`
- Modify: `app/products/[key]/page.tsx:23-32`, `app/industries/[key]/page.tsx:22-31`

**Interfaces:**
- Consumes: `sitemapPaths()` from `lib/seo/sitemap.ts`, `SITE_URL` from `lib/seo/org.ts`, `productOrder`/`solutionNavOrder` from `lib/data.ts`, `citySlugs()` from `lib/seo/locations.ts`.
- Produces: every route's `metadata.alternates.canonical` is a root-relative path string (e.g. `"/about"`, `"/products/online"`). Task 2 extends the `STATIC` table in `lib/seo/canonicals.test.ts` with `["/industries", industries]`.

**Do NOT touch** `app/privacy`, `app/terms`, `app/cookies` (they already get canonicals from `legalMetadata()` at `components/site/legal-page.tsx:69`) or `app/tools/analyze/page.tsx` (already `robots: { index: false, follow: false }` at line 7).

- [ ] **Step 1: Write the failing test**

Create `lib/seo/canonicals.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import type { Metadata } from "next";
import { metadata as home } from "@/app/page";
import { metadata as about } from "@/app/about/page";
import { metadata as partnerships } from "@/app/partnerships/page";
import { metadata as pricing } from "@/app/pricing/page";
import { metadata as surcharge } from "@/app/surcharge/page";
import { metadata as cashDiscount } from "@/app/cash-discount/page";
import { metadata as travel } from "@/app/benefits/travel/page";
import { metadata as contact } from "@/app/contact/page";
import { metadata as chamber } from "@/app/chamber/page";
import { metadata as integrations } from "@/app/integrations/page";
import { metadata as locations } from "@/app/locations/page";
import { metadata as privacy } from "@/app/privacy/page";
import { metadata as terms } from "@/app/terms/page";
import { metadata as cookies } from "@/app/cookies/page";
import { generateMetadata as productMeta } from "@/app/products/[key]/page";
import { generateMetadata as industryMeta } from "@/app/industries/[key]/page";
import { generateMetadata as cityMeta } from "@/app/locations/[city]/page";
import { productOrder, solutionNavOrder } from "@/lib/data";
import { citySlugs } from "@/lib/seo/locations";
import { sitemapPaths } from "@/lib/seo/sitemap";
import { SITE_URL } from "@/lib/seo/org";

/** Every route with a statically-declared metadata export, paired with its expected canonical. */
const STATIC: [string, Metadata][] = [
  ["/", home],
  ["/about", about],
  ["/partnerships", partnerships],
  ["/pricing", pricing],
  ["/surcharge", surcharge],
  ["/cash-discount", cashDiscount],
  ["/benefits/travel", travel],
  ["/contact", contact],
  ["/chamber", chamber],
  ["/integrations", integrations],
  ["/locations", locations],
  ["/privacy", privacy],
  ["/terms", terms],
  ["/cookies", cookies],
];

describe("self-referencing canonicals", () => {
  it.each(STATIC)("%s declares itself canonical", (path, meta) => {
    expect(meta.alternates?.canonical).toBe(path);
  });

  it.each(productOrder)("/products/%s declares itself canonical", async (key) => {
    const meta = await productMeta({ params: Promise.resolve({ key }) });
    expect(meta.alternates?.canonical).toBe(`/products/${key}`);
  });

  it.each(solutionNavOrder)("/industries/%s declares itself canonical", async (key) => {
    const meta = await industryMeta({ params: Promise.resolve({ key }) });
    expect(meta.alternates?.canonical).toBe(`/industries/${key}`);
  });

  it.each(citySlugs())("/locations/%s declares itself canonical", async (city) => {
    const meta = await cityMeta({ params: Promise.resolve({ city }) });
    expect(meta.alternates?.canonical).toBe(`/locations/${city}`);
  });

  // Guard: if a route is added to the sitemap without a canonical assertion here, fail.
  it("asserts a canonical for every URL in the sitemap", () => {
    const covered = new Set<string>([
      ...STATIC.map(([p]) => p),
      ...productOrder.map((k) => `/products/${k}`),
      ...solutionNavOrder.map((k) => `/industries/${k}`),
      ...citySlugs().map((s) => `/locations/${s}`),
    ]);
    const uncovered = sitemapPaths()
      .map((u) => u.replace(SITE_URL, "") || "/")
      .filter((p) => !covered.has(p));
    expect(uncovered).toEqual([]);
  });
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `npx vitest run lib/seo/canonicals.test.ts`

Expected: FAIL. The `/` case throws `TypeError: Cannot read properties of undefined (reading 'alternates')` because `app/page.tsx` has no `metadata` export; the other 10 fail with `expected undefined to be "/about"` etc. The `/integrations`, `/locations`, `/privacy`, `/terms`, `/cookies`, and `/locations/:city` cases should already PASS — that is expected and confirms the test is correctly calibrated.

- [ ] **Step 3: Add the metadata export to the homepage**

`app/page.tsx` has no metadata block. Add this import at the top of the import list and the export directly above `const STEPS`:

```tsx
import type { Metadata } from "next";
```

```tsx
// Title and description come from the root layout's `title.default`; this block
// exists only to declare the canonical, so /?ref=… variants don't index separately.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};
```

- [ ] **Step 4: Add `alternates` to the eight remaining static pages**

In each file, insert the `alternates` line immediately after the `description` property, before the `...ogImages(...)` spread. Exact insertions:

`app/about/page.tsx` → `  alternates: { canonical: "/about" },`
`app/partnerships/page.tsx` → `  alternates: { canonical: "/partnerships" },`
`app/pricing/page.tsx` → `  alternates: { canonical: "/pricing" },`
`app/surcharge/page.tsx` → `  alternates: { canonical: "/surcharge" },`
`app/cash-discount/page.tsx` → `  alternates: { canonical: "/cash-discount" },`
`app/benefits/travel/page.tsx` → `  alternates: { canonical: "/benefits/travel" },`
`app/contact/page.tsx` → `  alternates: { canonical: "/contact" },`
`app/chamber/page.tsx` → `  alternates: { canonical: "/chamber" },`

For example, `app/about/page.tsx` becomes:

```tsx
export const metadata: Metadata = {
  title: "About — merchant services for the next generation",
  description:
    "Impeccabyte is merchant services for the freelancers, makers, and small storefronts who deserve fair pricing and a human on the other end. Based in Austin, backed by Maverick Payments.",
  alternates: { canonical: "/about" },
  ...ogImages("about", "Impeccabyte — payments, done right"),
};
```

- [ ] **Step 5: Add `alternates` to the two dynamic routes**

`app/products/[key]/page.tsx`, inside `generateMetadata`, after the `description` line:

```tsx
  return {
    title: `${p.titleA} ${p.titleEm} · ${p.nav}`,
    description: p.subtitle,
    alternates: { canonical: `/products/${p.key}` },
    ...ogImages(`product-${p.key}`, `${p.nav} · Impeccabyte`),
  };
```

`app/industries/[key]/page.tsx`, same position:

```tsx
  return {
    title: `${s.titleA} ${s.titleEm} · ${s.nav}`,
    description: s.subtitle,
    alternates: { canonical: `/industries/${s.key}` },
    ...ogImages(`industry-${s.key}`, `${s.nav} · Impeccabyte`),
  };
```

Derive from `p.key`/`s.key` (the validated object), not the raw `key` param — the raw param is unvalidated user input and must never land in a canonical.

- [ ] **Step 6: Run the tests and verify they pass**

Run: `npx vitest run lib/seo/canonicals.test.ts`
Expected: PASS, all cases green.

- [ ] **Step 7: Full gate**

Run: `npm run test && npm run lint && npm run build`
Expected: all pass, build completes with no new warnings.

- [ ] **Step 8: Commit**

```bash
git add lib/seo/canonicals.test.ts app/page.tsx app/about/page.tsx app/partnerships/page.tsx app/pricing/page.tsx app/surcharge/page.tsx app/cash-discount/page.tsx app/benefits/travel/page.tsx app/contact/page.tsx app/chamber/page.tsx "app/products/[key]/page.tsx" "app/industries/[key]/page.tsx"
git commit -m "fix(seo): add self-referencing canonicals to the 11 routes missing them

The homepage emitted no canonical at all, which let /?ref=ry.php get
crawled as a separate URL. Adds alternates.canonical to every route that
lacked one and a table-driven test that fails if a future sitemap entry
ships without one."
```

---

### Task 2: `/industries` hub page

Gives the six industry pages a parent and provides the redirect target for the legacy `/merchant-services/industry/` URL.

**Files:**
- Create: `app/industries/page.tsx`
- Modify: `lib/seo/sitemap.ts:8-25` (add `"/industries"`)
- Modify: `lib/seo/sitemap.test.ts` (assert the hub is present)
- Modify: `lib/seo/canonicals.test.ts` (add the hub to `STATIC`)
- Modify: `components/site/site-header.tsx:101-116` (desktop mega) and `:313-322` (mobile drawer)
- Modify: `components/site/site-footer.tsx:156-159` (footer column)

**Interfaces:**
- Consumes: `SOLUTIONS`, `solutionNavOrder` from `lib/data.ts`; `SolutionCard` from `components/site/entry-card.tsx`; `Container`, `SectionIntro`, `DarkCTA`, `JsonLd`, `Accordion`, `Eyebrow`; `breadcrumbSchema`, `faqSchema` from `lib/seo/schema.ts`; `ogImages` from `lib/og/meta.ts`.
- Produces: route `/industries` with `metadata.alternates.canonical === "/industries"`; `sitemapPaths()` includes `https://impeccabyte.com/industries`. Task 3's redirect map targets this path.

Note `/industries/[key]` already exists, so adding `app/industries/page.tsx` creates the index of an existing dynamic segment — no route conflict.

- [ ] **Step 1: Write the failing tests**

Add to `lib/seo/sitemap.test.ts`, inside the existing `describe("sitemapPaths")` block:

```ts
  it("includes the industries hub", () => {
    expect(sitemapPaths()).toContain("https://impeccabyte.com/industries");
  });
```

In `lib/seo/canonicals.test.ts`, add the import alongside the others:

```ts
import { metadata as industriesHub } from "@/app/industries/page";
```

and add this entry to the `STATIC` array, directly after the `["/locations", locations]` line:

```ts
  ["/industries", industriesHub],
```

- [ ] **Step 2: Run the tests and verify they fail**

Run: `npx vitest run lib/seo/sitemap.test.ts lib/seo/canonicals.test.ts`
Expected: FAIL — `canonicals.test.ts` fails to resolve `@/app/industries/page` (module does not exist), and the sitemap test fails on the missing hub URL.

- [ ] **Step 3: Create the hub page**

Create `app/industries/page.tsx`:

```tsx
import type { Metadata } from "next";
import { Compass, Layers, ShieldCheck } from "lucide-react";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Card } from "@/components/ui/card";
import { IconChip } from "@/components/ui/icon-chip";
import { SectionIntro } from "@/components/site/bits";
import { SolutionCard } from "@/components/site/entry-card";
import { DarkCTA } from "@/components/site/dark-cta";
import { Accordion } from "@/components/ui/accordion";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schema";
import { solutionNavOrder } from "@/lib/data";
import { ogImages } from "@/lib/og/meta";

export const metadata: Metadata = {
  title: "Industries — payments shaped around how you sell",
  description:
    "Retail, food and drink, professional services, e-commerce, nonprofits, and high-risk — see how Impeccabyte fits the way your business actually takes payments.",
  alternates: { canonical: "/industries" },
  ...ogImages("home", "Impeccabyte — payments for every industry"),
};

/** Rendered on-page below; the same items feed the FAQPage schema so the two never drift. */
const FAQS = [
  {
    q: "Which industries does Impeccabyte serve?",
    a: "Retail and shops, food and drink, professional services, e-commerce, nonprofits, and high-risk merchants. Agents and ISOs work with us through our Partnerships program rather than a merchant account.",
  },
  {
    q: "Does my industry change what I pay?",
    a: "Every industry gets the same interchange-plus structure — the card networks' published cost, plus one clear margin that steps down as your volume grows. What changes by industry is underwriting and which products we recommend, not the shape of the pricing.",
  },
  {
    q: "What if my business is considered high-risk?",
    a: "We place harder-to-underwrite businesses through Maverick Payments, subject to approval, on the same transparent terms. Tell us your category up front and we'll tell you honestly whether we can board you.",
  },
  {
    q: "Can I take payments in person and online on one account?",
    a: "Yes. The same merchant account powers your counter, your website checkout, your payment links, and your invoices — one rate and one statement across all of them.",
  },
  {
    q: "How do I know which products fit my industry?",
    a: "Each industry page lists the products we most often recommend for that kind of business. If you'd rather skip the reading, send us a recent statement and we'll come back with a specific setup and an exact rate.",
  },
];

const APPROACH = [
  {
    icon: Compass,
    tone: "clay" as const,
    title: "We start with how you sell",
    body: "A food truck and a subscription box need different hardware, different funding speed, and different underwriting. We fit the account to the business, not the other way around.",
  },
  {
    icon: Layers,
    tone: "amber" as const,
    title: "One account, every channel",
    body: "Counter, checkout, invoice, and recurring billing all run on the same merchant account — so you get one rate, one statement, and one place to call.",
  },
  {
    icon: ShieldCheck,
    tone: "sage" as const,
    title: "Straight answers on approval",
    body: "If your category is hard to board, we say so early and tell you what it takes. No surprise holds after you've already switched.",
  },
];

export default function IndustriesHubPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Industries", path: "/industries" },
          ]),
          faqSchema(FAQS),
        ]}
      />

      {/* Hero */}
      <section
        className="border-b border-border-subtle"
        style={{ background: "radial-gradient(90% 120% at 50% -30%, var(--amber-50), var(--paper) 62%)" }}
      >
        <Container width="wide" className="py-16 text-center sm:pt-[72px] sm:pb-12">
          <Eyebrow>Industries</Eyebrow>
          <h1
            className="mt-3.5 font-display font-semibold text-ink-900"
            style={{ fontSize: "clamp(36px, 4.8vw, 56px)", lineHeight: 1.04 }}
          >
            However you sell, <span className="em">we fit.</span>
          </h1>
          <p className="mx-auto mt-[18px] max-w-[580px] text-[18px] leading-relaxed text-ink-600">
            The way you take money depends on the business you&rsquo;re in. Pick the one that
            sounds like yours and see the setup, the products, and the pricing we&rsquo;d put
            behind it.
          </p>
        </Container>
      </section>

      {/* Industry cards */}
      <section className="px-6 pt-14 pb-2">
        <Container>
          <div className="grid gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
            {solutionNavOrder.map((k) => (
              <SolutionCard key={k} keyName={k} />
            ))}
          </div>
        </Container>
      </section>

      {/* How we approach it */}
      <section className="px-6 py-20">
        <Container>
          <SectionIntro
            eyebrow="How we match it"
            title="Same rails, different shape"
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {APPROACH.map((a) => (
              <Card key={a.title} padding="lg" className="h-full">
                <IconChip icon={a.icon} tone={a.tone} size={46} />
                <h2 className="mt-5 text-[18px] font-bold text-ink-900">{a.title}</h2>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-600">{a.body}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ — must stay in sync with FAQS above, which also feeds the schema */}
      <section className="border-t border-border-subtle px-6 py-20">
        <Container width="narrow">
          <SectionIntro eyebrow="Questions" title="Answers, in plain English" />
          <div className="mt-10">
            <Accordion items={FAQS} defaultOpen={0} />
          </div>
        </Container>
      </section>

      <DarkCTA
        titleA="Not sure where you"
        titleEm="fit?"
        body="Send us a recent statement. We'll tell you which setup suits your business and exactly what it would cost — no obligation."
        primary={{ label: "Get a free statement analysis", href: "/contact" }}
        secondary={{ label: "See pricing", href: "/pricing" }}
      />
    </>
  );
}
```

Every prop used above was checked against the components while writing this plan: `IconChip` `tone` is `"clay" | "amber" | "sage" | "ink"` (`components/ui/icon-chip.tsx:5`), `Card` `padding` accepts `none | sm | md | lg` (`components/ui/card.tsx:17-22`), and `Container` `width` accepts `narrow | wide | content` (`components/site/container.tsx:10-14`). No new variants are introduced.

- [ ] **Step 4: Add the hub to the sitemap**

In `lib/seo/sitemap.ts`, add `"/industries"` to the `paths` array immediately after `"/locations"`… entries, keeping the hub adjacent to its children:

```ts
    "/locations",
    ...citySlugs().map((s) => `/locations/${s}`),
    "/industries",
    ...productOrder.map((k) => `/products/${k}`),
    ...solutionNavOrder.map((k) => `/industries/${k}`),
```

- [ ] **Step 5: Run the tests and verify they pass**

Run: `npx vitest run lib/seo/sitemap.test.ts lib/seo/canonicals.test.ts`
Expected: PASS. The canonicals guard test now also proves `/industries` is asserted.

- [ ] **Step 6: Link the hub from the desktop mega menu**

In `components/site/site-header.tsx`, replace the industries branch at lines 101–116 so the grid is followed by a hub link:

```tsx
            ) : mega === "industries" ? (
              <div>
                <div className="grid grid-cols-4 gap-2.5">
                  {solutionNavOrder.map((k) => {
                    const s = SOLUTIONS[k];
                    return (
                      <MegaItem
                        key={k}
                        href={`/industries/${s.key}`}
                        icon={s.icon}
                        label={s.nav}
                        desc={s.menuDesc}
                        tone="amber"
                      />
                    );
                  })}
                </div>
                <Link
                  href="/industries"
                  className="mt-3 inline-flex items-center gap-1.5 px-2.5 text-[14px] font-semibold text-clay-600 hover:text-clay-700"
                >
                  See all industries <ArrowRight size={15} />
                </Link>
              </div>
            ) : (
```

Confirm `Link` and `ArrowRight` are imported in this file; add `import { ArrowRight } from "lucide-react";` to the existing lucide import if absent.

- [ ] **Step 7: Link the hub from the mobile drawer**

In `components/site/site-header.tsx`, inside the mobile industries section (around lines 317–322), add a final link after the `solutionNavOrder.map(...)` block, matching the sibling links' styling:

```tsx
          <Link href="/industries" onClick={onClose} className="flex items-center gap-3 py-2 font-semibold text-clay-600">
            See all industries
          </Link>
```

- [ ] **Step 8: Link the hub from the footer**

In `components/site/site-footer.tsx:156-159`, append the hub to the Industries column:

```tsx
              <FooterColumn
                title="Industries"
                links={[
                  ...footerSolutionKeys.map((k) => ({ label: SOLUTIONS[k].nav, href: `/industries/${k}` })),
                  { label: "All Industries", href: "/industries" },
                ]}
              />
```

- [ ] **Step 9: Full gate**

Run: `npm run test && npm run lint && npm run build`
Expected: all pass. Confirm the build output lists `/industries` as a prerendered static route.

- [ ] **Step 10: Visually confirm the page renders**

Run: `npm run build && npm run start` then in a second shell:

```bash
curl -s http://localhost:3000/industries | grep -oE '<link rel="canonical"[^>]*>|"@type":"(BreadcrumbList|FAQPage)"'
```

Expected: the canonical `https://impeccabyte.com/industries`, plus both `"@type":"BreadcrumbList"` and `"@type":"FAQPage"` present in server-rendered HTML. Also load `http://localhost:3000/industries` in a browser and confirm the six cards, the three approach cards, and the FAQ accordion all render, and that the accordion questions match `FAQS` exactly.

- [ ] **Step 11: Commit**

```bash
git add app/industries/page.tsx lib/seo/sitemap.ts lib/seo/sitemap.test.ts lib/seo/canonicals.test.ts components/site/site-header.tsx components/site/site-footer.tsx
git commit -m "feat(seo): add /industries hub page

The six /industries/[key] pages had no parent route. Adds a hub with
BreadcrumbList + FAQPage JSON-LD, wires it into the sitemap, nav mega
menu, mobile drawer, and footer, and gives the legacy
/merchant-services/industry/ URL a real redirect target."
```

---

### Task 3: Legacy redirect map

Maps the 12 legacy www URLs that have modern equivalents (`/about` is the 13th reported
path but is a live apex route handled by the catch-all — see Step 3). Inert until the DNS cutover in Task 5, except for apex-side hits.

**Files:**
- Create: `lib/seo/redirects.ts`
- Create: `lib/seo/redirects.test.ts`
- Modify: `next.config.ts`

**Interfaces:**
- Consumes: `SITE_URL` from `lib/seo/org.ts`; `sitemapPaths()` from `lib/seo/sitemap.ts` (test only).
- Produces:
  - `LEGACY_REDIRECTS: { source: string; destination: string; permanent: true }[]`
  - `WWW_HOST = "www.impeccabyte.com"`
  - `GONE_PREFIX = "/business"`
  - `REPORTED_LEGACY_PATHS: string[]` — the 20 www paths from the GSC export, checked in as a fixture
  - `legacyRedirects(): Redirect[]` — the full ordered array (`LEGACY_REDIRECTS` then the host catch-all) that `next.config.ts` returns from `redirects()`

- [ ] **Step 1: Write the failing test**

Create `lib/seo/redirects.test.ts`:

```ts
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
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `npx vitest run lib/seo/redirects.test.ts`
Expected: FAIL — `Failed to resolve import "@/lib/seo/redirects"`.

- [ ] **Step 3: Write the redirect module**

Create `lib/seo/redirects.ts`. Note the **relative** import of `SITE_URL`: the other
`lib/seo/*` modules use the `@/` alias, but `next.config.ts` loads this file through
Next's own TypeScript loader, which may not honour `tsconfig.json` path aliases.
A relative specifier resolves under the config loader, the Next build, and vitest alike.

```ts
// Relative, not "@/lib/seo/org" — next.config.ts loads this outside the app's
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
    ...LEGACY_REDIRECTS,
    {
      source: "/:path*",
      has: [{ type: "host", value: WWW_HOST }],
      destination: `${SITE_URL}/:path*`,
      permanent: true,
    },
  ];
}
```

**Why `/about` has no rule:** it appears in `REPORTED_LEGACY_PATHS` but deliberately gets no entry in `LEGACY_REDIRECTS`. A rule mapping `/about` → `https://impeccabyte.com/about` would match on the apex too and loop forever. The www catch-all already sends `www/about` to the identical apex path, which is exactly right. This is the `LIVE_APEX_PATHS` category in the test.

- [ ] **Step 4: Run the tests and verify they pass**

Run: `npx vitest run lib/seo/redirects.test.ts`
Expected: PASS, all cases green. 12 entries in `LEGACY_REDIRECTS`, 7 handled by `GONE_PREFIX`, 1 live apex path = 20 reported paths.

- [ ] **Step 5: Wire the map into next.config.ts**

Modify `next.config.ts`. Use a **relative** import — `next.config.ts` is loaded by Next's own TypeScript loader and may not honour the `@/` path alias from `tsconfig.json`:

```ts
import type { NextConfig } from "next";
import { legacyRedirects } from "./lib/seo/redirects";

const nextConfig: NextConfig = {
  // Don't advertise the framework in response headers.
  poweredByHeader: false,
  // Gzip responses from the Node server.
  compress: true,
  // Merchant-statement PDF uploads travel through the quote server action.
  // The user-facing cap is MAX_STATEMENT_BYTES (10MB), enforced in the action so
  // oversize files get a friendly error. This transport limit must sit ABOVE that
  // so the whole multipart body (PDF + text fields + boundaries) for a ~10MB PDF
  // still reaches the action instead of being rejected opaquely by the framework.
  experimental: {
    serverActions: {
      bodySizeLimit: "12mb",
    },
  },
  // Old-site URLs Google still crawls, plus the www -> apex canonical host redirect.
  // Note: `permanent: true` emits 308 (not 301); Google treats them identically.
  async redirects() {
    return legacyRedirects();
  },
};

export default nextConfig;
```

- [ ] **Step 6: Verify the build accepts the config**

Run: `npm run build`
Expected: build succeeds. If it fails on the import, the `@/` alias is the cause — confirm the import is relative (`./lib/seo/redirects`) and that `lib/seo/org.ts` (which `redirects.ts` imports) itself has no `@/` imports that break under the config loader. `lib/seo/org.ts` currently has no imports, so a relative path is sufficient; if `redirects.ts` needs to avoid `@/`, change its `SITE_URL` import to `./org`.

- [ ] **Step 7: Verify the redirects actually fire, including trailing slashes**

This is the required trailing-slash verification from the spec — every legacy URL Google has ends in `/`.

Run `npm run start` (after the build), then in a second shell:

```bash
for p in /payments/industry/ecommerce /payments/industry/ecommerce/ /merchant-services/industry/ /topic/payment-gateway/; do
  printf '%s -> ' "$p"
  curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' -I "http://localhost:3000$p"
done
```

**Verified result (measured 2026-07-29 against a real build — do not re-litigate):**

```
/payments/industry/ecommerce   -> 308 -> https://impeccabyte.com/industries/ecommerce   (1 hop)
/payments/industry/ecommerce/  -> 308 -> /payments/industry/ecommerce, then the rule     (2 hops)
```

Next's built-in `trailingSlash: false` normalizer runs **before** `redirects()` is consulted.
Unslashed sources therefore resolve in one hop; slashed sources take two. Adding explicit
`/source/` rules does **not** help — they can never match, because the slash is stripped before
the redirect table is reached. Do not add them; they are dead code.

Two hops is the accepted final state. Googlebot follows up to 10 redirects and passes equity
through the chain, and the only way to reach one hop is `skipTrailingSlashRedirect: true`,
which disables normalization sitewide and would let `/about` and `/about/` both render — a
duplicate-content regression strictly worse than one extra hop on URLs being deindexed anyway.

Confirm your run matches the table above.

- [ ] **Step 8: Full gate**

Run: `npm run test && npm run lint && npm run build`
Expected: all pass.

- [ ] **Step 9: Commit**

```bash
git add lib/seo/redirects.ts lib/seo/redirects.test.ts next.config.ts
git commit -m "feat(seo): 308 legacy old-site URLs to their modern equivalents

Adds a tested redirect map plus a host-scoped www -> apex catch-all.
Destinations are absolute apex URLs so a legacy www request resolves in
one hop instead of bouncing through the catch-all. The GSC export is
checked in as a fixture so a dropped rule fails the suite.

Inert until www DNS points at Railway (see the spec's section 1)."
```

---

### Task 4: 410 Gone for the retired `/business` section

**Files:**
- Create: `app/business/[[...slug]]/route.ts`
- Create: `lib/seo/gone.test.ts`

**Interfaces:**
- Consumes: `GONE_PREFIX` from `lib/seo/redirects.ts`.
- Produces: `GET` handler returning HTTP 410 for `/business` and everything beneath it.

Rationale (from the spec): these seven URLs are business-formation services the company no longer offers. A topically-irrelevant 301 to the homepage is commonly reclassified by Google as a soft-404, which moves the problem rather than solving it.

- [ ] **Step 1: Write the failing test**

Create `lib/seo/gone.test.ts`:

```ts
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

  it("covers all seven reported /business URLs", () => {
    const gone = REPORTED_LEGACY_PATHS.filter(
      (p) => p === GONE_PREFIX || p.startsWith(`${GONE_PREFIX}/`)
    );
    expect(gone).toHaveLength(7);
  });
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `npx vitest run lib/seo/gone.test.ts`
Expected: FAIL — `Failed to resolve import "@/app/business/[[...slug]]/route"`.

- [ ] **Step 3: Write the route handler**

Create `app/business/[[...slug]]/route.ts`:

```ts
/**
 * Tombstone for the retired business-formation section (/business/services/*).
 * Those services are no longer offered, and no current page is a topical match —
 * a 301 to the homepage would just be reclassified as a soft-404, so we return a
 * hard 410 and let Google drop the URLs. Optional catch-all so /business and every
 * path beneath it are covered, including ones Search Console hasn't reported.
 */
const BODY = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>Page no longer available</title><meta name="robots" content="noindex"></head>
<body style="font-family:system-ui,sans-serif;max-width:32rem;margin:20vh auto;padding:0 1.5rem;line-height:1.6">
<h1 style="font-size:1.5rem">This page is no longer available</h1>
<p>Impeccabyte no longer offers business-formation services. We&rsquo;re a merchant services and payment processing company.</p>
<p><a href="/">Go to the homepage</a> &middot; <a href="/contact">Talk to us about payments</a></p>
</body>
</html>`;

export function GET() {
  return new Response(BODY, {
    status: 410,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "x-robots-tag": "noindex",
      "cache-control": "public, max-age=3600",
    },
  });
}
```

- [ ] **Step 4: Run the test and verify it passes**

Run: `npx vitest run lib/seo/gone.test.ts`
Expected: PASS.

- [ ] **Step 5: Verify against a real server**

Run `npm run build && npm run start`, then:

```bash
for p in /business /business/ /business/services/registered-agent /business/services/registered-agent/ /business/services/annual-report/; do
  printf '%s -> ' "$p"
  curl -s -o /dev/null -w '%{http_code}\n' "http://localhost:3000$p"
done
```

Expected: `410` for every path. A `308` on the trailing-slash variants means Next normalized first; that is acceptable (the final status is still 410), but note it. A `404` means the optional catch-all is not matching — check the directory name is exactly `[[...slug]]`.

- [ ] **Step 6: Confirm the 410 does not leak into the sitemap**

Run: `npx vitest run lib/seo/sitemap.test.ts` and grep:

```bash
grep -n "business" lib/seo/sitemap.ts
```

Expected: no matches. `/business` must never appear in the sitemap.

- [ ] **Step 7: Full gate**

Run: `npm run test && npm run lint && npm run build`
Expected: all pass.

- [ ] **Step 8: Commit**

```bash
git add "app/business/[[...slug]]/route.ts" lib/seo/gone.test.ts
git commit -m "feat(seo): return 410 Gone for the retired /business section

Business-formation services are no longer offered and no current page is
a topical match, so an irrelevant 301 would read as a soft-404. An
optional catch-all Route Handler serves a hard 410 with a short human
body for /business and everything beneath it."
```

---

### Task 5: Live verification suite and DNS runbook

The DNS cutover is an owner action; this task ships the tooling that proves it worked.

**Files:**
- Create: `lib/seo/live-check.test.ts`
- Create: `docs/runbooks/2026-07-29-www-dns-cutover.md`

**Interfaces:**
- Consumes: `LEGACY_REDIRECTS`, `REPORTED_LEGACY_PATHS`, `GONE_PREFIX` from `lib/seo/redirects.ts`; `sitemapPaths()` from `lib/seo/sitemap.ts`; `SITE_URL` from `lib/seo/org.ts`.
- Produces: `SEO_CHECK_BASE_URL=<url> npx vitest run lib/seo/live-check.test.ts` — fails on any URL whose live status, redirect target, or canonical is wrong.

**Why a gated vitest suite and not a standalone script:** a plain Node script cannot resolve
this repo's `@/` path alias, which `lib/seo/sitemap.ts` and `lib/data.ts` both use — verified
during pre-flight (`ERR_MODULE_NOT_FOUND: Cannot find package '@/lib'`), including under
`--experimental-strip-types`. Vitest already resolves the alias, so the suite imports the
redirect map directly and the checked-in URL lists stay the single source of truth.

- [ ] **Step 1: Write the gated live-check suite**

Create `lib/seo/live-check.test.ts`:

```ts
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
      expect(await canonicalOf(url.replace(SITE_URL, BASE!))).toBe(url);
    },
    TIMEOUT
  );

  it(
    "canonicalises the /?ref=ry.php duplicate to the homepage",
    async () => {
      expect(await canonicalOf(`${BASE}/?ref=ry.php`)).toBe(`${SITE_URL}/`);
    },
    TIMEOUT
  );
});
```

- [ ] **Step 2: Confirm the suite is inert without the env var**

Run: `npm run test`
Expected: PASS, with `lib/seo/live-check.test.ts` reported as skipped. The default test run must stay offline — if it tries to hit the network, `describe.skipIf` is wired wrong.

- [ ] **Step 3: Run it against localhost and confirm it reports honestly**

Run `npm run build && npm run start`, then in a second shell:

```bash
SEO_CHECK_BASE_URL=http://localhost:3000 npx vitest run lib/seo/live-check.test.ts
```

Expected: the canonical, 410, and `?ref=` cases PASS. The www cases will **FAIL** — `http://www.localhost:3000` does not resolve — and that is correct pre-cutover. Confirm the failures name the www host rather than something unrelated. The point of this step is to prove the suite detects problems instead of silently passing; a fully green run here would mean the assertions are not actually firing.

- [ ] **Step 4: Write the DNS runbook**

Create `docs/runbooks/2026-07-29-www-dns-cutover.md`:

```markdown
# www DNS cutover — impeccabyte.com

**Why:** `www.impeccabyte.com` resolves to `192.64.119.103` (Namecheap URL-forwarding).
It serves no TLS certificate, so `https://www.impeccabyte.com/...` times out, and Googlebot
has parked 20 legacy URLs as crawled-not-indexed. Over plain HTTP the forwarder also
discards the path, flattening every legacy URL onto the apex homepage.

Until this cutover lands, the redirect map in `lib/seo/redirects.ts` cannot fire for www.

**Verify the problem before changing anything:**

    dig +short www.impeccabyte.com A          # expect 192.64.119.103
    curl -I --max-time 10 https://www.impeccabyte.com/   # expect a timeout
    curl -sI http://www.impeccabyte.com/about/ | head -3 # expect 301 -> apex, path dropped

**Steps:**

1. Railway → the frontend service → Settings → Networking → add custom domain
   `www.impeccabyte.com`. Copy the CNAME target Railway shows.
2. Namecheap → Domain List → impeccabyte.com → Advanced DNS.
   - Delete the `www` **URL Redirect** record (and any `www` A record pointing at
     `192.64.119.103`).
   - Add: Type `CNAME`, Host `www`, Value `<the Railway target>`, TTL Automatic.
   - Leave the apex record alone — it already points at Railway and is serving fine.
3. Wait for propagation and certificate issuance (typically minutes, up to an hour).

**Verify the fix:**

    dig +short www.impeccabyte.com
    curl -sI https://www.impeccabyte.com/ | head -3         # expect 308 -> https://impeccabyte.com/
    SEO_CHECK_BASE_URL=https://impeccabyte.com npx vitest run lib/seo/live-check.test.ts   # expect every case to pass

**Then, in Google Search Console:**

1. Confirm the property is a **Domain** property (covers apex, www, and subdomains).
   If it is a URL-prefix property for the apex only, add one for www so the redirects
   are recrawled.
2. Delete the `app.impeccabyte.com` property — that hostname is NXDOMAIN and its 6
   reported URLs cannot be fixed or validated.
3. Open the "Crawled - currently not indexed" report and click **Validate Fix**.

**Expected timeline:** recrawling is on Google's schedule. Expect weeks, not days, for the
20 legacy URLs to clear. Re-run the live-check suite if the report still shows failures —
it distinguishes "our fix is broken" from "Google hasn't recrawled yet".

**Rollback:** re-add the Namecheap `www` URL-redirect record. The apex is a separate
record and is unaffected by anything in this runbook.
```

- [ ] **Step 5: Full gate**

Run: `npm run test && npm run lint && npm run build`
Expected: all pass.

- [ ] **Step 6: Commit**

```bash
git add lib/seo/live-check.test.ts docs/runbooks/2026-07-29-www-dns-cutover.md
git commit -m "chore(seo): add indexing verification script and DNS cutover runbook

A vitest suite gated on SEO_CHECK_BASE_URL probes every reported URL and
every sitemap page for the right status, redirect target, and canonical.
It imports the redirect map directly, so the checked-in lists stay the
single source of truth; a plain Node script could not, because it cannot
resolve the repo's @/ path alias. The runbook covers the Namecheap ->
Railway www cutover that the redirect map depends on."
```

---

## Post-implementation

1. Open a PR from `fix/search-console-indexing` to `main`.
2. Deploy. Run `SEO_CHECK_BASE_URL=https://impeccabyte.com npx vitest run lib/seo/live-check.test.ts` — the 410, canonical, and `?ref=` cases must pass immediately; the www cases will still fail until the DNS cutover.
3. Hand `docs/runbooks/2026-07-29-www-dns-cutover.md` to whoever owns the Namecheap account.
4. After cutover, re-run the live-check suite and confirm every case passes, then trigger **Validate Fix** in Search Console.

## Out of scope

Per the spec: no `X-Robots-Tag` on `/manifest.webmanifest` or `_next/static` fonts (crawled-not-indexed is correct for non-HTML assets); nothing for `app.impeccabyte.com` (NXDOMAIN); no rebuilding of the retired blog posts or business-formation content; and no Google Business Profile, citation, or backlink work.
