import { MapPin } from "lucide-react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ButtonLink } from "@/components/ui/button-link";
import { PRIORITY, type PriorityZone } from "@/lib/data";

/**
 * Per-metro "Priority Support" panel shown on a city page: the zone's on-site
 * terms on the left, a gradient stat card on the right. Server component.
 */
export function PriorityZonePanel({ zone }: { zone: PriorityZone }) {
  return (
    <div className="grid grid-cols-1 overflow-hidden rounded-lg border border-clay-100 bg-clay-50 lg:grid-cols-[1.25fr_0.75fr]">
      {/* Terms */}
      <div className="p-8 sm:p-[34px]">
        <Eyebrow>Priority Support</Eyebrow>
        <h2
          className="mt-3 font-display font-semibold leading-[1.1] text-ink-900"
          style={{ fontSize: "clamp(25px, 3vw, 32px)" }}
        >
          {zone.headline}
        </h2>
        <p className="mt-3 max-w-[540px] text-[15.5px] leading-relaxed text-ink-600">{zone.sub}</p>
        <div className="mt-[22px] flex flex-col gap-3">
          {zone.points.map((p) => (
            <div key={p.text} className="flex items-center gap-3 text-[15px] text-ink-700">
              <span className="inline-flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-sm bg-white text-clay-600 shadow-sm">
                <p.icon size={16} />
              </span>
              {p.text}
            </div>
          ))}
        </div>
        <div className="mt-[26px] flex flex-wrap items-center gap-[18px]">
          <ButtonLink href="/contact" variant="primary" size="lg">
            Get a free statement analysis
          </ButtonLink>
          <span className="inline-flex items-baseline gap-[7px]">
            <span className="font-display text-[22px] font-semibold tracking-[-0.02em] text-ink-900">
              {PRIORITY.price}
            </span>
            <span className="text-[13.5px] text-ink-500">{PRIORITY.period}</span>
          </span>
        </div>
      </div>

      {/* Gradient stat card */}
      <div
        className="relative flex flex-col items-center justify-center overflow-hidden px-[26px] py-[34px] text-center"
        style={{ background: "linear-gradient(160deg, var(--clay-500), var(--amber-500))" }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(70% 60% at 70% 15%, rgba(255,255,255,0.22), transparent 60%)" }}
        />
        <span className="relative inline-flex items-center gap-1.5 rounded-pill border border-[rgba(251,246,238,0.28)] bg-[rgba(251,246,238,0.16)] px-3 py-[5px] text-[11px] font-bold uppercase tracking-[0.06em] text-[#FBF6EE]">
          <MapPin size={12} strokeWidth={2.6} />
          {zone.tag}
        </span>
        <div
          className="relative mt-5 font-display text-[46px] font-semibold leading-none tracking-[-0.02em] text-[#FFFDF9]"
          style={{ textShadow: "0 1px 10px rgba(58,42,28,0.25)" }}
        >
          {zone.stat}
        </div>
        <div className="relative mt-2.5 max-w-[180px] text-[13.5px] leading-snug text-[rgba(255,253,249,0.9)]">
          {zone.statLabel}
        </div>
        <div className="relative mt-4 border-t border-[rgba(251,246,238,0.22)] pt-3.5 text-[12px] text-[rgba(255,253,249,0.82)]">
          {PRIORITY.annual}
        </div>
      </div>
    </div>
  );
}
