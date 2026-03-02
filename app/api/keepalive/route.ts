import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// KÖTELEZŐ: Megakadályozza a Vercel telepítéskori összeomlását és a lekérdezés cache-elését
export const dynamic = 'force-dynamic';

export async function GET() {
  // 1. Supabase kliens felébresztése
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const supabase = createClient(supabaseUrl, supabaseKey);

  // 2. Mikroszkopikus ping a saját 'sold_colors' táblád felé
  const { data, error } = await supabase.from('sold_colors').select('hex_code').limit(1);

  if (error) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }

  // 3. Sikeres "Ébren vagyok" válasz a hálózatnak
  return NextResponse.json({ status: 'awake', time: new Date().toISOString() }, { status: 200 });
}
