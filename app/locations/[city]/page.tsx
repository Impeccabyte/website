import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Check, FileSearch, HelpCircle, MapPin } from "lucide-react";
import { Container } from "@/components/site/container";
import { Card } from "@/components/ui/card";
import { IconChip } from "@/components/ui/icon-chip";
import { ButtonLink } from "@/components/ui/button-link";
import { DarkCTA } from "@/components/site/dark-cta";
import { TiltPanel } from "@/components/site/tilt-panel";
import { LocationGraphic } from "@/components/graphics/location-graphic";
import { PriorityZonePanel } from "@/components/site/priority-zone-panel";
import { JsonLd } from "@/components/seo/json-ld";
import { getCity, citySlugs, cityCanonical, cityJsonLdNodes } from "@/lib/seo/locations";
import { PRODUCTS, SOLUTIONS, PRIORITY } from "@/lib/data";
import { ogImages } from "@/lib/og/meta";

export const dynamicParams = false;

export function generateStaticParams() {
  return citySlugs().map((city) => ({ city }));
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params;
  const c = getCity(city);
  if (!c) return {};
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: { canonical: cityCanonical(c.slug) },
    ...ogImages("home", `Impeccabyte — merchant services in ${c.name}, TX`),
  };
}

/** A product/industry link, rendered as a card in the "what we set up" grid. */
function ServiceLinkCard({
  href,
  icon,
  kind,
  label,
  desc,
}: {
  href: string;
  icon: LucideIcon;
  kind: string;
  label: string;
  desc: string;
}) {
  return (
    <Link href={href} className="group block">
      <Card interactive padding="none" className="flex h-full flex-col p-[22px]">
        <div className="flex items-center justify-between">
          <IconChip icon={icon} tone="clay" size={44} />
          <span className="text-[10.5px] font-bold uppercase tracking-[0.08em] text-ink-400">{kind}</span>
        </div>
        <h3 className="mt-4 text-[16.5px] font-bold text-ink-900">{label}</h3>
        <p className="mt-1.5 flex-1 text-[13.5px] leading-relaxed text-ink-600">{desc}.</p>
        <span className="mt-3.5 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-clay-600">
          Learn more <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </Card>
    </Link>
  );
}

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const c = getCity(city);
  if (!c) notFound();

  const others = citySlugs()
    .filter((s) => s !== c.slug)
    .map((s) => getCity(s)!);

  return (
    <>
      <JsonLd data={cityJsonLdNodes(c)} />

      {/* Hero */}
      <section className="pt-16 pb-10">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <span className="eyebrow inline-flex items-center gap-2">
                <MapPin size={15} />
                {c.region}
              </span>
              <h1
                className="mt-3.5 font-display font-semibold text-ink-900"
                style={{ fontSize: "clamp(38px, 5vw, 58px)", lineHeight: 1.03 }}
              >
                Merchant services in <span className="em">{c.name}.</span>
              </h1>
              <p className="mt-5 max-w-[520px] text-[18px] leading-relaxed text-ink-600">{c.intro[0]}</p>
              <p className="mt-4 max-w-[520px] text-[16px] leading-relaxed text-ink-500">{c.intro[1]}</p>
              <div className="mt-8 flex flex-wrap items-center gap-5">
                <ButtonLink href="/contact" variant="primary" size="lg">
                  Get a Quote
                </ButtonLink>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-1.5 text-[16px] font-semibold text-clay-600 hover:text-clay-700"
                >
                  See pricing <ArrowRight size={17} />
                </Link>
              </div>
            </div>
            <TiltPanel
              bare
              gradient="radial-gradient(56% 52% at 62% 32%, rgba(224,160,77,0.26), transparent 70%)"
            >
              <LocationGraphic cityName={c.name} />
            </TiltPanel>
          </div>
        </Container>
      </section>

      {/* Statement-analysis wedge */}
      <section className="py-4">
        <Container>
          <div className="flex flex-wrap items-center gap-6 rounded-lg border border-clay-100 bg-clay-50 px-8 py-7">
            <span className="inline-flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-md bg-white text-clay-600 shadow-sm">
              <FileSearch size={26} strokeWidth={1.85} />
            </span>
            <div className="min-w-[280px] flex-1">
              <h2 className="text-[23px] font-semibold text-ink-900">A free look at what you actually pay</h2>
              <p className="mt-1.5 text-[15px] leading-relaxed text-ink-600">{c.wedge}</p>
            </div>
            <ButtonLink href="/contact" variant="primary" size="lg" className="shrink-0">
              Get a Quote
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* Who we serve */}
      <section className="pt-16 pb-4">
        <Container>
          <div className="grid gap-11 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <span className="eyebrow">Who we serve</span>
              <h2
                className="mt-3 font-display font-semibold text-ink-900"
                style={{ fontSize: "clamp(26px, 3vw, 34px)" }}
              >
                Where {c.name} does business
              </h2>
              <p className="mt-3 text-[15.5px] leading-relaxed text-ink-600">{c.serveIntro}</p>
            </div>
            <div>
              <div className="flex flex-wrap gap-2.5">
                {c.districts.map((hood) => (
                  <span
                    key={hood}
                    className="inline-flex items-center gap-2 rounded-pill border border-border-default bg-white px-4 py-2.5 text-[14.5px] text-ink-700 shadow-sm"
                  >
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-clay-400" />
                    {hood}
                  </span>
                ))}
              </div>
              <div className="mt-7 mb-3 text-[11.5px] font-bold uppercase tracking-[0.1em] text-ink-400">
                Particular depth in
              </div>
              <div className="flex flex-col gap-3">
                {c.verticals.map((v) => (
                  <div key={v} className="flex items-center gap-3 text-[15.5px] text-ink-700">
                    <Check size={18} strokeWidth={2.4} className="shrink-0 text-sage-600" />
                    {v}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* What we set up — relevant products + industries */}
      <section className="pt-16 pb-4">
        <Container>
          <div className="mx-auto mb-8 max-w-[560px] text-center">
            <span className="eyebrow">What we set up</span>
            <h2
              className="mt-3 font-display font-semibold text-ink-900"
              style={{ fontSize: "clamp(26px, 3vw, 34px)" }}
            >
              Built for how {c.name} takes payments
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {c.products.map((k) => (
              <ServiceLinkCard
                key={`p-${k}`}
                href={`/products/${k}`}
                icon={PRODUCTS[k].icon}
                kind="Product"
                label={PRODUCTS[k].nav}
                desc={PRODUCTS[k].menuDesc}
              />
            ))}
            {c.industries.map((k) => (
              <ServiceLinkCard
                key={`s-${k}`}
                href={`/industries/${k}`}
                icon={SOLUTIONS[k].icon}
                kind="Industry"
                label={SOLUTIONS[k].nav}
                desc={SOLUTIONS[k].menuDesc}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* Local proof — ⚠️ WRITE: replace with a real, approved testimonial from a merchant in this metro.
          Do NOT invent testimonials. Until then, this section renders nothing. */}

      {/* Priority Support — on-site terms scoped to this metro's zone */}
      <section className="pt-16 pb-4">
        <Container>
          <PriorityZonePanel zone={PRIORITY.zones[c.zone]} />
        </Container>
      </section>

      {/* FAQ (mirrors FAQPage JSON-LD) */}
      <section className="pt-16 pb-4">
        <Container width="wide">
          <div className="mx-auto mb-8 text-center">
            <span className="eyebrow">FAQ</span>
            <h2
              className="mt-3 font-display font-semibold text-ink-900"
              style={{ fontSize: "clamp(26px, 3vw, 34px)" }}
            >
              {c.name} merchant services
            </h2>
          </div>
          <dl className="flex flex-col">
            {c.faqs.map((f) => (
              <div key={f.q} className="border-t border-border-subtle py-[22px]">
                <dt className="flex items-start gap-3 text-[16.5px] font-bold text-ink-900">
                  <HelpCircle size={19} className="mt-px shrink-0 text-clay-500" />
                  {f.q}
                </dt>
                <dd className="mt-2.5 pl-[30px] text-[15.5px] leading-relaxed text-ink-600">{f.a}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-[15px] text-ink-500">
            <span>Also serving</span>
            {others.map((o) => (
              <Link key={o.slug} href={`/locations/${o.slug}`} className="font-semibold text-clay-600 hover:text-clay-700">
                {o.name}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <DarkCTA
        titleA={`Ready to price your ${c.name} business?`}
        titleEm="Let's talk."
        body="Tell us about your business and we'll build a custom interchange-plus quote — usually within a business day."
        primary={{ label: "Get a Quote", href: "/contact" }}
        secondary={{ label: "See pricing", href: "/pricing" }}
      />
    </>
  );
}
