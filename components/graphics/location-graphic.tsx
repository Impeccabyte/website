import { Check, MapPin, Zap } from "lucide-react";
import { Wordmark } from "@/components/site/wordmark";

/**
 * LocationGraphic — the tilted "free statement analysis" card cluster that
 * anchors each metro hero. Server component: no "use client", no hooks.
 *
 * Renders just the floating card cluster on a transparent background; the
 * surrounding TiltPanel (bare) supplies the gradient glow, centering, and the
 * mouse-tilt / fit-to-width scaling.
 */
export function LocationGraphic({ cityName }: { cityName: string }) {
  return (
    <div style={{ position: "relative", zIndex: 1, width: 320 }}>
      {/* warm gradient plate peeking out behind the card */}
      <div
        style={{
          position: "absolute",
          zIndex: 0,
          top: 16,
          right: -14,
          width: 250,
          height: 170,
          borderRadius: "var(--radius-lg)",
          background: "linear-gradient(135deg, var(--clay-400), var(--amber-400))",
          boxShadow: "var(--shadow-md)",
          transform: "rotate(6deg)",
        }}
      />

      {/* the statement-analysis card */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          background: "var(--surface-card)",
          border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-lg)",
          padding: "22px 22px 20px",
          transform: "rotate(-1.6deg)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Wordmark size={16} emblem={27} />
          <span
            className="inline-flex items-center gap-1.5 rounded-pill border border-clay-100 bg-clay-50 px-2.5 py-1 text-[11px] font-bold text-clay-700"
          >
            <MapPin size={12} strokeWidth={2.6} />
            {cityName}
          </span>
        </div>

        <div className="mt-[18px]">
          <div className="eyebrow" style={{ fontSize: 11 }}>
            Free statement analysis
          </div>
          <div className="mt-[9px] flex items-baseline gap-2">
            <span
              className="font-display font-semibold text-ink-900"
              style={{ fontSize: 29, letterSpacing: "-0.02em" }}
            >
              Interchange<span className="text-clay-500"> + 0.32%</span>
            </span>
          </div>
          <div className="mt-[5px] text-[12.5px] text-ink-500">
            What you&rsquo;d actually pay — line by line.
          </div>
        </div>

        <div className="my-[15px] h-px bg-ink-100" />

        <div className="flex items-center gap-2 text-[12px] text-ink-500">
          <Zap size={15} />
          <span>Next-day funding</span>
          <span className="inline-block h-[3px] w-[3px] rounded-full bg-ink-300" />
          <span>No switching fee</span>
        </div>
      </div>

      {/* floating turnaround badge */}
      <div
        className="flex items-center gap-2.5 rounded-md border border-border-default bg-white px-[15px] py-[11px] shadow-lg"
        style={{ position: "absolute", zIndex: 3, left: -20, bottom: -18, transform: "rotate(-4deg)" }}
      >
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sage-50 text-sage-600">
          <Check size={17} strokeWidth={2.6} />
        </span>
        <div className="text-[12.5px] font-semibold leading-tight text-ink-800">
          Usually back within
          <br />a business day
        </div>
      </div>
    </div>
  );
}
