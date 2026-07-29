import { Container } from "@/components/site/container";
import { Callout } from "@/components/ui/callout";
import { DarkCTA } from "@/components/site/dark-cta";
import { comparisonsLegalNotice } from "@/lib/compare";

/**
 * The tail of every compare route: the honesty callout, the dark CTA, and the
 * dated legal line.
 *
 * Shared rather than repeated per route because the strings below are
 * compliance-reviewed — one home means a copy change cannot land on the hub and
 * miss the deep pages. Server-rendered: none of it responds to the switcher, so
 * it sits outside the client component and outside the keyed block.
 */
export function ComparisonClosing() {
  return (
    <>
      <section className="px-6 pt-[26px] pb-2">
        <Container className="max-w-[1160px]">
          <Callout variant="info" title="If you're happy where you are, stay">
            These are good products — that's why they're the comparison. Our case is simple: past a
            certain size, owning your merchant account beats renting one. If you're not there yet,
            we'll tell you so on the first call.
          </Callout>
        </Container>
      </section>

      <DarkCTA
        titleA="An account that's"
        titleEm="actually yours."
        body="Bring a recent statement from any of the three — we'll show you, line by line, what the same month would have cost on your own account."
        primary={{ label: "Talk to us", href: "/contact" }}
        secondary={{ label: "See pricing", href: "/pricing" }}
        footnote={comparisonsLegalNotice}
      />
    </>
  );
}
