/**
 * The /integrations catalogue — every gateway, platform, cart, and device we
 * list, in the exact order the bento grids render them.
 *
 * COMPLIANCE: the `via` attributions and the page's legal disclaimer scope our
 * integration claims ("connects via gateway X") and our trademark usage. Do not
 * drop a `via`, and do not add a vendor without confirming certification against
 * the Maverick / TSYS / First Data Nashville rails first.
 */

/** Tile weight in the bento grid. hero = 2×2, wide = 2×1, medium/small = 1×1. */
export type TileSize = "hero" | "wide" | "medium" | "small";

/** Role badge, shown on the lineup tiles only. */
export type Role = "gateway" | "checkout" | "commerce" | "billing" | "routing";

export type Integration = {
  name: string;
  /** Basename of the mark in /public/logos. */
  logo: string;
  size: TileSize;
  /** Verbatim attribution — "via NMI or Authorize.Net". Never paraphrase. */
  via?: string;
  role?: Role;
  /** Hero tiles only: the display-serif headline. */
  headline?: string;
  body?: string;
  /** Hero tiles only: the pill row along the bottom. */
  chips?: string[];
};

export const lineup: Integration[] = [
  {
    name: "Authorize.Net",
    logo: "authorize-net",
    size: "hero",
    role: "gateway",
    headline: "The name every cart already knows",
    body: "The most recognized gateway in the country — plugins for nearly every cart and CMS, plus eChecks, digital invoices, and a customer vault.",
    chips: ["eCheck", "Invoicing", "Customer vault"],
  },
  {
    name: "NMI",
    logo: "nmi",
    size: "hero",
    role: "gateway",
    headline: "The industry's workhorse",
    body: "125+ shopping-cart integrations, EMV terminal support, and a tokenized customer vault — most vertical software connects here.",
    chips: ["125+ carts", "EMV terminals", "Tokenization"],
  },
  {
    name: "Accept.Blue",
    logo: "accept-blue",
    size: "medium",
    role: "gateway",
    body: "Developer-first gateway with surcharging and level 2/3 data built in.",
  },
  {
    name: "Fluid Pay",
    logo: "fluid-pay",
    size: "medium",
    role: "gateway",
    body: "White-label gateway infrastructure with a clean API.",
  },
  {
    name: "OpenPath",
    logo: "openpath",
    size: "medium",
    role: "routing",
    body: "Smart routing across multiple MIDs — one shutoff never stops checkout.",
  },
  {
    name: "Skipify",
    logo: "skipify",
    size: "medium",
    role: "checkout",
    body: "One-click checkout that recognizes shoppers by email.",
  },
  {
    name: "Checkout Champ",
    logo: "checkout-champ",
    size: "medium",
    role: "checkout",
    body: "High-converting funnels, carts, and one-click upsells.",
  },
  {
    name: "Vrio",
    logo: "vrio",
    size: "medium",
    role: "commerce",
    body: "Headless commerce and subscription billing with smart routing.",
  },
  {
    name: "AuthVia",
    logo: "authvia",
    size: "medium",
    role: "billing",
    body: "Text-to-pay — invoice by SMS, get paid in the same thread.",
  },
  {
    name: "Biller Genie",
    logo: "biller-genie",
    size: "medium",
    role: "billing",
    body: "Automated invoicing and A/R follow-up that chases late payers.",
  },
  {
    name: "Chargezoom",
    logo: "chargezoom",
    size: "medium",
    role: "billing",
    body: "Two-way QuickBooks and Xero sync — invoices reconcile themselves.",
  },
  {
    name: "Recur360",
    logo: "recur360",
    size: "medium",
    role: "billing",
    body: "Recurring billing, collections, and late fees for QuickBooks shops.",
  },
];

