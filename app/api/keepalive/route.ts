import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  // 1. Supabase kliens felébresztése a meglévő környezeti változóidból
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const supabase = createClient(supabaseUrl, supabaseKey);

  // 2. Mikroszkopikus ping az adatbázis felé (1 db sor lekérése)
  // CSERÉLD KI a 'registry' szót a saját adatbázis-táblád nevére (pl. 'colors' vagy 'claims')!
  const { data, error } = await supabase.from('registry').select('id').limit(1);

  if (error) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }

  // 3. Sikeres "Ébren vagyok" válasz a hálózatnak
  return NextResponse.json({ status: 'awake', time: new Date().toISOString() }, { status: 200 });
}
