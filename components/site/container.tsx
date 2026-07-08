import { cn } from "@/lib/utils";

/**
 * Site-wide width scale. Three widths, used everywhere — no per-section
 * bespoke pixel values:
 *   content (1240) — full-width sections: grids, tiers, split heroes
 *   wide    (880)  — wide centered copy: stat rows, checklists, testimonials
 *   narrow  (640)  — narrow centered copy: hero ledes, FAQ, section intros
 */
const WIDTHS = {
  narrow: "max-w-[640px]",
  wide: "max-w-[880px]",
  content: "max-w-[1240px]",
} as const;

export function Container({
  width = "content",
  className,
  children,
}: {
  width?: keyof typeof WIDTHS;
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("mx-auto w-full px-6", WIDTHS[width], className)}>{children}</div>;
}
