import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button-link";
import { IconChip } from "@/components/ui/icon-chip";
import { CheckItem, SectionIntro, PricingStrip } from "@/components/site/bits";
import { ProductCard } from "@/components/site/entry-card";
import { DarkCTA } from "@/components/site/dark-cta";
import { TiltPanel } from "@/components/site/tilt-panel";
import { ProductGraphic } from "@/components/graphics/product-graphic";
import { ProductGraphic2 } from "@/components/graphics/product-graphic-2";
import { PRODUCTS, productOrder, type ProductKey } from "@/lib/data";
import { ogImages } from "@/lib/og/meta";

export function generateStaticParams() {
  return productOrder.map((key) => ({ key }));
}

export async function generateMetadata({ params }: { params: Promise<{ key: string }> }): Promise<Metadata> {
  const { key } = await params;
  const p = PRODUCTS[key as ProductKey];
  if (!p) return {};
  return {
    title: `${p.titleA} ${p.titleEm} · ${p.nav}`,
    description: p.subtitle,
    ...ogImages(`product-${p.key}`, `${p.nav} · Impeccabyte`),
  };
}

export default async function ProductPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const p = PRODUCTS[key as ProductKey];
  if (!p) notFound();

  const related = p.related.filter((k) => !PRODUCTS[k].comingSoon);

  return (
    <>
      {/* Hero */}
      <section className="px-6 pt-16 pb-12">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <Eyebrow>{p.eyebrow}</Eyebrow>
              <h1
                className="mt-4 font-display font-semibold text-ink-900"
                style={{ fontSize: "clamp(36px, 4.6vw, 54px)", lineHeight: 1.05 }}
              >
                {p.titleA} <span className="em">{p.titleEm}</span>.
              </h1>
              <p className="mt-5 max-w-[500px] text-[19px] leading-relaxed text-ink-600">{p.subtitle}</p>
              <div className="mt-8 flex flex-wrap items-center gap-5">
                <ButtonLink href="/contact" variant="primary" size="lg">
                  Get a free statement analysis
                </ButtonLink>
                <Link href="/pricing" className="inline-flex items-center gap-1.5 text-[16px] font-semibold text-clay-600 hover:text-clay-700">
                  See pricing <ArrowRight size={17} />
                </Link>
              </div>
            </div>
            <TiltPanel gradient="radial-gradient(120% 100% at 75% 12%, var(--amber-50), var(--clay-50) 72%)">
              <ProductGraphic gfx={p.gfx} />
            </TiltPanel>
          </div>
        </Container>
      </section>

      {/* 3 feature cards */}
      <section className="px-6 py-10">
        <Container>
          <div className="grid gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
            {p.features.map((f) => (
              <Card key={f.title} padding="lg">
                <IconChip icon={f.icon} tone="clay" size={52} />
                <h3 className="mt-4 text-[19px] font-bold text-ink-900">{f.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-600">{f.body}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Benefit split */}
      <section className="px-6 py-20">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <TiltPanel
              className="min-h-[300px] lg:order-1"
              gradient="radial-gradient(120% 100% at 25% 20%, var(--clay-50), var(--white) 72%)"
              interactive={false}
            >
              <ProductGraphic2 gfx={p.gfx} />
            </TiltPanel>
            <div className="lg:order-2">
              <Eyebrow>Why Impeccabyte</Eyebrow>
              <h2 className="mt-3 font-display font-semibold text-ink-900" style={{ fontSize: "clamp(28px,3.2vw,40px)" }}>
                {p.benefitTitle}
              </h2>
              <div className="mt-6 flex flex-col gap-3.5">
                {p.benefitBullets.map((b) => (
                  <CheckItem key={b} className="[&_span]:text-[16px]">
                    {b}
                  </CheckItem>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section className="px-6 py-20">
          <Container>
            <SectionIntro eyebrow="Works with the rest" title="Pairs perfectly with" />
            <div className="mt-10 grid gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
              {related.map((k) => (
                <ProductCard key={k} keyName={k} variant="related" />
              ))}
            </div>
          </Container>
        </section>
      )}

      <PricingStrip />

      <DarkCTA
        titleA="Ready to"
        titleEm="get started?"
        body="Tell us about your business and we'll build a custom quote — usually within a business day."
        primary={{ label: "Get a free statement analysis", href: "/contact" }}
        secondary={{ label: "See pricing", href: "/pricing" }}
      />
    </>
  );
}
