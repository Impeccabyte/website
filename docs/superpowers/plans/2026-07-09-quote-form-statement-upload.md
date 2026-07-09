# Merchant-Statement Upload Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Handle the optional merchant-statement PDF: upload it to HubSpot Files (private), attach it to the Deal via the summary Note, and advance the Deal to "Statement Requested".

**Architecture:** Extends the shipped Contact+Deal+Note flow. New pure `validateStatementFile` + backward-compatible optional params on `buildDealPayload`/`buildNotePayload` (so intermediate commits keep compiling), a new `uploadStatementFile` fetch wrapper (HubSpot Files API, multipart), server-action orchestration, and a one-line form change to submit the file.

**Tech Stack:** Next.js 16 (App Router, React 19), TypeScript, vitest. No new dependencies.

## Global Constraints

- No new dependencies — built-in `fetch`, `FormData`, `File`.
- Secrets server-only: `HUBSPOT_SERVICE_KEY` never `NEXT_PUBLIC_`, never in a client component.
- HubSpot REST base `https://api.hubapi.com`; Files endpoint `/files/v3/files`; `Authorization: Bearer <HUBSPOT_SERVICE_KEY>`. On the multipart Files call, do NOT set `Content-Type` manually — let `fetch` set the multipart boundary.
- Fixed IDs: `DEALSTAGE_STATEMENT_REQUESTED = "qualifiedtobuy"`, `DEALSTAGE_NEW_PROSPECT = "3963348702"`.
- File rules: type `application/pdf` (or a `.pdf` filename), size ≤ `10 * 1024 * 1024`. File access `PRIVATE`, folder `/quote-statements`.
- Backward compatibility: new function params are OPTIONAL with defaults, so each task ends with `tsc` clean.
- Path alias `@/*` → repo root. Follow existing style (named exports, 2-space indent).

---

## File Structure

- `next.config.ts` **(modify)** — raise server-action body limit to `10mb`.
- `lib/hubspot/constants.ts` **(modify)** — statement-related constants.
- `lib/hubspot/quote-form.ts` **(modify)** — `validateStatementFile`; optional params on `buildDealPayload`/`buildNotePayload`.
- `lib/hubspot/quote-form.test.ts` **(modify)** — new tests.
- `lib/hubspot/client.ts` **(modify)** — `uploadStatementFile`; thread optional args through `createDeal`/`createNote`.
- `app/contact/actions.ts` **(modify)** — validate + upload + pass results.
- `components/contact/quote-experience.tsx` **(modify)** — `name="statement"` + inline statement error.

---

## Task S1: Config + constants + pure logic + tests

**Files:**
- Modify: `next.config.ts`, `lib/hubspot/constants.ts`, `lib/hubspot/quote-form.ts`, `lib/hubspot/quote-form.test.ts`

**Interfaces:**
- Produces (consumed by S2–S4):
  - Constants: `DEALSTAGE_STATEMENT_REQUESTED`, `STATEMENT_FOLDER_PATH`, `STATEMENT_MIME`, `MAX_STATEMENT_BYTES`
  - `type StatementResult = { ok: true; file: File | null } | { ok: false; error: string }`
  - `validateStatementFile(file: File | null): StatementResult`
  - `buildDealPayload(d, contactId, hasStatement?: boolean)` — optional 3rd param
  - `buildNotePayload(d, dealId, isoTimestamp, attachmentId?: string)` — optional 4th param

- [ ] **Step 1: Raise the server-action body limit — `next.config.ts`**

