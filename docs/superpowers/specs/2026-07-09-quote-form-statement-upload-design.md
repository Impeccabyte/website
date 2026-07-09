# Quote Form — Merchant-Statement Upload → HubSpot — Design

**Date:** 2026-07-09
**Status:** Approved (design)
**Owner:** Ry Bealey
**Builds on:** [2026-07-09-hubspot-quote-form-design.md](2026-07-09-hubspot-quote-form-design.md) (Contact + Deal + Note already shipped on branch `feat/hubspot-quote-form`)

## Goal

Handle the optional "recent merchant statement (PDF)" upload that the base
integration deliberately dropped. When a visitor attaches a PDF, store it as a
PRIVATE file in HubSpot, attach it to the Deal, and advance that Deal to the
"Statement Requested" stage.

## Context (current state)

- The file input in [components/contact/quote-experience.tsx](../../../components/contact/quote-experience.tsx)
  is visual-only: it has **no `name`**, so the selected file never reaches the
  server. A visitor can attach a statement and it silently vanishes.
- The base integration already: upserts a Contact by email, creates a Deal
  (`pipeline=default`, `dealstage=3963348702` New Prospect) associated to the
  contact, and creates a summary Note associated to the Deal.
- Pure logic + builders live in `lib/hubspot/quote-form.ts` (vitest-tested);
  network wrappers in `lib/hubspot/client.ts`; orchestration in
  `app/contact/actions.ts`; `next.config.ts` is minimal.
- HubSpot account: free tier, portal 246692701, region na2. Free tier includes
  the Files API, engagements/notes, and file attachments on notes.

## Decisions

- **Storage:** upload to HubSpot Files, `access: PRIVATE` (statements are
  sensitive), folder path `/quote-statements`.
- **Attachment:** surface the file on the Deal by adding its id to the summary
  Note's `hs_attachment_ids` (semicolon-separated) — reuses the Note we already
  create; no separate engagement.
- **Stage:** a successfully-attached statement lands the Deal in
  **"Statement Requested"** (`dealstage=qualifiedtobuy`); no statement (or a
  failed upload) leaves it in **"New Prospect"** (`3963348702`).
- **Validation:** enforce **`application/pdf`** type and **≤ 10 MB** size
  server-side (client `accept` is bypassable). Invalid → inline error, nothing
  written.
- **Body limit:** raise Next.js server-action `bodySizeLimit` to `10mb` (default
  is 1 MB).

## Prerequisite (one-time, HubSpot UI)

The Service Key created for the base integration must be granted the **`files`**
scope (the Files API returns `403 MISSING_SCOPES` without it — required granular
scopes: `files`). Edit the Service Key in Settings → Integrations → Service Keys,
add `files`, and save. No code or `.env` change needed. The base scopes
(`crm.objects.contacts.*`, `crm.objects.deals.*`, `crm.schemas.deals.write`)
remain.

## Architecture

Extend the existing three layers; no new files except tests already present.

- **`next.config.ts`** — add `experimental.serverActions.bodySizeLimit: "10mb"`.
- **`lib/hubspot/constants.ts`** — add `DEALSTAGE_STATEMENT_REQUESTED`
  (`"qualifiedtobuy"`), `STATEMENT_FOLDER_PATH` (`"/quote-statements"`),
  `MAX_STATEMENT_BYTES` (`10 * 1024 * 1024`), `STATEMENT_MIME` (`"application/pdf"`).
- **`lib/hubspot/quote-form.ts`** — add pure `validateStatementFile(file)`;
  extend `buildDealPayload` and `buildNotePayload` with **optional** parameters
  (backward-compatible so intermediate commits keep compiling).
- **`lib/hubspot/client.ts`** — add `uploadStatementFile(file)`; thread the new
  optional args through `createDeal`/`createNote`.
- **`app/contact/actions.ts`** — validate the file, upload if present, and pass
  the results into the Deal/Note calls.
- **`components/contact/quote-experience.tsx`** — give the file input
  `name="statement"` and render a statement-specific error.

## Interfaces (new/changed)

- `validateStatementFile(file: File | null): { ok: true; file: File | null } | { ok: false; error: string }`
  - `null`, or a `File` with `size === 0` / empty name → `{ ok: true, file: null }` (no statement).
  - wrong type → `{ ok: false, error: "Please upload a PDF file." }`.
  - `size > MAX_STATEMENT_BYTES` → `{ ok: false, error: "File is too large (max 10 MB)." }`.
  - otherwise → `{ ok: true, file }`.
- `buildDealPayload(d: QuoteInput, contactId: string, hasStatement?: boolean)` —
  `hasStatement === true` selects `DEALSTAGE_STATEMENT_REQUESTED`, else the
  existing New Prospect stage. Default `false` preserves current behavior.
- `buildNotePayload(d: QuoteInput, dealId: string, isoTimestamp: string, attachmentId?: string)` —
  when `attachmentId` is provided, add `hs_attachment_ids: attachmentId` to the
  note properties.
- `uploadStatementFile(file: File): Promise<string>` — POST multipart to
  `/files/v3/files` with `file`, `folderPath=STATEMENT_FOLDER_PATH`, and
  `options={"access":"PRIVATE"}`; returns the file id.
- `createDeal(d, contactId, hasStatement?)` and
  `createNote(d, dealId, isoTimestamp, attachmentId?)` — forward the new args.

## Data flow (one submission with a PDF)

1. Client submits the form (now including `statement`) + Turnstile token.
2. Honeypot + field validation + Turnstile verification (unchanged, all before
   any write).
3. `validateStatementFile(formData.get("statement"))`. Invalid →
   `{ status: "error", fieldErrors: { statement } }`, write nothing.
4. If a valid file is present: `uploadStatementFile(file)` → `fileId`.
   - On upload failure: log loudly, continue with `fileId = null` (lead is not
     lost; treated as "no statement").
5. `upsertContactByEmail` → `createDeal(data, contactId, hasStatement = fileId != null)`
   → `createNote(data, dealId, iso, fileId ?? undefined)`.
6. Return success → existing confirmation screen.

## Error handling

- File type/size failures are user errors → inline `fieldErrors.statement`
  message under the upload control; no HubSpot calls made.
- HubSpot Files upload failure is an infrastructure error → do **not** fail the
  whole submission; `console.error("[submitQuote] statement upload failed", err)`,
  proceed without the attachment, Deal stays in New Prospect.
- All existing failure paths (Turnstile, contact/deal/note writes) are unchanged.

## Testing

- **Unit (vitest):** `validateStatementFile` — null, empty (size 0), wrong type,
  oversize, valid; `buildDealPayload` stage selection for
  `hasStatement` true/false; `buildNotePayload` includes `hs_attachment_ids`
  only when `attachmentId` is passed. (`File` is a Node 20 global — available in
  the `node` test environment.)
- **No unit tests** for `uploadStatementFile` (network wrapper, consistent with
  the base integration's decision) — verified by `tsc` + the live smoke test.
- **Live smoke test:** POST a small real PDF through the Files API to the live
  portal, attach to a test deal via a note, confirm it appears + is downloadable,
  confirm the deal is in Statement Requested, then delete the test records.
- **Manual:** browser submission with a PDF → success; Deal in Statement
  Requested with the statement attached to its Note.

## Out of scope

- Multiple-file uploads (single statement only).
- Virus scanning / content inspection beyond MIME + size.
- Non-PDF statement formats.
