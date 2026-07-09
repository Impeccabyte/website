import type { Metadata } from "next";

/**
 * Metadata fragment that points Open Graph + Twitter at a pre-rendered static
 * share image under /public/og (see public/og/README.md). These are shipped as
 * static PNGs on purpose: it keeps `next/og` — which renders via WebAssembly
 * and is memory-hungry at build time — out of the build.
 */
export function ogImages(slug: string, alt: string): Metadata {
  const url = `/og/${slug}.png`;
  return {
    openGraph: { images: [{ url, width: 1200, height: 630, alt }] },
    twitter: { images: [{ url, alt }] },
  };
}
