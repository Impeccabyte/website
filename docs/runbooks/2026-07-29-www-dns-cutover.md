# www DNS cutover — impeccabyte.com

**Why:** `www.impeccabyte.com` resolves to `192.64.119.103` (Namecheap URL-forwarding).
It serves no TLS certificate, so `https://www.impeccabyte.com/...` times out, and Googlebot
has parked 20 legacy URLs as crawled-not-indexed. Over plain HTTP the forwarder also
discards the path, flattening every legacy URL onto the apex homepage.

Until this cutover lands, the redirect map in `lib/seo/redirects.ts` cannot fire for www.

**Verify the problem before changing anything:**

    dig +short www.impeccabyte.com A          # expect 192.64.119.103
    curl -I --max-time 10 https://www.impeccabyte.com/   # expect a timeout
    curl -sI http://www.impeccabyte.com/about/ | head -3 # expect 301 -> apex, path dropped

**Steps:**

1. Railway → the frontend service → Settings → Networking → add custom domain
   `www.impeccabyte.com`. Copy the CNAME target Railway shows.
2. Namecheap → Domain List → impeccabyte.com → Advanced DNS.
   - Delete the `www` **URL Redirect** record (and any `www` A record pointing at
     `192.64.119.103`).
   - Add: Type `CNAME`, Host `www`, Value `<the Railway target>`, TTL Automatic.
   - Leave the apex record alone — it already points at Railway and is serving fine.
3. Wait for propagation and certificate issuance (typically minutes, up to an hour).

**Verify the fix:**

    dig +short www.impeccabyte.com
    curl -sI https://www.impeccabyte.com/ | head -3         # expect 308 -> https://impeccabyte.com/
    SEO_CHECK_BASE_URL=https://impeccabyte.com npx vitest run lib/seo/live-check.test.ts
    # Expect every case to pass. A green run confirms all 20 reported www URLs now
    # resolve correctly (redirect or 410) and every sitemap page's canonical is correct.

**Then, in Google Search Console:**

1. Confirm the property is a **Domain** property (covers apex, www, and subdomains).
   If it is a URL-prefix property for the apex only, add one for www so the redirects
   are recrawled.
2. Delete the `app.impeccabyte.com` property — that hostname is NXDOMAIN and its 6
   reported URLs cannot be fixed or validated.
3. Open the "Crawled - currently not indexed" report and click **Validate Fix**.

**Expected timeline:** recrawling is on Google's schedule. Expect weeks, not days, for the
20 legacy URLs to clear. Re-run the live-check suite if the report still shows failures —
it distinguishes "our fix is broken" from "Google hasn't recrawled yet".

**Rollback:** re-add the Namecheap `www` URL-redirect record. The apex is a separate
record and is unaffected by anything in this runbook.
