import * as React from "react";
import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Inline message banner.
 *
 * `brand` (default) is the clay-tinted rule-on-the-left treatment used on the
 * About page. `warning` mirrors the design system's amber Callout — full
 * hairline, leading icon — for the moments where we're telling you something
 * you may not want to hear (see /integrations → Shopify).
 */
export function Callout({
  title,
  children,
  variant = "brand",
  className,
}: {
  title: string;
  children: React.ReactNode;
  variant?: "brand" | "warning";
  className?: string;
}) {
  if (variant === "warning") {
    return (
      <div
        role="note"
        className={cn(
          "flex items-start gap-3 rounded-md border border-amber-100 bg-amber-50 px-4 py-3.5",
          className
        )}
      >
        <CircleAlert size={18} strokeWidth={1.8} aria-hidden className="mt-px shrink-0 text-amber-700" />
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
