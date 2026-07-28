import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import { ArrowDown, Cable, Landmark, Layers } from "lucide-react";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Card } from "@/components/ui/card";
import { Callout } from "@/components/ui/callout";
import { ButtonLink } from "@/components/ui/button-link";
import { DarkCTA } from "@/components/site/dark-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { BentoGrid, IntegrationTile } from "@/components/integrations/bento";
import { StackDiagram } from "@/components/integrations/stack-diagram";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { ORG_ID } from "@/lib/seo/org";
import {
  ecommerce,
  lineup,
  operations,
  terminals,
  trademarkNotice,
  type Integration,
} from "@/lib/integrations";

export const metadata: Metadata = {
  title: "Integrations — plays nicely with your stack",
  description:
    "Twelve gateways and payment platforms on one merchant account, running on TSYS or First Data Nashville. See the carts, accounting tools, CRMs, and terminals that connect.",
  alternates: { canonical: "/integrations" },
};

const HOW_IT_CONNECTS: {
  icon: LucideIcon;
  chip: string;
  title: string;
  body: string;
  featured?: boolean;
}[] = [
  {
    icon: Landmark,
    chip: "bg-ink-100 text-ink-600",
    title: "Major rails",
    body: "Your MID is deployed on TSYS or First Data Nashville — not a walled garden.",
  },
  {
    icon: Cable,
    chip: "bg-clay-50 text-clay-600",
    title: "A certified gateway",
    body: "NMI, Authorize.net, and other certified gateways all run on the same account.",
    featured: true,
  },
  {
    icon: Layers,
    chip: "bg-sage-50 text-sage-600",
    title: "Your software",
    body: "Carts, CRMs, billing tools, and vertical software plug into those gateways.",
  },
];

/** Centered eyebrow + serif heading + lede, on the bento sections. */
function BentoIntro({
  eyebrow,
  titleA,
  titleEm,
  children,
}: {
  eyebrow: string;
  titleA: string;
  titleEm?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="ib-rv mx-auto mb-[30px] max-w-[640px] text-center">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2
        className="mt-3 font-display font-semibold text-ink-900"
        style={{ fontSize: "clamp(26px, 3.2vw, 38px)" }}
      >
        {titleA}
        {titleEm && (
          <>
            {" "}
            <span className="em">{titleEm}</span>
          </>
        )}
      </h2>
      <p className="mt-3 text-[16px] leading-[1.6] text-ink-600">{children}</p>
    </div>
  );
}

function Tiles({ items }: { items: Integration[] }) {
  return (
    <>
      {items.map((item) => (
        <IntegrationTile key={item.name} item={item} />
      ))}
    </>
  );
}

