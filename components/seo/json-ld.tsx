import { serializeJsonLd } from "@/lib/seo/schema";
import type { JsonLd } from "@/lib/seo/org";

/** Renders one or more schema.org nodes as a server-rendered ld+json script. */
export function JsonLd({ data }: { data: JsonLd | JsonLd[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
