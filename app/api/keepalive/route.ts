import { NextResponse } from 'next/server';

// ZÉRÓ Vercel direktíva (nincs dynamic, nincs edge).
// A varázslat a "(request: Request)" paraméterben van, ami kikényszeríti a valós idejű futást.
export async function GET(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ status: 'error', message: 'Hiányzó környezeti változók.' }, { status: 500 });
  }

  try {
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

    return NextResponse.json({ status: 'awake', time: new Date().toISOString() }, { status: 200 });
    
  } catch (error) {
    return NextResponse.json({ status: 'error', message: String(error) }, { status: 500 });
  }
}
