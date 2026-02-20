import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { Twitter, ExternalLink, ArrowLeft, ShieldCheck, Unlock } from 'lucide-react'

// Supabase inicializálása
const S_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const S_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(S_URL, S_KEY);
const G_LINK = "https://soloflowsystems.gumroad.com/l/zlqosf";

// Dinamikus metaadatok (SEO) generálása
export async function generateMetadata({ params }: { params: { hex: string } }) {
  return {
    title: `Color #${params.hex.toUpperCase()} | Own a Color Registry`,
    description: `View the official ownership status and details for hex color #${params.hex.toUpperCase()}.`
  }
}

// Fő komponens
export default async function ColorCertificatePage({ params }: { params: { hex: string } }) {
  const rawHex = params.hex.replace(/[^0-9A-Fa-f]/gi, '').toUpperCase();
  
  // Ha érvénytelen a formátum (nem 6 karakter)
  if (rawHex.length !== 6) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold mb-4">Invalid Color Code</h1>
        <Link href="/" className="text-gray-400 hover:text-white">&larr; Return Home</Link>
      </div>
    )
  }

  const hexCode = `#${rawHex}`;
  
  // Lekérdezés a Supabase-ből
  const { data: colorData } = await supabase
    .from('sold_colors')
    .select('*')
    .eq('hex_code', hexCode)
    .single();

  const isOwned = !!colorData;
  const gumroadUrl = `${G_LINK}?SelectedHex=${rawHex}`;
  
  // Twitter megosztás szövege attól függően, hogy foglalt vagy szabad
  const baseUrl = 'https://own-a-color.vercel.app'; // Később cseréld a végleges domainedre, ha lesz!
  const shareUrl = `${baseUrl}/color/${rawHex}`;
  const shareText = isOwned 
    ? `Check out the official registry for color ${hexCode}! Owned by ${colorData.owner_name}. 🎨`
    : `I just found out ${hexCode} is still available on the Global Registry! Who's gonna claim it? 🎨`;
  const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;

  // Dátum formázása
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      color: '#fff', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '40px 20px',
      position: 'relative',
      backgroundColor: '#050505'
    }}>
      
      {/* Dinamikus háttér a szín alapján */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 0,
        background: `radial-gradient(circle at top, ${hexCode}40, #000000 70%)`,
        opacity: 0.6
      }} />

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '600px' }}>
        
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#94a3b8', textDecoration: 'none', marginBottom: '32px', fontSize: '14px', transition: 'color 0.2s' }}
          onMouseOver={(e) => e.currentTarget.style.color = '#fff'} onMouseOut={(e) => e.currentTarget.style.color = '#94a3b8'}>
          <ArrowLeft size={16} /> Back to Registry
        </Link>

        {/* TANÚSÍTVÁNY KÁRTYA */}
        <div style={{ 
          backgroundColor: 'rgba(15, 23, 42, 0.6)', 
          backdropFilter: 'blur(24px)', 
          WebkitBackdropFilter: 'blur(24px)', 
          border: '1px solid rgba(255, 255, 255, 0.1)', 
          borderRadius: '32px', 
          overflow: 'hidden',
          boxShadow: `0 25px 50px -12px ${hexCode}30`
        }}>
          
          {/* Felső nagy színblokk */}
          <div style={{ 
            height: '240px', 
            backgroundColor: hexCode,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <h1 style={{ 
              color: parseInt(rawHex, 16) > 0xffffff / 2 ? '#000' : '#fff', 
              fontSize: '4rem', 
              fontWeight: '900', 
              letterSpacing: '4px',
              textShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}>
              {hexCode}
            </h1>
          </div>

          <div style={{ padding: '40px' }}>
            {isOwned ? (
              // FOGLALT ÁLLAPOT (OWNED)
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(74, 222, 128, 0.1)', border: '1px solid #4ade80', color: '#4ade80', padding: '6px 16px', borderRadius: '50px', fontSize: '14px', fontWeight: '700', marginBottom: '24px' }}>
                  <ShieldCheck size={18} /> OFFICIAL REGISTRY RECORD
                </div>
                
                <h2 style={{ fontSize: '14px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>Owned By</h2>
                <p style={{ fontSize: '32px', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>{colorData.owner_name}</p>
                
                {colorData.city && (
                  <p style={{ fontSize: '18px', color: '#cbd5e1', marginBottom: '24px' }}>📍 {colorData.city}</p>
                )}
                
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', margin: '32px 0' }}></div>
                
                <p style={{ fontSize: '14px', color: '#64748b' }}>
                  Acquired on {formatDate(colorData.created_at)}
                </p>
              </div>
            ) : (
              // SZABAD ÁLLAPOT (AVAILABLE)
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(251, 191, 36, 0.1)', border: '1px solid #fbbf24', color: '#fbbf24', padding: '6px 16px', borderRadius: '50px', fontSize: '14px', fontWeight: '700', marginBottom: '24px' }}>
                  <Unlock size={18} /> AVAILABLE TO CLAIM
                </div>
                
                <p style={{ fontSize: '18px', color: '#e2e8f0', marginBottom: '32px', lineHeight: '1.6' }}>
                  This hex code has not been claimed yet. Be the first and only person to own <strong style={{ color: '#fff' }}>{hexCode}</strong> in the global registry.
                </p>
                
                <a href={gumroadUrl} style={{ background: '#3b82f6', color: '#fff', padding: '20px', borderRadius: '16px', textDecoration: 'none', fontWeight: '800', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 4px 20px rgba(59, 130, 246, 0.5)', transition: 'transform 0.2s', width: '100%' }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                  CLAIM FOR $5 <ExternalLink size={24}/>
                </a>
              </div>
            )}

            {/* KÖZÖS GOMB: Megosztás X-en */}
            <div style={{ marginTop: '24px' }}>
              <a href={twitterIntentUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '16px', borderRadius: '16px', color: '#fff', textDecoration: 'none', fontWeight: '600', transition: 'background 0.2s' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}>
                <Twitter size={20} /> {isOwned ? 'Share Ownership' : 'Tell a Friend'}
              </a>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
