import type { Metadata } from "next";
import { Sparkles, Heart, Zap, Lock, ShieldCheck, Globe, Clock, Check, MapPin, ArrowDownToLine } from "lucide-react";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Card } from "@/components/ui/card";
import { IconChip } from "@/components/ui/icon-chip";
import { Callout } from "@/components/ui/callout";
import { SectionIntro } from "@/components/site/bits";
import { DarkCTA } from "@/components/site/dark-cta";
import { TiltPanel } from "@/components/site/tilt-panel";
import { Wordmark } from "@/components/site/wordmark";
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
            <TiltPanel
              gradient="radial-gradient(120% 100% at 72% 14%, var(--amber-50), var(--clay-50) 60%, var(--surface-card) 92%)"
              className="min-h-[360px]"
            >
              <div className="relative w-[302px]">
                {/* depth block behind */}
                <div
                  className="absolute z-0 rounded-lg shadow-md"
                  style={{
                    top: 14,
                    right: -14,
                    width: 250,
                    height: 180,
                    background: "linear-gradient(135deg, var(--clay-400), var(--amber-400))",
                    transform: "rotate(6deg)",
                  }}
                  aria-hidden
                />

                {/* main story card */}
                <div
                  className="relative z-[2] rounded-lg border border-border-default shadow-lg"
                  style={{ background: "var(--surface-card)", padding: "22px 22px 20px", transform: "rotate(-2deg)" }}
                >
                  <div className="flex items-center justify-between">
                    <Wordmark size={16} emblem={28} />
                    <span
                      className="inline-flex items-center gap-1.5 rounded-pill border border-sage-100 bg-sage-50 px-2.5 py-1 text-[11px] font-bold text-sage-600"
                    >
                      <Check size={13} strokeWidth={3} />
                      Active
                    </span>
                  </div>

                  <div className="mt-[18px]">
                    <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-clay-600">
                      Your rate, in plain sight
                    </div>
                    <div className="mt-2 font-display text-[30px] font-semibold tracking-[-0.02em] text-ink-900">
                      Interchange<span className="whitespace-nowrap text-clay-500"> + 0.32%</span>
                    </div>
                    <div className="mt-[5px] text-[12.5px] text-ink-500">No bundled markup. No surprise fees.</div>
                  </div>

                  <div className="mb-[14px] mt-4 h-px bg-ink-100" />

                  <div className="flex items-center gap-2 text-[12px] text-ink-500">
                    <MapPin size={15} strokeWidth={1.85} />
                    <span>Built in Austin, TX</span>
                    <span className="h-[3px] w-[3px] rounded-full bg-ink-300" />
                    <span>Backed by Maverick</span>
                  </div>
                </div>

                {/* floating payout chip */}
                <div
                  className="absolute z-[3] flex items-center gap-[11px] rounded-md border border-border-default shadow-lg"
                  style={{ left: -22, bottom: -20, background: "var(--surface-card)", padding: "12px 15px", transform: "rotate(-4deg)" }}
                >
                  <span className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-full bg-amber-100 text-amber-700">
                    <ArrowDownToLine size={18} strokeWidth={2.4} />
                  </span>
                  <div>
                    <div className="text-[14px] font-bold leading-none text-ink-900">$2,480.00</div>
                    <div className="mt-0.5 text-[11.5px] text-ink-500">Paid out · arrives tomorrow</div>
                  </div>
                </div>
              </div>
            </TiltPanel>
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
