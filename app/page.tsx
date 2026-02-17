'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Search, Loader2, Twitter, ExternalLink, Tag, Shuffle, Globe, Info, Trophy, Lock } from 'lucide-react'

const S_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const S_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const G_LINK = "https://soloflowsystems.gumroad.com/l/zlqosf"; 

const supabase = createClient(S_URL, S_KEY);

export default function OwnAColor() {
  const [hex, setHex] = useState('')
  const [status, setStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')
  const [recentSales, setRecentSales] = useState<any[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  
  useEffect(() => {
    const fetchSales = async () => {
      const { data, count } = await supabase
        .from('sold_colors')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (data) setRecentSales(data);
      if (count !== null) setTotalCount(count);
    };

    fetchSales();

    const channel = supabase
      .channel('realtime_sales')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sold_colors' }, (payload) => {
        setRecentSales((prev) => [payload.new, ...prev.slice(0, 49)]);
        setTotalCount((prev) => prev + 1);
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

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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
      
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: -2,
        background: 'linear-gradient(-45deg, #ee7752, #e73c7e, #0B31A5, #23d5ab)',
        backgroundSize: '400% 400%',
        animation: 'gradientBG 15s ease infinite'
      }} />

      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: -1,
        background: hex.length === 6 ? `radial-gradient(circle at center, #${hex}, #000000)` : 'transparent',
        opacity: hex.length === 6 ? 1 : 0,
        transition: 'opacity 1s ease, background 0.5s ease'
      }} />

      <style jsx global>{`
        @keyframes gradientBG {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 10px; }
      `}</style>

      <div style={{ textAlign: 'center', marginBottom: '40px', maxWidth: '800px', zIndex: 10 }}>
        <h1 style={{ 
          fontSize: '4.5rem', fontWeight: '900', marginBottom: '10px', marginTop: '20px', letterSpacing: '-2px', lineHeight: '1',
          background: 'linear-gradient(to right, #fff, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.3))'
        }}>
          OWN A COLOR
        </h1>
        
        <p style={{ fontSize: '1.2rem', color: '#e2e8f0', maxWidth: '640px', margin: '0 auto 15px auto', lineHeight: '1.6', fontWeight: '500' }}>
          The Global Registry. <span style={{ color: '#fff', fontWeight: '700' }}>16 Million Colors.</span> One Owner Each.
        </p>

        <div style={{ display: 'inline-block', backgroundColor: 'rgba(0,0,0,0.3)', padding: '6px 16px', borderRadius: '20px', marginBottom: '25px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <span style={{ fontSize: '13px', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Info size={14} /> 
            Digital Registry Listing Only • Not Intellectual Property Rights
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '50px', backdropFilter: 'blur(10px)' }}>
             <Trophy size={16} color="#fbbf24" />
             <span style={{ fontWeight: '700', fontSize: '14px' }}>{totalCount} Colors Claimed</span>
          </div>
          
          {/* DÖLT LAUNCH PRICE BADGE */}
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: '10px 24px', 
            backgroundColor: '#fbbf24', 
            borderRadius: '50px', 
            boxShadow: '0 4px 20px rgba(251, 191, 36, 0.4)',
            transform: 'rotate(-3deg)' 
          }}>
             <Tag size={18} color="#000" fill="#000" />
             <span style={{ color: '#000', fontWeight: '800', fontSize: '16px', letterSpacing: '0.5px' }}>LAUNCH PRICE: $5 USD</span>
          </div>
        </div>
      </div>
      
      <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.2)', padding: '40px', borderRadius: '32px', width: '100%', maxWidth: '550px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', position: 'relative', zIndex: 10 }}>
        
        <div style={{ position: 'relative', marginBottom: '20px', display: 'flex', gap: '10px' }}>
          <div style={{ position: 'relative', flexGrow: 1 }}>
            <Search style={{ position: 'absolute', left: '20px', top: '22px', color: '#cbd5e1', width: '20px', height: '20px' }} />
            <input type="text" value={hex} onChange={(e) => checkColor(e.target.value)} placeholder="Search Hex (e.g. FF0055)"
              style={{ width: '100%', backgroundColor: 'rgba(15, 23, 42, 0.6)', border: `2px solid ${status === 'available' ? '#4ade80' : 'rgba(255,255,255,0.1)'}`, padding: '18px 18px 18px 50px', fontSize: '20px', color: '#fff', borderRadius: '16px', outline: 'none', transition: 'all 0.3s ease', fontWeight: '700', letterSpacing: '2px', boxShadow: status === 'available' ? '0 0 30px rgba(74, 222, 128, 0.4)' : 'none' }} 
            />
          </div>
          
          <button onClick={generateRandomColor} title="Surprise Me!" style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255,255,255,0.2)', 
            borderRadius: '16px', width: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'background 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'} 
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}>
            <Shuffle size={24} color="#fff" />
          </button>
        </div>

        <div style={{ minHeight: '140px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          
          {status === 'idle' && (
            <div style={{textAlign: 'center', color: '#cbd5e1'}}>
              <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>Enter 6 characters OR click Shuffle.</p>
              <p style={{ fontSize: '12px', opacity: 0.6 }}>Find your unique color in the registry.</p>
            </div>
          )}
          
          {status === 'checking' && <Loader2 className="animate-spin" style={{ color: '#fff', width: '32px', height: '32px' }} />}
          
          {status === 'available' && hex.length === 6 && (
            <div className="animate-in fade-in zoom-in duration-300 w-full">
              <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '6px', marginBottom: '16px', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.3)', position: 'relative', overflow: 'hidden' }}>
                 <div style={{ backgroundColor: `#${hex}`, borderRadius: '12px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', position: 'relative' }}>
                    <span style={{ color: parseInt(hex, 16) > 0xffffff / 2 ? '#000' : '#fff', fontWeight: '900', fontSize: '28px', letterSpacing: '2px', zIndex: 2 }}>#{hex}</span>
                 </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px', marginBottom: '10px' }}>
                <a href={getGumroadUrl()} style={{ background: '#3b82f6', color: '#fff', padding: '20px', borderRadius: '16px', textDecoration: 'none', fontWeight: '800', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 4px 20px rgba(59, 130, 246, 0.5)', transition: 'transform 0.2s', width: '100%' }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                  CLAIM FOR $5 <ExternalLink size={24}/>
                </a>
                <button onClick={shareOnX} style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255,255,255,0.3)', padding: '0 24px', borderRadius: '16px', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}>
                  <Twitter size={24} />
                </button>
              </div>
            </div>
          )}

          {status === 'taken' && (
            <div style={{ width: '100%', textAlign: 'center' }}>
              <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px dashed #ef4444', padding: '20px', borderRadius: '16px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Lock size={20} color="#fca5a5" />
                  <span style={{ color: '#fca5a5', fontWeight: '800', fontSize: '18px' }}>LOCKED</span>
                </div>
                <p style={{ color: '#e2e8f0', fontSize: '14px' }}>This color is already owned by someone else.</p>
              </div>
              <button onClick={generateRandomColor} style={{ color: '#cbd5e1', fontSize: '14px', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>
                Find another color
              </button>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: '80px', width: '100%', maxWidth: '1000px', marginBottom: '60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', padding: '0 20px' }}>
          <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
             <Globe size={20} color="#fff"/>
             <h3 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-1px' }}>OWNERSHIP LEDGER</h3>
          </div>
          <span style={{ color: '#4ade80', fontSize: '12px', fontFamily: 'monospace', fontWeight: '700', border: '1px solid #4ade80', padding: '4px 8px', borderRadius: '4px' }}>● LIVE FEED</span>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
          gap: '16px', 
          padding: '0 20px' 
        }}>
          {recentSales.map((sale) => (
            <div key={sale.id} className="group" style={{ position: 'relative' }}>
              <div style={{ 
                backgroundColor: 'rgba(30, 41, 59, 0.6)', 
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)', 
                borderRadius: '16px', 
                overflow: 'hidden',
                transition: 'transform 0.2s',
                cursor: 'default',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ 
                  height: '100px', 
                  backgroundColor: sale.hex_code.startsWith('#') ? sale.hex_code : `#${sale.hex_code}`,
                  width: '100%'
                }}></div>
                
                <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <p style={{ color: '#fff', fontSize: '15px', fontWeight: '700', fontFamily: 'monospace', marginBottom: '4px', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                    {sale.hex_code.startsWith('#') ? sale.hex_code : `#${sale.hex_code}`}
                  </p>
                  
                  {/* CITY FEJLESZTÉS: Név + Város */}
                  <p style={{ color: '#e2e8f0', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '8px' }}>
                    {sale.owner_name || 'Anonymous'}
                    {sale.city && (
                      <span style={{ opacity: 0.7, marginLeft: '4px' }}>
                        • {sale.city}
                      </span>
                    )}
                  </p>

                  <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px' }}>
                    <p style={{ color: '#94a3b8', fontSize: '10px' }}>
                      {formatDate(sale.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer style={{ marginTop: 'auto', width: '100%', textAlign: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '48px', paddingBottom: '48px' }}>
        <div style={{ maxWidth: '896px', margin: '0 auto', padding: '0 16px' }}>
          <p style={{ color: '#71717a', fontSize: '14px', marginBottom: '16px' }}>
            © 2026 Own a Color. The Exclusive Global Registry.
          </p>
          <p style={{ color: '#a1a1aa', fontSize: '12px', lineHeight: '1.6', maxWidth: '672px', margin: '0 auto 32px auto' }}>
            DISCLAIMER: "Ownership" refers to a permanent entry in the Own a Color Registry database. 
            This service acts as a digital collectible registry and does not confer legal intellectual property rights, 
            trademark protection, or copyright ownership for the selected color code. 
            Purchase represents a listing service for the lifetime of the platform.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', fontSize: '12px', fontWeight: '500', letterSpacing: '0.05em', color: '#a1a1aa' }}>
            <a href="/terms" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#fff'} onMouseOut={(e) => e.currentTarget.style.color = '#a1a1aa'}>TERMS & CONDITIONS</a>
            <a href="/privacy" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#fff'} onMouseOut={(e) => e.currentTarget.style.color = '#a1a1aa'}>PRIVACY POLICY</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
