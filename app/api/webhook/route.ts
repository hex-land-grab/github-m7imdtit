// FILE: app/api/webhook/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { TwitterApi } from "twitter-api-v2";

export const runtime = "nodejs";

// --- ENV VAR HELPERS ---
function getEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

// --- INITIALIZE CLIENTS ---
function initSupabaseAdmin() {
  return createClient(
    getEnv("SUPABASE_URL"),
    getEnv("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { persistSession: false } }
  );
}

function initTwitterClient() {
  if (!process.env.TWITTER_API_KEY) return null;
  return new TwitterApi({
    appKey: process.env.TWITTER_API_KEY!,
    appSecret: process.env.TWITTER_API_SECRET!,
    accessToken: process.env.TWITTER_ACCESS_TOKEN!,
    accessSecret: process.env.TWITTER_ACCESS_SECRET!,
  });
}

// --- HELPERS ---
function normalizeHex(input: string): string {
  const raw = input.trim().toUpperCase();
  const hex = raw.startsWith("#") ? raw : `#${raw}`;
  if (!/^[#0-9A-F]{7}$/.test(hex)) throw new Error(`Invalid Hex: ${input}`);
  return hex;
}

function getField(payload: any, keys: string[]): string | undefined {
  for (const k of keys) {
    if (payload[k]) return payload[k];
  }
  return undefined;
}

// --- MAIN HANDLER ---
export async function POST(req: Request) {
  try {
    // 1. ADATOK BEOLVASÁSA
    const text = await req.text();
    const params = new URLSearchParams(text);
    const payload: Record<string, string> = {};
    params.forEach((v, k) => (payload[k] = v));

    console.log("Webhook received sale:", payload['sale_id']);

    // 2. MEZŐK KIKERESÉSE
    const saleId = getField(payload, ["sale_id", "saleId", "id"]);
    const email = getField(payload, ["email"]);
    const priceRaw = getField(payload, ["price", "amount"]);
    const fullName = getField(payload, ["full_name", "name", "custom_fields[Full Name]"]) || "Anonymous";
    const hexRaw = getField(payload, ["custom_fields[Hex Code]", "Hex Code", "custom_fields[Hex]"]);

    if (!saleId || !email || !priceRaw || !hexRaw) {
      console.error("Missing fields. HexRaw:", hexRaw);
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const hexCode = normalizeHex(hexRaw);
    const price = parseFloat(priceRaw);

    // 3. MENTÉS ADATBÁZISBA (Supabase)
    const supabase = initSupabaseAdmin();
    const { error } = await supabase.from("sold_colors").insert({
      hex_code: hexCode,
      owner_name: fullName,
      owner_email: email,
      purchase_price: price,
      gumroad_sale_id: saleId,
    });

    if (error) {
      if (error.code === "23505") { // Duplicate key
        console.log("Already processed:", hexCode);
        return new NextResponse("Already recorded", { status: 200 });
      }
      throw error;
    }

    // 4. POSZTOLÁS TWITTERRE (X)
    try {
      const twitter = initTwitterClient();
      if (twitter) {
        // --- ITT A MARKETINGSZÖVEG ---
        const tweetText = `🎨 NEW COLOR CLAIMED!\n\nThe color ${hexCode} is now officially owned by ${fullName}.\n\nOnly 1 owner per color. Forever.\nGet yours: https://hex-land-grab.vercel.app`;
        
        await twitter.v2.tweet(tweetText);
        console.log("Tweet sent successfully for", hexCode);
      } else {
        console.log("Twitter keys missing, skipping tweet.");
      }
    } catch (twError) {
      console.error("Twitter post failed:", twError);
    }

    return new NextResponse("Success", { status: 200 });

  } catch (err: any) {
    console.error("Webhook Error:", err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
