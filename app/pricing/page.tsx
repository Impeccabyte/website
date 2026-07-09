import type { Metadata } from "next";
import { Banknote, Plus, Check } from "lucide-react";
import { ogImages } from "@/lib/og/meta";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconChip } from "@/components/ui/icon-chip";
import { Accordion } from "@/components/ui/accordion";
import { CheckItem, SectionIntro } from "@/components/site/bits";
import { DarkCTA } from "@/components/site/dark-cta";
import { RateCalculator } from "@/components/pricing/rate-calculator";
import { pricingTiers, accountIncludes, faqItems } from "@/lib/data";

export const metadata: Metadata = {
  title: "Pricing — interchange-plus, nothing hidden",
  description:
    "Interchange-plus pricing with no bundled tiers and no padding. See the true cost of every card, plus our one clear rate — the same fair deal on every product.",
  ...ogImages("pricing", "Impeccabyte — transparent interchange-plus pricing"),
};

const EXPLAINER = [
  { icon: Banknote, tone: "ink" as const, title: "Interchange", body: "The card networks' true, published cost. We pass it straight through." },
  { icon: Plus, tone: "clay" as const, title: "Impeccabyte margin", body: "One clear margin over cost that steps down as your volume grows.", highlight: true },
  { icon: Check, tone: "sage" as const, title: "What you pay", body: "Cost plus markup. Nothing hidden, itemized on every statement." },
];

export default function PricingPage() {
  return (
    <>
      {/* Hero */}
      <section className="px-6 pt-16 pb-12">
        <Container width="narrow" className="text-center">
          <Eyebrow>Pricing</Eyebrow>
          <h1 className="mt-4 font-display font-semibold text-ink-900" style={{ fontSize: "clamp(38px,4.8vw,56px)", lineHeight: 1.05 }}>
            You pay cost.
            <br />
            <span className="em">Plus one honest markup.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-[560px] text-[18px] leading-relaxed text-ink-600">
            Interchange-plus pricing means no bundled tiers and no padding. You see the true cost of every
            card, plus our one clear rate — the same fair deal on every product.
          </p>
        </Container>
      </section>

      {/* Explainer */}
      <section className="px-6 py-20">
        <Container>
          <div className="grid gap-[18px] md:grid-cols-3">
            {EXPLAINER.map((e) => (
              <Card
                key={e.title}
                padding="lg"
                className={e.highlight ? "border-[1.5px] border-clay-300 text-center" : "text-center"}
              >
                <IconChip icon={e.icon} tone={e.tone} size={48} className="mx-auto" />
                <h3 className="mt-4 text-[19px] font-bold text-ink-900">{e.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-600">{e.body}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Volume tiers */}
      <section className="px-6 py-20">
        <Container>
          <SectionIntro eyebrow="Volume discounts" title="Your rate drops as you grow" width="640px">
            You always pay the networks' true interchange. Our margin on top steps down automatically as your
            monthly card volume climbs — no renegotiating, no new contract.
          </SectionIntro>
          <div className="mt-10 grid gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
            {pricingTiers.map((t) => (
              <Card
                key={t.name}
                padding="lg"
                elevation={t.popular ? "raised" : "sm"}
                className={t.popular ? "relative border-[1.5px] border-clay-300" : "relative"}
              >
                {t.popular && (
                  <Badge variant="brand" solid size="sm" className="absolute right-4 top-4">
                    Most popular
                  </Badge>
                )}
                <div className="text-[13px] font-bold uppercase tracking-wide text-ink-900">{t.name}</div>
                <div className="mt-1 text-[13px] text-ink-500">{t.range}</div>
                <div className="mt-5 font-display font-semibold text-ink-900" style={{ fontSize: 30, lineHeight: 1 }}>
                  {t.pct}
                  <span className="ml-1 text-[17px] text-ink-400">+ {t.fee}</span>
                </div>
                <div className="mt-1 text-[12px] text-ink-500">margin over interchange</div>
                <p className="mt-4 text-[14px] leading-relaxed text-ink-600">{t.blurb}</p>
              </Card>
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-[720px] text-center text-[13px] leading-snug text-ink-400">
            Margins shown are added to pass-through interchange. Final pricing depends on card mix, business
            type, and risk profile.
          </p>
        </Container>
      </section>

      {/* Calculator */}
      <section className="px-6 py-20">
        <Container>
          <RateCalculator />
        </Container>
      </section>

      {/* Every account includes */}
      <section className="px-6 py-20">
        <Container width="wide">
          <SectionIntro eyebrow="No fine print" title="Every account includes" />
          <div className="mx-auto mt-10 grid max-w-[820px] gap-x-8 gap-y-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {accountIncludes.map((item) => (
              <CheckItem key={item}>{item}</CheckItem>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-[640px] text-center text-[14px] leading-relaxed text-ink-500">
            A $100 monthly minimum applies — but it's covered by the processing fees you're already paying, not
            a separate charge, so most active businesses never notice it. It helps fund the product
            improvements we ship to every Impeccabyte client.
          </p>
        </Container>
      </section>

      {/* FAQ */}
      <section className="px-6 py-20">
        <Container width="narrow">
          <SectionIntro eyebrow="Questions" title="Answers, in plain English" />
          <div className="mt-10">
            <Accordion items={faqItems} defaultOpen={0} />
          </div>
        </Container>
      </section>

      <DarkCTA
        titleA="See your"
        titleEm="custom rate."
        body="The calculator is an estimate — get an exact interchange-plus quote built around your business."
        primary={{ label: "Get a Quote", href: "/contact" }}
        secondary={{ label: "Talk to us", href: "/contact" }}
      />
    </>
  );
}
