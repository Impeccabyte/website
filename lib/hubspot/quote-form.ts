import { INDUSTRY_OPTIONS, VOLUME_OPTIONS } from "@/lib/quote-options";
import { PIPELINE_ID, DEALSTAGE_NEW_PROSPECT, DEAL_TO_CONTACT_ASSOC, NOTE_TO_DEAL_ASSOC } from "@/lib/hubspot/constants";

export type QuoteInput = {
  businessName: string;
  industry: string;
  monthlyVolume: string;
  currentProcessor: string;
  email: string;
  phone: string;
};

export type ParseResult =
  | { ok: true; data: QuoteInput }
  | { ok: false; spam: true }
  | { ok: false; spam: false; fieldErrors: Record<string, string> };

const INDUSTRY_LABELS = new Map(INDUSTRY_OPTIONS.filter((o) => o.value).map((o) => [o.value, o.label]));
const VOLUME_VALUES = new Set(VOLUME_OPTIONS.filter((o) => o.value).map((o) => o.value));
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function str(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim() : "";
}

export function parseQuoteSubmission(formData: FormData): ParseResult {
  // Honeypot: real users never fill this hidden field.
  if (str(formData, "company_website") !== "") return { ok: false, spam: true };

  const data: QuoteInput = {
    businessName: str(formData, "business_name"),
    industry: str(formData, "industry"),
    monthlyVolume: str(formData, "monthly_volume"),
    currentProcessor: str(formData, "current_processor"),
    email: str(formData, "email").toLowerCase(),
    phone: str(formData, "phone"),
  };

  const fieldErrors: Record<string, string> = {};
  if (!data.businessName) fieldErrors.businessName = "Business name is required.";
  if (!INDUSTRY_LABELS.has(data.industry)) fieldErrors.industry = "Please select an industry.";
  if (!VOLUME_VALUES.has(data.monthlyVolume)) fieldErrors.monthlyVolume = "Please select a monthly volume.";
  if (!EMAIL_RE.test(data.email)) fieldErrors.email = "Please enter a valid email address.";

  if (Object.keys(fieldErrors).length > 0) return { ok: false, spam: false, fieldErrors };
  return { ok: true, data };
}

export function buildContactProperties(d: QuoteInput): Record<string, string> {
  const props: Record<string, string> = {
    email: d.email,
    company: d.businessName,
    industry: INDUSTRY_LABELS.get(d.industry) ?? d.industry,
  };
  if (d.phone) props.phone = d.phone;
  return props;
}

export function buildDealPayload(d: QuoteInput, contactId: string) {
  const properties: Record<string, string> = {
    dealname: `${d.businessName} — Quote Request`,
    pipeline: PIPELINE_ID,
    dealstage: DEALSTAGE_NEW_PROSPECT,
    monthly_processing_volume: d.monthlyVolume,
  };
  if (d.currentProcessor) properties.current_processor = d.currentProcessor;
  return {
    properties,
    associations: [
      { to: { id: contactId }, types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: DEAL_TO_CONTACT_ASSOC }] },
    ],
  };
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function buildNotePayload(d: QuoteInput, dealId: string, isoTimestamp: string) {
  const industryLabel = INDUSTRY_LABELS.get(d.industry) ?? d.industry;
  const volumeLabel = VOLUME_OPTIONS.find((o) => o.value === d.monthlyVolume)?.label ?? d.monthlyVolume;
  const lines = [
    `<strong>New quote request</strong>`,
    `Business: ${escapeHtml(d.businessName)}`,
    `Industry: ${escapeHtml(industryLabel)}`,
    `Monthly volume: ${escapeHtml(volumeLabel)}`,
    `Current processor: ${escapeHtml(d.currentProcessor || "—")}`,
    `Email: ${escapeHtml(d.email)}`,
    `Phone: ${escapeHtml(d.phone || "—")}`,
  ];
  return {
    properties: { hs_note_body: lines.join("<br>"), hs_timestamp: isoTimestamp },
    associations: [
      { to: { id: dealId }, types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: NOTE_TO_DEAL_ASSOC }] },
    ],
  };
}
