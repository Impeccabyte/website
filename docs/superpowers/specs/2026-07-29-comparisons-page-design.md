# Comparisons page (`/compare`) — design

**Date:** 2026-07-29
**Status:** Approved design, pending implementation plan
**Source:** Claude Design project `51f581ca-a3a4-43d8-99ff-53acf9e983d1`,
`Impeccabyte Site.dc.html` (comparisons markup at lines 1855–1934, `COMPARE` data at
line 3399, swap keyframes and `.ib-cmp-*` responsive rules in the head `<style>`), plus
the written handoff in `design_handoff_compare_pages/README.md`.

## Goal

Ship a comparisons page — Impeccabyte vs. Square, Shopify, and Toast — presented one
competitor at a time behind a pill switcher. Deliberately **not** in the primary nav or
mobile drawer; reachable only from a new "Compare" column in the footer, one crawlable
link per competitor.

The prototype is a client-side SPA. Production must be crawlable: one statically rendered
URL per competitor, with that competitor's full content in the served HTML.

## Decisions

1. **Four routes, differentiated `h1`.** `/compare` plus `/compare/{square,shopify,toast}`,
   each canonical to itself. Accepted trade-off: the hub and `/compare/square` share a body.
   The differentiated `h1`, title, description, and OG card are what keep them distinct.
2. **Deep-page heading resolution.** The prototype's per-competitor block heading is an
   `h2` reading "Impeccabyte vs. {Name}" — on a deep page that repeats the `h1` verbatim,
   twice, ~200px apart. So:
   - **Hub:** `h1` = "The *honest* comparison." → block keeps its `h2` (exact prototype).
   - **Deep pages:** `h1` = "Impeccabyte vs. {Name}" and the block's `h2` is **dropped**;
     the centred intro starts at the tagline. The `h1`'s competitor name is driven by the
     same client state as the tabs, so it stays truthful after a switch. Server-rendered
     with the route's competitor, so crawlers get the correct one.
3. **Shallow URL update via `window.history.replaceState`.** The App Router–supported
   mechanism (`node_modules/next/dist/docs/01-app/01-getting-started/04-linking-and-navigating.md`,
   "Native History API"). `replaceState` rather than `pushState` so Back leaves the page
   instead of cycling three tabs.
4. **Animation by React key, not keyframe alternation.** The prototype forces an animation
   restart by alternating between two identical keyframes (`ibSwapA`/`ibSwapB`). In React,
   `key={slug}` remounts the block and one `@keyframes ibSwap` replays. Gated on
   `prefers-reduced-motion: no-preference`.
5. **`Callout` gains an `info` variant**, taken from the design-system bundle rather than
   guessed: `background: var(--slate-50); border-color: #D6E0E4;`, icon in `--slate-500`.
6. **No `FAQPage` JSON-LD.** There is no visible Q&A on the page. Invisible FAQ markup is a
   structured-data violation. `BreadcrumbList` only.
7. **OG cards rendered from the archived `next/og` template**, then the template is removed
   again — the documented process in `public/og/README.md`. `next/og` stays out of the build.

## Routes

| Route | `h1` | `<title>` (before ` · Impeccabyte`) | OG card |
| --- | --- | --- | --- |
| `/compare` | The *honest* comparison. | `Compare us — the honest comparison` | `compare.png` |
| `/compare/square` | Impeccabyte vs. Square | `Impeccabyte vs. Square — the honest comparison` | `compare-square.png` |
| `/compare/shopify` | Impeccabyte vs. Shopify | `Impeccabyte vs. Shopify — the honest comparison` | `compare-shopify.png` |
| `/compare/toast` | Impeccabyte vs. Toast | `Impeccabyte vs. Toast — the honest comparison` | `compare-toast.png` |

Titles must **not** end in `| Impeccabyte` — the root layout template already appends
`· Impeccabyte`. Rendered lengths: 47 / 59 / 60 / 58 characters.

Every route carries `alternates: { canonical: "/compare/…" }` pointing at itself.

### Meta descriptions (final)

- `/compare` (149): `Impeccabyte vs. Square, Shopify, and Toast. They're payment facilitators; we get you your own merchant account on TSYS or First Data Nashville rails.`
- `/compare/square` (155): `Square is a payment facilitator; Impeccabyte gets you your own merchant account on TSYS or First Data Nashville rails. Compare pricing, holds, and payouts.`
- `/compare/shopify` (159): `Shopify Payments is an aggregated account, and a third-party gateway costs you penalty fees. Impeccabyte gets you your own merchant account — and cart freedom.`
- `/compare/toast` (152): `Toast bundles processing, multi-year terms, and hardware that bricks if you leave. Impeccabyte gets you your own merchant account and hardware you keep.`

