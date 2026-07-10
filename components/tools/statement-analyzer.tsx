"use client";

import { useState, useMemo, useRef, useId, type CSSProperties } from "react";
import { extractStatement } from "@/app/tools/analyze/actions";

// ── Impeccabyte Statement Analyzer ──────────────────────────────────────────
// Universal merchant-statement diagnostic, styled to the Impeccabyte Design System.
//  • Upload a statement (PDF/image) → AI-assisted extraction → you verify.
//  • Effective rate = total cost ÷ volume. Cost splits into unavoidable wholesale
//    (interchange + assessments) vs. addressable markup. Deterministic math.
//  • Proposal presets from impeccabyte.com/pricing (no monthly fee, $100 minimum).
//  • BIN handled as absorb (your cost) or pass-through, on total volume per Maverick.
//  • Reset clears everything; Export produces a branded, MERCHANT-FACING PDF
//    (no internal economics — no residual, buy-rate, or BIN shown).

type CatKey = "interchange" | "assessments" | "discount" | "perTxn" | "monthly" | "junk";
type Category = { label: string; floor: boolean; tint: string; flag?: boolean };
type Item = { id: number; desc: string; amt: number | string; cat: CatKey };
// Fields fed by <input type="number"> hold strings between edits; math coerces with Number().
type NumIn = number | string;
type LoadState = { merchant: string; month: string; volume: NumIn; txns: NumIn; items: Item[] };
type Status = { state: "idle" | "loading" | "ok" | "error"; msg: string };
type InputMode = "statement" | "payfac";
type BinMode = "absorb" | "passthrough";
type View = "tool" | "report";

type Variant = { key: string; label: string; pct: number; perTxn: number };
type Facilitator = { label: string; variants: Variant[]; lockIn?: boolean };
type Tier = { key: string; label: string; range: string; bps: number; perTxn: number; max: number; popular?: boolean };
type RiskKey = "low" | "moderate" | "high";
type RiskPreset = { fixed: number; perTxn: number; binBps: number; residual: number; label: string };

const CATEGORIES: Record<CatKey, Category> = {
  interchange: { label: "Interchange", floor: true, tint: "var(--ink-500)" },
  assessments: { label: "Assessments / card-brand", floor: true, tint: "var(--ink-500)" },
  discount:    { label: "Discount (% markup)", floor: false, tint: "var(--clay-600)" },
  perTxn:      { label: "Per-transaction markup", floor: false, tint: "var(--clay-600)" },
  monthly:     { label: "Fixed monthly fee", floor: false, tint: "var(--brick-600)" },
  junk:        { label: "Junk / padding", floor: false, tint: "var(--brick-600)", flag: true },
};

const PRICING_TIERS: Tier[] = [
  { key: "starter",    label: "Starter",    range: "≤ $25K / mo",      bps: 45, perTxn: 0.12, max: 25000 },
  { key: "growth",     label: "Growth",     range: "$25K–$100K / mo",  bps: 32, perTxn: 0.10, max: 100000, popular: true },
  { key: "scale",      label: "Scale",      range: "$100K–$500K / mo", bps: 24, perTxn: 0.08, max: 500000 },
  { key: "enterprise", label: "Enterprise", range: "$500K+ / mo",      bps: 16, perTxn: 0.07, max: Infinity },
];

const RISK_PRESETS: Record<RiskKey, RiskPreset> = {
  low:      { fixed: 15.0, perTxn: 0.0275, binBps: 2,  residual: 0.90, label: "Low-risk (90% residual)" },
  moderate: { fixed: 17.5, perTxn: 0.04,   binBps: 10, residual: 0.80, label: "Moderate-risk (80% residual)" },
  high:     { fixed: 25.0, perTxn: 0.06,   binBps: 35, residual: 0.50, label: "High-risk (50% residual)" },
};

// Public flat-rate pricing (US, verified 2026). Flat-rate providers bundle
// interchange + assessments + markup into one rate and issue no itemized statement,
// so we take volume + txns and compute the exact cost; wholesale is estimated.
const FACILITATORS: Record<string, Facilitator> = {
  stripe: { label: "Stripe", variants: [
    { key: "online",    label: "Online (standard)",       pct: 2.9, perTxn: 0.30 },
    { key: "inperson",  label: "In-person (Terminal)",    pct: 2.7, perTxn: 0.05 },
  ] },
  square: { label: "Square (Block)", variants: [
    { key: "inperson",  label: "In-person (tap/dip/swipe)", pct: 2.6, perTxn: 0.15 },
    { key: "online",    label: "Online / invoice",         pct: 3.3, perTxn: 0.30 },
    { key: "keyed",     label: "Keyed / card-on-file",     pct: 3.5, perTxn: 0.15 },
  ] },
  paypal: { label: "PayPal", variants: [
    { key: "checkout",  label: "PayPal Checkout (wallet)", pct: 3.49, perTxn: 0.49 },
    { key: "card",      label: "Standard card",           pct: 2.99, perTxn: 0.49 },
    { key: "inperson",  label: "In-person (POS / QR)",    pct: 2.29, perTxn: 0.09 },
  ] },
  shopify: { label: "Shopify Payments", lockIn: true, variants: [
    { key: "basic_online", label: "Basic — online",          pct: 2.9,  perTxn: 0.30 },
    { key: "basic_pos",    label: "Basic — in-person",       pct: 2.6,  perTxn: 0.10 },
    { key: "grow_online",  label: "Grow — online",           pct: 2.7,  perTxn: 0.30 },
    { key: "grow_pos",     label: "Grow — in-person",        pct: 2.5,  perTxn: 0.10 },
    { key: "adv_online",   label: "Advanced — online",       pct: 2.5,  perTxn: 0.30 },
    { key: "adv_pos",      label: "Advanced — in-person",    pct: 2.4,  perTxn: 0.10 },
    { key: "plus_online",  label: "Plus — online",           pct: 2.15, perTxn: 0.30 },
  ] },
};

