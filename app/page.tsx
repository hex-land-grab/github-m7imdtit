'use client'
import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import { Search, Loader2 } from 'lucide-react'

console.log("Supabase URL ellenőrzése:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "OK" : "HIÁNYZIK");

export default function HexLandGrab() {
  const [hex, setHex] = useState('')
  const [status, setStatus] = useState<'idle' | 'checking' | 'available' | 'sold'>('idle')
  const [ownerData, setOwnerData] = useState<any>(null)
  const [recentSales, setRecentSales] = useState<any[]>([])

  useEffect(() => {
    fetchRecentSales()
  }, [])

  async function fetchRecentSales() {
    const { data } = await supabase.from('sold_colors').select('*').order('purchased_at', { ascending: false }).limit(5)
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
    const { data, error } = await supabase
      .from('sold_colors')
      .select('*')
      .eq('hex_code', cleanHex)
      .single()

    if (data) {
      setStatus('sold')
      setOwnerData(data)
    } else {
      setStatus('available')
    }
  }

  // ITT A TE GUMROAD LINKED VAN BEÁLLÍTVA:
  const gumroadLink = `https://soloflowsystems.gumroad.com/l/zlqosf?custom_fields[Hex Code]=${hex}`

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 font-mono">
      <h1 className="text-4xl md:text-6xl font-bold mb-2 tracking-tighter">HEX LAND GRAB</h1>
      <p className="text-gray-400 mb-12">Birtokolj egy színt. Örökre.</p>

      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-2xl">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-4 text-gray-500" />
          <input
            type="text"
            placeholder="FF0000"
            maxLength={6}
            value={hex}
            onChange={(e) => checkColor(e.target.value)}
            className="w-full bg-black border border-zinc-700 rounded-lg py-3 pl-12 text-xl tracking-widest uppercase focus:outline-none focus:border-green-500 transition-colors"
          />
        </div>

        <div className="min-h-[150px] flex items-center justify-center">
          {status === 'idle' && <span className="text-gray-600">Írj be egy 6 jegyű kódot...</span>}
          
          {status === 'checking' && <Loader2 className="animate-spin text-green-500" />}

          {status === 'available' && (
            <div className="text-center w-full animate-in fade-in">
              <div 
                className="w-full h-24 rounded-lg mb-4 shadow-inner border border-zinc-700" 
                style={{ backgroundColor: `#${hex}` }}
              />
              <p className="text-green-400 font-bold mb-4">SZABAD!</p>
              <a 
                href={gumroadLink}
                target="_blank"
                rel="noreferrer"
                className="block w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg transition-all text-center"
              >
                MEGVESZEM $5-ÉRT 
              </a>
            </div>
          )}

          {status === 'sold' && ownerData && (
            <div className="text-center w-full animate-in fade-in">
              <div 
                className="w-full h-24 rounded-lg mb-4 shadow-inner border border-zinc-700 flex items-center justify-center" 
                style={{ backgroundColor: `#${hex}` }}
              >
                 <span className="bg-black/50 px-2 py-1 rounded text-sm">FOGLALT</span>
              </div>
              <div className="bg-zinc-800 rounded p-3 mb-2">
                <p className="text-xs text-gray-400 uppercase">Tulajdonos</p>
                <p className="text-lg font-bold">{ownerData.owner_name}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-16 w-full max-w-md">
        <h3 className="text-zinc-500 text-sm font-bold uppercase mb-4 tracking-widest">Legutóbbi eladások</h3>
        <div className="space-y-2">
          {recentSales.length === 0 ? (
            <p className="text-zinc-700 text-sm">Még nincs eladott szín.</p>
          ) : (
            recentSales.map((sale) => (
              <div key={sale.hex_code} className="flex items-center justify-between bg-zinc-900 border border-zinc-800 p-3 rounded">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded border border-zinc-700" style={{ backgroundColor: `#${sale.hex_code}` }} />
                  <span className="font-mono text-zinc-300">#{sale.hex_code}</span>
                </div>
                <span className="text-sm text-zinc-500">{sale.owner_name}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}