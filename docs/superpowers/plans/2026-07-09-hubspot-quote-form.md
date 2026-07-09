# HubSpot Quote Form Integration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire the `/contact` "Request your quote" form to HubSpot so each submission creates/updates a Contact and opens an associated Deal (with a summary Note) in the Merchant Services pipeline.

**Architecture:** The existing custom form (`quote-experience.tsx`) is converted to a `useActionState` form calling a `'use server'` action. The action verifies a Cloudflare Turnstile token and a honeypot, then calls HubSpot's v3 REST API with a Service Key: contacts `batch/upsert` (by email) → deal create (associated to the contact) → note create (associated to the deal). Pure validation/mapping logic lives in `lib/hubspot/quote-form.ts` and is unit-tested with vitest; network wrappers live in `lib/hubspot/client.ts` and `lib/turnstile.ts`.

**Tech Stack:** Next.js 16 (App Router, React 19), TypeScript, Tailwind v4, vitest (new dev dependency). No new runtime dependencies — HubSpot and Turnstile are called with `fetch`.

## Global Constraints

- **No new runtime dependencies.** Use the built-in `fetch`. vitest is the only new dependency and it is `devDependencies` only.
- **Secrets are server-only.** `HUBSPOT_SERVICE_KEY` and `TURNSTILE_SECRET_KEY` must never be referenced in a Client Component or prefixed `NEXT_PUBLIC_`. Only `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is client-exposed.
- **HubSpot REST base:** `https://api.hubapi.com` (region-independent). Auth header on every call: `Authorization: Bearer <HUBSPOT_SERVICE_KEY>`.
- **Fixed HubSpot IDs:** pipeline `default` ("Merchant Services"); deal stage `3963348702` ("New Prospect"); deal→contact associationTypeId `3`; note→deal associationTypeId `214`. All `HUBSPOT_DEFINED`.
- **Path alias:** `@/*` → repo root.
- **`.env*` is gitignored** — never commit real keys. `.env.example` is committed with placeholder values via `git add -f`.
- Follow existing code style: `forwardRef` UI primitives, `cn()` for classes, named exports, 2-space indent.

---

## File Structure

- `lib/quote-options.ts` **(create)** — shared `INDUSTRY_OPTIONS` / `VOLUME_OPTIONS` arrays, imported by both the form and the mapping logic (removes duplication).
- `lib/hubspot/constants.ts` **(create)** — base URL + fixed IDs.
- `lib/hubspot/quote-form.ts` **(create)** — pure: types, `parseQuoteSubmission`, `buildContactProperties`, `buildDealPayload`, `buildNotePayload`. Unit-tested.
- `lib/hubspot/quote-form.test.ts` **(create)** — vitest tests for the pure logic.
- `lib/hubspot/client.ts` **(create)** — `upsertContactByEmail`, `createDeal`, `createNote` (fetch wrappers).
- `lib/turnstile.ts` **(create)** — `verifyTurnstileToken`.
- `app/contact/actions.ts` **(create)** — `submitQuote` server action (orchestration).
- `components/contact/quote-experience.tsx` **(modify)** — `useActionState`, field `name`s, Turnstile widget, honeypot, error/pending states.
- `vitest.config.ts` **(create)**, `package.json` **(modify: scripts + devDep)**, `.env.example` **(create)**.

---

## Task 1: HubSpot account setup — custom deal properties + env scaffolding

One-time external setup. No unit test; verified with a GET.

**Files:**
- Create: `.env.example`

**Prerequisites the human must complete first** (cannot be scripted — done in HubSpot / Cloudflare UI):
1. HubSpot → Settings → Integrations → **Service Keys** → create key `impeccabyte-website` with scopes `crm.objects.contacts.read/write`, `crm.objects.deals.read/write`, `crm.schemas.deals.write`. Put it in `.env.local` as `HUBSPOT_SERVICE_KEY`.
2. Cloudflare → **Turnstile** → add site (domain `impeccabyte.com`, plus `localhost` for testing). Put the site key in `.env.local` as `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and the secret as `TURNSTILE_SECRET_KEY`.

- [ ] **Step 1: Create `.env.example`**

```bash
# HubSpot Service Key (Settings → Integrations → Service Keys). Server-only.
HUBSPOT_SERVICE_KEY=pat-na2-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
# Cloudflare Turnstile keys (dash.cloudflare.com → Turnstile).
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x0000000000000000000000
TURNSTILE_SECRET_KEY=0x0000000000000000000000000000000000000000
```

- [ ] **Step 2: Create the two custom Deal properties via the Service Key**

Run (requires `HUBSPOT_SERVICE_KEY` exported in the shell):

```bash
curl -sS -X POST https://api.hubapi.com/crm/v3/properties/deals \
  -H "Authorization: Bearer $HUBSPOT_SERVICE_KEY" -H "Content-Type: application/json" \
  -d '{"name":"monthly_processing_volume","label":"Monthly Processing Volume","type":"enumeration","fieldType":"select","groupName":"dealinformation","options":[{"label":"Up to $25,000","value":"0-25k","displayOrder":0},{"label":"$25,000 – $100,000","value":"25k-100k","displayOrder":1},{"label":"$100,000 – $500,000","value":"100k-500k","displayOrder":2},{"label":"$500,000+","value":"500k+","displayOrder":3}]}'