## Files

**New**

- `lib/compare.ts` — types, the verbatim `COMPETITORS` data, `competitorOrder`,
  `COMPARE_AS_OF`, `comparisonsLegalNotice`.
- `lib/compare.test.ts` — shape guard on the ported data.
- `components/compare/comparison-experience.tsx` — `"use client"`. Owns the hero, the active
  slug, the pill switcher, the shallow URL update, and the animated block. See
  [Component contract](#component-contract).
- `app/compare/page.tsx` — hub.
- `app/compare/[competitor]/page.tsx` — the three competitor routes.
- `public/og/compare.png`, `compare-square.png`, `compare-shopify.png`, `compare-toast.png`.

**Modified**

- `components/ui/callout.tsx` — add the `info` variant.
- `app/globals.css` — expose `--color-slate-*` in `@theme inline`; add `@keyframes ibSwap`
  and the `.ib-cmp-swap` class.
- `components/site/site-footer.tsx` — the "Compare" column.
- `lib/seo/sitemap.ts` — four new paths.
- `lib/seo/sitemap.test.ts` — assert them.
- `public/og/README.md` — four new rows in the files → routes table.

**Temporarily restored, then deleted** (OG render step only)

- `lib/og/render.tsx`, `lib/og/copy.ts`, `lib/og/fonts/*.woff` from commit `85a2653`.
- `app/compare/opengraph-image.tsx`, `app/compare/[competitor]/opengraph-image.tsx`.

## Data model

```ts
export type CompetitorSlug = "square" | "shopify" | "toast";

export type CompareRow = { d: string; them: string; us: string };

export type Competitor = {
  slug: CompetitorSlug;
  name: string;
  tagline: string;
  who: string;
  them: [string, string, string];
  us: [string, string, string];
  rows: [CompareRow, CompareRow, CompareRow, CompareRow, CompareRow];
};

export const competitorOrder: CompetitorSlug[] = ["square", "shopify", "toast"];

/** Freshness marker on the legal line. A truth claim — update deliberately. */
export const COMPARE_AS_OF = "July 2026";
```

Tuple types (`[string, string, string]`, five-element `rows`) are deliberate: the layout
assumes exactly three bullets per card and five table rows, and the tuple makes a silent
drift a type error.

## Comparison copy — verbatim, do not edit

Ported byte-for-byte from the prototype's `COMPARE` object. Copy has been legally hedged on
purpose ("can", "often", "are common"). **Any change routes through legal/compliance.**
Note in particular that the Toast contract row concedes our own two-year term.

> **Typography note (flag, do not silently fix):** the source mixes straight and curly
> apostrophes — `you're` / `we'll` / `You've` are straight, `don’t` / `You’d` are curly, and
> Toast uses curly double quotes around `“free”`. This is reproduced exactly. If the copy
> owner wants them normalised, that is a copy change and goes through the same review.

### Square

- **tagline:** `The default way to start — and a hard place to grow.`
- **who:** `Square made taking a card payment trivially easy, and we respect that. But you're a sub-merchant on their platform — and when their risk models get nervous, your money stops moving.`
- **Choose Square if…**
  1. `You opened yesterday and need to take a card today`
  2. `Your volume is tiny or seasonal`
  3. `You want free POS software above all else`
- **Choose Impeccabyte if…**
  1. `You're past $8–10K a month and flat rate is quietly expensive`
  2. `You've had funds held or an account frozen`
  3. `You want underwriting up front and a human on the phone`

| Dimension | Square | Impeccabyte |
| --- | --- | --- |
| Pricing | Flat 2.6% + 10¢ in person; 2.9% + 30¢ online | Interchange-plus — actual cost plus a transparent markup |
| Your account | Sub-merchant, aggregated under Square | Your own merchant account on TSYS or First Data Nashville |
| Holds & freezes | Automated risk sweeps can freeze funds without warning | Underwritten up front, so surprises don’t happen later |
| Payouts | 1–2 business days; a fee for instant | Same-day on approval; next-day standard |
| Support | Chat bots and ticket queues | A person who knows your account by name |

### Shopify

- **tagline:** `The best storefront builder in the game — and a walled garden.`
- **who:** `We'll say it plainly: Shopify's storefront is excellent. But Shopify Payments is an aggregated account, and choosing any other gateway costs you penalty fees on every sale.`
- **Choose Shopify if…**
  1. `Your business is your online store, full stop`
  2. `You're happy with Shopify Payments and its rates`
  3. `You want themes, apps, and checkout in one box`
- **Choose Impeccabyte if…**
  1. `You sell across channels — in person, invoices, online`
  2. `You want cart freedom: WooCommerce, BigCommerce, etc…`
  3. `Shopify Payments declined or dropped your category`

| Dimension | Shopify | Impeccabyte |
| --- | --- | --- |
| Pricing | Flat 2.9% + 30¢ online — plus penalty fees if you use a third-party gateway | Interchange-plus, with no penalty for choosing your own stack |
| Your account | Aggregated under Shopify Payments | Your own merchant account on TSYS or First Data Nashville |
| Cart & gateway choice | One cart; outside gateways are penalized | Any cart that talks to our twelve gateways and platforms |
| Holds & freezes | Automated reserves and payout pauses | Underwritten up front — no surprise reserves |
| Support | Help center and chat first | A person who knows your account by name |

### Toast

- **tagline:** `A serious restaurant POS — with serious strings attached.`
- **who:** `Toast earns its place in full-service restaurants. But the “free” hardware gets paid for somewhere — processing markups, multi-year terms, and equipment that only works with Toast.`
- **Choose Toast if…**
  1. `You run a full-service restaurant and want POS, KDS, and payroll in one`
  2. `You're fine trading rate transparency for an all-in-one`
  3. `You have the volume to negotiate their pricing`
- **Choose Impeccabyte if…**
  1. `You're counter-service, a café, a truck, or a caterer`
  2. `You want hardware you own and keep if you leave`
  3. `You’d rather see the real rate than a bundled one`

| Dimension | Toast | Impeccabyte |
| --- | --- | --- |
| Pricing | Quote-based flat rates, often padded to cover “free” hardware | Interchange-plus — the markup is on paper |
| Contract | Multi-year terms, with padded rates hiding inside them | A two-year term too — but the rate is interchange-plus, on paper |
| Hardware | Proprietary — it bricks if you leave | PAX, Dejavoo, Ingenico — yours, on open rails |
| Your account | Processing bundled through Toast | Your own merchant account on TSYS or First Data Nashville |
| Support | Call center, tiered by plan | A person who knows your account by name |

## Component contract

Both routes render the same client component. The hero lives **inside** it — not in the page
— because on deep routes the `h1` has to track the active tab.

```ts
type ComparisonExperienceProps = {
  /** Server-rendered starting competitor. Hub passes "square". */
  initial: CompetitorSlug;
  /**
   * "hub"        — h1 is the static "The honest comparison."; the block keeps its h2.
   * "competitor" — h1 is "Impeccabyte vs. {activeName}"; the block's h2 is omitted.
   */
  variant: "hub" | "competitor";
};
```

The page files stay thin: metadata, `JsonLd`, `<ComparisonExperience …/>`, the `Callout`, and
the `DarkCTA`. The `Callout` and `DarkCTA` stay server-rendered — they do not change with the
active tab, so they sit outside the client component and outside the keyed block.

## Page structure

Section wrappers follow the site convention (`<section className="px-6 …"><Container>`),
matching `/integrations` and `/products/[key]`.

1. **Hero** — `<Container>` (1240), left-aligned block capped at 720px.
   `<Eyebrow>Comparisons</Eyebrow>`; `h1` in `font-display` 600,
   `clamp(38px, 5vw, 58px)`, `letter-spacing: -0.025em`, `line-height: 1.03`; then the
   lede at 19px / 1.6 `text-ink-600`, `max-w-[620px]`:

   > Square, Shopify, and Toast are payment facilitators — you rent a slice of their
   > merchant account. Impeccabyte gets you your own, on TSYS or First Data Nashville
   > rails. Almost every difference below falls out of that one fact.

   The hub's `h1` is `The <span class="em">honest</span> comparison.` (`.em` is the existing
   italic-clay flourish). Deep routes render `Impeccabyte vs. {activeName}`.

