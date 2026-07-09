# Quote Form → HubSpot Integration — Design

**Date:** 2026-07-09
**Status:** Approved (design)
**Owner:** Ry Bealey

## Goal

Wire the "Request your quote" form at `/contact` to HubSpot so each submission
creates/updates a **Contact** and opens an associated **Deal** in the
Merchant Services pipeline. The form's existing custom UI is kept; submission
happens server-side.

## Context (current state)

- **Form:** [components/contact/quote-experience.tsx](../../../components/contact/quote-experience.tsx)
  is a custom `"use client"` component. Its submit handler currently only does
  `e.preventDefault(); setSubmitted(true)` — nothing is sent anywhere. The
  optional merchant-statement PDF is tracked by filename only.
- **Existing HubSpot:** only the live-chat/tracking loader in
  [app/layout.tsx](../../../app/layout.tsx) (portal `246692701`, region `na2`).
  No forms, API keys, or env vars.
- **Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4. No
  form/validation libraries.
- **HubSpot account:** free tier, region na2, USD, timezone America/Chicago.
  One pipeline: **Merchant Services** (`default`). Free tier supports custom
  properties, deals, associations, notes, and the CRM API — everything this
  design needs. (Free caps accounts at one pipeline, which is fine.)

## Decisions

- **Contact + Deal** created per submission (not contact-only).
- **Keep the custom form UI**; submit via a Next.js **server action**.
- **Drop the PDF for now** — collect the other fields; add file handling later.
- **Credential:** HubSpot **Service Key** (not a legacy private app). Service
  Keys are HubSpot's recommended path for system-to-system integrations; their
  only limitation vs. legacy private apps is no webhook support, which this
  outbound-only integration does not need. Used identically —
  `Authorization: Bearer <key>` on the v3 REST API.
- **Attribute placement:** business identity on the Contact; opportunity
  qualifiers on the Deal (accurate historical snapshot per request).

## Architecture

Keep `quote-experience.tsx`'s UI. Add a server action
`app/contact/actions.ts` that runs server-side and calls HubSpot's v3 REST API
with `fetch`. No new dependencies.

- Service Key stored in `.env` as **`HUBSPOT_SERVICE_KEY`** — **server-only**,
  never `NEXT_PUBLIC`.
- The client component calls the server action on submit and renders success
  or a new error state based on the result.

**Tradeoff (accepted):** because we write to the CRM directly rather than
posting to HubSpot's Forms API, these submissions will **not** appear in
HubSpot's "Forms" analytics tool. Leads/deals land directly in the CRM, which
is the right outcome for a quote pipeline.

## HubSpot prerequisites (one-time, manual in HubSpot UI)

1. **Create a Service Key:** Settings → Integrations → Service Keys (or
   Development → Keys → Service Keys). Name it e.g. `impeccabyte-website`.
   Scopes: `crm.objects.contacts.write`, `crm.objects.contacts.read`,
   `crm.objects.deals.write`, `crm.objects.deals.read`,
   `crm.schemas.deals.write`. Copy the key into `.env` as `HUBSPOT_SERVICE_KEY`.
2. **Create two custom Deal properties** (done during implementation, via the
   connector or the UI):
   - `monthly_processing_volume` — dropdown (enumeration), options matching the
     form's `VOLUME_OPTIONS` buckets (0–25k / 25k–100k / 100k–500k / 500k+).
   - `current_processor` — single-line text.
3. **Create a Cloudflare Turnstile widget:** free Cloudflare account →
   Turnstile → add a site (domain `impeccabyte.com`; the site does not need to
   be hosted on Cloudflare). Copy the **site key** into `.env` as
   `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (public/client-safe) and the **secret key**
   as `TURNSTILE_SECRET_KEY` (server-only).

## Field mapping

| Form field | HubSpot object · property | Type | Notes |
|---|---|---|---|
| Email | Contact · `email` | standard | identity key for upsert |
| Phone | Contact · `phone` | standard | optional |
| Business name | Contact · `company` **and** Deal · `dealname` | standard | dealname = `"{business name} — Quote Request"` |
| Industry | Contact · `industry` | standard (string) | write the human label |
| Monthly volume | Deal · `monthly_processing_volume` | **new** enum | one of 4 buckets |
| Current processor | Deal · `current_processor` | **new** text | optional |
| Merchant statement PDF | — | — | dropped for now |

## Data flow (one submission)

1. Client calls the server action with the text fields (PDF ignored) plus the
   Turnstile token. Server **verifies the Turnstile token** and checks the
   honeypot first; on either failure, stop and return an error (write nothing).
2. **Upsert Contact by email:**
   `POST /crm/v3/objects/contacts/batch/upsert` with `idProperty=email`,
   setting `email`, `phone`, `company`, `industry`.
3. **Create Deal:** `POST /crm/v3/objects/deals` with `dealname`,
   `pipeline=default`, `dealstage=3963348702` (New Prospect),
   `monthly_processing_volume`, `current_processor`, **associated to the
   contact** in the same request (default contact↔deal association).
4. **Attach a Note** to the Deal (`POST /crm/v3/objects/notes` with an
   association to the deal) summarizing the full submission: business name,
   industry, monthly volume, current processor, email, phone, and a timestamp.
5. Return success → existing "Your request is in." screen. On failure → new
   inline error state.

Deal stage constant: New Prospect = `3963348702`. Pipeline = `default`
("Merchant Services").

## Error handling & spam

- **Server-side validation** mirroring the HTML5 rules: required = business
  name, industry, monthly volume, email; validate email format. Reject with a
  field-level or general error if invalid.
- **Cloudflare Turnstile** (primary bot defense): the form renders the
  Turnstile widget (managed/invisible mode) and passes its token to the server
  action. Before touching HubSpot, the server verifies the token via
  `POST https://challenges.cloudflare.com/turnstile/v0/siteverify` with
  `TURNSTILE_SECRET_KEY`. On failure → reject with a general error, write
  nothing.
- **Honeypot** hidden field (kept as a cheap complementary layer): if filled,
  silently accept (return success) but do not write to HubSpot — catches naive
  bots before verification even matters.
- **HubSpot API failure:** log server-side with the response body; show the
  user a friendly "couldn't submit — try again or email us" state. Never lose a
  lead silently. If the Contact upsert succeeds but the Deal create fails, log
  loudly (contact exists, deal missing) so it can be reconciled.

## Testing

- **Unit:** field-mapping and validation as pure functions (form input →
  HubSpot payloads; honeypot rejection; email validation).
- **Integration:** the server action with `fetch` mocked, asserting Turnstile
  verification is called and gates the flow (fail = no HubSpot calls), plus the
  contact-upsert payload, the deal payload (pipeline/stage/props/association),
  and the note payload.
- **Manual:** submit once against the live account; confirm a Contact and an
  associated Deal appear in **New Prospect** with the Note attached.

## Out of scope (future)

- PDF/merchant-statement upload → HubSpot Files, and advancing the deal to
  "Statement Requested" when a statement is attached.
- Surfacing submissions in HubSpot's Forms analytics.
- Marketing-attribution via the HubSpot tracking cookie (`hutk`).
