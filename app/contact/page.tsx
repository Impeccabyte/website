import type { Metadata } from "next";
import { QuoteExperience } from "@/components/contact/quote-experience";

export const metadata: Metadata = {
  title: "Get a quote — see your rate in one business day",
  description:
    "Tell us a little about your business and we'll build a custom interchange-plus quote — no obligation, no pressure.",
};

export default function ContactPage() {
  return <QuoteExperience />;
}
