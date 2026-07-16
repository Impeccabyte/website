import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight, Check, Gauge, MapPinned, Zap, CreditCard, Tag, Banknote,
} from "lucide-react";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionIntro } from "@/components/site/bits";
import { DarkCTA } from "@/components/site/dark-cta";
import { TiltPanel } from "@/components/site/tilt-panel";
import { ProgramComparison } from "@/components/site/program-comparison";
import { FitPanels } from "@/components/site/fit-panels";
import { ogImages } from "@/lib/og/meta";

export const metadata: Metadata = {
  title: "Cash Discount — stop paying to get paid",
  description:
    "Dual pricing lets you keep the same margin on a card sale that you keep on a cash sale. Legal in all 50 states, no card-brand registration, net card cost near zero.",
  ...ogImages("cash-discount", "Impeccabyte — stop paying to get paid"),
};

const MATH = [
  { label: "Price they see", cash: "$100.00", card: "$103.50" },
  { label: "Processing cost", cash: "$0", card: "~$3.50" },
  { label: "You keep", cash: "$100.00", card: "~$100.00" },
];

const CHECKS = [
  { lead: "All card types are priced the same flat rate", rest: " — credit, offline debit, PIN debit. One rate, no sorting." },
  { lead: "Debit isn't priced separately.", rest: " Some programs try to; this one doesn't, and that's the compliant way to do it." },
  { lead: "A rate is passed to the cardholder and an offsetting flat rate is assigned to you.", rest: " The two cancel out — that's the mechanism under the price tag." },
  { lead: "EBT is excluded.", rest: " If you take EBT, those transactions sit outside the program." },
];

const RULES = [
  { icon: Gauge, title: "There's a 4% cap", body: "The card price can't rise more than 4%, or more than processing costs you." },
  { icon: MapPinned, title: "Legal in all 50 states", body: "No state carve-outs to work around — it runs the same way wherever you operate." },
  { icon: Zap, title: "No registration required", body: "Some programs make you register and wait. This one doesn't." },
  { icon: CreditCard, title: "All card types but EBT", body: "Credit, offline debit, and PIN debit are all included at one flat rate. EBT stays out." },
];

const DISCLOSURES = [
  { lead: "Advertise the card price", rest: " (the higher of the two) and no additional disclosure to the cardholder is required. That's the cleanest way to run it." },
  { lead: "Post both prices if you'd rather be explicit", rest: " — but only the card price is required." },
  { lead: "This isn't a surcharge program,", rest: " so there's no surcharge notice to post at the door or the register." },
];

const WORKS_FOR = [
  "Cash-heavy businesses — shops, service trades, quick-serve, salons, corner retail",
  "Thin-margin businesses where processing is a real line item, not a rounding error",
  "Owners whose customers are price-aware but not price-shopping across the street",
  "Anyone who's watched their effective rate creep up year after year and had enough",
];

const NOT_FOR = [
  "Customers will read the card price as a penalty and walk",
  "Competitors all advertise a single price and you'd stand out badly",
  "Your card volume is small enough that the savings won't move your P&L",
  "You'd rather have clean interchange-plus pricing and just pay a fair markup",
];

