import type { ProductKey, SolutionKey } from "@/lib/data";
import { serviceSchema, breadcrumbSchema, faqSchema } from "@/lib/seo/schema";
import type { JsonLd } from "@/lib/seo/org";

export type City = {
  slug: string;
  name: string;
  /** Metro label, e.g. "Austin" or "Dallas–Fort Worth". */
  metro: string;
  /** Region label shown in eyebrows / hub cards, e.g. "Austin, TX". */
  region: string;
  /** True only for Austin — our real, physical office. Drives the "Home base" badge. */
  hasOffice: boolean;
  /** One-line hub-card tagline. */
  tagline: string;
  /** Hub-card footer line summarizing the verticals we serve. */
  cardLine: string;
  /** Neighborhoods / areas we serve, rendered as pills. */
  districts: string[];
  /** Verticals we have particular depth in, rendered as a checklist. */
  verticals: string[];
  /** Lede above the neighborhood pills on the city page. */
  serveIntro: string;
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
    region: "Austin, TX",
    hasOffice: true,
    tagline: "Our home base — on-site or remote, we're your neighbors.",
    cardLine: "Startups & DTC, food & beverage, high-risk retail",
    districts: ["Downtown & 2nd Street", "East Austin", "South Congress (SoCo)", "The Domain", "Rainey Street", "Mueller"],
    verticals: ["Startups & funded DTC brands", "Food & beverage", "High-risk retail (CBD, hemp, vape)", "Boutiques & specialty retail"],
    serveIntro: "We work with Austin businesses across these neighborhoods:",
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
    region: "Dallas–Fort Worth",
    hasOffice: false,
    tagline: "A dedicated payments partner for DFW e-commerce, B2B, and retail.",
    cardLine: "E-commerce & DTC, professional & B2B services, retail",
    districts: ["Deep Ellum", "Bishop Arts District", "Uptown & Victory Park", "Fort Worth Stockyards", "Frisco & Plano", "Las Colinas"],
    verticals: ["E-commerce & DTC brands", "Professional & B2B services", "Retail & showrooms"],
    serveIntro: "We work with Dallas–Fort Worth businesses across these areas:",
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
    region: "San Antonio, TX",
    hasOffice: false,
    tagline: "Payments for hospitality, healthcare, and retail — a drive down I-35.",
    cardLine: "Hospitality & tourism, healthcare, retail, military-adjacent",
    districts: ["The Pearl", "The River Walk", "Southtown", "Alamo Heights", "Stone Oak", "Downtown"],
    verticals: ["Hospitality & tourism", "Healthcare & personal care", "Retail", "Military-adjacent businesses"],
    serveIntro: "We work with San Antonio businesses across these areas:",
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
