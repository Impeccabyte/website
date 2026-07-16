import type { LucideIcon } from "lucide-react";
import {
  CreditCard, Store, Globe, Link as LinkIcon, RefreshCw, Keyboard, Landmark, Code,
  ShoppingBag, Utensils, Briefcase, ShoppingCart, Heart, ShieldAlert, Handshake,
  Nfc, Zap, Smartphone, Terminal, Clock, LayoutTemplate, ShieldCheck, Wallet,
  FileText, Bell, Users, Save, Receipt, Percent, Webhook,
  Timer, PhoneCall, FileSearch, Home, Car, MapPin, CalendarCheck, Video, Plane,
} from "lucide-react";

export type Feature = { icon: LucideIcon; title: string; body: string };
export type Pain = { title: string; body: string };

export type ProductKey =
  | "payments" | "pos" | "online" | "invoicing"
  | "recurring" | "terminal" | "ach" | "api";

export type Product = {
  key: ProductKey;
  nav: string;
  menuDesc: string;
  icon: LucideIcon;
  comingSoon?: boolean;
  eyebrow: string;
  titleA: string;
  titleEm: string;
  subtitle: string;
  features: Feature[];
  benefitTitle: string;
  benefitBullets: string[];
  related: ProductKey[];
  gfx: ProductKey;
  pexels: number;
};

export type SolutionKey =
  | "retail" | "food" | "services" | "ecommerce"
  | "nonprofits" | "highrisk" | "agents";

export type Solution = {
  key: SolutionKey;
  nav: string;
  menuDesc: string;
  icon: LucideIcon;
  eyebrow: string;
  titleA: string;
  titleEm: string;
  subtitle: string;
  pains: Pain[];
  recommended: ProductKey[];
  quote: { text: string; author: string };
  gfx: SolutionKey;
  pexels: number;
};