export const ecommerce: Integration[] = [
  {
    name: "WooCommerce",
    logo: "woocommerce",
    size: "hero",
    via: "via NMI or Authorize.Net",
    headline: "The world's most-installed cart, on your rails",
    body: "Card and ACH checkout, saved cards, and subscriptions — through gateway plugins that install in an afternoon, with no theme surgery.",
    chips: ["Subscriptions", "Saved cards", "ACH & eCheck"],
  },
  {
    name: "BigCommerce",
    logo: "bigcommerce",
    size: "wide",
    via: "via Authorize.Net or Skipify",
    body: "Full checkout integration, plus one-click Skipify checkout for returning shoppers.",
  },
  {
    name: "WordPress",
    logo: "wordpress",
    size: "medium",
    via: "via NMI or Authorize.Net",
    body: "Forms, memberships, and donations — Gravity Forms and more.",
  },
  {
    name: "Adobe Commerce",
    logo: "adobe-commerce",
    size: "medium",
    via: "via NMI or Authorize.Net",
    body: "Magento extensions built for catalog-scale storefronts.",
  },
  {
    name: "ClickFunnels",
    logo: "clickfunnels",
    size: "medium",
    via: "via NMI",
    body: "Funnels and one-click upsells — NMI connects where others don't.",
  },
  {
    name: "PrestaShop",
    logo: "prestashop",
    size: "medium",
    via: "via Authorize.Net",
    body: "Open-source storefronts with official gateway modules.",
  },
  { name: "OpenCart", logo: "opencart", size: "small", via: "via NMI or Authorize.Net" },
  { name: "Shift4Shop", logo: "shift4shop", size: "small", via: "via NMI or Authorize.Net" },
  { name: "Volusion", logo: "volusion", size: "small", via: "via NMI or Authorize.Net" },
  { name: "Ecwid", logo: "ecwid", size: "small", via: "via Authorize.Net" },
  { name: "X-Cart", logo: "x-cart", size: "small", via: "via NMI or Authorize.Net" },
  {
    name: "Magento Open Source",
    logo: "magento",
    size: "small",
    via: "via NMI or Authorize.Net",
  },
];

export const operations: Integration[] = [
  {
    name: "QuickBooks",
    logo: "quickbooks",
    size: "hero",
    via: "via Chargezoom, Recur360, or Biller Genie",
    headline: "Invoices that reconcile themselves",
    body: "Payments by card or ACH post straight to the ledger — Online and Desktop alike. No manual entry, no month-end mystery.",
    chips: ["Two-way sync", "Auto-reconcile", "Recurring"],
  },
  {
    name: "Salesforce",
    logo: "salesforce",
    size: "wide",
    via: "via AppExchange apps",
    body: "Charge cards on the opportunity with Chargent-style AppExchange connectors.",
  },
  {
    name: "HighLevel",
    logo: "highlevel",
    size: "medium",
    via: "via NMI or Authorize.Net",
    body: "Take payments in funnels, invoices, and POS from your CRM.",
  },
  {
    name: "Xero",
    logo: "xero",
    size: "medium",
    via: "via Chargezoom or Biller Genie",
    body: "Invoices paid by card or ACH reconcile themselves in Xero.",
  },
  { name: "Zoho", logo: "zoho", size: "small", via: "via Authorize.Net" },
  { name: "Klaviyo", logo: "klaviyo", size: "small", via: "via Vrio" },
  { name: "ShipStation", logo: "shipstation", size: "small", via: "via Vrio or your cart" },
  {
    name: "QuickBooks Desktop",
    logo: "quickbooks-desktop",
    size: "small",
    via: "via Recur360",
  },
];

export const terminals: Integration[] = [
  {
    name: "PAX",
    logo: "pax",
    size: "wide",
    via: "via NMI",
    body: "A-series smart terminals and countertop devices — the workhorse line of modern counters.",
  },
  {
    name: "Dejavoo",
    logo: "dejavoo",
    size: "medium",
    via: "via NMI",
    body: "Countertop and wireless terminals popular with local retail.",
  },
  {
    name: "Ingenico",
    logo: "ingenico",
    size: "medium",
    via: "via NMI",
    body: "Lane and Move series devices for counter and curbside.",
  },
  {
    name: "ID TECH",
    logo: "id-tech",
    size: "wide",
    via: "via NMI",
    body: "Unattended and mobile readers for kiosks and on-the-go.",
  },
  {
    name: "MagTek",
    logo: "magtek",
    size: "wide",
    via: "via NMI",
    body: "Compact card readers and PIN pads for virtual-terminal use.",
  },
];

/** Verbatim — scopes the trademark usage for every mark on the page. */
export const trademarkNotice =
  "All product names, logos, and brands are property of their respective owners and are used for identification only; listing does not imply endorsement or partnership. Gateway and integration availability depends on underwriting and your card mix.";