curl -sS -X POST https://api.hubapi.com/crm/v3/properties/deals \
  -H "Authorization: Bearer $HUBSPOT_SERVICE_KEY" -H "Content-Type: application/json" \
  -d '{"name":"current_processor","label":"Current Processor","type":"string","fieldType":"text","groupName":"dealinformation"}'
```

Expected: each returns HTTP 201 with a JSON body echoing `"name":"monthly_processing_volume"` / `"current_processor"`. A 409 `PROPERTY_ALREADY_EXISTS` is fine (idempotent — already created).

- [ ] **Step 3: Verify the properties exist**

Run: `curl -sS https://api.hubapi.com/crm/v3/properties/deals/monthly_processing_volume -H "Authorization: Bearer $HUBSPOT_SERVICE_KEY" | grep -o '"fieldType":"select"'`
Expected: prints `"fieldType":"select"`.

- [ ] **Step 4: Commit**

```bash
git add -f .env.example
git commit -m "chore: document HubSpot/Turnstile env vars"
```

---

## Task 2: Shared options + pure mapping logic (vitest)

**Files:**
- Create: `lib/quote-options.ts`, `lib/hubspot/constants.ts`, `lib/hubspot/quote-form.ts`
- Create: `lib/hubspot/quote-form.test.ts`, `vitest.config.ts`
- Modify: `package.json` (add vitest devDep + scripts)

**Interfaces:**
- Produces (consumed by Tasks 3–5):
  - `INDUSTRY_OPTIONS`, `VOLUME_OPTIONS: { value: string; label: string }[]`
  - `HUBSPOT_BASE: string`, `PIPELINE_ID`, `DEALSTAGE_NEW_PROSPECT`, `DEAL_TO_CONTACT_ASSOC`, `NOTE_TO_DEAL_ASSOC`
  - `type QuoteInput`
  - `type ParseResult = { ok: true; data: QuoteInput } | { ok: false; spam: true } | { ok: false; spam: false; fieldErrors: Record<string,string> }`
  - `parseQuoteSubmission(formData: FormData): ParseResult`
  - `buildContactProperties(d: QuoteInput): Record<string,string>`
  - `buildDealPayload(d: QuoteInput, contactId: string): object`
  - `buildNotePayload(d: QuoteInput, dealId: string, isoTimestamp: string): object`

- [ ] **Step 1: Add vitest and scripts to `package.json`**

Add to `devDependencies`: `"vitest": "^3"`. Add to `scripts`: `"test": "vitest run"`, `"test:watch": "vitest"`. Then run `npm install`.

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL(".", import.meta.url)) } },
  test: { environment: "node", include: ["lib/**/*.test.ts"] },
});
```

- [ ] **Step 3: Create `lib/quote-options.ts`**

```ts
export const INDUSTRY_OPTIONS = [
  { value: "", label: "Select an industry" },
  { value: "retail", label: "Retail & shops" },
  { value: "food", label: "Food & drink" },
  { value: "services", label: "Professional services" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "nonprofit", label: "Nonprofit" },
  { value: "highrisk", label: "High-risk / specialty" },
  { value: "other", label: "Something else" },
];