export default function IntegrationsPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Integrations", path: "/integrations" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Payment gateway and software integrations",
            serviceType: "Merchant services / payment processing",
            provider: { "@id": ORG_ID },
            description:
              "Twelve gateways and payment platforms on a single Impeccabyte merchant account, connecting e-commerce carts, accounting and CRM software, and EMV terminals.",
          },
        ]}
      />

      {/* Hero */}
      <section className="px-6 pt-18 pb-10">
        <Container>
          <div className="grid grid-cols-[1.05fr_0.95fr] items-center gap-14 max-[920px]:grid-cols-1">
            <div>
              <Eyebrow>Integrations</Eyebrow>
              <h1
                className="mt-[15px] font-display font-semibold text-ink-900"
                style={{ fontSize: "clamp(38px, 5vw, 58px)", lineHeight: 1.03, letterSpacing: "-0.025em" }}
              >
                Plays nicely with <span className="em">your stack.</span>
              </h1>
              <p className="mt-[22px] max-w-[520px] text-[19px] leading-[1.6] text-ink-600">
                We offer twelve gateways and payment platforms — and your merchant account lives on TSYS
                or First Data Nashville, the rails most of the industry's software is certified against.
                If your tools connect to one of them, they connect to us.
              </p>
              <div className="mt-[30px] flex flex-wrap items-center gap-4">
                <ButtonLink href="/contact" variant="primary" size="lg">
                  Ask about your software
                </ButtonLink>
                {/* Plain hash link: html { scroll-behavior: smooth; scroll-padding-top: 88px }
                    in globals.css already clears the sticky header, so no JS is needed. */}
                <a
                  href="#int-catalog"
                  className="inline-flex items-center gap-[7px] whitespace-nowrap text-[16px] font-semibold text-clay-600"
                >
                  See what connects
                  <ArrowDown size={17} aria-hidden />
                </a>
              </div>
            </div>
            <StackDiagram />
          </div>
        </Container>
      </section>

      {/* How it connects */}
      <section className="px-6 py-8">
        <Container className="max-w-[1000px]">
          <div className="grid grid-cols-3 gap-4 max-[760px]:grid-cols-1">
            {HOW_IT_CONNECTS.map((c) => (
              <Card
                key={c.title}
                padding="md"
                className={c.featured ? "border-[1.5px] border-clay-300 text-center" : "text-center"}
              >
                <span
                  className={`mx-auto inline-flex h-[46px] w-[46px] items-center justify-center rounded-md ${c.chip}`}
                >
                  <c.icon size={24} strokeWidth={1.75} aria-hidden />
                </span>
                <h3 className="mt-4 text-[17px] font-bold text-ink-900">{c.title}</h3>
                <p className="mt-2 min-h-[44px] text-[14px] leading-[1.55] text-ink-600">{c.body}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* The lineup */}
      <section id="int-catalog" className="px-6 pt-6 pb-2">
        <Container>
          <BentoIntro eyebrow="The lineup" titleA="Twelve ways in," titleEm="one account">
            Gateways, checkout, billing, and routing — every platform below runs on the same Impeccabyte
            merchant account. Mix and match; no separate contracts.
          </BentoIntro>
          <BentoGrid>
            <Tiles items={lineup} />
          </BentoGrid>
        </Container>
      </section>

      {/* E-commerce & carts */}
      <section className="px-6 pt-16 pb-2">
        <Container className="max-w-[1160px]">
          <BentoIntro eyebrow="Sell online" titleA="E-commerce & carts">
            Your storefront keeps its checkout — we swap what's underneath.
          </BentoIntro>
          <BentoGrid>
            <Tiles items={ecommerce} />
          </BentoGrid>
          <div className="ib-rv mt-[26px]">
            <Callout variant="warning" title="A straight answer on Shopify">
              Shopify steers merchants into Shopify Payments and penalizes third-party gateways —
              that's their rule, not ours. If your store lives on Shopify and you're happy there, we'll
              usually tell you to stay put. We'd rather say that now than after a migration.
            </Callout>
          </div>
        </Container>
      </section>

      {/* Accounting, CRM & operations */}
      <section className="px-6 pt-16 pb-2">
        <Container className="max-w-[1160px]">
          <BentoIntro eyebrow="Run the books" titleA="Accounting, CRM & operations">
            Payments that post themselves — to the ledger, the CRM, and the shipping queue.
          </BentoIntro>
          <BentoGrid>
            <Tiles items={operations} />
          </BentoGrid>
        </Container>
      </section>

      {/* Terminals & hardware */}
      <section className="px-6 pt-16 pb-2">
        <Container className="max-w-[1160px]">
          <BentoIntro eyebrow="In person" titleA="Terminals & hardware">
            EMV-certified devices that pair with the NMI gateway on your account.
          </BentoIntro>
          <BentoGrid>
            <Tiles items={terminals} />
          </BentoGrid>
        </Container>
      </section>

      <DarkCTA
        titleA="Don't see"
        titleEm="your software?"
        body="If it connects to NMI or Authorize.Net, it almost certainly connects to us. Send us the name of the tool you run — we'll confirm within one business day."
        primary={{ label: "Ask about your software", href: "/contact" }}
        secondary={{ label: "Talk to us", href: "/contact" }}
        footnote={trademarkNotice}
      />
    </>
  );
}
