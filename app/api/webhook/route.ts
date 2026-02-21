import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const S_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const S_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''; 
const GUMROAD_TOKEN = process.env.GUMROAD_WEBHOOK_SECRET || '';

const supabase = createClient(S_URL, S_SERVICE_KEY);

const BLOCKED_WORDS = [
  'apple', 'google', 'meta', 'facebook', 'ferrari', 'nike', 'amazon', 'tesla',
  'microsoft', 'disney', 'coca-cola', 'pepsi', 'mcdonalds', 'admin', 'root',
  'owner', 'support', 'fuck', 'shit', 'bitch', 'cunt', 'nazi', 'hitler', 'porn'
];

function containsBlockedWord(text: string): boolean {
  const lowerText = text.toLowerCase();
  return BLOCKED_WORDS.some(word => lowerText.includes(word));
}

export async function POST(req: Request) {
  try {
    // --- 🛡️ GOLYÓÁLLÓ URL TOKEN VÉDELEM ---
    const url = new URL(req.url);
    const incomingToken = url.searchParams.get('token');

    if (!incomingToken || incomingToken !== GUMROAD_TOKEN || !GUMROAD_TOKEN) {
      console.error('🚨 SECURITY ALERT: Unauthorized webhook attempt blocked!');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // ----------------------------------------

    let payload: any;
    const contentType = req.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      payload = await req.json();
    } else {
      const formData = await req.formData();
      payload = Object.fromEntries(formData);
    }

    console.log('✅ Gumroad Webhook Payload Verified & Received');

    let hexRaw = (payload['SelectedHex'] || payload['custom_fields[SelectedHex]'] || payload['Hex'] || '').toString().trim();
    let ownerName = (payload['Nickname'] || payload['custom_fields[Nickname]'] || 'Anonymous').toString().trim();
    let city = (payload['City'] || payload['custom_fields[City]'] || payload['Your City'] || payload['custom_fields[Your City]'] || '').toString().trim();
    
    // ÚJ: Kinyerjük a Gumroad egyedi tranzakció azonosítóját a duplikációk szűréséhez
    let saleId = (payload['sale_id'] || '').toString().trim();

    // Teszt ping esetén előfordulhat, hogy nincs hex, ezt kezeljük
    if (!hexRaw && payload['test']) {
        return NextResponse.json({ status: 'success', message: 'Test ping received' }, { status: 200 });
    }

    if (!hexRaw) {
      return NextResponse.json({ error: 'Missing Hex code' }, { status: 400 });
    }

    let hexNormalized = hexRaw.toUpperCase();
    if (!hexNormalized.startsWith('#')) hexNormalized = `#${hexNormalized}`;
    if (hexNormalized.length !== 7) {
      return NextResponse.json({ error: 'Invalid Hex format' }, { status: 400 });
    }

    // --- 🛡️ ÚJ: IDEMPOTENCIA (Dupla hívás) ELLENŐRZÉS ---
    if (saleId) {
      const { error: ledgerError } = await supabase
        .from('webhook_events')
        .insert([{ sale_id: saleId, hex_code: hexNormalized }]);

      if (ledgerError) {
        // A 23505 a "Már létezik" (Unique Violation) hiba a Postgres-ben
        if (ledgerError.code === '23505') {
          console.log(`✅ IDEMPOTENCY: Webhook for sale ${saleId} already processed. Skipping duplicate.`);
          // Csendben "Sikeresnek" hazudjuk magunkat a Gumroad felé, így nem próbálkozik tovább
          return NextResponse.json({ status: 'success', message: 'Already processed' }, { status: 200 });
        }
        throw ledgerError; // Ha más kritikus hiba van, azt eldobjuk
      }
    }
    // ---------------------------------------------------

    if (containsBlockedWord(ownerName)) {
      console.log(`🚨 MODERATION: Blocked name "${ownerName}"`);
      ownerName = 'Anonymous'; 
    }

    if (containsBlockedWord(city)) {
      console.log(`🚨 MODERATION: Blocked city "${city}"`);
      city = ''; 
    }

    if (ownerName === '') ownerName = 'Anonymous';

    const { error } = await supabase
      .from('sold_colors')
      .insert([{ hex_code: hexNormalized, owner_name: ownerName, city: city }]);

    if (error) {
      if (error.code === '23505') {
        // Ez már csak akkor fog lefutni, ha tényleg 2 KÜLÖNBÖZŐ vásárlás (más sale_id) fut be ugyanarra a színre!
        console.error('🚨 RACE CONDITION ALERT: Customer paid for an already owned color!', { hex: hexNormalized, sale_id: saleId });
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