export const PRODUCTS: Record<ProductKey, Product> = {
  payments: {
    key: "payments",
    nav: "Card Processing",
    menuDesc: "Accept every major card, in person or online",
    icon: CreditCard,
    eyebrow: "Products · Card processing",
    titleA: "Accept cards",
    titleEm: "everywhere",
    subtitle:
      "Visa, Mastercard, Amex, and Discover — tapped, dipped, or typed in. One flat interchange-plus rate across every way your customers pay.",
    features: [
      { icon: Nfc, title: "Tap, dip, or swipe", body: "EMV chip, contactless, and magstripe — on hardware or the phone in your pocket." },
      { icon: Globe, title: "Online too", body: "The same account powers your website checkout and payment links." },
      { icon: Zap, title: "Fast funding", body: "Most deposits land the next business day, with instant payouts available." },
    ],
    benefitTitle: "One account, every card",
    benefitBullets: ["Apple Pay & Google Pay built in", "Level 2/3 data for lower B2B rates", "Automatic card-account updater"],
    related: ["pos", "online", "invoicing"],
    gfx: "payments",
    pexels: 12935074,
  },
  pos: {
    key: "pos",
    nav: "In-Person & POS",
    menuDesc: "Tap to Pay, readers, and a countertop POS",
    icon: Store,
    eyebrow: "Products · In-person",
    titleA: "Take a payment",
    titleEm: "anywhere",
    subtitle:
      "Turn your phone into a card reader, or pair a countertop terminal. Fast, reliable, and built for lines that keep moving.",
    features: [
      { icon: Smartphone, title: "Tap to Pay on phone", body: "Accept contactless cards and wallets with no extra hardware to buy." },
      { icon: Terminal, title: "Readers & terminals", body: "Bluetooth readers and countertop terminals that just work." },
      { icon: Clock, title: "Lines that move", body: "Sub-second authorizations keep your counter clear." },
    ],
    benefitTitle: "Built for the counter",
    benefitBullets: ["Offline mode captures sales anywhere", "Tips, splits, and digital receipts", "Works with hardware you already own"],
    related: ["payments", "invoicing", "recurring"],
    gfx: "pos",
    pexels: 12935047,
  },
  online: {
    key: "online",
    nav: "Online Checkout",
    menuDesc: "Hosted pages and embedded checkout for your site",
    icon: Globe,
    eyebrow: "Products · Online",
    titleA: "A checkout that",
    titleEm: "converts",
    subtitle:
      "Drop in a hosted payment page or embed checkout on your own site. PCI handled, mobile-perfect, and fast enough that customers actually finish.",
    features: [
      { icon: LayoutTemplate, title: "Hosted pages", body: "Launch a branded, secure checkout without writing a line of code." },
      { icon: ShieldCheck, title: "PCI, handled", body: "We carry the compliance burden so your team can ship." },
      { icon: Wallet, title: "Every wallet", body: "Cards, Apple Pay, Google Pay, and ACH in one clean flow." },
    ],
    benefitTitle: "Sell online in an afternoon",
    benefitBullets: ["Embeddable or fully hosted", "Saved cards for returning buyers", "Real-time webhooks"],
    related: ["payments", "recurring", "api"],
    gfx: "online",
    pexels: 5648036,
  },
  invoicing: {
    key: "invoicing",
    nav: "Payment Links + Invoicing",
    menuDesc: "Send a link, get paid — invoices and deposits",
    icon: LinkIcon,
    eyebrow: "Products · Links & invoicing",
    titleA: "Send a link,",
    titleEm: "get paid",
    subtitle:
      "Create a payment link or a polished invoice in seconds. Perfect for deposits, quotes, and selling straight from the DMs.",
    features: [
      { icon: LinkIcon, title: "Instant links", body: "One tap to a shareable, secure payment link." },
      { icon: FileText, title: "Real invoices", body: "Branded invoices with due dates and automatic reminders." },
      { icon: Bell, title: "Auto reminders", body: "Gentle nudges chase down late payments for you." },
    ],
    benefitTitle: "Get paid without the awkward ask",
    benefitBullets: ["Partial payments & deposits", "Recurring invoices", "QR codes for in-person"],
    related: ["online", "recurring", "pos"],
    gfx: "invoicing",
    pexels: 789822,
  },
  recurring: {
    key: "recurring",
    nav: "Recurring Billing",
    menuDesc: "Subscriptions, plans, and smart retries",
    icon: RefreshCw,
    eyebrow: "Products · Recurring",
    titleA: "Predictable",
    titleEm: "revenue",
    subtitle:
      "Set up subscriptions and payment plans that run themselves — with smart retries that quietly recover failed charges.",
    features: [
      { icon: RefreshCw, title: "Any schedule", body: "Weekly, monthly, annual, or a custom billing cycle." },
      { icon: ShieldCheck, title: "Smart retries", body: "We automatically recover most failed payments." },
      { icon: Users, title: "Manage plans", body: "Upgrade, pause, or prorate in a couple of taps." },
    ],
    benefitTitle: "Subscriptions on autopilot",
    benefitBullets: ["Dunning & retry logic built in", "Proration handled automatically", "Customer self-serve portal"],
    related: ["online", "invoicing", "api"],
    gfx: "recurring",
    pexels: 4173168,
  },
  terminal: {
    key: "terminal",
    nav: "Virtual Terminal",
    menuDesc: "Key in phone and mail orders from any browser",
    icon: Keyboard,
    eyebrow: "Products · Virtual terminal",
    titleA: "Key in a sale",
    titleEm: "from anywhere",
    subtitle:
      "Take phone and mail orders from any browser. No hardware, no app — just log in and charge a card.",
    features: [
      { icon: Keyboard, title: "Type it in", body: "Manually enter card details for phone and mail orders." },
      { icon: Save, title: "Save on file", body: "Securely store cards for your repeat customers." },
      { icon: Receipt, title: "Instant receipts", body: "Email a receipt the moment you charge." },
    ],
    benefitTitle: "Your back-office register",
    benefitBullets: ["Multi-user access with roles", "Address & CVV verification", "Works on any device"],
    related: ["payments", "recurring", "ach"],
    gfx: "terminal",
    pexels: 4173180,
  },
  ach: {
    key: "ach",
    nav: "ACH & eCheck",
    menuDesc: "Bank-to-bank payments at a fraction of card cost",
    icon: Landmark,
    eyebrow: "Products · ACH & eCheck",
    titleA: "Move money for",
    titleEm: "pennies",
    subtitle:
      "Accept bank transfers and eChecks for a fraction of card fees — ideal for rent, tuition, invoices, and big-ticket sales.",
    features: [
      { icon: Landmark, title: "Bank-to-bank", body: "Pull payments straight from a checking account." },
      { icon: Percent, title: "Lower cost", body: "Flat, low fees instead of a percentage of every dollar." },
      { icon: RefreshCw, title: "Recurring ACH", body: "Automate rent, dues, and installment plans." },
    ],
    benefitTitle: "The affordable way to get paid",
    benefitBullets: ["Great for large recurring bills", "Account verification built in", "Same rails, lower fees"],
    related: ["recurring", "invoicing", "terminal"],
    gfx: "ach",
    pexels: 3760607,
  },
  api: {
    key: "api",
    nav: "Developer API",
    menuDesc: "Modern REST API, tokenization, and webhooks",
    icon: Code,
    comingSoon: true,
    eyebrow: "Products · Developers",
    titleA: "Payments,",
    titleEm: "your way",
    subtitle:
      "A clean REST API, secure tokenization, and reliable webhooks. Build the exact payment flow your product needs.",
    features: [
      { icon: Code, title: "REST API", body: "Predictable endpoints and SDKs to help you move fast." },
      { icon: ShieldCheck, title: "Tokenization", body: "Vault cards securely and stay out of PCI scope." },
      { icon: Webhook, title: "Webhooks", body: "Real-time events for every payment and payout." },
    ],
    benefitTitle: "Built for builders",
    benefitBullets: ["Sandbox with test cards", "Idempotent requests", "Detailed logs & docs"],
    related: ["online", "recurring", "terminal"],
    gfx: "api",
    pexels: 972995,
  },
};