export default function CashDiscountPage() {
  return (
    <>
      {/* Hero */}
      <section className="px-6 pt-16 pb-12">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <Eyebrow>Pricing programs · Cash discount</Eyebrow>
              <h1 className="mt-4 font-display font-semibold text-ink-900" style={{ fontSize: "clamp(36px,4.6vw,54px)", lineHeight: 1.05 }}>
                Stop paying to <span className="em">get paid.</span>
              </h1>
              <p className="mt-5 max-w-[520px] text-[19px] leading-relaxed text-ink-600">
                Dual pricing lets you keep the same margin on a card sale that you keep on a cash sale.
                Card-paying customers cover the processing cost; cash customers get a discount. You keep your
                profit.
              </p>
              <p className="mt-4 max-w-[520px] text-[16px] leading-relaxed text-ink-500">
                It's legal in all 50 states, needs no card-brand registration, and can take your net cost of
                accepting cards down close to nothing.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
                <ButtonLink href="/contact" variant="primary" size="lg">
                  Get a free statement analysis
                </ButtonLink>
                <a href="#dual-math" className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-clay-600 hover:text-clay-700">
                  See the math
                  <ArrowRight size={16} strokeWidth={2.2} />
                </a>
              </div>
              <p className="mt-4 text-[13.5px] text-ink-400">
                We'll show you your actual numbers before you decide anything.
              </p>
            </div>
            <TiltPanel
              gradient="radial-gradient(120% 100% at 75% 12%, var(--sage-50), var(--amber-50) 74%)"
              interactive={false}
            >
              <DualPriceGraphic />
            </TiltPanel>
          </div>
        </Container>
      </section>

      {/* The honest version */}
      <section className="px-6 py-20">
        <Container width="narrow">
          <SectionIntro eyebrow="The honest version" title="What dual pricing actually is" />
          <p className="mt-6 text-[18px] leading-relaxed text-ink-700">
            Every time you take a card, a piece of that sale goes to the card networks and the bank. On cash,
            you keep all of it — so on identical sales, you make less on the card one. Most owners have just
            accepted that for years.
          </p>
          <p className="mt-5 text-[18px] leading-relaxed text-ink-700">
            Dual pricing fixes the gap at the price tag. You set your listed price to reflect what a card sale
            actually costs you — a small percentage increase — and offer a{" "}
            <strong className="font-semibold text-ink-900">discount to anyone paying cash</strong> or another
            non-card method.
          </p>
          <blockquote className="my-8 font-display text-[24px] italic leading-snug text-ink-800">
            Two prices. One card, one cash. The customer picks.
          </blockquote>
          <p className="text-[18px] leading-relaxed text-ink-700">
            The card price covers your processing cost. The cash price is your old price. Either way, you end
            up with the margin you meant to have.
          </p>
        </Container>
      </section>

      {/* The math */}
      <section id="dual-math" className="scroll-mt-24 px-6 py-20">
        <Container width="narrow">
          <SectionIntro eyebrow="The math" title="How the math works" />
          <p className="mt-6 text-[17px] leading-relaxed text-ink-600">
            A $100 item you'd normally net $100 on in cash, but about $97 after processing on a card.
          </p>
          <div className="mt-8 overflow-x-auto rounded-lg border border-border-default bg-white">
            <table className="w-full min-w-[480px] border-collapse text-left">
              <thead>
                <tr className="border-b border-ink-200">
                  <th className="w-[38%] px-5 py-4" />
                  <th className="px-5 py-4 text-[15px] font-bold text-ink-900">
                    <span className="inline-flex items-center gap-1.5"><Banknote size={14} strokeWidth={2} className="text-ink-400" />Cash</span>
                  </th>
                  <th className="px-5 py-4 text-[15px] font-bold text-clay-700">
                    <span className="inline-flex items-center gap-1.5"><CreditCard size={14} strokeWidth={2} className="text-clay-500" />Card</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {MATH.map((m) => (
                  <tr key={m.label} className="border-b border-ink-100 last:border-0">
                    <td className="px-5 py-3.5 text-[14px] font-semibold text-ink-700">{m.label}</td>
                    <td className="px-5 py-3.5 text-[14px] text-ink-600">{m.cash}</td>
                    <td className="bg-clay-50/60 px-5 py-3.5 text-[14px] text-ink-800">{m.card}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <blockquote className="my-8 text-center font-display text-[21px] italic leading-snug text-ink-700">
            Same margin, either way. That's the whole idea.
          </blockquote>
          <ul className="space-y-3.5">
            {CHECKS.map((c) => (
              <li key={c.lead} className="flex items-start gap-2.5">
                <Check size={19} strokeWidth={2.4} className="mt-1 shrink-0 text-sage-500" />
                <span className="text-[15.5px] leading-relaxed text-ink-700">
                  <strong className="font-semibold text-ink-900">{c.lead}</strong>
                  {c.rest}
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* The rules */}
      <section className="px-6 py-20">
        <Container>
          <SectionIntro eyebrow="The rules — and the ceiling" title="Straight about the limits" width="640px">
            The operators who get in trouble with this are the ones who were never told them. So here they are.
          </SectionIntro>
          <div className="mt-10 grid gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
            {RULES.map((r) => (
              <Card key={r.title} padding="lg">
                <span className="inline-flex h-[52px] w-[52px] items-center justify-center rounded-md bg-clay-50 text-clay-600">
                  <r.icon size={24} strokeWidth={1.85} />
                </span>
                <h3 className="mt-4 text-[17px] font-bold text-ink-900">{r.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-600">{r.body}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Disclosure */}
      <section className="px-6 py-20">
        <Container width="narrow">
          <SectionIntro eyebrow="Disclosure" title="What you have to tell customers" />
          <p className="mt-6 text-[17px] leading-relaxed text-ink-600">
            Less than you'd think — and simpler than most agents make it sound. We'll walk your staff through
            it and hand you compliant materials from our processing partner. We don't improvise this part.
          </p>
          <ul className="mt-7 space-y-4">
            {DISCLOSURES.map((d) => (
              <li key={d.lead} className="flex items-start gap-2.5">
                <Check size={19} strokeWidth={2.4} className="mt-1 shrink-0 text-sage-500" />
                <span className="text-[15.5px] leading-relaxed text-ink-700">
                  <strong className="font-semibold text-ink-900">{d.lead}</strong>
                  {d.rest}
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Surcharge vs Cash Discount */}
      <section className="px-6 py-20">
        <Container width="wide">
          <SectionIntro eyebrow="Two tools, one goal" title="Surcharge vs. Cash Discount" width="640px">
            Same goal, different mechanics. Neither is "better" — they're different tools.
          </SectionIntro>
          <div className="mx-auto mt-10 max-w-[820px]">
            <ProgramComparison highlight="cashDiscount" />
            <div className="mt-6 text-center">
              <Link href="/surcharge" className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-clay-600 hover:text-clay-700">
                Compare with surcharging
                <ArrowRight size={16} strokeWidth={2.2} />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Who it's right for */}
      <section className="px-6 py-20">
        <Container>
          <SectionIntro eyebrow="Straight talk" title="Who this is actually right for" width="640px">
            We'd rather tell you no than sell you the wrong thing.
          </SectionIntro>
          <div className="mx-auto mt-10 max-w-[900px]">
            <FitPanels worksFor={WORKS_FOR} notFor={NOT_FOR} />
            <p className="mx-auto mt-8 max-w-[680px] text-center text-[15px] leading-relaxed text-ink-500">
              If that last one is you, say so. We'll price you{" "}
              <Link href="/pricing" className="font-semibold text-clay-600 hover:text-clay-700">interchange-plus</Link>{" "}
              and tell you our markup, in writing. Dual pricing is a tool, not a religion.
            </p>
          </div>
        </Container>
      </section>

      <DarkCTA
        titleA="Let's start with"
        titleEm="your statement."
        body="Before we recommend dual pricing or anything else, we read your current statement and show you, line by line, what you're actually paying. It's free, takes about a day, and there's no obligation on the other side of it."
        primary={{ label: "Send us your statement", href: "/contact" }}
        secondary={{ label: "Book a 15-minute call", href: "/contact" }}
      />

      <section className="px-6 pb-16">
        <Container>
          <p className="mx-auto max-w-[1000px] text-[11.5px] leading-relaxed text-ink-400">
            Impeccabyte, LLC is an authorized agent of Maverick Payments. Program terms, caps, and disclosure
            requirements are set by the card brands and our processing partner and are subject to change.
            Figures shown are illustrative — your actual rates and savings depend on your volume, card mix,
            and current pricing.
          </p>
        </Container>
      </section>
    </>
  );
}

/* ---------------- Hero graphic ---------------- */

function DualPriceGraphic() {
  return (
    <div className="relative">
      <div
        className="w-[280px] rounded-lg border border-ink-100 bg-white p-5 shadow-md"
        style={{ transform: "rotate(-2deg)" }}
      >
        <div className="text-[12px] font-bold uppercase tracking-[0.08em] text-ink-500">Same $100 sale</div>
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <div className="rounded-md border border-sage-100 bg-sage-50 p-3">
            <div className="flex items-center gap-1.5 text-[12px] font-semibold text-sage-600">
              <Banknote className="h-4 w-4" />
              Cash
            </div>
            <div className="mt-2 text-[20px] font-bold text-ink-900">$100.00</div>
            <div className="text-[11px] text-ink-500">they pay</div>
          </div>
          <div className="rounded-md border border-clay-100 bg-clay-50 p-3">
            <div className="flex items-center gap-1.5 text-[12px] font-semibold text-clay-600">
              <CreditCard className="h-4 w-4" />
              Card
            </div>
            <div className="mt-2 text-[20px] font-bold text-ink-900">$103.50</div>
            <div className="text-[11px] text-ink-500">they pay</div>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between rounded-md bg-ink-50 px-3 py-2.5">
          <span className="flex items-center gap-1.5 text-[12.5px] text-ink-600">
            <Tag className="h-3.5 w-3.5 text-ink-400" />
            You keep, either way
          </span>
          <span className="text-[14px] font-bold text-ink-900">~$100</span>
        </div>
      </div>

      <div className="absolute -bottom-4 -left-3 flex items-center gap-1.5 rounded-pill bg-white px-3 py-1.5 text-[12px] font-medium text-ink-700 shadow-md">
        <Check size={13} strokeWidth={2.6} className="text-sage-500" />
        Net card cost near zero
      </div>
    </div>
  );
}
