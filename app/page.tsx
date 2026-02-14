'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Search, Loader2 } from 'lucide-react'

const S_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const S_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
// Az alap termék link (az overlay-hez kell)
const G_LINK = "https://soloflowsystems.gumroad.com/l/zlqosf"; 

const supabase = createClient(S_URL, S_KEY);

export default function HexLandGrab() {
  const [hex, setHex] = useState('')
  const [status, setStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')
  const [recentSales, setRecentSales] = useState<any[]>([])

  useEffect(() => {
    // Gumroad script betöltése dinamikusan
    const script = document.createElement('script');
    script.src = "https://gumroad.com/js/gumroad.js";
    script.async = true;
    document.body.appendChild(script);

    const fetchSales = async () => {
      const { data } = await supabase.from('sold_colors').select('*').order('purchase_price', { ascending: false }).limit(5);
      if (data) setRecentSales(data);
    };
    fetchSales();
  }, []);

  async function checkColor(val: string) {
    const clean = val.replace(/[^0-9A-F]/gi, '').toUpperCase().slice(0, 6);
    setHex(clean);
    if (clean.length !== 6) { setStatus('idle'); return; }
    setStatus('checking');
    const { data } = await supabase.from('sold_colors').select('*').or(`hex_code.eq.${clean},hex_code.eq.#${clean}`).single();
    if (data) { setStatus('taken'); } else { setStatus('available'); }
  }

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff', fontFamily: 'monospace', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      
      <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '10px', textAlign: 'center' }}>
        HEX LAND GRAB <span style={{ fontSize: '1rem', color: '#00ff00' }}>V8 - AUTO</span>
      </h1>
      
      <div style={{ backgroundColor: '#111', padding: '30px', borderRadius: '20px', border: '1px solid #333', width: '100%', maxWidth: '500px' }}>
        <input 
          type="text" value={hex} onChange={(e) => checkColor(e.target.value)}
          placeholder="TYPE 6 CHARS..."
          style={{ width: '100%', backgroundColor: '#000', border: '1px solid #333', padding: '20px', fontSize: '24px', color: '#fff', borderRadius: '12px', textAlign: 'center' }} 
        />

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          {status === 'available' && hex.length === 6 && (
            <div className="animate-in fade-in">
              <p style={{ color: '#4ade80', marginBottom: '15px' }}>✅ #{hex} READY FOR CLAIM</p>
              
              {/* Ez a gomb aktiválja az Overlay-t és küldi el az adatot automatikusan */}
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
                  border: '2px solid #fff' 
                }}
              >
                BUY NOW
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
