import { llmsTxt } from "@/lib/seo/llms";

// Derived entirely from static site data — prerender it at build time.
export const dynamic = "force-static";

export function GET(): Response {
  return new Response(llmsTxt(), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