export const SOLUTIONS: Record<SolutionKey, Solution> = {
  retail: {
    key: "retail",
    nav: "Retail + Shops",
    menuDesc: "Fast checkout for counters and pop-ups",
    icon: ShoppingBag,
    eyebrow: "Industries · Retail",
    titleA: "Payments built for",
    titleEm: "the counter",
    subtitle:
      "Keep lines moving and money landing fast — whether you run a storefront, a market stall, or a weekend pop-up.",
    pains: [
      { title: "Slow checkout lines", body: "Sub-second taps keep the queue moving on any device." },
      { title: "Cash-flow gaps", body: "Next-day and instant payouts keep your float healthy." },
      { title: "Clunky hardware", body: "Use your phone or a simple reader — no bulky systems." },
      { title: "Hidden fees", body: "One transparent interchange-plus rate, always visible." },
    ],
    recommended: ["pos", "invoicing", "online"],
    quote: { text: "Lines move faster and the money is in my account the same day.", author: "Retail owner, Austin" },
    gfx: "retail",
    pexels: 3965545,
  },
  food: {
    key: "food",
    nav: "Food + Drink",
    menuDesc: "Tips, tabs, and faster tables",
    icon: Utensils,
    eyebrow: "Industries · Food & drink",
    titleA: "Turn tables",
    titleEm: "faster",
    subtitle:
      "From food trucks to full-service, take payments and tips wherever your guests are sitting.",
    pains: [
      { title: "Tip management", body: "Built-in tipping and easy tip-outs at close." },
      { title: "Peak-hour speed", body: "Reliable taps that keep up with the dinner rush." },
      { title: "Mobile service", body: "Pay-at-table and curbside with Tap to Pay." },
      { title: "Thin margins", body: "Lower interchange-plus costs protect every ticket." },
    ],
    recommended: ["pos", "payments", "invoicing"],
    quote: { text: "Pay-at-table cut our turn time, and the staff love the tip flow.", author: "Café owner" },
    gfx: "food",
    pexels: 6205523,
  },
  services: {
    key: "services",
    nav: "Professional Services",
    menuDesc: "Invoices, deposits, and retainers",
    icon: Briefcase,
    eyebrow: "Industries · Services",
    titleA: "Get paid for",
    titleEm: "the work",
    subtitle:
      "For consultants, contractors, salons, and studios — send invoices, collect deposits, and automate retainers.",
    pains: [
      { title: "Chasing invoices", body: "Auto reminders get you paid without the awkward follow-up." },
      { title: "Upfront deposits", body: "Collect a deposit with a link before you start." },
      { title: "Recurring retainers", body: "Automate monthly retainers and payment plans." },
      { title: "On-site payments", body: "Tap a card on your phone at the job or the chair." },
    ],
    recommended: ["invoicing", "recurring", "pos"],
    quote: { text: "Deposits up front and reminders on autopilot — my cash flow finally makes sense.", author: "Studio founder" },
    gfx: "services",
    pexels: 3993449,
  },
  ecommerce: {
    key: "ecommerce",
    nav: "E-commerce",
    menuDesc: "Checkout, wallets, and subscriptions online",
    icon: ShoppingCart,
    eyebrow: "Industries · E-commerce",
    titleA: "A checkout your",
    titleEm: "customers finish",
    subtitle:
      "Sell online with a fast hosted checkout, every wallet, and subscriptions — plus an API for anything bespoke.",
    pains: [
      { title: "Cart abandonment", body: "A quick, trusted checkout with saved cards and wallets." },
      { title: "PCI compliance", body: "We carry the scope so your team ships instead." },
      { title: "Subscriptions", body: "Recurring billing with smart retries built in." },
      { title: "Custom flows", body: "A clean API and webhooks for anything bespoke." },
    ],
    recommended: ["online", "recurring", "api"],
    quote: { text: "Conversion went up the week we switched to the hosted checkout.", author: "DTC founder" },
    gfx: "ecommerce",
    pexels: 7857523,
  },
  nonprofits: {
    key: "nonprofits",
    nav: "Nonprofits",
    menuDesc: "Donations, recurring giving, and low fees",
    icon: Heart,
    eyebrow: "Industries · Nonprofits",
    titleA: "More of every gift",
    titleEm: "goes to work",
    subtitle:
      "Accept one-time and recurring donations with low, transparent costs — and ACH to keep more of every dollar.",
    pains: [
      { title: "High processing fees", body: "Interchange-plus and ACH keep costs down." },
      { title: "Recurring giving", body: "Set up monthly donors in a couple of taps." },
      { title: "Donor experience", body: "A warm, simple donation page on any device." },
      { title: "Clean reporting", body: "Tidy records for receipts and year-end." },
    ],
    recommended: ["online", "ach", "recurring"],
    quote: { text: "Switching to ACH for monthly donors saved us thousands a year.", author: "Nonprofit director" },
    gfx: "nonprofits",
    pexels: 6646918,
  },
  highrisk: {
    key: "highrisk",
    nav: "High-Risk Merchants",
    menuDesc: "Specialized approval for tougher categories",
    icon: ShieldAlert,
    eyebrow: "Industries · High-risk",
    titleA: "Approved when",
    titleEm: "others say no",
    subtitle:
      "Backed by Maverick Payments, we place harder-to-underwrite businesses — subject to approval — with fair, transparent terms.",
    pains: [
      { title: "Hard to get approved", body: "Specialized underwriting for tougher categories." },
      { title: "Chargeback risk", body: "Built-in monitoring and dispute tooling." },
      { title: "Frozen funds", body: "Clear reserve terms, explained up front." },
      { title: "Opaque pricing", body: "Interchange-plus, so you see every cost." },
    ],
    recommended: ["payments", "online", "api"],
    quote: { text: "We finally found a processor that understood our category.", author: "Specialty merchant" },
    gfx: "highrisk",
    pexels: 7667711,
  },
  agents: {
    key: "agents",
    nav: "For agents & ISOs",
    menuDesc: "White-label reselling on Maverick rails",
    icon: Handshake,
    eyebrow: "Industries · Agents & ISOs",
    titleA: "Grow your",
    titleEm: "portfolio",
    subtitle:
      "Refer merchants or build your own book on Maverick's rails — with transparent revenue splits and real support.",
    pains: [
      { title: "Thin margins", body: "Competitive revenue splits that scale with you." },
      { title: "Slow boarding", body: "Fast, fully digital merchant applications." },
      { title: "No support", body: "A real partner team behind every deal." },
      { title: "Clunky tools", body: "Modern reporting and portfolio visibility." },
    ],
    recommended: ["payments", "api", "terminal"],
    quote: { text: "Transparent splits and fast boarding — exactly what I needed to grow.", author: "Independent agent" },
    gfx: "agents",
    pexels: 3998429,
  },
};

