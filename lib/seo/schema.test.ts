import { describe, it, expect } from "vitest";
import { serializeJsonLd, serviceSchema, breadcrumbSchema, faqSchema } from "@/lib/seo/schema";
import { ORG_ID } from "@/lib/seo/org";

describe("serializeJsonLd", () => {
  it("escapes '<' to prevent breaking out of the script tag", () => {
    expect(serializeJsonLd({ a: "</script><b>" })).toBe('{"a":"\\u003c/script>\\u003cb>"}');
  });
});

describe("serviceSchema", () => {
  it("references the org by @id and scopes areaServed to the city", () => {
    const s = serviceSchema("Dallas");
    expect(s["@type"]).toBe("Service");
    expect(s.provider).toEqual({ "@id": ORG_ID });
    expect(s.areaServed).toEqual({ "@type": "City", name: "Dallas" });
    expect(s.serviceType).toBe("Merchant services / payment processing");
  });
});

describe("breadcrumbSchema", () => {
  it("builds absolute, positioned list items", () => {
    const s = breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Locations", path: "/locations" },
    ]);
    const items = s.itemListElement as Array<Record<string, unknown>>;
    expect(items).toHaveLength(2);
    expect(items[0]).toMatchObject({ position: 1, name: "Home", item: "https://impeccabyte.com/" });
    expect(items[1]).toMatchObject({ position: 2, name: "Locations", item: "https://impeccabyte.com/locations" });
  });
});

describe("faqSchema", () => {
  it("maps each Q&A to a Question/Answer pair", () => {
    const s = faqSchema([{ q: "Open?", a: "Yes." }]);
    expect(s["@type"]).toBe("FAQPage");
    const q = (s.mainEntity as Array<Record<string, unknown>>)[0];
    expect(q).toMatchObject({ "@type": "Question", name: "Open?" });
    expect(q.acceptedAnswer).toMatchObject({ "@type": "Answer", text: "Yes." });
  });
});
