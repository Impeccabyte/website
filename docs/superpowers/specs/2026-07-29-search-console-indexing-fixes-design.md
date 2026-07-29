# Search Console indexing fixes — design

**Date:** 2026-07-29
**Status:** Approved design, pending implementation plan

## Problem

Google Search Console reports 29 URLs as crawled/discovered but not indexed. Investigation
showed these are four unrelated problems, only two of which are defects in this repo.

### Diagnosis (measured 2026-07-29)

Bucket totals across the 29 reported URLs: **20** on `www.impeccabyte.com` (12 mapped to
redirect rules, 1 handled by the host catch-all, 7 retired), **6** on `app.impeccabyte.com`,
**3** on the apex.

**`www.impeccabyte.com` — 20 URLs.** `www` does not resolve to Railway. It resolves to
`192.64.119.103`, which `whois` identifies as Namecheap's URL-forwarding service. Behaviour:

| Request | Observed result |
| --- | --- |
| `https://www.impeccabyte.com/<any path>` | connection timeout (forwarder serves no TLS cert) |
| `http://www.impeccabyte.com/about/` | `301 → https://impeccabyte.com/` — **path discarded** |
| `http://www.impeccabyte.com/payments/industry/ecommerce/` | `301 → https://impeccabyte.com/` |
| `http://www.impeccabyte.com/business/services/registered-agent/` | `301 → https://impeccabyte.com/` |

Googlebot requests the `https://` form, times out, and parks the URL as crawled-not-indexed
indefinitely. Every legacy path from the previous site is affected, and even the HTTP path
flattens all of them onto the apex homepage, so no link equity reaches a relevant page.

**No `redirects()` rule in this repo can affect these URLs** — the requests never reach
Railway. DNS must change first.

**`app.impeccabyte.com` — 6 URLs.** `dig` returns NXDOMAIN. Decommissioned merchant portal
(JS chunks, favicon, `/login`). Not fixable and not worth fixing; these age out of the index
on their own.

**Apex assets — 2 URLs.** `/manifest.webmanifest` and `/_next/static/media/*.woff2` return
200. "Crawled, currently not indexed" is the *correct* outcome for non-HTML assets. Reporting
noise, not a defect.

**Apex duplicate — 1 URL.** `/?ref=ry.php` returns 200 and is a duplicate of the homepage.
This one is a real repo defect: the live homepage emits **no `<link rel="canonical">` at
all**. 11 of 18 routes omit `alternates.canonical`, violating the standing local-SEO
checklist requirement that every page carry a self-referencing canonical. See section 4 for
the verified list.

## Decisions taken

1. **DNS will change** so `www` terminates at Railway. This makes the 20-URL bucket fixable
   in code and is the highest-leverage item.
2. **Retired business-formation URLs return 410 Gone**, not 301. The site no longer offers
   these services at all — the only "registered agent" on the current site refers to being a
   registered agent *of Maverick Payments*, an unrelated meaning. A topically irrelevant 301
   is commonly reclassified by Google as a soft-404, which moves the problem to a different
   GSC report rather than solving it.
3. **`/merchant-services/industry/` gets a real `/industries` hub page** rather than a
   homepage redirect. The six `/industries/[key]` pages currently have no parent route, which
   is an existing internal-linking and sitemap gap independent of this work.

## Next.js 16 constraints (verified against `node_modules/next/dist/docs/`)

- `middleware.ts` is **deprecated and renamed to `proxy.ts`**
  (`01-app/03-api-reference/03-file-conventions/proxy.md:11`). The exported function must be
  named `proxy` or be the default export.
- `redirects()` supports `has: [{ type: 'host', value: … }]`
  (`01-app/03-api-reference/05-config/01-next-config-js/redirects.md:210-222`), so the
  host-based www→apex redirect needs no proxy file.
- `permanent: true` emits **308**, not 301. Google treats 308 and 301 identically for
  canonicalisation and equity transfer.
- Redirects are evaluated in array order and are checked before the filesystem.

## Design

### 1. Infrastructure (owner action — gates everything else)

1. Railway → frontend service → add custom domain `www.impeccabyte.com`.
2. Namecheap DNS → delete the `www` A record `192.64.119.103` (URL-forwarding host) → add
   `CNAME www → rsdmvxu9.up.railway.app`.
3. Wait for certificate issuance. Confirm `https://www.impeccabyte.com/` no longer times out.
4. Google Search Console: ensure the property is a **Domain** property (covers apex + www +
   subdomains). Delete the dead `app.impeccabyte.com` property.

Until step 2 lands, sections 2 and 3 below are inert for the 20 legacy URLs. Everything in
sections 4 and 5 takes effect on deploy regardless.

