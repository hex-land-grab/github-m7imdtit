'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Search, Loader2, Twitter, ExternalLink } from 'lucide-react'

const S_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const S_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const G_LINK = "https://soloflowsystems.gumroad.com/l/zlqosf"; 

const supabase = createClient(S_URL, S_KEY);

export default function OwnAColor() {
  const [hex, setHex] = useState('')
  const [status, setStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')
  const [recentSales, setRecentSales] = useState<any[]>([])
  
  // Ez a state felel a háttérszínért
  const [bgStyle, setBgStyle] = useState<string>('linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)');

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

    // Ha van érvényes szín, a háttér változzon meg arra (kicsit sötétítve, hogy olvasható maradjon)
    if (clean.length === 6) {
       setBgStyle(`radial-gradient(circle at center, #${clean}40, #000000)`);
    } else {
       // Ha nincs, vissza az alap szivárványra
       setBgStyle('linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)');
    }

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
      background: bgStyle,
      backgroundSize: '400% 400%',
      animation: hex.length === 6 ? 'none' : 'gradientBG 15s ease infinite', // Csak akkor mozogjon, ha nincs kiválasztva szín
      minHeight: '100vh', 
      color: '#fff', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      padding: '60px 20px',
      transition: 'background 1s ease'
    }}>
      
      {/* CSS Animation Keyframes for Background */}
      <style jsx global>{`
        @keyframes gradientBG {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '50px', maxWidth: '800px', zIndex: 10 }}>
        
        <h1 style={{ 
          fontSize: '5rem', // Nagyobb betűméret
          fontWeight: '900', 
          marginBottom: '20px', 
          marginTop: '20px',
          letterSpacing: '-2px',
          lineHeight: '1',
          // Szivárvány szöveg effekt:
          background: 'linear-gradient(to right, #fff, #cbd5e1)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.3))'
        }}>
          OWN A COLOR
        </h1>
        <p style={{ 
          fontSize: '1.5rem', 
          color: '#fff', 
          maxWidth: '600px', 
          margin: '0 auto', 
          lineHeight: '1.6', 
          fontWeight: '500',
          textShadow: '0 2px 10px rgba(0,0,0,0.5)' 
        }}>
          The Exclusive Digital Registry. <span style={{ borderBottom: '3px solid #fff' }}>Forever.</span>
        </p>
      </div>
      
      {/* MAIN CARD - GLASSMORPHISM STYLE */}
      <div style={{ 
        backgroundColor: 'rgba(30, 41, 59, 0.7)', // Áttetsző sötétkék
        backdropFilter: 'blur(20px)', // Üveghatás (elhomályosítja a hátteret)
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)', 
        padding: '50px', 
        borderRadius: '32px', 
        width: '100%', 
        maxWidth: '600px', 
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', 
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ position: 'relative', marginBottom: '30px' }}>
          <Search style={{ position: 'absolute', left: '24px', top: '24px', color: '#cbd5e1', width: '24px', height: '24px' }} />
          <input 
            type="text" value={hex} onChange={(e) => checkColor(e.target.value)}
            placeholder="Search Hex (e.g. FF0055)"
            style={{ 
              width: '100%', 
              backgroundColor: 'rgba(15, 23, 42, 0.6)', 
              border: `2px solid ${status === 'available' ? '#4ade80' : 'rgba(255,255,255,0.1)'}`, 
              padding: '20px 20px 20px 64px', 
              fontSize: '24px', 
              color: '#fff', 
              borderRadius: '20px', 
              outline: 'none',
              transition: 'all 0.3s ease',
              fontWeight: '700',
              letterSpacing: '2px',
              boxShadow: status === 'available' ? '0 0 30px rgba(74, 222, 128, 0.4)' : 'none'
            }} 
          />
        </div>

        <div style={{ minHeight: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {status === 'idle' && (
            <p style={{ color: '#cbd5e1', fontSize: '16px', fontWeight: '500' }}>Enter 6 characters to check availability.</p>
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
                border: '2px solid rgba(255,255,255,0.4)'
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
                    boxShadow: '0 0 20px rgba(255,255,255,0.4)',
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
                    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                    border: '1px solid rgba(255,255,255,0.3)', 
                    padding: '0 24px', 
                    borderRadius: '16px', 
                    cursor: 'pointer', 
                    color: '#fff',
                    display: 'flex', alignItems: '
