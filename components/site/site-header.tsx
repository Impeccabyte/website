"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { Wordmark } from "./wordmark";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { IconChip } from "@/components/ui/icon-chip";
import { cn } from "@/lib/utils";
import { PRODUCTS, SOLUTIONS, productOrder, solutionNavOrder } from "@/lib/data";

type MegaKey = "products" | "industries" | null;

export function SiteHeader() {
  const [mega, setMega] = React.useState<MegaKey>(null);
  const [mobile, setMobile] = React.useState(false);
  const pathname = usePathname();

  // Close any open menu after a client-side navigation completes.
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resetting UI state on route change is the intended use here
    setMega(null);
    setMobile(false);
  }, [pathname]);

  return (
    <>
    <header
      className="sticky top-0 z-60 border-b border-border-subtle backdrop-blur-md"
      style={{ background: "rgba(250,246,239,0.94)" }}
      onMouseLeave={() => setMega(null)}
    >
      <div className="mx-auto flex h-[72px] max-w-[1240px] items-center gap-6 px-6">
        <Link href="/" aria-label="Impeccabyte home" className="shrink-0">
          <Wordmark />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 md:flex">
          <MegaTrigger label="Products" active={mega === "products"} onOpen={() => setMega("products")} />
          <MegaTrigger label="Industries" active={mega === "industries"} onOpen={() => setMega("industries")} />
          <NavLink href="/partnerships" onEnter={() => setMega(null)}>Partnerships</NavLink>
          <NavLink href="/pricing" onEnter={() => setMega(null)}>Pricing</NavLink>
          <NavLink href="/about" onEnter={() => setMega(null)}>About</NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-2.5">
          <a
            href="https://dash.impeccabyte.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-pill px-3 py-2 text-[15px] font-medium text-ink-700 transition-colors hover:bg-ink-100 hover:text-ink-900 md:inline-flex"
          >
            Sign In
          </a>
          <ButtonLink href="/contact" variant="primary" size="sm">
            Get a Quote
          </ButtonLink>
          <Button
            variant="ghost"
            size="sm"
            aria-label="Open menu"
            className="md:hidden px-2"
            onClick={() => setMobile(true)}
          >
            <Menu size={22} />
          </Button>
        </div>
      </div>

      {/* Mega menu panel */}
      {mega && (
        <div
          className="absolute inset-x-0 top-full hidden border-b border-border-default bg-white shadow-lg md:block"
          onMouseEnter={() => setMega(mega)}
        >
          <div className="mx-auto max-w-[1240px] px-6 py-6">
            {mega === "products" ? (
              <div className="grid grid-cols-4 gap-2.5">
                {productOrder.map((k) => {
                  const p = PRODUCTS[k];
                  return p.comingSoon ? (
                    <MegaItem key={k} icon={p.icon} label={p.nav} desc={p.menuDesc} tone="clay" soon />
                  ) : (
                    <MegaItem
                      key={k}
                      href={`/products/${p.key}`}
                      icon={p.icon}
                      label={p.nav}
                      desc={p.menuDesc}
                      tone="clay"
                    />
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2.5">
                {solutionNavOrder.map((k) => {
                  const s = SOLUTIONS[k];
                  return (
                    <MegaItem
                      key={k}
                      href={`/industries/${s.key}`}
                      icon={s.icon}
                      label={s.nav}
                      desc={s.menuDesc}
                      tone="amber"
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

    </header>
      {/* Rendered outside <header> so the header's backdrop-filter
          doesn't create a containing block that traps the fixed drawer. */}
      <MobileDrawer open={mobile} onClose={() => setMobile(false)} />
    </>
  );
}

function NavLink({
  href,
  children,
  onEnter,
}: {
  href: string;
  children: React.ReactNode;
  onEnter?: () => void;
}) {
  return (
    <Link
      href={href}
      onMouseEnter={onEnter}
      className="rounded-pill px-3 py-2 text-[15px] font-medium text-ink-700 transition-colors hover:bg-ink-100 hover:text-ink-900"
    >
      {children}
    </Link>
  );
}

function MegaTrigger({
  label,
  active,
  onOpen,
}: {
  label: string;
  active: boolean;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onMouseEnter={onOpen}
      onClick={onOpen}
      aria-expanded={active}
      className={cn(
        "flex items-center gap-1 rounded-pill px-3 py-2 text-[15px] font-medium transition-colors cursor-pointer",
        active ? "bg-ink-100 text-ink-900" : "text-ink-700 hover:bg-ink-100 hover:text-ink-900"
      )}
    >
      {label}
      <ChevronDown size={15} className={cn("transition-transform", active && "rotate-180")} />
    </button>
  );
}

function MegaItem({
  href,
  icon,
  label,
  desc,
  tone,
  soon,
}: {
  href?: string;
  icon: import("lucide-react").LucideIcon;
  label: string;
  desc: string;
  tone: "clay" | "amber";
  soon?: boolean;
}) {
  const inner = (
    <>
      {soon ? (
        <IconChip icon={icon} tone="ink" size={38} className="rounded-[10px]" />
      ) : (
        <IconChip icon={icon} tone={tone} size={38} className="rounded-[10px]" />
      )}
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[14.5px] font-bold text-ink-900">{label}</span>
          {soon && (
            <span className="rounded-pill border border-clay-100 bg-clay-50 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.06em] text-clay-600">
              Soon
            </span>
          )}
        </div>
        <p className="mt-0.5 line-clamp-2 max-w-[22ch] text-[12.5px] leading-snug text-ink-500">{desc}</p>
      </div>
    </>
  );

  if (soon || !href) {
    return (
      <div className="flex cursor-not-allowed items-start gap-3 rounded-md p-3 opacity-65">{inner}</div>
    );
  }
  return (
    <Link href={href} className="flex items-start gap-3 rounded-md p-3 transition-colors hover:bg-ink-50">
      {inner}
    </Link>
  );
}

/* ---------------- Mobile drawer ---------------- */

function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [section, setSection] = React.useState<"products" | "industries" | null>(null);

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] md:hidden">
      <div
        className="absolute inset-0"
        style={{ background: "rgba(42,33,26,0.42)" }}
        onClick={onClose}
        aria-hidden
      />
      <div
        className="absolute right-0 top-0 flex h-full w-[min(88vw,370px)] flex-col overflow-y-auto bg-white px-[18px] pb-7 pt-[18px] shadow-lg"
        role="dialog"
        aria-modal="true"
      >
        <div className="mb-2 flex items-center justify-between">
          <Wordmark size={20} emblem={34} />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-pill p-1.5 text-ink-600 hover:bg-ink-100 cursor-pointer"
          >
            <X size={22} />
          </button>
        </div>

        <DrawerCollapsible
          label="Products"
          open={section === "products"}
          onToggle={() => setSection(section === "products" ? null : "products")}
        >
          {productOrder.map((k) => {
            const p = PRODUCTS[k];
            const row = (
              <>
                <IconChip icon={p.icon} tone={p.comingSoon ? "ink" : "clay"} size={32} className="rounded-lg" />
                <span className="text-[15px] font-semibold text-ink-900">{p.nav}</span>
                {p.comingSoon && (
                  <span className="ml-auto rounded-pill border border-clay-100 bg-clay-50 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.06em] text-clay-600">
                    Soon
                  </span>
                )}
              </>
            );
            return p.comingSoon ? (
              <div key={k} className="flex items-center gap-3 py-2 opacity-60">{row}</div>
            ) : (
              <Link key={k} href={`/products/${p.key}`} onClick={onClose} className="flex items-center gap-3 py-2">
                {row}
              </Link>
            );
          })}
        </DrawerCollapsible>

        <DrawerCollapsible
          label="Industries"
          open={section === "industries"}
          onToggle={() => setSection(section === "industries" ? null : "industries")}
        >
          {solutionNavOrder.map((k) => {
            const s = SOLUTIONS[k];
            return (
              <Link key={k} href={`/industries/${s.key}`} onClick={onClose} className="flex items-center gap-3 py-2">
                <IconChip icon={s.icon} tone="amber" size={32} className="rounded-lg" />
                <span className="text-[15px] font-semibold text-ink-900">{s.nav}</span>
              </Link>
            );
          })}
        </DrawerCollapsible>

        <DrawerRow href="/partnerships" onClose={onClose}>Partnerships</DrawerRow>
        <DrawerRow href="/pricing" onClose={onClose}>Pricing</DrawerRow>
        <DrawerRow href="/about" onClose={onClose}>About</DrawerRow>

        <div className="mt-6 flex flex-col gap-2.5">
          <a
            href="https://dash.impeccabyte.com/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="rounded-pill py-3.5 text-center text-[17px] font-semibold text-ink-900"
          >
            Sign In
          </a>
          <ButtonLink href="/contact" variant="primary" size="lg" block onClick={onClose}>
            Get a Quote
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

function DrawerCollapsible({
  label,
  open,
  onToggle,
  children,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-ink-100">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-3.5 text-[17px] font-semibold text-ink-900 cursor-pointer"
      >
        {label}
        <ChevronDown size={20} className={cn("text-ink-500 transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="pb-2">{children}</div>}
    </div>
  );
}

function DrawerRow({
  href,
  onClose,
  children,
}: {
  href: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className="border-b border-ink-100 py-3.5 text-[17px] font-semibold text-ink-900"
    >
      {children}
    </Link>
  );
}
