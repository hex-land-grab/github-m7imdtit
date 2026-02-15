import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const S_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const S_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''; 
const supabase = createClient(S_URL, S_KEY);

export async function POST(req: Request) {
  try {
    // Rugalmas adatkinyerés: megpróbáljuk JSON-ként, ha nem megy, akkor FormData-ként
    let payload: any;
    const contentType = req.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      payload = await req.json();
    } else {
      const formData = await req.formData();
      payload = Object.fromEntries(formData);
    }

    console.log('Gumroad Webhook Payload:', payload);

    // 1. ADATKINYERÉS: Az új SelectedHex kulcsot keressük elsődlegesen
    let hexRaw = (
      payload['SelectedHex'] || 
      payload['custom_fields[SelectedHex]'] || 
      payload['Hex'] || 
      ''
    ).toString().trim();

    if (!hexRaw) {
      console.error('Nincs Hex kód a payloadban.');
      // 200-at küldünk vissza, hogy a Gumroad ne próbálkozzon újra hibás adattal
      return NextResponse.json({ error: 'Missing Hex code' }, { status: 200 });
    }

    // 2. NORMALIZÁLÁS: Kényszerítjük a #RRGGBB formátumot
    let hexNormalized = hexRaw.toUpperCase();
    if (!hexNormalized.startsWith('#')) {
      hexNormalized = `#${hexNormalized}`;
    }

    // Validálás: # + 6 karakter
    if (hexNormalized.length !== 7) {
      console.error('Érvénytelen Hex formátum:', hexNormalized);
      return NextResponse.json({ error: 'Invalid Hex format' }, { status: 200 });
    }

    // 3. MENTÉS: Beírás az adatbázisba
    const { error } = await supabase
      .from('sold_colors')
      .insert([
        { 
          hex_code: hexNormalized, 
          owner_name: payload.email || 'Anonymous',
          purchase_price: payload.price_usd || 5
        }
      ]);

    if (error) {
      if (error.code === '23505') {
        console.warn('Ez a szín már foglalt:', hexNormalized);
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