Replace the file with:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Don't advertise the framework in response headers.
  poweredByHeader: false,
  // Gzip responses from the Node server.
  compress: true,
  // Merchant-statement PDF uploads travel through the quote server action;
  // the default 1MB body cap is too small. Raise to 10MB (matches MAX_STATEMENT_BYTES).
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
```

- [ ] **Step 2: Add constants — `lib/hubspot/constants.ts`**

Append these lines to the existing file (keep the current five exports):

```ts
export const DEALSTAGE_STATEMENT_REQUESTED = "qualifiedtobuy"; // "Statement Requested"
export const STATEMENT_FOLDER_PATH = "/quote-statements";
export const STATEMENT_MIME = "application/pdf";
export const MAX_STATEMENT_BYTES = 10 * 1024 * 1024; // 10 MB
```

- [ ] **Step 3: Write the failing tests — append to `lib/hubspot/quote-form.test.ts`**

Add `validateStatementFile` to the EXISTING `import { ... } from "@/lib/hubspot/quote-form"` at the top of the test file (do not add a second import line — that trips `no-duplicate-imports`). Then append the new describe blocks at the end of the file:

```ts
// Top import becomes, e.g.:
//   import { parseQuoteSubmission, buildContactProperties, buildDealPayload,
//     buildNotePayload, validateStatementFile, type QuoteInput } from "@/lib/hubspot/quote-form";

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
```

- [ ] **Step 4: Run the new tests to verify they fail**

Run: `npm test`
Expected: FAIL — `validateStatementFile` is not exported yet; the `buildDealPayload(..., true)` / attachment assertions fail because the params don't exist.

- [ ] **Step 5: Implement in `lib/hubspot/quote-form.ts`**

Update the constants import (add the four new names), add `validateStatementFile`, and extend the two builders. Specifically:

Change the top import to:

```ts
import { PIPELINE_ID, DEALSTAGE_NEW_PROSPECT, DEALSTAGE_STATEMENT_REQUESTED, DEAL_TO_CONTACT_ASSOC, NOTE_TO_DEAL_ASSOC, STATEMENT_MIME, MAX_STATEMENT_BYTES } from "@/lib/hubspot/constants";
```

Add this type + function (place after the `ParseResult` type / near the other exports):

```ts
export type StatementResult =
  | { ok: true; file: File | null }
  | { ok: false; error: string };

