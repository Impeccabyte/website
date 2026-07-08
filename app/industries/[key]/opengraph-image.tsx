import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og/render";
import { OG_SOLUTIONS, OG_PAGES } from "@/lib/og/copy";
import { SOLUTIONS, type SolutionKey } from "@/lib/data";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Impeccabyte industry";

export function generateStaticParams() {
  return (Object.keys(SOLUTIONS) as SolutionKey[]).map((key) => ({ key }));
}

export default async function Image({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  return renderOg(OG_SOLUTIONS[key as SolutionKey] ?? OG_PAGES.home);
}