const SAMPLE: LoadState = {
  merchant: "RIZZ ENTERPRISES, LLC", month: "June 2026", volume: 51.35, txns: 5,
  items: [
    { id: 1,  desc: "Interchange (VS/MC pass-through)",       amt: 1.58, cat: "interchange" },
    { id: 2,  desc: "Card brand fees (NABU/NAPF/FANF etc.)",  amt: 1.46, cat: "assessments" },
    { id: 3,  desc: "Discount (0.90%–1.95% + $0.20/item)",    amt: 1.52, cat: "discount" },
    { id: 4,  desc: "Authorization Fee (11 × $0.20)",         amt: 2.20, cat: "perTxn" },
    { id: 5,  desc: "AVS Transaction Fee (11 × $0.15)",       amt: 1.65, cat: "perTxn" },
    { id: 6,  desc: "Batch Fee (4 × $0.10)",                  amt: 0.40, cat: "perTxn" },
    { id: 7,  desc: "Monthly Fee",                            amt: 10.00, cat: "monthly" },
    { id: 8,  desc: "Monthly Online Access Fee",              amt: 10.00, cat: "monthly" },
    { id: 9,  desc: "PCI Program",                            amt: 5.00, cat: "junk" },
    { id: 10, desc: "Website Monitoring Fee",                 amt: 15.00, cat: "junk" },
  ],
};

const EMPTY: LoadState = { merchant: "", month: "", volume: "", txns: "", items: [] };

