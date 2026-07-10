# Statement Analyzer tool — `/tools/analyze`

**Date:** 2026-07-10
**Status:** Approved

## Goal

Host the Impeccabyte Statement Analyzer (a merchant-statement diagnostic + proposal
tool) at `/tools/analyze`. It must be gated behind the password `BYTE` and must never
be indexed by search engines.

## Decisions

- **Password gate:** soft, client-side. An overlay checks the input against `"BYTE"`
  and unlocks via `sessionStorage`. `"BYTE"` ships in the client bundle — this keeps the
  tool out of casual/public sight, not a real auth wall. Combined with noindex, search
  engines won't surface it.
- **AI extraction:** routed through a Next.js server action using the official
  `@anthropic-ai/sdk`. The pasted component's direct browser `fetch` to `api.anthropic.com`
  (no key, insecure) is replaced. Requires `ANTHROPIC_API_KEY` in the environment.
- **noindex:** per-page `metadata.robots = { index: false, follow: false }`
  → `<meta name="robots" content="noindex, nofollow">`. Route is already excluded from
  the curated `app/sitemap.ts` allowlist. Site-wide `robots.txt` left untouched.

## Files

| File | Type | Purpose |
|---|---|---|
| `app/tools/analyze/page.tsx` | server | Exports noindex `metadata`; renders the gate. |
| `components/tools/statement-gate.tsx` | client | Password overlay → unlock → render analyzer. |
| `components/tools/statement-analyzer.tsx` | client | The pasted tool, adapted: `handleUpload` calls the server action instead of `fetch`. |
| `app/tools/analyze/actions.ts` | server | `extractStatement(formData)` → validate file → Claude → parsed `{merchant, month, volume, txns, items}`. |

## Extraction call

- Model `claude-opus-4-8`.
- PDF → `document` block; image → `image` block (base64, server-side).
- Structured outputs (`output_config.format`, JSON schema) for guaranteed-valid JSON.
- Adaptive thinking on; `max_tokens` ~8000.
- File validation: reuse `MAX_STATEMENT_BYTES` (10 MB); accept PDF + common image types.
- Client keeps its graceful fallback: on failure, prompt manual entry.

## Setup required

- `npm install @anthropic-ai/sdk`
- `ANTHROPIC_API_KEY` added to `.env.example`; set in `.env.local` for it to work.
