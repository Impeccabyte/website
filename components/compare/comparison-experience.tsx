"use client";

import { useState } from "react";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { cn } from "@/lib/utils";
import { ComparisonBlock } from "./comparison-block";
import { COMPETITORS, competitorOrder, HERO_LEDE, type CompetitorSlug } from "@/lib/compare";

/**
 * Hero + pill switcher + the per-competitor block.
 *
 * The hero lives in here rather than in the page because on the competitor
 * routes the h1 names the active competitor, so it has to track the switcher.
 * The initial slug is server-rendered, so a direct hit on /compare/toast ships
 * Toast's full table in the HTML.
 *
 * Switching does NOT re-run the route: window.history.replaceState is the App
 * Router's supported shallow-URL update. replaceState rather than pushState so
 * Back leaves the page instead of walking three tabs.
 */
export function ComparisonExperience({
  initial,
  variant,
}: {
  initial: CompetitorSlug;
  /** "hub" keeps the generic h1 and lets the block print its own h2. */
  variant: "hub" | "competitor";
}) {
  const [active, setActive] = useState<CompetitorSlug>(initial);
  const competitor = COMPETITORS[active];

  function select(slug: CompetitorSlug) {
    if (slug === active) return; // clicking the active pill is a no-op
    setActive(slug);
    // Known trade-off: this is a shallow URL swap, so the router tree doesn't
    // know it happened. Pressing Back onto a restored history entry can show
    // the hub body under a competitor URL (or vice versa); a reload self-heals.
    window.history.replaceState(null, "", `/compare/${slug}`);
  }

  return (
    <>
      <section className="px-6 pt-18 pb-6">
        <Container>
          <div className="max-w-[720px]">
            <Eyebrow>Comparisons</Eyebrow>
            <h1
              className="mt-[15px] font-display font-semibold text-ink-900"
              style={{
                fontSize: "clamp(38px, 5vw, 58px)",
                lineHeight: 1.03,
                letterSpacing: "-0.025em",
              }}
            >
              {variant === "hub" ? (
                <>
                  The <span className="em">honest</span> comparison.
                </>
              ) : (
                `Impeccabyte vs. ${competitor.name}`
              )}
            </h1>
            <p className="mt-[22px] max-w-[620px] text-[19px] leading-[1.6] text-ink-600">
              {HERO_LEDE}
            </p>
          </div>
        </Container>
      </section>

      <section className="px-6 pt-6 pb-2">
        <Container className="max-w-[1160px]">
          <div className="flex flex-wrap justify-center gap-2.5">
            {competitorOrder.map((slug) => {
              const isActive = slug === active;
              return (
                <button
                  key={slug}
                  type="button"
                  onClick={() => select(slug)}
                  aria-pressed={isActive}
                  className={cn(
                    "cursor-pointer rounded-pill border px-[26px] py-2.5 text-[15px] font-semibold transition-all duration-[140ms] ease-out",
                    isActive
                      ? "border-clay-500 bg-clay-500 text-[#FBF6EE] shadow-brand"
                      : "border-ink-200 bg-white text-ink-700"
                  )}
                >
                  {COMPETITORS[slug].name}
                </button>
              );
            })}
          </div>

          {/* The live region is this small, PERSISTENT node — not the swapped block.
              A live region that is itself remounted arrives pre-populated in one
              commit, and several screen readers only announce *mutations* within an
              existing region, so announcing from the keyed div below is unreliable.
              Announcing the whole table would also be far too verbose; naming the
              competitor is the useful part. Content present at load is not
              announced, so this stays quiet until the reader actually switches. */}
          <p role="status" aria-live="polite" className="sr-only">
            Now comparing Impeccabyte with {competitor.name}.
          </p>

          {/* Keyed on the slug: React remounts the subtree, which replays .ib-cmp-swap. */}
          <div key={active} className="ib-cmp-swap">
            <ComparisonBlock competitor={competitor} showHeading={variant === "hub"} />
          </div>
        </Container>
      </section>
    </>
  );
}
