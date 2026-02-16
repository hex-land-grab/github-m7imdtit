'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Search, Loader2, Twitter, ExternalLink, Zap } from 'lucide-react'

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
      // 18-ra emeltem a limitet, hogy jobban mutasson a szélesebb gridben
      const { data } = await supabase.from('sold_colors').select('*').order('created_at', { ascending: false }).limit(18);
      if (data) setRecentSales(data);
    };

    fetchSales();

    const channel = supabase
      .channel('realtime_sales')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sold_colors' }, (payload) => {
        setRecentSales((prev) => [payload.new, ...prev.slice(0, 17)]);
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
    // Itt majd cseréld le a saját domainedre, ha meglesz!
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent('https://hex-land-grab.vercel.app')}`; 
    window.open(url, '_blank');
  }

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', // Kék-Lila mély átmenet
      minHeight: '100vh', 
      color: '#fff', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', // Modern font
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      padding: '60px 20px' 
    }}>
      
      {/* HERO SECTION */}
      <div style={{ textAlign: 'center', marginBottom: '50px', maxWidth: '800px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', backgroundColor: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '30px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.2)' }}>
          <Zap size={16} fill="#FFD700" color="#FFD700" />
          <span style={{ fontSize: '14px', fontWeight: '500', color: '#e2e8f0' }}>V10 Update: Real-time Ownership</span>
        </div>
        
        <h1 style={{ 
          fontSize: '4rem', 
          fontWeight: '800', 
          marginBottom: '10px', 
          letterSpacing: '-2px',
          background: 'linear-gradient(to right, #fff 20%, #a5b4fc 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: '1.1'
        }}>
          Hex Land Grab
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
          Az internet minden színe eladó. Egyszer. Egy embernek. <br/>
          <span style={{ color: '#fff' }}>Birtokold a tiédet örökre.</span>
        </p>
      </div>
      
      {/* MAIN INTERACTION CARD - GLASS EFFECT */}
      <div style={{ 
        backdropFilter: 'blur(20px)',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '40px', 
        borderRadius: '32px', 
        width: '100%', 
        maxWidth: '550px', 
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ position: 'relative', marginBottom: '30px' }}>
          <Search style={{ position: 'absolute', left: '24px', top: '24px', color: '#94a3b8', width: '24px', height: '24px' }} />
          <input 
            type="text" value={hex} onChange={(e) => checkColor(e.target.value)}
            placeholder="Keresés (pl. FF0055)"
            style={{ 
              width: '100%', 
              backgroundColor: 'rgba(0,0,0,0.2)', 
              border: `2px solid ${status === 'available' ? '#4ade80' : 'rgba(255,255,255,0.1)'}`, 
              padding: '20px 20px 20px 64px', 
              fontSize: '24px', 
              color: '#fff', 
              borderRadius: '20px', 
              outline: 'none',
              transition: 'all 0.3s ease',
              fontWeight: '600',
              letterSpacing: '2px'
            }} 
          />
        </div>

        <div style={{ minHeight: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {status === 'idle' && <p style={{ color: '#64748b' }}>Írj be 6 karaktert a kereséshez.</p>}
          {status === 'checking' && <Loader2 className="animate-spin" style={{ color: '#fff', width: '32px', height: '32px' }} />}
          
          {status === 'available' && hex.length === 6 && (
            <div className="animate-in fade-in zoom-in duration-300 w-full" style={{ width: '100%' }}>
              <div style={{ 
                width: '100%', 
                height: '100px', 
                backgroundColor: `#${hex}`, 
                borderRadius: '16px', 
                marginBottom: '24px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                boxShadow: `0 10px 30px -10px #${hex}`,
                border: '4px solid rgba(255,255,255,0.1)'
              }}>
                 <span style={{ 
                   color: parseInt(hex, 16) > 0xffffff / 2 ? '#000' : '#fff', 
                   fontWeight: '800', 
                   fontSize: '28px',
                   letterSpacing: '2px'
                 }}>#{hex}</span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px' }}>
                <a 
                  href={getGumroadUrl()}
                  style={{ 
                    backgroundColor: '#fff', 
                    color: '#000', 
                    padding: '16px', 
                    borderRadius: '16px', 
                    textDecoration: 'none', 
                    fontWeight: '800', 
                    fontSize: '18px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '8px',
                    transition: 'transform 0.2s',
                    boxShadow: '0 0 20px rgba(255,255,255,0.3)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  MEGVESZEM ($5) <ExternalLink size={20}/>
                </a>
                <button 
                  onClick={shareOnX}
                  style={{ 
                    backgroundColor: 'rgba(29, 161, 242, 0.15)', 
                    border: '1px solid rgba(29, 161, 242, 0.5)', 
                    padding: '0 20px', 
                    borderRadius: '16px', 
                    cursor: 'pointer', 
                    color: '#1DA1F2',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                  title="Share on X"
                >
                  <Twitter size={24} />
                </button>
              </div>
            </div>
          )}

          {status === 'taken' && (
            <div style={{ color: '#f87171', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '20px', borderRadius: '16px', width: '100%' }}>
              <span style={{ fontSize: '32px', marginBottom: '8px' }}>🔒</span>
              <p style={{ fontWeight: '800', fontSize: '18px' }}>MÁR FOGLALT</p>
              <p style={{ fontSize: '14px', color: '#fca5a5', marginTop: '4px' }}>Ez a szín már valaki másé.</p>
            </div>
          )}
        </div>
      </div>

      {/* WIDE GRID SECTION */}
      <div style={{ marginTop: '100px', width: '100%', maxWidth: '1200px', padding: '0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>
          <h3 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 'bold' }}>Friss Foglalások</h3>
          <span style={{ color: '#94a3b8' }}>Live Feed • {recentSales.length} db</span>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', 
          gap: '20px' 
        }}>
          {recentSales.map((sale) => (
            <div key={sale.id} className="group" style={{ position: 'relative', transition: 'transform 0.2s' }}>
              <div style={{ 
                aspectRatio: '1/1', 
                backgroundColor: sale.hex_code.startsWith('#') ? sale.hex_code : `#${sale.hex_code}`, 
                borderRadius: '20px',
                cursor: 'default',
                display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
                padding: '10px',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <div style={{ 
                  backgroundColor: 'rgba(0,0,0,0.6)', 
                  backdropFilter: 'blur(4px)',
                  padding: '6px 12px', 
                  borderRadius: '10px',
                  color: '#fff', 
                  fontSize: '12px', 
                  fontWeight: 'bold',
                  letterSpacing: '1px'
                }}>
                  {sale.hex_code}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
