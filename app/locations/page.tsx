import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Home, MapPin } from "lucide-react";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Card } from "@/components/ui/card";
import { IconChip } from "@/components/ui/icon-chip";
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

      {/* Hero */}
      <section
        className="border-b border-border-subtle"
        style={{ background: "radial-gradient(90% 120% at 50% -30%, var(--amber-50), var(--paper) 62%)" }}
      >
        <Container width="wide" className="py-16 text-center sm:pt-[72px] sm:pb-12">
          <Eyebrow>Locations</Eyebrow>
          <h1
            className="mt-3.5 font-display font-semibold text-ink-900"
            style={{ fontSize: "clamp(36px, 4.8vw, 56px)", lineHeight: 1.04 }}
          >
            Merchant services <span className="em">across Texas.</span>
          </h1>
          <p className="mx-auto mt-[18px] max-w-[560px] text-[18px] leading-relaxed text-ink-600">
            We&rsquo;re based in Austin and serve merchants statewide — on-site where we can, remotely
            everywhere else, always with transparent interchange-plus pricing and a real team behind you.
          </p>
        </Container>
      </section>

      {/* Metro cards */}
      <section className="pt-14 pb-2">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cities.map((c) => (
              <Link key={c.slug} href={`/locations/${c.slug}`} className="group block">
                <Card interactive padding="md" className="flex h-full flex-col">
                  <div className="flex items-center justify-between">
                    <IconChip icon={MapPin} tone="clay" size={44} />
                    {c.hasOffice && (
                      <span className="inline-flex items-center gap-1.5 rounded-pill border border-sage-100 bg-sage-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.04em] text-sage-600">
                        <Home size={12} strokeWidth={2.6} /> Home base
                      </span>
                    )}
                  </div>
                  <div className="mt-5 text-[11.5px] font-bold uppercase tracking-[0.1em] text-clay-600">
                    {c.region}
                  </div>
                  <h2 className="mt-1 font-display text-[27px] font-semibold tracking-[-0.02em] text-ink-900">
                    {c.name}
                  </h2>
                  <p className="mt-2.5 flex-1 text-[14.5px] leading-relaxed text-ink-600">{c.tagline}</p>
                  <div className="mt-4 border-t border-border-subtle pt-3.5 text-[12.5px] leading-relaxed text-ink-400">
                    {c.cardLine}
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-clay-600">
                    Explore {c.name}{" "}
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <DarkCTA
        titleA="Not on the list? We still"
        titleEm="have you."
        body="We serve businesses across Texas and beyond. Tell us where you are and we'll build a quote that fits."
        primary={{ label: "Get a Quote", href: "/contact" }}
        secondary={{ label: "See pricing", href: "/pricing" }}
      />
    </>
  );
}
