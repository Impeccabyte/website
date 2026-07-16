import { programComparison } from "@/lib/data";
import { cn } from "@/lib/utils";

/**
 * Surcharge vs. Cash Discount comparison table. Shared by both pricing-program
 * pages; `highlight` tints the column for the program whose page you're on.
 * Column headers are passed in so each page can use the design's wording
 * (the Surcharge page labels the other program "Dual pricing").
 */
export function ProgramComparison({
  highlight,
  leftLabel = "Surcharge",
  rightLabel = "Cash Discount",
}: {
  highlight: "surcharge" | "cashDiscount";
  leftLabel?: string;
  rightLabel?: string;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border-default bg-white">
      <table className="w-full min-w-[560px] border-collapse text-left">
        <thead>
          <tr className="border-b border-ink-200">
            <th className="w-[34%] px-5 py-4" />
            <th
              className={cn(
                "px-5 py-4 text-[15px] font-bold",
                highlight === "surcharge" ? "bg-clay-50 text-clay-700" : "text-ink-900"
              )}
            >
              {leftLabel}
            </th>
            <th
              className={cn(
                "px-5 py-4 text-[15px] font-bold",
                highlight === "cashDiscount" ? "bg-clay-50 text-clay-700" : "text-ink-900"
              )}
            >
              {rightLabel}
            </th>
          </tr>
        </thead>
        <tbody>
          {programComparison.map((row) => (
            <tr key={row.label} className="border-b border-ink-100 last:border-0">
              <td className="px-5 py-3.5 text-[14px] font-semibold text-ink-700">{row.label}</td>
              <td
                className={cn(
                  "px-5 py-3.5 text-[14px] leading-snug",
                  highlight === "surcharge" ? "bg-clay-50/60 text-ink-800" : "text-ink-600"
                )}
              >
                {row.surcharge}
              </td>
              <td
                className={cn(
                  "px-5 py-3.5 text-[14px] leading-snug",
                  highlight === "cashDiscount" ? "bg-clay-50/60 text-ink-800" : "text-ink-600"
                )}
              >
                {row.cashDiscount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
