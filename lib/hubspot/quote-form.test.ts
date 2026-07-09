import { describe, it, expect } from "vitest";
import {
  parseQuoteSubmission,
  buildContactProperties,
  buildDealPayload,
  buildNotePayload,
  validateStatementFile,
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

function fakeFile(props: { size: number; type: string; name: string }): File {
  return props as unknown as File;
}

describe("validateStatementFile", () => {
  it("treats null as no statement", () => {
    expect(validateStatementFile(null)).toEqual({ ok: true, file: null });
  });

  it("treats an empty (size 0) file as no statement", () => {
    const f = fakeFile({ size: 0, type: "application/pdf", name: "empty.pdf" });
    expect(validateStatementFile(f)).toEqual({ ok: true, file: null });
  });

  it("rejects a non-PDF file", () => {
    const f = fakeFile({ size: 1000, type: "image/png", name: "logo.png" });
    expect(validateStatementFile(f)).toEqual({ ok: false, error: "Please upload a PDF file." });
  });

  it("rejects a file over the size limit", () => {
    const f = fakeFile({ size: 11 * 1024 * 1024, type: "application/pdf", name: "big.pdf" });
    expect(validateStatementFile(f)).toEqual({ ok: false, error: "File is too large (max 10 MB)." });
  });

  it("accepts a valid PDF (by mime)", () => {
    const f = fakeFile({ size: 5000, type: "application/pdf", name: "statement.pdf" });
    expect(validateStatementFile(f)).toEqual({ ok: true, file: f });
  });

  it("accepts a PDF identified by extension when the mime is blank", () => {
    const f = fakeFile({ size: 5000, type: "", name: "statement.PDF" });
    expect(validateStatementFile(f)).toEqual({ ok: true, file: f });
  });
});

describe("buildDealPayload — statement stage", () => {
  it("uses the Statement Requested stage when hasStatement is true", () => {
    const p = buildDealPayload(sample, "555", true) as any;
    expect(p.properties.dealstage).toBe("qualifiedtobuy");
  });

  it("keeps New Prospect when hasStatement is false/omitted", () => {
    const p = buildDealPayload(sample, "555") as any;
    expect(p.properties.dealstage).toBe("3963348702");
  });
});

describe("buildNotePayload — attachment", () => {
  it("adds hs_attachment_ids when an attachmentId is provided", () => {
    const p = buildNotePayload(sample, "999", "2026-07-09T12:00:00.000Z", "77123") as any;
    expect(p.properties.hs_attachment_ids).toBe("77123");
  });

  it("omits hs_attachment_ids when no attachmentId is given", () => {
    const p = buildNotePayload(sample, "999", "2026-07-09T12:00:00.000Z") as any;
    expect(p.properties).not.toHaveProperty("hs_attachment_ids");
  });
});
