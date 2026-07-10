import { ArrowDownLeft, Landmark, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

/**
 * The layered balance / receipt / sales card cluster in the home hero.
 *
 * The stage is a container-query context (`container-type: inline-size`) with a
 * fixed 440px design width, and every dimension inside is expressed in `cqi`
 * (1cqi = 1% of the stage width = 4.4px at the full 440). At the desktop max it
 * renders pixel-identical to the original hand-tuned layout; on narrower phones
 * — where the doubled section/container gutters leave <300px — the whole cluster
 * scales down isometrically instead of overflowing the viewport.
 */
export function HeroCluster() {
  return (
    <div className="relative mx-auto aspect-[22/21] w-full max-w-[440px] [container-type:inline-size]">
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
        className="absolute left-1/2 top-[11.82cqi] h-[40cqi] w-[67.27cqi] rounded-[4.55cqi] shadow-md"
        style={{ background: "linear-gradient(135deg, #D17C56, #E0A04D)", transform: "translateX(-50%) rotate(6deg)" }}
      />

      {/* main balance card */}
      <div
        className="absolute left-1/2 top-[6.82cqi] w-[78.18cqi] rounded-[4.55cqi] border border-ink-100 bg-white p-[5.45cqi] shadow-lg"
        style={{ transform: "translateX(-50%) rotate(1.6deg)" }}
      >
        <div className="flex items-center justify-between">
          <span className="text-[2.95cqi] font-semibold text-ink-500">Available balance</span>
          <Badge variant="success" dot>
            Live
          </Badge>
        </div>
        <div className="mt-[2.73cqi] font-display font-semibold text-ink-900" style={{ fontSize: "10.45cqi", lineHeight: 1 }}>
          $12,840<span className="text-ink-400" style={{ fontSize: "6.36cqi" }}>.50</span>
        </div>
        <div className="mt-[3.64cqi] flex items-center gap-[1.82cqi] border-t border-ink-100 pt-[3.18cqi]">
          <Landmark className="h-[3.64cqi] w-[3.64cqi] shrink-0 text-sage-600" />
          <span className="text-[2.95cqi] text-ink-500">Settling to your bank · arrives tomorrow</span>
        </div>
      </div>

      {/* "You got paid" toast, bottom-left */}
      <div
        className="absolute bottom-[1.82cqi] left-0 flex w-[65cqi] items-center gap-[2.73cqi] rounded-[4.55cqi] border border-ink-100 bg-white px-[3.64cqi] py-[2.73cqi] shadow-md"
        style={{ transform: "rotate(-4deg)" }}
      >
        <span className="flex h-[8.18cqi] w-[8.18cqi] shrink-0 items-center justify-center rounded-[3.18cqi] bg-sage-50 text-sage-600">
          <ArrowDownLeft className="h-[4.09cqi] w-[4.09cqi]" />
        </span>
        <div className="min-w-0">
          <div className="text-[3.18cqi] font-bold text-ink-900">You got paid</div>
          <div className="text-[2.95cqi] text-ink-500">$48.00 from Maya R · just now</div>
        </div>
      </div>

      {/* "Today's sales" chip, top-right */}
      <div
        className="absolute right-0 top-0 flex w-[42.73cqi] items-center gap-[2.27cqi] rounded-[4.55cqi] border border-ink-100 bg-white px-[3.18cqi] py-[2.73cqi] shadow-md"
        style={{ transform: "rotate(-3deg)" }}
      >
        <span className="flex h-[7.27cqi] w-[7.27cqi] shrink-0 items-center justify-center rounded-[3.18cqi] bg-amber-50 text-amber-700">
          <TrendingUp className="h-[3.64cqi] w-[3.64cqi]" />
        </span>
        <div className="min-w-0">
          <div className="text-[2.73cqi] font-semibold text-ink-500">Today&apos;s sales</div>
          <div className="text-[3.41cqi] font-bold text-ink-900">$2,480 · 34 payments</div>
        </div>
      </div>
    </div>
  );
}
