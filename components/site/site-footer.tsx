import Link from "next/link";
import { ArrowRight, Phone, Mail } from "lucide-react";
import { Wordmark } from "./wordmark";
import { PRODUCTS, SOLUTIONS, footerProductKeys, footerSolutionKeys, benefitsNav } from "@/lib/data";

// Brand glyphs use canonical single-path marks (Simple Icons, 24×24 viewBox) so
// each logo is accurate and consistent. lucide-react ships no brand icons, hence
// the inline path data rather than an icon-component import.
const SOCIALS: { label: string; href: string; path: React.ReactNode }[] = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/impeccabyte/",
    path: <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/impeccabyte",
    path: <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0Zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.897 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.897-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03Zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162ZM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4Zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439Z" />,
  },
  {
    label: "Threads",
    href: "https://www.threads.com/@impeccabyte",
    path: <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.056 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.36-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.85 13.85 0 0 1 3.02.142c-.126-.742-.375-1.332-.742-1.757-.503-.582-1.279-.878-2.31-.885h-.024c-.826 0-1.951.223-2.667 1.288l-1.674-1.147c.958-1.404 2.512-2.178 4.363-2.178h.058c3.086.02 4.929 1.938 5.115 5.279.106.045.211.094.316.145 1.4.66 2.426 1.652 2.973 2.87.76 1.7.831 4.472-1.428 6.732-1.726 1.723-3.828 2.499-6.809 2.52Zm1.043-11.826c-.313 0-.632.01-.955.032-1.648.093-2.928.618-2.928 1.797 0 .688.516 1.407 1.65 1.407.049 0 .097-.001.146-.004 1.354-.075 2.229-.612 2.539-1.557.079-.239.153-.505.222-.798a8.088 8.088 0 0 0-.674-.076Z" />,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@impeccabyte",
    path: <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />,
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
            <a
              href="tel:+15129806236"
              className="mt-3 flex w-fit items-center gap-2 text-[14px] text-[rgba(243,235,222,0.72)] transition-colors hover:text-[#F3EBDE]"
            >
              <Phone size={15} strokeWidth={2} aria-hidden className="text-amber-300" />
              +1 (512) 980-6236
            </a>
            <a
              href="mailto:howdy@impeccabyte.com"
              className="mt-2.5 flex w-fit items-center gap-2 text-[14px] text-[rgba(243,235,222,0.72)] transition-colors hover:text-[#F3EBDE]"
            >
              <Mail size={15} strokeWidth={2} aria-hidden className="text-amber-300" />
              howdy@impeccabyte.com
            </a>
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
            <div className="flex flex-col gap-10">
              <FooterColumn
                title="Products"
                links={footerProductKeys.map((k) => ({ label: PRODUCTS[k].nav, href: `/products/${k}` }))}
              />
              <FooterColumn
                title="Pricing Programs"
                links={[
                  { label: "Interchange+", href: "/pricing" },
                  { label: "Cash Discount", href: "/cash-discount" },
                  { label: "Surcharge", href: "/surcharge" },
                ]}
              />
            </div>
            <div className="flex flex-col gap-10">
              <FooterColumn
                title="Industries"
                links={footerSolutionKeys.map((k) => ({ label: SOLUTIONS[k].nav, href: `/industries/${k}` }))}
              />
              <FooterColumn
                title="Benefits"
                links={benefitsNav.map((b) => ({ label: b.nav, href: b.href }))}
              />
            </div>
            <FooterColumn
              title="Company"
              links={[
                { label: "About", href: "/about" },
                { label: "Partnerships", href: "/partnerships" },
                { label: "Locations", href: "/locations" },
                { label: "Get a Quote", href: "/contact" },
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
