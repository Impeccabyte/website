import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { ComparisonExperience } from "@/components/compare/comparison-experience";
import { ComparisonClosing } from "@/components/compare/comparison-closing";
import { COMPETITORS, competitorOrder, isCompetitorSlug, type CompetitorSlug } from "@/lib/compare";

/** Per-competitor meta descriptions, 150–160 characters each. */
const DESCRIPTIONS: Record<CompetitorSlug, string> = {
  square:
    "Square is a payment facilitator; Impeccabyte gets you your own merchant account on TSYS or First Data Nashville rails. Compare pricing, holds, and payouts.",
  shopify:
    "Shopify Payments is an aggregated account, and a third-party gateway costs you penalty fees. Impeccabyte gets you your own merchant account — and cart freedom.",
  toast:
    "Toast bundles processing, multi-year terms, and hardware that bricks if you leave. Impeccabyte gets you your own merchant account and hardware you keep.",
};

export function generateStaticParams() {
  return competitorOrder.map((competitor) => ({ competitor }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ competitor: string }>;
}): Promise<Metadata> {
  const { competitor } = await params;
  // Resolve through the guard rather than narrowing `competitor` after a
  // never-returning call — this keeps the types honest without relying on
  // control-flow analysis of notFound().
  const c = isCompetitorSlug(competitor) ? COMPETITORS[competitor] : null;
  if (!c) return {};
  return {
    // No "| Impeccabyte" — app/layout.tsx already appends "· Impeccabyte".
    title: `Impeccabyte vs. ${c.name} — the honest comparison`,
    description: DESCRIPTIONS[c.slug],
    alternates: { canonical: `/compare/${c.slug}` },
  };
}

export default async function CompetitorPage({
  params,
}: {
  params: Promise<{ competitor: string }>;
}) {
  const { competitor } = await params;
  const c = isCompetitorSlug(competitor) ? COMPETITORS[competitor] : null;
  if (!c) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Compare", path: "/compare" },
          { name: `vs. ${c.name}`, path: `/compare/${c.slug}` },
        ])}
      />

      <ComparisonExperience initial={c.slug} variant="competitor" />
      <ComparisonClosing />
    </>
  );
}
