import type { ProductKey, SolutionKey } from "@/lib/data";

/**
 * Copy for the social share (Open Graph) images. This is written for the card,
 * so it is intentionally shorter and punchier than the on-page hero copy.
 * `titleEm` renders italic clay; `titleZ` is an optional trailing plain word.
 */
export type OgCopy = {
  eyebrow: string;
  titleA: string;
  titleEm: string;
  titleZ?: string;
  subtitle: string;
};

export const OG_PAGES = {
  home: {
    eyebrow: "Merchant services",
    titleA: "Payments that just",
    titleEm: "work",
    subtitle: "Card processing, checkout, and payouts for modern businesses — built on Maverick rails.",
  },
  pricing: {
    eyebrow: "Pricing",
    titleA: "Transparent",
    titleEm: "interchange-plus",
    titleZ: "pricing",
    subtitle: "One clear margin over true cost. No junk fees — just a simple $100 monthly minimum.",
  },
  about: {
    eyebrow: "Company",
    titleA: "Payments,",
    titleEm: "done right",
    subtitle: "A merchant services provider built on trust, transparency, and real support.",
  },
  partnerships: {
    eyebrow: "Partnerships",
    titleA: "Grow with a",
    titleEm: "partner",
    subtitle: "White-label reselling and revenue share on Maverick's payment platform.",
  },
  contact: {
    eyebrow: "Get a quote",
    titleA: "Let's price",
    titleEm: "your business",
    subtitle: "Tell us your monthly volume and we'll send a tailored interchange-plus quote.",
  },
} satisfies Record<string, OgCopy>;

export const OG_PRODUCTS: Record<ProductKey, OgCopy> = {
  payments: {
    eyebrow: "Card processing",
    titleA: "Accept every",
    titleEm: "card",
    subtitle: "In person or online — all major cards, settled fast on one simple rate.",
  },
  pos: {
    eyebrow: "In-person & POS",
    titleA: "Take a payment",
    titleEm: "anywhere",
    subtitle: "Tap to Pay, mobile readers, and a countertop POS that just works.",
  },
  online: {
    eyebrow: "Online checkout",
    titleA: "A checkout that",
    titleEm: "converts",
    subtitle: "Hosted pages and embedded checkout, tuned for fewer drop-offs.",
  },
  invoicing: {
    eyebrow: "Links & invoicing",
    titleA: "Send a link,",
    titleEm: "get paid",
    subtitle: "Invoices, deposits, and payment links your customers can pay in seconds.",
  },
  recurring: {
    eyebrow: "Recurring billing",
    titleA: "Predictable",
    titleEm: "revenue",
    subtitle: "Subscriptions, plans, and smart retries that recover more failed charges.",
  },
  terminal: {
    eyebrow: "Virtual terminal",
    titleA: "Key in a sale",
    titleEm: "anytime",
    subtitle: "Take phone and mail orders securely from any browser.",
  },
  ach: {
    eyebrow: "ACH & eCheck",
    titleA: "Move money for",
    titleEm: "pennies",
    subtitle: "Bank-to-bank payments at a fraction of the cost of cards.",
  },
  api: {
    eyebrow: "Developers",
    titleA: "Payments,",
    titleEm: "your way",
    subtitle: "A modern REST API, tokenization, and webhooks. Coming soon.",
  },
};

export const OG_SOLUTIONS: Record<SolutionKey, OgCopy> = {
  retail: {
    eyebrow: "Retail",
    titleA: "Built for",
    titleEm: "the counter",
    subtitle: "Fast, reliable checkout for shops, counters, and pop-ups.",
  },
  food: {
    eyebrow: "Food & drink",
    titleA: "Turn tables",
    titleEm: "faster",
    subtitle: "Tips, tabs, and quicker service built for hospitality.",
  },
  services: {
    eyebrow: "Professional services",
    titleA: "Get paid for",
    titleEm: "the work",
    subtitle: "Invoices, deposits, and retainers made simple.",
  },
  ecommerce: {
    eyebrow: "E-commerce",
    titleA: "A checkout customers",
    titleEm: "trust",
    subtitle: "Wallets, subscriptions, and conversion-ready online payments.",
  },
  nonprofits: {
    eyebrow: "Nonprofits",
    titleA: "More of every gift",
    titleEm: "goes to work",
    subtitle: "Donations, recurring giving, and low fees for mission-driven teams.",
  },
  highrisk: {
    eyebrow: "High-risk",
    titleA: "Approved when",
    titleEm: "others say no",
    subtitle: "Specialized underwriting for tougher categories, subject to approval.",
  },
  agents: {
    eyebrow: "Agents & ISOs",
    titleA: "Grow your",
    titleEm: "portfolio",
    subtitle: "White-label reselling and residuals on Maverick rails.",
  },
};
