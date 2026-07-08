import Image from "next/image";
import { cn } from "@/lib/utils";

export function Wordmark({
  variant = "default",
  size = 22,
  emblem = 38,
  className,
}: {
  variant?: "default" | "cream";
  size?: number;
  emblem?: number;
  className?: string;
}) {
  const isCream = variant === "cream";
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Image
        src={isCream ? "/brand/impeccabyte-emblem-cream.svg" : "/brand/impeccabyte-emblem.svg"}
        alt=""
        width={emblem}
        height={emblem}
        priority
      />
      <span
        className="font-display font-semibold tracking-[-0.02em]"
        style={{ fontSize: size, color: isCream ? "#F3EBDE" : "var(--ink-900)" }}
      >
        Impecca<span style={{ color: isCream ? "var(--amber-400)" : "var(--clay-500)" }}>byte</span>
      </span>
    </span>
  );
}
