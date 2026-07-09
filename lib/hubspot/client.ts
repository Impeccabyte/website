import { HUBSPOT_BASE } from "@/lib/hubspot/constants";
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

export async function createDeal(d: QuoteInput, contactId: string): Promise<string> {
  const json = await hsPost("/crm/v3/objects/deals", buildDealPayload(d, contactId));
  if (!json?.id) throw new Error(`HubSpot deal create returned no id: ${JSON.stringify(json)}`);
  return json.id;
}

export async function createNote(d: QuoteInput, dealId: string, isoTimestamp: string): Promise<void> {
  await hsPost("/crm/v3/objects/notes", buildNotePayload(d, dealId, isoTimestamp));
}