/* ---- Ordering ---- */
export const productOrder: ProductKey[] = [
  "payments", "pos", "online", "invoicing", "recurring", "terminal", "ach", "api",
];
// Industries nav/home/footer exclude `agents` (agents is reachable via Partnerships context).
export const solutionNavOrder: SolutionKey[] = [
  "retail", "food", "services", "ecommerce", "nonprofits", "highrisk",
];

export const homeFeatureKeys: ProductKey[] = productOrder.slice(0, 6);
export const homeSolutionKeys: SolutionKey[] = solutionNavOrder;
export const footerProductKeys: ProductKey[] = productOrder.slice(0, 5);
export const footerSolutionKeys: SolutionKey[] = solutionNavOrder.slice(0, 5);

/* ---- Benefits (client perks — surfaced in the "Benefits" nav dropdown + footer) ---- */
export type BenefitNavItem = {
  key: string;
  nav: string;
  menuDesc: string;
  icon: LucideIcon;
  href: string;
  badge?: string;
};

export const benefitsNav: BenefitNavItem[] = [
  {
    key: "travel",
    nav: "Travel",
    menuDesc: "A dedicated travel advisor for trips, retreats, and vacations — exclusive to clients",
    icon: Plane,
    href: "/benefits/travel",
    badge: "New",
  },
];

