import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og/render";
import { OG_PAGES } from "@/lib/og/copy";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Impeccabyte — payments, done right";

export default function Image() {
  return renderOg(OG_PAGES.about);
}
