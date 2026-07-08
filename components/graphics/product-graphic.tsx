import {
  ArrowRight,
  Building2,
  Check,
  Landmark,
  Link as LinkIcon,
  RefreshCw,
  Wifi,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * ProductGraphic — bespoke mock-UI graphic per product key.
 * Server component: no "use client", no hooks/state.
 *
 * Renders just the floating card cluster on a transparent background;
 * the surrounding panel supplies gradient, padding, min-height and centering.
 */
export function ProductGraphic({ gfx }: { gfx: string }) {
  switch (gfx) {
    case "payments":
      return <PaymentsGraphic />;
    case "pos":
      return <PosGraphic />;
    case "online":
      return <OnlineGraphic />;
    case "invoicing":
      return <InvoicingGraphic />;
    case "recurring":
      return <RecurringGraphic />;
    case "terminal":
      return <TerminalGraphic />;
    case "ach":
      return <AchGraphic />;
    case "api":
      return <ApiGraphic />;
    default:
      return <PaymentsGraphic />;
  }
}

/* ------------------------------------------------------------------ */
/* payments                                                            */
/* ------------------------------------------------------------------ */
function PaymentsGraphic() {
  return (
    <div className="relative">
      <div
        className="rounded-lg shadow-lg p-6 text-white flex flex-col justify-between"
        style={{
          width: 300,
          height: 190,
          transform: "rotate(-4deg)",
          background: "linear-gradient(150deg, #C0623E, #833D26)",
        }}
      >
        <div className="flex items-start justify-between">
          <div
            className="rounded-xs bg-amber-400"
            style={{ width: 28, height: 20 }}
          />
          <Wifi className="h-5 w-5 rotate-90 text-white/90" />
        </div>
        <div className="space-y-3">
          <div className="font-mono text-[15px] tracking-[0.12em] text-white/95">
            4921 •••• •••• 8317
          </div>
          <div className="flex items-end justify-between">
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80">
              IMPECCABYTE
            </div>
            <div className="font-mono text-xs text-white/80">12 / 28</div>
          </div>
        </div>
      </div>

      <div
        className="absolute -bottom-5 -right-6 flex items-center gap-2 rounded-pill bg-white px-3.5 py-2 shadow-md"
        style={{ transform: "rotate(2deg)" }}
      >
        <Check className="h-4 w-4 text-sage-500" strokeWidth={3} />
        <span className="text-xs font-semibold text-ink-800">
          Approved · 1.2s
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* pos                                                                 */
/* ------------------------------------------------------------------ */
function PosGraphic() {
  return (
    <div className="relative">
      <div
        className="flex flex-col items-center justify-center bg-ink-900 shadow-lg"
        style={{ width: 186, height: 310, borderRadius: 32 }}
      >
        <div
          className="flex items-center justify-center rounded-pill bg-amber-400"
          style={{ width: 56, height: 56 }}
        >
          <Wifi className="h-6 w-6 rotate-90 text-white" />
        </div>
        <div className="mt-6 font-display text-[28px] leading-none text-white">
          $24.00
        </div>
        <div className="mt-2 text-xs text-ink-300">Tap to pay</div>
      </div>

      <div
        className="absolute -bottom-4 -left-8 flex flex-col justify-end rounded-md p-3 text-white shadow-md"
        style={{
          width: 150,
          height: 94,
          transform: "rotate(-8deg)",
          background: "linear-gradient(150deg,#D17C56,#A44E2F)",
        }}
      >
        <Wifi className="mb-auto h-4 w-4 rotate-90 text-white/80" />
        <div className="font-mono text-sm tracking-[0.12em]">•••• 8317</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* online                                                              */
/* ------------------------------------------------------------------ */
function OnlineGraphic() {
  return (
    <div
      className="overflow-hidden rounded-lg border border-ink-100 bg-white shadow-md"
      style={{ width: 320, transform: "rotate(-1.5deg)" }}
    >
      <div className="flex items-center gap-3 border-b border-ink-100 px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-pill bg-clay-300" />
          <span className="h-2.5 w-2.5 rounded-pill bg-amber-300" />
          <span className="h-2.5 w-2.5 rounded-pill bg-sage-300" />
        </div>
        <div className="font-mono text-xs text-ink-400">shop.yourbrand.com</div>
      </div>

      <div className="p-5">
        <div className="text-xs font-semibold text-ink-500">Order summary</div>
        <div className="mt-3 space-y-2 text-sm">
          <Row label="Ceramic mug" value="$28.00" />
          <Row label="Shipping" value="$6.00" />
        </div>
        <div className="my-3 border-t border-ink-100" />
        <div className="flex items-center justify-between text-sm font-bold text-ink-900">
          <span>Total</span>
          <span>$34.00</span>
        </div>
        <button
          type="button"
          className="mt-5 w-full rounded-pill bg-clay-500 py-2.5 text-sm font-semibold text-white shadow-sm"
        >
          Pay $34.00
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* invoicing                                                           */
/* ------------------------------------------------------------------ */
function InvoicingGraphic() {
  return (
    <div className="relative">
      <div
        className="rounded-lg border border-ink-100 bg-white p-5 shadow-md"
        style={{ width: 288, transform: "rotate(1.6deg)" }}
      >
        <div className="flex items-baseline justify-between">
          <div className="text-sm font-bold text-ink-900">Invoice #1042</div>
          <div className="text-xs text-ink-400">Due Jun 14</div>
        </div>

        <div className="mt-4 space-y-2 text-sm">
          <Row label="Design retainer" value="$1,200" />
          <Row label="Revisions" value="$300" />
        </div>
        <div className="my-3 border-t border-ink-100" />
        <div className="flex items-center justify-between text-sm font-bold text-ink-900">
          <span>Total due</span>
          <span>$1,500</span>
        </div>

        <div className="mt-4 inline-flex items-center gap-1.5 rounded-pill bg-amber-50 px-3 py-1.5 text-amber-700">
          <LinkIcon className="h-3.5 w-3.5" />
          <span className="font-mono text-xs">pay.impeccabyte.com/i/1042</span>
        </div>
      </div>

      <div
        className={cn(
          "absolute right-4 top-6 rounded-md border-[2.5px] border-sage-600 px-2 py-1",
          "text-sm font-bold uppercase tracking-wide text-sage-600",
        )}
        style={{ transform: "rotate(-14deg)" }}
      >
        Paid
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* recurring                                                           */
/* ------------------------------------------------------------------ */
function RecurringGraphic() {
  return (
    <div className="relative">
      <div
        className="rounded-lg border border-ink-100 bg-white p-5 shadow-md"
        style={{ width: 272, transform: "rotate(-1.5deg)" }}
      >
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-400">
          Subscription
        </div>
        <div className="mt-1 font-display text-[38px] leading-none text-ink-900">
          $29 <span className="text-2xl text-ink-400">/ mo</span>
        </div>

        <div className="mt-5 space-y-2.5 text-sm">
          <Row label="Plan" value="Pro" />
          <Row label="Next charge" value="Jun 1" />
          <div className="flex items-center justify-between">
            <span className="text-ink-500">Status</span>
            <span className="rounded-pill bg-sage-50 px-2.5 py-0.5 text-xs font-semibold text-sage-600">
              Active
            </span>
          </div>
        </div>
      </div>

      <div
        className="absolute -right-5 -top-5 flex items-center justify-center rounded-pill bg-amber-400 shadow-md"
        style={{ width: 60, height: 60, transform: "rotate(12deg)" }}
      >
        <RefreshCw className="h-6 w-6 text-white" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* terminal                                                            */
/* ------------------------------------------------------------------ */
function TerminalGraphic() {
  return (
    <div
      className="rounded-lg border border-ink-100 bg-white p-5 shadow-md"
      style={{ width: 264, transform: "rotate(1.6deg)" }}
    >
      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-400">
        Amount
      </div>
      <div className="mt-1 font-display text-[30px] leading-none text-ink-900">
        $120.00
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <div
            key={n}
            className="flex aspect-square items-center justify-center rounded-md bg-ink-50 text-sm font-semibold text-ink-700"
          >
            {n}
          </div>
        ))}
      </div>

      <button
        type="button"
        className="mt-4 w-full rounded-pill bg-clay-500 py-2.5 text-sm font-semibold text-white shadow-sm"
      >
        Charge $120.00
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ach                                                                 */
/* ------------------------------------------------------------------ */
function AchGraphic() {
  return (
    <div
      className="rounded-lg border border-ink-100 bg-white p-5 shadow-md"
      style={{ width: 290, transform: "rotate(-1.5deg)" }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-1 flex-col items-center gap-1.5 text-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-ink-50 text-ink-600">
            <Landmark className="h-4 w-4" />
          </div>
          <div className="text-xs text-ink-500">Your bank ••1234</div>
        </div>

        <ArrowRight className="h-4 w-4 shrink-0 text-ink-400" />

        <div className="flex flex-1 flex-col items-center gap-1.5 text-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-ink-50 text-ink-600">
            <Building2 className="h-4 w-4" />
          </div>
          <div className="text-xs text-ink-500">Impeccabyte deposit</div>
        </div>
      </div>

      <div className="my-4 border-t border-ink-100" />

      <div className="flex items-center justify-between text-sm font-bold text-ink-900">
        <span>ACH transfer</span>
        <span>$500.00</span>
      </div>
      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="text-ink-500">Network fee</span>
        <span className="rounded-pill bg-sage-50 px-2.5 py-0.5 text-xs font-semibold text-sage-600">
          $0.25
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* api                                                                 */
/* ------------------------------------------------------------------ */
function ApiGraphic() {
  return (
    <div
      className="overflow-hidden rounded-lg bg-ink-900 shadow-lg"
      style={{ width: 318, transform: "rotate(-1.5deg)" }}
    >
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-pill bg-clay-300" />
          <span className="h-2.5 w-2.5 rounded-pill bg-amber-300" />
          <span className="h-2.5 w-2.5 rounded-pill bg-sage-300" />
        </div>
        <div className="font-mono text-xs text-[#F3EBDE]/60">charge.js</div>
      </div>

      <pre className="overflow-x-auto px-5 py-4 font-mono text-[13px] leading-6 text-[#F3EBDE]">
        <code>
          <span className="text-amber-300">await</span> impeccabyte.charges.
          <span className="text-amber-300">create</span>
          <span className="text-clay-300">(</span>
          <span className="text-clay-300">{"{"}</span>
          {"\n"}
          {"  "}amount<span className="text-clay-300">:</span>{" "}
          <span className="text-sage-300">4800</span>
          <span className="text-clay-300">,</span>
          {"\n"}
          {"  "}currency<span className="text-clay-300">:</span>{" "}
          <span className="text-sage-300">{"'usd'"}</span>
          <span className="text-clay-300">,</span>
          {"\n"}
          {"  "}source<span className="text-clay-300">:</span>{" "}
          <span className="text-sage-300">{"'tok_visa'"}</span>
          {"\n"}
          <span className="text-clay-300">{"}"}</span>
          <span className="text-clay-300">)</span>
          <span className="text-clay-300">;</span>
        </code>
      </pre>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* shared                                                              */
/* ------------------------------------------------------------------ */
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-500">{label}</span>
      <span className="font-medium text-ink-800">{value}</span>
    </div>
  );
}
