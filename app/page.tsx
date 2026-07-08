import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button-link";
import { AvatarGroup, Avatar } from "@/components/ui/avatar";
import { SectionIntro } from "@/components/site/bits";
import { ProductCard, SolutionCard } from "@/components/site/entry-card";
import { DarkCTA } from "@/components/site/dark-cta";
import { HeroCluster } from "@/components/home/hero-cluster";
import { Odometer } from "@/components/home/odometer";
import { homeFeatureKeys, homeSolutionKeys } from "@/lib/data";

const STEPS = [
  { n: "01", title: "Tell us about you", body: "Answer a few quick questions and we'll build a custom interchange-plus quote." },
  { n: "02", title: "Get approved fast", body: "Our team boards your account on Maverick's rails — usually within a business day." },
  { n: "03", title: "Get paid, fast", body: "Take your first payment and watch the money land — next day, or in minutes." },
];

export default function HomePage() {
  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="px-6 pt-16 pb-12">
        <Container>
          {/* Two columns only once there's comfortable room, so the floating
              hero cards never crowd the copy on smaller laptops. */}
          <div className="grid items-center gap-14 min-[1140px]:grid-cols-[1.05fr_0.95fr]">
            <div>
              <Eyebrow>Merchant services, without the friction</Eyebrow>
              <h1
                className="mt-4 font-display font-semibold text-ink-900"
                style={{ fontSize: "clamp(40px, 5.2vw, 62px)", lineHeight: 1.04 }}
              >
                Get paid,
                <br />
                <span className="em">impeccably.</span>
              </h1>
              <p className="mt-5 max-w-[480px] text-[19px] leading-relaxed text-ink-600">
                We handle the boring parts of getting paid — cards, checkout, invoices, payouts — so you can
                focus on the work you love. Transparent interchange-plus pricing, no corporate nonsense.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-5">
                <ButtonLink href="/contact" variant="primary" size="lg">
                  Get a quote
                </ButtonLink>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-1.5 text-[16px] font-semibold text-clay-600 hover:text-clay-700"
                >
                  See pricing <ArrowRight size={17} />
                </Link>
              </div>
              <div className="mt-10 flex items-center gap-4">
                <AvatarGroup names={["Jordan Reyes", "Mei Tan", "Sol Park", "Ada Okoye"]} />
                <p className="text-[14.5px] text-ink-600">
                  Trusted by <Odometer /> independent businesses
                </p>
              </div>
            </div>
            <HeroCluster />
          </div>
        </Container>
      </section>

      {/* ---------- Features ---------- */}
      <section className="px-6 py-20">
        <Container>
          <SectionIntro eyebrow="Everything you need" title="One toolkit for getting paid" align="left">
            No bolt-ons, no surprise fees. The tools that used to require an enterprise contract, ready the
            moment you sign up.
          </SectionIntro>
          <div className="mt-10 grid gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
            {homeFeatureKeys.map((k) => (
              <ProductCard key={k} keyName={k} variant="feature" />
            ))}
          </div>
          <p className="mt-8 text-center text-[15px] text-ink-500">
            Plus ACH &amp; eCheck · fraud &amp; dispute tools · reporting dashboard · instant payouts.
          </p>
        </Container>
      </section>

      {/* ---------- How it works ---------- */}
      <section className="px-6 py-20">
        <Container>
          <SectionIntro eyebrow="How it works" title="Up and running before your coffee's cold" width="560px" />
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n}>
                <div className="font-mono text-[13px] font-semibold text-clay-500">{s.n}</div>
                <div className="mt-4 border-t border-border-default pt-5">
                  <h3 className="text-[21px] font-bold text-ink-900">{s.title}</h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-ink-600">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------- Pricing teaser ---------- */}
      <section className="px-6 py-10">
        <Container>
          <Card tone="brand" padding="none" className="p-8 sm:p-11">
            <div className="grid items-center gap-10 md:grid-cols-2">
              <div>
                <Eyebrow>Transparent pricing</Eyebrow>
                <h2 className="mt-3 font-display font-semibold text-ink-900" style={{ fontSize: "clamp(28px,3.2vw,40px)" }}>
                  Interchange-plus. Nothing hidden.
                </h2>
                <p className="mt-4 max-w-[440px] text-[16px] leading-relaxed text-ink-600">
                  You pay the card networks' true cost plus one clear, fixed markup — the same fair rate on
                  every product. See exactly what you'd pay.
                </p>
                <ButtonLink href="/pricing" variant="primary" size="md" className="mt-6">
                  See pricing &amp; calculator
                </ButtonLink>
              </div>
              <div className="rounded-md border border-clay-100 bg-white p-6">
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-[14px] text-ink-600">Interchange</span>
                  <span className="font-mono text-[14px] text-ink-500">cost</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-[14px] text-ink-600">Impeccabyte markup</span>
                  <span className="font-mono text-[14px] text-clay-600">+ flat</span>
                </div>
                <div className="my-3 border-t border-ink-100" />
                <div className="flex items-end justify-between">
                  <span className="text-[15px] font-bold text-ink-900">What you pay</span>
                  <span className="font-display font-semibold text-clay-600" style={{ fontSize: 28 }}>
                    2.55%<span className="ml-1 text-[16px] text-ink-400">+10¢</span>
                  </span>
                </div>
                <p className="mt-3 text-[12.5px] leading-snug text-ink-400">
                  Illustrative blended rate. Your quote depends on card mix and volume.
                </p>
              </div>
            </div>
          </Card>
        </Container>
      </section>

      {/* ---------- Industries ---------- */}
      <section className="px-6 py-20">
        <Container>
          <SectionIntro eyebrow="Built for your business" title="However you sell, we fit" />
          <div className="mt-10 grid gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
            {homeSolutionKeys.map((k) => (
              <SolutionCard key={k} keyName={k} />
            ))}
          </div>
        </Container>
      </section>

      {/* ---------- Testimonial ---------- */}
      <section className="border-y border-clay-100 bg-clay-50 px-6 py-20">
        <Container width="wide" className="text-center">
          <Quote size={40} className="mx-auto text-clay-300" />
          <blockquote
            className="mx-auto mt-6 max-w-[720px] font-display font-medium text-ink-900"
            style={{ fontSize: "clamp(26px, 3.4vw, 36px)", lineHeight: 1.3 }}
          >
            &ldquo;I went from one weekend market to shipping nationwide, and Impeccabyte just kept up. The money
            shows up <span className="em">before</span>{" "}I&apos;ve finished wrapping the order.&rdquo;
          </blockquote>
          <div className="mt-7 flex items-center justify-center gap-3">
            <Avatar name="Renée Okafor" size="lg" />
            <div className="text-left">
              <div className="font-bold text-ink-900">Renée Okafor</div>
              <div className="text-[14px] text-ink-500">Founder, Saffron &amp; Co</div>
            </div>
          </div>
        </Container>
      </section>

      {/* ---------- Final CTA ---------- */}
      <DarkCTA
        titleA="Start today."
        titleEm="Get paid tomorrow."
        body="Your custom interchange-plus rate is one short form away — no monthly fee, no surprises, no corporate gatekeeping."
        primary={{ label: "Get a quote", href: "/contact" }}
        secondary={{ label: "See pricing", href: "/pricing" }}
      />
    </>
  );
}
