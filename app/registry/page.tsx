'use client'
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { Search, Loader2, ArrowLeft } from 'lucide-react';

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
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 font-sans relative overflow-hidden">
      
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
            <p className="text-gray-400 font-medium">The complete, immutable ledger of all owned colors.</p>
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
            
            {!loading && filteredColors.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500 border border-dashed border-white/10 rounded-3xl">
                <p className="text-lg mb-2">No matching colors found.</p>
                <p className="text-sm">Try searching for a different name, city, or hex code.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
