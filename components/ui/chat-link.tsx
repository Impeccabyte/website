"use client";

import * as React from "react";
import Link from "next/link";
import { buttonVariants, type ButtonProps } from "./button";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    Intercom?: ((command: string, ...args: unknown[]) => void) & { booted?: boolean };
  }
}

/**
 * A CTA that opens the Intercom messenger, styled as a design-system button.
 *
 * It renders as a real `<Link>` to `href` (default `/contact`) and only
 * *intercepts* the click when the messenger is genuinely available. That
 * ordering matters here:
 *
 *  - Intercom is injected by GTM, not by this codebase, so the app can't assume
 *    it exists. GTM installs its own `window.Intercom` stub immediately, which
 *    means `typeof window.Intercom === "function"` is NOT a usable signal — the
 *    stub silently queues calls forever if the library never boots. We check
 *    `.booted`, which only the real library sets.
 *  - If the messenger isn't up (GTM blocked, still loading, tag misconfigured),
 *    the click just follows the link and the visitor lands on the contact form.
 *    A CTA that does nothing is worse than one that goes somewhere sensible.
 *  - Being a real anchor also keeps the link crawlable and lets modified clicks
 *    (⌘/ctrl/middle) open the contact page in a new tab, as any link should.
 */
export function ChatLink({
  className,
  variant,
  size,
  block,
  href = "/contact",
  children,
  ...props
}: Omit<React.ComponentProps<typeof Link>, "href"> &
  Pick<ButtonProps, "variant" | "size" | "block"> & { href?: string }) {
  return (
    <Link
      href={href}
      onClick={(e) => {
        // Let the browser handle new-tab/new-window clicks normally.
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        const intercom = typeof window === "undefined" ? undefined : window.Intercom;
        if (!intercom?.booted) return; // fall through to href
        e.preventDefault();
        intercom("show");
      }}
      className={cn(buttonVariants({ variant, size, block }), className)}
      {...props}
    >
      {children}
    </Link>
  );
}
