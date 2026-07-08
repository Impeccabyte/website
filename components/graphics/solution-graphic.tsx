import {
  Bell,
  Check,
  Heart,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const cardBase = "relative bg-white border border-ink-100 shadow-md rounded-lg";

function RetailGraphic() {
  return (
    <div className="relative">
      <div className={cn(cardBase, "w-72 p-5")}>
        <div
          className="h-6 rounded-t-lg -mx-5 -mt-5 mb-4"
          style={{
            background:
              "repeating-linear-gradient(45deg, #C0623E 0 14px, #FAF6EF 14px 28px)",
          }}
        />
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg text-ink-900">The Corner Shop</h3>
          <span className="inline-flex items-center gap-1.5 bg-sage-50 text-sage-600 rounded-pill px-2.5 py-1 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-sage-600" />
            Open
          </span>
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-2.5 w-3/4 rounded-pill bg-ink-50" />
          <div className="h-2.5 w-1/2 rounded-pill bg-ink-50" />
        </div>
      </div>
      <div className="absolute -bottom-4 -right-4 inline-flex items-center gap-2 bg-white border border-ink-100 shadow-lg rounded-pill px-3 py-2">
        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-sage-50 text-sage-600">
          <Check className="w-3.5 h-3.5" strokeWidth={3} />
        </span>
        <span className="font-mono text-xs text-ink-900">$42 · tap 0.4s</span>
      </div>
    </div>
  );
}

function FoodGraphic() {
  return (
    <div className={cn(cardBase, "w-72 p-5")}>
      <div className="flex items-center justify-between text-sm text-ink-500">
        <span>Table 6</span>
        <span className="font-medium text-ink-900">Check</span>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-ink-500">Subtotal</span>
        <span className="text-ink-900 font-medium">$58.00</span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <button className="rounded-md bg-ink-50 text-ink-600 py-2 text-sm font-medium">
          18%
        </button>
        <button className="rounded-md bg-amber-400 text-ink-900 py-2 text-sm font-semibold">
          20%
        </button>
        <button className="rounded-md bg-ink-50 text-ink-600 py-2 text-sm font-medium">
          25%
        </button>
      </div>
      <div className="mt-4 pt-3 border-t border-ink-100 flex items-center justify-between">
        <span className="text-ink-900 font-bold">Total</span>
        <span className="text-ink-900 font-bold">$69.60</span>
      </div>
    </div>
  );
}

function ServicesGraphic() {
  return (
    <div className="relative">
      <div className={cn(cardBase, "w-72 p-5")}>
        <p className="text-xs uppercase tracking-wide text-ink-500">
          To get started
        </p>
        <p className="mt-2 font-display text-2xl font-bold text-ink-900">
          $500 deposit
        </p>
        <p className="mt-1 text-sm text-ink-500">Balance due on delivery</p>
        <div className="my-4 border-t border-ink-100" />
        <div className="flex items-center justify-between text-sm">
          <span className="text-ink-500">Retainer</span>
          <span className="text-ink-900 font-medium">$1,200 / mo</span>
        </div>
      </div>
      <div className="absolute -bottom-4 -right-4 inline-flex items-center gap-2 bg-white border border-ink-100 shadow-lg rounded-pill px-3 py-2">
        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-50 text-amber-700">
          <Bell className="w-3.5 h-3.5" strokeWidth={2.5} />
        </span>
        <span className="text-xs text-ink-900">Reminders on</span>
      </div>
    </div>
  );
}

function EcommerceGraphic() {
  const bars = [
    { h: 28, c: "#F0C14B" },
    { h: 40, c: "#E5A83C" },
    { h: 52, c: "#D98A38" },
    { h: 62, c: "#CE7539" },
    { h: 72, c: "#C76A3B" },
    { h: 80, c: "#C0623E" },
  ];
  return (
    <div className={cn(cardBase, "w-72 p-5")}>
      <p className="text-xs uppercase tracking-wide text-ink-500">
        Completed checkouts
      </p>
      <p
        className="mt-1 font-display text-sage-600"
        style={{ fontSize: "40px", lineHeight: 1.1 }}
      >
        94%
      </p>
      <div className="mt-4 flex items-end gap-1.5 h-20">
        {bars.map((b, i) => (
          <div
            key={i}
            className="rounded-t"
            style={{ width: "14px", height: `${b.h}%`, background: b.c }}
          />
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-sage-600" strokeWidth={2.5} />
        <span className="text-sm font-semibold text-sage-600">
          +18% this week
        </span>
      </div>
    </div>
  );
}

function NonprofitsGraphic() {
  return (
    <div className={cn(cardBase, "w-72 p-5")}>
      <div className="flex items-center gap-2">
        <Heart className="w-5 h-5 text-clay-500" strokeWidth={2.5} />
        <h3 className="font-display text-lg text-ink-900">Give monthly</h3>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <button className="rounded-md bg-ink-50 text-ink-600 py-2 text-sm font-medium">
          $25
        </button>
        <button className="rounded-md bg-amber-400 text-ink-900 py-2 text-sm font-semibold">
          $50
        </button>
        <button className="rounded-md bg-ink-50 text-ink-600 py-2 text-sm font-medium">
          $100
        </button>
      </div>
      <div className="mt-4 pt-3 border-t border-ink-100 flex items-center gap-2">
        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-sage-50 text-sage-600 shrink-0">
          <Check className="w-3.5 h-3.5" strokeWidth={3} />
        </span>
        <span className="text-sm text-ink-600">
          98% goes straight to programs
        </span>
      </div>
    </div>
  );
}

function HighRiskGraphic() {
  const items = [
    "Specialty category reviewed",
    "Reserve terms explained",
    "Chargeback tools on",
  ];
  return (
    <div className={cn(cardBase, "w-72 p-5")}>
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-clay-500" strokeWidth={2.5} />
        <h3 className="font-display text-lg text-ink-900">Underwriting</h3>
      </div>
      <div className="mt-4 space-y-3">
        {items.map((label) => (
          <div key={label} className="flex items-center gap-2">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-sage-50 text-sage-600 shrink-0">
              <Check className="w-3.5 h-3.5" strokeWidth={3} />
            </span>
            <span className="text-sm text-ink-600">{label}</span>
          </div>
        ))}
      </div>
      <div
        className="absolute top-3 right-3 text-sage-600 font-bold uppercase border-[2.5px] border-sage-600 rounded-md px-2 py-1 tracking-wide text-sm"
        style={{ transform: "rotate(-12deg)" }}
      >
        Approved
      </div>
    </div>
  );
}

function AgentsGraphic() {
  const bars = [
    { h: 40, c: "#F0C14B" },
    { h: 58, c: "#D98A38" },
    { h: 74, c: "#C76A3B" },
    { h: 88, c: "#C0623E" },
  ];
  return (
    <div className={cn(cardBase, "w-72 p-5")}>
      <p className="text-xs uppercase tracking-wide text-ink-500">
        Monthly residual
      </p>
      <p
        className="mt-1 font-display text-ink-900"
        style={{ fontSize: "38px", lineHeight: 1.1 }}
      >
        $48,200
      </p>
      <div className="mt-4 flex items-end gap-2 h-20">
        {bars.map((b, i) => (
          <div
            key={i}
            className="rounded-t flex-1"
            style={{ height: `${b.h}%`, background: b.c }}
          />
        ))}
      </div>
      <div className="mt-4">
        <span className="inline-flex items-center bg-amber-50 text-amber-700 rounded-pill px-3 py-1.5 text-xs font-medium">
          Revenue share 70 / 30
        </span>
      </div>
    </div>
  );
}

export function SolutionGraphic({ gfx }: { gfx: string }) {
  switch (gfx) {
    case "food":
      return <FoodGraphic />;
    case "services":
      return <ServicesGraphic />;
    case "ecommerce":
      return <EcommerceGraphic />;
    case "nonprofits":
      return <NonprofitsGraphic />;
    case "highrisk":
      return <HighRiskGraphic />;
    case "agents":
      return <AgentsGraphic />;
    case "retail":
    default:
      return <RetailGraphic />;
  }
}
