import { Check, WifiOff, RefreshCw } from "lucide-react";

export function ProductGraphic2({ gfx }: { gfx: string }) {
  switch (gfx) {
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
    case "payments":
    default:
      return <PaymentsGraphic />;
  }
}

function PaymentsGraphic() {
  const methods = ["Apple Pay", "Google Pay", "Visa", "Mastercard", "Amex", "Discover"];
  return (
    <div className="w-full max-w-[320px] border border-ink-100 shadow-md rounded-lg bg-white p-5">
      <h3 className="text-ink-900 font-semibold mb-3">Every way to pay</h3>
      <div className="flex flex-wrap gap-2">
        {methods.map((m) => (
          <span
            key={m}
            className="bg-ink-50 border border-ink-100 rounded-pill px-3 py-1.5 text-[13px] text-ink-700"
          >
            {m}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-4">
        <Check className="w-4 h-4 text-sage-500 shrink-0" />
        <span className="text-sm text-ink-600">All settle to one account</span>
      </div>
    </div>
  );
}

function PosGraphic() {
  return (
    <div className="relative w-full max-w-[300px]">
      <div className="border border-ink-100 shadow-md rounded-lg bg-white p-5">
        <h3 className="font-display text-lg text-ink-900 mb-4">The Coffee Bar</h3>
        <div className="space-y-2 text-sm text-ink-700">
          <div className="flex justify-between">
            <span>Latte</span>
            <span>$4.50</span>
          </div>
          <div className="flex justify-between">
            <span>Muffin</span>
            <span>$3.00</span>
          </div>
          <div className="flex justify-between">
            <span>Tip 18%</span>
            <span>$1.35</span>
          </div>
        </div>
        <div className="border-t border-dashed border-ink-200 my-3" />
        <div className="flex justify-between font-bold text-ink-900">
          <span>Total</span>
          <span>$8.85</span>
        </div>
      </div>
      <div className="absolute -bottom-3 -right-3 flex items-center gap-1.5 bg-white border border-ink-100 shadow-md rounded-pill px-3 py-1.5">
        <WifiOff className="w-4 h-4 text-ink-600" />
        <span className="text-[13px] text-ink-700">Works offline</span>
      </div>
    </div>
  );
}

function OnlineGraphic() {
  return (
    <div className="relative w-full max-w-[320px]">
      <div className="bg-ink-900 rounded-lg shadow-md p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2.5 h-2.5 rounded-full bg-clay-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-sage-500" />
          <span className="font-mono text-[12px] text-ink-400 ml-2">index.html</span>
        </div>
        <pre className="font-mono text-[12px] leading-relaxed text-[#F3EBDE] whitespace-pre-wrap">
          <span className="text-ink-400">{"<!-- one line to sell -->"}</span>
          {"\n"}
          <span className="text-clay-300">{"<script src="}</span>
          <span className="text-sage-300">{'"impeccabyte.js"'}</span>
          <span className="text-clay-300">{">"}</span>
          {"\n"}
          <span className="text-clay-300">{'<div id="checkout"></div>'}</span>
        </pre>
      </div>
      <div className="absolute -bottom-3 -right-3 flex items-center gap-1.5 bg-white border border-ink-100 shadow-md rounded-pill px-3 py-1.5">
        <Check className="w-4 h-4 text-sage-500" />
        <span className="text-[13px] text-ink-700">Live in an afternoon</span>
      </div>
    </div>
  );
}

function InvoicingGraphic() {
  const steps = ["Link sent", "Opened by client", "Paid $150"];
  return (
    <div className="w-full max-w-[280px] border border-ink-100 shadow-md rounded-lg bg-white p-5">
      <h3 className="text-ink-900 font-semibold mb-4">No awkward ask</h3>
      <div className="relative">
        <div className="absolute left-[9px] top-3 bottom-3 w-px bg-sage-300" />
        <div className="space-y-4">
          {steps.map((label) => (
            <div key={label} className="relative flex items-center gap-3">
              <span
                className="flex items-center justify-center bg-sage-500 rounded-full shrink-0"
                style={{ width: "20px", height: "20px" }}
              >
                <Check className="w-3 h-3 text-white" />
              </span>
              <span className="text-sm text-ink-700">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RecurringGraphic() {
  return (
    <div className="w-full max-w-[280px] border border-ink-100 shadow-md rounded-lg bg-white p-5">
      <h3 className="text-ink-900 font-semibold mb-4">Smart retries</h3>
      <div className="space-y-3 text-sm">
        <div className="text-ink-500">Jun 1 · charge failed</div>
        <div className="flex items-center gap-2 text-ink-500">
          <span>Jun 3 · retried</span>
          <span className="flex items-center justify-center bg-amber-100 text-amber-700 rounded-full w-5 h-5 shrink-0">
            <RefreshCw className="w-3 h-3" />
          </span>
        </div>
        <span className="inline-block bg-sage-50 text-sage-600 rounded-pill px-3 py-1.5 text-[13px] font-medium">
          Recovered +$29.00
        </span>
      </div>
    </div>
  );
}

function TerminalGraphic() {
  return (
    <div className="w-full max-w-[280px] border border-ink-100 shadow-md rounded-lg bg-white p-5">
      <h3 className="text-ink-900 font-semibold mb-4">Team access</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center bg-clay-100 text-clay-700 rounded-full w-8 h-8 text-[12px] font-semibold shrink-0">
            JR
          </span>
          <span className="text-sm text-ink-700">Jordan (Owner)</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center bg-amber-100 text-amber-700 rounded-full w-8 h-8 text-[12px] font-semibold shrink-0">
            MT
          </span>
          <span className="text-sm text-ink-700">Mei (Staff)</span>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <Check className="w-4 h-4 text-sage-500 shrink-0" />
        <span className="text-sm text-ink-600">AVS + CVV verified</span>
      </div>
    </div>
  );
}

function AchGraphic() {
  return (
    <div className="w-full max-w-[300px] border border-ink-100 shadow-md rounded-lg bg-white p-5">
      <h3 className="text-ink-900 font-semibold mb-4">On a $1,000 bill</h3>
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[13px] text-ink-500 w-10 shrink-0">Card</span>
            <span className="bg-clay-500 h-3 rounded-pill flex-1" />
            <span className="text-[13px] text-ink-700 font-medium">$26.10</span>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[13px] text-ink-500 w-10 shrink-0">ACH</span>
            <div className="flex-1">
              <span
                className="block bg-amber-400 h-3 rounded-pill"
                style={{ width: "14%" }}
              />
            </div>
            <span className="text-[13px] text-ink-700 font-medium">$0.25</span>
          </div>
        </div>
      </div>
      <div className="mt-4 font-bold text-sage-600">You keep 99% more</div>
    </div>
  );
}

function ApiGraphic() {
  const events = ["payment.succeeded", "payout.paid", "refund.created"];
  return (
    <div className="w-full max-w-[320px] bg-ink-900 shadow-md rounded-lg p-4">
      <div className="space-y-2.5">
        {events.map((e) => (
          <div key={e} className="flex items-center justify-between">
            <span className="font-mono text-[13px] text-[#F3EBDE]">{e}</span>
            <span className="bg-sage-500/20 text-sage-300 rounded-pill px-2.5 py-0.5 font-mono text-[12px]">
              200
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
