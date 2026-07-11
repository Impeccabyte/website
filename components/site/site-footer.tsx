import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Wordmark } from "./wordmark";
import { PRODUCTS, SOLUTIONS, footerProductKeys, footerSolutionKeys } from "@/lib/data";

const SOCIALS: { label: string; href: string; path: React.ReactNode }[] = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/impeccabyte/",
    path: <path d="M14 8.5h1.8V5.6C15.5 5.5 14.4 5.4 13.4 5.4c-2.2 0-3.6 1.3-3.6 3.7v2H7v3h2.8V22h3.4v-7.9h2.7l.4-3h-3.1V9.4c0-.6.2-.9 1.4-.9z" />,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/impeccabyte",
    path: (
      <>
        <rect x="4.5" y="4.5" width="15" height="15" rx="4.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="12" cy="12" r="3.6" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="16.4" cy="7.6" r="1.05" />
      </>
    ),
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@impeccabyte",
    path: <path d="M13.8 3.5c.3 1.9 1.4 3.4 3.7 3.6v2.4c-1.2.1-2.4-.3-3.6-1v5.5c0 3-2.1 4.9-4.7 4.9-2.5 0-4.4-1.9-4.4-4.3 0-2.6 2.2-4.6 5.1-4.1v2.5c-.4-.1-.8-.2-1.2-.1-1 .1-1.6.8-1.5 1.9.1 1 .9 1.6 1.9 1.5 1-.1 1.6-.9 1.6-2V3.5z" />,
  },
  {
    label: "Threads",
    href: "https://www.threads.com/@impeccabyte",
    path: <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.056 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.36-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.85 13.85 0 0 1 3.02.142c-.126-.742-.375-1.332-.742-1.757-.503-.582-1.279-.878-2.31-.885h-.024c-.826 0-1.951.223-2.667 1.288l-1.674-1.147c.958-1.404 2.512-2.178 4.363-2.178h.058c3.086.02 4.929 1.938 5.115 5.279.106.045.211.094.316.145 1.4.66 2.426 1.652 2.973 2.87.76 1.7.831 4.472-1.428 6.732-1.726 1.723-3.828 2.499-6.809 2.52Zm1.043-11.826c-.313 0-.632.01-.955.032-1.648.093-2.928.618-2.928 1.797 0 .688.516 1.407 1.65 1.407.049 0 .097-.001.146-.004 1.354-.075 2.229-.612 2.539-1.557.079-.239.153-.505.222-.798a8.088 8.088 0 0 0-.674-.076Z" />,
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
                  target="_blank"
                  rel="noopener noreferrer"
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
                { label: "Locations", href: "/locations" },
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
              <Link href="/privacy" className="text-[13px] text-[rgba(243,235,222,0.6)] hover:text-[#F3EBDE]">
                Privacy
              </Link>
              <Link href="/terms" className="text-[13px] text-[rgba(243,235,222,0.6)] hover:text-[#F3EBDE]">
                Terms
              </Link>
              <Link href="/cookies" className="text-[13px] text-[rgba(243,235,222,0.6)] hover:text-[#F3EBDE]">
                Cookies
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
