"use server";

import Anthropic from "@anthropic-ai/sdk";
import { MAX_STATEMENT_BYTES } from "@/lib/hubspot/constants";

// Categories the analyzer understands. Kept in sync with CATEGORIES in
// components/tools/statement-analyzer.tsx — the enum below forces Claude to
// return only these, so the client never has to remap.
const CATEGORIES = ["interchange", "assessments", "discount", "perTxn", "monthly", "junk"] as const;

const IMAGE_MIME = new Set(["image/png", "image/jpeg", "image/gif", "image/webp"]);
const PDF_MIME = "application/pdf";

export type ExtractedItem = { desc: string; amt: number; cat: (typeof CATEGORIES)[number] };
export type ExtractedStatement = {
  merchant: string;
  month: string;
  volume: number;
  txns: number;
  items: ExtractedItem[];
};

export type ExtractResult =
  | { ok: true; data: ExtractedStatement }
  | { ok: false; error: string };

const GENERIC_ERROR =
  "Couldn't auto-extract. Enter the figures by hand below, or try a clearer scan.";

// JSON Schema for structured outputs. Note the structured-outputs constraints:
// every object needs additionalProperties:false, and no min/max/length keywords.
const SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    merchant: { type: "string" },
    month: { type: "string" },
    volume: { type: "number" },
    txns: { type: "number" },
    items: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          desc: { type: "string" },
          amt: { type: "number" },
          cat: { type: "string", enum: [...CATEGORIES] },
        },
        required: ["desc", "amt", "cat"],
      },
    },
  },
  required: ["merchant", "month", "volume", "txns", "items"],
} as const;

const PROMPT =
  "Extract data from this merchant processing statement.\n" +
  "- volume = total card sales / net sales for the period (number only, no symbols).\n" +
  "- txns = count of settled sale transactions.\n" +
  "- items = each fee the merchant paid. Bundle ALL interchange sub-lines into one item cat \"interchange\". " +
  "Bundle ALL card-brand/assessment/dues/network sub-lines into one item cat \"assessments\".\n" +
  "- cat is one of: \"interchange\", \"assessments\", \"discount\" (percentage discount markup), " +
  "\"perTxn\" (auth/AVS/batch/per-item fees), \"monthly\" (monthly fee, online access, account on file), " +
  "\"junk\" (PCI, website monitoring, statement fee, regulatory, minimums).\n" +
  "- amt = dollars the merchant actually paid for that line.";

/**
 * Reads an uploaded merchant statement (PDF or image) and returns the figures
 * an agent can verify. Runs entirely server-side so the Anthropic key never
 * reaches the browser. On any failure it returns a friendly error and the
 * client falls back to manual entry.
 */
export async function extractStatement(formData: FormData): Promise<ExtractResult> {
  const raw = formData.get("statement");
  if (!(raw instanceof File) || raw.size === 0) {
    return { ok: false, error: "No file received. Pick a PDF or image and try again." };
  }

  const isPdf = raw.type === PDF_MIME || raw.name.toLowerCase().endsWith(".pdf");
  const isImage = IMAGE_MIME.has(raw.type) || /\.(png|jpe?g|gif|webp)$/i.test(raw.name);
  if (!isPdf && !isImage) {
    return { ok: false, error: "Unsupported file. Upload a PDF or an image (PNG/JPG)." };
  }
  if (raw.size > MAX_STATEMENT_BYTES) {
    return { ok: false, error: "File is too large (max 10 MB)." };
  }

  const b64 = Buffer.from(await raw.arrayBuffer()).toString("base64");
  const block: Anthropic.ContentBlockParam = isPdf
    ? { type: "document", source: { type: "base64", media_type: "application/pdf", data: b64 } }
    : {
        type: "image",
        source: {
          type: "base64",
          media_type: (IMAGE_MIME.has(raw.type) ? raw.type : "image/png") as
            | "image/png"
            | "image/jpeg"
            | "image/gif"
            | "image/webp",
          data: b64,
        },
      };

  let client: Anthropic;
  try {
    client = new Anthropic(); // reads ANTHROPIC_API_KEY from the environment
  } catch (err) {
    console.error("[extractStatement] Anthropic client init failed:", err);
    return { ok: false, error: GENERIC_ERROR };
  }

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 8000,
      thinking: { type: "adaptive" },
      output_config: { format: { type: "json_schema", schema: SCHEMA } },
      messages: [{ role: "user", content: [block, { type: "text", text: PROMPT }] }],
    });

    if (response.stop_reason === "refusal") {
      return { ok: false, error: GENERIC_ERROR };
    }

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");

    const parsed = JSON.parse(text) as ExtractedStatement;
    return {
      ok: true,
      data: {
        merchant: String(parsed.merchant ?? ""),
        month: String(parsed.month ?? ""),
        volume: Number(parsed.volume) || 0,
        txns: Number(parsed.txns) || 0,
        items: Array.isArray(parsed.items)
          ? parsed.items.map((it) => ({
              desc: String(it.desc ?? ""),
              amt: Number(it.amt) || 0,
              cat: CATEGORIES.includes(it.cat) ? it.cat : "monthly",
            }))
          : [],
      },
    };
  } catch (err) {
    console.error("[extractStatement] extraction failed:", err);
    return { ok: false, error: GENERIC_ERROR };
  }
}
