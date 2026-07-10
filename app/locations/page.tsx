import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DarkCTA } from "@/components/site/dark-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { citySlugs, getCity } from "@/lib/seo/locations";
import { ogImages } from "@/lib/og/meta";

export const metadata: Metadata = {
  title: "Areas We Serve — Texas Merchant Services",
  description:
    "Impeccabyte serves merchants across Texas — Austin, Dallas–Fort Worth, and San Antonio — with transparent interchange-plus pricing and a free statement analysis.",
  alternates: { canonical: "/locations" },
  ...ogImages("home", "Impeccabyte — Texas merchant services"),
};

export default function LocationsHubPage() {
  const cities = citySlugs().map((s) => getCity(s)!);
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Locations", path: "/locations" },
        ])}
      />
      <section className="px-6 pt-16 pb-12">
        <Container>
          <Eyebrow>Areas we serve</Eyebrow>
          <h1
            className="mt-4 font-display font-semibold text-ink-900"
            style={{ fontSize: "clamp(36px, 4.6vw, 54px)", lineHeight: 1.05 }}
          >
            Merchant services <span className="em">across Texas</span>.
          </h1>
          <p className="mt-5 max-w-[560px] text-[19px] leading-relaxed text-ink-600">
            We&rsquo;re Austin-based and serve businesses statewide — from the Hill Country to
            Dallas–Fort Worth and San Antonio. Pick your metro to see how we help local merchants.
          </p>
        </Container>
      </section>

      <section className="px-6 pb-20">
        <Container>
          <div className="grid gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
            {cities.map((c) => (
              <Link
                key={c.slug}
                href={`/locations/${c.slug}`}
                className="group rounded-2xl border border-border-default bg-white p-7 transition-colors hover:border-clay-200"
              >
                <h2 className="text-[22px] font-bold text-ink-900">{c.name}</h2>
                <p className="mt-1 text-[14px] font-medium text-clay-600">{c.metro}</p>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-600">{c.intro[0]}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[15px] font-semibold text-clay-600">
                  {c.name} merchant services{" "}
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <DarkCTA
        titleA="Not sure where to"
        titleEm="start?"
        body="Send us a recent processing statement and we'll show you exactly what you're paying — free, no obligation."
        primary={{ label: "Get a Quote", href: "/contact" }}
        secondary={{ label: "See pricing", href: "/pricing" }}
      />
    </>
  );
}
