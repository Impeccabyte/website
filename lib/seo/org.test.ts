import { describe, it, expect } from "vitest";
import { ORG_ID, orgSchema, AUSTIN_ADDRESS } from "@/lib/seo/org";

describe("orgSchema", () => {
  it("is a single FinancialService node with the stable @id and real Austin NAP", () => {
    const s = orgSchema();
    expect(s["@type"]).toBe("FinancialService");
    expect(s["@id"]).toBe(ORG_ID);
    expect(s.address).toMatchObject({
      "@type": "PostalAddress",
      streetAddress: "1606 Headway Circle Ste. 9317",
      addressLocality: "Austin",
      addressRegion: "TX",
      postalCode: "78754",
      addressCountry: "US",
    });
    expect(AUSTIN_ADDRESS.streetAddress).toBe("1606 Headway Circle Ste. 9317");
  });

  it("lists Austin, Dallas, and San Antonio in areaServed", () => {
    const names = (orgSchema().areaServed as Array<{ name: string }>).map((c) => c.name);
    expect(names).toEqual(["Austin", "Dallas", "San Antonio"]);
  });

  it("omits telephone and geo while the CONFIRM constants are null", () => {
    const s = orgSchema();
    expect("telephone" in s).toBe(false);
    expect("geo" in s).toBe(false);
  });
});
