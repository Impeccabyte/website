# Comparisons page (`/compare`) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship four statically rendered comparison routes — `/compare` plus `/compare/{square,shopify,toast}` — presenting Impeccabyte against one competitor at a time behind a pill switcher, linked only from a new footer "Compare" column.

**Architecture:** A single typed data module (`lib/compare.ts`) holds the competitor copy, ported verbatim from the design prototype. One client component owns the hero, the pill switcher, and a `key`-remounted animated block; both the hub page and the dynamic `[competitor]` page render it with a different `variant`. Everything that does not change with the active tab (the honesty callout, the dark CTA, the legal line, the JSON-LD) stays server-rendered outside it. Tab clicks swap content client-side and update the URL with `window.history.replaceState` — the App Router's supported shallow-update mechanism — while a direct hit on `/compare/toast` server-renders Toast's full table into the HTML.

**Tech Stack:** Next.js 16.2.10 (App Router), React 19.2.4, TypeScript 5 (strict), Tailwind CSS v4 (`@theme inline` tokens in `app/globals.css`), lucide-react, Vitest 3.

**Design spec:** `docs/superpowers/specs/2026-07-29-comparisons-page-design.md` — read it before starting. It contains the verbatim competitor copy and the reasoning behind every decision below.

## Global Constraints

- **This is not the Next.js you know.** Per `AGENTS.md`, read the relevant guide in `node_modules/next/dist/docs/` before writing code that touches a framework API. The shallow-URL mechanism used here is documented at `node_modules/next/dist/docs/01-app/01-getting-started/04-linking-and-navigating.md` under "Native History API".
- **Competitor copy is verbatim and compliance-reviewed.** It is legally hedged on purpose ("can", "often", "are common"). Do not reword, punch up, tighten, or "fix" it — including the mixed straight/curly apostrophes (`you're` and `we'll` are straight; `don’t` and `You’d` are curly) and the curly double quotes around `“free”`. Copy changes route through legal/compliance, not through this plan.
- **Page titles must NOT end in `| Impeccabyte`.** The root layout in `app/layout.tsx` applies the template `%s · Impeccabyte`; adding the brand again doubles it.
- **Every route carries a self-referencing canonical** via `alternates: { canonical: "/compare/…" }`. This is a standing requirement for every new public page on this site.
- **No `FAQPage` JSON-LD on these routes.** There is no visible Q&A; invisible FAQ markup is a structured-data violation.
- **No nav or mobile-drawer entry for Compare.** Footer link only — this is intentional, not an oversight. Do not touch `components/site/site-header.tsx`.
- **`next/og` must not end up in the production build.** It is restored temporarily in Task 7 and deleted again in the same task. See `public/og/README.md`.
- **Never pure black, never a pure-white page background.** All colours come from the existing token scale.
- **Run from the repo root** on branch `feat/compare-pages`.

---

## File Structure

**Created**

| File | Responsibility |
| --- | --- |
| `lib/compare.ts` | Types, the verbatim competitor data, `competitorOrder`, `COMPARE_AS_OF`, the legal notice string. No JSX. |
| `lib/compare.test.ts` | Shape guard on the ported data. |
| `components/compare/comparison-block.tsx` | Pure presentation for one competitor: centred intro, the two choose-if cards, the comparison table. No state. |
| `components/compare/comparison-experience.tsx` | `"use client"`. Hero + pill switcher + the keyed, animated `ComparisonBlock`. Owns all page state. |
| `components/compare/comparison-closing.tsx` | Server. The honesty callout + dark CTA + dated legal line, shared by both routes. Sole home for that copy. |
| `app/compare/page.tsx` | The hub route. |
| `app/compare/[competitor]/page.tsx` | The three competitor routes. |
| `public/og/compare*.png` | Four 1200×630 share cards. |

**Modified**

| File | Change |
| --- | --- |
| `app/globals.css` | Expose `--color-slate-*` in `@theme inline`; add `@keyframes ibSwap` + `.ib-cmp-swap`. |
| `components/ui/callout.tsx` | Add the `info` variant. |
| `components/site/site-footer.tsx` | Add the "Compare" column under "Company". |
| `lib/seo/sitemap.ts` | Add the four compare paths. |
| `lib/seo/sitemap.test.ts` | Assert them. |
| `public/og/README.md` | Four new rows in the files → routes table. |

---

### Task 1: Comparison data module

**Files:**
- Create: `lib/compare.ts`
- Test: `lib/compare.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `type CompetitorSlug = "square" | "shopify" | "toast"`; `type CompareRow = { d: string; them: string; us: string }`; `type Competitor = { slug: CompetitorSlug; name: string; tagline: string; who: string; them: [string, string, string]; us: [string, string, string]; rows: [CompareRow, CompareRow, CompareRow, CompareRow, CompareRow] }`; `const COMPETITORS: Record<CompetitorSlug, Competitor>`; `const competitorOrder: CompetitorSlug[]`; `const COMPARE_AS_OF: string`; `const HERO_LEDE: string`; `const comparisonsLegalNotice: string`; `function isCompetitorSlug(v: string): v is CompetitorSlug`.

- [ ] **Step 1: Write the failing test**

Create `lib/compare.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  COMPETITORS,
  competitorOrder,
  COMPARE_AS_OF,
  comparisonsLegalNotice,
  isCompetitorSlug,
} from "@/lib/compare";

describe("competitorOrder", () => {
  it("is the three competitors, in switcher order", () => {
    expect(competitorOrder).toEqual(["square", "shopify", "toast"]);
  });

  it("every slug resolves to a competitor that knows its own slug", () => {
    for (const slug of competitorOrder) {
      expect(COMPETITORS[slug]).toBeDefined();
      expect(COMPETITORS[slug].slug).toBe(slug);
    }
  });
});