const usd = (n: number) => (n < 0 ? "-$" : "$") + Math.abs(Number(n) || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const pct = (n: number) => (n * 100).toFixed(2) + "%";

const DS_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,500;1,6..72,600&family=Hanken+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
.ib-root{
  --clay-50:#FBF1EC;--clay-100:#F5DDD0;--clay-200:#EBBBA1;--clay-500:#C0623E;--clay-600:#A44E2F;--clay-700:#833D26;
  --amber-50:#FCF4E6;--amber-100:#F8E4C0;--amber-400:#E0A04D;--amber-500:#CE8A35;
  --clove-800:#302419;--clove-900:#1F1710;
  --ink-900:#2A211A;--ink-800:#3B3128;--ink-700:#4D4239;--ink-600:#635648;--ink-500:#786B5D;--ink-400:#9B8E7E;--ink-300:#C3B7A6;--ink-200:#E0D6C6;--ink-100:#EFE8DC;--ink-50:#F7F2E9;
  --paper:#FAF6EF;--white:#FFFFFF;
  --sage-50:#EFF3EA;--sage-100:#DCE6D0;--sage-500:#5E7A4F;--sage-600:#4A6440;--sage-700:#38492F;
  --brick-50:#FBEDEA;--brick-100:#F4D2CC;--brick-500:#B23A2E;--brick-600:#8F2E24;
  --slate-50:#EDF1F3;--slate-100:#DCE6EB;--slate-500:#4A6A7A;--slate-700:#2F4753;
  --font-display:'Newsreader',Georgia,serif;--font-sans:'Hanken Grotesk',-apple-system,sans-serif;--font-mono:'JetBrains Mono',ui-monospace,monospace;
  --radius-sm:10px;--radius-md:14px;--radius-lg:20px;--radius-pill:999px;
  --shadow-sm:0 1px 2px rgba(58,42,28,.06),0 2px 6px rgba(58,42,28,.05);
  --shadow-md:0 2px 4px rgba(58,42,28,.05),0 6px 16px rgba(58,42,28,.08);
  --shadow-brand:0 4px 14px rgba(192,98,62,.28);
}
.ib-in{ width:100%; box-sizing:border-box; font-family:var(--font-sans); font-size:14px; color:var(--ink-900);
  background:var(--white); border:1.5px solid var(--ink-200); border-radius:var(--radius-sm); padding:8px 11px; outline:none;
  transition:border-color .14s, box-shadow .14s; }
.ib-in:hover{ border-color:var(--ink-300); }
.ib-in:focus{ border-color:var(--clay-500); box-shadow:0 0 0 3px rgba(192,98,62,.15); }
.ib-btn{ font-family:var(--font-sans); font-weight:600; font-size:14px; border-radius:var(--radius-pill); cursor:pointer;
  border:1.5px solid transparent; padding:9px 18px; transition:background-color .14s,border-color .14s,transform .14s,box-shadow .22s; }
.ib-btn:active{ transform:translateY(.5px) scale(.985); }
.ib-btn-primary{ background:var(--clay-500); color:var(--white); box-shadow:var(--shadow-brand); }
.ib-btn-primary:hover{ background:var(--clay-600); transform:translateY(-1px); box-shadow:0 6px 20px rgba(192,98,62,.34); }
.ib-btn-secondary{ background:var(--white); color:var(--ink-800); border-color:var(--ink-200); }
.ib-btn-secondary:hover{ border-color:var(--ink-300); background:var(--ink-50); }
.ib-btn-ghost{ background:transparent; color:var(--ink-700); }
.ib-btn-ghost:hover{ background:var(--ink-100); }
.ib-tier{ flex:1; min-width:148px; text-align:left; cursor:pointer; border-radius:var(--radius-md); padding:11px 13px;
  font-family:var(--font-sans); background:var(--white); border:1.5px solid var(--ink-200); transition:border-color .14s,box-shadow .14s,transform .14s; }
.ib-tier:hover{ border-color:var(--clay-200); transform:translateY(-1px); box-shadow:var(--shadow-sm); }
.ib-tier-on{ border-color:var(--clay-500); box-shadow:0 0 0 3px rgba(192,98,62,.12); }
.print-report{ display:none; }
@media print{
  .tool-ui{ display:none !important; }
  .print-report{ display:block !important; }
  @page{ size:letter; margin:14mm; }
  body{ background:#fff; }
  *{ -webkit-print-color-adjust:exact !important; print-color-adjust:exact !important; }
}
`;

function Emblem({ size = 34 }: { size?: number }) {
  const gid = "ibRise" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <svg viewBox="16 22 68 68" width={size} height={size} xmlns="http://www.w3.org/2000/svg" aria-label="Impeccabyte">
      <defs><linearGradient id={gid} x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#C0623E" /><stop offset="0.55" stopColor="#D27C46" /><stop offset="1" stopColor="#E0A04D" /></linearGradient></defs>
      <rect x="16" y="60" width="68" height="30" rx="7" fill="#C0623E" />
      <rect x="25" y="68" width="13" height="9" rx="2.5" fill="#2A211A" opacity="0.2" />
      <g fill={"url(#" + gid + ")"}><rect x="28" y="46" width="11" height="11" rx="3.4" /><rect x="43" y="34" width="11" height="11" rx="3.4" /><rect x="58" y="22" width="11" height="11" rx="3.4" /></g>
    </svg>
  );
}
const Wordmark = ({ s = 20 }: { s?: number }) => (
  <span style={{ fontFamily: "var(--font-display)", fontSize: s, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--ink-900)" }}>Impecca<span style={{ color: "var(--clay-500)" }}>byte</span></span>
);

export default function StatementAnalyzer() {
  const [merchant, setMerchant] = useState<string>(SAMPLE.merchant);
  const [month, setMonth] = useState<string>(SAMPLE.month);
  const [volume, setVolume] = useState<NumIn>(SAMPLE.volume);
  const [txns, setTxns] = useState<NumIn>(SAMPLE.txns);
  const [items, setItems] = useState<Item[]>(SAMPLE.items);
  const [nextId, setNextId] = useState<number>(11);
  const [status, setStatus] = useState<Status>({ state: "idle", msg: "" });
  const [view, setView] = useState<View>("tool");
  const fileRef = useRef<HTMLInputElement | null>(null);
  const reportRef = useRef<HTMLDivElement | null>(null);

  function exportPDF() {
    const node = reportRef.current;
    if (!node) { try { window.print(); } catch (e) {} return; }
    const html = '<!doctype html><html><head><meta charset="utf-8"><title>'
      + (merchant || "Impeccabyte") + ' — statement analysis</title><style>' + DS_CSS
      + '@page{size:letter;margin:12mm;} html,body{background:#fff;margin:0;padding:16px;}'
      + '*{-webkit-print-color-adjust:exact !important;print-color-adjust:exact !important;}'
      + '</style></head><body class="ib-root">' + node.outerHTML + '</body></html>';
    let w: Window | null = null;
    try { w = window.open("", "_blank"); } catch (e) { w = null; }
    if (w && w.document) {
      w.document.open(); w.document.write(html); w.document.close(); w.focus();
      setTimeout(() => { try { w?.print(); } catch (e) {} }, 700);   // let fonts settle
    } else {
      // Popups blocked — hand back a self-contained HTML file to open & print/save as PDF
      try {
        const blob = new Blob([html], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = (merchant || "impeccabyte").replace(/[^a-z0-9]+/gi, "-").toLowerCase() + "-analysis.html";
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 4000);
      } catch (e) { try { window.print(); } catch (e2) {} }
    }
  }

  const [tier, setTier] = useState<string>("starter");
  const [markupBps, setMarkupBps] = useState<NumIn>(45);
  const [propPerTxn, setPropPerTxn] = useState<NumIn>(0.12);
  const [minimum, setMinimum] = useState<NumIn>(100);
  const [risk, setRisk] = useState<RiskKey>("low");
  const [binBps, setBinBps] = useState<NumIn>(2);
  const [binMode, setBinMode] = useState<BinMode>("absorb");

  const [inputMode, setInputMode] = useState<InputMode>("statement");
  const [facilitator, setFacilitator] = useState<string>("stripe");
  const [variantKey, setVariantKey] = useState<string>("online");
  const [estWholesalePct, setEstWholesalePct] = useState<NumIn>(1.80);
  const [estWholesalePerTxn, setEstWholesalePerTxn] = useState<NumIn>(0.10);

  const applyRisk = (r: RiskKey) => { setRisk(r); setBinBps(RISK_PRESETS[r].binBps); };
  const applyTier = (t: Tier) => { setTier(t.key); setMarkupBps(t.bps); setPropPerTxn(t.perTxn); };
  const suggestedTier = useMemo(() => PRICING_TIERS.find((t) => Number(volume) <= t.max)?.key || "enterprise", [volume]);

  function loadState(s: LoadState) { setMerchant(s.merchant); setMonth(s.month); setVolume(s.volume); setTxns(s.txns); setItems(s.items); setNextId(1000); setStatus({ state: "idle", msg: "" }); }
  function reset() { loadState(EMPTY); setTier("starter"); setMarkupBps(45); setPropPerTxn(0.12); setMinimum(100); applyRisk("low"); setBinMode("absorb"); setInputMode("statement"); setFacilitator("stripe"); setVariantKey("online"); setEstWholesalePct(1.80); setEstWholesalePerTxn(0.10); setView("tool"); }

  async function handleUpload(file: File | undefined) {
    if (!file) return;
    setStatus({ state: "loading", msg: "Reading " + file.name + " …" });
    try {
      const fd = new FormData();
      fd.append("statement", file);
      const result = await extractStatement(fd);
      if (!result.ok) {
        setStatus({ state: "error", msg: result.error });
        return;
      }
      const parsed = result.data;
      const mapped: Item[] = (parsed.items || []).map((it, idx) => ({ id: 1000 + idx, desc: String(it.desc || ""), amt: Number(it.amt) || 0, cat: it.cat }));
      setMerchant(parsed.merchant || ""); setMonth(parsed.month || "");
      setVolume(Number(parsed.volume) || 0); setTxns(Number(parsed.txns) || 0);
      setItems(mapped); setNextId(1000 + mapped.length);
      setStatus({ state: "ok", msg: "Pulled " + mapped.length + " line items — check every figure before quoting." });
    } catch (e) {
      setStatus({ state: "error", msg: "Couldn't auto-extract. Enter the figures by hand below, or try a clearer scan." });
    }
  }

  const calc = useMemo(() => {
    const vol = Number(volume) || 0, tx = Number(txns) || 0;
    let floor: number, total: number, markup: number, junk: number, fixedMonthly: number, estimatedFloor = false;

    if (inputMode === "payfac") {
      const fac = FACILITATORS[facilitator];
      const v = (fac && fac.variants.find((x) => x.key === variantKey)) || { pct: 0, perTxn: 0 };
      total = (v.pct / 100) * vol + v.perTxn * tx;                          // exact — public rate
      const estFloor = (Number(estWholesalePct) / 100) * vol + Number(estWholesalePerTxn) * tx;
      floor = Math.min(estFloor, total);                                    // can't exceed what they pay
      markup = total - floor; junk = 0; fixedMonthly = 0; estimatedFloor = true;
    } else {
      const sum = (pred: (i: Item) => unknown) => items.filter(pred).reduce((a, i) => a + (Number(i.amt) || 0), 0);
      floor = sum((i) => CATEGORIES[i.cat]?.floor);
      total = sum(() => true);
      markup = total - floor;
      junk = sum((i) => i.cat === "junk");
      fixedMonthly = sum((i) => i.cat === "monthly" || i.cat === "junk");
    }
    const effRate = vol ? total / vol : 0;
    const floorRate = vol ? floor / vol : 0;

    const propMarkup = (Number(markupBps) / 10000) * vol + Number(propPerTxn) * tx;
    const minBinding = propMarkup < Number(minimum);
    const chargedMarkup = Math.max(propMarkup, Number(minimum));
    const rp = RISK_PRESETS[risk];
    const binCost = (Number(binBps) / 10000) * vol;
    const merchantBin = binMode === "passthrough" ? binCost : 0;
    const propTotal = floor + merchantBin + chargedMarkup;
    const savings = total - propTotal;
    const notCompetitive = propTotal > total;
    const impCost = rp.fixed + rp.perTxn * tx + (binMode === "absorb" ? binCost : 0);
    const grossMargin = chargedMarkup - impCost;
    const netResidual = grossMargin * rp.residual;
    const dualNet = Number(minimum);
    const dualSavings = total - dualNet;

    return { vol, tx, floor, total, markup, junk, fixedMonthly, effRate, floorRate, propMarkup, chargedMarkup,
             minBinding, propTotal, savings, notCompetitive, binCost, merchantBin, impCost, grossMargin, netResidual, dualNet, dualSavings, estimatedFloor };
  }, [volume, txns, items, markupBps, propPerTxn, minimum, risk, binBps, binMode, inputMode, facilitator, variantKey, estWholesalePct, estWholesalePerTxn]);

  const updateItem = (id: number, f: "desc" | "amt" | "cat", v: string) => setItems(items.map((i) => (i.id === id ? ({ ...i, [f]: v } as Item) : i)));
  const addItem = () => { setItems([...items, { id: nextId, desc: "", amt: 0, cat: "monthly" }]); setNextId(nextId + 1); };
  const removeItem = (id: number) => setItems(items.filter((i) => i.id !== id));

  const S: {
    page: CSSProperties; eyebrow: CSSProperties; section: CSSProperties; label: CSSProperties;
    grid4: CSSProperties; th: CSSProperties; td: CSSProperties; card: (bg: string, bd: string) => CSSProperties;
    big: CSSProperties; cardLbl: CSSProperties; flag: CSSProperties; tabnum: CSSProperties;
  } = {
    page: { fontFamily: "var(--font-sans)", color: "var(--ink-900)", background: "var(--paper)", maxWidth: 968, margin: "0 auto", padding: 24, fontSize: 14 },
    eyebrow: { fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--clay-600)", margin: "0 0 14px" },
    section: { border: "1px solid var(--ink-200)", borderRadius: "var(--radius-lg)", padding: 22, marginBottom: 18, background: "var(--white)", boxShadow: "var(--shadow-sm)" },
    label: { fontSize: 12, color: "var(--ink-500)", display: "block", marginBottom: 4, fontWeight: 500 },
    grid4: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 },
    th: { textAlign: "left", fontSize: 11, color: "var(--ink-500)", fontWeight: 600, padding: "4px 6px", borderBottom: "1px solid var(--ink-200)", textTransform: "uppercase", letterSpacing: "0.04em" },
    td: { padding: "4px 6px", verticalAlign: "middle" },
    card: (bg, bd) => ({ background: bg, border: "1px solid " + bd, borderRadius: "var(--radius-md)", padding: 14, flex: 1, minWidth: 150 }),
    big: { fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 600, lineHeight: 1.04, letterSpacing: "-0.02em" },
    cardLbl: { fontSize: 11, color: "var(--ink-500)", marginBottom: 4, fontWeight: 500 },
    flag: { fontSize: 13, borderRadius: "var(--radius-md)", padding: "10px 12px", marginTop: 12, marginBottom: 0, lineHeight: 1.5 },
    tabnum: { fontVariantNumeric: "tabular-nums" },
  };

  const catTotals = (Object.keys(CATEGORIES) as CatKey[]).map((k) => ({ key: k, ...CATEGORIES[k], amt: items.filter((i) => i.cat === k).reduce((a, i) => a + (Number(i.amt) || 0), 0) }));
  const priceLine = (Number(markupBps) / 100) + "% + " + Math.round(Number(propPerTxn) * 100) + "¢ per sale";

  return (
    <div className="ib-root" style={{ background: "var(--paper)" }}>
      <style>{DS_CSS}</style>

      {/* ══════════ TOOL UI ══════════ */}
      <div className="tool-ui" style={{ ...S.page, display: view === "report" ? "none" : "block" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Emblem size={38} />
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600, letterSpacing: "-0.02em" }}>Statement analysis</div>
              <div style={{ color: "var(--ink-500)", fontSize: 13 }}>See what a merchant really pays — and what you'd save them.</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="ib-btn ib-btn-primary" onClick={exportPDF}>Export PDF</button>
            <button className="ib-btn ib-btn-secondary" onClick={() => setView("report")}>Preview report</button>
            <button className="ib-btn ib-btn-ghost" onClick={() => loadState(SAMPLE)}>Load sample</button>
            <button className="ib-btn ib-btn-ghost" onClick={reset}>Reset</button>
          </div>
        </div>

        {/* Input mode toggle */}
        <div style={{ display: "flex", gap: 4, marginBottom: 18, background: "var(--ink-50)", border: "1px solid var(--ink-200)", borderRadius: "var(--radius-pill)", padding: 4, width: "fit-content" }}>
          {([["statement", "Upload statement"], ["payfac", "Flat-rate provider"]] as const).map(([k, lbl]) => (
            <button key={k} onClick={() => setInputMode(k)} className="ib-btn" style={{ background: inputMode === k ? "var(--white)" : "transparent", color: inputMode === k ? "var(--clay-600)" : "var(--ink-600)", boxShadow: inputMode === k ? "var(--shadow-sm)" : "none", padding: "7px 18px" }}>{lbl}</button>
          ))}
        </div>

        {/* Upload — statement mode only */}
        {inputMode === "statement" && (
          <div style={S.section}>
            <p style={S.eyebrow}>Upload statement</p>
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <input ref={fileRef} type="file" accept=".pdf,image/*" style={{ display: "none" }} onChange={(e) => handleUpload(e.target.files?.[0])} />
              <button className="ib-btn ib-btn-secondary" onClick={() => fileRef.current?.click()}>Choose PDF or image</button>
              <span style={{ fontSize: 13, color: status.state === "error" ? "var(--brick-600)" : status.state === "ok" ? "var(--sage-600)" : "var(--ink-500)" }}>
                {status.msg || "We'll read it for you — then always double-check the figures before quoting."}
              </span>
            </div>
          </div>
        )}

        {/* Current provider — flat-rate mode only */}
        {inputMode === "payfac" && (
          <div style={S.section}>
            <p style={S.eyebrow}>Current provider</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
              {Object.entries(FACILITATORS).map(([k, f]) => (
                <button key={k} onClick={() => { setFacilitator(k); setVariantKey(f.variants[0].key); }} className={"ib-tier" + (facilitator === k ? " ib-tier-on" : "")} style={{ maxWidth: 200 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{f.label}</div>
                  <div style={{ fontSize: 11, color: "var(--ink-500)" }}>{f.variants.length} published rates</div>
                </button>
              ))}
            </div>
            <div style={S.grid4}>
              <div style={{ gridColumn: "span 2" }}><label style={S.label}>Rate type</label><select className="ib-in" value={variantKey} onChange={(e) => setVariantKey(e.target.value)}>{FACILITATORS[facilitator].variants.map((v) => <option key={v.key} value={v.key}>{v.label} — {v.pct}% + {Math.round(v.perTxn * 100)}¢</option>)}</select></div>
              <div><label style={S.label}>Est. wholesale (%)</label><input className="ib-in" type="number" step="0.01" value={estWholesalePct} onChange={(e) => setEstWholesalePct(e.target.value)} /></div>
              <div><label style={S.label}>Est. wholesale / txn ($)</label><input className="ib-in" type="number" step="0.01" value={estWholesalePerTxn} onChange={(e) => setEstWholesalePerTxn(e.target.value)} /></div>
            </div>
            <p style={{ fontSize: 12.5, color: "var(--ink-600)", margin: "10px 0 0", lineHeight: 1.5 }}>Flat-rate providers bundle everything into one rate and never disclose interchange — so the current cost below is <b>exact</b>, but the wholesale split and savings are <b>estimated</b> until you see a month of real processing. Tune the wholesale estimate to the merchant's card mix (debit-heavy runs lower, rewards-credit higher).</p>
            {FACILITATORS[facilitator].lockIn && (
              <p style={{ ...S.flag, color: "var(--clay-700)", background: "var(--amber-50)", border: "1px solid var(--amber-100)" }}>⚑ Shopify isn't a clean swap. If the merchant stays on Shopify and switches processing, Shopify adds a third-party transaction fee (about 2% Basic · 1% Grow · 0.5% Advanced · 0.15% Plus) on top of your rate — which often wipes out the saving on lower plans. A real win usually means moving them off Shopify's checkout entirely, or an Advanced/Plus store where that fee is small. Treat any saving shown here as best-case.</p>
            )}
          </div>
        )}

        {/* Merchant */}
        <div style={S.section}>
          <p style={S.eyebrow}>Merchant & volume</p>
          <div style={S.grid4}>
            <div><label style={S.label}>Merchant</label><input className="ib-in" value={merchant} onChange={(e) => setMerchant(e.target.value)} /></div>
            <div><label style={S.label}>Statement month</label><input className="ib-in" value={month} onChange={(e) => setMonth(e.target.value)} /></div>
            <div><label style={S.label}>Card volume ($)</label><input className="ib-in" type="number" value={volume} onChange={(e) => setVolume(e.target.value)} /></div>
            <div><label style={S.label}>Transactions (settled)</label><input className="ib-in" type="number" value={txns} onChange={(e) => setTxns(e.target.value)} /></div>
          </div>
        </div>

        {/* Line items — statement mode only */}
        {inputMode === "statement" && (
        <div style={S.section}>
          <p style={S.eyebrow}>Fee line items</p>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>
              <th style={{ ...S.th, width: "44%" }}>Description</th><th style={{ ...S.th, width: "16%" }}>Amount</th>
              <th style={{ ...S.th, width: "34%" }}>Category</th><th style={S.th}></th>
            </tr></thead>
            <tbody>
              {items.map((i) => (
                <tr key={i.id}>
                  <td style={S.td}><input className="ib-in" value={i.desc} onChange={(e) => updateItem(i.id, "desc", e.target.value)} /></td>
                  <td style={S.td}><input className="ib-in" type="number" value={i.amt} onChange={(e) => updateItem(i.id, "amt", e.target.value)} /></td>
                  <td style={S.td}><select className="ib-in" value={i.cat} onChange={(e) => updateItem(i.id, "cat", e.target.value)}>{Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></td>
                  <td style={S.td}><button className="ib-btn ib-btn-ghost" style={{ padding: "4px 10px", color: "var(--brick-500)" }} onClick={() => removeItem(i.id)}>×</button></td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan={4} style={{ ...S.td, color: "var(--ink-400)", padding: "14px 6px" }}>No line items yet — upload a statement or add rows below.</td></tr>}
            </tbody>
          </table>
          <button className="ib-btn ib-btn-secondary" style={{ marginTop: 12 }} onClick={addItem}>+ Add line item</button>
        </div>
        )}

        {/* Current state */}
        <div style={S.section}>
          <p style={S.eyebrow}>What they pay now</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
            <div style={S.card("var(--brick-50)", "var(--brick-100)")}><div style={S.cardLbl}>Effective rate</div><div style={{ ...S.big, color: "var(--brick-600)" }}>{pct(calc.effRate)}</div><div style={{ fontSize: 11, color: "var(--ink-500)" }}>{usd(calc.total)} on {usd(calc.vol)}</div></div>
            <div style={S.card("var(--ink-50)", "var(--ink-200)")}><div style={S.cardLbl}>{calc.estimatedFloor ? "Est. wholesale floor" : "Wholesale floor"}</div><div style={{ ...S.big, color: "var(--ink-800)" }}>{pct(calc.floorRate)}</div><div style={{ fontSize: 11, color: "var(--ink-500)" }}>{usd(calc.floor)} — {calc.estimatedFloor ? "estimated" : "unavoidable"}</div></div>
            <div style={S.card("var(--amber-50)", "var(--amber-100)")}><div style={S.cardLbl}>Addressable markup</div><div style={{ ...S.big, color: "var(--clay-600)" }}>{usd(calc.markup)}</div><div style={{ fontSize: 11, color: "var(--ink-500)" }}>{calc.total ? pct(calc.markup / calc.total) : "—"} of total{calc.estimatedFloor ? " (est.)" : ""}</div></div>
            {calc.estimatedFloor
              ? <div style={S.card("var(--slate-50)", "var(--slate-100)")}><div style={S.cardLbl}>Current provider</div><div style={{ ...S.big, fontSize: 22, color: "var(--slate-700)" }}>{FACILITATORS[facilitator].label}</div><div style={{ fontSize: 11, color: "var(--ink-500)" }}>flat rate — no itemized statement</div></div>
              : <div style={S.card("var(--brick-50)", "var(--brick-100)")}><div style={S.cardLbl}>Fixed fees / month</div><div style={{ ...S.big, color: "var(--brick-600)" }}>{usd(calc.fixedMonthly)}</div><div style={{ fontSize: 11, color: "var(--ink-500)" }}>incl. {usd(calc.junk)} junk</div></div>}
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}><tbody>
            {catTotals.filter((c) => c.amt > 0).map((c) => (
              <tr key={c.key}>
                <td style={{ ...S.td, color: c.tint, fontWeight: c.flag ? 700 : 500 }}>{c.label}{c.flag ? " ⚑" : ""}{c.floor ? "  (pass-through)" : ""}</td>
                <td style={{ ...S.td, textAlign: "right", ...S.tabnum }}>{usd(c.amt)}</td>
                <td style={{ ...S.td, textAlign: "right", color: "var(--ink-500)", width: 70 }}>{calc.vol ? pct(c.amt / calc.vol) : "—"}</td>
              </tr>
            ))}
            <tr style={{ borderTop: "2px solid var(--ink-200)" }}>
              <td style={{ ...S.td, fontWeight: 700 }}>Total</td>
              <td style={{ ...S.td, textAlign: "right", fontWeight: 700, ...S.tabnum }}>{usd(calc.total)}</td>
              <td style={{ ...S.td, textAlign: "right", fontWeight: 700 }}>{pct(calc.effRate)}</td>
            </tr>
          </tbody></table>
        </div>

        {/* Proposal */}
        <div style={S.section}>
          <p style={S.eyebrow}>Impeccabyte proposal</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
            {PRICING_TIERS.map((t) => (
              <button key={t.key} onClick={() => applyTier(t)} className={"ib-tier" + (tier === t.key ? " ib-tier-on" : "")}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{t.label}{t.popular ? <span style={{ fontSize: 10, color: "var(--clay-600)", fontWeight: 600 }}> · popular</span> : ""}{suggestedTier === t.key ? <span style={{ fontSize: 10, color: "var(--sage-600)", fontWeight: 600 }}> · fits volume</span> : ""}</div>
                <div style={{ fontSize: 11, color: "var(--ink-500)" }}>{t.range}</div>
                <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4, color: "var(--ink-800)" }}>{t.bps / 100}% + {Math.round(t.perTxn * 100)}¢</div>
              </button>
            ))}
          </div>
          <div style={{ ...S.grid4, marginBottom: 14 }}>
            <div><label style={S.label}>Margin (basis points)</label><input className="ib-in" type="number" value={markupBps} onChange={(e) => { setMarkupBps(e.target.value); setTier("custom"); }} /></div>
            <div><label style={S.label}>Per-transaction ($)</label><input className="ib-in" type="number" step="0.01" value={propPerTxn} onChange={(e) => { setPropPerTxn(e.target.value); setTier("custom"); }} /></div>
            <div><label style={S.label}>Monthly minimum ($)</label><input className="ib-in" type="number" value={minimum} onChange={(e) => setMinimum(e.target.value)} /></div>
            <div><label style={S.label}>Risk tier (your cost)</label><select className="ib-in" value={risk} onChange={(e) => applyRisk(e.target.value as RiskKey)}>{(Object.entries(RISK_PRESETS) as [RiskKey, RiskPreset][]).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></div>
            <div><label style={S.label}>BIN fee (bps, on total volume)</label><input className="ib-in" type="number" value={binBps} onChange={(e) => setBinBps(e.target.value)} /></div>
            <div><label style={S.label}>BIN handling</label><select className="ib-in" value={binMode} onChange={(e) => setBinMode(e.target.value as BinMode)}><option value="absorb">Absorb (cuts your margin)</option><option value="passthrough">Pass-through (merchant pays)</option></select></div>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div style={S.card("var(--sage-50)", "var(--sage-100)")}><div style={S.cardLbl}>Proposed cost / month</div><div style={{ ...S.big, color: "var(--sage-600)" }}>{usd(calc.propTotal)}</div><div style={{ fontSize: 11, color: "var(--ink-500)" }}>{calc.vol ? pct(calc.propTotal / calc.vol) : "—"} effective</div>
              {calc.minBinding && <div style={{ marginTop: 6, fontSize: 10, fontWeight: 700, color: "var(--clay-700)", background: "var(--amber-50)", border: "1px solid var(--amber-100)", borderRadius: 6, padding: "2px 6px", display: "inline-block" }}>${Number(minimum)} min binding · tier has no effect</div>}
            </div>
            <div style={S.card(calc.savings >= 0 ? "var(--sage-50)" : "var(--brick-50)", calc.savings >= 0 ? "var(--sage-100)" : "var(--brick-100)")}><div style={S.cardLbl}>{calc.savings >= 0 ? "Merchant saves" : "Merchant pays more"}</div><div style={{ ...S.big, color: calc.savings >= 0 ? "var(--sage-600)" : "var(--brick-600)" }}>{usd(calc.savings)}</div><div style={{ fontSize: 11, color: "var(--ink-500)" }}>{usd(calc.savings * 12)} / year</div></div>
            <div style={S.card("var(--slate-50)", "var(--slate-100)")}><div style={S.cardLbl}>Your net residual</div><div style={{ ...S.big, color: calc.netResidual >= 0 ? "var(--slate-700)" : "var(--brick-600)" }}>{usd(calc.netResidual)}</div><div style={{ fontSize: 11, color: "var(--ink-500)" }}>after {usd(calc.impCost)} cost · {pct(RISK_PRESETS[risk].residual)} split · BIN {binMode === "absorb" ? "absorbed (" + usd(calc.binCost) + ")" : "passed through"}</div></div>
          </div>
          <p style={{ fontSize: 12.5, color: "var(--ink-600)", margin: "12px 0 0" }}>
            Tier margin <b style={{ color: "var(--ink-900)" }}>{usd(calc.propMarkup)}</b> {calc.minBinding ? "→ floored up to" : "→ charged"} <b style={{ color: "var(--ink-900)" }}>{usd(calc.chargedMarkup)}</b> {calc.minBinding ? "(monthly minimum)" : "(clears the minimum)"} · + {usd(calc.floor)} pass-through{calc.merchantBin > 0 ? " + " + usd(calc.merchantBin) + " BIN" : ""} = {usd(calc.propTotal)}
          </p>
          {binMode === "passthrough" && calc.binCost > 0 && (
            <p style={{ ...S.flag, color: "var(--ink-600)", background: "var(--ink-50)", border: "1px solid var(--ink-200)" }}>Merchant's cost includes {usd(calc.binCost)} BIN pass-through ({binBps} bps). It's residual-neutral to you — but it's another line on their bill. For standard tiers, absorbing it keeps the quote cleaner.</p>
          )}
          {calc.notCompetitive && (
            <p style={{ ...S.flag, color: "var(--brick-600)", background: "var(--brick-50)", border: "1px solid var(--brick-100)" }}>⚑ At this volume the merchant would pay <b>more</b> than today — the ${Number(minimum)} minimum outweighs their volume. This account is below your efficient range; it's a relationship, not a deal.</p>
          )}
          {!calc.notCompetitive && calc.minBinding && (
            <p style={{ ...S.flag, color: "var(--clay-700)", background: "var(--amber-50)", border: "1px solid var(--amber-100)" }}>⚑ The ${Number(minimum)} monthly minimum is the binding cost here (real margin is only {usd(calc.propMarkup)}). They still save, but they're at the low end — set expectations about the minimum up front.</p>
          )}
        </div>

        {/* Dual pricing */}
        <div style={S.section}>
          <p style={S.eyebrow}>Or: dual pricing</p>
          <p style={{ fontSize: 13.5, color: "var(--ink-700)", margin: "0 0 12px", lineHeight: 1.55 }}>Passing the card cost to card-paying customers takes the merchant's net cost toward the monthly minimum only. Confirm the exact mechanics against Maverick's compliant program before quoting.</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div style={S.card("var(--sage-50)", "var(--sage-100)")}><div style={S.cardLbl}>Merchant net cost</div><div style={{ ...S.big, color: "var(--sage-600)" }}>{usd(calc.dualNet)}</div><div style={{ fontSize: 11, color: "var(--ink-500)" }}>≈ monthly minimum</div></div>
            <div style={S.card("var(--sage-50)", "var(--sage-100)")}><div style={S.cardLbl}>Vs. current</div><div style={{ ...S.big, color: calc.dualSavings >= 0 ? "var(--sage-600)" : "var(--brick-600)" }}>{usd(calc.dualSavings)}</div><div style={{ fontSize: 11, color: "var(--ink-500)" }}>{usd(calc.dualSavings * 12)} / year</div></div>
          </div>
        </div>

        <p style={{ fontSize: 11.5, color: "var(--ink-400)", marginTop: 4, lineHeight: 1.5 }}>
          Effective rate = total cost ÷ volume. Floor = interchange + assessments (unavoidable). Markup = everything above it. Pricing from impeccabyte.com/pricing; buy rates from Maverick Schedule A. Estimate for consultation, not a binding quote.
        </p>
      </div>

      {/* ══════════ MERCHANT-FACING REPORT (screen preview + print) ══════════ */}
      <div className="print-report" style={{ display: view === "report" ? "block" : "none", background: "var(--paper)", padding: 24 }}>
        <div ref={reportRef} style={{ maxWidth: 720, margin: "0 auto", background: "var(--white)", border: "1px solid var(--ink-200)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-md)", padding: 40, fontFamily: "var(--font-sans)", color: "var(--ink-900)" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 20, borderBottom: "1px solid var(--ink-100)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}><Emblem size={40} /><Wordmark s={24} /></div>
            <div style={{ textAlign: "right" }}><div style={{ ...S.eyebrow, margin: 0 }}>Statement analysis</div><div style={{ fontSize: 13, color: "var(--ink-500)" }}>{month || "—"}</div></div>
          </div>

          {/* Intro */}
          <div style={{ marginTop: 26 }}>
            <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--clay-600)" }}>Prepared for</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600, letterSpacing: "-0.02em", marginTop: 2 }}>{merchant || "Your business"}</div>
          </div>

          {/* Headline stat */}
          <div style={{ marginTop: 28, background: "var(--clay-50)", border: "1px solid var(--clay-100)", borderRadius: "var(--radius-lg)", padding: 26 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 34, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
              You're paying <span style={{ fontStyle: "italic", color: "var(--clay-500)" }}>{pct(calc.effRate)}</span> to get paid.
            </div>
            <div style={{ fontSize: 15, color: "var(--ink-700)", marginTop: 8, lineHeight: 1.6 }}>
              That's {usd(calc.total)} in fees on {usd(calc.vol)} of card sales this month.{calc.estimatedFloor ? " You're on " + FACILITATORS[facilitator].label + "'s flat " + (FACILITATORS[facilitator].variants.find((v) => v.key === variantKey)?.pct) + "% + " + Math.round((FACILITATORS[facilitator].variants.find((v) => v.key === variantKey)?.perTxn || 0) * 100) + "¢ rate — the same on every card." : ""} Here's where it goes — and what it could be.
            </div>
          </div>

          {/* Breakdown */}
          <div style={{ marginTop: 24, display: "flex", gap: 14, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 220, border: "1px solid var(--ink-200)", borderRadius: "var(--radius-md)", padding: 18 }}>
              <div style={{ fontSize: 12.5, color: "var(--ink-500)" }}>Wholesale cost{calc.estimatedFloor ? " (estimated)" : ""}</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600 }}>{usd(calc.floor)}</div>
              <div style={{ fontSize: 12.5, color: "var(--ink-600)", marginTop: 4, lineHeight: 1.5 }}>Set by the card networks. No provider can lower this — it's the honest floor.</div>
            </div>
            <div style={{ flex: 1, minWidth: 220, border: "1px solid var(--amber-100)", background: "var(--amber-50)", borderRadius: "var(--radius-md)", padding: 18 }}>
              <div style={{ fontSize: 12.5, color: "var(--ink-500)" }}>Your provider's markup & fees</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600, color: "var(--clay-600)" }}>{usd(calc.markup)}</div>
              <div style={{ fontSize: 12.5, color: "var(--ink-600)", marginTop: 4, lineHeight: 1.5 }}>The negotiable part{calc.junk > 0 ? " — including " + usd(calc.junk) + " in avoidable add-ons" : ""}.</div>
            </div>
          </div>

          {/* Offer */}
          <div style={{ marginTop: 24, background: "var(--clove-900)", borderRadius: "var(--radius-lg)", padding: 26, color: "#F3EBDE" }}>
            <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--amber-400)" }}>With Impeccabyte</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 8, flexWrap: "wrap" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 600, letterSpacing: "-0.02em", color: "#fff" }}>{usd(calc.propTotal)}</div>
              <div style={{ fontSize: 15, color: "#D9CDBB" }}>/ month</div>
            </div>
            {calc.savings > 0 ? (
              <div style={{ fontSize: 16, marginTop: 6, lineHeight: 1.5 }}>You keep <b style={{ color: "var(--amber-400)" }}>{usd(calc.savings)}</b> every month — about <b>{usd(calc.savings * 12)}</b> a year.</div>
            ) : (
              <div style={{ fontSize: 15, marginTop: 6, lineHeight: 1.5, color: "#D9CDBB" }}>At your current volume our flat pricing isn't a saving yet — and we'll always tell you straight when it is.</div>
            )}
            <div style={{ fontSize: 14, marginTop: 12, color: "#D9CDBB", lineHeight: 1.6 }}>
              Simple pricing: {priceLine}. No monthly fee, no junk. {calc.dualSavings > calc.savings ? "Prefer to offset it entirely? With dual pricing your net cost can drop to about " + usd(calc.dualNet) + " a month." : ""}
            </div>
          </div>

          {/* Footer */}
          <div style={{ marginTop: 26, paddingTop: 18, borderTop: "1px solid var(--ink-100)", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 10 }}>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600 }}>Impeccabyte — <span style={{ fontStyle: "italic", color: "var(--clay-500)" }}>impeccably convenient.</span></div>
              <div style={{ fontSize: 12, color: "var(--ink-400)", marginTop: 3 }}>impeccabyte.com · Estimate based on your current statement; not a binding quote.</div>
            </div>
          </div>
        </div>

        <div className="tool-ui" style={{ maxWidth: 720, margin: "14px auto 0", textAlign: "right" }}>
          <button className="ib-btn ib-btn-ghost" onClick={() => setView("tool")}>← Back to tool</button>
          <button className="ib-btn ib-btn-primary" style={{ marginLeft: 8 }} onClick={exportPDF}>Export PDF</button>
        </div>
      </div>
    </div>
  );
}
