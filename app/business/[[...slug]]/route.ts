import { goneResponse } from "@/lib/seo/gone-response";

/**
 * Tombstone for the retired business-formation section (/business/services/*).
 * Those services are no longer offered, and no current page is a topical match —
 * a 301 to the homepage would just be reclassified as a soft-404, so we return a
 * hard 410 and let Google drop the URLs. Optional catch-all so /business and every
 * path beneath it are covered, including ones Search Console hasn't reported —
 * which is how /business/services/dissolution/ was already handled when it first
 * showed up in a later export.
 */
export function GET() {
  return goneResponse(
    "Impeccabyte no longer offers business-formation services. We&rsquo;re a merchant services and payment processing company."
  );
}