/* ---- Pricing programs (surcharge vs cash discount comparison, shared by both pages) ---- */
export const programComparison: { label: string; surcharge: string; cashDiscount: string }[] = [
  { label: "Applies to", surcharge: "Credit cards only", cashDiscount: "All cards except EBT" },
  { label: "Debit", surcharge: "Priced separately", cashDiscount: "Included, not separate" },
  { label: "Cap", surcharge: "3% (2% CO)", cashDiscount: "4%" },
  { label: "Legal in all 50 states", surcharge: "No — six excluded", cashDiscount: "Yes" },
  { label: "Registration", surcharge: "Required", cashDiscount: "Not required" },
  { label: "Best for", surcharge: "Heavy debit volume; keep debit cheap", cashDiscount: "Cash-heavy; simplest setup" },
];

/* ---- Pricing ---- */
export type PricingTier = {
  name: string;
  range: string;
  pct: string;
  fee: string;
  blurb: string;
  travel: string;
  popular?: boolean;
};

export const pricingTiers: PricingTier[] = [
  { name: "Starter", range: "Up to $25K / mo", pct: "0.45%", fee: "12¢", blurb: "For when you're just getting rolling and finding your feet.", travel: "$99" },
  { name: "Growth", range: "$25K – $100K / mo", pct: "0.32%", fee: "10¢", blurb: "Our most popular rate for scaling businesses.", travel: "$49", popular: true },
  { name: "Scale", range: "$100K – $500K / mo", pct: "0.24%", fee: "8¢", blurb: "Margins keep dropping as your volume climbs.", travel: "Included" },
  { name: "Enterprise", range: "$500K+ / mo", pct: "from 0.16%", fee: "7¢", blurb: "Custom pricing built around your book.", travel: "Included" },
];

export const accountIncludes: string[] = [
  "No monthly fee", "Transparent IC+ pricing", "Next-day payouts",
  "Virtual terminal", "Fraud & dispute tools", "Reporting dashboard",
  "ACH & eCheck", "PCI-compliant security", "Human support",
];

export const faqItems: { q: string; a: string }[] = [
  {
    q: "What is interchange-plus pricing?",
    a: "You pay the card networks' true cost (interchange) plus one clear, fixed markup from us. No bundled tiers, no padding — you can see exactly where every cent goes.",
  },
  {
    q: "Are there any monthly fees?",
    a: "No monthly fee. There is a modest $100 monthly minimum, but it's covered by the processing fees you're already paying — not a separate charge — so most active businesses never notice it. It helps fund the ongoing product improvements we make available to every client. No setup or statement fees, either.",
  },
  {
    q: "Do your rates really drop as I grow?",
    a: "Yes. You always pay the card networks' true interchange; our margin on top steps down automatically as your monthly volume grows — from 0.45% + 12¢ on Starter down to as low as 0.16% + 7¢ at enterprise volume. No renegotiating and no new contract.",
  },
  {
    q: "How fast are payouts?",
    a: "Most deposits land the next business day. Instant payouts, landing in minutes, are available on eligible accounts.",
  },
  {
    q: "Do you work with high-risk businesses?",
    a: "Often, yes. Because we're backed by Maverick Payments, we can place many harder-to-underwrite categories — subject to approval and category-specific terms.",
  },
  {
    q: "What contract am I signing?",
    a: "We ask for a two-year term — we believe that's a fair window to show we're the right long-term fit for your business. If you ever need to wind down services early, just tell us and we'll help you through it.",
  },
  {
    q: "Who actually processes my payments?",
    a: "Impeccabyte is a registered agent of Maverick Payments. Your payments run on Maverick's bank-grade, PCI-compliant infrastructure, with Impeccabyte as your local, human point of contact.",
  },
];

