import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

// Supabase kliens inicializálása (szerver oldalon)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Az oldal 60 másodpercenként frissülhet a gyorsítótárból (opcionális optimalizáció)
export const revalidate = 60;

export default async function RegistryPage() {
  // Lekérjük az ÖSSZES eddigi eladást, csökkenő sorrendben
  const { data: colors } = await supabase
    .from('sold_colors')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Full Registry</h1>
            <p className="text-gray-400">The complete, immutable ledger of all owned colors.</p>
          </div>
          <Link href="/" className="text-sm px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
            &larr; Back to Home
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {colors?.map((color) => (
            <div key={color.id} className="bg-black/50 border border-white/10 rounded-xl p-4 flex items-center gap-4 hover:border-white/30 transition-colors">
              <div 
                className="w-12 h-12 rounded-full flex-shrink-0 shadow-lg border border-white/5"
                style={{ backgroundColor: color.hex_code }}
              />
              <div className="overflow-hidden">
                <p className="font-mono text-xs text-gray-500">{color.hex_code.toUpperCase()}</p>
                <p className="font-bold truncate text-sm">{color.owner_name}</p>
                {color.city && <p className="text-xs text-gray-400 truncate">{color.city}</p>}
              </div>
            </div>
          ))}
          
          {(!colors || colors.length === 0) && (
            <p className="text-gray-500">The registry is currently empty.</p>
          )}
        </div>
      </div>
    </div>
  );
}
