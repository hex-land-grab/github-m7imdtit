import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const S_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
// KORREKCIÓ 1: Itt a Mesterkulcsot (Service Role Key) használjuk, ami átüti az RLS biztonsági pajzsot!
const S_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''; 
const supabase = createClient(S_URL, S_SERVICE_KEY);

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

    console.log('Gumroad Webhook Payload Received');

    // 1. HEX KINYERÉSE
    let hexRaw = (
      payload['SelectedHex'] || 
      payload['custom_fields[SelectedHex]'] || 
      payload['Hex'] || 
      ''
    ).toString().trim();

    // 2. NÉV KINYERÉSE
    let ownerName = (
        payload['Nickname'] || 
        payload['custom_fields[Nickname]'] || 
        'Anonymous'
    ).toString().trim();

    if (ownerName === '') ownerName = 'Anonymous';

    // 3. VÁROS KINYERÉSE
    let city = (
        payload['City'] || 
        payload['custom_fields[City]'] || 
        payload['Your City'] || 
        payload['custom_fields[Your City]'] || 
        ''
    ).toString().trim();

    if (!hexRaw) {
      return NextResponse.json({ error: 'Missing Hex code' }, { status: 400 });
    }

    // 4. NORMALIZÁLÁS
    let hexNormalized = hexRaw.toUpperCase();
    if (!hexNormalized.startsWith('#')) {
      hexNormalized = `#${hexNormalized}`;
    }

    if (hexNormalized.length !== 7) {
      return NextResponse.json({ error: 'Invalid Hex format' }, { status: 400 });
    }

    // 5. MENTÉS A MESTERKULCCSAL
    const { error } = await supabase
      .from('sold_colors')
      .insert([
        { 
          hex_code: hexNormalized, 
          owner_name: ownerName,
          city: city,
          // Ha lenne ilyen oszlopod: purchase_price: payload.price_usd || 5
        }
      ]);

    // KORREKCIÓ 2: Race Condition (Dupla fizetés) kezelése
    if (error) {
      if (error.code === '23505') {
        // VÉSZJELZÉS A LOGBA! Ezt látni fogod a Vercel-ben, és tudod, kinek kell Refund-ot adni.
        console.error('🚨 RACE CONDITION ALERT: Customer paid for an already owned color!', {
            hex: hexNormalized,
            buyer_email: payload.email || 'Unknown Email',
            sale_id: payload.sale_id || 'Unknown Sale'
        });
        
        // 200-at küldünk, hogy a Gumroad ne próbálkozzon végtelen ciklusban újra, 
        // de az adatait elmentettük a logba a visszatérítéshez.
        return NextResponse.json({ status: 'already_owned_refund_required' }, { status: 200 });
      }
      throw error;
    }

    return NextResponse.json({ status: 'success', hex: hexNormalized }, { status: 200 });

  } catch (err: any) {
    console.error('Webhook Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
