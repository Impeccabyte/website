import type { Metadata } from "next";
import { Sparkles, Heart, Zap, Lock, ShieldCheck, Globe, Clock, ImageIcon } from "lucide-react";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Card } from "@/components/ui/card";
import { IconChip } from "@/components/ui/icon-chip";
import { Callout } from "@/components/ui/callout";
import { SectionIntro } from "@/components/site/bits";
import { DarkCTA } from "@/components/site/dark-cta";
import { ogImages } from "@/lib/og/meta";

export const metadata: Metadata = {
  title: "About — merchant services for the next generation",
  description:
    "Impeccabyte is merchant services for the freelancers, makers, and small storefronts who deserve fair pricing and a human on the other end. Based in Austin, backed by Maverick Payments.",
  ...ogImages("about", "Impeccabyte — payments, done right"),
};

const VALUES = [
  { icon: Sparkles, tone: "clay" as const, title: "Clarity", body: "If it sounds like a bank wrote it, we rewrite it. Plain words, plain pricing." },
  { icon: Heart, tone: "amber" as const, title: "Warmth", body: "A real team that answers, roots for you, and treats your money like it matters." },
  { icon: Zap, tone: "sage" as const, title: "Speed", body: "Fast boarding, fast payouts. Your momentum shouldn't wait on paperwork." },
];

const RAILS = [
  { icon: Lock, label: "PCI Level 1" },
  { icon: ShieldCheck, label: "Fraud monitoring" },
  { icon: Globe, label: "Nationwide" },
  { icon: Clock, label: "Fast boarding" },
];

const STATS = [
  { n: "40k+", label: "merchants served" },
  { n: "$2B+", label: "processed yearly" },
  { n: "1 day", label: "typical boarding" },
  { n: "Austin", label: "Texas, HQ" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="px-6 pt-16 pb-12">
        <Container width="wide" className="text-center">
          <Eyebrow>About Impeccabyte</Eyebrow>
          <h1 className="mt-4 font-display font-semibold text-ink-900" style={{ fontSize: "clamp(38px,4.8vw,56px)", lineHeight: 1.05 }}>
            We take you seriously the day you <span className="em">start</span>.
          </h1>
          <p className="mx-auto mt-5 max-w-[620px] text-[18px] leading-relaxed text-ink-600">
            Impeccabyte is merchant services for the next generation of business owners — the freelancers,
            makers, and small storefronts who deserve fair pricing and a human on the other end.
          </p>
        </Container>
      </section>

      {/* Our story */}
      <section className="px-6 py-20">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <Eyebrow>Our story</Eyebrow>
              <h2 className="mt-3 font-display font-semibold text-ink-900" style={{ fontSize: "clamp(28px,3.2vw,40px)" }}>
                Made by hand, not by committee
              </h2>
              <p className="mt-5 text-[16px] leading-relaxed text-ink-600">
                Payments got complicated on purpose — bundled rates, surprise fees, and forms that assume you
                incorporated years ago. We built Impeccabyte to be the opposite: clear pricing, fast payouts,
                and setup that treats a brand-new founder like the real business they already are.
              </p>
              <p className="mt-4 text-[16px] leading-relaxed text-ink-600">
                We're based in Austin, Texas, and we back every account with the bank-grade infrastructure of
                Maverick Payments.
              </p>
            </div>
            <div
              className="flex h-[360px] items-center justify-center rounded-lg border border-border-default bg-clay-50"
              role="img"
              aria-label="Team photo placeholder"
            >
              <div className="text-center text-ink-400">
                <ImageIcon size={34} className="mx-auto" strokeWidth={1.6} />
                <p className="mt-2 text-[14px] font-medium">Drop your team photo</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* What we believe */}
      <section className="px-6 py-20">
        <Container>
          <SectionIntro eyebrow="What we believe" />
          <div className="mt-10 grid gap-[18px] md:grid-cols-3">
            {VALUES.map((v) => (
              <Card key={v.title} padding="lg">
                <IconChip icon={v.icon} tone={v.tone} size={52} />
                <h3 className="mt-4 text-[19px] font-bold text-ink-900">{v.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-600">{v.body}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* The partnership */}
      <section className="px-6 py-20">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <Eyebrow>The partnership</Eyebrow>
              <h2 className="mt-3 font-display font-semibold text-ink-900" style={{ fontSize: "clamp(28px,3.2vw,40px)" }}>
                Bank-grade rails, a human front desk
              </h2>
              <p className="mt-5 text-[16px] leading-relaxed text-ink-600">
                Impeccabyte is a registered agent of Maverick Payments. That means your payments run on
                Maverick's proven, PCI-compliant infrastructure — while Impeccabyte stays your local, human
                point of contact for pricing, setup, and support.
              </p>
              <Callout title="Powered by Maverick Payments" className="mt-6">
                Nationwide processing, advanced fraud monitoring, and the security you'd expect from an
                enterprise processor — with none of the enterprise coldness.
              </Callout>
            </div>
            <div className="grid grid-cols-2 gap-[18px]">
              {RAILS.map((r) => (
                <div
                  key={r.label}
                  className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border-default bg-white px-4 py-8 text-center shadow-xs"
                >
                  <r.icon size={26} strokeWidth={1.85} className="text-clay-500" />
                  <span className="text-[15px] font-semibold text-ink-800">{r.label}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Stats */}
      <section className="px-6 py-20">
        <Container>
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.n}>
                <div className="font-display font-semibold text-clay-600" style={{ fontSize: 40, lineHeight: 1 }}>
                  {s.n}
                </div>
                <div className="mt-2 text-[14px] text-ink-500">{s.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <DarkCTA
        titleA="Come"
        titleEm="build with us."
        body="Get a quote in minutes, or reach out and talk to a real person in Austin."
        primary={{ label: "Get a quote", href: "/contact" }}
        secondary={{ label: "Contact us", href: "/contact" }}
      />
    </>
  );
}
