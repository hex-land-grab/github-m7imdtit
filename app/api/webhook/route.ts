import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const S_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const S_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''; 
const supabase = createClient(S_URL, S_KEY);

export async function POST(req: Request) {
  try {
    let payload: any;
    const contentType = req.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      payload = await req.json();
    } else {
      const formData = await req.formData();
      payload = Object.fromEntries(formData);
    }

    console.log('Gumroad Webhook Payload:', payload);

    // 1. HEX KINYERÉSE
    let hexRaw = (
      payload['SelectedHex'] || 
      payload['custom_fields[SelectedHex]'] || 
      payload['Hex'] || 
      ''
    ).toString().trim();

    // 2. NÉV KINYERÉSE (Biztonságos!)
    // Megkeressük a Nickname mezőt. Ha nincs, akkor "Anonymous"-t mentünk.
    // SOHA ne mentsük az emailt publikus névként!
    let ownerName = (
        payload['Nickname'] || 
        payload['custom_fields[Nickname]'] || 
        'Anonymous'
    ).toString().trim();

    // Ha véletlenül üres lenne, legyen Anonymous
    if (ownerName === '') ownerName = 'Anonymous';

    if (!hexRaw) {
      return NextResponse.json({ error: 'Missing Hex code' }, { status: 200 });
    }

    // 3. NORMALIZÁLÁS
    let hexNormalized = hexRaw.toUpperCase();
    if (!hexNormalized.startsWith('#')) {
      hexNormalized = `#${hexNormalized}`;
    }

    if (hexNormalized.length !== 7) {
      return NextResponse.json({ error: 'Invalid Hex format' }, { status: 200 });
    }

    // 4. MENTÉS
    const { error } = await supabase
      .from('sold_colors')
      .insert([
        { 
          hex_code: hexNormalized, 
          owner_name: ownerName, // Itt most már a biztonságos Nickname kerül be
          purchase_price: payload.price_usd || 5
        }
      ]);

    if (error) {
      if (error.code === '23505') {
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
