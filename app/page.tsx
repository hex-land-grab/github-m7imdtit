'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Search, Loader2, Twitter, ExternalLink, Zap, ShieldCheck } from 'lucide-react'

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
      wanted: "true", // VISSZATETTÜK: Gyors checkout, overlay mód
      SelectedHex: hex.replace('#', '').toUpperCase()
    });
    return `${G_LINK}?${params.toString()}`;
  }

  const shareOnX = () => {
    const text = `I just found that #${hex} is AVAILABLE on Hex Land Grab! Who's gonna own it?`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent('https://hex-land-grab.vercel.app')}`; 
    window.open(url, '_blank');
  }

  return (
    <div style={{ 
      backgroundColor: '#f8fafc', // Light Mode háttér
      minHeight: '100vh', 
      color: '#0f172a', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      padding: '60px 20px',
      position: 'relative' // A footer pozícionálásához
    }}>
      
      {/* HEADER SECTION */}
      <div style={{ textAlign: 'center', marginBottom: '60px', maxWidth: '800px' }}>
        <div style={{ 
          display: 'inline-flex', alignItems: 'center', gap: '8px', 
          backgroundColor: '#e0f2fe', color: '#0284c7', 
          padding: '6px 16px', borderRadius: '20px', marginBottom: '24px', 
          fontSize: '13px', fontWeight: '600' 
        }}>
          <Zap size={14} fill="currentColor" /> V11: Live Ownership Feed
        </div>
        
        <h1 style={{ 
          fontSize: '4rem', 
          fontWeight: '900', 
          marginBottom: '20px', 
          letterSpacing: '-0.03em',
          lineHeight: '1',
          color: '#1e293b'
        }}>
          Hex Land Grab
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#64748b', maxWidth: '580px', margin: '0 auto', lineHeight: '1.6' }}>
          The internet has 16,777,216 colors. <br/>
          We sell them once. To one person. <strong style={{ color: '#0f172a' }}>Forever.</strong>
        </p>
      </div>
      
      {/* MAIN CARD - LIGHT & CLEAN */}
      <div style={{ 
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        padding: '40px', 
        borderRadius: '24px', 
        width: '100%', 
        maxWidth: '520px', 
        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.08)' 
      }}>
        <div style={{ position: 'relative', marginBottom: '30px' }}>
          <Search style={{ position: 'absolute', left: '20px', top: '22px', color: '#94a3b8', width: '20px', height: '20px' }} />
          <input 
            type="text" value={hex} onChange={(e) => checkColor(e.target.value)}
            placeholder="Search Hex (e.g. FF0055)"
            style={{ 
              width: '100%', 
              backgroundColor: '#f1f5f9', 
              border: `2px solid ${status === 'available' ? '#22c55e' : 'transparent'}`, 
              padding: '18px 18px 18px 54px', 
              fontSize: '20px', 
              color: '#0f172a', 
              borderRadius: '16px', 
              outline: 'none',
              transition: 'all 0.2s ease',
              fontWeight: '600',
              fontFamily: 'monospace'
            }} 
          />
        </div>

        <div style={{ minHeight: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {status === 'idle' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '14px' }}>
              <ShieldCheck size={16} /> Secure Ownership Verification
            </div>
          )}
          
          {status === 'checking' && <Loader2 className="animate-spin" style={{ color: '#0f172a' }} />}
          
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
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
              }}>
                 <span style={{ 
                   color: parseInt(hex, 16) > 0xffffff / 2 ? '#000' : '#fff', 
                   fontWeight: '700', 
                   fontSize: '24px',
                   fontFamily: 'monospace',
                   backgroundColor: 'rgba(255,255,255,0.2)',
                   padding: '4px 12px',
                   borderRadius: '8px',
                   backdropFilter: 'blur(4px)'
                 }}>#{hex}</span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px' }}>
                <a 
                  href={getGumroadUrl()}
                  style={{ 
                    backgroundColor: '#0f172a', 
                    color: '#fff', 
                    padding: '16px', 
                    borderRadius: '14px', 
                    textDecoration: 'none', 
                    fontWeight: '600', 
                    fontSize: '16px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '8px',
                    transition: 'opacity 0.2s',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                  onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                >
                  Claim Ownership ($5) <ExternalLink size={18}/>
                </a>
                <button 
                  onClick={shareOnX}
                  style={{ 
                    backgroundColor: '#f0f9ff', 
                    border: '1px solid #bae6fd', 
                    padding: '0 20px', 
                    borderRadius: '14px', 
                    cursor: 'pointer', 
                    color: '#0ea5e9',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                  title="Share on X"
                >
                  <Twitter size={22} />
                </button>
              </div>
            </div>
          )}

          {status === 'taken' && (
            <div style={{ 
              backgroundColor: '#fef2f2', 
              color: '#ef4444', 
              padding: '20px', 
              borderRadius: '16px', 
              width: '100%', 
              textAlign: 'center',
              border: '1px solid #fee2e2'
            }}>
              <p style={{ fontWeight: '700', fontSize: '18px', marginBottom: '4px' }}>Unavailable</p>
              <p style={{ fontSize: '14px', color: '#b91c1c' }}>This territory has already been claimed.</p>
            </div>
          )}
        </div>
      </div>

      {/* RECENT GRID - LIGHT */}
      <div style={{ marginTop: '100px', width: '100%', maxWidth: '1000px', marginBottom: '100px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', borderBottom: '1px solid #e2e8f0', paddingBottom: '20px' }}>
          <h3 style={{ color: '#0f172a', fontSize: '1.25rem', fontWeight: '700' }}>Recent Claims</h3>
          <span style={{ color: '#64748b', fontSize: '14px' }}>Live • {recentSales.length} claimed</span>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', 
          gap: '16px' 
        }}>
          {recentSales.map((sale) => (
            <div key={sale.id} className="group" style={{ position: 'relative' }}>
              <div style={{ 
                aspectRatio: '1/1', 
                backgroundColor: sale.hex_code.startsWith('#') ? sale.hex_code : `#${sale.hex_code}`, 
                borderRadius: '16px',
                cursor: 'default',
                display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                padding: '8px',
                border: '1px solid rgba(0,0,0,0.05)'
              }}>
                <div style={{ 
                  backgroundColor: 'rgba(255,255,255,0.9)', 
                  padding: '4px 10px', 
                  borderRadius: '8px',
                  color: '#0f172a', 
                  fontSize: '11px', 
                  fontWeight: '700',
                  fontFamily: 'monospace',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  {sale.hex_code}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER - LEGAL LINK */}
      <div style={{ 
        width: '100%', 
        textAlign: 'center', 
        padding: '40px 0', 
        borderTop: '1px solid #e2e8f0', 
        marginTop: 'auto', 
        color: '#94a3b8', 
        fontSize: '13px' 
      }}>
        <p style={{ marginBottom: '10px' }}>&copy; 2026 Hex Land Grab. All rights reserved.</p>
        <a 
          href="/terms" 
          style={{ color: '#64748b', textDecoration: 'underline', fontWeight: '500' }}
        >
          Terms & Conditions / Legal
        </a>
      </div>

    </div>
  )
}