describe("competitor data shape", () => {
  // The layout assumes exactly three bullets per card and five table rows.
  // A silent trim to legally-reviewed copy should fail here, loudly.
  it.each(["square", "shopify", "toast"] as const)("%s has 3 + 3 bullets and 5 rows", (slug) => {
    const c = COMPETITORS[slug];
    expect(c.them).toHaveLength(3);
    expect(c.us).toHaveLength(3);
    expect(c.rows).toHaveLength(5);
  });

  it.each(["square", "shopify", "toast"] as const)("%s has no empty strings", (slug) => {
    const c = COMPETITORS[slug];
    for (const s of [c.name, c.tagline, c.who, ...c.them, ...c.us]) {
      expect(s.trim().length).toBeGreaterThan(0);
    }
    for (const r of c.rows) {
      for (const s of [r.d, r.them, r.us]) expect(s.trim().length).toBeGreaterThan(0);
    }
  });

  it("concedes our own two-year term on the Toast contract row", () => {
    const contract = COMPETITORS.toast.rows.find((r) => r.d === "Contract");
    expect(contract?.us).toContain("A two-year term too");
  });
});

describe("freshness marker", () => {
  it("is a non-empty month-and-year the legal notice interpolates", () => {
    expect(COMPARE_AS_OF).toMatch(/^[A-Z][a-z]+ \d{4}$/);
    expect(comparisonsLegalNotice).toContain(`as of ${COMPARE_AS_OF}`);
  });

  it("keeps the trademark disclaimer in the notice", () => {
    expect(comparisonsLegalNotice).toContain("property of their respective owners");
  });
});

