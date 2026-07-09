import { HUBSPOT_BASE, STATEMENT_FOLDER_PATH } from "@/lib/hubspot/constants";
import {
  buildContactProperties,
  buildDealPayload,
  buildNotePayload,
  type QuoteInput,
} from "@/lib/hubspot/quote-form";

function authHeaders(): HeadersInit {
  const key = process.env.HUBSPOT_SERVICE_KEY;
  if (!key) throw new Error("HUBSPOT_SERVICE_KEY is not set");
  return { Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
}

async function hsPost(path: string, body: unknown): Promise<any> {
  const res = await fetch(`${HUBSPOT_BASE}${path}`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HubSpot ${path} failed: ${res.status} ${text}`);
  }
  return res.json();
}

export async function upsertContactByEmail(d: QuoteInput): Promise<string> {
  const json = await hsPost("/crm/v3/objects/contacts/batch/upsert", {
    inputs: [{ idProperty: "email", id: d.email, properties: buildContactProperties(d) }],
  });
  const id = json?.results?.[0]?.id;
  if (!id) throw new Error(`HubSpot contact upsert returned no id: ${JSON.stringify(json)}`);
  return id;
}

export async function uploadStatementFile(file: File): Promise<string> {
  const key = process.env.HUBSPOT_SERVICE_KEY;
  if (!key) throw new Error("HUBSPOT_SERVICE_KEY is not set");
  const form = new FormData();
  form.append("file", file, file.name);
  form.append("folderPath", STATEMENT_FOLDER_PATH);
  form.append("options", JSON.stringify({ access: "PRIVATE" }));
  const res = await fetch(`${HUBSPOT_BASE}/files/v3/files`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}` },
    body: form,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HubSpot file upload failed: ${res.status} ${text}`);
  }
  const json = await res.json();
  if (!json?.id) throw new Error(`HubSpot file upload returned no id: ${JSON.stringify(json)}`);
  return json.id as string;
}

export async function createDeal(d: QuoteInput, contactId: string, hasStatement = false): Promise<string> {
  const json = await hsPost("/crm/v3/objects/deals", buildDealPayload(d, contactId, hasStatement));
  if (!json?.id) throw new Error(`HubSpot deal create returned no id: ${JSON.stringify(json)}`);
  return json.id;
}

export async function createNote(d: QuoteInput, dealId: string, isoTimestamp: string, attachmentId?: string): Promise<void> {
  await hsPost("/crm/v3/objects/notes", buildNotePayload(d, dealId, isoTimestamp, attachmentId));
}
