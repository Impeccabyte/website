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
export const competitorOrder: readonly CompetitorSlug[] = ["square", "shopify", "toast"];

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
  return Object.hasOwn(COMPETITORS, value);
}
