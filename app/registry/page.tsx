'use client'
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { Search, Loader2, ArrowLeft, Sparkles } from 'lucide-react';

// Supabase kliens inicializálása
const S_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const S_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(S_URL, S_KEY);

export default function RegistryPage() {
  const [colors, setColors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Adatok betöltése
  useEffect(() => {
    const fetchColors = async () => {
      const { data } = await supabase
        .from('sold_colors')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) setColors(data);
      setLoading(false);
    };

    fetchColors();
  }, []);

  // Valós idejű szűrés (Hex, Név, vagy Város alapján)
  const filteredColors = colors.filter((color) => {
    const term = searchTerm.toLowerCase();
    const hexMatch = color.hex_code.toLowerCase().includes(term);
    const nameMatch = color.owner_name && color.owner_name.toLowerCase().includes(term);
    const cityMatch = color.city && color.city.toLowerCase().includes(term);
    
    return hexMatch || nameMatch || cityMatch;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 font-sans relative overflow-hidden pb-32">
      
      {/* Háttér effekt */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 0,
        background: 'radial-gradient(circle at top, rgba(255,255,255,0.03), transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Fejléc és Vissza gomb */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
              Full Registry
            </h1>
            <p className="text-gray-400 font-medium">The complete, public ledger of all owned colors.</p>
          </div>
          <Link href="/" className="inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white text-gray-300 transition-all">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>

        {/* KERESŐSÁV */}
        <div className="mb-10 relative max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by Hex, Owner Name, or City..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0f172a]/60 border border-white/10 text-white rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all backdrop-blur-md"
          />
          {searchTerm && (
            <div className="absolute top-full left-0 mt-2 text-sm text-gray-400">
              Found {filteredColors.length} result(s)
            </div>
          )}
        </div>
        
        {/* TÖLTÉS JELZŐ */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="h-10 w-10 animate-spin mb-4 text-blue-500" />
            <p>Loading the global ledger...</p>
          </div>
        ) : (
          /* KÁRTYÁK RÁCSA */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredColors.map((color) => {
              const rawHex = color.hex_code.replace('#', '');
              return (
                <Link 
                  key={color.id} 
                  href={`/color/${rawHex}`}
                  className="bg-[#0f172a]/40 border border-white/5 rounded-2xl p-4 flex items-center gap-4 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] transition-all cursor-pointer group backdrop-blur-sm"
                >
                  <div 
                    className="w-14 h-14 rounded-full flex-shrink-0 shadow-lg border border-white/10 group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: color.hex_code }}
                  />
                  <div className="overflow-hidden">
                    <p className="font-mono text-xs text-gray-400 font-bold mb-0.5 tracking-wider">{color.hex_code.toUpperCase()}</p>
                    <p className="font-bold truncate text-sm text-white">{color.owner_name}</p>
                    {color.city && <p className="text-xs text-gray-500 truncate">{color.city}</p>}
                  </div>
                </Link>
              )
            })}
            
            {/* ÚJ: EMPTY STATE KONVERZIÓ */}
            {!loading && filteredColors.length === 0 && (
              <div className="col-span-full py-16 px-4 text-center border border-dashed border-blue-500/30 bg-blue-500/5 rounded-3xl backdrop-blur-sm">
                <Sparkles className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <p className="text-xl md:text-2xl font-bold text-white mb-2">No matching colors found.</p>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">Good news! This means the color you are looking for might still be available in the global registry.</p>
                <Link href="/" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all hover:scale-105">
                  Check Availability & Claim &rarr;
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ÚJ: LEBEGŐ VÁSÁRLÁSI HUROK (FLOATING CTA) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 z-50 flex justify-center pointer-events-none">
        <div className="bg-[#0f172a]/90 backdrop-blur-xl border border-white/10 p-4 md:px-8 md:py-4 rounded-3xl md:rounded-full shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center gap-4 pointer-events-auto transform transition-transform hover:scale-[1.02]">
          <p className="text-gray-300 font-medium text-sm md:text-base text-center">
            Inspired by these colors? <span className="text-white font-bold">Secure your own unique hex code.</span>
          </p>
          <Link href="/" className="bg-white text-black hover:bg-gray-200 font-bold py-2.5 px-6 rounded-full whitespace-nowrap shadow-lg transition-colors flex items-center gap-2">
            Claim a Color <ArrowLeft size={16} className="rotate-180" />
          </Link>
        </div>
      </div>

    </div>
  );
}
