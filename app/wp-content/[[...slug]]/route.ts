import { goneResponse } from "@/lib/seo/gone-response";

/**
 * Tombstone for the previous WordPress site's asset tree (/wp-content/themes/Divi/*).
 * Search Console reported four of these as 404s. They are theme asset directories that
 * only ever existed on the old install, so 410 is the accurate answer and gets them
 * dropped faster than a 404 would.
 *
 * Prefix-wide on purpose, for two reasons: the export surfaced both slashed and
 * unslashed variants of the same two directories, and /wp-content is a constant
 * automated-probe target — a cheap 410 beats rendering the full 404 page for that
 * traffic.
 */
export function GET() {
  return goneResponse(
    "This address belonged to our previous website and is no longer in use."
  );
}
