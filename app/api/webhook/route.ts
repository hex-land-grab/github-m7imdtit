import { NextResponse } from 'next/server'
import { supabase } from '../../supabase'

export async function POST(req: Request) {
  try {
    // Megpróbáljuk JSON-ként olvasni, ha az nem megy, akkor FormData-ként
    let data;
    const contentType = req.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      data = await req.json();
    } else {
      const formData = await req.formData();
      data = Object.fromEntries(formData.entries());
    }

    // Gumroad specifikus mezők keresése
    const hex = data['custom_fields[Hex Code]'] || data.hex_code;
    const email = data.email;
    const name = data.full_name || 'Ismeretlen';

    if (!hex) {
      console.log('Nincs hex kód az üzenetben');
      return NextResponse.json({ message: 'Nincs hex, de az üzenet megjött' });
    }

    const cleanHex = hex.replace(/[^0-9A-F]/gi, '').toUpperCase();

    const { error } = await supabase
      .from('sold_colors')
      .insert([{
        hex_code: cleanHex,
        owner_email: email,
        owner_name: name
      }]);

    if (error) throw error;

    return NextResponse.json({ message: 'Sikeres mentés!' });
  } catch (err: any) {
    console.error('Hiba:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}