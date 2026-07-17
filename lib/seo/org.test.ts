import { describe, it, expect } from "vitest";
import { ORG_ID, TELEPHONE, GEO, orgSchema } from "@/lib/seo/org";

describe("orgSchema", () => {
  it("is a single FinancialService node with the stable @id", () => {
    const s = orgSchema();
    expect(s["@type"]).toBe("FinancialService");
    expect(s["@id"]).toBe(ORG_ID);
  });

  // The business has no public premises, so it must never assert a street address or a
  // pinpoint location — both would claim a storefront that does not exist.
  it("emits no address and no geo, as a service-area business", () => {
    const s = orgSchema();
    expect("address" in s).toBe(false);
    expect("geo" in s).toBe(false);
    expect(GEO).toBeNull();
    expect(JSON.stringify(s)).not.toContain("Headway");
  });

  it("lists Austin, Dallas, and San Antonio in areaServed", () => {
    const names = (orgSchema().areaServed as Array<{ name: string }>).map((c) => c.name);
    expect(names).toEqual(["Austin", "Dallas", "San Antonio"]);
  });

  it("emits telephone only when the constant is set, and never a fake value", () => {
    const s = orgSchema();
    expect("telephone" in s).toBe(TELEPHONE !== null);
    if (TELEPHONE) expect(s.telephone).toBe(TELEPHONE);
  });
});
