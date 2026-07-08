import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva("rounded-lg transition-[transform,box-shadow,border-color] duration-[220ms] ease-out", {
  variants: {
    tone: {
      default: "bg-white border border-border-default text-ink-800",
      brand: "bg-clay-50 border border-clay-100 text-ink-800",
      dark: "bg-surface-dark border border-white/10 text-on-dark",
    },
    elevation: {
      flat: "shadow-none",
      sm: "shadow-sm",
      raised: "shadow-md",
    },
    padding: {
      none: "p-0",
      sm: "p-5",
      md: "p-[26px]",
      lg: "p-[30px]",
    },
    interactive: {
      true: "hover:-translate-y-[3px] hover:shadow-lg hover:border-clay-200",
      false: "",
    },
  },
  defaultVariants: { tone: "default", elevation: "sm", padding: "md", interactive: false },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, tone, elevation, padding, interactive, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ tone, elevation, padding, interactive }), className)}
      {...props}
    />
  )
);
Card.displayName = "Card";
