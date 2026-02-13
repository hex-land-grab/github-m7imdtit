// FILE: app/api/webhook/route.ts
//
// Secure Gumroad webhook handler (Next.js App Router)
// - Uses Supabase Service Role key (bypasses RLS) to write sales into `sold_colors`
// - Sanitizes hex codes (ensures leading "#", uppercase, 6-hex chars)
// - Idempotent on `hex_code` via PK: if duplicate key (23505), returns 200 to stop Gumroad retries
//
// Required env vars:
// - SUPABASE_URL
// - SUPABASE_SERVICE_ROLE_KEY
//
// Notes:
// - Gumroad sends application/x-www-form-urlencoded by default.
// - Field names for custom fields often come through as `custom_fields[Hex Code]` etc.
// - We defensively read multiple possible shapes.

import { NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const runtime = "nodejs"; // ensure Node runtime (service role key use)

type GumroadPayload = Record<string, string | undefined>;

function getEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

function initSupabaseServiceClient(): SupabaseClient {
  const url = getEnv("SUPABASE_URL");
  const serviceRoleKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function isHex6(s: string): boolean {
  return /^[0-9A-F]{6}$/.test(s);
}

function normalizeHexCode(input: string): string {
  // Accept: "ff0000", "#ff0000", " #FF0000 "
  const raw = input.trim().toUpperCase();
  const withoutHash = raw.startsWith("#") ? raw.slice(1) : raw;

  // If someone passes 3-digit hex, expand? (Not requested) => reject by throwing.
  if (!isHex6(withoutHash)) {
    throw new Error(`Invalid Hex Code: "${input}"`);
  }
  return `#${withoutHash}`;
}

function pickFirst(payload: GumroadPayload, keys: string[]): string | undefined {
  for (const k of keys) {
    const v = payload[k];
    if (typeof v === "string" && v.trim() !== "") return v;
  }
  return undefined;
}

function parsePriceToNumber(priceRaw: string): number {
  // Gumroad may send price in cents or dollars depending on setup; user says "price (Number)".
  // We will accept:
  // - "5" => 5
  // - "5.00" => 5
  // - "500" => 500
  // Caller should ensure consistent unit; we store as numeric as-is.
  const n = Number(priceRaw);
  if (!Number.isFinite(n)) throw new Error(`Invalid price: "${priceRaw}"`);
  return n;
}

async function readFormPayload(req: Request): Promise<GumroadPayload> {
  const contentType = req.headers.get("content-type") ?? "";

  // Gumroad: application/x-www-form-urlencoded
  if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
    const form = await req.formData();
    const obj: GumroadPayload = {};
    for (const [k, v] of form.entries()) {
      // We only care about scalar strings; ignore files
      if (typeof v === "string") obj[k] = v;
    }
    return obj;
  }

  // Fallback: JSON
  if (contentType.includes("application/json")) {
    const json = (await req.json()) as Record<string, unknown>;
    const obj: GumroadPayload = {};
    for (const [k, v] of Object.entries(json)) {
      if (typeof v === "string") obj[k] = v;
      else if (typeof v === "number") obj[k] = String(v);
      else if (v == null) obj[k] = undefined;
    }
    return obj;
  }

  // Last resort: try reading as text and parse as URLSearchParams
  const text = await req.text();
  const params = new URLSearchParams(text);
  const obj: GumroadPayload = {};
  for (const [k, v] of params.entries()) obj[k] = v;
  return obj;
}

export async function POST(req: Request) {
  try {
    const payload = await readFormPayload(req);

    // Gumroad core fields
    const saleId = pickFirst(payload, ["sale_id", "saleId", "id"]);
    const email = pickFirst(payload, ["email", "buyer_email"]);
    const priceRaw = pickFirst(payload, ["price", "formatted_price", "amount"]);
    // "full_name" may arrive as a root field, or inside custom_fields
    const fullName = pickFirst(payload, [
      "full_name",
      "fullName",
      "name",
      "custom_fields[Full Name]",
      "custom_fields[full_name]",
      "custom_fields[Name]",
    ]);

    // Custom fields: Hex Code
    const hexRaw = pickFirst(payload, [
      "Hex Code",
      "hex_code",
      "custom_fields[Hex Code]",
      "custom_fields[hex_code]",
      "custom_fields[HEX CODE]",
      "custom_fields[Hex]",
    ]);

    if (!saleId) {
      return NextResponse.json({ ok: false, error: "Missing sale_id" }, { status: 400 });
    }
    if (!email) {
      return NextResponse.json({ ok: false, error: "Missing email" }, { status: 400 });
    }
    if (!priceRaw) {
      return NextResponse.json({ ok: false, error: "Missing price" }, { status: 400 });
    }
    if (!hexRaw) {
      return NextResponse.json({ ok: false, error: "Missing Hex Code" }, { status: 400 });
    }

    const hexCode = normalizeHexCode(hexRaw);
    const purchasePrice = parsePriceToNumber(priceRaw);

    const supabase = initSupabaseServiceClient();

    const { error } = await supabase.from("sold_colors").insert({
      hex_code: hexCode,
      owner_name: fullName ?? null,
      owner_email: email,
      purchase_price: purchasePrice,
      gumroad_sale_id: saleId,
      // created_at is server-default in DB or provided by DB trigger; omit here.
    });

    // Duplicate key (hex already sold) => return 200 to prevent Gumroad retries
    if (error) {
      // Supabase PostgREST errors typically include `code` as a string like "23505"
      const pgCode = (error as any)?.code;
      if (pgCode === "23505") {
        console.warn(`Duplicate purchase attempt for ${hexCode} (sale_id=${saleId})`);
        return new NextResponse("Sale recorded", { status: 200 });
      }

      console.error("Webhook insert failed:", {
        message: error.message,
        code: (error as any)?.code,
        details: (error as any)?.details,
        hint: (error as any)?.hint,
        sale_id: saleId,
        hex_code: hexCode,
      });

      // For non-duplicate failures, still return 500 so Gumroad retries (data loss is worse).
      return NextResponse.json({ ok: false, error: "Insert failed" }, { status: 500 });
    }

    return new NextResponse("Sale recorded", { status: 200 });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
}
