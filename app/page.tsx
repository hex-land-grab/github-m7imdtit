'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Search, Loader2, Twitter, ExternalLink, Tag } from 'lucide-react'

// Környezeti változók
const S_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const S_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const G_LINK = "https://soloflowsystems.gumroad.com/l/zlqosf"; 

const supabase = createClient(S_URL, S_KEY);

export default function OwnAColor() {
  const [hex, setHex] = useState('')
  const [status, setStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')
  const [recentSales, setRecentSales] = useState<any[]>([])
  
  useEffect(() => {
    const fetchSales = async () => {
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
      
      {/* 1. RÉTEG: MOZGÓ GRADIENS */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: -2,
        background: 'linear-gradient(-45deg, #ee7752, #e73c7e, #0B31A5, #23d5ab)',
        backgroundSize: '400% 400%',
        animation: 'gradientBG 15s ease infinite'
      }} />

      {/* 2. RÉTEG: KIVÁLASZTOTT SZÍN FÜGGÖNY */}
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
        /* Egyedi görgetősáv stílus */
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 10px; }
      `}</style>

      {/* HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '40px', maxWidth: '800px', zIndex: 10 }}>
        <h1 style={{ 
          fontSize: '5rem', fontWeight: '900', marginBottom: '10px', marginTop: '20px', letterSpacing: '-2px', lineHeight: '1',
          background: 'linear-gradient(to right, #fff, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.3))'
        }}>
          OWN A COLOR
        </h1>
        <p style={{ fontSize: '1.5rem', color: '#fff', maxWidth: '600px', margin: '0 auto 20px auto', lineHeight: '1.6', fontWeight: '500', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
          The Exclusive Digital Registry. <span style={{ borderBottom: '3px solid #fff' }}>Forever.</span>
        </p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 24px', backgroundColor: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.3)', borderRadius: '50px', backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', marginTop: '10px' }}>
          <Tag size={18} color="#fbbf24" fill="#fbbf24" />
          <span style={{ color: '#fff', fontWeight: '800', fontSize: '16px', letterSpacing: '1px' }}>FIXED PRICE: $5 USD</span>
        </div>
      </div>
      
      {/* MAIN CARD */}
      <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.2)', padding: '50px', borderRadius: '32px', width: '100%', maxWidth: '600px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', position: 'relative', zIndex: 10 }}>
        <div style={{ position: 'relative', marginBottom: '30px' }}>
          <Search style={{ position: 'absolute', left: '24px', top: '24px', color: '#cbd5e1', width: '24px', height: '24px' }} />
          <input type="text" value={hex} onChange={(e) => checkColor(e.target.value)} placeholder="Search Hex (e.g. FF0055)"
            style={{ width: '100%', backgroundColor: 'rgba(15, 23, 42, 0.6)', border: `2px solid ${status === 'available' ? '#4ade80' : 'rgba(255,255,255,0.1)'}`, padding: '20px 20px 20px 64px', fontSize: '24px', color: '#fff', borderRadius: '20px', outline: 'none', transition: 'all 0.3s ease', fontWeight: '700', letterSpacing: '2px', boxShadow: status === 'available' ? '0 0 30px rgba(74, 222, 128, 0.4)' : 'none' }} 
          />
        </div>

        <div style={{ minHeight: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {status === 'idle' && <p style={{ color: '#cbd5e1', fontSize: '16px', fontWeight: '500' }}>Enter 6 characters to check availability.</p>}
          {status === 'checking' && <Loader2 className="animate-spin" style={{ color: '#fff', width: '32px', height: '32px' }} />}
          {status === 'available' && hex.length === 6 && (
            <div className="animate-in fade-in zoom-in duration-300 w-full" style={{ width: '100%' }}>
              <div style={{ width: '100%', height: '110px', backgroundColor: `#${hex}`, borderRadius: '20px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 50px -10px #${hex}`, border: '2px solid rgba(255,255,255,0.4)' }}>
                 <span style={{ color: parseInt(hex, 16) > 0xffffff / 2 ? '#000' : '#fff', fontWeight: '900', fontSize: '32px', letterSpacing: '2px', textShadow: parseInt(hex, 16) > 0xffffff / 2 ? 'none' : '0 2px 10px rgba(0,0,0,0.5)' }}>#{hex}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px' }}>
                <a href={getGumroadUrl()} style={{ background: '#fff', color: '#000', padding: '18px', borderRadius: '16px', textDecoration: 'none', fontWeight: '800', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 0 20px rgba(255,255,255,0.4)', transition: 'transform 0.2s' }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                  CLAIM NOW ($5) <ExternalLink size={20}/>
                </a>
                <button onClick={shareOnX} style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255,255,255,0.3)', padding: '0 24px', borderRadius: '16px', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}>
                  <Twitter size={24} />
                </button>
              </div>
            </div>
          )}
          {status === 'taken' && (
            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#fca5a5', padding: '24px', borderRadius: '20px', width: '100%', textAlign: 'center' }}>
              <p style={{ fontWeight: '800', fontSize: '20px', color: '#fff', marginBottom: '5px' }}>LOCKED 🔒</p>
              <p style={{ fontSize: '14px', color: '#fff' }}>This territory is already occupied.</p>
            </div>
          )}
        </div>
      </div>

      {/* LIST VIEW SECTION - GÖRGETHETŐ FIX */}
      <div style={{ marginTop: '100px', width: '100%', maxWidth: '700px', marginBottom: '60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: '20px' }}>
          <h3 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-1px' }}>OWNERSHIP LEDGER</h3>
          <span style={{ color: '#e2e8f0', fontSize: '14px', fontFamily: 'monospace', fontWeight: '600' }}>● LIVE FEED</span>
        </div>
        
        <div className="custom-scrollbar" style={{ maxHeight: '450px', overflowY: 'auto', paddingRight: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentSales.map((sale) => (
              <div key={sale.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(10px)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ width: '50px', height: '50px', backgroundColor: sale.hex_code.startsWith('#') ? sale.hex_code : `#${sale.hex_code}`, borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)' }}></div>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '18px', fontFamily: 'monospace' }}>{sale.hex_code.startsWith('#') ? sale.hex_code : `#${sale.hex_code}`}</div>
                    <div style={{ color: '#cbd5e1', fontSize: '13px' }}>Owned by <span style={{ color: '#fff', fontWeight: '700' }}>{sale.owner_name || 'Anonymous'}</span></div>
                  </div>
                </div>
                <div style={{ color: '#cbd5e1', fontSize: '12px' }}>{formatDate(sale.created_at)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '30px', paddingBottom: '40px', width: '100%', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', alignItems: 'center' }}>
          <a href="/terms" style={{ color: '#e2e8f0', textDecoration: 'none', fontSize: '14px' }}>Terms & Conditions</a>
          <span style={{ color: '#fff' }}>|</span>
          <a href="/privacy" style={{ color: '#e2e8f0', textDecoration: 'none', fontSize: '14px' }}>Privacy Policy</a>
        </div>
        <p style={{ marginTop: '15px', fontSize: '12px', color: '#e2e8f0' }}>&copy; 2026 Own a Color. All rights reserved.</p>
      </div>
    </div>
  )
}