export const VOLUME_OPTIONS = [
  { value: "", label: "Monthly volume" },
  { value: "0-25k", label: "Up to $25,000" },
  { value: "25k-100k", label: "$25,000 – $100,000" },
  { value: "100k-500k", label: "$100,000 – $500,000" },
  { value: "500k+", label: "$500,000+" },
];
```

- [ ] **Step 4: Create `lib/hubspot/constants.ts`**

```ts
export const HUBSPOT_BASE = "https://api.hubapi.com";
export const PIPELINE_ID = "default"; // "Merchant Services"
export const DEALSTAGE_NEW_PROSPECT = "3963348702"; // "New Prospect"
export const DEAL_TO_CONTACT_ASSOC = 3; // HUBSPOT_DEFINED deal→contact
export const NOTE_TO_DEAL_ASSOC = 214; // HUBSPOT_DEFINED note→deal
```

- [ ] **Step 5: Write the failing tests — `lib/hubspot/quote-form.test.ts`**

```ts
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
```

- [ ] **Step 6: Run the tests to verify they fail**

Run: `npm test`
Expected: FAIL — `Cannot find module '@/lib/hubspot/quote-form'` (file not created yet).

- [ ] **Step 7: Implement `lib/hubspot/quote-form.ts`**

```ts
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
```

- [ ] **Step 8: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS — all tests green (note the industry label test uses "Food & drink"; the note-body test checks the escaped `Saffron &amp; Co`).

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json vitest.config.ts lib/quote-options.ts lib/hubspot/constants.ts lib/hubspot/quote-form.ts lib/hubspot/quote-form.test.ts
git commit -m "feat: add HubSpot quote-form mapping logic + vitest"
```

---

## Task 3: HubSpot + Turnstile network wrappers

Thin `fetch` wrappers. No unit tests (per testing decision — logic is tested in Task 2). Verified by typecheck.

**Files:**
- Create: `lib/hubspot/client.ts`, `lib/turnstile.ts`

**Interfaces:**
- Consumes: `HUBSPOT_BASE` (constants), `buildContactProperties`, `buildDealPayload`, `buildNotePayload` (Task 2).
- Produces (consumed by Task 4):
  - `upsertContactByEmail(d: QuoteInput): Promise<string>` — returns contact id
  - `createDeal(d: QuoteInput, contactId: string): Promise<string>` — returns deal id
  - `createNote(d: QuoteInput, dealId: string, isoTimestamp: string): Promise<void>`
  - `verifyTurnstileToken(token: string, remoteIp?: string): Promise<boolean>`

- [ ] **Step 1: Create `lib/hubspot/client.ts`**

```ts
import { HUBSPOT_BASE } from "@/lib/hubspot/constants";
import {
  buildContactProperties,
  buildDealPayload,
  buildNotePayload,
  type QuoteInput,
} from "@/lib/hubspot/quote-form";

function authHeaders(): HeadersInit {
  const key = process.env.HUBSPOT_SERVICE_KEY;
  if (!key) throw new Error("HUBSPOT_SERVICE_KEY is not set");
  return { Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
}

async function hsPost(path: string, body: unknown): Promise<any> {
  const res = await fetch(`${HUBSPOT_BASE}${path}`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HubSpot ${path} failed: ${res.status} ${text}`);
  }
  return res.json();
}

export async function upsertContactByEmail(d: QuoteInput): Promise<string> {
  const json = await hsPost("/crm/v3/objects/contacts/batch/upsert", {
    inputs: [{ idProperty: "email", id: d.email, properties: buildContactProperties(d) }],
  });
  const id = json?.results?.[0]?.id;
  if (!id) throw new Error(`HubSpot contact upsert returned no id: ${JSON.stringify(json)}`);
  return id;
}

export async function createDeal(d: QuoteInput, contactId: string): Promise<string> {
  const json = await hsPost("/crm/v3/objects/deals", buildDealPayload(d, contactId));
  if (!json?.id) throw new Error(`HubSpot deal create returned no id: ${JSON.stringify(json)}`);
  return json.id;
}

export async function createNote(d: QuoteInput, dealId: string, isoTimestamp: string): Promise<void> {
  await hsPost("/crm/v3/objects/notes", buildNotePayload(d, dealId, isoTimestamp));
}
```

- [ ] **Step 2: Create `lib/turnstile.ts`**

```ts
export async function verifyTurnstileToken(token: string, remoteIp?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) throw new Error("TURNSTILE_SECRET_KEY is not set");
  if (!token) return false;

  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) return false;
  const json = (await res.json()) as { success?: boolean };
  return json.success === true;
}
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add lib/hubspot/client.ts lib/turnstile.ts
git commit -m "feat: add HubSpot + Turnstile fetch wrappers"
```

---

## Task 4: Server action orchestration

**Files:**
- Create: `app/contact/actions.ts`

**Interfaces:**
- Consumes: `parseQuoteSubmission` (Task 2); `upsertContactByEmail`, `createDeal`, `createNote`, `verifyTurnstileToken` (Task 3).
- Produces (consumed by Task 5):
  - `type QuoteFormState = { status: "idle" } | { status: "success" } | { status: "error"; message: string; fieldErrors?: Record<string,string> }`
  - `submitQuote(prevState: QuoteFormState, formData: FormData): Promise<QuoteFormState>`

- [ ] **Step 1: Create `app/contact/actions.ts`**

```ts
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
  const human = await verifyTurnstileToken(token, remoteIp);
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
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/contact/actions.ts
git commit -m "feat: add submitQuote server action"
```

---

## Task 5: Wire up the form UI

Convert `QuoteExperience` to a `useActionState` form: add field `name`s, the Turnstile widget, the honeypot, and error/pending states.

**Files:**
- Modify: `components/contact/quote-experience.tsx`

**Interfaces:**
- Consumes: `submitQuote`, `QuoteFormState` (Task 4); `INDUSTRY_OPTIONS`, `VOLUME_OPTIONS` (Task 2).

- [ ] **Step 1: Replace the imports and constants block (lines 1–36)**

Replace the top of the file (through the `STEPS` definition) with:

```tsx
"use client";