describe("isCompetitorSlug", () => {
  it("accepts known slugs and rejects everything else", () => {
    expect(isCompetitorSlug("square")).toBe(true);
    expect(isCompetitorSlug("stripe")).toBe(false);
    expect(isCompetitorSlug("")).toBe(false);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run lib/compare.test.ts`
Expected: FAIL — `Failed to resolve import "@/lib/compare"`.

- [ ] **Step 3: Write the data module**

Create `lib/compare.ts`. **Transcribe the strings exactly as written here** — they are the compliance-reviewed copy:

```ts
/**
 * The /compare comparison content — Impeccabyte vs. Square, Shopify, and Toast.
 *
 * COMPLIANCE: this copy is legally hedged on purpose ("can", "often", "are
 * common") and is dated by COMPARE_AS_OF. Do not reword it, do not strengthen a
 * claim, and do not normalise the mixed straight/curly apostrophes — the strings
 * are reproduced verbatim from the approved design. Any change routes through
 * legal/compliance first. Note that the Toast "Contract" row deliberately
 * concedes our own two-year term.
 */

export type CompetitorSlug = "square" | "shopify" | "toast";

/** One row of the comparison table: dimension, their answer, ours. */
export type CompareRow = { d: string; them: string; us: string };

export type Competitor = {
  slug: CompetitorSlug;
  name: string;
  tagline: string;
  who: string;
  /** Exactly three — the "Choose {name} if…" card. */
  them: [string, string, string];
  /** Exactly three — the "Choose Impeccabyte if…" card. */
  us: [string, string, string];
  /** Exactly five — the table body. Tuple width is load-bearing for the layout. */
  rows: [CompareRow, CompareRow, CompareRow, CompareRow, CompareRow];
};

/** Left-to-right order of the switcher pills. */
export const competitorOrder: CompetitorSlug[] = ["square", "shopify", "toast"];

/**
 * Freshness marker on the legal line. This is a truth claim about when we last
 * checked each provider's published pricing and policies — update it only when
 * someone has actually re-checked them.
 */
export const COMPARE_AS_OF = "July 2026";

/** Shared hero lede. Identical on all four routes. */
export const HERO_LEDE =
  "Square, Shopify, and Toast are payment facilitators — you rent a slice of their merchant account. Impeccabyte gets you your own, on TSYS or First Data Nashville rails. Almost every difference below falls out of that one fact.";

/** Dated comparison disclaimer + trademark notice. Must appear on every compare route. */
export const comparisonsLegalNotice = `Comparisons reflect each provider's published pricing and policies as of ${COMPARE_AS_OF} and may change — always check their current terms. All product names and brands are property of their respective owners; use here is for identification and comparison only.`;

export const COMPETITORS: Record<CompetitorSlug, Competitor> = {
  square: {
    slug: "square",
    name: "Square",
    tagline: "The default way to start — and a hard place to grow.",
    who: "Square made taking a card payment trivially easy, and we respect that. But you're a sub-merchant on their platform — and when their risk models get nervous, your money stops moving.",
    them: [
      "You opened yesterday and need to take a card today",
      "Your volume is tiny or seasonal",
      "You want free POS software above all else",
    ],
    us: [
      "You're past $8–10K a month and flat rate is quietly expensive",
      "You've had funds held or an account frozen",
      "You want underwriting up front and a human on the phone",
    ],
    rows: [
      {
        d: "Pricing",
        them: "Flat 2.6% + 10¢ in person; 2.9% + 30¢ online",
        us: "Interchange-plus — actual cost plus a transparent markup",
      },
      {
        d: "Your account",
        them: "Sub-merchant, aggregated under Square",
        us: "Your own merchant account on TSYS or First Data Nashville",
      },
      {
        d: "Holds & freezes",
        them: "Automated risk sweeps can freeze funds without warning",
        us: "Underwritten up front, so surprises don’t happen later",
      },
      {
        d: "Payouts",
        them: "1–2 business days; a fee for instant",
        us: "Same-day on approval; next-day standard",
      },
      {
        d: "Support",
        them: "Chat bots and ticket queues",
        us: "A person who knows your account by name",
      },
    ],
  },
  shopify: {
    slug: "shopify",
    name: "Shopify",
    tagline: "The best storefront builder in the game — and a walled garden.",
    who: "We'll say it plainly: Shopify's storefront is excellent. But Shopify Payments is an aggregated account, and choosing any other gateway costs you penalty fees on every sale.",
    them: [
      "Your business is your online store, full stop",
      "You're happy with Shopify Payments and its rates",
      "You want themes, apps, and checkout in one box",
    ],
    us: [
      "You sell across channels — in person, invoices, online",
      "You want cart freedom: WooCommerce, BigCommerce, etc…",
      "Shopify Payments declined or dropped your category",
    ],
    rows: [
      {
        d: "Pricing",
        them: "Flat 2.9% + 30¢ online — plus penalty fees if you use a third-party gateway",
        us: "Interchange-plus, with no penalty for choosing your own stack",
      },
      {
        d: "Your account",
        them: "Aggregated under Shopify Payments",
        us: "Your own merchant account on TSYS or First Data Nashville",
      },
      {
        d: "Cart & gateway choice",
        them: "One cart; outside gateways are penalized",
        us: "Any cart that talks to our twelve gateways and platforms",
      },
      {
        d: "Holds & freezes",
        them: "Automated reserves and payout pauses",
        us: "Underwritten up front — no surprise reserves",
      },
      {
        d: "Support",
        them: "Help center and chat first",
        us: "A person who knows your account by name",
      },
    ],
  },
  toast: {
    slug: "toast",
    name: "Toast",
    tagline: "A serious restaurant POS — with serious strings attached.",
    who: "Toast earns its place in full-service restaurants. But the “free” hardware gets paid for somewhere — processing markups, multi-year terms, and equipment that only works with Toast.",
    them: [
      "You run a full-service restaurant and want POS, KDS, and payroll in one",
      "You're fine trading rate transparency for an all-in-one",
      "You have the volume to negotiate their pricing",
    ],
    us: [
      "You're counter-service, a café, a truck, or a caterer",
      "You want hardware you own and keep if you leave",
      "You’d rather see the real rate than a bundled one",
    ],
    rows: [
      {
        d: "Pricing",
        them: "Quote-based flat rates, often padded to cover “free” hardware",
        us: "Interchange-plus — the markup is on paper",
      },
      {
        d: "Contract",
        them: "Multi-year terms, with padded rates hiding inside them",
        us: "A two-year term too — but the rate is interchange-plus, on paper",
      },
      {
        d: "Hardware",
        them: "Proprietary — it bricks if you leave",
        us: "PAX, Dejavoo, Ingenico — yours, on open rails",
      },
      {
        d: "Your account",
        them: "Processing bundled through Toast",
        us: "Your own merchant account on TSYS or First Data Nashville",
      },
      {
        d: "Support",
        them: "Call center, tiered by plan",
        us: "A person who knows your account by name",
      },
    ],
  },
};

export function isCompetitorSlug(value: string): value is CompetitorSlug {
  return value in COMPETITORS;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run lib/compare.test.ts`
Expected: PASS — 8 tests.

If the "no empty strings" or "two-year term" test fails, a string was mistyped during transcription. Re-copy from the spec's verbatim section; do not adjust the test to match.

- [ ] **Step 5: Commit**

```bash
git add lib/compare.ts lib/compare.test.ts
git commit -m "feat(compare): add competitor comparison data module"
```

---

### Task 2: Design-system additions — `info` callout, slate tokens, swap keyframes

**Files:**
- Modify: `app/globals.css`
- Modify: `components/ui/callout.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces: `Callout` accepts `variant="info"`; the CSS class `.ib-cmp-swap`; Tailwind utilities `bg-slate-50`, `text-slate-500`, `text-slate-700`, `border-slate-300`.

**Why this is separate:** the `info` variant is a shared design-system component change that a reviewer could reasonably reject or redirect on its own, independently of the compare pages that consume it.

- [ ] **Step 1: Expose the slate tokens to Tailwind**

The raw `--slate-*` values already exist in `:root` in `app/globals.css` but are not in the `@theme inline` block, so `bg-slate-50` does not compile. In `app/globals.css`, find the `--color-brick-*` lines inside `@theme inline`:

```css
  --color-brick-100: var(--brick-100);
  --color-brick-500: var(--brick-500);
```

Add immediately after them:

```css
  --color-slate-50: var(--slate-50);
  --color-slate-300: var(--slate-300);
  --color-slate-500: var(--slate-500);
  --color-slate-700: var(--slate-700);
```

- [ ] **Step 2: Add the swap keyframes**

In `app/globals.css`, immediately after the closing `}` of the `@supports (animation-timeline: view())` block (the scroll-reveal section that ends around line 313), add:

```css
/* ============================================================
   Competitor swap on /compare. The block is keyed on the active
   competitor, so React remounts it on a tab change and this single
   keyframe replays — no need for the prototype's trick of alternating
   between two identical animations to force a restart.

   Unlike .ib-rv above this is time-based, so the global
   prefers-reduced-motion block at the foot of this file already
   neutralises it by zeroing animation-duration. The explicit gate is
   belt-and-braces and keeps the intent readable next to the rule.
   ============================================================ */
@keyframes ibSwap {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: none; }
}
@media (prefers-reduced-motion: no-preference) {
  .ib-cmp-swap {
    animation: ibSwap 380ms var(--ease-out) both;
  }
}
```

- [ ] **Step 3: Add the `info` variant to `Callout`**

Replace the whole of `components/ui/callout.tsx` with:

```tsx
import * as React from "react";
import { CircleAlert, Info } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Inline message banner.
 *
 * `brand` (default) is the clay-tinted rule-on-the-left treatment used on the
 * About page. `warning` and `info` mirror the design system's Callout — full
 * hairline, leading icon. `warning` (amber) is for the moments where we're
 * telling you something you may not want to hear (see /integrations → Shopify);
 * `info` (slate) is the neutral aside, e.g. /compare → "if you're happy where
 * you are, stay".
 *
 * The `info` colours are the design system's `.ib-callout--info` verbatim:
 * slate-50 ground, #D6E0E4 hairline (there is no --slate-100 token), slate-500
 * mark.
 */
const HAIRLINE_TONES = {
  warning: { icon: CircleAlert, surface: "border-amber-100 bg-amber-50", mark: "text-amber-700" },
  info: { icon: Info, surface: "border-[#D6E0E4] bg-slate-50", mark: "text-slate-500" },
} as const;

export function Callout({
  title,
  children,
  variant = "brand",
  className,
}: {
  title: string;
  children: React.ReactNode;
  variant?: "brand" | "warning" | "info";
  className?: string;
}) {
  if (variant === "warning" || variant === "info") {
    const tone = HAIRLINE_TONES[variant];
    const Icon = tone.icon;
    return (
      <div
        role="note"
        className={cn("flex items-start gap-3 rounded-md border px-4 py-3.5", tone.surface, className)}
      >
        <Icon size={18} strokeWidth={1.8} aria-hidden className={cn("mt-px shrink-0", tone.mark)} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-ink-900">{title}</p>
          <p className="mt-0.5 text-[13.5px] leading-[1.5] text-ink-700">{children}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("rounded-md border-l-[3px] border-clay-400 bg-clay-50 p-4 pl-5", className)}>
      <p className="text-sm font-bold text-clay-700">{title}</p>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-700">{children}</p>
    </div>
  );
}
```

This keeps the existing `warning` rendering byte-identical (same classes, same order) so `/integrations` is unaffected.

- [ ] **Step 4: Verify types and lint pass**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 5: Verify the existing warning callout still renders**

Run: `npm run dev`, open `http://localhost:3000/integrations`, scroll to the "E-commerce & carts" section.
Expected: the amber "A straight answer on Shopify" callout looks exactly as before — amber ground, amber hairline, `CircleAlert` mark. Stop the dev server.

- [ ] **Step 6: Commit**

```bash
git add app/globals.css components/ui/callout.tsx
git commit -m "feat(ui): add info callout variant, slate theme colors, compare swap keyframes"
```

---

### Task 3: The comparison UI and the `/compare` hub

**Files:**
- Create: `components/compare/comparison-block.tsx`
- Create: `components/compare/comparison-experience.tsx`
- Create: `components/compare/comparison-closing.tsx`
- Create: `app/compare/page.tsx`

**Interfaces:**
- Consumes: `COMPETITORS`, `competitorOrder`, `COMPARE_AS_OF`, `HERO_LEDE`, `comparisonsLegalNotice`, `type CompetitorSlug`, `type Competitor` from `@/lib/compare`; `Callout` with `variant="info"` and the `.ib-cmp-swap` class from Task 2.
- Produces: `function ComparisonBlock({ competitor, showHeading }: { competitor: Competitor; showHeading: boolean })`; `function ComparisonExperience({ initial, variant }: { initial: CompetitorSlug; variant: "hub" | "competitor" })`; `function ComparisonClosing()` — takes no props, rendered by both routes.

**Note:** OG image wiring (`...ogImages(...)`) is deliberately **not** added here — the PNGs do not exist until Task 7, which adds the one-line spread to each page's metadata.

- [ ] **Step 1: Create the presentational block**

Create `components/compare/comparison-block.tsx`:

```tsx
import { Check, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Competitor } from "@/lib/compare";

/** One "Choose … if" bullet. `us` bullets read positive (sage check), `them` neutral (ink minus). */
function Bullet({ tone, children }: { tone: "them" | "us"; children: React.ReactNode }) {
  const Icon = tone === "us" ? Check : Minus;
  return (
    <div className="flex items-start gap-2.5">
      <span
        className={`mt-px inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[7px] ${
          tone === "us" ? "bg-sage-50 text-sage-600" : "bg-ink-100 text-ink-500"
        }`}
      >
        <Icon size={13} strokeWidth={2.4} aria-hidden />
      </span>
      <span
        className={`text-[14.5px] leading-[1.55] ${tone === "us" ? "text-ink-700" : "text-ink-600"}`}
      >
        {children}
      </span>
    </div>
  );
}

/**
 * Everything that changes when the switcher changes: the centred intro, the two
 * choose-if cards, and the comparison table.
 *
 * `showHeading` is false on the competitor deep routes, where the page's h1
 * already reads "Impeccabyte vs. {name}" and repeating it here would print the
 * same line twice.
 *
 * The table is a CSS grid rather than a <table> because it has to collapse to a
 * single column at 760px, which a real table cannot do. The data is genuinely
 * tabular, so the grid carries ARIA table roles to announce correctly.
 */
export function ComparisonBlock({
  competitor,
  showHeading,
}: {
  competitor: Competitor;
  showHeading: boolean;
}) {
  const ROW = "grid grid-cols-[170px_1fr_1.1fr] max-[760px]:grid-cols-1";
  const CELL = "px-[18px] py-4";

  return (
    <>
      <div className="mx-auto mt-9 max-w-[680px] text-center">
        {showHeading && (
          <h2
            className="font-display font-semibold text-ink-900"
            style={{ fontSize: "clamp(24px, 3vw, 34px)" }}
          >
            Impeccabyte vs. {competitor.name}
          </h2>
        )}
        <p className={`text-[15px] font-semibold text-clay-600 ${showHeading ? "mt-2" : ""}`}>
          {competitor.tagline}
        </p>
        <p className="mt-3.5 text-[16px] leading-[1.65] text-ink-600">{competitor.who}</p>
      </div>

      <div className="mt-8 grid grid-cols-2 items-stretch gap-[14px] max-[760px]:grid-cols-1">
        <Card padding="md" className="min-w-0">
          <h3 className="text-[16px] font-bold text-ink-900">Choose {competitor.name} if…</h3>
          <div className="mt-4 flex flex-col gap-3">
            {competitor.them.map((point) => (
              <Bullet key={point} tone="them">
                {point}
              </Bullet>
            ))}
          </div>
        </Card>
        <Card padding="md" className="min-w-0 border-[1.5px] border-clay-300">
          <h3 className="text-[16px] font-bold text-ink-900">Choose Impeccabyte if…</h3>
          <div className="mt-4 flex flex-col gap-3">
            {competitor.us.map((point) => (
              <Bullet key={point} tone="us">
                {point}
              </Bullet>
            ))}
          </div>
        </Card>
      </div>

      <Card padding="none" role="table" className="mt-[14px] overflow-hidden">
        <div role="row" className={`${ROW} max-[760px]:hidden`}>
          <div role="columnheader" className={CELL} />
          <div
            role="columnheader"
            className={`${CELL} text-[12px] font-bold uppercase tracking-[0.08em] text-ink-400`}
          >
            {competitor.name}
          </div>
          <div
            role="columnheader"
            className={`${CELL} bg-clay-50 text-[12px] font-bold uppercase tracking-[0.08em] text-clay-700`}
          >
            Impeccabyte
          </div>
        </div>
        {competitor.rows.map((row) => (
          <div key={row.d} role="row" className={`${ROW} border-t border-ink-100`}>
            <div
              role="rowheader"
              className={`${CELL} text-[12px] font-bold uppercase tracking-[0.06em] text-ink-500 max-[760px]:pb-0`}
            >
              {row.d}
            </div>
            <div role="cell" className={`${CELL} text-[14px] leading-[1.55] text-ink-600`}>
              {row.them}
            </div>
            <div
              role="cell"
              className={`${CELL} bg-clay-50 text-[14px] leading-[1.55] text-ink-800`}
            >
              {row.us}
            </div>
          </div>
        ))}
      </Card>
    </>
  );
}
```

- [ ] **Step 2: Create the client experience component**

Read `node_modules/next/dist/docs/01-app/01-getting-started/04-linking-and-navigating.md` § "Native History API" first — that is the source for the `replaceState` call below.

Create `components/compare/comparison-experience.tsx`:

```tsx
"use client";

import { useState } from "react";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { cn } from "@/lib/utils";
import { ComparisonBlock } from "./comparison-block";
import { COMPETITORS, competitorOrder, HERO_LEDE, type CompetitorSlug } from "@/lib/compare";

/**
 * Hero + pill switcher + the per-competitor block.
 *
 * The hero lives in here rather than in the page because on the competitor
 * routes the h1 names the active competitor, so it has to track the switcher.
 * The initial slug is server-rendered, so a direct hit on /compare/toast ships
 * Toast's full table in the HTML.
 *
 * Switching does NOT re-run the route: window.history.replaceState is the App
 * Router's supported shallow-URL update. replaceState rather than pushState so
 * Back leaves the page instead of walking three tabs.
 */
export function ComparisonExperience({
  initial,
  variant,
}: {
  initial: CompetitorSlug;
  /** "hub" keeps the generic h1 and lets the block print its own h2. */
  variant: "hub" | "competitor";
}) {
  const [active, setActive] = useState<CompetitorSlug>(initial);
  const competitor = COMPETITORS[active];

  function select(slug: CompetitorSlug) {
    if (slug === active) return; // clicking the active pill is a no-op
    setActive(slug);
    window.history.replaceState(null, "", `/compare/${slug}`);
  }

  return (
    <>
      <section className="px-6 pt-18 pb-6">
        <Container>
          <div className="max-w-[720px]">
            <Eyebrow>Comparisons</Eyebrow>
            <h1
              className="mt-[15px] font-display font-semibold text-ink-900"
              style={{
                fontSize: "clamp(38px, 5vw, 58px)",
                lineHeight: 1.03,
                letterSpacing: "-0.025em",
              }}
            >
              {variant === "hub" ? (
                <>
                  The <span className="em">honest</span> comparison.
                </>
              ) : (
                `Impeccabyte vs. ${competitor.name}`
              )}
            </h1>
            <p className="mt-[22px] max-w-[620px] text-[19px] leading-[1.6] text-ink-600">
              {HERO_LEDE}
            </p>
          </div>
        </Container>
      </section>

      <section className="px-6 pt-6 pb-2">
        <Container className="max-w-[1160px]">
          <div className="flex flex-wrap justify-center gap-2.5">
            {competitorOrder.map((slug) => {
              const isActive = slug === active;
              return (
                <button
                  key={slug}
                  type="button"
                  onClick={() => select(slug)}
                  aria-pressed={isActive}
                  className={cn(
                    "cursor-pointer rounded-pill border px-[26px] py-2.5 text-[15px] font-semibold transition-all duration-[140ms] ease-out",
                    isActive
                      ? "border-clay-500 bg-clay-500 text-[#FBF6EE] shadow-brand"
                      : "border-ink-200 bg-white text-ink-700"
                  )}
                >
                  {COMPETITORS[slug].name}
                </button>
              );
            })}
          </div>

          {/* Keyed on the slug: React remounts the subtree, which replays .ib-cmp-swap. */}
          <div key={active} className="ib-cmp-swap">
            <ComparisonBlock competitor={competitor} showHeading={variant === "hub"} />
          </div>
        </Container>
      </section>
    </>
  );
}
```

- [ ] **Step 3: Create the shared closing**

Both compare routes end with the same honesty callout and dark CTA. That copy is
compliance-sensitive, so it lives in exactly one file rather than being spelled out twice.

Create `components/compare/comparison-closing.tsx`:

```tsx
import { Container } from "@/components/site/container";
import { Callout } from "@/components/ui/callout";
import { DarkCTA } from "@/components/site/dark-cta";
import { comparisonsLegalNotice } from "@/lib/compare";

/**
 * The tail of every compare route: the honesty callout, the dark CTA, and the
 * dated legal line.
 *
 * Shared rather than repeated per route because the strings below are
 * compliance-reviewed — one home means a copy change cannot land on the hub and
 * miss the deep pages. Server-rendered: none of it responds to the switcher, so
 * it sits outside the client component and outside the keyed block.
 */
export function ComparisonClosing() {
  return (
    <>
      <section className="px-6 pt-[26px] pb-2">
        <Container className="max-w-[1160px]">
          <Callout variant="info" title="If you're happy where you are, stay">
            These are good products — that's why they're the comparison. Our case is simple: past a
            certain size, owning your merchant account beats renting one. If you're not there yet,
            we'll tell you so on the first call.
          </Callout>
        </Container>
      </section>

      <DarkCTA
        titleA="An account that's"
        titleEm="actually yours."
        body="Bring a recent statement from any of the three — we'll show you, line by line, what the same month would have cost on your own account."
        primary={{ label: "Talk to us", href: "/contact" }}
        secondary={{ label: "See pricing", href: "/pricing" }}
        footnote={comparisonsLegalNotice}
      />
    </>
  );
}
```

- [ ] **Step 4: Create the hub page**

Create `app/compare/page.tsx`:

```tsx
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { ComparisonExperience } from "@/components/compare/comparison-experience";
import { ComparisonClosing } from "@/components/compare/comparison-closing";

export const metadata: Metadata = {
  title: "Compare us — the honest comparison",
  description:
    "Impeccabyte vs. Square, Shopify, and Toast. They're payment facilitators; we get you your own merchant account on TSYS or First Data Nashville rails.",
  alternates: { canonical: "/compare" },
};

export default function ComparePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Compare", path: "/compare" },
        ])}
      />

      <ComparisonExperience initial="square" variant="hub" />
      <ComparisonClosing />
    </>
  );
}
```

- [ ] **Step 5: Verify types and lint pass**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 6: Verify the hub renders and behaves**

Run: `npm run dev`, open `http://localhost:3000/compare`. Check all of:

1. `h1` reads "The *honest* comparison." with "honest" in italic clay.
2. Three pills, Square active (clay ground, cream text, brand glow).
3. Below them: `h2` "Impeccabyte vs. Square", the clay tagline, the `who` paragraph.
4. Two cards side by side — the right one has the thicker clay border and sage checks.
5. The table's right-hand column is tinted clay-50 top to bottom, including its header cell.
6. Clicking **Shopify** fades-and-rises the whole block over ~380ms and the address bar becomes `/compare/shopify` **without a page reload** (the pills must not flash).
7. Clicking **Shopify** again does nothing — no re-animation.
8. The slate "If you're happy where you are, stay" callout renders below the table.
9. The dark CTA renders with the dated legal line beneath it, reading "as of July 2026".
10. Narrow the window below 760px: the two cards stack, and each table row becomes a single column with the header row gone.

Stop the dev server.

- [ ] **Step 7: Commit**

```bash
git add components/compare app/compare/page.tsx
git commit -m "feat(compare): add comparison switcher UI and the /compare hub"
```

---

### Task 4: The three competitor routes

**Files:**
- Create: `app/compare/[competitor]/page.tsx`

**Interfaces:**
- Consumes: `ComparisonExperience`, `ComparisonBlock` (indirectly), `COMPETITORS`, `competitorOrder`, `comparisonsLegalNotice`, `isCompetitorSlug`, `type CompetitorSlug` from Tasks 1 and 3.
- Produces: static routes `/compare/square`, `/compare/shopify`, `/compare/toast`.

- [ ] **Step 1: Read the dynamic-route docs**

Read `node_modules/next/dist/docs/03-api-reference/04-functions/generate-static-params.md` and `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/dynamic-routes.md`. In this version `params` is a Promise and must be awaited — see the existing `app/products/[key]/page.tsx` for the established shape.

- [ ] **Step 2: Create the route**

Create `app/compare/[competitor]/page.tsx`:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { ComparisonExperience } from "@/components/compare/comparison-experience";
import { ComparisonClosing } from "@/components/compare/comparison-closing";
import { COMPETITORS, competitorOrder, isCompetitorSlug, type CompetitorSlug } from "@/lib/compare";

/** Per-competitor meta descriptions, 150–160 characters each. */
const DESCRIPTIONS: Record<CompetitorSlug, string> = {
  square:
    "Square is a payment facilitator; Impeccabyte gets you your own merchant account on TSYS or First Data Nashville rails. Compare pricing, holds, and payouts.",
  shopify:
    "Shopify Payments is an aggregated account, and a third-party gateway costs you penalty fees. Impeccabyte gets you your own merchant account — and cart freedom.",
  toast:
    "Toast bundles processing, multi-year terms, and hardware that bricks if you leave. Impeccabyte gets you your own merchant account and hardware you keep.",
};

export function generateStaticParams() {
  return competitorOrder.map((competitor) => ({ competitor }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ competitor: string }>;
}): Promise<Metadata> {
  const { competitor } = await params;
  // Resolve through the guard rather than narrowing `competitor` after a
  // never-returning call — this keeps the types honest without relying on
  // control-flow analysis of notFound().
  const c = isCompetitorSlug(competitor) ? COMPETITORS[competitor] : null;
  if (!c) return {};
  return {
    // No "| Impeccabyte" — app/layout.tsx already appends "· Impeccabyte".
    title: `Impeccabyte vs. ${c.name} — the honest comparison`,
    description: DESCRIPTIONS[c.slug],
    alternates: { canonical: `/compare/${c.slug}` },
  };
}

export default async function CompetitorPage({
  params,
}: {
  params: Promise<{ competitor: string }>;
}) {
  const { competitor } = await params;
  const c = isCompetitorSlug(competitor) ? COMPETITORS[competitor] : null;
  if (!c) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Compare", path: "/compare" },
          { name: `vs. ${c.name}`, path: `/compare/${c.slug}` },
        ])}
      />

      <ComparisonExperience initial={c.slug} variant="competitor" />
      <ComparisonClosing />
    </>
  );
}
```

- [ ] **Step 3: Verify types and lint pass**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 4: Verify the deep routes server-render their competitor**

Run: `npm run dev`, then in a second terminal:

```bash
curl -s http://localhost:3000/compare/toast | grep -c "it bricks if you leave"
```

Expected: `1` or more — Toast's hardware row is in the served HTML, not injected after hydration. Repeat with `/compare/shopify` and the string `penalty fees on every sale`.

Then in the browser, on `http://localhost:3000/compare/toast`:

1. `h1` reads "Impeccabyte vs. Toast" — and there is **no** duplicate "Impeccabyte vs. Toast" heading above the tagline.
2. The Toast pill is active.
3. Clicking **Square** changes the `h1` to "Impeccabyte vs. Square" *and* the URL to `/compare/square`, in one animated swap.
4. `http://localhost:3000/compare/stripe` returns the 404 page.

Stop the dev server.

- [ ] **Step 5: Commit**

```bash
git add app/compare/\[competitor\]
git commit -m "feat(compare): add per-competitor routes with metadata and breadcrumbs"
```

---

### Task 5: Footer "Compare" column

**Files:**
- Modify: `components/site/site-footer.tsx`

**Interfaces:**
- Consumes: the routes from Tasks 3 and 4.
- Produces: three crawlable `<a href>` links to the competitor routes.

- [ ] **Step 1: Add the column**

In `components/site/site-footer.tsx`, find the last `FooterColumn` — the `Company` one, which currently sits as a bare child of the link-columns flex row:

```tsx
            <FooterColumn
              title="Company"
              links={[
                { label: "About", href: "/about" },
                { label: "Partnerships", href: "/partnerships" },
                { label: "Locations", href: "/locations" },
                { label: "Integrations", href: "/integrations" },
                { label: "Get a Quote", href: "/contact" },
              ]}
            />
```

Replace it with a stacked pair, matching the `flex flex-col gap-10` pattern already used by the Products/Pricing Programs and Industries/Benefits columns:

```tsx
            <div className="flex flex-col gap-10">
              <FooterColumn
                title="Company"
                links={[
                  { label: "About", href: "/about" },
                  { label: "Partnerships", href: "/partnerships" },
                  { label: "Locations", href: "/locations" },
                  { label: "Integrations", href: "/integrations" },
                  { label: "Get a Quote", href: "/contact" },
                ]}
              />
              {/* Compare is intentionally footer-only — no nav or drawer entry. */}
              <FooterColumn
                title="Compare"
                links={[
                  { label: "vs. Square", href: "/compare/square" },
                  { label: "vs. Shopify", href: "/compare/shopify" },
                  { label: "vs. Toast", href: "/compare/toast" },
                ]}
              />
            </div>
```

`FooterColumn` already renders the title at 12px / 700 / `.12em` uppercase in `text-amber-300` and the links at 14.5px in `rgba(243,235,222,0.72)`, so no styling work is needed.

- [ ] **Step 2: Verify types and lint pass**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 3: Verify the links are real anchors**

Run: `npm run dev`, then:

```bash
curl -s http://localhost:3000/ | grep -o 'href="/compare/[a-z]*"' | sort -u
```

Expected exactly:

```
href="/compare/shopify"
href="/compare/square"
href="/compare/toast"
```

In the browser, confirm the footer's rightmost column shows **COMPANY** above **COMPARE**, and that the header nav and the mobile drawer (narrow the window below 760px and open the hamburger) contain **no** Compare entry. Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add components/site/site-footer.tsx
git commit -m "feat(compare): link the compare routes from the footer"
```

---

### Task 6: Sitemap entries

**Files:**
- Modify: `lib/seo/sitemap.ts`
- Modify: `lib/seo/sitemap.test.ts`

**Interfaces:**
- Consumes: `competitorOrder` from Task 1.
- Produces: four more absolute URLs from `sitemapPaths()`.

- [ ] **Step 1: Write the failing test**

In `lib/seo/sitemap.test.ts`, add this to the imports at the top:

```ts
import { competitorOrder } from "@/lib/compare";
```

Then add a new `it` block inside the existing `describe("sitemapPaths", …)`:

```ts
  it("includes the compare hub and all three competitor pages", () => {
    const urls = sitemapPaths();
    expect(urls).toContain("https://impeccabyte.com/compare");
    for (const slug of competitorOrder) {
      expect(urls).toContain(`https://impeccabyte.com/compare/${slug}`);
    }
  });
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run lib/seo/sitemap.test.ts`
Expected: FAIL — the new test reports the array does not contain `https://impeccabyte.com/compare`.

- [ ] **Step 3: Add the paths**

In `lib/seo/sitemap.ts`, add the import:

```ts
import { competitorOrder } from "@/lib/compare";
```

and add these two lines to the `paths` array, immediately after `"/integrations",`:

```ts
    "/compare",
    ...competitorOrder.map((s) => `/compare/${s}`),
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run lib/seo/sitemap.test.ts`
Expected: PASS — including the pre-existing "has no duplicates" and "lists exactly the paths from sitemapPaths()" assertions.

- [ ] **Step 5: Commit**

```bash
git add lib/seo/sitemap.ts lib/seo/sitemap.test.ts
git commit -m "feat(compare): add the four compare routes to the sitemap"
```

---

### Task 7: Open Graph cards

**Files:**
- Temporarily restore: `lib/og/render.tsx`, `lib/og/copy.ts`, `lib/og/fonts/*.woff`
- Temporarily create: `app/compare/opengraph-image.tsx`, `app/compare/[competitor]/opengraph-image.tsx`
- Create: `public/og/compare.png`, `public/og/compare-square.png`, `public/og/compare-shopify.png`, `public/og/compare-toast.png`
- Modify: `app/compare/page.tsx`, `app/compare/[competitor]/page.tsx`, `public/og/README.md`

**Interfaces:**
- Consumes: the page files from Tasks 3 and 4; `ogImages(slug, alt)` from `@/lib/og/meta`.
- Produces: four static PNGs and the `openGraph.images` / `twitter.images` metadata on all four routes.

**Critical:** `next/og` renders through WebAssembly and is memory-hungry at build time — it was deliberately removed from this repo. Everything restored in Step 1 **must** be deleted again in Step 6. Do not commit `lib/og/` or the `opengraph-image.tsx` routes.

- [ ] **Step 1: Restore the archived template**

```bash
mkdir -p lib/og/fonts
git show 85a2653:lib/og/render.tsx > lib/og/render.tsx
git show 85a2653:lib/og/copy.ts > lib/og/copy.ts
for f in newsreader-400 newsreader-600 newsreader-600-italic hanken-600 hanken-700; do
  git show "85a2653:lib/og/fonts/$f.woff" > "lib/og/fonts/$f.woff"
done
ls -la lib/og lib/og/fonts
```

Expected: `render.tsx`, `copy.ts`, and five non-empty `.woff` files.

- [ ] **Step 2: Add the compare copy**

`lib/og/copy.ts` exports `OG_PAGES`. Append a `compare` group to that file, after the existing `OG_PAGES` object and before any other export:

```ts
/** Share-card copy for the /compare routes. `titleEm` renders italic clay. */
export const OG_COMPARE = {
  compare: {
    eyebrow: "Comparisons",
    titleA: "The",
    titleEm: "honest",
    titleZ: "comparison.",
    subtitle:
      "Square, Shopify, and Toast rent you a slice of their merchant account. We get you your own.",
  },
  square: {
    eyebrow: "Comparisons",
    titleA: "Impeccabyte vs.",
    titleEm: "Square",
    subtitle:
      "Flat rate, aggregated accounts, and automated holds — versus your own merchant account.",
  },
  shopify: {
    eyebrow: "Comparisons",
    titleA: "Impeccabyte vs.",
    titleEm: "Shopify",
    subtitle: "A great storefront, a walled garden. Penalty fees for any gateway but theirs.",
  },
  toast: {
    eyebrow: "Comparisons",
    titleA: "Impeccabyte vs.",
    titleEm: "Toast",
    subtitle: "“Free” hardware, multi-year terms, and equipment that bricks if you leave.",
  },
} satisfies Record<string, OgCopy>;
```

- [ ] **Step 3: Add the temporary render routes**

Create `app/compare/opengraph-image.tsx`:

```tsx
import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og/render";
import { OG_COMPARE } from "@/lib/og/copy";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Impeccabyte — the honest comparison";

export default function Image() {
  return renderOg(OG_COMPARE.compare);
}
```

Create `app/compare/[competitor]/opengraph-image.tsx`:

```tsx
import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og/render";
import { OG_COMPARE } from "@/lib/og/copy";
import { competitorOrder } from "@/lib/compare";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Impeccabyte — competitor comparison";

export function generateStaticParams() {
  return competitorOrder.map((competitor) => ({ competitor }));
}

export default async function Image({ params }: { params: Promise<{ competitor: string }> }) {
  const { competitor } = await params;
  return renderOg(OG_COMPARE[competitor as keyof typeof OG_COMPARE] ?? OG_COMPARE.compare);
}
```

- [ ] **Step 4: Render the four PNGs**

Run `npm run dev`, then in a second terminal:

```bash
curl -sf http://localhost:3000/compare/opengraph-image         -o public/og/compare.png
curl -sf http://localhost:3000/compare/square/opengraph-image  -o public/og/compare-square.png
curl -sf http://localhost:3000/compare/shopify/opengraph-image -o public/og/compare-shopify.png
curl -sf http://localhost:3000/compare/toast/opengraph-image   -o public/og/compare-toast.png
file public/og/compare*.png
```

Expected: all four report `PNG image data, 1200 x 630`. Open each one and confirm it matches the existing cards in `public/og/` — cream paper, clay→amber rule along the top, the emblem and "Impeccabyte" wordmark, an eyebrow pill reading "COMPARISONS", the serif headline with the emphasised word in italic clay, and the "impeccabyte.com / Powered by Maverick Payments" footer.

If a curl fails, the dev server likely has not compiled the route yet — request it once in a browser first, then retry.

Stop the dev server.

- [ ] **Step 5: Wire the images into the page metadata**

In `app/compare/page.tsx`, add the import:

```ts
import { ogImages } from "@/lib/og/meta";
```

and add this as the final property of the `metadata` object, after `alternates`:

```ts
  ...ogImages("compare", "Impeccabyte — the honest comparison"),
```

In `app/compare/[competitor]/page.tsx`, add the same import, and add this as the final property of the object returned by `generateMetadata`, after `alternates`:

```ts
    ...ogImages(`compare-${c.slug}`, `Impeccabyte vs. ${c.name}`),
```

- [ ] **Step 6: Delete everything that was restored**

```bash
rm -rf lib/og/render.tsx lib/og/copy.ts lib/og/fonts
rm -f app/compare/opengraph-image.tsx "app/compare/[competitor]/opengraph-image.tsx"
ls lib/og
```

Expected: `lib/og` contains only `meta.ts`.

- [ ] **Step 7: Confirm `next/og` is gone**

```bash
grep -rn "next/og" app lib components ; echo "exit=$?"
```

Expected: no output and `exit=1`. If anything matches, a restored file survived — delete it.

- [ ] **Step 8: Document the new cards**

In `public/og/README.md`, add four rows to the end of the "Files → routes" table:

```markdown
| `compare.png` | `/compare` | The *honest* comparison. |
| `compare-square.png` | `/compare/square` | Impeccabyte vs. *Square* |
| `compare-shopify.png` | `/compare/shopify` | Impeccabyte vs. *Shopify* |
| `compare-toast.png` | `/compare/toast` | Impeccabyte vs. *Toast* |
```

- [ ] **Step 9: Verify and commit**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

```bash
git status --short
```

Expected: modifications to the two page files and the README, plus four new PNGs — and **nothing** under `lib/og/` except an unchanged `meta.ts`, and no `opengraph-image.tsx`.

```bash
git add public/og app/compare/page.tsx "app/compare/[competitor]/page.tsx"
git commit -m "feat(compare): add share cards for the four compare routes"
```

---

### Task 8: Full verification

**Files:** none — this task only verifies.

- [ ] **Step 1: Run the whole test suite**

Run: `npm test`
Expected: all suites pass, including `lib/compare.test.ts` and `lib/seo/sitemap.test.ts`.

- [ ] **Step 2: Typecheck and lint the whole repo**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 3: Production build**

Run: `npm run build`
Expected: the build succeeds and the route list includes `/compare` plus prerendered `/compare/[competitor]` entries for all three slugs.

- [ ] **Step 4: Verify the built output**

Run: `npm start`, then in a second terminal:

```bash
# All four URLs are in the sitemap
curl -s http://localhost:3000/sitemap.xml | grep -o "https://impeccabyte.com/compare[a-z/-]*" | sort -u

# Each route self-canonicalises
for p in compare compare/square compare/shopify compare/toast; do
  echo "--- /$p"
  curl -s "http://localhost:3000/$p" | grep -o '<link rel="canonical" href="[^"]*"'
done

# Titles are not double-branded
curl -s http://localhost:3000/compare/square | grep -o "<title>[^<]*</title>"

# Content is server-rendered, not hydrated in
curl -s http://localhost:3000/compare/shopify | grep -c "penalty fees on every sale"

# Breadcrumbs are present and there is no FAQPage
curl -s http://localhost:3000/compare/toast | grep -o "BreadcrumbList"
curl -s http://localhost:3000/compare/toast | grep -c "FAQPage"

# The dated legal line is on every compare route
for p in compare compare/square compare/shopify compare/toast; do
  curl -s "http://localhost:3000/$p" | grep -c "as of July 2026"
done
```

Expected: four sitemap URLs; each canonical matching its own path; the title ending `· Impeccabyte` and **not** `| Impeccabyte`; `1` or more for the Shopify string; `BreadcrumbList` present; `0` for `FAQPage`; and `1` or more for the legal line on all four routes.

Stop the server.

- [ ] **Step 5: Confirm nothing outside the plan's scope changed**

```bash
git diff --stat main...HEAD
```

Expected: only the files listed in the File Structure table. In particular `components/site/site-header.tsx` must be untouched.

- [ ] **Step 6: Report**

Summarise: routes shipped, tests added, and anything that did not verify cleanly. Do not claim completion for any step whose command was not actually run.
