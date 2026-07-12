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
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5DNCR8N2"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <JsonLd data={orgSchema()} />

        {/* Google Tag Manager — loads the container on every route. HubSpot,
            consent, and any other tags are managed inside GTM (container
            GTM-5DNCR8N2), not in this codebase. */}
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5DNCR8N2');`}
        </Script>
      </body>
    </html>
  );
}
