import type { Metadata } from "next";
import StatementGate from "@/components/tools/statement-gate";

// Private internal tool — keep it out of every search index.
export const metadata: Metadata = {
  title: "Statement analysis",
  robots: { index: false, follow: false },
};

export default function AnalyzePage() {
  return <StatementGate />;
}
