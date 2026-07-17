import type { Metadata } from "next";
import { ArrowRight, MapPin, Store, Headset, UserCheck } from "lucide-react";
import { Container } from "@/components/site/container";
import { Card } from "@/components/ui/card";
import { IconChip } from "@/components/ui/icon-chip";
import { Wordmark } from "@/components/site/wordmark";
import { ButtonLink } from "@/components/ui/button-link";
import { CheckItem } from "@/components/site/bits";
import { DarkCTA } from "@/components/site/dark-cta";
import { ogImages } from "@/lib/og/meta";

export const metadata: Metadata = {
  title: "Austin LGBT Chamber of Commerce — member pricing & local support",
  description:
    "A proud member of the Austin LGBT Chamber of Commerce. Fellow members get our best pricing from day one, a waived monthly minimum, free on-site onboarding, and a dedicated local contact.",
  ...ogImages("chamber", "Impeccabyte — a proud Austin LGBT Chamber of Commerce member and local partner"),
};

/** Rainbow treatments shared across the page — the Chamber's pride mark. */
const RAINBOW_CONIC =
  "conic-gradient(from 90deg,#E4572E,#E0A04D,#E8C34A,#5E9E6E,#4A79B8,#7E5AA2,#E4572E)";
const RAINBOW_LINEAR = "linear-gradient(180deg,#E4572E,#E0A04D,#E8C34A,#5E9E6E,#4A79B8,#7E5AA2)";

const PERKS = [
  <>
    <strong className="text-ink-900">Our Growth margin from day one</strong> — 0.32% + 10¢ over
    interchange, at any volume.
  </>,
  <>
    <strong className="text-ink-900">Monthly minimum waived</strong> for your first year — the usual
    $100 is on us.
  </>,
  <>
    <strong className="text-ink-900">Free on-site onboarding</strong>{" "}
    anywhere in the Austin area — we&rsquo;ll set it up in person.
  </>,
  <>
    <strong className="text-ink-900">A dedicated local contact</strong> — one person who knows you
    and your business.
  </>,
];

const LOCAL = [
  {
    icon: MapPin,
    tone: "clay" as const,
    title: "Based in Austin",
    body: "We live and work right here in Austin — not a call center three time zones away.",
  },
  {
    icon: Store,
    tone: "amber" as const,
    title: "On-site when it counts",
    body: "New POS, a big launch, a busy season? We'll come to your counter and set it up in person.",
  },
  {
    icon: Headset,
    tone: "sage" as const,
    title: "Remote, same day",
    body: "Screen-share, call, or text a real person and get answers today — not a ticket in a queue.",
  },
  {
    icon: UserCheck,
    tone: "clay" as const,
    title: "One team, end to end",
    body: "The person who onboards you is the person who picks up when you call. No handoffs, no runaround.",
  },
];

