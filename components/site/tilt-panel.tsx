"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * The gradient graphic panel with a mouse-driven 3D tilt (product/solution heroes).
 * Respects prefers-reduced-motion.
 */
export function TiltPanel({
  children,
  gradient,
  className,
  interactive = true,
}: {
  children: React.ReactNode;
  gradient: string;
  className?: string;
  interactive?: boolean;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [transform, setTransform] = React.useState<string>("");

  const onMove = (e: React.MouseEvent) => {
    if (!interactive) return;
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTransform(`rotateY(${px * 9}deg) rotateX(${-py * 7}deg)`);
  };

  return (
    <div
      className={cn(
        "relative flex min-h-[392px] items-center justify-center overflow-hidden rounded-lg border border-border-default p-8 shadow-sm",
        className
      )}
      style={{ background: gradient, perspective: "1000px" }}
      onMouseMove={onMove}
      onMouseLeave={() => setTransform("")}
    >
      <div
        ref={ref}
        className="transition-transform duration-[220ms] ease-out"
        style={{ transformStyle: "preserve-3d", transform }}
      >
        {children}
      </div>
    </div>
  );
}