2. **Switcher** — `<Container className="max-w-[1160px]">`, three centred pills.
   Active: `bg-clay-500 text-[#FBF6EE] shadow-brand`, border `clay-500`.
   Inactive: `bg-white border-ink-200 text-ink-700`.
   Both 15px / 600, padding `10px 26px`, `rounded-pill`, `transition-all duration-[140ms] ease-out`.
   Rendered as `<button type="button">` with `aria-pressed`. Clicking the active pill is a
   no-op (no state write, no history entry, no animation restart).

3. **Per-competitor block** — wrapped in a `key={slug}` div carrying `.ib-cmp-swap`.
   a. Centred intro, `max-w-[680px]`: `h2` (hub only) `Impeccabyte vs. {name}` in
      `font-display` 600 `clamp(24px, 3vw, 34px)`; tagline at 15px / 600 `text-clay-600`;
      `who` paragraph at 16px / 1.65 `text-ink-600`.
   b. Two cards, `grid-cols-2 gap-[14px] max-[760px]:grid-cols-1`, `items-stretch`, padding 26px.
      *Choose {name} if…* — white `Card`, 1px `border-default`, bullets with a 22px
      `rounded-[7px]` `bg-ink-100` chip and a `text-ink-500` `Minus` icon, body `text-ink-600`.
      *Choose Impeccabyte if…* — `border-[1.5px] border-clay-300`, chip `bg-sage-50`,
      `Check` icon `text-sage-600`, body `text-ink-700`.
      Icons are lucide at `size={13} strokeWidth={2.4}`. Bullets 14.5px / 1.55, 12px stack gap.
      Card titles are `h3`, 16px / 700 `font-sans` `text-ink-900`.
   c. **Table** — white surface, `rounded-lg overflow-hidden`, 1px `border-default`,
      `shadow-sm`. Rows are `grid-cols-[170px_1fr_1.1fr]` separated by
      `border-t border-ink-100`. Header row: blank cell, competitor name, then `IMPECCABYTE`
      — both 12px / 700 / `.08em` uppercase; competitor `text-ink-400`, Impeccabyte
      `text-clay-700` on `bg-clay-50`. Body rows: dimension label 12px / 700 / `.06em`
      uppercase `text-ink-500`; competitor cell 14px / 1.55 `text-ink-600`; Impeccabyte cell
      14px / 1.55 `text-ink-800` on `bg-clay-50` — the whole column is tinted. Cell padding
      `16px 18px`. At `max-[760px]` rows collapse to one column, the header row is hidden,
      and each row's first cell loses its bottom padding.

      Semantics: the data is genuinely tabular, but a real `<table>` cannot collapse to a
      single column at 760px, so the grid divs carry ARIA roles instead — `role="table"` on
      the card, `role="row"` on each row, `role="columnheader"` on the three header cells,
      `role="rowheader"` on the dimension label, and `role="cell"` on the two data cells.
      On mobile the header row is `display: none`, which drops it from the accessibility
      tree too; the row headers still carry the meaning, which is the intended reading order.

