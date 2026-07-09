"use server";

import { headers } from "next/headers";
import { parseQuoteSubmission } from "@/lib/hubspot/quote-form";
import { upsertContactByEmail, createDeal, createNote } from "@/lib/hubspot/client";
import { verifyTurnstileToken } from "@/lib/turnstile";

export type QuoteFormState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string; fieldErrors?: Record<string, string> };

const GENERIC_ERROR =
  "Sorry — we couldn't submit your request. Please try again, or email us at hello@impeccabyte.com.";

export async function submitQuote(
  _prevState: QuoteFormState,
  formData: FormData,
): Promise<QuoteFormState> {
  const parsed = parseQuoteSubmission(formData);

  // Honeypot hit: pretend success, write nothing.
  if (!parsed.ok && parsed.spam) return { status: "success" };
  if (!parsed.ok) {
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors: parsed.fieldErrors };
  }

  // Turnstile verification gates all HubSpot writes.
  const token = String(formData.get("cf-turnstile-response") ?? "");
  const remoteIp = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim();
  let human: boolean;
  try {
    human = await verifyTurnstileToken(token, remoteIp);
  } catch (err) {
    console.error("[submitQuote] Turnstile verification error:", err);
    return { status: "error", message: GENERIC_ERROR };
  }
  if (!human) {
    return { status: "error", message: "Please complete the anti-spam check and try again." };
  }

  try {
    const contactId = await upsertContactByEmail(parsed.data);
    const dealId = await createDeal(parsed.data, contactId);
    await createNote(parsed.data, dealId, new Date().toISOString());
    return { status: "success" };
  } catch (err) {
    console.error("[submitQuote] HubSpot write failed:", err);
    return { status: "error", message: GENERIC_ERROR };
  }
}
