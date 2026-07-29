import { Check, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Competitor } from "@/lib/compare";

/** One "Choose … if" bullet. `us` bullets read positive (sage check), `them` neutral (ink minus). */
function Bullet({ tone, children }: { tone: "them" | "us"; children: React.ReactNode }) {
  const Icon = tone === "us" ? Check : Minus;
  return (
    <div className="flex items-start gap-2.5">
      <span
        className={`mt-px inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[7px] ${
          tone === "us" ? "bg-sage-50 text-sage-600" : "bg-ink-100 text-ink-500"
        }`}
      >
        <Icon size={13} strokeWidth={2.4} aria-hidden />
      </span>
      <span
        className={`text-[14.5px] leading-[1.55] ${tone === "us" ? "text-ink-700" : "text-ink-600"}`}
      >
        {children}
      </span>
    </div>
  );
}

/**
 * Everything that changes when the switcher changes: the centred intro, the two
 * choose-if cards, and the comparison table.
 *
 * `showHeading` is false on the competitor deep routes, where the page's h1
 * already reads "Impeccabyte vs. {name}" and repeating it here would print the
 * same line twice.
 *
 * The table is a CSS grid rather than a <table> because it has to collapse to a
 * single column at 760px, which a real table cannot do. The data is genuinely
 * tabular, so the grid carries ARIA table roles to announce correctly.
 */
export function ComparisonBlock({
  competitor,
  showHeading,
}: {
  competitor: Competitor;
  showHeading: boolean;
}) {
  const ROW = "grid grid-cols-[170px_1fr_1.1fr] max-[760px]:grid-cols-1";
  const CELL = "px-[18px] py-4";

  return (
    <>
      <div className="mx-auto mt-9 max-w-[680px] text-center">
        {showHeading && (
          <h2
            className="font-display font-semibold text-ink-900"
            style={{ fontSize: "clamp(24px, 3vw, 34px)" }}
          >
            Impeccabyte vs. {competitor.name}
          </h2>
        )}
        {showHeading ? (
          <p className="mt-2 text-[15px] font-semibold text-clay-600">{competitor.tagline}</p>
        ) : (
          // showHeading is false on the deep routes, where the page's own h1
          // already covers the h2 the hub would print here. Without this, the
          // tagline rendered as a <p> and orphaned the "Choose … if…" h3s below
          // it (h1 -> h3, no h2 in between). Same copy, same visual styling —
          // just a heading element instead of a paragraph.
          <h2 className="text-[15px] font-semibold text-clay-600">{competitor.tagline}</h2>
        )}
        <p className="mt-3.5 text-[16px] leading-[1.65] text-ink-600">{competitor.who}</p>
      </div>

      <div className="mt-8 grid grid-cols-2 items-stretch gap-[14px] max-[760px]:grid-cols-1">
        <Card padding="md" className="min-w-0">
          <h3 className="text-[16px] font-bold text-ink-900">Choose {competitor.name} if…</h3>
          <div className="mt-4 flex flex-col gap-3">
            {competitor.them.map((point) => (
              <Bullet key={point} tone="them">
                {point}
              </Bullet>
            ))}
          </div>
        </Card>
        <Card padding="md" className="min-w-0 border-[1.5px] border-clay-300">
          <h3 className="text-[16px] font-bold text-ink-900">Choose Impeccabyte if…</h3>
          <div className="mt-4 flex flex-col gap-3">
            {competitor.us.map((point) => (
              <Bullet key={point} tone="us">
                {point}
              </Bullet>
            ))}
          </div>
        </Card>
      </div>

      <Card padding="none" role="table" className="mt-[14px] overflow-hidden">
        <div role="row" className={`${ROW} max-[760px]:hidden`}>
          <div role="columnheader" className={CELL}>
            <span className="sr-only">Dimension</span>
          </div>
          <div
            role="columnheader"
            className={`${CELL} text-[12px] font-bold uppercase tracking-[0.08em] text-ink-400`}
          >
            {competitor.name}
          </div>
          <div
            role="columnheader"
            className={`${CELL} bg-clay-50 text-[12px] font-bold uppercase tracking-[0.08em] text-clay-700`}
          >
            Impeccabyte
          </div>
        </div>
        {competitor.rows.map((row) => (
          <div key={row.d} role="row" className={`${ROW} border-t border-ink-100`}>
            <div
              role="rowheader"
              className={`${CELL} text-[12px] font-bold uppercase tracking-[0.06em] text-ink-500 max-[760px]:pb-0`}
            >
              {row.d}
            </div>
            <div role="cell" className={`${CELL} text-[14px] leading-[1.55] text-ink-600`}>
              <span className="hidden text-[11px] font-bold uppercase tracking-[0.06em] text-ink-400 max-[760px]:block">
                {competitor.name}
              </span>
              {row.them}
            </div>
            <div
              role="cell"
              className={`${CELL} bg-clay-50 text-[14px] leading-[1.55] text-ink-800`}
            >
              <span className="hidden text-[11px] font-bold uppercase tracking-[0.06em] text-clay-700 max-[760px]:block">
                Impeccabyte
              </span>
              {row.us}
            </div>
          </div>
        ))}
      </Card>
    </>
  );
}
