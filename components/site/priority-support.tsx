import { MapPin } from "lucide-react";
import { Container } from "./container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { IconChip } from "@/components/ui/icon-chip";
import { PRIORITY, priorityZoneOrder } from "@/lib/data";
import { cn } from "@/lib/utils";

/** Small uppercase group label used between the priority sub-sections. */
function GroupLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("text-center text-[11.5px] font-bold uppercase tracking-[0.1em] text-ink-400", className)}>
      {children}
    </div>
  );
}

/**
 * The Locations-hub "Priority Support" section: the paid support tier, its
 * three core benefits, and the three on-site zones (in-range / drivable /
 * out-of-state). Server component — reads static PRIORITY data.
 */
export function PrioritySupportSection() {
  return (
    <section className="pt-20 pb-2">
      <Container>
        {/* Intro + price pill */}
        <div className="mx-auto max-w-[660px] text-center">
          <Eyebrow>Priority Support</Eyebrow>
          <h2
            className="mt-3 font-display font-semibold text-ink-900"
            style={{ fontSize: "clamp(28px, 3.4vw, 40px)" }}
          >
            More of us, <span className="em">wherever you are</span>
          </h2>
          <p className="mt-3.5 text-[16.5px] leading-relaxed text-ink-600">
            Priority Support is our paid support tier: a real response-time SLA, a direct line to a
            person who knows your account, and proactive re-audits for every member — with on-site
            help that scopes to where you do business.
          </p>
          <div className="mt-5 inline-flex flex-wrap items-baseline justify-center gap-2.5 rounded-pill border border-border-default bg-white px-[22px] py-2.5 shadow-sm">
            <span className="font-display text-[26px] font-semibold tracking-[-0.02em] text-ink-900">
              {PRIORITY.price}
            </span>
            <span className="text-[14px] text-ink-500">{PRIORITY.period}</span>
            <span className="h-4 w-px self-center bg-ink-200" />
            <span className="text-[13.5px] font-semibold text-clay-600">{PRIORITY.annual}</span>
          </div>
        </div>

        {/* Core benefits */}
        <GroupLabel className="mt-14">Every Priority member gets</GroupLabel>
        <div className="mt-3.5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRIORITY.core.map((c) => (
            <div
              key={c.title}
              className="flex h-full flex-col rounded-lg border border-border-default bg-white p-6 shadow-sm"
            >
              <IconChip icon={c.icon} tone="clay" size={44} />
              <h3 className="mt-4 text-[16px] font-bold leading-snug text-ink-900">{c.title}</h3>
              <p className="mt-1.5 text-[14px] leading-relaxed text-ink-600">{c.body}</p>
            </div>
          ))}
        </div>

        {/* On-site zones */}
        <GroupLabel className="mt-8">On-site scopes to your region</GroupLabel>
        <div className="mt-3.5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {priorityZoneOrder.map((k) => {
            const z = PRIORITY.zones[k];
            return (
              <div
                key={k}
                className="flex h-full flex-col rounded-lg border border-clay-100 p-6 pb-[22px] shadow-sm"
                style={{ background: "radial-gradient(120% 90% at 100% 0%, var(--amber-50), var(--surface-card) 58%)" }}
              >
                <span className="inline-flex items-center gap-1.5 self-start rounded-pill border border-clay-100 bg-clay-50 px-[11px] py-1 text-[11px] font-bold uppercase tracking-[0.04em] text-clay-700">
                  <MapPin size={12} strokeWidth={2.6} />
                  {z.tag}
                </span>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-display text-[30px] font-semibold leading-none tracking-[-0.02em] text-clay-600">
                    {z.stat}
                  </span>
                  <span className="text-[12.5px] text-ink-500">{z.statLabel}</span>
                </div>
                <h3 className="mt-3.5 text-[16px] font-bold leading-snug text-ink-900">{z.headline}</h3>
                <p className="mt-1.5 mb-4 flex-1 text-[13.5px] leading-relaxed text-ink-600">{z.sub}</p>
                <div className="flex flex-col gap-2.5 border-t border-border-subtle pt-[15px]">
                  {z.points.map((p) => (
                    <div key={p.text} className="flex items-center gap-2.5 text-[13.5px] text-ink-700">
                      <p.icon size={16} className="shrink-0 text-clay-500" />
                      {p.text}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <p className="mx-auto mt-5 max-w-[660px] text-center text-[13px] text-ink-400">
          Austin and San Antonio businesses already get on-site help free as part of standard service —
          Priority Support is optional there for the remote SLA and re-audits.
        </p>
      </Container>
    </section>
  );
}
