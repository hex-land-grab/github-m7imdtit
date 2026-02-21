import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

const S_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const S_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''; 
const GUMROAD_SECRET = process.env.GUMROAD_WEBHOOK_SECRET || '';

const supabase = createClient(S_URL, S_SERVICE_KEY);

// --- 🛡️ ZERO-COST PROFANITÁS ÉS VÉDJEGY SZŰRŐ ---
const BLOCKED_WORDS = [
  'apple', 'google', 'meta', 'facebook', 'ferrari', 'nike', 'amazon', 'tesla',
  'microsoft', 'disney', 'coca-cola', 'pepsi', 'mcdonalds', 'admin', 'root',
  'owner', 'support', 'fuck', 'shit', 'bitch', 'cunt', 'nazi', 'hitler', 'porn'
];

function containsBlockedWord(text: string): boolean {
  const lowerText = text.toLowerCase();
  return BLOCKED_WORDS.some(word => lowerText.includes(word));
}
// -------------------------------------------------

export async function POST(req: Request) {
  try {
    // 1. Kriptográfiai Aláírás és Nyers Adat Beolvasása
    const signature = req.headers.get('x-gumroad-signature');
    const rawBody = await req.text(); // A nyers, érintetlen adatfolyam kell a hash-hez

    if (!signature || !GUMROAD_SECRET) {
      console.warn('🚨 SECURITY ALERT: Missing signature or server secret.');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Hash Ellenőrzés (A Bolondbiztos Pajzs)
    const hash = crypto.createHmac('sha256', GUMROAD_SECRET).update(rawBody).digest('hex');
    
    if (hash !== signature) {
      console.error('🚨 SECURITY ALERT: Webhook spoofing attempt blocked! Invalid signature.');
      return NextResponse.json({ error: 'Unauthorized: Invalid signature' }, { status: 401 });
    }

    // 3. Adat Konvertálása a Nyers Szövegből
    let payload: any;
    const contentType = req.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      payload = JSON.parse(rawBody);
    } else {
      const searchParams = new URLSearchParams(rawBody);
      payload = Object.fromEntries(searchParams);
    }

    console.log('✅ Gumroad Webhook Payload Verified & Received');

    // 4. Adatok Kinyerése
    let hexRaw = (payload['SelectedHex'] || payload['custom_fields[SelectedHex]'] || payload['Hex'] || '').toString().trim();
    let ownerName = (payload['Nickname'] || payload['custom_fields[Nickname]'] || 'Anonymous').toString().trim();
    let city = (payload['City'] || payload['custom_fields[City]'] || payload['Your City'] || payload['custom_fields[Your City]'] || '').toString().trim();

    if (!hexRaw) {
      return NextResponse.json({ error: 'Missing Hex code' }, { status: 400 });
    }

    let hexNormalized = hexRaw.toUpperCase();
    if (!hexNormalized.startsWith('#')) hexNormalized = `#${hexNormalized}`;
    if (hexNormalized.length !== 7) {
      return NextResponse.json({ error: 'Invalid Hex format' }, { status: 400 });
    }

    // 5. Csendes Cenzúra Végrehajtása
    if (containsBlockedWord(ownerName)) {
      console.log(`🚨 MODERATION: Blocked name "${ownerName}"`);
      ownerName = 'Anonymous'; 
    }

    if (containsBlockedWord(city)) {
      console.log(`🚨 MODERATION: Blocked city "${city}"`);
      city = ''; 
    }

    if (ownerName === '') ownerName = 'Anonymous';

    // 6. Mentés az Adatbázisba
    const { error } = await supabase
      .from('sold_colors')
      .insert([
        { 
          hex_code: hexNormalized, 
          owner_name: ownerName,
          city: city
        }
      ]);

    if (error) {
      if (error.code === '23505') {
        console.error('🚨 RACE CONDITION ALERT: Customer paid for an already owned color!', {
            hex: hexNormalized,
            buyer_email: payload.email || 'Unknown Email',
            sale_id: payload.sale_id || 'Unknown Sale'
        });
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
