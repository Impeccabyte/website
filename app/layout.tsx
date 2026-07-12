import type { Metadata, Viewport } from "next";
import { Newsreader, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { JsonLd } from "@/components/seo/json-ld";
import { orgSchema } from "@/lib/seo/org";

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-newsreader",
  display: "swap",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-hanken",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#FAF6EF",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://impeccabyte.com"),
  title: {
    default: "Impeccabyte — Impeccably convenient merchant services",
    template: "%s · Impeccabyte",
  },
  description:
    "Merchant services & payment processing for the next generation of business owners. Transparent interchange-plus pricing, fast payouts, and a real team behind you.",
  openGraph: {
    title: "Impeccabyte — Impeccably convenient merchant services",
    description: "Transparent interchange-plus pricing, fast payouts, and a real team behind you.",
    type: "website",
    siteName: "Impeccabyte",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "Impeccabyte — payments that just work" }],
  },
  twitter: {
    card: "summary_large_image",
    images: [{ url: "/og/home.png", alt: "Impeccabyte — payments that just work" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${newsreader.variable} ${hanken.variable} ${jetbrains.variable}`}>
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <JsonLd data={orgSchema()} />

        {/*
          GetTerms CMP — consent gate. The blocker is a YETT-based script that
          patches document.createElement + a MutationObserver to hold trackers
          until consent; it MUST run before any tracker, so it loads
          `beforeInteractive` (Next injects it into <head> ahead of hydration).
          The widget renders the banner UI and can load after interactive.
        */}
        <Script
          id="getterms-blocker"
          src="https://gettermscmp.com/cookie-consent/blocker/2cad461f-5d39-4d4c-8692-e80ee8e0e657/en-us?auto=true"
          strategy="beforeInteractive"
        />
        <Script
          id="getterms-widget"
          src="https://gettermscmp.com/cookie-consent/widget/2cad461f-5d39-4d4c-8692-e80ee8e0e657/en-us?auto=true"
          strategy="afterInteractive"
        />

        {/*
          HubSpot tracking + live chat (portal 246692701). Rendered PRE-BLOCKED:
          `type="text/plain"` keeps the browser from executing/fetching it, and
          `data-getterms-statistics` categorizes it as analytics — the GetTerms
          blocker restores it (via __GT_UNBLOCK) only once the visitor grants
          statistics/analytics consent. Do NOT switch this to next/script: it must
          stay an inert text/plain tag so consent, not Next's loader, gates it.
        */}
        <script
          id="hs-script-loader"
          type="text/plain"
          data-getterms-statistics=""
          src="https://js-na2.hs-scripts.com/246692701.js"
        />
      </body>
    </html>
  );
}
