import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og/render";
import { OG_PRODUCTS } from "@/lib/og/copy";
import { OG_PAGES } from "@/lib/og/copy";
import { productOrder, type ProductKey } from "@/lib/data";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Impeccabyte product";

export function generateStaticParams() {
  return productOrder.map((key) => ({ key }));
}

export default async function Image({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  return renderOg(OG_PRODUCTS[key as ProductKey] ?? OG_PAGES.home);
}
