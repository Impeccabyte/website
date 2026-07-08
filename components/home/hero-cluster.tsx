import { ArrowDownLeft, Landmark, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

/** The layered balance / receipt / sales card cluster in the home hero. */
export function HeroCluster() {
  return (
    <div className="relative mx-auto min-h-[420px] w-full max-w-[440px]">
      {/* radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(60% 55% at 68% 28%, rgba(224,160,77,0.30), transparent 70%)",
          filter: "blur(8px)",
        }}
      />
      {/* rotated gradient rectangle behind */}
      <div
        className="absolute left-1/2 top-[52px] h-[176px] w-[296px] -translate-x-1/2 rounded-lg shadow-md"
        style={{ background: "linear-gradient(135deg, #D17C56, #E0A04D)", transform: "translateX(-50%) rotate(6deg)" }}
      />

      {/* main balance card */}
      <div
        className="absolute left-1/2 top-[30px] w-[344px] -translate-x-1/2 rounded-lg border border-ink-100 bg-white p-6 shadow-lg"
        style={{ transform: "translateX(-50%) rotate(1.6deg)" }}
      >
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-semibold text-ink-500">Available balance</span>
          <Badge variant="success" dot>
            Live
          </Badge>
        </div>
        <div className="mt-3 font-display font-semibold text-ink-900" style={{ fontSize: 46, lineHeight: 1 }}>
          $12,840<span className="text-ink-400" style={{ fontSize: 28 }}>.50</span>
        </div>
        <div className="mt-4 flex items-center gap-2 border-t border-ink-100 pt-3.5">
          <Landmark size={16} className="text-sage-600" />
          <span className="text-[13px] text-ink-500">Settling to your bank · arrives tomorrow</span>
        </div>
      </div>

      {/* "You got paid" toast, bottom-left */}
      <div
        className="absolute bottom-[8px] left-0 flex w-[286px] items-center gap-3 rounded-lg border border-ink-100 bg-white px-4 py-3 shadow-md"
        style={{ transform: "rotate(-4deg)" }}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-sage-50 text-sage-600">
          <ArrowDownLeft size={18} />
        </span>
        <div className="min-w-0">
          <div className="text-[14px] font-bold text-ink-900">You got paid</div>
          <div className="text-[13px] text-ink-500">$48.00 from Maya R · just now</div>
        </div>
      </div>

      {/* "Today's sales" chip, top-right */}
      <div
        className="absolute right-0 top-0 flex w-[188px] items-center gap-2.5 rounded-lg border border-ink-100 bg-white px-3.5 py-3 shadow-md"
        style={{ transform: "rotate(-3deg)" }}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-amber-50 text-amber-700">
          <TrendingUp size={16} />
        </span>
        <div className="min-w-0">
          <div className="text-[12px] font-semibold text-ink-500">Today&apos;s sales</div>
          <div className="text-[15px] font-bold text-ink-900">$2,480 · 34 payments</div>
        </div>
      </div>
    </div>
  );
}
