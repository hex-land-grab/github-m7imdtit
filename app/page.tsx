
'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Search, Loader2 } from 'lucide-react'

// --- KONFIGURÁCIÓ ---
const S_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const S_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const G_LINK = "https://soloflowsystems.gumroad.com/l/zlqosf"; 

const supabase = createClient(S_URL, S_KEY);

export default function HexLandGrab() {
  const [hex, setHex] = useState('')
  const [status, setStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')
  const [recentSales, setRecentSales] = useState<any[]>([])

  // Legutóbbi eladások betöltése
  useEffect(() => {
    const fetchSales = async () => {
      const { data } = await supabase
        .from('sold_colors')
        .select('*')
        .order('purchase_price', { ascending: false })
        .limit(5);
      if (data) setRecentSales(data);
    };
    fetchSales();
  }, []);

  // Színkód ellenőrzése
  async function checkColor(val: string) {
    const clean = val.replace(/[^0-9A-F]/gi, '').toUpperCase().slice(0, 6);
    setHex(clean);

    if (clean.length !== 6) {
      setStatus('idle');
      return;
    }

    setStatus('checking');

    const { data } = await supabase
      .from('sold_colors')
      .select('*')
      .or(`hex_code.eq.${clean},hex_code.eq.#${clean}`)
      .single();

    if (data) {
      setStatus('taken');
    } else {
      setStatus('available');
    }
  }

  // --- VÉGLEGES AUTOMATIZÁLT GOMB ---
  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff', fontFamily: 'monospace', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      
      <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '10px', textAlign: 'center' }}>
        HEX LAND GRAB <span style={{ fontSize: '1rem', color: '#00ff00' }}>V8 - AUTO</span>
      </h1>
      <p style={{ color: '#888', marginBottom: '60px' }}>Own a color. Forever. 🎨</p>

      <div style={{ backgroundColor: '#111', padding: '30px', borderRadius: '20px', border: '1px solid #333', width: '100%', maxWidth: '500px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <Search style={{ position: 'absolute', left: '20px', color: '#666' }} />
          <input 
            type="text" 
            value={hex}
            onChange={(e) => checkColor(e.target.value)}
            placeholder="TYPE 6 CHARS (E.G. FF0000)..."
            style={{ 
              width: '100%', 
              backgroundColor: '#000', 
              border: '1px solid #333', 
              padding: '20px 20px 20px 60px', 
              fontSize: '24px', 
              color: '#fff', 
              borderRadius: '12px',
              outline: 'none',
              letterSpacing: '4px',
              textTransform: 'uppercase'
            }} 
          />
        </div>

        <div style={{ minHeight: '100px', textAlign: 'center' }}>
          {status === 'checking' && (
            <div style={{ color: '#888' }}><Loader2 className="animate-spin" style={{ margin: '0 auto' }} /> Checking...</div>
          )}

          {status === 'available' && hex.length === 6 && (
            <div className="animate-in fade-in">
              <p style={{ color: '#4ade80', marginBottom: '15px', fontWeight: 'bold' }}>
                ✅ #{hex} IS READY FOR CLAIM
              </p>
              {/* Speciális Gumroad Overlay gomb */}
              <a 
                className="gumroad-button"
                href={`${G_LINK}?custom_fields[Hex]=${hex}&wanted=true`}
                data-gumroad-single-product="true"
                style={{ 
                  backgroundColor: `#${hex}`, 
                  color: parseInt(hex, 16) > 0xffffff / 2 ? '#000' : '#fff',
                  padding: '15px 30px', 
                  borderRadius: '10px', 
                  textDecoration: 'none', 
                  fontWeight: 'bold',
                  display: 'inline-block',
                  border: '2px solid #fff',
                  cursor: 'pointer',
                  fontSize: '18px'
                }}
              >
                CLAIM NOW
              </a>
            </div>
          )}

          {status === 'taken' && (
            <div style={{ color: '#ef4444', fontWeight: 'bold' }}>
              🚫 ALREADY OWNED
            </div>
          )}
        </div>
      </div>

      {/* Recent Claims Lista */}
      <div style={{ marginTop: '80px', width: '100%', maxWidth: '600px' }}>
        <h3 style={{ color: '#444', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '20px', textAlign: 'center' }}>
          Recent Claims
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {recentSales.map((sale) => (
            <div key={sale.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', backgroundColor: '#111', borderRadius: '8px', border: '1px solid #222' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ width: '30px', height: '30px', backgroundColor: sale.hex_code.startsWith('#') ? sale.hex_code : `#${sale.hex_code}`, borderRadius: '4px' }}></div>
                <span style={{ fontWeight: 'bold' }}>{sale.hex_code.startsWith('#') ? sale.hex_code : `#${sale.hex_code}`}</span>
              </div>
              <span style={{ color: '#555' }}>{sale.owner_name || 'Anonymous'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
