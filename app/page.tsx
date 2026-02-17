'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Search, Loader2, Twitter, ExternalLink, Tag, Shuffle, Globe, Info, Trophy } from 'lucide-react'

// Környezeti változók
const S_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const S_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const G_LINK = "https://soloflowsystems.gumroad.com/l/zlqosf"; 

const supabase = createClient(S_URL, S_KEY);

export default function OwnAColor() {
  const [hex, setHex] = useState('')
  const [status, setStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')
  const [recentSales, setRecentSales] = useState<any[]>([])
  const [totalCount, setTotalCount] = useState<number>(0) // ÚJ: Számláló
  
  useEffect(() => {
    // 1. Lekérjük az utolsó 100 eladást a Gridhez (többet mutatunk)
    const fetchSales = async () => {
      const { data, count } = await supabase
        .from('sold_colors')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(50); // Több elem a rácshoz
      
      if (data) setRecentSales(data);
      if (count !== null) setTotalCount(count);
    };

    fetchSales();

    // 2. Realtime feliratkozás
    const channel = supabase
      .channel('realtime_sales')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sold_colors' }, (payload) => {
        setRecentSales((prev) => [payload.new, ...prev.slice(0, 49)]);
        setTotalCount((prev) => prev + 1); // Számláló növelése
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); }
  }, []);

  const generateRandomColor = () => {
    const randomHex = Math.floor(Math.random()*16777215).toString(16).toUpperCase().padStart(6, '0');
    setHex(randomHex);
    checkColor(randomHex);
  }

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
      SelectedHex: hex.replace('#', '').toUpperCase()
    });
    return `${G_LINK}?${params.toString()}`;
  }

  const shareOnX = () => {
    const text = `I just found that #${hex} is AVAILABLE on Own a Color! Who's gonna own it?`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent('https://own-a-color.vercel.app')}`; 
    window.open(url, '_blank');
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      color: '#fff', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      padding: '60px 20px',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      
      {/* HÁTTÉR */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: -2,
        background: 'linear-gradient(-45deg, #0f172a, #1e293b, #0f172a)', // Sötétebb, elegánsabb háttér
        backgroundSize: '400% 400%',
      }} />

      {/* DYNAMIC GLOW */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: -1,
        background: hex.length === 6 ? `radial-gradient(circle at center, #${hex}40, transparent 70%)` : 'transparent',
        transition: 'background 0.5s ease'
      }} />

      {/* HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '50px', maxWidth: '800px', zIndex: 10 }}>
        <h1 style={{ 
          fontSize: '4.5rem', fontWeight: '900', marginBottom: '10px', marginTop: '20px', letterSpacing: '-2px', lineHeight: '1',
          background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          OWN A COLOR
        </h1>
        
        <p style={{ fontSize: '1.2rem', color: '#94a3b8', maxWidth: '640px', margin: '0 auto 20px auto', lineHeight: '1.6' }}>
          The Global Registry. <span style={{ color: '#fff', fontWeight: '700' }}>16 Million Colors.</span> One Owner Each.
        </p>

        {/* ÚJ: STATISZTIKA SÁV */}
        <div style={{ display: 'inline-flex', gap: '24px', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', padding: '10px 24px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
             <Trophy size={16} color="#fbbf24" />
             <span style={{ fontWeight: '700', fontSize: '14px' }}>{totalCount > 0 ? `${totalCount} Colors Claimed` : 'Registry Open'}</span>
          </div>
          <div style={{ width: '1px', height: '16px', backgroundColor: 'rgba(255,255,255,0.2)' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
             <Tag size={16} color="#4ade80" />
             <span style={{ fontWeight: '700', fontSize: '14px', color: '#4ade80' }}>$5 Entry Price</span>
          </div>
        </div>
      </div>
      
      {/* MAIN INTERACTION CARD */}
      <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '40px', borderRadius: '24px', width: '100%', maxWidth: '550px', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)', marginBottom: '80px', zIndex: 10 }}>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
          <div style={{ position: 'relative', flexGrow: 1 }}>
            <Search style={{ position: 'absolute', left: '16px', top: '16px', color: '#64748b', width: '20px', height: '20px' }} />
            <input type="text" value={hex} onChange={(e) => checkColor(e.target.value)} placeholder="Try FF0055..."
              style={{ width: '100%', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', padding: '14px 14px 14px 48px', fontSize: '18px', color: '#fff', borderRadius: '12px', outline: 'none', fontFamily: 'monospace', textTransform: 'uppercase' }} 
            />
          </div>
          <button onClick={generateRandomColor} style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', width: '54px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Shuffle size={20} color="#94a3b8" />
          </button>
        </div>

        <div style={{ minHeight: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {status === 'idle' && <p style={{ color: '#64748b', fontSize: '14px' }}>Search specifically or shuffle randomly.</p>}
          {status === 'checking' && <Loader2 className="animate-spin" style={{ color: '#fff' }} />}
          
          {status === 'available' && hex.length === 6 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 w-full">
              {/* PREVIEW KÁRTYA */}
              <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '6px', marginBottom: '20px', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.3)' }}>
                 <div style={{ backgroundColor: `#${hex}`, borderRadius: '12px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <span style={{ color: parseInt(hex, 16) > 0xffffff / 2 ? '#000' : '#fff', fontWeight: '900', fontSize: '28px', letterSpacing: '2px' }}>#{hex}</span>
                    <span style={{ color: parseInt(hex, 16) > 0xffffff / 2 ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)', fontSize: '10px', marginTop: '4px', textTransform: 'uppercase', fontWeight: '700' }}>Available to Claim</span>
                 </div>
              </div>
              
              <a href={getGumroadUrl()} style={{ background: '#3b82f6', color: '#fff', padding: '16px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', marginBottom: '12px', transition: 'background 0.2s' }}
                 onMouseOver={(e) => e.currentTarget.style.background = '#2563eb'} onMouseOut={(e) => e.currentTarget.style.background = '#3b82f6'}>
                 Claim for $5 <ExternalLink size={16}/>
              </a>
              <p style={{ textAlign: 'center', fontSize: '11px', color: '#64748b' }}>Includes entry on the Global Ledger forever.</p>
            </div>
          )}

          {status === 'taken' && (
             <div style={{ textAlign: 'center', width: '100%', padding: '20px', border: '1px dashed #ef4444', borderRadius: '12px', backgroundColor: 'rgba(239,68,68,0.05)' }}>
                <p style={{ color: '#ef4444', fontWeight: '700', marginBottom: '4px' }}>ALREADY CLAIMED</p>
                <p style={{ color: '#94a3b8', fontSize: '13px' }}>This color belongs to someone else.</p>
             </div>
          )}
        </div>
      </div>

      {/* --- ÚJ: VISUAL GRID LEDGER (Galéria) --- */}
      <div style={{ width: '100%', maxWidth: '1000px', marginBottom: '60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', padding: '0 20px' }}>
          <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: '800' }}>LATEST CLAIMS</h3>
          <span style={{ color: '#4ade80', fontSize: '11px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', backgroundColor: '#4ade80', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 10px #4ade80' }}></span>
            LIVE
          </span>
        </div>
        
        {/* CSS GRID LAYOUT */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', // Reszponzív rács
          gap: '16px', 
          padding: '0 20px' 
        }}>
          {recentSales.map((sale) => (
            <div key={sale.id} className="group" style={{ position: 'relative' }}>
              {/* Szín Kártya */}
              <div style={{ 
                backgroundColor: 'rgba(30, 41, 59, 0.5)', 
                border: '1px solid rgba(255,255,255,0.05)', 
                borderRadius: '16px', 
                overflow: 'hidden',
                transition: 'transform 0.2s',
                cursor: 'default'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ 
                  height: '100px', 
                  backgroundColor: sale.hex_code.startsWith('#') ? sale.hex_code : `#${sale.hex_code}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                   {/* Csak hoverre mutatja a hexet ha akarjuk, vagy mindig - most legyen tiszta */}
                </div>
                <div style={{ padding: '12px' }}>
                  <p style={{ color: '#fff', fontSize: '14px', fontWeight: '700', fontFamily: 'monospace', marginBottom: '4px' }}>
                    {sale.hex_code.startsWith('#') ? sale.hex_code : `#${sale.hex_code}`}
                  </p>
                  <p style={{ color: '#94a3b8', fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {sale.owner_name || 'Anonymous'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ marginTop: 'auto', width: '100%', textAlign: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '48px', paddingBottom: '48px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 16px' }}>
           <p style={{ color: '#64748b', fontSize: '11px', lineHeight: '1.6', maxWidth: '500px', margin: '0 auto 24px auto' }}>
            DISCLAIMER: "Ownership" refers to a permanent entry in the Own a Color Registry database. 
            This service acts as a digital collectible registry and does not confer legal IP rights.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', fontSize: '12px', fontWeight: '600', color: '#475569' }}>
            <a href="/terms" style={{ textDecoration: 'none', color: 'inherit' }}>TERMS</a>
            <a href="/privacy" style={{ textDecoration: 'none', color: 'inherit' }}>PRIVACY</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