### 2. Redirect map — `lib/seo/redirects.ts` → `next.config.ts`

The map lives in a tested lib module, matching the existing `lib/seo/*` + `lib/seo/*.test.ts`
pattern. `next.config.ts` imports it and returns it from `redirects()`.

Legacy-path rules are listed **before** the www catch-all, and their destinations are
**absolute apex URLs**, so a legacy www hit resolves in a single hop rather than
www→apex→final.

| Legacy source | Destination | Rationale |
| --- | --- | --- |
| `/homepage/about` | `https://impeccabyte.com/about` | direct equivalent |
| `/payments/industry/ecommerce` | `https://impeccabyte.com/industries/ecommerce` | direct equivalent |
| `/payments/industry/specialty-markets` | `https://impeccabyte.com/industries/highrisk` | "specialty markets" is the high-risk euphemism |
| `/payments/industry/trade-services` | `https://impeccabyte.com/industries/services` | direct equivalent |
| `/payments/small-business` | `https://impeccabyte.com/pricing` | SMB pricing intent |
| `/merchant-services/small-business` | `https://impeccabyte.com/pricing` | same intent |
| `/topic/payment-gateway` | `https://impeccabyte.com/products/online` | gateway = online payments |
| `/merchant-services/enterprise` | `https://impeccabyte.com/products/api` | enterprise = API/integration |
| `/merchant-services/industry` | `https://impeccabyte.com/industries` | new hub, section 3 |
| `/merchant-services/surcharge-and-dual-pricing-programs` | `https://impeccabyte.com/surcharge` | direct equivalent |
| `/how-to-choose-the-best-payment-gateway-in-5-minutes-austin-business-owners-guide` | `https://impeccabyte.com/products/online` | topical match |
| `/are-traditional-merchant-services-dead-do-businesses-still-need-payment-gateways` | `https://impeccabyte.com/products/online` | topical match |

Followed by the host catch-all:

```
{ source: '/:path*',
  has: [{ type: 'host', value: 'www.impeccabyte.com' }],
  destination: 'https://impeccabyte.com/:path*',
  permanent: true }
```

All entries are `permanent: true`.

**`www/about/` gets no rule of its own.** `/about` is a live apex route, so a rule mapping
`/about` → `https://impeccabyte.com/about` would also match on the apex and loop forever. The
host catch-all already sends `www/about` to the identical apex path, which is the correct
outcome. Same reasoning applies to any future legacy path that collides with a live route.

**Trailing slashes — measured, not assumed.** Every legacy URL in the GSC export ends in `/`;
this project uses the Next default `trailingSlash: false`. Verified against a real build on
2026-07-29: Next's normalizer runs **before** `redirects()`, so `/x` resolves in one hop and
`/x/` takes two (normalize, then the rule). Explicit `/source/` rules cannot help — the slash
is stripped before the redirect table is reached, making such rules dead code.

Two hops is accepted. Googlebot follows up to 10 redirects and passes equity through the
chain; the only route to one hop is `skipTrailingSlashRedirect: true`, which disables
normalization sitewide and would let `/about` and `/about/` both render — a duplicate-content
regression strictly worse than one extra hop on URLs being deindexed anyway.

**Scope boundary.** Only the URLs Google actually reported are mapped. No blanket
`/payments/:path*` or `/merchant-services/:path*` tail rules — a catch-all to the homepage
recreates the soft-404 problem that decision 2 exists to avoid. Unreported legacy stragglers
404, which is the correct signal.

### 3. 410 Gone — `app/business/[[...slug]]/route.ts`

An optional catch-all route handler returning `410` with a short HTML body. Covers `/business`
and all six `/business/services/*` URLs, plus any unreported path in that retired section.

Chosen over `proxy.ts` deliberately: no per-request cost on every other route, no
matcher-regex footgun, colocated with the segment it retires, and it avoids adopting the
renamed proxy convention for six static paths.

`/business/*` is intentionally absent from the section 2 redirect map, so a www request to a
retired path takes two hops — the host catch-all 308s it to the apex, then the handler
returns 410. That is correct behaviour: the final status Google records is 410, and the extra
hop costs nothing on URLs that are being removed from the index anyway.

Affected URLs: `/business/`, `/business/services/articles-of-amendment/`,
`/business/services/business-license-verification/`, `/business/services/trademark-registration/`,
`/business/services/annual-report/`, `/business/services/registered-agent/`,
`/business/services/foreign-qualification/`.

### 4. Canonicals

