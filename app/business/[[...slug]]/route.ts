/**
 * Tombstone for the retired business-formation section (/business/services/*).
 * Those services are no longer offered, and no current page is a topical match —
 * a 301 to the homepage would just be reclassified as a soft-404, so we return a
 * hard 410 and let Google drop the URLs. Optional catch-all so /business and every
 * path beneath it are covered, including ones Search Console hasn't reported.
 */
const BODY = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>Page no longer available</title><meta name="robots" content="noindex"></head>
<body style="font-family:system-ui,sans-serif;max-width:32rem;margin:20vh auto;padding:0 1.5rem;line-height:1.6">
<h1 style="font-size:1.5rem">This page is no longer available</h1>
<p>Impeccabyte no longer offers business-formation services. We&rsquo;re a merchant services and payment processing company.</p>
<p><a href="/">Go to the homepage</a> &middot; <a href="/contact">Talk to us about payments</a></p>
</body>
</html>`;

export function GET() {
  return new Response(BODY, {
    status: 410,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "x-robots-tag": "noindex",
      "cache-control": "public, max-age=3600",
    },
  });
}
