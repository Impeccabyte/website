import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight, ConciergeBell, Sparkles, BadgeDollarSign, Briefcase, Users, CalendarCheck, Sun,
  Plane, BedDouble, Coffee,
} from "lucide-react";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Card } from "@/components/ui/card";
import { IconChip } from "@/components/ui/icon-chip";
import { SectionIntro } from "@/components/site/bits";
import { TiltPanel } from "@/components/site/tilt-panel";
import { ogImages } from "@/lib/og/meta";

export const metadata: Metadata = {
  title: "Travel — a dedicated advisor for every client",
  description:
    "Every Impeccabyte client gets a dedicated travel advisor for trips, retreats, and vacations — real planning, VIP hotel perks, and one flat per-trip fee that drops to free as you grow.",
  ...ogImages("benefits-travel", "Impeccabyte — travel, handled impeccably"),
};

const BENEFITS = [
  {
    icon: ConciergeBell,
    tone: "clay" as const,
    title: "A real human advisor",
    body: "One dedicated advisor who learns how you like to travel — then plans, books, and handles changes so you don't have to.",
  },
  {
    icon: Sparkles,
    tone: "amber" as const,
    title: "VIP perks, standard",
    body: "Room upgrades, free breakfast, late checkout, and hotel credits at thousands of properties worldwide.",
  },
  {
    icon: BadgeDollarSign,
    tone: "sage" as const,
    title: "One flat fee per trip",
    body: "$99 per trip on Starter, $49 on Growth — and free on Scale and Enterprise. Booking rates match direct, often better.",
  },
];

const STEPS = [
  {
    n: "1",
    title: "Tell us where you're headed",
    body: "A trade show, a retreat, a beach. Dates, budget, and who's coming — that's all we need.",
  },
  {
    n: "2",
    title: "Your advisor plans and books",
    body: "Flights, hotels, and the details in between — with perks negotiated in before you ever check in.",
  },
  {
    n: "3",
    title: "Travel with backup",
    body: "Flight moved, plans changed? Text your advisor and it's handled — you never wait on hold.",
  },
];

const GOOD_FOR = [
  { icon: Briefcase, title: "Buying trips & trade shows", body: "Market weeks and expos, booked around your schedule." },
  { icon: Users, title: "Team retreats & offsites", body: "Group blocks and venues without the group-planning headache." },
  { icon: CalendarCheck, title: "Client dinners & events", body: "The right table or venue when it matters to the relationship." },
  { icon: Sun, title: "The vacation you've earned", body: "Yes, personal trips count. Especially personal trips." },
];

const FEES = [
  { tier: "Starter", range: "Up to $25K / mo", fee: "$99 / trip", free: false },
  { tier: "Growth", range: "$25K – $100K / mo", fee: "$49 / trip", free: false },
  { tier: "Scale & Enterprise", range: "$100K+ / mo", fee: "Free", free: true },
];

