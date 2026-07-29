import { goneResponse } from "@/lib/seo/gone-response";

/**
 * Tombstone for the previous WordPress blog's topic archives.
 *
 * The blog is gone. /topic/payment-gateway keeps a redirect to /products/online — redirects are evaluated before the filesystem, so a matching rule wins over this catch-all — but every other topic archive has no equivalent.
 *
 * Optional catch-all so the bare prefix and everything beneath it are covered,
 * including paths Search Console has not reported.
 */
export function GET() {
  return goneResponse(
    "This address belonged to our previous website and is no longer in use."
  );
}
