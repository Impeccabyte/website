import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-pill font-semibold leading-none whitespace-nowrap",
  {
    variants: {
      variant: {
        success: "bg-sage-50 text-sage-600 border border-sage-100",
        brand: "bg-clay-50 text-clay-600 border border-clay-100",
        amber: "bg-amber-50 text-amber-700 border border-amber-100",
        neutral: "bg-ink-100 text-ink-500 border border-ink-200",
      },
      solid: { true: "", false: "" },
      size: {
        sm: "text-[10px] tracking-[0.06em] uppercase px-2 py-1",
        md: "text-xs px-2.5 py-1.5",
      },
    },
    compoundVariants: [
      { variant: "brand", solid: true, className: "bg-clay-500 text-white border-clay-500" },
      { variant: "success", solid: true, className: "bg-sage-500 text-white border-sage-500" },
    ],
    defaultVariants: { variant: "neutral", solid: false, size: "md" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

export function Badge({ className, variant, solid, size, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, solid, size }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            "inline-block h-1.5 w-1.5 rounded-round",
            solid ? "bg-white" : variant === "success" ? "bg-sage-500" : "bg-clay-500"
          )}
        />
      )}
      {children}
    </span>
  );
}
