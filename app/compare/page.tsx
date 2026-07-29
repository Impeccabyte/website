import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { ComparisonExperience } from "@/components/compare/comparison-experience";
import { ComparisonClosing } from "@/components/compare/comparison-closing";

export const metadata: Metadata = {
  title: "Compare us — the honest comparison",
  description:
    "Impeccabyte vs. Square, Shopify, and Toast. They're payment facilitators; we get you your own merchant account on TSYS or First Data Nashville rails.",
  alternates: { canonical: "/compare" },
};

export default function ComparePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Compare", path: "/compare" },
        ])}
      />

      <ComparisonExperience initial="square" variant="hub" />
      <ComparisonClosing />
    </>
  );
}
