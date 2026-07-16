import { SITE_URL } from "@/lib/seo/org";
import { PRODUCTS, SOLUTIONS, productOrder, solutionNavOrder } from "@/lib/data";
import { CITIES, citySlugs } from "@/lib/seo/locations";

/** A markdown link line for the llms.txt spec: `- [name](url): description`. */
function link(name: string, path: string, desc: string): string {
  return `- [${name}](${SITE_URL}${path}): ${desc}`;
}

/**
 * Generates the site's `/llms.txt` — a curated markdown map for LLMs, per the
 * llmstxt.org convention. Derived from the same data as the sitemap so the two
 * never drift. /tools/* is intentionally omitted (private, robots-disallowed).
 */
export function llmsTxt(): string {
  const products = productOrder.map((k) =>
    link(PRODUCTS[k].nav, `/products/${k}`, PRODUCTS[k].menuDesc),
  );
  const industries = solutionNavOrder.map((k) =>
    link(SOLUTIONS[k].nav, `/industries/${k}`, SOLUTIONS[k].menuDesc),
  );
  const locations = citySlugs().map((s) =>
    link(CITIES[s].region, `/locations/${s}`, CITIES[s].tagline),
  );

  return `# Impeccabyte

> Merchant services and payment processing for small businesses across Texas — transparent interchange-plus pricing, next-day funding, high-risk approvals, and dual pricing. Austin-based, serving Austin, Dallas–Fort Worth, and San Antonio.

Impeccabyte helps small businesses accept payments in person, online, and on the go on transparent interchange-plus pricing. Every engagement starts with a free, no-obligation analysis of your current processing statement — we only recommend switching if we can genuinely beat what you pay today.

## Main pages
${link("Home", "/", "Overview of Impeccabyte's payment products and pricing")}
${link("Pricing", "/pricing", "Interchange-plus rate tiers by monthly processing volume")}
${link("About", "/about", "Who we are and how we work")}
${link("Locations", "/locations", "Metros we serve across Texas")}
${link("Partnerships", "/partnerships", "White-label reselling for agents and ISOs on Maverick rails")}
${link("Contact", "/contact", "Request a free statement analysis")}

## Pricing programs
${link("Cash Discount", "/cash-discount", "Dual pricing — the card price covers processing while cash customers get a discount; legal in all 50 states, no registration")}
${link("Surcharge", "/surcharge", "A compliant fee on credit-card payments only; debit and cash pay nothing extra")}

## Benefits
${link("Travel", "/benefits/travel", "A dedicated travel advisor for every client — buying trips, team retreats, and vacations, free on Scale and Enterprise")}

## Products
${products.join("\n")}

## Industries
${industries.join("\n")}

## Locations
${locations.join("\n")}

## Optional
${link("Privacy Policy", "/privacy", "How we handle personal data")}
${link("Terms of Service", "/terms", "Terms governing use of the site and services")}
${link("Cookie Policy", "/cookies", "Cookies and tracking used on the site")}
${link("Chamber", "/chamber", "Community and chamber-of-commerce partnerships")}
`;
}