Corrected during planning (2026-07-29): the original count of 14 was wrong. Grepping
`alternates` under `app/` alone missed that `/privacy`, `/terms`, and `/cookies` receive
canonicals from the shared `legalMetadata()` helper in `components/site/legal-page.tsx:69`,
and `app/tools/analyze/page.tsx:7` already sets `robots: { index: false, follow: false }`.
Confirmed by curling the live site. **11 routes** actually need the fix:

`/`, `/about`, `/partnerships`, `/pricing`, `/surcharge`, `/cash-discount`, `/benefits/travel`,
`/contact`, `/chamber`, `/products/[key]`, `/industries/[key]`.

Add `alternates: { canonical: "/…" }` — relative, resolved against the existing
`metadataBase` in `app/layout.tsx:37`. Dynamic routes derive the canonical from the resolved
key, matching the existing `cityCanonical(c.slug)` pattern in
`app/locations/[city]/page.tsx:32`.

`app/page.tsx` has no `export const metadata` block at all — it inherits title and description
from the root layout. It gets a minimal block containing only `alternates`, so the layout's
`title.default` and description continue to apply unchanged.

No change to `app/tools/analyze/page.tsx` or the legal pages.

This is what fixes `/?ref=ry.php`.

### 5. `/industries` hub page — `app/industries/page.tsx`

A parent for the six `SOLUTIONS` entries in `solutionNavOrder`, modelled on the existing
`app/locations/page.tsx` hub. Must meet the standing local-SEO publish checklist:

- Unique server-rendered title + meta description (≤155 chars) + self-referencing canonical.
  Title must **not** end in `| Impeccabyte` — the root layout template already appends
  `· Impeccabyte`.
- OG/Twitter tags via the existing `ogImages()` helper.
- Server-rendered JSON-LD: a `BreadcrumbList`, and a `FAQPage` with 4–6 hub-specific Q&As.
  No new `LocalBusiness`/`FinancialService` node — reference the single Austin entity by
  `@id` (`https://impeccabyte.com/#organization`) only.
- Added to `sitemapPaths()` in `lib/seo/sitemap.ts`.
- Internal linking: cards to all six `/industries/[key]` pages; linked from nav and footer
  where the existing Industries dropdown lives, so it is not an orphan.
- Body copy is genuinely hub-specific — a positioning intro plus per-industry summaries. Any
  section that cannot be written truthfully gets a labelled `⚠️ WRITE:` placeholder rather
  than filler.

`agents` stays excluded from the hub grid, consistent with `solutionNavOrder` (it is reachable
via Partnerships).

### 6. Verification

**Unit (vitest, `lib/seo/redirects.test.ts`):**
- No duplicate `source` values.
- No `source` that also appears as a destination path, after stripping the `SITE_URL` prefix
  (loop check).
- Every destination, after stripping the `SITE_URL` prefix, is a path present in
  `sitemapPaths()`.
- The module also exports `GONE_PREFIX = "/business"`; the test asserts that each of the 20
  legacy paths from the GSC export either matches exactly one `source` or starts with
  `GONE_PREFIX` — never both, never neither. This keeps the export list itself checked in as
  a fixture so a future edit cannot silently drop a URL.

**Build gate:** `npm run build && npm run lint && npm run test` all clean.

**Post-deploy (after DNS cutover):** a curl matrix over all 29 CSV URLs asserting each returns
its intended status and final destination (one hop unslashed, two slashed). Then use GSC
"Validate Fix" on the affected report.

## Explicitly out of scope

- `X-Robots-Tag: noindex` on `/manifest.webmanifest` and `_next/static` fonts. Non-HTML assets
  are supposed to be crawled-not-indexed; this is reporting noise, and suppressing it adds
  header config for no ranking benefit.
- Anything for `app.impeccabyte.com`. NXDOMAIN; the URLs age out. Deleting the stale GSC
  property is an owner action already listed in section 1.
- Rebuilding the two retired blog posts or any business-formation content.
- Owner-side local SEO work the code layer cannot do: Google Business Profile verification,
  review velocity, NAP-consistent citations, local backlinks.

## Risks

- **DNS cutover is the single point of failure.** If step 2 is done incorrectly the apex site
  is unaffected (apex is a separate record), but www stays broken and sections 2–3 remain
  inert. Verify with `dig` and `curl -I` before declaring done.
- **Trailing-slash matching is unverified.** Flagged in section 2 as a required check.
- **Importing `lib/seo/redirects.ts` from `next.config.ts`** may not resolve the `@/` path
  alias, since the config is loaded by Next's own TS loader rather than the app's tsconfig
  paths. Use a relative import and verify the build.
- **Recovery is not instant.** Google recrawls at its own cadence; expect weeks, not days,
  for the 20 legacy URLs to resolve in GSC even after a correct fix.
