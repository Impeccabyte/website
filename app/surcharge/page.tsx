import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight, Check, Gauge, Ban, CreditCard, ClipboardCheck, Receipt, DoorOpen, Store, ScrollText,
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
  title: "Surcharging — let credit pay for credit",
  description:
    "Surcharging adds a small fee when a customer chooses to pay by credit card — the payment type that costs you the most. Here are all the rules, up front.",
  ...ogImages("surcharge", "Impeccabyte — let credit pay for itself"),
};

const RULES = [
  {
    icon: Gauge,
    tone: "clay" as const,
    title: "There's a 3% cap",
    body: "Never more than 3% (2% in Colorado), and never more than credit costs you.",
  },
  {
    icon: Ban,
    tone: "brick" as const,
    title: "Not legal everywhere",
    body: "Prohibited in six jurisdictions — CA, CT, ME, MA, OK, and Puerto Rico.",
  },
  {
    icon: CreditCard,
    tone: "clay" as const,
    title: "Credit cards only",
    body: "Never on debit, PIN debit, or prepaid — those run at your normal rate.",
  },
  {
    icon: ClipboardCheck,
    tone: "clay" as const,
    title: "Registration required",
    body: "Your bank registers you with the card brands first — so plan for lead time.",
  },
];

const DISCLOSURES = [
  { icon: DoorOpen, term: "Point of entry", body: "your door, or your site's entry/checkout." },
  { icon: Store, term: "Point of sale", body: "the register, terminal, or checkout page." },
  { icon: ScrollText, term: "On the receipt", body: "itemized as its own separate line." },
];

const MATH = [
  { label: "$100 sale", a: "$100.00", b: "$100.00" },
  { label: "Surcharge line", a: "—", b: "+ $2.50" },
  { label: "Customer pays", a: "$100.00", b: "$102.50" },
  { label: "You net", a: "~$100 (less debit rate)", b: "~$100.00" },
];

const WORKS_FOR = [
  "Businesses with meaningful debit volume — keep debit cheap, let credit pay its own way",
  "B2B and professional services, where large credit-card invoices are the expensive ones",
  "Merchants operating entirely outside the six prohibited jurisdictions",
  "Owners who want the fee visible and itemized rather than baked into the price tag",
];

const NOT_FOR = [
  "You do business in California, Connecticut, Maine, Massachusetts, Oklahoma, or Puerto Rico",
  "You can't reliably manage signage, receipts, and staff training — the rules aren't optional",
  "Your customers are overwhelmingly credit, and a visible fee on nearly every sale would sting",
  "You want to be live next week — registration takes time",
];

