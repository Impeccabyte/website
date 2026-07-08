import type { Metadata, Viewport } from "next";
import { Newsreader, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

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
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${newsreader.variable} ${hanken.variable} ${jetbrains.variable}`}>
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