import * as React from "react";
import { useActionState } from "react";
import Script from "next/script";
import { Check, FileUp, MapPin, Clock } from "lucide-react";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { INDUSTRY_OPTIONS, VOLUME_OPTIONS } from "@/lib/quote-options";
import { submitQuote, type QuoteFormState } from "@/app/contact/actions";

const STEPS = [
  "Tell us about your business",
  "We build a custom interchange-plus quote",
  "You approve it, and we get you set up",
];

const initialState: QuoteFormState = { status: "idle" };
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
```

(The local `INDUSTRY_OPTIONS` / `VOLUME_OPTIONS` arrays are now imported — do not redeclare them.)

- [ ] **Step 2: Replace the component body — state + success early return (old lines 38–62)**

```tsx
export function QuoteExperience() {
  const [fileName, setFileName] = React.useState<string | null>(null);
  const [state, formAction, pending] = useActionState(submitQuote, initialState);

  // Turnstile tokens are single-use; reset the widget after a failed attempt.
  React.useEffect(() => {
    if (state.status === "error") {
      (window as unknown as { turnstile?: { reset: () => void } }).turnstile?.reset();
    }
  }, [state]);

  const fieldErrors = state.status === "error" ? state.fieldErrors : undefined;

  if (state.status === "success") {
    return (
      <section className="px-6 py-24">
        <Container width="narrow" className="text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-round bg-sage-500 text-white">
            <Check size={34} strokeWidth={2.4} />
          </span>
          <h1 className="mt-6 font-display font-semibold text-ink-900" style={{ fontSize: "clamp(30px,4vw,44px)" }}>
            Your request is in.
          </h1>
          <p className="mx-auto mt-4 max-w-[480px] text-[17px] leading-relaxed text-ink-600">
            Thanks — our team will reach out within one business day with a custom interchange-plus quote. Keep
            an eye on your inbox.
          </p>
          <ButtonLink href="/" variant="secondary" size="lg" className="mt-8">
            Back to home
          </ButtonLink>
        </Container>
      </section>
    );
  }
```

- [ ] **Step 3: Load the Turnstile script (add just inside the returned `<section>`, before `<Container>`)**

```tsx
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
```

- [ ] **Step 4: Replace the `<form>` open tag + fields (old lines 109–166)**

Swap the `onSubmit` for `action={formAction}`, add `name`s to every field, add the honeypot + Turnstile widget + error message, and pass `error` hints. Replace from `<form ...>` through its closing `</form>`:

```tsx
            <form className="mt-6 flex flex-col gap-5" action={formAction}>
              <Input label="Business name" name="business_name" required placeholder="Saffron & Co"
                error={fieldErrors?.businessName} />

              <div className="grid gap-5 sm:grid-cols-2">
                <Select label="Industry" name="industry" required options={INDUSTRY_OPTIONS} defaultValue="" />
                <Select label="Monthly volume" name="monthly_volume" required options={VOLUME_OPTIONS} defaultValue="" />
              </div>

              <Input
                label="Current processor"
                name="current_processor"
                placeholder="e.g. Square, Stripe, none yet"
                hint="Optional — helps us beat your current rate"
              />

              {/* File upload (visual only for now — not submitted) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-ink-800">
                  Recent merchant statement (PDF, optional)
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-md border-[1.5px] border-dashed border-ink-300 bg-ink-50 px-4 py-3.5 transition-colors hover:border-clay-400 hover:bg-clay-50">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-clay-50 text-clay-600">
                    <FileUp size={18} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[14.5px] font-medium text-ink-800">
                      {fileName ?? "Upload your latest statement (PDF)"}
                    </span>
                    <span className="block text-[12.5px] text-ink-500">
                      Optional — helps us build a full assessment
                    </span>
                  </span>
                  <input
                    type="file"
                    accept="application/pdf,.pdf"
                    className="sr-only"
                    onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
                  />
                </label>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Input label="Email" name="email" required type="email" placeholder="you@business.com"
                  error={fieldErrors?.email} />
                <Input label="Phone" name="phone" type="tel" placeholder="(512) 555-0199" />
              </div>

              {/* Honeypot — hidden from users, tempting to bots */}
              <input
                type="text"
                name="company_website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
              />

              {TURNSTILE_SITE_KEY && (
                <div className="cf-turnstile" data-sitekey={TURNSTILE_SITE_KEY} data-theme="light" />
              )}

              {state.status === "error" && (
                <p aria-live="polite" className="text-[13.5px] font-medium text-brick-500">
                  {state.message}
                </p>
              )}

              <Button type="submit" variant="primary" size="lg" block disabled={pending}>
                {pending ? "Sending…" : "Request quote"}
              </Button>
              <p className="text-center text-[12.5px] leading-snug text-ink-400">
                No obligation. We'll never sell your info. Approval subject to underwriting.
              </p>
            </form>
```

- [ ] **Step 5: Add an optional `error` prop to the `Input` primitive**

The plan's form passes `error={...}` to `Input`. Add support in `components/ui/input.tsx`: extend `InputProps` with `error?: string`, destructure it, and render it under the field. Replace the `hint` render line (`{hint && ...}`) with:

```tsx
        {error ? (
          <span className="text-xs text-brick-500">{error}</span>
        ) : hint ? (
          <span className="text-xs text-ink-500">{hint}</span>
        ) : null}
```

Add `error` to the destructured props and to `InputProps`:

```tsx
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  prefix?: string;
  required?: boolean;
  error?: string;
}
```

and change the destructure to `({ className, label, hint, prefix, required, error, id, ...props }, ref) =>`.

- [ ] **Step 6: Typecheck, lint, and build**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: no type errors, no lint errors, successful production build.

- [ ] **Step 7: Commit**

```bash
git add components/contact/quote-experience.tsx components/ui/input.tsx
git commit -m "feat: wire quote form to HubSpot via server action + Turnstile"
```

---

## Task 6: End-to-end verification (manual)

No code. Confirms the whole path against the live account. Requires `.env.local` populated (Task 1 prerequisites) and the two custom deal properties created (Task 1).

- [ ] **Step 1: Run the dev server**

Run: `npm run dev` and open `http://localhost:3000/contact`.