4. **Honesty callout** — `Callout` `variant="info"`, title
   `If you're happy where you are, stay`:

   > These are good products — that's why they're the comparison. Our case is simple: past a
   > certain size, owning your merchant account beats renting one. If you're not there yet,
   > we'll tell you so on the first call.

5. **Dark CTA** — the existing `DarkCTA` component, which already carries the radial amber
   wash (`radial-gradient(80% 130% at 50% -25%, rgba(224,160,77,0.22), transparent 62%)`).
   `titleA="An account that's"`, `titleEm="actually yours."`,
   body `Bring a recent statement from any of the three — we'll show you, line by line, what
   the same month would have cost on your own account.`
   Primary accent `Talk to us` → `/contact`; secondary `See pricing` → `/pricing`.
   Plain links, not `ChatLink` — matches the prototype's `goContact`/`goPricing`.

6. **Legal line** — passed as `DarkCTA`'s existing `footnote` prop, which renders it centred,
   12px / 1.6 `text-ink-400`, `max-w-[760px]` under the card. Built from `COMPARE_AS_OF`:

   > Comparisons reflect each provider's published pricing and policies as of
   > **{COMPARE_AS_OF}** and may change — always check their current terms. All product names
   > and brands are property of their respective owners; use here is for identification and
   > comparison only.

   This puts the trademark disclaimer on every compare route, as required.

## Interaction

```
click pill
  └─ same slug?  → no-op
     different?  → setActive(slug)
                   history.replaceState(null, "", `/compare/${slug}`)
                   block remounts on key → .ib-cmp-swap replays
```

`globals.css`:

```css
@keyframes ibSwap {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: none; }
}
@media (prefers-reduced-motion: no-preference) {
  .ib-cmp-swap { animation: ibSwap 380ms var(--ease-out) both; }
}
```

Unlike the site's `.ib-rv` scroll-driven reveals, this is a time-based animation, so the
global `prefers-reduced-motion: reduce` block (which zeroes `animation-duration`) would
already neutralise it. The explicit `no-preference` gate is belt-and-braces and keeps the
rule readable next to the existing ones.