export default function SurchargePage() {
  return (
    <>
      {/* Hero */}
      <section className="px-6 pt-16 pb-12">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <Eyebrow>Pricing programs · Surcharging</Eyebrow>
              <h1 className="mt-4 font-display font-semibold text-ink-900" style={{ fontSize: "clamp(36px,4.6vw,54px)", lineHeight: 1.05 }}>
                Let credit pay for <span className="em">credit.</span>
              </h1>
              <p className="mt-5 max-w-[520px] text-[19px] leading-relaxed text-ink-600">
                Surcharging adds a small fee when a customer chooses to pay by credit card — the payment
                type that costs you the most. Debit customers pay nothing extra. Cash customers pay nothing
                extra. Your cost of accepting credit goes down.
              </p>
              <p className="mt-4 max-w-[520px] text-[16px] leading-relaxed text-ink-500">
                It's a real program with real rules. Here's all of them, up front.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
                <ButtonLink href="/contact" variant="primary" size="lg">
                  Get a free statement analysis
                </ButtonLink>
                <a href="#surcharge-rules" className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-clay-600 hover:text-clay-700">
                  Read the rules
                  <ArrowRight size={16} strokeWidth={2.2} />
                </a>
              </div>
              <p className="mt-4 text-[13.5px] text-ink-400">
                We'll show you your actual numbers before you decide anything.
              </p>
            </div>
            <TiltPanel
              gradient="radial-gradient(120% 100% at 75% 12%, var(--amber-50), var(--clay-50) 72%)"
              interactive={false}
            >
              <ReceiptGraphic />
            </TiltPanel>
          </div>
        </Container>
      </section>

      {/* The honest version */}
      <section className="px-6 py-20">
        <Container width="narrow">
          <SectionIntro eyebrow="The honest version" title="What surcharging actually is" />
          <p className="mt-6 text-[18px] leading-relaxed text-ink-700">
            A surcharge is an additional fee you add to a customer's bill{" "}
            <strong className="font-semibold text-ink-900">when they pay with a credit card</strong>. That's
            it. It's a separate line on the receipt, it's disclosed before they buy, and it exists to offset
            what that credit transaction costs you.
          </p>
          <blockquote className="my-8 font-display text-[24px] italic leading-snug text-ink-800">
            The key word is credit.
          </blockquote>
          <p className="text-[18px] leading-relaxed text-ink-700">
            Surcharging is narrower than most people assume — and the narrowness is the whole compliance story.
          </p>
        </Container>
      </section>

      {/* The rules */}
      <section id="surcharge-rules" className="scroll-mt-24 px-6 py-20">
        <Container>
          <SectionIntro eyebrow="The rules — read these first" title="Straight about the limits" width="640px">
            We're going to front-load the limits, because this is the program where the rules bite.
          </SectionIntro>
          <div className="mt-10 grid gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
            {RULES.map((r) => (
              <Card key={r.title} padding="lg" className={r.tone === "brick" ? "border-brick-100 bg-brick-50" : undefined}>
                <span
                  className={
                    "inline-flex h-[52px] w-[52px] items-center justify-center rounded-md " +
                    (r.tone === "brick" ? "bg-brick-100 text-brick-600" : "bg-clay-50 text-clay-600")
                  }
                >
                  <r.icon size={24} strokeWidth={1.85} />
                </span>
                <h3 className="mt-4 text-[17px] font-bold text-ink-900">{r.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-600">{r.body}</p>
              </Card>
            ))}
          </div>

          {/* Disclosure callout */}
          <div className="mx-auto mt-8 max-w-[820px] rounded-lg border border-clay-100 bg-clay-50 p-7">
            <p className="text-[17px] font-bold text-ink-900">
              You have to disclose it — two places, plus the receipt
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {DISCLOSURES.map((d) => (
                <div key={d.term}>
                  <d.icon size={20} strokeWidth={2} className="text-clay-500" />
                  <p className="mt-2 text-[14.5px] leading-snug text-ink-700">
                    <strong className="font-semibold text-ink-900">{d.term}</strong> — {d.body}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-5 border-t border-clay-100 pt-4 text-[13.5px] leading-relaxed text-ink-500">
              We provide the compliant signage and disclosure language from our processing partner. We don't
              improvise this part — and you shouldn't let anyone else improvise it for you either.
            </p>
          </div>
        </Container>
      </section>

      {/* The math */}
      <section className="px-6 py-20">
        <Container width="narrow">
          <SectionIntro eyebrow="The math" title="How the pricing works" />
          <p className="mt-6 text-[17px] leading-relaxed text-ink-600">
            All credit cards get surcharged at the same rate, and an offsetting flat rate is assigned to you
            so the two cancel out.
          </p>
          <div className="mt-8 overflow-x-auto rounded-lg border border-border-default bg-white">
            <table className="w-full min-w-[480px] border-collapse text-left">
              <thead>
                <tr className="border-b border-ink-200">
                  <th className="w-[38%] px-5 py-4" />
                  <th className="px-5 py-4 text-[15px] font-bold text-ink-900">
                    <span className="inline-flex items-center gap-1.5"><CreditCard size={14} strokeWidth={2} className="text-ink-400" />Debit / cash</span>
                  </th>
                  <th className="px-5 py-4 text-[15px] font-bold text-clay-700">
                    <span className="inline-flex items-center gap-1.5"><CreditCard size={14} strokeWidth={2} className="text-clay-500" />Credit</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {MATH.map((m) => (
                  <tr key={m.label} className="border-b border-ink-100 last:border-0">
                    <td className="px-5 py-3.5 text-[14px] font-semibold text-ink-700">{m.label}</td>
                    <td className="px-5 py-3.5 text-[14px] text-ink-600">{m.a}</td>
                    <td className="bg-clay-50/60 px-5 py-3.5 text-[14px] text-ink-800">{m.b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-5 text-[14px] leading-relaxed text-ink-500">
            The credit customer sees exactly what the fee is, itemized on the receipt. Nothing is hidden —
            that's by design, and honestly, it's the version of this we like. Unlike cash discount,{" "}
            <strong className="font-semibold text-ink-700">offline and PIN debit can be priced separately</strong>,
            so you can run a genuinely competitive debit rate while credit carries its own weight.
          </p>
        </Container>
      </section>

      {/* Surcharge vs Cash Discount */}
      <section className="px-6 py-20">
        <Container width="wide">
          <SectionIntro eyebrow="Two tools, one goal" title="Surcharge vs. Cash Discount" width="640px">
            Same goal, different mechanics. Neither is "better" — they're different tools.
          </SectionIntro>
          <div className="mx-auto mt-10 max-w-[820px]">
            <ProgramComparison highlight="surcharge" leftLabel="Surcharging" rightLabel="Dual pricing" />
            <div className="mt-6 text-center">
              <Link href="/cash-discount" className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-clay-600 hover:text-clay-700">
                Compare with dual pricing
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
              If any of those describe you,{" "}
              <Link href="/cash-discount" className="font-semibold text-clay-600 hover:text-clay-700">cash discount</Link>{" "}
              or{" "}
              <Link href="/pricing" className="font-semibold text-clay-600 hover:text-clay-700">straightforward interchange-plus pricing</Link>{" "}
              is likely the better answer. We'll say so.
            </p>
          </div>
        </Container>
      </section>

      <DarkCTA
        titleA="Let's start with"
        titleEm="your statement."
        body="Before we recommend surcharging or anything else, we read your current statement and show you, line by line, what you're paying — and what your credit vs. debit mix really looks like. It's free, takes about a day, and there's no obligation on the other side of it."
        primary={{ label: "Send us your statement", href: "/contact" }}
        secondary={{ label: "Book a 15-minute call", href: "/contact" }}
      />

      <section className="px-6 pb-16">
        <Container>
          <p className="mx-auto max-w-[1000px] text-[11.5px] leading-relaxed text-ink-400">
            Impeccabyte, LLC is an authorized agent of Maverick Payments. Surcharge caps, prohibited
            jurisdictions, registration requirements, and disclosure rules are set by the card brands, state
            law, and our processing partner, and are subject to change. Figures shown are illustrative — your
            actual rates and savings depend on your volume, card mix, and current pricing.
          </p>
        </Container>
      </section>
    </>
  );
}

/* ---------------- Hero graphic ---------------- */

function ReceiptGraphic() {
  return (
    <div className="relative">
      <div
        className="w-[268px] rounded-lg border border-ink-100 bg-white p-5 shadow-md"
        style={{ transform: "rotate(-2deg)" }}
      >
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-md bg-clay-50 text-clay-600">
            <Receipt className="h-5 w-5" />
          </span>
          <div className="text-[13px] font-bold leading-tight text-ink-900">Receipt · $100 sale</div>
        </div>
        <div className="space-y-2.5 text-[13.5px]">
          <div className="flex items-center justify-between">
            <span className="text-ink-600">Subtotal</span>
            <span className="font-medium text-ink-900">$100.00</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-clay-600">Credit surcharge</span>
            <span className="font-medium text-clay-600">+ $2.50</span>
          </div>
          <div className="flex items-center justify-between border-t border-dashed border-ink-200 pt-2.5">
            <span className="font-semibold text-ink-900">Credit total</span>
            <span className="font-bold text-ink-900">$102.50</span>
          </div>
        </div>
        <p className="mt-4 rounded-md bg-ink-50 px-3 py-2 text-[11.5px] leading-snug text-ink-500">
          Debit &amp; cash pay $100.00 — no surcharge
        </p>
      </div>

      <div className="absolute -bottom-4 -left-3 flex items-center gap-1.5 rounded-pill bg-white px-3 py-1.5 text-[12px] font-medium text-ink-700 shadow-md">
        <Check size={13} strokeWidth={2.6} className="text-sage-500" />
        Itemized &amp; disclosed
      </div>
    </div>
  );
}