- [ ] **Step 2: Submit a test quote**

Fill the form (use a distinctive business name like `E2E Test <today's date>`), complete the Turnstile check, submit. Expect the "Your request is in." screen.

- [ ] **Step 3: Confirm in HubSpot**

In HubSpot (app-na2.hubspot.com): the **Contact** exists with the email/company/industry; a **Deal** named `E2E Test … — Quote Request` sits in **Merchant Services → New Prospect** with Monthly Processing Volume + Current Processor set; the Deal has a **Note** summarizing the submission; the Contact and Deal are associated.

- [ ] **Step 4: Confirm the error path**

Temporarily unset `HUBSPOT_SERVICE_KEY` in `.env.local`, restart dev, submit again. Expect the inline error message (not the success screen) and a server-side console error. Restore the key afterward.

- [ ] **Step 5: Clean up**

Delete the test Contact and Deal in HubSpot.

---

## Self-Review notes

- **Spec coverage:** Contact+Deal creation (Tasks 2–4), keep custom UI (Task 5), drop PDF (Task 5 keeps the field visual-only), Service Key auth (Global Constraints + Task 3), Turnstile + honeypot (Tasks 2/3/4/5), custom deal properties (Task 1), summary Note (Tasks 2–4), field mapping table (Task 2 builders), error handling (Task 4), testing (Task 2 vitest), manual verification (Task 6). All spec sections map to a task.
- **Types:** `QuoteInput` / `ParseResult` (Task 2) and `QuoteFormState` (Task 4) are used consistently across Tasks 3–5. Field `name`s in Task 5 exactly match the keys read in `parseQuoteSubmission` (Task 2): `business_name`, `industry`, `monthly_volume`, `current_processor`, `email`, `phone`, `company_website` honeypot, plus Turnstile's `cf-turnstile-response`.
- **No placeholders:** every step contains runnable code/commands and expected output.
```
