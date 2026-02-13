import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

function getEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function normalizeHex(input: string): string {
  const raw = input.trim().toUpperCase();
  const hex = raw.startsWith("#") ? raw : `#${raw}`;
  return hex;
}

export async function POST(req: Request) {
  try {
    const text = await req.text();
    const params = new URLSearchParams(text);
    const payload: Record<string, string> = {};
    params.forEach((v, k) => (payload[k] = v));

    const saleId = payload['sale_id'] || payload['id'];
    const email = payload['email'];
    const priceRaw = payload['price'] || payload['amount'];
    const fullName = payload['full_name'] || payload['name'] || "Anonymous";
    const hexRaw = payload['custom_fields[Hex Code]'] || payload['Hex Code'];

    if (!saleId || !email || !priceRaw || !hexRaw) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const hexCode = normalizeHex(hexRaw);
    const price = parseFloat(priceRaw);

    // 1. MENTÉS ADATBÁZISBA
    const supabase = createClient(getEnv("SUPABASE_URL"), getEnv("SUPABASE_SERVICE_ROLE_KEY"));
    const { error: dbError } = await supabase.from("sold_colors").insert({
      hex_code: hexCode,
      owner_name: fullName,
      owner_email: email,
      purchase_price: price,
      gumroad_sale_id: saleId,
    });

    if (dbError && dbError.code !== "23505") throw dbError;

    // 2. KÜLDÉS DISCORDRA
    const discordUrl = process.env.DISCORD_WEBHOOK_URL;
    if (discordUrl) {
      await fetch(discordUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `🎨 **ÚJ SZÍN ELADVA!**\n\nA(z) **${hexCode}** szín gazdára talált!\n👤 **Tulajdonos:** ${fullName}\n💰 **Ár:** $${price}\n\nWeboldal: https://hex-land-grab.vercel.app`
        })
      });
    }

    return new NextResponse("Success", { status: 200 });

  } catch (err: any) {
    console.error("Webhook Error:", err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
