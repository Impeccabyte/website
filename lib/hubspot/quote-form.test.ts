import { describe, it, expect } from "vitest";
import {
  parseQuoteSubmission,
  buildContactProperties,
  buildDealPayload,
  buildNotePayload,
  type QuoteInput,
} from "@/lib/hubspot/quote-form";

function fd(entries: Record<string, string>): FormData {
  const f = new FormData();
  for (const [k, v] of Object.entries(entries)) f.append(k, v);
  return f;
}

const valid = {
  business_name: "Saffron & Co",
  industry: "food",
  monthly_volume: "25k-100k",
  current_processor: "Square",
  email: "OWNER@Saffron.com",
  phone: "(512) 555-0199",
  company_website: "", // honeypot, empty
};

const sample: QuoteInput = {
  businessName: "Saffron & Co",
  industry: "food",
  monthlyVolume: "25k-100k",
  currentProcessor: "Square",
  email: "owner@saffron.com",
  phone: "(512) 555-0199",
};

describe("parseQuoteSubmission", () => {
  it("accepts a valid submission and normalizes email to lowercase", () => {
    const r = parseQuoteSubmission(fd(valid));
    expect(r).toEqual({ ok: true, data: sample });
  });

  it("flags spam when the honeypot is filled", () => {
    const r = parseQuoteSubmission(fd({ ...valid, company_website: "http://x" }));
    expect(r).toEqual({ ok: false, spam: true });
  });

  it("reports field errors for missing required fields", () => {
    const r = parseQuoteSubmission(fd({ ...valid, business_name: "", industry: "", monthly_volume: "" }));
    expect(r.ok).toBe(false);
    if (!r.ok && !r.spam) {
      expect(r.fieldErrors).toHaveProperty("businessName");
      expect(r.fieldErrors).toHaveProperty("industry");
      expect(r.fieldErrors).toHaveProperty("monthlyVolume");
    }
  });

  it("rejects a malformed email", () => {
    const r = parseQuoteSubmission(fd({ ...valid, email: "not-an-email" }));
    expect(r.ok).toBe(false);
    if (!r.ok && !r.spam) expect(r.fieldErrors).toHaveProperty("email");
  });

  it("rejects an industry value outside the option list", () => {
    const r = parseQuoteSubmission(fd({ ...valid, industry: "banana" }));
    expect(r.ok).toBe(false);
    if (!r.ok && !r.spam) expect(r.fieldErrors).toHaveProperty("industry");
  });
});

describe("buildContactProperties", () => {
  it("maps to HubSpot contact properties with the industry label", () => {
    expect(buildContactProperties(sample)).toEqual({
      email: "owner@saffron.com",
      phone: "(512) 555-0199",
      company: "Saffron & Co",
      industry: "Food & drink",
    });
  });

  it("omits phone when empty", () => {
    const props = buildContactProperties({ ...sample, phone: "" });
    expect(props).not.toHaveProperty("phone");
  });
});

describe("buildDealPayload", () => {
  it("builds the deal with pipeline, stage, custom props and contact association", () => {
    expect(buildDealPayload(sample, "555")).toEqual({
      properties: {
        dealname: "Saffron & Co — Quote Request",
        pipeline: "default",
        dealstage: "3963348702",
        monthly_processing_volume: "25k-100k",
        current_processor: "Square",
      },
      associations: [
        { to: { id: "555" }, types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 3 }] },
      ],
    });
  });

  it("omits current_processor when empty", () => {
    const p = buildDealPayload({ ...sample, currentProcessor: "" }, "555") as any;
    expect(p.properties).not.toHaveProperty("current_processor");
  });
});

describe("buildNotePayload", () => {
  it("summarizes the submission and associates to the deal", () => {
    const p = buildNotePayload(sample, "999", "2026-07-09T12:00:00.000Z") as any;
    expect(p.properties.hs_timestamp).toBe("2026-07-09T12:00:00.000Z");
    expect(p.properties.hs_note_body).toContain("Saffron &amp; Co");
    expect(p.properties.hs_note_body).toContain("Food &amp; drink"); // industry label, HTML-escaped
    expect(p.properties.hs_note_body).toContain("owner@saffron.com");
    expect(p.associations[0].types[0].associationTypeId).toBe(214);
  });
});