export function validateStatementFile(file: File | null): StatementResult {
  // No file, or an empty selection, means "no statement" — not an error.
  if (!file || file.size === 0 || !file.name) return { ok: true, file: null };
  const isPdf = file.type === STATEMENT_MIME || file.name.toLowerCase().endsWith(".pdf");
  if (!isPdf) return { ok: false, error: "Please upload a PDF file." };
  if (file.size > MAX_STATEMENT_BYTES) return { ok: false, error: "File is too large (max 10 MB)." };
  return { ok: true, file };
}
```

Replace `buildDealPayload` with (adds the optional `hasStatement` param + stage selection):

```ts
export function buildDealPayload(d: QuoteInput, contactId: string, hasStatement = false) {
  const properties: Record<string, string> = {
    dealname: `${d.businessName} — Quote Request`,
    pipeline: PIPELINE_ID,
    dealstage: hasStatement ? DEALSTAGE_STATEMENT_REQUESTED : DEALSTAGE_NEW_PROSPECT,
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
```

Replace `buildNotePayload` with (adds the optional `attachmentId` param):

```ts
export function buildNotePayload(d: QuoteInput, dealId: string, isoTimestamp: string, attachmentId?: string) {
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
  const properties: Record<string, string> = { hs_note_body: lines.join("<br>"), hs_timestamp: isoTimestamp };
  if (attachmentId) properties.hs_attachment_ids = attachmentId;
  return {
    properties,
    associations: [
      { to: { id: dealId }, types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: NOTE_TO_DEAL_ASSOC }] },
    ],
  };
}
```

- [ ] **Step 6: Run tests + typecheck**

Run: `npm test && npx tsc --noEmit`
Expected: all tests PASS (the pre-existing 10 plus the new ones), tsc clean. `client.ts`/`actions.ts` still compile because the new params are optional.

- [ ] **Step 7: Commit**

```bash
git add next.config.ts lib/hubspot/constants.ts lib/hubspot/quote-form.ts lib/hubspot/quote-form.test.ts
git commit -m "feat: statement validation + deal-stage/attachment builders"
```

---

## Task S2: HubSpot Files upload wrapper + thread args

**Files:**
- Modify: `lib/hubspot/client.ts`

**Interfaces:**
- Consumes: `HUBSPOT_BASE`, `STATEMENT_FOLDER_PATH` (constants); `buildDealPayload`/`buildNotePayload` optional params (S1).
- Produces (consumed by S3):
  - `uploadStatementFile(file: File): Promise<string>` — returns the HubSpot file id
  - `createDeal(d, contactId, hasStatement?: boolean): Promise<string>`
  - `createNote(d, dealId, isoTimestamp, attachmentId?: string): Promise<void>`

- [ ] **Step 1: Update `lib/hubspot/client.ts`**

Change the constants import to include `STATEMENT_FOLDER_PATH`:

```ts
import { HUBSPOT_BASE, STATEMENT_FOLDER_PATH } from "@/lib/hubspot/constants";
```

Add the upload wrapper (multipart — note it builds its own auth header WITHOUT `Content-Type`, so `fetch` sets the multipart boundary; do not reuse `authHeaders()` which forces JSON):

```ts
export async function uploadStatementFile(file: File): Promise<string> {
  const key = process.env.HUBSPOT_SERVICE_KEY;
  if (!key) throw new Error("HUBSPOT_SERVICE_KEY is not set");
  const form = new FormData();
  form.append("file", file, file.name);
  form.append("folderPath", STATEMENT_FOLDER_PATH);
  form.append("options", JSON.stringify({ access: "PRIVATE" }));
  const res = await fetch(`${HUBSPOT_BASE}/files/v3/files`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}` },
    body: form,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HubSpot file upload failed: ${res.status} ${text}`);
  }
  const json = await res.json();
  if (!json?.id) throw new Error(`HubSpot file upload returned no id: ${JSON.stringify(json)}`);
  return json.id as string;
}
```

Replace `createDeal` and `createNote` to forward the new optional args:

```ts
export async function createDeal(d: QuoteInput, contactId: string, hasStatement = false): Promise<string> {
  const json = await hsPost("/crm/v3/objects/deals", buildDealPayload(d, contactId, hasStatement));
  if (!json?.id) throw new Error(`HubSpot deal create returned no id: ${JSON.stringify(json)}`);
  return json.id;
}

export async function createNote(d: QuoteInput, dealId: string, isoTimestamp: string, attachmentId?: string): Promise<void> {
  await hsPost("/crm/v3/objects/notes", buildNotePayload(d, dealId, isoTimestamp, attachmentId));
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors. (`actions.ts` still calls `createDeal(d, contactId)` / `createNote(d, dealId, iso)` — valid since the new args are optional.)

- [ ] **Step 3: Commit**

```bash
git add lib/hubspot/client.ts
git commit -m "feat: add HubSpot Files upload wrapper; thread statement args"
```

---

## Task S3: Server-action orchestration

**Files:**
- Modify: `app/contact/actions.ts`

**Interfaces:**
- Consumes: `validateStatementFile` (S1); `uploadStatementFile`, `createDeal`, `createNote` (S2).

**Key ordering decision:** validate the statement file BEFORE Turnstile verification (co-located with field validation). A bad file is a user error; validating it before the Turnstile check means we don't consume the single-use token on a file error — consistent with how field-validation errors behave (and with the widget's reset-only-on-non-field-error logic).

- [ ] **Step 1: Update `app/contact/actions.ts`**

Change the imports:

```ts
import { parseQuoteSubmission, validateStatementFile } from "@/lib/hubspot/quote-form";
import { upsertContactByEmail, createDeal, createNote, uploadStatementFile } from "@/lib/hubspot/client";
```

Insert statement validation immediately after the field-validation block (after the `if (!parsed.ok) { ... }` that returns field errors, before the Turnstile section):

```ts
  // Validate the optional statement BEFORE Turnstile so a bad file doesn't burn the token.
  const rawFile = formData.get("statement");
  const statement = validateStatementFile(rawFile instanceof File ? rawFile : null);
  if (!statement.ok) {
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors: { statement: statement.error } };
  }
```

