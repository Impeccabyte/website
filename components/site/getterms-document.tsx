"use client";

import { useEffect, useRef, useState } from "react";
import { Mail } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Renders a GetTerms legal document (Privacy / Terms / Cookies) with a live,
 * on-page "On this page" navigation.
 *
 * GetTerms ships an embed.js that, in `direct` mode, drops a hidden iframe
 * pointing at {env}/embed/{account}/{doc}/{lang} and then swaps the document
 * HTML into the embed element when the iframe postMessages it back. That
 * script only initialises ONCE, on load, and never re-scans — so it silently
 * fails on Next.js client-side navigation (e.g. switching Privacy → Terms).
 *
 * We drive the same, documented protocol ourselves from a component effect so
 * it works on every navigation, cleans up after itself, and gives us a precise
 * hook to (re)build the table of contents from the freshly-injected DOM. We
 * deliberately never set `data-getterms-styles`, so GetTerms' default
 * stylesheet stays dormant and our `.legal-doc` styles own the typography.
 */

type TocEntry = { id: string; text: string };
type Status = "loading" | "ready" | "error";

function slugify(text: string): string {
  const base = text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return `legal-${base || "section"}`;
}

/**
 * Build a TOC from the injected document. GetTerms documents lead with a title
 * heading (which our branded hero already shows, so we hide it) followed by the
 * section headings. We pick the shallowest heading level that repeats as the
 * section level, so this adapts whether sections are h2s or h3s.
 */
function buildToc(container: HTMLElement): TocEntry[] {
  const headings = Array.from(
    container.querySelectorAll<HTMLElement>("h1, h2, h3, h4"),
  );
  if (headings.length === 0) return [];

  const levelOf = (el: HTMLElement) => Number(el.tagName[1]);
  const minLevel = Math.min(...headings.map(levelOf));
  const topLevel = headings.filter((h) => levelOf(h) === minLevel);

  // A single leading top-level heading is the document title — the hero already
  // displays it, so hide it to avoid a duplicate <h1>.
  let body = headings;
  if (topLevel.length === 1 && headings[0] === topLevel[0]) {
    topLevel[0].style.display = "none";
    body = headings.slice(1);
  }
  if (body.length === 0) return [];

  const sectionLevel = Math.min(...body.map(levelOf));
  const sections = body.filter((h) => levelOf(h) === sectionLevel);

  const used = new Set<string>();
  return sections.map((h) => {
    const text = (h.textContent ?? "").trim();
    const id = h.id || slugify(text);
    let unique = id;
    let n = 2;
    while (used.has(unique)) unique = `${id}-${n++}`;
    used.add(unique);
    h.id = unique;
    h.style.scrollMarginTop = "96px";
    return { id: unique, text };
  });
}

