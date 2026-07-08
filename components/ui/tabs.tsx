"use client";

import { cn } from "@/lib/utils";

/** Pill segmented control (used in the rate calculator). */
export function PillTabs<T extends string>({
  items,
  value,
  onValueChange,
  className,
}: {
  items: { value: T; label: string }[];
  value: T;
  onValueChange: (v: T) => void;
  className?: string;
}) {
  return (
    <div className={cn("inline-flex w-full rounded-pill bg-ink-100 p-1", className)}>
      {items.map((item) => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onValueChange(item.value)}
            aria-pressed={active}
            className={cn(
              "flex-1 rounded-pill px-3 py-2 text-[13.5px] font-semibold transition-all duration-[140ms] ease-out cursor-pointer",
              active ? "bg-white text-ink-900 shadow-sm" : "text-ink-500 hover:text-ink-700"
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
