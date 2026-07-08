import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "clay" | "amber" | "sage" | "ink";

const TONES: Record<Tone, string> = {
  clay: "bg-clay-50 text-clay-600",
  amber: "bg-amber-50 text-amber-700",
  sage: "bg-sage-50 text-sage-600",
  ink: "bg-ink-100 text-ink-600",
};

/** Rounded tinted square holding a Lucide icon — the DS's primary icon treatment. */
export function IconChip({
  icon: Icon,
  tone = "clay",
  size = 52,
  className,
}: {
  icon: LucideIcon;
  tone?: Tone;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn("inline-flex items-center justify-center rounded-md shrink-0", TONES[tone], className)}
      style={{ width: size, height: size }}
    >
      <Icon size={Math.round(size * 0.46)} strokeWidth={1.85} />
    </span>
  );
}
