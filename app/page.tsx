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
      // 20-ra állítottam a limitet a lista miatt
      const { data } = await supabase.from('sold_colors').select('*').order('created_at', { ascending: false }).limit(20);
      if (data) setRecentSales(data);
    };

    fetchSales();

    const channel = supabase
      .channel('realtime_sales')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sold_colors' }, (payload) => {
        setRecentSales((prev) => [payload.new, ...prev.slice(0, 19)]);
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
      // TÖRÖLTÜK A "wanted: true" sort!
      // wanted: "true",  <-- Ez volt a gyorsvásárlás, most kivettük.
      
      // A Hex kód továbbra is átmegy, ez nagyon fontos!
      SelectedHex: hex.replace('#', '').toUpperCase()
    });
    return `${G_LINK}?${params.toString()}`;
  }

  const shareOnX = () => {
    const text = `I just found that #${hex} is AVAILABLE on Hex Land Grab! Who's gonna own it?`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent('https://hex-land-grab.vercel.app')}`; 
    window.open(url, '_blank');
  }

  // Segédfüggvény a dátum formázásához
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  return (
    <div style={{ 
      background: 'radial-gradient(circle at 50% -20%, #111827, #000000)', 
      minHeight: '100vh', 
      color: '#fff', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      padding: '60px 20px',
    }}>
      
      {/* HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '50px', maxWidth: '800px', zIndex: 10 }}>
        <div style={{ 
          display: 'inline-flex', alignItems: 'center', gap: '8px', 
          backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
          color: '#e2e8f0', padding: '6px 16px', borderRadius: '20px', marginBottom: '24px', 
          fontSize: '13px', fontWeight: '500', backdropFilter: 'blur(5px)'
        }}>
          <Zap size={14} fill="#fbbf24" color="#fbbf24" /> V14: Ownership Ledger
        </div>
        
        <h1 style={{ 
          fontSize: '4.5rem', 
          fontWeight: '900', 
          marginBottom: '20px', 
          letterSpacing: '-2px',
          lineHeight: '1',
          textShadow: '0 0 40px rgba(255,255,255,0.1)'
        }}>
          HEX LAND GRAB
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#cbd5e1', maxWidth: '580px', margin: '0 auto', lineHeight: '1.6' }}>
          Own a color. <span style={{ color: '#fff', borderBottom: '2px solid #fff' }}>Forever.</span>
        </p>
      </div>
      
      {/* MAIN CARD */}
      <div style={{ 
        backgroundColor: '#1f2937', 
        border: '1px solid rgba(255, 255, 255, 0.1)', 
        padding: '40px', 
        borderRadius: '32px', 
        width: '100%', 
        maxWidth: '550px', 
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', 
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ position: 'relative', marginBottom: '30px' }}>
          <Search style={{ position: 'absolute', left: '24px', top: '24px', color: '#94a3b8', width: '24px', height: '24px' }} />
          <input 
            type="text" value={hex} onChange={(e) => checkColor(e.target.value)}
            placeholder="Search Hex (e.g. FF0055)"
            style={{ 
              width: '100%', 
              backgroundColor: '#111827', 
              border: `2px solid ${status === 'available' ? '#4ade80' : '#374151'}`, 
              padding: '20px 20px 20px 64px', 
              fontSize: '24px', 
              color: '#fff', 
              borderRadius: '20px', 
              outline: 'none',
              transition: 'all 0.3s ease',
              fontWeight: '700',
              letterSpacing: '2px',
              boxShadow: status === 'available' ? '0 0 30px rgba(74, 222, 128, 0.2)' : 'none'
            }} 
          />
        </div>

        <div style={{ minHeight: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {status === 'idle' && (
            <p style={{ color: '#9ca3af', fontSize: '15px' }}>Enter 6 characters to check availability.</p>
          )}
          
          {status === 'checking' && <Loader2 className="animate-spin" style={{ color: '#fff', width: '32px', height: '32px' }} />}
          
          {status === 'available' && hex.length === 6 && (
            <div className="animate-in fade-in zoom-in duration-300 w-full" style={{ width: '100%' }}>
              
              <div style={{ 
                width: '100%', 
                height: '110px', 
                backgroundColor: `#${hex}`, 
                borderRadius: '20px', 
                marginBottom: '24px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                boxShadow: `0 0 50px -10px #${hex}`,
                border: '2px solid rgba(255,255,255,0.2)'
              }}>
                 <span style={{ 
                   color: parseInt(hex, 16) > 0xffffff / 2 ? '#000' : '#fff', 
                   fontWeight: '900', 
                   fontSize: '32px',
                   letterSpacing: '2px',
                   textShadow: parseInt(hex, 16) > 0xffffff / 2 ? 'none' : '0 2px 10px rgba(0,0,0,0.5)'
                 }}>#{hex}</span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px' }}>
                <a 
                  href={getGumroadUrl()}
                  style={{ 
                    background: '#fff', 
                    color: '#000', 
                    padding: '18px', 
                    borderRadius: '16px', 
                    textDecoration: 'none', 
                    fontWeight: '800', 
                    fontSize: '18px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '10px',
                    boxShadow: '0 0 20px rgba(255,255,255,0.2)',
                    transition: 'transform 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  CLAIM NOW ($5) <ExternalLink size={20}/>
                </a>
                <button 
                  onClick={shareOnX}
                  style={{ 
                    backgroundColor: 'rgba(29, 161, 242, 0.1)', 
                    border: '1px solid #1DA1F2', 
                    padding: '0 24px', 
                    borderRadius: '16px', 
                    cursor: 'pointer', 
                    color: '#1DA1F2',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(29, 161, 242, 0.2)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(29, 161, 242, 0.1)'}
                >
                  <Twitter size={24} />
                </button>
              </div>
            </div>
          )}

          {status === 'taken' && (
            <div style={{ 
              backgroundColor: 'rgba(239, 68, 68, 0.1)', 
              border: '1px solid #ef4444',
              color: '#fca5a5', 
              padding: '24px', 
              borderRadius: '20px', 
              width: '100%', 
              textAlign: 'center',
            }}>
              <p style={{ fontWeight: '800', fontSize: '20px', color: '#fff', marginBottom: '5px' }}>LOCKED 🔒</p>
              <p style={{ fontSize: '14px' }}>This territory is already occupied.</p>
            </div>
          )}
        </div>
      </div>

      {/* NEW LIST VIEW SECTION */}
      <div style={{ marginTop: '100px', width: '100%', maxWidth: '700px', marginBottom: '60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>
          <h3 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-1px' }}>OWNERSHIP LEDGER</h3>
          <span style={{ color: '#94a3b8', fontSize: '14px', fontFamily: 'monospace' }}>● LIVE FEED</span>
        </div>
        
        {/* LIST CONTAINER */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {recentSales.map((sale) => (
            <div key={sale.id} className="group" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              backgroundColor: '#1f2937', 
              padding: '16px', 
              borderRadius: '16px', 
              border: '1px solid rgba(255,255,255,0.05)',
              transition: 'transform 0.2s, background-color 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#2d3748';
              e.currentTarget.style.transform = 'scale(1.01)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#1f2937';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                {/* COLOR BOX */}
                <div style={{ 
                  width: '50px', 
                  height: '50px', 
                  backgroundColor: sale.hex_code.startsWith('#') ? sale.hex_code : `#${sale.hex_code}`, 
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}></div>
                
                {/* INFO */}
                <div>
                  <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '18px', fontFamily: 'monospace', letterSpacing: '1px' }}>
                    {sale.hex_code.startsWith('#') ? sale.hex_code : `#${sale.hex_code}`}
                  </div>
                  <div style={{ color: '#9ca3af', fontSize: '13px' }}>
                    Owned by <span style={{ color: '#e2e8f0', fontWeight: '600' }}>{sale.owner_name || 'Anonymous'}</span>
                  </div>
                </div>
              </div>

              {/* DATE */}
              <div style={{ color: '#6b7280', fontSize: '12px', textAlign: 'right', fontWeight: '500' }}>
                {formatDate(sale.created_at)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '30px', width: '100%', textAlign: 'center' }}>
        <a href="/terms" style={{ color: '#64748b', textDecoration: 'none', fontSize: '14px', fontWeight: '500', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#fff'} onMouseOut={(e) => e.currentTarget.style.color = '#64748b'}>
          Terms & Conditions / Legal Disclaimer
        </a>
      </div>

    </div>
  )
}
