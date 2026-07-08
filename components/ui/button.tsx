import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-pill font-semibold whitespace-nowrap select-none " +
    "transition-[transform,background-color,border-color,box-shadow,color] duration-[140ms] ease-out " +
    "active:scale-[0.985] active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 " +
    "focus-visible:outline-[var(--focus-ring)] disabled:pointer-events-none disabled:opacity-55 cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-clay-500 text-white shadow-brand hover:bg-clay-600 hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(192,98,62,0.34)]",
        secondary:
          "bg-white text-ink-900 border border-ink-200 shadow-xs hover:bg-ink-50 hover:border-ink-300 hover:-translate-y-px",
        ghost: "bg-transparent text-ink-700 hover:bg-ink-100 hover:text-ink-900",
        accent:
          "bg-amber-400 text-ink-900 hover:bg-amber-500 hover:-translate-y-px shadow-[0_4px_14px_rgba(224,160,77,0.30)]",
        "dark-secondary":
          "bg-white/10 text-on-dark border border-white/15 hover:bg-white/[0.16] hover:-translate-y-px",
      },
      size: {
        sm: "h-9 px-3.5 text-sm",
        md: "h-11 px-5 text-[15px]",
        lg: "h-[52px] px-6 text-base",
      },
      block: { true: "w-full", false: "" },
    },
    defaultVariants: { variant: "primary", size: "md", block: false },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, block, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size, block }), className)} {...props} />
  )
);
Button.displayName = "Button";
