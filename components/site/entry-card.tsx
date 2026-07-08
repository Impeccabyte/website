import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { IconChip } from "@/components/ui/icon-chip";
import { cn } from "@/lib/utils";
import { PRODUCTS, SOLUTIONS, type ProductKey, type SolutionKey } from "@/lib/data";

/** A clickable product card for feature/related grids. */
export function ProductCard({
  keyName,
  variant = "feature",
}: {
  keyName: ProductKey;
  variant?: "feature" | "related";
}) {
  const p = PRODUCTS[keyName];
  const large = variant === "feature";
  return (
    <Link href={`/products/${p.key}`} className="group block">
      <Card interactive padding="lg" className="relative h-full">
        <ArrowUpRight
          size={18}
          className="absolute right-[30px] top-[30px] text-ink-300 transition-colors group-hover:text-clay-500"
        />
        {/* Heading is centered against the icon chip; the corner arrow stays out of flow. */}
        <div className="flex items-center gap-4">
          <IconChip icon={p.icon} tone="clay" size={large ? 52 : 46} />
          <h3 className={cn("min-w-0 pr-7 font-bold text-ink-900", large ? "text-[20px]" : "text-[18px]")}>
            {p.nav}
          </h3>
        </div>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-600">{p.menuDesc}.</p>
      </Card>
    </Link>
  );
}

/** A clickable industry/solution card. */
export function SolutionCard({ keyName }: { keyName: SolutionKey }) {
  const s = SOLUTIONS[keyName];
  return (
    <Link href={`/industries/${s.key}`} className="group block">
      <Card interactive padding="lg" className="relative h-full">
        <ArrowUpRight
          size={18}
          className="absolute right-[30px] top-[30px] text-ink-300 transition-colors group-hover:text-amber-600"
        />
        <div className="flex items-center gap-4">
          <IconChip icon={s.icon} tone="amber" size={46} />
          <h3 className="min-w-0 pr-7 text-[18px] font-bold text-ink-900">{s.nav}</h3>
        </div>
        <p className="mt-3 min-h-[46px] text-[15px] leading-relaxed text-ink-600">{s.menuDesc}.</p>
      </Card>
    </Link>
  );
}
