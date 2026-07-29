import { goneResponse } from "@/lib/seo/gone-response";

/**
 * Tombstone for the previous WordPress site's admin area.
 *
 * It only ever existed on the old install, and it is one of the most probed paths on the internet — a cheap 410 beats rendering the full 404 page for that traffic.
 *
 * Optional catch-all so the bare prefix and everything beneath it are covered,
 * including paths Search Console has not reported.
 */
export function GET() {
  return goneResponse(
    "This address belonged to our previous website and is no longer in use."
  );
}
