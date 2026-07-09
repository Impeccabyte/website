import { LegalPage, legalMetadata } from "@/components/site/legal-page";

export const metadata = legalMetadata("cookies");

export default function CookiesPage() {
  return <LegalPage active="cookies" />;
}