export function GetTermsDocument({
  account,
  slug,
  lang,
  env,
  shortName,
}: {
  account: string;
  slug: string;
  lang: string;
  env: string;
  shortName: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [toc, setToc] = useState<TocEntry[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [status, setStatus] = useState<Status>("loading");

  // Load the document via the GetTerms direct-embed protocol.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    setStatus("loading");
    setToc([]);
    setActiveId("");
    container.innerHTML = "";

    const origin = env.replace(/\/+$/, "");
    const normLang = lang.replace(/_/g, "-");
    const uuid = `${account}/${slug}/${normLang}/0`;
    const src = `${origin}/embed/${account}/${slug}/${normLang}?i=0&mode=direct`;

    const iframe = document.createElement("iframe");
    iframe.className = "getterms-iframe";
    iframe.setAttribute("scrolling", "no");
    iframe.dataset.uuid = uuid;
    Object.assign(iframe.style, {
      width: "0px",
      height: "0px",
      border: "0",
      padding: "0",
      margin: "0",
      display: "none",
    });

    let settled = false;
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== origin) return;
      const data = event.data as { uuid?: string; html?: string } | null;
      if (!data || data.uuid !== uuid || typeof data.html !== "string") return;
      settled = true;
      // Inject the document HTML. We intentionally do NOT mirror GetTerms'
      // `data-getterms-styles` attribute, so our `.legal-doc` CSS owns styling.
      container.innerHTML = data.html;
      const entries = buildToc(container);
      setToc(entries);
      setActiveId(entries[0]?.id ?? "");
      setStatus("ready");
    };

    window.addEventListener("message", onMessage);
    iframe.src = src;
    container.appendChild(iframe);

    const timeout = window.setTimeout(() => {
      if (!settled) setStatus("error");
    }, 12000);

    return () => {
      window.removeEventListener("message", onMessage);
      window.clearTimeout(timeout);
      container.innerHTML = "";
    };
  }, [account, slug, lang, env]);

  // Scroll-spy: highlight the section whose heading is currently at the top.
  useEffect(() => {
    if (toc.length === 0) return;
    const container = containerRef.current;
    if (!container) return;

    const headings = toc
      .map((t) => container.querySelector<HTMLElement>(`[id="${t.id}"]`))
      .filter((el): el is HTMLElement => el != null);

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const offset = 100;
        let current = headings[0]?.id ?? "";
        for (const h of headings) {
          if (h.getBoundingClientRect().top - offset <= 0) current = h.id;
          else break;
        }
        setActiveId(current);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [toc]);

  return (
    <section className="mx-auto max-w-[1120px] px-6 pb-24 pt-14">
      <div className="grid grid-cols-1 items-start gap-14 md:grid-cols-[230px_1fr]">
        {/* On-page navigation */}
        <nav
          aria-label="On this page"
          className="sticky top-24 hidden max-h-[calc(100vh-7rem)] flex-col md:flex"
        >
          <p className="mb-3.5 flex-none text-[11px] font-bold uppercase tracking-[0.12em] text-ink-400">
            On this page
          </p>
          <div className="legal-toc-scroll flex min-h-0 flex-col gap-0.5 overflow-y-auto border-l border-border-default pr-2">
            {toc.length === 0 ? (
              <span className="py-1.5 pl-4 text-[14px] text-ink-400">
                {status === "error" ? "Unavailable" : "Loading…"}
              </span>
            ) : (
              toc.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={() => setActiveId(s.id)}
                  aria-current={activeId === s.id ? "true" : undefined}
                  className={cn(
                    "-ml-px border-l-2 py-1.5 pl-4 text-[14px] leading-snug transition-colors",
                    activeId === s.id
                      ? "border-clay-400 font-semibold text-clay-600"
                      : "border-transparent text-ink-600 hover:text-clay-600",
                  )}
                >
                  {s.text}
                </a>
              ))
            )}
          </div>
        </nav>

        {/* Document */}
        <div>
          {status === "loading" && (
            <div className="animate-pulse space-y-4" aria-hidden>
              <div className="h-7 w-2/5 rounded bg-ink-100" />
              <div className="h-4 w-full rounded bg-ink-100" />
              <div className="h-4 w-11/12 rounded bg-ink-100" />
              <div className="h-4 w-4/5 rounded bg-ink-100" />
              <div className="mt-8 h-7 w-1/3 rounded bg-ink-100" />
              <div className="h-4 w-full rounded bg-ink-100" />
              <div className="h-4 w-10/12 rounded bg-ink-100" />
            </div>
          )}
          {status === "loading" && <span className="sr-only">Loading {shortName}…</span>}

          {status === "error" && (
            <div className="rounded-md border border-border-default bg-surface-sunken px-5 py-6 text-[15px] leading-relaxed text-ink-600">
              This {shortName.toLowerCase()} is taking longer than usual to load. Please refresh the
              page, or email us at{" "}
              <a
                href="mailto:privacy@impeccabyte.com"
                className="font-semibold text-clay-600 hover:text-clay-700"
              >
                privacy@impeccabyte.com
              </a>{" "}
              and we'll send you a copy.
            </div>
          )}

          {/* GetTerms injects the document HTML here. */}
          <div ref={containerRef} className="getterms-document-embed legal-doc" />

          {status === "ready" && (
            <div className="mt-4 flex items-start gap-3 rounded-md border border-clay-100 bg-clay-50 px-5 py-[18px]">
              <Mail size={19} className="mt-px flex-none text-clay-600" aria-hidden />
              <p className="text-[15px] leading-relaxed text-ink-700">
                Questions about this {shortName}? Write to us at{" "}
                <a
                  href="mailto:privacy@impeccabyte.com"
                  className="font-semibold text-clay-600 hover:text-clay-700"
                >
                  privacy@impeccabyte.com
                </a>{" "}
                or Impeccabyte, LLC · 1606 Headway Circle Ste. 9317, Austin, TX 78754.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
