import * as React from "react";
import { CircleAlert, Info } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Inline message banner.
 *
 * `brand` (default) is the clay-tinted rule-on-the-left treatment used on the
 * About page. `warning` and `info` mirror the design system's Callout — full
 * hairline, leading icon. `warning` (amber) is for the moments where we're
 * telling you something you may not want to hear (see /integrations → Shopify);
 * `info` (slate) is the neutral aside, e.g. /compare → "if you're happy where
 * you are, stay".
 *
 * The `info` colours are the design system's `.ib-callout--info` verbatim:
 * slate-50 ground, #D6E0E4 hairline (there is no --slate-100 token), slate-500
 * mark.
 */
const HAIRLINE_TONES = {
  warning: { icon: CircleAlert, surface: "border-amber-100 bg-amber-50", mark: "text-amber-700" },
  info: { icon: Info, surface: "border-[#D6E0E4] bg-slate-50", mark: "text-slate-500" },
} as const;

export function Callout({
  title,
  children,
  variant = "brand",
  className,
}: {
  title: string;
  children: React.ReactNode;
  variant?: "brand" | "warning" | "info";
  className?: string;
}) {
  if (variant === "warning" || variant === "info") {
    const tone = HAIRLINE_TONES[variant];
    const Icon = tone.icon;
    return (
      <div
        role="note"
        className={cn("flex items-start gap-3 rounded-md border px-4 py-3.5", tone.surface, className)}
      >
        <Icon size={18} strokeWidth={1.8} aria-hidden className={cn("mt-px shrink-0", tone.mark)} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-ink-900">{title}</p>
          <p className="mt-0.5 text-[13.5px] leading-[1.5] text-ink-700">{children}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("rounded-md border-l-[3px] border-clay-400 bg-clay-50 p-4 pl-5", className)}>
      <p className="text-sm font-bold text-clay-700">{title}</p>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-700">{children}</p>
    </div>
  );
}
