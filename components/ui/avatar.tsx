import * as React from "react";
import { cn } from "@/lib/utils";

const PALETTE = [
  { bg: "#F5DDD0", fg: "#833D26" }, // clay
  { bg: "#F8E4C0", fg: "#8A581F" }, // amber
  { bg: "#DCE6D0", fg: "#38492F" }, // sage
  { bg: "#E6DACE", fg: "#463424" }, // clove
  { bg: "#E0D6C6", fg: "#4D4239" }, // ink
];

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function colorFor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

const SIZES = { sm: 30, md: 38, lg: 52 } as const;

export function Avatar({
  name,
  size = "md",
  className,
  style,
}: {
  name: string;
  size?: keyof typeof SIZES;
  className?: string;
  style?: React.CSSProperties;
}) {
  const px = SIZES[size];
  const { bg, fg } = colorFor(name);
  return (
    <span
      aria-label={name}
      title={name}
      className={cn(
        "inline-flex items-center justify-center rounded-round font-semibold ring-2 ring-white shrink-0",
        className
      )}
      style={{ width: px, height: px, background: bg, color: fg, fontSize: px * 0.36, ...style }}
    >
      {initials(name)}
    </span>
  );
}

export function AvatarGroup({ names, size = "md" }: { names: string[]; size?: keyof typeof SIZES }) {
  return (
    <div className="flex items-center">
      {names.map((n, i) => (
        <Avatar key={n} name={n} size={size} className={i === 0 ? "" : "-ml-2.5"} style={{ zIndex: names.length - i }} />
      ))}
    </div>
  );
}
