'use client'
import { useState, useEffect, Suspense } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Search, Loader2, Twitter, ExternalLink, Tag, Shuffle, Globe, Info, Trophy, Lock, CheckCircle, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'

const S_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const S_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const G_LINK = "https://soloflowsystems.gumroad.com/l/zlqosf"; 

const supabase = createClient(S_URL, S_KEY);

function OwnAColorContent() {
  const [hex, setHex] = useState('')
  const [status, setStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')
  const [recentSales, setRecentSales] = useState<any[]>([])
  const [totalCount, setTotalCount] = useState<number>(57)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [tempClaim, setTempClaim] = useState<string | null>(null) // ÚJ: Ideiglenes kártya
  
  const searchParams = useSearchParams()
  const router = useRouter()
  const isSuccess = searchParams.get('success') === 'true'

  useEffect(() => {
    if (isSuccess) {
      // Megnézzük, volt-e elmentett színünk a memóriában
      const savedHex = localStorage.getItem('pendingHex');
      if (savedHex) setTempClaim(savedHex);

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
      script.onload = () => {
        // @ts-ignore
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#3b82f6', '#22c55e', '#fbbf24', '#ef4444', '#a855f7'] });
      };
      document.body.appendChild(script);

      const timer = setTimeout(() => {
        router.replace('/', { scroll: false });
        localStorage.removeItem('pendingHex'); // Töröljük a memóriát
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isSuccess, router]);

  useEffect(() => {
    const fetchSales = async () => {
      const { data, count } = await supabase.from('sold_colors').select('*', { count: 'exact' }).order('created_at', { ascending: false }).limit(50);
      if (data) setRecentSales(data);
      if (count !== null) setTotalCount(count);
      setIsLoaded(true);
    };
    fetchSales();

    const channel = supabase.channel('realtime_sales').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sold_colors' }, (payload) => {
      setTempClaim(null); // Ha megjött a valódi adat, eltüntetjük az ideiglenest
      setRecentSales((prev) => [payload.new, ...prev.slice(0, 49)]);
      setTotalCount((prev) => prev + 1);
    }).subscribe();

    return () => { supabase.removeChannel(channel); }
  }, []);

  const handleClaimClick = () => {
    // Mentés fizetés előtt
    localStorage.setItem('pendingHex', hex);
  }

  // --- (Köztes függvények: generateRandomColor, checkColor, getGumroadUrl, shareOnX, formatDate változatlanok) ---
  const generateRandomColor = () => { const randomHex = Math.floor(Math.random()*16777215).toString(16).toUpperCase().padStart(6, '0'); setHex(randomHex); checkColor(randomHex); }
  async function checkColor(val: string) { const clean = val.replace(/[^0-9A-F]/gi, '').toUpperCase().slice(0, 6); setHex(clean); if (clean.length !== 6) { setStatus('idle'); return; } setStatus('checking'); const normalizedHex = `#${clean}`; const { data } = await supabase.from('sold_colors').select('*').eq('hex_code', normalizedHex).maybeSingle(); if (data) { setStatus('taken'); } else { setStatus('available'); } }
  const getGumroadUrl = () => { const params = new URLSearchParams({ SelectedHex: hex.replace('#', '').toUpperCase() }); return `${G_LINK}?${params.toString()}`; }
  const shareOnX = () => { const text = `I just found that #${hex} is AVAILABLE on Own a Color! Who's gonna own it?`; const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent('https://own-a-color.vercel.app')}`; window.open(url, '_blank'); }
  const formatDate = (dateString: string) => { if (!dateString) return ''; const date = new Date(dateString); return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }

  return (
    <div style={{ minHeight: '100vh', color: '#fff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 20px', position: 'relative', overflowX: 'hidden' }}>
      
      {isSuccess && (
        <div style={{ position: 'fixed', top: '20px', zIndex: 100, backgroundColor: 'rgba(34, 197, 94, 0.9)', backdropFilter: 'blur(10px)', padding: '12px 24px', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', animation: 'slideDown 0.5s ease-out' }}>
          <CheckCircle size={20} color="#fff" />
          <span style={{ fontWeight: '700', fontSize: '14px' }}>Ownership Secured! Registering in Global Ledger...</span>
        </div>
      )}

      {/* --- Háttér és Stílusok maradnak --- */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: -2, background: 'linear-gradient(-45deg, #ee7752, #e73c7e, #0B31A5, #23d5ab)', backgroundSize: '400% 400%', animation: 'gradientBG 15s ease infinite' }} />
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1, background: hex.length === 6 ? `radial-gradient(circle at center, #${hex}, #000000)` : 'transparent', opacity: hex.length === 6 ? 1 : 0, transition: 'opacity 1s ease, background 0.5s ease' }} />
      <style jsx global>{` @keyframes gradientBG { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } } @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } } @keyframes slideDown { 0% { transform: translateY(-100px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } } .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; } .custom-scrollbar::-webkit-scrollbar { width: 6px; } .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); border-radius: 10px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 10px; } `}</style>

      {/* --- Header Szekció --- */}
      <div style={{ textAlign: 'center', marginBottom: '40px', maxWidth: '800px', zIndex: 10 }}>
        <h1 style={{ fontSize: '4.5rem', fontWeight: '900', marginBottom: '10px', marginTop: '20px', letterSpacing: '-2px', lineHeight: '1', background: 'linear-gradient(to right, #fff, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.3))' }}>OWN A COLOR</h1>
        <p style={{ fontSize: '1.2rem', color: '#e2e8f0', maxWidth: '640px', margin: '0 auto 15px auto', lineHeight: '1.6', fontWeight: '500' }}>The Global Registry. <span style={{ color: '#fff', fontWeight: '700' }}>16 Million Colors.</span> One Owner Each.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '50px', backdropFilter: 'blur(10px)' }}>
             <Trophy size={16} color="#fbbf24" />
             {isLoaded ? ( <span style={{ fontWeight: '700', fontSize: '14px' }}>{totalCount} Colors Claimed</span> ) : ( <span className="animate-pulse" style={{ fontWeight: '700', fontSize: '14px', color: '#94a3b8' }}>Loading...</span> )}
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 24px', backgroundColor: '#fbbf24', borderRadius: '50px', boxShadow: '0 4px 20px rgba(251, 191, 36, 0.4)', transform: 'rotate(-3deg)' }}>
             <Tag size={18} color="#000" fill="#000" />
             <span style={{ color: '#000', fontWeight: '800', fontSize: '16px', letterSpacing: '0.5px' }}>CLAIM NOW: $5 USD</span>
          </div>
        </div>
      </div>
      
      {/* --- Kereső Szekció --- */}
      <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.2)', padding: '40px', borderRadius: '32px', width: '100%', maxWidth: '550px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', position: 'relative', zIndex: 10 }}>
        <div style={{ position: 'relative', marginBottom: '20px', display: 'flex', gap: '10px' }}>
          <div style={{ position: 'relative', flexGrow: 1 }}>
            <Search style={{ position: 'absolute', left: '20px', top: '22px', color: '#cbd5e1', width: '20px', height: '20px' }} />
            <input type="text" value={hex} onChange={(e) => checkColor(e.target.value)} placeholder="Search Hex (e.g. FF0055)" style={{ width: '100%', backgroundColor: 'rgba(15, 23, 42, 0.6)', border: `2px solid ${status === 'available' ? '#4ade80' : 'rgba(255,255,255,0.1)'}`, padding: '18px 18px 18px 50px', fontSize: '20px', color: '#fff', borderRadius: '16px', outline: 'none', transition: 'all 0.3s ease', fontWeight: '700', letterSpacing: '2px' }} />
          </div>
          <button onClick={generateRandomColor} style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '16px', width: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Shuffle size={24} color="#fff" /></button>
        </div>
        <div style={{ minHeight: '140px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {status === 'available' && hex.length === 6 && (
            <div className="w-full">
              <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '6px', marginBottom: '16px' }}>
                <div style={{ backgroundColor: `#${hex}`, borderRadius: '12px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: parseInt(hex, 16) > 0xffffff / 2 ? '#000' : '#fff', fontWeight: '900', fontSize: '28px' }}>#{hex}</span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px' }}>
                <a href={getGumroadUrl()} onClick={handleClaimClick} style={{ background: '#3b82f6', color: '#fff', padding: '20px', borderRadius: '16px', textDecoration: 'none', fontWeight: '800', fontSize: '20px', textAlign: 'center' }}>CLAIM FOR $5</a>
                <button onClick={shareOnX} style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255,255,255,0.3)', padding: '0 24px', borderRadius: '16px', color: '#fff' }}><Twitter size={24} /></button>
              </div>
            </div>
          )}
          {status === 'checking' && <Loader2 className="animate-spin" size={32} />}
          {status === 'idle' && <p style={{ color: '#cbd5e1' }}>Enter Hex or click Shuffle.</p>}
          {status === 'taken' && <div style={{ color: '#fca5a5', textAlign: 'center' }}><Lock size={32} style={{ margin: '0 auto 10px' }} /><p>This color is already owned.</p></div>}
        </div>
      </div>

      {/* --- Live Feed Szekció --- */}
      <div style={{ marginTop: '80px', width: '100%', maxWidth: '1000px', marginBottom: '60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', padding: '0 20px' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>OWNERSHIP LEDGER</h3>
          <span style={{ color: '#4ade80', fontSize: '12px', border: '1px solid #4ade80', padding: '4px 8px', borderRadius: '4px' }}>● LIVE FEED</span>
        </div>
        
        <div className="custom-scrollbar" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px', padding: '20px', maxHeight: '600px', overflowY: 'auto', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '24px' }}>
          
          {/* ÚJ: AZ IDEIGLENES KÁRTYA (Vásárlás után azonnal) */}
          {tempClaim && (
            <div className="animate-pulse" style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', border: '2px solid #3b82f6', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '100px', backgroundColor: `#${tempClaim}` }} />
              <div style={{ padding: '12px', textAlign: 'center' }}>
                <p style={{ fontWeight: 'bold', fontFamily: 'monospace' }}>#{tempClaim}</p>
                <p style={{ fontSize: '10px', color: '#3b82f6', marginTop: '4px', fontWeight: 'bold' }}>VERIFYING...</p>
              </div>
            </div>
          )}

          {recentSales.map((sale) => {
            const rawHex = sale.hex_code.replace('#', '');
            return (
              <Link key={sale.id} href={`/color/${rawHex}`} style={{ textDecoration: 'none' }}>
                <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', overflow: 'hidden', height: '100%' }}>
                  <div style={{ height: '100px', backgroundColor: sale.hex_code.startsWith('#') ? sale.hex_code : `#${sale.hex_code}` }} />
                  <div style={{ padding: '12px' }}>
                    <p style={{ fontWeight: 'bold', fontFamily: 'monospace' }}>{sale.hex_code}</p>
                    <p style={{ fontSize: '12px', opacity: 0.7 }}>{sale.owner_name || 'Anonymous'}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  )
}

export default function OwnAColor() { return ( <Suspense fallback={<div style={{ minHeight: '100vh', backgroundColor: '#050505' }} />}> <OwnAColorContent /> </Suspense> ) }
