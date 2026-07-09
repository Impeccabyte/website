import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, Quote } from "lucide-react";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionIntro } from "@/components/site/bits";
import { ProductCard } from "@/components/site/entry-card";
import { DarkCTA } from "@/components/site/dark-cta";
import { TiltPanel } from "@/components/site/tilt-panel";
import { SolutionGraphic } from "@/components/graphics/solution-graphic";
import { SOLUTIONS, type SolutionKey } from "@/lib/data";
import { ogImages } from "@/lib/og/meta";

// Every solution (incl. agents, reachable from Partnerships) gets a static page.
export function generateStaticParams() {
  return (Object.keys(SOLUTIONS) as SolutionKey[]).map((key) => ({ key }));
}

export async function generateMetadata({ params }: { params: Promise<{ key: string }> }): Promise<Metadata> {
  const { key } = await params;
  const s = SOLUTIONS[key as SolutionKey];
  if (!s) return {};
  return {
    title: `${s.titleA} ${s.titleEm} · ${s.nav}`,
    description: s.subtitle,
    ...ogImages(`industry-${s.key}`, `${s.nav} · Impeccabyte`),
  };
}

export default async function SolutionPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const s = SOLUTIONS[key as SolutionKey];
  if (!s) notFound();

  return (
    <>
      {/* Hero */}
      <section className="px-6 pt-16 pb-12">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <Eyebrow>{s.eyebrow}</Eyebrow>
              <h1
                className="mt-4 font-display font-semibold text-ink-900"
                style={{ fontSize: "clamp(36px, 4.6vw, 54px)", lineHeight: 1.05 }}
              >
                {s.titleA} <span className="em">{s.titleEm}</span>.
              </h1>
              <p className="mt-5 max-w-[500px] text-[19px] leading-relaxed text-ink-600">{s.subtitle}</p>
              <div className="mt-8 flex flex-wrap items-center gap-5">
                <ButtonLink href="/contact" variant="primary" size="lg">
                  Get a Quote
                </ButtonLink>
                <Link href="/pricing" className="inline-flex items-center gap-1.5 text-[16px] font-semibold text-clay-600 hover:text-clay-700">
                  See pricing <ArrowRight size={17} />
                </Link>
              </div>
            </div>
            <TiltPanel gradient="radial-gradient(120% 100% at 75% 12%, var(--amber-50), var(--clay-50) 72%)">
              <SolutionGraphic gfx={s.gfx} />
            </TiltPanel>
          </div>
        </Container>
      </section>

      {/* What we solve for you */}
      <section className="px-6 py-10">
        <Container>
          <div className="text-center">
            <Eyebrow>What we solve for you</Eyebrow>
          </div>
          <div className="mt-8 grid gap-[18px] sm:grid-cols-2">
            {s.pains.map((pain) => (
              <Card key={pain.title} padding="lg">
                <h3 className="text-[18px] font-bold text-ink-900">{pain.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-600">{pain.body}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Recommended products */}
      <section className="px-6 py-20">
        <Container>
          <SectionIntro eyebrow="Recommended for you" title="The products that fit" />
          <div className="mt-10 grid gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
            {s.recommended.map((k) => (
              <ProductCard key={k} keyName={k} variant="related" />
            ))}
          </div>
        </Container>
      </section>

      {/* Testimonial */}
      <section className="border-y border-clay-100 bg-clay-50 px-6 py-20">
        <Container width="wide" className="text-center">
          <Quote size={36} className="mx-auto text-clay-300" />
          <blockquote
            className="mx-auto mt-5 max-w-[680px] font-display font-medium text-ink-900"
            style={{ fontSize: "clamp(24px, 3vw, 32px)", lineHeight: 1.3 }}
          >
            &ldquo;{s.quote.text}&rdquo;
          </blockquote>
          <p className="mt-5 text-[14px] text-ink-500">— {s.quote.author}</p>
        </Container>
      </section>

      <DarkCTA
        titleA="Let's"
        titleEm="set you up."
        body="Get a custom interchange-plus quote built around how your business actually takes payments."
        primary={{ label: "Get a Quote", href: "/contact" }}
        secondary={{ label: "See pricing", href: "/pricing" }}
      />
    </>
  );
}
