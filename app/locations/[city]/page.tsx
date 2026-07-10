import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DarkCTA } from "@/components/site/dark-cta";
import { ButtonLink } from "@/components/ui/button-link";
import { JsonLd } from "@/components/seo/json-ld";
import { getCity, citySlugs, cityCanonical, cityJsonLdNodes } from "@/lib/seo/locations";
import { PRODUCTS, SOLUTIONS } from "@/lib/data";
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

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const c = getCity(city);
  if (!c) notFound();

  return (
    <>
      <JsonLd data={cityJsonLdNodes(c)} />

      {/* Hero + local intro */}
      <section className="px-6 pt-16 pb-10">
        <Container>
          <Eyebrow>{c.metro}</Eyebrow>
          <h1
            className="mt-4 font-display font-semibold text-ink-900"
            style={{ fontSize: "clamp(34px, 4.4vw, 52px)", lineHeight: 1.06 }}
          >
            Merchant Services in <span className="em">{c.name}, TX</span>.
          </h1>
          <div className="mt-5 max-w-[620px] space-y-4 text-[18px] leading-relaxed text-ink-600">
            {c.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="mt-8">
            <ButtonLink href="/contact" variant="primary" size="lg">
              Get a Quote
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* The wedge */}
      <section className="px-6 py-10">
        <Container>
          <div className="rounded-2xl border border-border-default bg-white p-8">
            <h2 className="text-[24px] font-bold text-ink-900">A free look at what you actually pay</h2>
            <p className="mt-3 max-w-[640px] text-[16px] leading-relaxed text-ink-600">{c.wedge}</p>
          </div>
        </Container>
      </section>

      {/* Districts + verticals */}
      <section className="px-6 py-10">
        <Container>
          <h2 className="text-[24px] font-bold text-ink-900">Who we serve in {c.name}</h2>
          <p className="mt-3 max-w-[640px] text-[16px] leading-relaxed text-ink-600">
            We work with {c.metro} businesses across {c.districts.join(", ")} — with particular depth in{" "}
            {c.verticals.join(", ")}.
          </p>
        </Container>
      </section>

      {/* Relevant products + industries (internal links) */}
      <section className="px-6 py-10">
        <Container>
          <h2 className="text-[24px] font-bold text-ink-900">Built for how {c.name} takes payments</h2>
          <div className="mt-5 flex flex-wrap gap-2.5">
            {c.products.map((k) => (
              <Link
                key={k}
                href={`/products/${k}`}
                className="rounded-pill border border-border-default bg-white px-4 py-2 text-[14.5px] font-medium text-ink-700 hover:border-clay-200"
              >
                {PRODUCTS[k].nav}
              </Link>
            ))}
            {c.industries.map((k) => (
              <Link
                key={k}
                href={`/industries/${k}`}
                className="rounded-pill border border-border-default bg-white px-4 py-2 text-[14.5px] font-medium text-ink-700 hover:border-clay-200"
              >
                {SOLUTIONS[k].nav}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Local proof — ⚠️ WRITE: replace with a real, approved testimonial from a merchant in this metro.
          Do NOT invent testimonials. Until then, this section renders nothing. */}

      {/* City FAQ (mirrors FAQPage JSON-LD) */}
      <section className="px-6 py-10">
        <Container>
          <h2 className="text-[24px] font-bold text-ink-900">{c.name} merchant services — FAQ</h2>
          <dl className="mt-6 max-w-[720px] space-y-6">
            {c.faqs.map((f) => (
              <div key={f.q}>
                <dt className="text-[17px] font-semibold text-ink-900">{f.q}</dt>
                <dd className="mt-1.5 text-[15.5px] leading-relaxed text-ink-600">{f.a}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* Cross-link to the other two metros */}
      <section className="px-6 pb-14">
        <Container>
          <p className="text-[14px] text-ink-500">
            Also serving{" "}
            {citySlugs()
              .filter((s) => s !== c.slug)
              .map((s, i, arr) => (
                <span key={s}>
                  <Link href={`/locations/${s}`} className="font-medium text-clay-600 hover:text-clay-700">
                    {getCity(s)!.name}
                  </Link>
                  {i < arr.length - 1 ? " and " : ""}
                </span>
              ))}
            .
          </p>
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
