import { ArrowDown } from "lucide-react";
import { Card } from "@/components/ui/card";

/**
 * The hero's three-storey diagram: your software → one of our gateways →
 * your merchant account on the major rails. Decorative, so the arrows are
 * aria-hidden and the whole thing reads as three labelled lists.
 */

const SOFTWARE = ["WooCommerce", "QuickBooks", "Your EHR", "ClickFunnels", "HighLevel"];
const GATEWAYS = ["Authorize.Net", "NMI", "Fluid Pay", "+9 more"];
const RAILS = ["TSYS", "First Data Nashville"];

function Label({ children, className }: { children: string; className?: string }) {
  return (
    <div className={`text-[10.5px] font-bold uppercase tracking-[0.09em] ${className}`}>{children}</div>
  );
}

function Arrow() {
  return (
    <div className="flex justify-center text-ink-300" aria-hidden>
      <ArrowDown size={16} strokeWidth={2.4} />
    </div>
  );
}

export function StackDiagram() {
  return (
    <Card padding="md" className="flex flex-col gap-2.5">
      <div className="rounded-md border border-border-default bg-paper px-[18px] py-3.5">
        <Label className="text-ink-400">Your software</Label>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {SOFTWARE.map((s) => (
            <span
              key={s}
              className="rounded-pill border border-ink-100 bg-white px-[11px] py-1 text-[12.5px] font-semibold text-ink-700"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      <Arrow />

      <div className="rounded-md border border-border-default bg-paper px-[18px] py-3.5">
        <Label className="text-ink-400">One of our twelve gateways &amp; platforms</Label>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {GATEWAYS.map((s) => (
            <span
              key={s}
              className="rounded-pill border border-ink-100 bg-white px-[11px] py-1 text-[12.5px] font-semibold text-ink-700"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      <Arrow />

      <div className="rounded-md border border-ink-900 bg-ink-900 px-[18px] py-3.5">
        <Label className="text-amber-300">Your merchant account, on major rails</Label>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {RAILS.map((s) => (
            <span
              key={s}
              className="rounded-pill border px-[11px] py-1 text-[12.5px] font-semibold text-[#F3EBDE]"
              style={{
                background: "rgba(243,235,222,0.1)",
                borderColor: "rgba(243,235,222,0.18)",
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}
