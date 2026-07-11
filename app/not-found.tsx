import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Tag, CreditCard, MapPin, Building2 } from "lucide-react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ButtonLink } from "@/components/ui/button-link";

export const metadata: Metadata = {
  title: "Page not found",
  description: "We couldn't find that page — but everything else is right where you left it.",
};

// The four routes most worth surfacing when someone lands off the map.
const POPULAR = [
  { label: "Pricing", href: "/pricing", icon: Tag },
  { label: "Card Processing", href: "/products/payments", icon: CreditCard },
  { label: "Locations", href: "/locations", icon: MapPin },
  { label: "About", href: "/about", icon: Building2 },
] as const;

export default function NotFound() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "radial-gradient(80% 90% at 50% -10%, var(--amber-50), var(--paper) 60%)" }}
    >
      <div className="relative mx-auto max-w-[720px] px-6 pt-24 pb-[88px] text-center">
        {/* 404 — the middle "0" is the Impeccabyte emblem, so it reads "4 0 4". */}
        <div className="relative mb-2 inline-flex items-center justify-center">
          <span
            className="font-display font-semibold text-ink-900"
            style={{ fontSize: "clamp(96px, 18vw, 168px)", lineHeight: 0.9, letterSpacing: "-0.04em" }}
          >
            4
          </span>
          <Image
            src="/brand/impeccabyte-emblem.svg"
            width={132}
            height={132}
            alt="0"
            className="h-auto"
            style={{ width: "clamp(84px, 15vw, 132px)", margin: "0 -0.04em", transform: "translateY(0.08em)" }}
          />
          <span
            className="font-display font-semibold text-ink-900"
            style={{ fontSize: "clamp(96px, 18vw, 168px)", lineHeight: 0.9, letterSpacing: "-0.04em" }}
          >
            4
          </span>
        </div>

        {/* Wrap in a block element: `.eyebrow` is unlayered CSS (display:inline-block)
            and would otherwise beat a Tailwind `block` utility, sitting inline. */}
        <div className="mt-2">
          <Eyebrow>Page not found</Eyebrow>
        </div>

        <h1
          className="mt-3.5 font-display font-semibold text-ink-900"
          style={{ fontSize: "clamp(30px, 4.4vw, 46px)", lineHeight: 1.05, letterSpacing: "-0.025em" }}
        >
          This page took an <span className="em">early payout.</span>
        </h1>

        <p className="mx-auto mt-4 max-w-[440px] text-[17.5px] leading-relaxed text-ink-600">
          We couldn&apos;t find what you were looking for — but everything else is right where you left it.
          Let&apos;s get you back on track.
        </p>

        <div className="mt-[30px] flex flex-wrap justify-center gap-3">
          <ButtonLink href="/" variant="primary" size="lg">
            Back to home
          </ButtonLink>
          <ButtonLink href="/contact" variant="secondary" size="lg">
            Get a Quote
          </ButtonLink>
        </div>

        <div className="mt-[52px] border-t border-border-subtle pt-[30px]">
          <div className="mb-4 font-sans text-[11.5px] font-bold uppercase tracking-[0.1em] text-ink-400">
            Popular pages
          </div>
          <div className="flex flex-wrap justify-center gap-2.5">
            {POPULAR.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="inline-flex items-center gap-[7px] rounded-pill border border-border-default bg-white px-[17px] py-[9px] text-[14.5px] font-semibold text-ink-700 shadow-sm transition-[transform,box-shadow] duration-[220ms] ease-out hover:-translate-y-0.5 hover:text-ink-700 hover:shadow-md"
              >
                <Icon size={16} className="text-clay-500" />
                {label}
              </Link>
            ))}
          </div>
          <p className="mt-[26px] font-sans text-[13.5px] text-ink-400">
            Still stuck?{" "}
            <a href="mailto:howdy@impeccabyte.com" className="font-semibold text-clay-600">
              howdy@impeccabyte.com
            </a>{" "}
            ·{" "}
            <a href="tel:+15129806236" className="font-semibold text-clay-600">
              +1 (512) 980-6236
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
