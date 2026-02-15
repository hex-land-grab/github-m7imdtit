'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Search, Loader2 } from 'lucide-react'

const S_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const S_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const G_LINK = "https://soloflowsystems.gumroad.com/l/zlqosf"; 

const supabase = createClient(S_URL, S_KEY);

export default function HexLandGrab() {
  const [hex, setHex] = useState('')
  const [status, setStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')
  const [recentSales, setRecentSales] = useState<any[]>([])

  useEffect(() => {
    const fetchSales = async () => {
      const { data } = await supabase.from('sold_colors').select('*').order('purchase_price', { ascending: false }).limit(5);
      if (data) setRecentSales(data);
    };
    fetchSales();
  }, []);

  async function checkColor(val: string) {
    // 1. Tisztítás: csak a karakterek maradjanak
    const clean = val.replace(/[^0-9A-F]/gi, '').toUpperCase().slice(0, 6);
    setHex(clean);

    if (clean.length !== 6) { setStatus('idle'); return; }

    setStatus('checking');
    
    // 2. Normalizált keresés: MINDIG keresünk a # jellel, mert az SQL-ben így tettük rendbe
    const normalizedHex = `#${clean}`;
    const { data } = await supabase.from('sold_colors').select('*').eq('hex_code', normalizedHex).single();

    if (data) { setStatus('taken'); } else { setStatus('available'); }
  }

  // 3. Biztonságos Gumroad link összeállítása (Overlay nélkül)
  const getGumroadUrl = () => {
    // A legfrissebb diagnózis alapján: nincs custom_fields[], csak direkt SelectedHex
    const baseUrl = "https://soloflowsystems.gumroad.com/l/zlqosf";
    const params = new URLSearchParams({
      wanted: "true",
      SelectedHex: hex.replace('#', '').toUpperCase() // Biztosítjuk a tiszta 6 karaktert
    });
    
    return `${baseUrl}?${params.toString()}`;
  }
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff', fontFamily: 'monospace', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      
      <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '10px', textAlign: 'center' }}>
        HEX LAND GRAB <span style={{ fontSize: '1rem', color: '#ff00ff' }}>FINAL</span>
      </h1>
      
      <div style={{ backgroundColor: '#111', padding: '30px', borderRadius: '20px', border: '1px solid #333', width: '100%', maxWidth: '500px' }}>
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <Search style={{ position: 'absolute', left: '20px', top: '22px', color: '#666' }} />
          <input 
            type="text" value={hex} onChange={(e) => checkColor(e.target.value)}
            placeholder="TYPE 6 CHARS..."
            style={{ width: '100%', backgroundColor: '#000', border: '1px solid #333', padding: '20px 20px 20px 60px', fontSize: '24px', color: '#fff', borderRadius: '12px', outline: 'none' }} 
          />
        </div>

        <div style={{ minHeight: '100px', textAlign: 'center' }}>
          {status === 'checking' && <Loader2 className="animate-spin" style={{ margin: '0 auto' }} />}
          
          {status === 'available' && hex.length === 6 && (
            <div className="animate-in fade-in">
              <p style={{ color: '#4ade80', marginBottom: '15px' }}>✅ #{hex} IS AVAILABLE!</p>
              <a 
                href={getGumroadUrl()}
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
                CLAIM NOW
              </a>
            </div>
          )}
          {status === 'taken' && <p style={{ color: '#ef4444' }}>🚫 ALREADY OWNED</p>}
        </div>
      </div>
    </div>
  )
}
