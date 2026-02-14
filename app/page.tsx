'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Search, Loader2 } from 'lucide-react'

// --- KONFIGURÁCIÓ ---
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
// Fontos: Itt a saját linked van
const GUMROAD_LINK = "https://soloflowsystems.gumroad.com/l/zlqosf"; 

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function HexLandGrab() {
  const [hex, setHex] = useState('')
  const [status, setStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')
  const [ownerData, setOwnerData] = useState<any>(null)
  const [recentSales, setRecentSales] = useState<any[]>([])

  useEffect(() => {
    fetchRecentSales()
  }, [])

  const formatHex = (code: string) => {
    const clean = code.replace(/#/g, '').toUpperCase();
    return `#${clean}`;
  }

  async function fetchRecentSales() {
    const { data } = await supabase
      .from('sold_colors')
      .select('*')
      .order('purchase_price', { ascending: false })
      .limit(5)
    if (data) setRecentSales(data)
  }

  async function checkColor(inputHex: string) {
    const cleanHex = inputHex.replace(/[^0-9A-F]/gi, '').toUpperCase().slice(0, 6)
    setHex(cleanHex)

    if (cleanHex.length !== 6) {
      setStatus('idle')
      return
    }

    setStatus('checking')

    const { data } = await supabase
      .from('sold_colors')
      .select('*')
      .or(`hex_code.eq.${cleanHex},hex_code.eq.#${cleanHex}`)
      .single()

    if (data) {
      setStatus('taken')
      setOwnerData(data)
    } else {
      setStatus('available')
      setOwnerData(null)
    }
  }

  // --- A NYERS LINK GENERÁTOR (A javított verzió) ---
  const getGumroadLink = () => {
    // Ez a "shotgun" módszer: mindkét lehetséges mezőnevet elküldjük neki nyersen.
    // Így ha "Hex", ha "Hex Code" a neve, el fogja kapni.
    // A wanted=true pedig azonnal a fizetést hozza be.
    return `${GUMROAD_LINK}?wanted=true&custom_fields[Hex]=${hex}&custom_fields[Hex Code]=${hex}`;
  }

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff', fontFamily: 'monospace', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      
      <h1 style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '10px', letterSpacing: '-2px', textAlign: 'center' }}>
        HEX LAND GRAB
      </h1>
      <p style={{ color: '#888', fontSize: '1.2rem', marginBottom: '60px', textAlign: 'center' }}>
        Own a color. Forever. 🎨
      </p>

      <div style={{ 
        backgroundColor: '#111', 
        padding: '30px', 
        borderRadius: '20px', 
        border: '1px solid #333', 
        width: '100%', 
        maxWidth: '500px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
      }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <Search style={{ position: 'absolute', left: '20px', color: '#666' }} />
          <input 
            type="text" 
            value={hex}
            onChange={(e) => checkColor(e.target.value)}
            placeholder="TYPE 6 CHARS (E.G. FF0000)..."
            style={{ 
              width: '100%', 
              backgroundColor: '#000', 
              border: '1px solid #333', 
              padding: '20px 20px 20px 60px', 
              fontSize: '24px', 
              color: '#fff', 
              borderRadius: '12px',
              outline: 'none',
              letterSpacing: '4px',
              textTransform: 'uppercase'
            }} 
          />
        </div>

        <div style={{ minHeight: '60px', textAlign: 'center' }}>
          
          {status === 'checking' && (
            <div style={{ color: '#888', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <Loader2 className="animate-spin" /> Checking availability...
            </div>
          )}

          {status === 'available' && hex.length === 6 && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <p style={{ color: '#4ade80', marginBottom: '15px', fontWeight: 'bold' }}>
                ✅ #{hex} IS AVAILABLE!
              </p>
              <a 
                href={getGumroadLink()} 
                target="_blank"
                rel="noreferrer"
                style={{ 
                  backgroundColor: `#${hex}`, 
                  color: parseInt(hex, 16) > 0xffffff / 2 ? '#000' : '#fff',
                  padding: '15px 30px', 
                  borderRadius: '10px', 
                  textDecoration: 'none', 
                  fontWeight: 'bold',
                  display: 'inline-block',
                  border: '2px solid #fff',
                  cursor: 'pointer',
                  fontSize: '18px'
                }}
              >
                CLAIM NOW FOR $5
              </a>
            </div>
          )}

          {status === 'taken' && ownerData && (
            <div style={{ border: '1px solid #333', padding: '15px', borderRadius: '10px', backgroundColor: '#220000' }}>
              <p style={{ color: '#ef4444', fontWeight: 'bold', marginBottom: '5px' }}>
                🚫 TAKEN
              </p>
              <p style={{ color: '#ccc', fontSize: '14px' }}>
                Owned by: <span style={{ color: '#fff' }}>{ownerData.owner_name || 'Anonymous'}</span>
              </p>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: '80px', width: '100%', maxWidth: '600px' }}>
        <h3 style={{ color: '#444', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '20px', textAlign: 'center' }}>
          Recent Claims
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {recentSales.map((sale) => (
            <div key={sale.id} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '15px', 
              backgroundColor: '#111', 
              borderRadius: '8px',
              border: '1px solid #222'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  backgroundColor: formatHex(sale.hex_code), 
                  borderRadius: '6px',
                  boxShadow: '0 0 10px rgba(0,0,0,0.5)' 
                }}></div>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{formatHex(sale.hex_code)}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Claimed via Gumroad</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#888' }}>{sale.owner_name || 'Anonymous'}</div>
                <div style={{ color: '#444', fontSize: '12px' }}>${sale.purchase_price}</div>
              </div>
            </div>
          ))}
          {recentSales.length === 0 && (
            <p style={{ textAlign: 'center', color: '#333' }}>No colors claimed yet. Be the first!</p>
          )}
        </div>
      </div>

      <footer style={{ marginTop: '100px', padding: '20px', borderTop: '1px solid #222', fontSize: '12px', color: '#555', textAlign: 'center', width: '100%' }}>
        <p>© 2026 Hex Land Grab. Entertainment purposes only.</p>
        <p>
          By using this site, you agree to our 
          <a href="/terms" style={{ color: '#777', textDecoration: 'underline', marginLeft: '5px' }}>Terms & Conditions</a>.
        </p>
      </footer>
    </div>
  )
}
