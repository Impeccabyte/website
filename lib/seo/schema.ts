import { ORG_ID, SITE_URL, type JsonLd } from "@/lib/seo/org";

/** JSON for a <script type="application/ld+json"> body, with '<' escaped so it can't break out of the tag. */
export function serializeJsonLd(data: JsonLd | JsonLd[]): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function serviceSchema(cityName: string): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Merchant services / payment processing",
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "City", name: cityName },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}

export function faqSchema(faqs: { q: string; a: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