Replace the final write `try { ... }` block with one that uploads the statement (degrading gracefully on upload failure) and passes the results into the deal/note calls:

```ts
  try {
    const contactId = await upsertContactByEmail(parsed.data);

    let fileId: string | null = null;
    if (statement.file) {
      try {
        fileId = await uploadStatementFile(statement.file);
      } catch (err) {
        // Don't lose the lead over a file-storage hiccup: keep going without the attachment.
        console.error("[submitQuote] statement upload failed:", err);
        fileId = null;
      }
    }

    const dealId = await createDeal(parsed.data, contactId, fileId != null);
    await createNote(parsed.data, dealId, new Date().toISOString(), fileId ?? undefined);
    return { status: "success" };
  } catch (err) {
    console.error("[submitQuote] HubSpot write failed:", err);
    return { status: "error", message: GENERIC_ERROR };
  }
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/contact/actions.ts
git commit -m "feat: upload statement + advance deal stage in submitQuote"
```

---

## Task S4: Form UI — submit the file + show its error

**Files:**
- Modify: `components/contact/quote-experience.tsx`

- [ ] **Step 1: Give the file input a name and update the comment**

In `components/contact/quote-experience.tsx`, change the comment on the file-upload block from `{/* File upload (visual only for now — not submitted) */}` to `{/* File upload — submitted as "statement" */}`, and add `name="statement"` to the `<input type="file" ... >`:

```tsx
                  <input
                    type="file"
                    name="statement"
                    accept="application/pdf,.pdf"
                    className="sr-only"
                    onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
                  />
```

- [ ] **Step 2: Render the statement error inline**

Inside the file-upload `<div className="flex flex-col gap-1.5">`, immediately AFTER the closing `</label>` of the dashed drop-zone (and before that div closes), add:

```tsx
                {fieldErrors?.statement && (
                  <span className="text-xs text-brick-500">{fieldErrors.statement}</span>
                )}
```

- [ ] **Step 3: Typecheck, lint, build**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: no type errors; lint shows only the pre-existing `no-explicit-any` warnings (none new in this file); build succeeds.

- [ ] **Step 4: Commit**

```bash
git add components/contact/quote-experience.tsx
git commit -m "feat: submit merchant statement + surface upload validation error"
```

---

## Task S5: Live verification (controller-run)

No code. Confirms the statement path against the live portal. Needs `.env.local` populated (already done) and the dev server.

- [ ] **Step 1: API smoke test** — upload a small real PDF via `POST /files/v3/files` (PRIVATE, `/quote-statements`), create a test deal in `qualifiedtobuy`, create a note with `hs_attachment_ids` = the file id associated to the deal, then GET the deal to confirm stage + the note's attachment. Delete the test note, deal, contact, and file afterward.

- [ ] **Step 2: Browser test** — at `http://localhost:3000/contact`, submit with a PDF attached; confirm success, then in HubSpot the Deal is in **Statement Requested** with the statement attached to its Note. Also submit once WITHOUT a file to confirm it still lands in **New Prospect**. Clean up test records.

---

## Self-Review notes

- **Spec coverage:** body limit (S1 next.config), constants (S1), `validateStatementFile` type/size rules (S1 + tests), stage selection (S1 `buildDealPayload` + tests), attachment via note (S1 `buildNotePayload` + tests), Files upload PRIVATE/folder (S2 `uploadStatementFile`), graceful-degrade on upload failure (S3), validate-before-Turnstile token safety (S3), form submits file + inline error (S4), live verification incl. no-file case (S5). All spec sections map to a task.
- **Type consistency:** `StatementResult`, `validateStatementFile`, and the optional params `hasStatement?`/`attachmentId?` are declared in S1 and consumed with matching names/types in S2 (client) and S3 (action). `fieldErrors.statement` key set in S3 is read in S4.
- **Backward compatibility:** every task ends `tsc`-clean because new params are optional with defaults; S1→S2→S3 progressively adopt them.
- **No placeholders:** every step has concrete code/commands and expected output.
