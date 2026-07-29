import { goneResponse } from "@/lib/seo/gone-response";

/**
 * Tombstone for the previous WordPress site's author archives.
 *
 * The blog and its author taxonomy are gone, and no current page is a topical match.
 *
 * Optional catch-all so the bare prefix and everything beneath it are covered,
 * including paths Search Console has not reported.
 */
export function GET() {
  return goneResponse(
    "This address belonged to our previous website and is no longer in use."
  );
}
