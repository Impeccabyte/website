import type { Metadata } from "next";
import { Compass, Layers, ShieldCheck } from "lucide-react";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Card } from "@/components/ui/card";
import { IconChip } from "@/components/ui/icon-chip";
import { SectionIntro } from "@/components/site/bits";
import { SolutionCard } from "@/components/site/entry-card";
import { DarkCTA } from "@/components/site/dark-cta";
import { Accordion } from "@/components/ui/accordion";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schema";
import { solutionNavOrder } from "@/lib/data";
import { ogImages } from "@/lib/og/meta";

export const metadata: Metadata = {
  title: "Industries — payments shaped around how you sell",
  description:
    "Retail, food and drink, professional services, e-commerce, nonprofits, and high-risk — see how Impeccabyte fits the way your business actually takes payments.",
  alternates: { canonical: "/industries" },
  ...ogImages("home", "Impeccabyte — payments for every industry"),
};

/** Rendered on-page below; the same items feed the FAQPage schema so the two never drift. */
const FAQS = [
  {
    q: "Which industries does Impeccabyte serve?",
    a: "Retail and shops, food and drink, professional services, e-commerce, nonprofits, and high-risk merchants. Agents and ISOs work with us through our Partnerships program rather than a merchant account.",
  },
  {
    q: "Does my industry change what I pay?",
    a: "Every industry gets the same interchange-plus structure — the card networks' published cost, plus one clear margin that steps down as your volume grows. What changes by industry is underwriting and which products we recommend, not the shape of the pricing.",
  },
  {
    q: "What if my business is considered high-risk?",
    a: "We place harder-to-underwrite businesses through Maverick Payments, subject to approval, on the same transparent terms. Tell us your category up front and we'll tell you honestly whether we can board you.",
  },
  {
    q: "Can I take payments in person and online on one account?",
    a: "Yes. The same merchant account powers your counter, your website checkout, your payment links, and your invoices — one rate and one statement across all of them.",
  },
  {
    q: "How do I know which products fit my industry?",
    a: "Each industry page lists the products we most often recommend for that kind of business. If you'd rather skip the reading, send us a recent statement and we'll come back with a specific setup and an exact rate.",
  },
];

const APPROACH = [
  {
    icon: Compass,
    tone: "clay" as const,
    title: "We start with how you sell",
    body: "A food truck and a subscription box need different hardware, different funding speed, and different underwriting. We fit the account to the business, not the other way around.",
  },
  {
    icon: Layers,
    tone: "amber" as const,
    title: "One account, every channel",
    body: "Counter, checkout, invoice, and recurring billing all run on the same merchant account — so you get one rate, one statement, and one place to call.",
  },
  {
    icon: ShieldCheck,
    tone: "sage" as const,
    title: "Straight answers on approval",
    body: "If your category is hard to board, we say so early and tell you what it takes. No surprise holds after you've already switched.",
  },
];

export default function IndustriesHubPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Industries", path: "/industries" },
          ]),
          faqSchema(FAQS),
        ]}
      />

      {/* Hero */}
      <section
        className="border-b border-border-subtle"
        style={{ background: "radial-gradient(90% 120% at 50% -30%, var(--amber-50), var(--paper) 62%)" }}
      >
        <Container width="wide" className="py-16 text-center sm:pt-[72px] sm:pb-12">
          <Eyebrow>Industries</Eyebrow>
          <h1
            className="mt-3.5 font-display font-semibold text-ink-900"
            style={{ fontSize: "clamp(36px, 4.8vw, 56px)", lineHeight: 1.04 }}
          >
            However you sell, <span className="em">we fit.</span>
          </h1>
          <p className="mx-auto mt-[18px] max-w-[580px] text-[18px] leading-relaxed text-ink-600">
            The way you take money depends on the business you&rsquo;re in. Pick the one that
            sounds like yours and see the setup, the products, and the pricing we&rsquo;d put
            behind it.
          </p>
        </Container>
      </section>

      {/* Industry cards */}
      <section className="px-6 pt-14 pb-2">
        <Container>
          <div className="grid gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
            {solutionNavOrder.map((k) => (
              <SolutionCard key={k} keyName={k} />
            ))}
          </div>
        </Container>
      </section>

      {/* How we approach it */}
      <section className="px-6 py-20">
        <Container>
          <SectionIntro
            eyebrow="How we match it"
            title="Same rails, different shape"
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {APPROACH.map((a) => (
              <Card key={a.title} padding="lg" className="h-full">
                <IconChip icon={a.icon} tone={a.tone} size={46} />
                <h2 className="mt-5 text-[18px] font-bold text-ink-900">{a.title}</h2>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-600">{a.body}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ — must stay in sync with FAQS above, which also feeds the schema */}
      <section className="border-t border-border-subtle px-6 py-20">
        <Container width="narrow">
          <SectionIntro eyebrow="Questions" title="Answers, in plain English" />
          <div className="mt-10">
            <Accordion items={FAQS} defaultOpen={0} />
          </div>
        </Container>
      </section>

      <DarkCTA
        titleA="Not sure where you"
        titleEm="fit?"
        body="Send us a recent statement. We'll tell you which setup suits your business and exactly what it would cost — no obligation."
        primary={{ label: "Get a free statement analysis", href: "/contact" }}
        secondary={{ label: "See pricing", href: "/pricing" }}
      />
    </>
  );
}