/* ---- Rate calculator config ---- */
export const calcBase: Record<"inperson" | "online" | "mixed", number> = {
  inperson: 1.7,
  online: 2.1,
  mixed: 1.9,
};
export const calcPresets = [5000, 15000, 50000, 150000, 500000, 1000000, 2000000];
export const calcPresetLabels = ["$5K", "$15K", "$50K", "$150K", "$500K", "$1M", "$2M+"];

/* ---- Priority Support (paid support tier surfaced on the Locations pages) ---- */
export type PriorityZoneKey = "in-range" | "drivable" | "out-of-state";

export type PriorityPoint = { icon: LucideIcon; text: string };

export type PriorityZone = {
  tag: string;
  stat: string;
  statLabel: string;
  headline: string;
  sub: string;
  points: PriorityPoint[];
};

export type PriorityCore = { icon: LucideIcon; title: string; body: string };

export const PRIORITY: {
  price: string;
  period: string;
  annual: string;
  core: PriorityCore[];
  zones: Record<PriorityZoneKey, PriorityZone>;
} = {
  price: "$99",
  period: "per month",
  annual: "or $1,080 / year — one month free",
  core: [
    {
      icon: Timer,
      title: "Front-of-line support, with a real SLA",
      body: "Same-business-day response and a next-day resolution target — not best-effort.",
    },
    {
      icon: PhoneCall,
      title: "A dedicated direct line",
      body: "Reach a real person who knows your account, instead of the general queue.",
    },
    {
      icon: FileSearch,
      title: "Proactive statement re-audits",
      body: "We catch interchange downgrades and processor rate changes before they reach you.",
    },
  ],
  zones: {
    "in-range": {
      tag: "In our service area",
      stat: "Free",
      statLabel: "on-site, as needed",
      headline: "On-site help is already free here",
      sub: "You're in our home range, so we come to your counter as needed at no charge. Priority Support simply adds the remote SLA, direct line, and re-audits on top.",
      points: [
        { icon: Home, text: "On-site visits included free, as needed" },
        { icon: Timer, text: "Same-business-day remote response" },
        { icon: FileSearch, text: "Proactive statement re-audits" },
      ],
    },
    drivable: {
      tag: "Drivable from Austin",
      stat: "2 visits",
      statLabel: "on-site / year, included",
      headline: "Two on-site visits a year, included",
      sub: "We'll make the drive — up to two on-site visits a year come with the tier, additional visits are $300 each, and you get quarterly business reviews to keep your pricing honest.",
      points: [
        { icon: Car, text: "Up to 2 on-site visits / year included" },
        { icon: MapPin, text: "Additional visits $300 each" },
        { icon: CalendarCheck, text: "Quarterly business reviews" },
      ],
    },
    "out-of-state": {
      tag: "Anywhere else",
      stat: "Monthly",
      statLabel: "virtual business reviews",
      headline: "Monthly reviews, priority remote",
      sub: "On-site is swapped for monthly virtual business reviews — more of our time, just remotely. Want someone on the ground? We arrange it à la carte at travel cost plus a $300 day rate.",
      points: [
        { icon: Video, text: "Monthly virtual business reviews" },
        { icon: Timer, text: "Priority remote support & SLA" },
        { icon: Plane, text: "On-site à la carte, quoted per trip" },
      ],
    },
  },
};

/** Fixed display order for the three zone cards on the Locations hub. */
export const priorityZoneOrder: PriorityZoneKey[] = ["in-range", "drivable", "out-of-state"];
