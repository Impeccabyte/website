"use client";

import * as React from "react";

/**
 * Live "trusted by N businesses" counter. Starts at 12,847 and ticks up
 * 1–2 every 3.2s. Rendered as ordinary tabular-nums text so the digits and
 * thousands separator stay on the baseline and the width doesn't jitter.
 */
export function Odometer({ start = 12847 }: { start?: number }) {
  const [value, setValue] = React.useState(start);

  React.useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setValue((v) => v + 1 + Math.floor(Math.random() * 2)), 3200);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="font-semibold tabular-nums text-ink-900 tracking-tight">
      {value.toLocaleString("en-US")}
    </span>
  );
}
