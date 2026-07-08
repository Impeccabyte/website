import * as React from "react";
import { cn } from "@/lib/utils";

/** Brand-toned informational callout (About → Maverick partnership). */
export function Callout({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-md border-l-[3px] border-clay-400 bg-clay-50 p-4 pl-5", className)}>
      <p className="text-sm font-bold text-clay-700">{title}</p>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-700">{children}</p>
    </div>
  );
}