export default function ChamberPage() {
  return (
    <>
      {/* Hero */}
      <section className="px-6 pt-[72px] pb-10">
        <Container>
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <span className="inline-flex items-center gap-2.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-clay-600">
                <span
                  aria-hidden
                  className="h-4 w-4 rounded-round"
                  style={{ background: RAINBOW_CONIC }}
                />
                Austin LGBT Chamber of Commerce
              </span>
              <h1
                className="mt-4 font-display font-semibold tracking-[-0.025em] text-ink-900"
                style={{ fontSize: "clamp(38px,5vw,58px)", lineHeight: 1.04 }}
              >
                A proud member,
                <br />
                <span className="em">and a local partner.</span>
              </h1>
              <p className="mt-[22px] max-w-[500px] text-[19px] leading-relaxed text-ink-600">
                We&rsquo;re a proud member of the Austin LGBT Chamber of Commerce — and we back our
                fellow members with special pricing and hands-on, local support. Payments help from
                neighbors, not a call center.
              </p>
              <div className="mt-[30px] flex flex-wrap items-center gap-5">
                <ButtonLink href="/contact" variant="primary" size="lg">
                  Get a Quote
                </ButtonLink>
                <a
                  href="#member-pricing"
                  className="inline-flex items-center gap-1.5 whitespace-nowrap text-[16px] font-semibold text-clay-600 transition-colors hover:text-clay-700"
                >
                  See member pricing
                  <ArrowRight size={17} strokeWidth={2} />
                </a>
              </div>
            </div>

            {/* Membership card mockup */}
            <div className="relative min-h-[340px]">
              <div
                aria-hidden
                className="pointer-events-none absolute"
                style={{
                  inset: "-8% -4% 0 -4%",
                  background:
                    "radial-gradient(58% 52% at 64% 30%, rgba(224,160,77,0.28), transparent 70%)",
                  filter: "blur(8px)",
                  zIndex: 0,
                }}
              />
              <div
                aria-hidden
                className="absolute rounded-lg shadow-md"
                style={{
                  top: 10,
                  right: 16,
                  width: 300,
                  height: 188,
                  background: "linear-gradient(135deg, var(--clay-400), var(--amber-400))",
                  transform: "rotate(6deg)",
                  zIndex: 1,
                }}
              />
              <div
                className="relative ml-auto overflow-hidden rounded-lg border border-border-default bg-white shadow-lg"
                style={{
                  zIndex: 2,
                  maxWidth: 376,
                  transform: "rotate(-1.4deg)",
                  padding: "26px 26px 22px 30px",
                }}
              >
                <div
                  aria-hidden
                  className="absolute bottom-0 left-0 top-0"
                  style={{ width: 6, background: RAINBOW_LINEAR }}
                />
                <div className="flex items-center justify-between">
                  <Wordmark size={17} emblem={30} />
                  <span
                    aria-hidden
                    className="rounded-round"
                    style={{ width: 30, height: 30, flex: "none", background: RAINBOW_CONIC }}
                  />
                </div>
                <div className="mt-8">
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-clay-600">
                    Chamber member
                  </span>
                  <div
                    className="mt-1.5 font-display font-semibold tracking-[-0.01em] text-ink-900"
                    style={{ fontSize: 25, lineHeight: 1.12 }}
                  >
                    Austin LGBT Chamber
                    <br />
                    of Commerce
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-ink-100 pt-3.5">
                  <span className="text-[12.5px] text-ink-500">Verified merchant partner</span>
                  <span className="text-[12.5px] font-bold text-ink-700">Est. 2026</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Member pricing */}
      <section id="member-pricing" className="scroll-mt-[88px] px-6 pt-[52px] pb-2">
        <Container>
          <div className="mx-auto mb-8 max-w-[600px] text-center">
            <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-clay-600">
              Member pricing
            </span>
            <h2
              className="mt-3 font-display font-semibold tracking-[-0.02em] text-ink-900"
              style={{ fontSize: "clamp(28px,3.4vw,40px)" }}
            >
              A better rate, just for members
            </h2>
            <p className="mt-3 text-[16px] leading-relaxed text-ink-600">
              Show us your Austin LGBT Chamber of Commerce membership and we&rsquo;ll set you up with
              our best pricing from day one — plus a few perks to help you get going.
            </p>
          </div>

          <Card tone="brand" padding="lg" className="mx-auto max-w-[960px] border-[1.5px] border-clay-300 p-10">
            <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="text-center">
                <span className="inline-flex items-center gap-1.5 rounded-pill border border-clay-100 bg-clay-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-clay-700">
                  Member rate
                </span>
                <div
                  className="mt-4 font-display font-semibold tracking-[-0.02em] text-clay-600"
                  style={{ fontSize: 52, lineHeight: 1 }}
                >
                  0.32%
                  <span className="text-[24px] text-ink-400"> + 10¢</span>
                </div>
                <div className="mt-2 text-[13px] text-ink-400">margin over interchange — from day one</div>
                <p className="mx-auto mt-4 max-w-[280px] text-[13.5px] leading-relaxed text-ink-600">
                  Normally reserved for businesses doing $25K+ a month. As a Chamber member, it&rsquo;s
                  yours at any volume.
                </p>
              </div>
              <div>
                <div className="flex flex-col gap-[15px]">
                  {PERKS.map((perk, i) => (
                    <CheckItem key={i}>{perk}</CheckItem>
                  ))}
                </div>
                <div className="mt-6">
                  <ButtonLink href="/contact" variant="primary" size="lg">
                    Get a Quote
                  </ButtonLink>
                </div>
              </div>
            </div>
          </Card>
          <p className="mx-auto mt-5 max-w-[640px] text-center text-[13px] leading-relaxed text-ink-400">
            Available to verified members of the Austin LGBT Chamber of Commerce. Margin shown is added
            to pass-through interchange; final pricing depends on card mix, ticket size, and business
            type.
          </p>
        </Container>
      </section>

      {/* Why Impeccabyte — local support */}
      <section className="px-6 pt-16 pb-2">
        <Container>
          <div className="mx-auto mb-8 max-w-[600px] text-center">
            <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-clay-600">
              Why Impeccabyte
            </span>
            <h2
              className="mt-3 font-display font-semibold tracking-[-0.02em] text-ink-900"
              style={{ fontSize: "clamp(28px,3.4vw,40px)" }}
            >
              Payments help that&rsquo;s actually local
            </h2>
            <p className="mt-3 text-[16px] leading-relaxed text-ink-600">
              We&rsquo;re right here in Austin — so when you need a hand, you get a neighbor who&rsquo;ll
              show up, remotely or in person, whenever you need us.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LOCAL.map((c) => (
              <Card key={c.title} padding="lg" className="h-full">
                <IconChip icon={c.icon} tone={c.tone} size={46} />
                <h3 className="mt-4 text-[17px] font-bold text-ink-900">{c.title}</h3>
                <p className="mt-[7px] text-[14px] leading-relaxed text-ink-600">{c.body}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <DarkCTA
        titleA="Let's get you"
        titleEm="set up."
        body="Tell us you're a Chamber member and we'll build your quote with member pricing from the start."
        primary={{ label: "Get a Quote", href: "/contact" }}
        secondary={{ label: "Talk to us", href: "/contact" }}
      />
    </>
  );
}
