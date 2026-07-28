import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Integration, Role, TileSize } from "@/lib/integrations";

/* ------------------------------------------------------------------ *
 * Bento grid
 *
 * Four fluid columns with dense auto-flow, so the 2×2 hero tiles and 2×1
 * wide tiles backfill cleanly. Collapses to two columns under 920px and to
 * a single column under 560px — where every span resets to auto, otherwise
 * a `col-span-2` tile would blow the one-column track out.
 * ------------------------------------------------------------------ */

export function BentoGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "ib-rv-s grid grid-cols-4 items-stretch gap-[14px] [grid-auto-flow:dense]",
        "max-[920px]:grid-cols-2 max-[560px]:grid-cols-1",
        className
      )}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Shared parts
 * ------------------------------------------------------------------ */

/** Logo box geometry per tile weight: [box, radius, mark]. */
const LOGO: Record<TileSize, [number, number, number]> = {
  hero: [48, 13, 30],
  wide: [40, 11, 24],
  medium: [34, 9, 20],
  small: [30, 8, 18],
};

function LogoSquare({ logo, size }: { logo: string; size: TileSize }) {
  const [box, radius, mark] = LOGO[size];
  return (
    <span
      className={cn(
        "inline-flex flex-none items-center justify-center border border-ink-100 bg-white",
        size === "hero" && "shadow-sm"
      )}
      style={{ width: box, height: box, borderRadius: radius }}
    >
      {/* alt="" — the vendor name sits right beside the mark, so announcing it
          twice is noise for a screen reader. */}
      <Image
        src={`/logos/${logo}.png`}
        alt=""
        width={mark}
        height={mark}
        style={{ width: mark, height: mark, objectFit: "contain" }}
      />
    </span>
  );
}

/**
 * Uppercase clay attribution — "via NMI or Authorize.Net".
 *
 * This is compliance copy: it scopes what we're claiming ("connects via gateway
 * X"). At four columns the tiles are ~270px and the design ellipsizes it, so the
 * full string also rides along in `title`. Below the 4-column breakpoint there's
 * room to wrap, and we take it rather than clip an attribution on a phone.
 */
function Via({ children, size }: { children: string; size: TileSize }) {
  return (
    <div
      title={children}
      className="overflow-hidden text-ellipsis whitespace-normal font-semibold uppercase tracking-[0.05em] text-clay-600 min-[920px]:whitespace-nowrap"
      style={{ fontSize: size === "hero" ? 11 : size === "small" ? 10 : 10.5 }}
    >
      {children}
    </div>
  );
}

const ROLE_TONE: Record<Role, string> = {
  gateway: "bg-clay-50 border-clay-100 text-clay-700",
  checkout: "bg-amber-50 border-amber-100 text-[#8A6A2E]",
  commerce: "bg-amber-50 border-amber-100 text-[#8A6A2E]",
  billing: "bg-sage-50 border-sage-100 text-sage-600",
  routing: "bg-ink-100 border-ink-200 text-ink-600",
};

const ROLE_LABEL: Record<Role, string> = {
  gateway: "Gateway",
  checkout: "Checkout",
  commerce: "Commerce",
  billing: "Billing",
  routing: "Routing",
};

function RoleBadge({ role }: { role: Role }) {
  return (
    <span
      className={cn(
        "whitespace-nowrap rounded-pill border px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.06em]",
        ROLE_TONE[role]
      )}
    >
      {ROLE_LABEL[role]}
    </span>
  );
}

function Chip({ children }: { children: string }) {
  return (
    <span className="rounded-pill border border-ink-100 bg-white px-[11px] py-1 text-[12px] font-semibold text-ink-700">
      {children}
    </span>
  );
}

/** White surface, hairline, 20px radius — the base every tile shares. */
const TILE = "min-w-0 rounded-lg border border-border-default bg-white shadow-sm";
/** Spans reset in the single-column layout so wide/hero tiles don't overflow. */
const SPAN_2 = "col-span-2 max-[560px]:col-auto";

/* ------------------------------------------------------------------ *
 * Tile
 * ------------------------------------------------------------------ */

export function IntegrationTile({ item }: { item: Integration }) {
  if (item.size === "hero") return <HeroTile item={item} />;
  if (item.size === "wide") return <WideTile item={item} />;
  if (item.size === "small") return <SmallTile item={item} />;
  return <MediumTile item={item} />;
}

function HeroTile({ item }: { item: Integration }) {
  return (
    <div
      className={cn(TILE, SPAN_2, "row-span-2 flex flex-col p-7 max-[560px]:row-auto")}
      style={{ background: "linear-gradient(165deg, var(--surface-card) 40%, var(--clay-50))" }}
    >
      <div className="flex items-center justify-between gap-2.5">
        <div className="flex min-w-0 items-center gap-[13px]">
          <LogoSquare logo={item.logo} size="hero" />
          <div className="min-w-0">
            <div className="text-[20px] font-bold text-ink-900">{item.name}</div>
            {item.via && <Via size="hero">{item.via}</Via>}
          </div>
        </div>
        {item.role && <RoleBadge role={item.role} />}
      </div>

      <h3
        className="mt-5 font-display font-semibold tracking-[-0.015em] text-ink-900"
        style={{ fontSize: 24, lineHeight: 1.2 }}
      >
        {item.headline}
      </h3>
      <p className="mt-2.5 flex-1 text-[14.5px] leading-relaxed text-ink-600">{item.body}</p>

      {item.chips && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {item.chips.map((c) => (
            <Chip key={c}>{c}</Chip>
          ))}
        </div>
      )}
    </div>
  );
}

function WideTile({ item }: { item: Integration }) {
  return (
    <div className={cn(TILE, SPAN_2, "flex items-center gap-[14px] p-5")}>
      <LogoSquare logo={item.logo} size="wide" />
      <div className="min-w-0">
        {/* Name and attribution share a baseline at four columns; below that the
            attribution drops to its own line instead of being clipped. */}
        <div className="flex min-w-0 flex-col gap-0 min-[920px]:flex-row min-[920px]:items-baseline min-[920px]:gap-[9px]">
          <span className="whitespace-nowrap text-[16px] font-bold text-ink-900">{item.name}</span>
          {item.via && <Via size="wide">{item.via}</Via>}
        </div>
        <p className="mt-1 text-[13px] leading-[1.5] text-ink-600">{item.body}</p>
      </div>
    </div>
  );
}

function MediumTile({ item }: { item: Integration }) {
  return (
    <div className={cn(TILE, "flex flex-col p-5")}>
      <div className="flex items-center gap-2.5">
        <LogoSquare logo={item.logo} size="medium" />
        <div className="min-w-0">
          <div className="truncate text-[15px] font-bold text-ink-900">{item.name}</div>
          {item.via && <Via size="medium">{item.via}</Via>}
        </div>
      </div>
      <p className="mt-2.5 flex-1 text-[13px] leading-[1.5] text-ink-600">{item.body}</p>
      {item.role && (
        <div className="mt-2.5 flex justify-end">
          <RoleBadge role={item.role} />
        </div>
      )}
    </div>
  );
}

function SmallTile({ item }: { item: Integration }) {
  return (
    <div className={cn(TILE, "flex items-center gap-2.5 px-[18px] py-4")}>
      <LogoSquare logo={item.logo} size="small" />
      <div className="min-w-0">
        <div className="truncate text-[14px] font-bold text-ink-900">{item.name}</div>
        {item.via && <Via size="small">{item.via}</Via>}
      </div>
    </div>
  );
}
