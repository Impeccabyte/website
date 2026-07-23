import Link from "next/link";
import { ArrowRight, Phone, Mail } from "lucide-react";
import { Wordmark } from "./wordmark";
import { PRODUCTS, SOLUTIONS, footerProductKeys, footerSolutionKeys, benefitsNav } from "@/lib/data";

// Brand glyphs are Font Awesome Free 6.x "brands" marks (CC BY 4.0, Fonticons Inc.),
// inlined as single paths rather than pulling in the @fortawesome packages for four
// icons. lucide-react ships no brand icons at all, hence not using it here.
// Each mark carries its own viewBox — FA's brand grid is 512 tall but varies in
// width, so they are not interchangeable with Simple Icons' uniform 24×24.
const SOCIALS: { label: string; href: string; viewBox: string; path: React.ReactNode }[] = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/impeccabyte/",
    viewBox: "0 0 512 512",
    path: <path d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5V334.2H141.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H287V510.1C413.8 494.8 512 386.9 512 256h0z" />,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/impeccabyte",
    viewBox: "0 0 448 512",
    path: <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />,
  },
  {
    label: "Threads",
    href: "https://www.threads.com/@impeccabyte",
    viewBox: "0 0 448 512",
    path: <path d="M331.5 235.7c2.2 .9 4.2 1.9 6.3 2.8c29.2 14.1 50.6 35.2 61.8 61.4c15.7 36.5 17.2 95.8-30.3 143.2c-36.2 36.2-80.3 52.5-142.6 53h-.3c-70.2-.5-124.1-24.1-160.4-70.2c-32.3-41-48.9-98.1-49.5-169.6V256v-.2C17 184.3 33.6 127.2 65.9 86.2C102.2 40.1 156.2 16.5 226.4 16h.3c70.3 .5 124.9 24 162.3 69.9c18.4 22.7 32 50 40.6 81.7l-40.4 10.8c-7.1-25.8-17.8-47.8-32.2-65.4c-29.2-35.8-73-54.2-130.5-54.6c-57 .5-100.1 18.8-128.2 54.4C72.1 146.1 58.5 194.3 58 256c.5 61.7 14.1 109.9 40.3 143.3c28 35.6 71.2 53.9 128.2 54.4c51.4-.4 85.4-12.6 113.7-40.9c32.3-32.2 31.7-71.8 21.4-95.9c-6.1-14.2-17.1-26-31.9-34.9c-3.7 26.9-11.8 48.3-24.7 64.8c-17.1 21.8-41.4 33.6-72.7 35.3c-23.6 1.3-46.3-4.4-63.9-16c-20.8-13.8-33-34.8-34.3-59.3c-2.5-48.3 35.7-83 95.2-86.4c21.1-1.2 40.9-.3 59.2 2.8c-2.4-14.8-7.3-26.6-14.6-35.2c-10-11.7-25.6-17.7-46.2-17.8H227c-16.6 0-39 4.6-53.3 26.3l-34.4-23.6c19.2-29.1 50.3-45.1 87.8-45.1h.8c62.6 .4 99.9 39.5 103.7 107.7l-.2 .2zm-156 68.8c1.3 25.1 28.4 36.8 54.6 35.3c25.6-1.4 54.6-11.4 59.5-73.2c-13.2-2.9-27.8-4.4-43.4-4.4c-4.8 0-9.6 .1-14.4 .4c-42.9 2.4-57.2 23.2-56.2 41.8l-.1 .1z" />,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@impeccabyte",
    viewBox: "0 0 448 512",
    path: <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z" />,
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
              17350 State Hwy 249, Ste 220 #37005
              <br />
              Houston, Texas 77064 US
            </p>
            <a
              href="tel:+18775842758"
              className="mt-3 flex w-fit items-center gap-2 text-[14px] text-[rgba(243,235,222,0.72)] transition-colors hover:text-[#F3EBDE]"
            >
              <Phone size={15} strokeWidth={2} aria-hidden className="text-amber-300" />
              +1 (877) 584-2758
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
                  <svg width="18" height="18" viewBox={s.viewBox} fill="currentColor" className="text-[#F3EBDE]">
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
