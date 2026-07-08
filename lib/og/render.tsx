import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { OgCopy } from "./copy";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const INK = "#2A211A";
const CLAY = "#C0623E";
const AMBER = "#E0A04D";

let fontCache: { name: string; data: Buffer; weight: 400 | 600 | 700; style: "normal" | "italic" }[] | null = null;

async function loadFonts() {
  if (fontCache) return fontCache;
  const dir = join(process.cwd(), "lib/og/fonts");
  const read = (f: string) => readFile(join(dir, f));
  const [nr4, nr6, nr6i, hk6, hk7] = await Promise.all([
    read("newsreader-400.woff"),
    read("newsreader-600.woff"),
    read("newsreader-600-italic.woff"),
    read("hanken-600.woff"),
    read("hanken-700.woff"),
  ]);
  fontCache = [
    { name: "Newsreader", data: nr4, weight: 400, style: "normal" },
    { name: "Newsreader", data: nr6, weight: 600, style: "normal" },
    { name: "Newsreader", data: nr6i, weight: 600, style: "italic" },
    { name: "Hanken", data: hk6, weight: 600, style: "normal" },
    { name: "Hanken", data: hk7, weight: 700, style: "normal" },
  ];
  return fontCache;
}

/** The Impeccabyte emblem, drawn with div primitives (satori-safe). */
function Emblem() {
  const square = (left: number, top: number) => ({
    position: "absolute" as const,
    left,
    top,
    width: 8,
    height: 8,
    borderRadius: 2.5,
    backgroundImage: `linear-gradient(45deg, ${CLAY}, ${AMBER})`,
    display: "flex",
  });
  return (
    <div style={{ position: "relative", width: 46, height: 46, display: "flex" }}>
      <div style={{ position: "absolute", left: 0, top: 26, width: 46, height: 20, borderRadius: 5, background: CLAY, display: "flex" }} />
      <div style={square(8, 16)} />
      <div style={square(18, 8)} />
      <div style={square(28, 0)} />
    </div>
  );
}

function Template({ copy }: { copy: OgCopy }) {
  const words: { w: string; em: boolean }[] = [
    ...copy.titleA.split(" ").map((w) => ({ w, em: false })),
    ...copy.titleEm.split(" ").map((w) => ({ w, em: true })),
    ...(copy.titleZ ? copy.titleZ.split(" ").map((w) => ({ w, em: false })) : []),
  ];

  const decoSquare = (right: number, top: number, size: number, radius: number, alpha: number) => ({
    position: "absolute" as const,
    right,
    top,
    width: size,
    height: size,
    borderRadius: radius,
    background: `rgba(192, 98, 62, ${alpha})`,
    display: "flex",
  });

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        padding: "70px 80px",
        backgroundImage: "linear-gradient(120deg, #FAF6EF 42%, #F4E7D2 100%)",
        fontFamily: "Newsreader",
      }}
    >
      {/* Top gradient rule */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 8, backgroundImage: `linear-gradient(90deg, ${CLAY}, ${AMBER})`, display: "flex" }} />

      {/* Decorative panel + bytes on the right */}
      <div style={{ position: "absolute", right: -70, bottom: -70, width: 470, height: 300, borderRadius: 64, background: "rgba(206, 138, 53, 0.09)", display: "flex" }} />
      <div style={decoSquare(96, 250, 96, 26, 0.08)} />
      <div style={decoSquare(196, 366, 80, 22, 0.07)} />
      <div style={decoSquare(66, 440, 72, 18, 0.06)} />

      {/* Header — logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
        <Emblem />
        <div style={{ fontFamily: "Newsreader", fontWeight: 600, fontSize: 31, color: INK, display: "flex" }}>
          Impeccabyte
        </div>
      </div>

      {/* Content */}
      <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, justifyContent: "center", maxWidth: 1000 }}>
        {/* Eyebrow pill */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, alignSelf: "flex-start", background: "#FFFFFF", border: "1px solid #E0D6C6", borderRadius: 999, padding: "9px 18px" }}>
          <div style={{ width: 8, height: 8, borderRadius: 999, background: CLAY, display: "flex" }} />
          <div style={{ fontFamily: "Hanken", fontWeight: 700, fontSize: 15, letterSpacing: 1.8, color: "#4D4239", display: "flex" }}>
            {copy.eyebrow.toUpperCase()}
          </div>
        </div>

        {/* Headline — word-split so it wraps and the emphasis stays clay */}
        <div style={{ display: "flex", flexWrap: "wrap", width: "100%", marginTop: 28, columnGap: 20, rowGap: 6, fontFamily: "Newsreader", fontWeight: 600, fontSize: 70, lineHeight: 1.02, color: INK }}>
          {words.map((seg, i) => (
            <div key={i} style={{ display: "flex", fontStyle: seg.em ? "italic" : "normal", color: seg.em ? CLAY : INK }}>
              {seg.w}
            </div>
          ))}
        </div>

        {/* Subtitle */}
        <div style={{ marginTop: 24, maxWidth: 860, fontFamily: "Newsreader", fontWeight: 400, fontSize: 28, lineHeight: 1.4, color: "#635648", display: "flex" }}>
          {copy.subtitle}
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ height: 1, background: "#E4DAC9", display: "flex" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontFamily: "Hanken", fontWeight: 700, fontSize: 18, color: INK, display: "flex" }}>impeccabyte.com</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 7, height: 7, borderRadius: 999, background: AMBER, display: "flex" }} />
            <div style={{ fontFamily: "Hanken", fontWeight: 600, fontSize: 16, color: "#786B5D", display: "flex" }}>
              Powered by Maverick Payments
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function renderOg(copy: OgCopy) {
  const fonts = await loadFonts();
  return new ImageResponse(<Template copy={copy} />, {
    ...OG_SIZE,
    fonts: fonts.map((f) => ({ name: f.name, data: f.data, weight: f.weight, style: f.style })),
  });
}
