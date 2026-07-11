"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * The gradient graphic panel with a mouse-driven 3D tilt (product/solution heroes).
 * Respects prefers-reduced-motion.
 *
 * The graphics inside are fixed-width card clusters (~270–340px including their
 * floating accent chips). On narrow phones — where the doubled section/container
 * gutters leave the panel <300px — that overflowed the panel and got clipped by
 * `overflow-hidden`, slicing card edges and chips. We measure the content's real
 * extent and scale it down just enough to fit, so nothing clips at any width and
 * desktop stays pixel-identical (scale 1).
 */
export function TiltPanel({
  children,
  gradient,
  className,
  interactive = true,
  bare = false,
}: {
  children: React.ReactNode;
  gradient: string;
  className?: string;
  interactive?: boolean;
  /** Drop the panel chrome (border, card padding, shadow, fixed min-height) —
   *  the graphic floats directly on the gradient glow. Fit + tilt still apply. */
  bare?: boolean;
}) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const tiltRef = React.useRef<HTMLDivElement>(null);
  const scaleRef = React.useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = React.useState<string>("");
  const [fit, setFit] = React.useState(1);
  const fitRef = React.useRef(1);
  React.useEffect(() => {
    fitRef.current = fit;
  }, [fit]);

  // Fit the graphic to the panel: measure the true rendered extent of the
  // content (including absolutely-positioned chips), normalize out the scale
  // already applied, and shrink to fit with a small breathing margin.
  React.useLayoutEffect(() => {
    const panel = panelRef.current;
    const scaleEl = scaleRef.current;
    if (!panel || !scaleEl) return;

    const measure = () => {
      let min = Infinity;
      let max = -Infinity;
      for (const el of scaleEl.querySelectorAll("*")) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        if (r.left < min) min = r.left;
        if (r.right > max) max = r.right;
      }
      if (!isFinite(min) || !isFinite(max)) return;
      const naturalExtent = (max - min) / fitRef.current;
      // available = panel content box minus a 16px margin each side
      const cs = getComputedStyle(panel);
      const avail =
        panel.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const target = Math.min(1, (avail - 8) / naturalExtent);
      // Only update when it moves meaningfully — avoids ResizeObserver loops.
      if (Math.abs(target - fitRef.current) > 0.005) setFit(target);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(panel);
    return () => ro.disconnect();
  }, []);

  const onMove = (e: React.MouseEvent) => {
    if (!interactive) return;
    const el = tiltRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt(`rotateY(${px * 9}deg) rotateX(${-py * 7}deg)`);
  };

  return (
    <div
      ref={panelRef}
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-lg",
        bare
          ? "min-h-[340px] p-4"
          : "min-h-[392px] border border-border-default p-8 shadow-sm",
        className
      )}
      style={{ background: gradient, perspective: "1000px" }}
      onMouseMove={onMove}
      onMouseLeave={() => setTilt("")}
    >
      <div
        ref={tiltRef}
        className="transition-transform duration-[220ms] ease-out"
        style={{ transformStyle: "preserve-3d", transform: tilt }}
      >
        <div ref={scaleRef} style={{ transform: fit === 1 ? undefined : `scale(${fit})` }}>
          {children}
        </div>
      </div>
    </div>
  );
}
