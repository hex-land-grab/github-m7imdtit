'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Search, Loader2, Twitter, ExternalLink } from 'lucide-react'

const S_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const S_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const G_LINK = "https://soloflowsystems.gumroad.com/l/zlqosf"; 

const supabase = createClient(S_URL, S_KEY);

export default function HexLandGrab() {
  const [hex, setHex] = useState('')
  const [status, setStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')
  const [recentSales, setRecentSales] = useState<any[]>([])

  // Valós idejű frissítés: ha valaki vásárol, azonnal megjelenik
  useEffect(() => {
    const fetchSales = async () => {
      const { data } = await supabase.from('sold_colors').select('*').order('created_at', { ascending: false }).limit(12);
      if (data) setRecentSales(data);
    };

    fetchSales();

    // Feliratkozás az új vásárlásokra (Realtime)
    const channel = supabase
      .channel('realtime_sales')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sold_colors' }, (payload) => {
        setRecentSales((prev) => [payload.new, ...prev.slice(0, 11)]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); }
  }, []);

  async function checkColor(val: string) {
    const clean = val.replace(/[^0-9A-F]/gi, '').toUpperCase().slice(0, 6);
    setHex(clean);

    if (clean.length !== 6) { setStatus('idle'); return; }

    setStatus('checking');
    
    const normalizedHex = `#${clean}`;
    const { data } = await supabase.from('sold_colors').select('*').eq('hex_code', normalizedHex).single();

    if (data) { setStatus('taken'); } else { setStatus('available'); }
  }

  const getGumroadUrl = () => {
    const params = new URLSearchParams({
      wanted: "true",
      SelectedHex: hex.replace('#', '').toUpperCase()
    });
    return `${G_LINK}?${params.toString()}`;
  }

  const shareOnX = () => {
    const text = `I just found that #${hex} is AVAILABLE on Hex Land Grab! Who's gonna own it?`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent('https://hex-land-grab.vercel.app')}`; // Cseréld majd a saját domainedre!
    window.open(url, '_blank');
  }

  return (
    <div style={{ backgroundColor: '#050505', minHeight: '100vh', color: '#e0e0e0', fontFamily: '"Courier New", monospace', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px' }}>
      
      {/* HEADER */}
      <h1 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '10px', textAlign: 'center', letterSpacing: '-2px', textShadow: '0 0 20px rgba(255, 0, 255, 0.3)' }}>
        HEX <span style={{ color: '#333' }}>//</span> LAND <span style={{ color: '#333' }}>//</span> GRAB
      </h1>
      <p style={{ color: '#666', marginBottom: '40px', fontSize: '14px' }}>OWN A COLOR. FOREVER.</p>
      
      {/* MAIN CARD */}
      <div style={{ backgroundColor: '#111', padding: '40px', borderRadius: '24px', border: '1px solid #222', width: '100%', maxWidth: '480px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
        <div style={{ position: 'relative', marginBottom: '30px' }}>
          <Search style={{ position: 'absolute', left: '20px', top: '22px', color: '#444' }} />
          <input 
            type="text" value={hex} onChange={(e) => checkColor(e.target.value)}
            placeholder="TYPE HEX (e.g. FF0055)"
            style={{ 
              width: '100%', backgroundColor: '#0a0a0a', border: `2px solid ${status === 'available' ? '#4ade80' : '#333'}`, 
              padding: '20px 20px 20px 60px', fontSize: '24px', color: '#fff', borderRadius: '16px', outline: 'none',
              transition: 'all 0.3s ease',
              boxShadow: status === 'available' ? `0 0 30px ${`#${hex}40`}` : 'none'
            }} 
          />
        </div>

        <div style={{ minHeight: '120px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {status === 'checking' && <Loader2 className="animate-spin" style={{ color: '#666' }} />}
          
          {status === 'available' && hex.length === 6 && (
            <div className="animate-in fade-in zoom-in duration-300">
              <div style={{ width: '100%', height: '80px', backgroundColor: `#${hex}`, borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 40px #${hex}60` }}>
                 <span style={{ color: parseInt(hex, 16) > 0xffffff / 2 ? '#000' : '#fff', fontWeight: 'bold', fontSize: '20px' }}>#{hex}</span>
              </div>
              
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <a 
                  href={getGumroadUrl()}
                  style={{ backgroundColor: '#fff', color: '#000', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  CLAIM FOR $5 <ExternalLink size={16}/>
                </a>
                <button 
                  onClick={shareOnX}
                  style={{ backgroundColor: '#1DA1F2', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', color: '#fff' }}
                >
                  <Twitter size={20} />
                </button>
              </div>
            </div>
          )}

          {status === 'taken' && (
            <div style={{ color: '#ef4444', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '40px', marginBottom: '10px' }}>🔒</span>
              <p style={{ fontWeight: 'bold' }}>ALREADY OWNED</p>
              <p style={{ fontSize: '12px', color: '#666' }}>Try another combination.</p>
            </div>
          )}
        </div>
      </div>

      {/* RECENT GRID */}
      <div style={{ marginTop: '80px', width: '100%', maxWidth: '800px' }}>
        <h3 style={{ color: '#444', fontSize: '12px', textAlign: 'center', marginBottom: '30px', letterSpacing: '2px' }}>RECENTLY SEIZED TERRITORIES</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '15px' }}>
          {recentSales.map((sale) => (
            <div key={sale.id} className="group" style={{ position: 'relative' }}>
              <div style={{ 
                aspectRatio: '1/1', 
                backgroundColor: sale.hex_code.startsWith('#') ? sale.hex_code : `#${sale.hex_code}`, 
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
              }}
              title={`Owned by: ${sale.owner_name}`}
              >
                <span style={{ 
                  color: '#fff', fontSize: '10px', fontWeight: 'bold', 
                  backgroundColor: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: '4px',
                  opacity: 0, transition: 'opacity 0.2s' 
                }}
                className="group-hover:opacity-100"
                >
                  {sale.hex_code}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
