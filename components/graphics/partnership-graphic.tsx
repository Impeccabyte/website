import { FileSignature, Check } from "lucide-react";

export function PartnershipGraphic() {
  return (
    <div className="relative">
      {/* Main agreement card */}
      <div
        className="w-[272px] bg-white border border-ink-100 shadow-md rounded-lg p-5"
        style={{ transform: "rotate(-2.5deg)" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <span
            className="flex items-center justify-center bg-clay-50 text-clay-600 rounded-md shrink-0"
            style={{ width: "38px", height: "38px" }}
          >
            <FileSignature className="w-5 h-5" />
          </span>
          <div>
            <div className="text-ink-900 font-bold text-sm leading-tight">
              Partnership Agreement
            </div>
            <div className="text-ink-500 text-[12px]">
              Impeccabyte × Northwind Co.
            </div>
          </div>
        </div>

        {/* Placeholder bars */}
        <div className="space-y-2 mb-4">
          <div className="bg-ink-100 h-2.5 rounded-pill w-full" />
          <div className="bg-ink-100 h-2.5 rounded-pill w-2/3" />
        </div>

        {/* Revenue share row */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-ink-700">Revenue share</span>
          <span className="bg-amber-50 text-amber-700 rounded-pill px-3 py-1 text-[13px] font-medium">
            70 / 30
          </span>
        </div>

        {/* Signature */}
        <svg viewBox="0 0 120 40" className="w-24 h-8">
          <path
            d="M4 28 C 16 8, 24 8, 32 24 S 52 40, 64 20 S 92 6, 116 22"
            fill="none"
            stroke="#C0623E"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
        <div className="border-t border-ink-200 mt-1 pt-1.5">
          <span className="text-ink-400 text-[11px]">Authorized signature</span>
        </div>
      </div>

      {/* Top-left partners pill */}
      <div className="absolute -top-4 -left-4 flex items-center gap-2 bg-white shadow-md rounded-pill px-3 py-1.5">
        <div className="flex items-center">
          <span className="flex items-center justify-center bg-clay-500 text-white rounded-full w-6 h-6 text-[10px] font-semibold ring-2 ring-white">
            IB
          </span>
          <span className="flex items-center justify-center bg-amber-400 text-ink-900 rounded-full w-6 h-6 text-[10px] font-semibold ring-2 ring-white -ml-2">
            N
          </span>
        </div>
        <span className="text-[13px] text-ink-700">Partners</span>
      </div>

      {/* Bottom-right deal closed */}
      <div className="absolute -bottom-6 -right-6 flex flex-col items-center gap-1.5">
        <span
          className="flex items-center justify-center bg-amber-400 rounded-full shadow-md"
          style={{ width: "66px", height: "66px" }}
        >
          <Check className="w-8 h-8 text-white" />
        </span>
        <span className="bg-white shadow-md rounded-pill px-3 py-1 text-[12px] text-ink-700 font-medium">
          Deal closed
        </span>
      </div>
    </div>
  );
}