Because the animation is transform + opacity only, there is no CLS on switch. The block also
animates once on first paint, which matches the site's existing entrance feel.

No other stateful behaviour on the page.

## SEO

- `generateStaticParams()` over `competitorOrder`; unknown slugs `notFound()`.
- `JsonLd` with `breadcrumbSchema`:
  - hub: Home → Compare
  - deep: Home → Compare → vs. {Name}
- No `Service` node and no `FAQPage` (see Decisions 6).
- `lib/seo/sitemap.ts` gains `/compare`, `/compare/square`, `/compare/shopify`,
  `/compare/toast`.
- `app/robots.ts` disallows only `/tools/`, so no change is needed.
- Internal links: the footer "Compare" column. No nav or mobile-drawer entry — intentional,
  per the handoff.

### Footer

A `FooterColumn` titled `Compare`, stacked under `Company` in the existing
`flex flex-col gap-10` wrapper — the same pattern as Products/Pricing Programs and
Industries/Benefits. (The handoff says 32px; the codebase's established stack gap is
`gap-10` = 40px, and matching the two neighbouring columns wins over a one-off value.)
Links are real `next/link` anchors: `vs. Square` → `/compare/square`, `vs. Shopify` →
`/compare/shopify`, `vs. Toast` → `/compare/toast`.

## OG images

Follows `public/og/README.md` exactly. `lib/og/render.tsx`, `lib/og/copy.ts`, and the five
`lib/og/fonts/*.woff` files are restored from commit `85a2653`, four `opengraph-image.tsx`
routes are added under `app/compare/`, `next dev` renders them, each is fetched into
`public/og/`, and then every restored file and route is deleted again so `next/og` never
enters the production build.

`OgCopy` is `{ eyebrow, titleA, titleEm, titleZ?, subtitle }`; `titleEm` renders italic clay.
`titleZ` is optional — omitted on the three competitor cards.

| File | eyebrow | titleA | titleEm | titleZ | subtitle |
| --- | --- | --- | --- | --- | --- |
| `compare.png` | Comparisons | The | honest | `comparison.` | Square, Shopify, and Toast rent you a slice of their merchant account. We get you your own. |
| `compare-square.png` | Comparisons | Impeccabyte vs. | Square | *omitted* | Flat rate, aggregated accounts, and automated holds — versus your own merchant account. |
| `compare-shopify.png` | Comparisons | Impeccabyte vs. | Shopify | *omitted* | A great storefront, a walled garden. Penalty fees for any gateway but theirs. |
| `compare-toast.png` | Comparisons | Impeccabyte vs. | Toast | *omitted* | “Free” hardware, multi-year terms, and equipment that bricks if you leave. |

Wired through the existing `ogImages(slug, alt)` helper, which sets `openGraph.images` and
`twitter.images`; `twitter.card` is already `summary_large_image` from the root layout.

## Design tokens

No new tokens. Everything resolves to the existing Impeccabyte scale: `--paper` page,
`--surface-card` white cards with warm 1px hairlines and warm shadows, `--clay-500` for the
active pill, `--clay-50` for the tinted Impeccabyte column, `--sage-*` for the positive
checks, `--amber-300` on dark, Newsreader display + Hanken Grotesk UI, pill buttons, 20px
card radius. Never pure black, never a pure-white page background.

The only `globals.css` additions are `@keyframes ibSwap` / `.ib-cmp-swap` and exposing the
already-defined `--slate-*` values to Tailwind's `@theme inline` block so the new `info`
callout can use `bg-slate-50` / `text-slate-500`.

## Testing

- `lib/compare.test.ts` — every slug in `competitorOrder` resolves; each competitor has
  exactly 3 `them`, 3 `us`, and 5 `rows`; every row has non-empty `d`/`them`/`us`;
  `COMPARE_AS_OF` is non-empty. A cheap guard against someone silently trimming
  legally-hedged copy.
- `lib/seo/sitemap.test.ts` — the four compare URLs are present, and the existing
  no-duplicates assertion still holds.
- Manual: `next build` succeeds; view-source on `/compare/toast` shows the Toast table rows
  in the HTML (not just after hydration); switching tabs updates the URL without a reload;
  Back leaves the page.

## Out of scope

- Any change to the primary nav or mobile drawer.
- Any edit to the competitor copy (compliance-reviewed; changes go through legal).
- Adding further competitors — the tuple types and the three-pill layout assume exactly three.
