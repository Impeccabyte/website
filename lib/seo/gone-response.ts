/**
 * Shared 410 Gone tombstone for retired sections of the old site.
 *
 * A hard 410 rather than a 301: these paths have no topical equivalent on the current
 * site, and Google commonly reclassifies an irrelevant redirect as a soft-404 — which
 * moves the problem to a different report instead of solving it. 410 says "permanently
 * gone" and gets the URL dropped.
 *
 * Consumed by the optional catch-all route handlers listed in GONE_PREFIXES
 * (lib/seo/redirects.ts). Keep those two in sync: a prefix without a handler silently
 * falls through to the normal 404 page.
 */
export function goneResponse(explanation: string): Response {
  const body = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>Page no longer available</title><meta name="robots" content="noindex"></head>
<body style="font-family:system-ui,sans-serif;max-width:32rem;margin:20vh auto;padding:0 1.5rem;line-height:1.6">
<h1 style="font-size:1.5rem">This page is no longer available</h1>
<p>${explanation}</p>
<p><a href="/">Go to the homepage</a> &middot; <a href="/contact">Talk to us about payments</a></p>
</body>
</html>`;

  return new Response(body, {
    status: 410,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "x-robots-tag": "noindex",
      "cache-control": "public, max-age=3600",
    },
  });
}
