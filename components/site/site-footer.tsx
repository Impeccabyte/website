import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Wordmark } from "./wordmark";
import { PRODUCTS, SOLUTIONS, footerProductKeys, footerSolutionKeys } from "@/lib/data";

const SOCIALS: { label: string; href: string; path: React.ReactNode }[] = [
  {
    label: "Facebook",
    href: "#",
    path: <path d="M14 8.5h1.8V5.6C15.5 5.5 14.4 5.4 13.4 5.4c-2.2 0-3.6 1.3-3.6 3.7v2H7v3h2.8V22h3.4v-7.9h2.7l.4-3h-3.1V9.4c0-.6.2-.9 1.4-.9z" />,
  },
  {
    label: "Instagram",
    href: "#",
    path: (
      <>
        <rect x="4.5" y="4.5" width="15" height="15" rx="4.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="12" cy="12" r="3.6" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="16.4" cy="7.6" r="1.05" />
      </>
    ),
  },
  {
    label: "X",
    href: "#",
    path: <path d="M4 4h3.4l4 5.5L16.2 4H20l-6.3 8L20.4 20H17l-4.4-6L7.5 20H4l6.7-8.5z" />,
  },
  {
    label: "TikTok",
    href: "#",
    path: <path d="M13.8 3.5c.3 1.9 1.4 3.4 3.7 3.6v2.4c-1.2.1-2.4-.3-3.6-1v5.5c0 3-2.1 4.9-4.7 4.9-2.5 0-4.4-1.9-4.4-4.3 0-2.6 2.2-4.6 5.1-4.1v2.5c-.4-.1-.8-.2-1.2-.1-1 .1-1.6.8-1.5 1.9.1 1 .9 1.6 1.9 1.5 1-.1 1.6-.9 1.6-2V3.5z" />,
  },
  {
    label: "LinkedIn",
    href: "#",
    path: (
      <>
        <rect x="4" y="9" width="3" height="11" />
        <circle cx="5.5" cy="5.5" r="1.8" />
        <path d="M10 9h2.9v1.5c.5-.9 1.6-1.7 3.1-1.7 2.6 0 3.5 1.6 3.5 4.2V20h-3v-6c0-1.4-.5-2.2-1.7-2.2-1 0-1.6.7-1.8 1.4-.1.2-.1.6-.1.9V20h-3z" />
      </>
    ),
  },
];

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-amber-300">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="text-[14.5px] text-[rgba(243,235,222,0.72)] transition-colors hover:text-[#F3EBDE]"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-surface-dark text-[#F3EBDE]">
      <div className="mx-auto max-w-[1240px] px-6 pb-8 pt-[72px]">
        <div className="flex flex-wrap justify-between gap-x-14 gap-y-12">
          {/* Brand column */}
          <div className="max-w-[300px]">
            <Wordmark variant="cream" />
            <p className="mt-4 text-[14.5px] leading-relaxed text-[rgba(243,235,222,0.72)]">
              Impeccably convenient payments for the next generation of business owners. Fair pricing,
              fast payouts, and a real team behind you.
            </p>
            <p className="mt-4 text-[13.5px] leading-relaxed text-[rgba(243,235,222,0.55)]">
              1606 Headway Circle Ste. 9317
              <br />
              Austin, TX 78754
            </p>
            <Link
              href="/chamber"
              className="group mt-5 inline-flex items-center gap-2.5 rounded-pill border border-white/10 py-2 pl-2.5 pr-3.5 transition-colors hover:bg-[rgba(243,235,222,0.14)]"
              style={{ background: "rgba(243,235,222,0.06)" }}
            >
              <span
                className="h-[22px] w-[22px] shrink-0 rounded-round"
                style={{
                  background:
                    "conic-gradient(#E4572E, #E0A04D, #E8C34A, #5E9E6E, #4A79B8, #7E5AA2, #E4572E)",
                }}
                aria-hidden
              />
              <span className="text-[12px] leading-tight text-[rgba(243,235,222,0.72)]">
                Proud member of the
                <br />
                <strong className="font-semibold text-[#F3EBDE]">Austin LGBT Chamber of Commerce</strong>
              </span>
              <ArrowRight
                size={15}
                strokeWidth={2}
                aria-hidden
                className="shrink-0 text-[rgba(243,235,222,0.55)] transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <div className="mt-5 flex gap-2.5">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-round transition-colors"
                  style={{ background: "rgba(243,235,222,0.08)" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-[#F3EBDE]">
                    {s.path}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="flex flex-wrap gap-x-14 gap-y-10">
            <FooterColumn
              title="Products"
              links={footerProductKeys.map((k) => ({ label: PRODUCTS[k].nav, href: `/products/${k}` }))}
            />
            <FooterColumn
              title="Industries"
              links={footerSolutionKeys.map((k) => ({ label: SOLUTIONS[k].nav, href: `/industries/${k}` }))}
            />
            <FooterColumn
              title="Company"
              links={[
                { label: "About", href: "/about" },
                { label: "Partnerships", href: "/partnerships" },
                { label: "Pricing", href: "/pricing" },
                { label: "Get a Quote", href: "/contact" },
                { label: "Contact", href: "/contact" },
              ]}
            />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 border-t border-white/[0.12] pt-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[13px] text-[rgba(243,235,222,0.6)]">
              © 2026 Impeccabyte, LLC. Impeccabyte is a registered agent of Maverick Payments.
            </p>
            <div className="flex gap-5">
              <Link href="#" className="text-[13px] text-[rgba(243,235,222,0.6)] hover:text-[#F3EBDE]">
                Privacy
              </Link>
              <Link href="#" className="text-[13px] text-[rgba(243,235,222,0.6)] hover:text-[#F3EBDE]">
                Terms
              </Link>
            </div>
          </div>
          <p className="mt-5 max-w-[1000px] text-[11.5px] leading-relaxed text-[rgba(243,235,222,0.4)]">
            Maverick™ is a division and registered trademark of Maverick BankCard, Inc. Maverick is a
            registered ISO/MSP of Avidia Bank, Hudson, MA; North American Banking Company, Roseville, MN;
            Axiom Bank, N.A., Maitland, FL; FFB Bank, Fresno, CA; Westamerica Bank, Santa Rosa, CA. American
            Express may require separate approval.
          </p>
        </div>
      </div>
    </footer>
  );
}
