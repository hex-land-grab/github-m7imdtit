import { ImageResponse } from 'next/og'
import { createClient } from '@supabase/supabase-js'

// A Vercel Edge hálózatán futtatjuk, hogy villámgyors legyen
export const runtime = 'edge'
export const alt = 'Own a Color Registry Certificate'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: { hex: string } }) {
  const hex = params.hex.toUpperCase()
  const hexCode = `#${hex}`
  
  // Supabase DB check
  const S_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const S_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const supabase = createClient(S_URL, S_KEY);
  
  const { data } = await supabase
    .from('sold_colors')
    .select('*')
    .eq('hex_code', hexCode)
    .maybeSingle();

  const isOwned = !!data;
  const ownerName = data?.owner_name || '';

  // Kiszámoljuk, hogy a szín sötét vagy világos, hogy a szöveg jól olvasható legyen
  const hexNum = parseInt(hex, 16);
  const isLight = hexNum > 0xffffff / 2;
  const textColor = isLight ? '#000000' : '#ffffff';

  return new ImageResponse(
    (
      <div
        style={{
          background: '#050505',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          border: `24px solid ${hexCode}`,
        }}
      >
        {/* Hatalmas Színblokk Középen */}
        <div 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            background: hexCode, 
            padding: '60px 120px', 
            borderRadius: '48px', 
            boxShadow: '0 30px 60px rgba(0,0,0,0.8)' 
          }}
        >
          <h1 style={{ fontSize: '130px', fontWeight: '900', color: textColor, margin: 0, letterSpacing: '-4px' }}>
            {hexCode}
          </h1>
        </div>
        
        {/* Tulajdonosi Információ Alatta */}
        <div style={{ display: 'flex', marginTop: '60px', fontSize: '48px', color: '#ffffff', fontWeight: 'bold', letterSpacing: '2px' }}>
          {isOwned ? `OWNED BY: ${ownerName.toUpperCase()}` : 'AVAILABLE TO CLAIM'}
        </div>
        
        {/* Weboldal URL */}
        <div style={{ display: 'flex', marginTop: '20px', fontSize: '28px', color: '#64748b', fontWeight: 'bold' }}>
          own-a-color.vercel.app
        </div>
      </div>
    ),
    { ...size }
  )
}
