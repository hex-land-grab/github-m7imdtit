import { NextResponse } from 'next/server';

// 1. Architektúrális utasítások a Vercelnek: Nincs cache, és Edge szerveren fusson
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ status: 'error', message: 'Hiányzó környezeti változók.' }, { status: 500 });
  }

  try {
    // 2. Natív Fetch ping a Supabase REST API-jára (nincs nehézkes klienskönyvtár)
    const res = await fetch(`${supabaseUrl}/rest/v1/sold_colors?select=hex_code&limit=1`, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      throw new Error(`Hálózati hiba: ${res.status}`);
    }

    // 3. Sikeres válasz
    return NextResponse.json({ status: 'awake', time: new Date().toISOString() }, { status: 200 });
    
  } catch (error) {
    return NextResponse.json({ status: 'error', message: String(error) }, { status: 500 });
  }
}