export default function BenefitsTravelPage() {
  return (
    <>
      {/* Hero */}
      <section className="px-6 pt-16 pb-12">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <Eyebrow>Benefits · Travel</Eyebrow>
              <h1 className="mt-4 font-display font-semibold text-ink-900" style={{ fontSize: "clamp(36px,4.6vw,54px)", lineHeight: 1.05 }}>
                Travel, handled <span className="em">impeccably.</span>
              </h1>
              <p className="mt-5 max-w-[520px] text-[19px] leading-relaxed text-ink-600">
                Every Impeccabyte client gets a dedicated travel advisor — for buying trips, team retreats,
                and the vacation you keep postponing. Real planning, VIP hotel perks, and one flat per-trip
                fee that drops to free as you grow.
              </p>
              <p className="mt-6 text-[13.5px] text-ink-400">
                Available to every Impeccabyte merchant account — free on Scale and Enterprise pricing.
              </p>
            </div>
            <TiltPanel
              gradient="radial-gradient(120% 100% at 75% 12%, var(--sage-50), var(--amber-50) 74%)"
              interactive={false}
            >
              <ItineraryGraphic />
            </TiltPanel>
          </div>
        </Container>
      </section>

      {/* The benefit */}
      <section className="px-6 py-20">
        <Container>
          <SectionIntro eyebrow="The benefit" title="Like having a travel person on staff" width="640px">
            Benefits are extras we've arranged for Impeccabyte clients — no upsell, just useful. Travel
            advising is the first.
          </SectionIntro>
          <div className="mt-10 grid gap-[18px] md:grid-cols-3">
            {BENEFITS.map((b) => (
              <Card key={b.title} padding="lg">
                <IconChip icon={b.icon} tone={b.tone} size={52} />
                <h3 className="mt-4 text-[19px] font-bold text-ink-900">{b.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-600">{b.body}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section id="travel-how" className="scroll-mt-24 px-6 py-20">
        <Container>
          <SectionIntro eyebrow="How it works" title="Three steps, zero tabs open" />
          <div className="mt-12 grid gap-x-10 gap-y-10 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n}>
                <div className="font-display text-[46px] font-semibold leading-none text-clay-400">{s.n}</div>
                <h3 className="mt-4 text-[18px] font-bold text-ink-900">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-600">{s.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Good for */}
      <section className="px-6 py-20">
        <Container>
          <SectionIntro eyebrow="Good for" title="Business trips and the other kind" />
          <div className="mt-10 grid gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
            {GOOD_FOR.map((g) => (
              <Card key={g.title} padding="lg">
                <g.icon size={24} strokeWidth={1.9} className="text-clay-500" />
                <h3 className="mt-4 text-[16px] font-bold text-ink-900">{g.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-600">{g.body}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* The fine print, up front */}
      <section className="px-6 py-20">
        <Container width="wide">
          <div className="rounded-lg border border-border-default bg-ink-50 p-8 sm:p-12">
            <div className="grid gap-10 md:grid-cols-2 md:gap-14">
              {/* Left: the explanation */}
              <div>
                <Eyebrow>The fine print, up front</Eyebrow>
                <h2 className="mt-3 font-display font-semibold text-ink-900" style={{ fontSize: "clamp(28px, 3.4vw, 38px)" }}>
                  How is this <span className="em">free?</span>
                </h2>
                <p className="mt-5 text-[16px] leading-relaxed text-ink-700">
                  Hotels and travel suppliers pay advisors a standard commission on bookings — so your rate
                  matches booking direct, often beats it, and the perks come standard.
                </p>
                <p className="mt-4 text-[16px] leading-relaxed text-ink-700">
                  We pass that along. On <strong className="font-semibold text-ink-900">Scale</strong> and{" "}
                  <strong className="font-semibold text-ink-900">Enterprise</strong> pricing, advising is free.
                  Earlier tiers pay one flat fee per trip — no markups, no surprises, nothing hidden on your
                  statement.
                </p>
                <Link href="/pricing" className="mt-5 inline-flex items-center gap-1.5 text-[15px] font-semibold text-clay-600 hover:text-clay-700">
                  See pricing tiers
                  <ArrowRight size={16} strokeWidth={2.2} />
                </Link>
              </div>

              {/* Right: fee-by-tier list */}
              <div>
                <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-ink-500">Advising fee, by pricing tier</p>
                <div className="mt-4 space-y-3">
                  {FEES.map((f) => (
                    <div
                      key={f.tier}
                      className={
                        "flex items-center justify-between gap-4 rounded-lg border p-4 " +
                        (f.free ? "border-sage-100 bg-sage-50" : "border-border-default bg-white")
                      }
                    >
                      <div>
                        <div className="text-[14.5px] font-bold text-ink-900">{f.tier}</div>
                        <div className="text-[12.5px] text-ink-500">{f.range}</div>
                      </div>
                      <span
                        className={
                          "inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-[13.5px] font-semibold " +
                          (f.free ? "bg-sage-100 text-sage-700" : "bg-clay-50 text-clay-700")
                        }
                      >
                        {f.free && <Sparkles size={14} strokeWidth={2} />}
                        {f.fee}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <div className="h-[88px]" />
    </>
  );
}

/* ---------------- Hero graphic ---------------- */

function ItineraryGraphic() {
  const rows = [
    { icon: Plane, main: "AUS → OAX · nonstop", meta: "Fri, Oct 9", tag: null },
    { icon: BedDouble, main: "Casa Criolla · king suite", meta: null, tag: "Upgraded" },
    { icon: Coffee, main: "Breakfast for two, daily", meta: null, tag: "Included" },
  ];
  return (
    <div className="relative">
      <div
        className="w-[348px] rounded-lg border border-ink-100 bg-white p-6 shadow-md"
        style={{ transform: "rotate(-2deg)" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[17px] font-bold leading-tight text-ink-900">Oaxaca · 5 nights</div>
            <div className="text-[12.5px] text-ink-500">Planned by your advisor</div>
          </div>
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-sage-50 text-sage-600">
            <Plane className="h-5 w-5" />
          </span>
        </div>

        <div className="mt-5 space-y-3">
          {rows.map((r) => (
            <div key={r.main} className="flex items-center gap-2.5 border-t border-ink-100 pt-3">
              <r.icon size={17} strokeWidth={2} className="shrink-0 text-ink-400" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13.5px] font-medium text-ink-800">{r.main}</div>
              </div>
              {r.meta && <span className="shrink-0 text-[12px] text-ink-500">{r.meta}</span>}
              {r.tag === "Upgraded" && (
                <span className="shrink-0 rounded-pill bg-sage-50 px-2 py-0.5 text-[11px] font-semibold text-sage-600">
                  {r.tag}
                </span>
              )}
              {r.tag === "Included" && (
                <span className="shrink-0 text-[11px] font-medium text-ink-500">{r.tag}</span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-ink-100 pt-4">
          <span className="text-[13.5px] font-medium text-ink-700">Hotel credit</span>
          <span className="rounded-pill bg-amber-50 px-3 py-1 text-[13.5px] font-bold text-amber-700">$100</span>
        </div>
      </div>

      {/* Advisor pill (top) */}
      <div className="absolute -top-4 left-4 flex items-center gap-2 rounded-pill bg-white px-3 py-1.5 shadow-md">
        <span className="flex h-6 w-6 items-center justify-center rounded-round bg-clay-500 text-[10px] font-semibold text-white">R</span>
        <span className="text-[12.5px] text-ink-700">Rosa · your advisor</span>
      </div>

      {/* Perks-applied stamp (bottom-right) */}
      <div className="absolute -bottom-7 -right-5 flex h-[88px] w-[88px] items-center justify-center rounded-round bg-amber-400 shadow-md">
        <div className="flex h-[64px] w-[64px] flex-col items-center justify-center rounded-round bg-white text-center">
          <Sparkles size={17} strokeWidth={2} className="text-amber-500" />
          <span className="mt-0.5 text-[8px] font-bold uppercase leading-[1.15] tracking-[0.07em] text-ink-800">
            Perks
            <br />
            applied
          </span>
        </div>
      </div>
    </div>
  );
}
