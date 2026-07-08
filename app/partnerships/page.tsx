import type { Metadata } from "next";
import { Handshake, Share2, Code, Percent, Zap, Users, BarChart3 } from "lucide-react";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button-link";
import { IconChip } from "@/components/ui/icon-chip";
import { SectionIntro } from "@/components/site/bits";
import { DarkCTA } from "@/components/site/dark-cta";
import { TiltPanel } from "@/components/site/tilt-panel";
import { PartnershipGraphic } from "@/components/graphics/partnership-graphic";
import { ogImages } from "@/lib/og/meta";

export const metadata: Metadata = {
  title: "Partnerships — grow with Impeccabyte",
  description:
    "Refer merchants, build your own book on Maverick's rails, or embed payments in your product — with transparent revenue splits and a real team behind every deal.",
  ...ogImages("partnerships", "Impeccabyte — grow with a partner"),
};

const WAYS = [
  { icon: Handshake, tone: "clay" as const, title: "Agents & ISOs", body: "Build and own your portfolio on Maverick's rails, with competitive revenue splits that scale as you grow." },
  { icon: Share2, tone: "amber" as const, title: "Referral Partners", body: "Send us a merchant and earn on every account you refer. We handle boarding, service, and support." },
  { icon: Code, tone: "sage" as const, title: "Technology Partners", body: "Integrate our API and offer payments right inside your platform, marketplace, or software." },
];

const WHY = [
  { icon: Percent, title: "Transparent splits", body: "Clear revenue shares you can actually explain to your clients." },
  { icon: Zap, title: "Fast boarding", body: "Fully digital merchant applications, approved quickly." },
  { icon: Users, title: "A real team", body: "Human partner support behind every deal you bring us." },
  { icon: BarChart3, title: "Portfolio tools", body: "Modern reporting and clear visibility into your book." },
];

export default function PartnershipsPage() {
  return (
    <>
      {/* Hero */}
      <section className="px-6 pt-16 pb-12">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <Eyebrow>Partnerships</Eyebrow>
              <h1 className="mt-4 font-display font-semibold text-ink-900" style={{ fontSize: "clamp(36px,4.6vw,54px)", lineHeight: 1.05 }}>
                <span className="em">Grow</span> with Impeccabyte.
              </h1>
              <p className="mt-5 max-w-[500px] text-[19px] leading-relaxed text-ink-600">
                Refer merchants, build your own book on Maverick's rails, or embed payments in your product —
                with transparent revenue splits and a real team behind every deal.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <ButtonLink href="/contact" variant="primary" size="lg">
                  Become a partner
                </ButtonLink>
                <ButtonLink href="/contact" variant="secondary" size="lg">
                  Talk to us
                </ButtonLink>
              </div>
            </div>
            <TiltPanel
              gradient="radial-gradient(120% 100% at 75% 12%, var(--amber-50), var(--clay-50) 72%)"
              interactive={false}
            >
              <PartnershipGraphic />
            </TiltPanel>
          </div>
        </Container>
      </section>

      {/* Ways to partner */}
      <section className="px-6 py-20">
        <Container>
          <SectionIntro eyebrow="Ways to partner" title="Three ways to grow together" />
          <div className="mt-10 grid gap-[18px] md:grid-cols-3">
            {WAYS.map((w) => (
              <Card key={w.title} padding="lg">
                <IconChip icon={w.icon} tone={w.tone} size={52} />
                <h3 className="mt-4 text-[19px] font-bold text-ink-900">{w.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-600">{w.body}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Why partner */}
      <section className="px-6 py-20">
        <Container>
          <SectionIntro eyebrow="Why partner with us" title="Built to make you look good" />
          <div className="mt-10 grid gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((w) => (
              <Card key={w.title} padding="lg">
                <w.icon size={24} strokeWidth={1.85} className="text-clay-500" />
                <h3 className="mt-4 text-[16px] font-bold text-ink-900">{w.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-600">{w.body}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <DarkCTA
        titleA="Let's"
        titleEm="build together."
        body="Tell us how you'd like to partner, and we'll map out splits, boarding, and support for your book."
        primary={{ label: "Become a partner", href: "/contact" }}
        secondary={{ label: "Talk to us", href: "/contact" }}
      />
    </>
  );
}
