import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const S_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const S_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''; // Használj Service Role Key-t ha szükséges
const supabase = createClient(S_URL, S_KEY);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const payload = Object.fromEntries(formData);

    console.log('Gumroad Webhook Payload:', payload);

    // 1. ADATKINYERÉS: Az új "Hex" mezőt keressük
    // A Gumroad több formátumban is küldheti a custom fieldet
    let hexRaw = (payload['custom_fields[Hex]'] || payload['Hex'] || '').toString().trim();

    if (!hexRaw) {
      console.error('Nincs Hex kód a payloadban.');
      return NextResponse.json({ error: 'Missing Hex code' }, { status: 400 });
    }

    // 2. NORMALIZÁLÁS: Kényszerítjük a #RRGGBB formátumot
    let hexNormalized = hexRaw.toUpperCase();
    if (!hexNormalized.startsWith('#')) {
      hexNormalized = `#${hexNormalized}`;
    }

    // Csak akkor mentünk, ha érvényes a hossz (pl. #FFFFFF = 7 karakter)
    if (hexNormalized.length !== 7) {
      console.error('Érvénytelen Hex formátum:', hexNormalized);
      return NextResponse.json({ error: 'Invalid Hex format' }, { status: 400 });
    }

    // 3. MENTÉS: Beírás az adatbázisba
    const { error } = await supabase
      .from('sold_colors')
      .insert([
        { 
          hex_code: hexNormalized, 
          owner_name: payload.email || 'Anonymous', // Használhatod a vevő nevét is ha van
          purchase_price: payload.price_usd || 5
        }
      ]);

    if (error) {
      // 4. DUPLIKÁCIÓ KEZELÉSE: Ha már létezik (Error 23505), ne küldjünk hibát a Gumroadnak
      if (error.code === '23505') {
        console.warn('Ez a szín már foglalt, de a fizetés sikeres volt:', hexNormalized);
        return NextResponse.json({ status: 'already_owned' }, { status: 200 });
      }
      throw error;
    }

    return NextResponse.json({ status: 'success', hex: hexNormalized }, { status: 200 });

  } catch (err: any) {
    console.error('Webhook Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
