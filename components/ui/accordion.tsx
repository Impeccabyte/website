"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Accordion({
  items,
  defaultOpen = 0,
}: {
  items: { q: string; a: string }[];
  defaultOpen?: number;
}) {
  const [open, setOpen] = React.useState<number | null>(defaultOpen);

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={item.q}
            className={cn(
              "rounded-md border bg-white transition-colors duration-[140ms]",
              isOpen ? "border-clay-200" : "border-border-default"
            )}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer"
            >
              <span className="font-semibold text-ink-900 text-[16.5px]">{item.q}</span>
              <span
                className={cn(
                  "relative h-5 w-5 shrink-0 text-clay-500 transition-transform duration-[220ms] ease-out",
                  isOpen && "rotate-45"
                )}
                aria-hidden
              >
                <span className="absolute left-1/2 top-1/2 h-[2px] w-3 -translate-x-1/2 -translate-y-1/2 rounded bg-current" />
                <span className="absolute left-1/2 top-1/2 h-3 w-[2px] -translate-x-1/2 -translate-y-1/2 rounded bg-current" />
              </span>
            </button>
            <div
              className="grid transition-[grid-template-rows] duration-[280ms] ease-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-4 text-[15px] leading-relaxed text-ink-600">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
