import React, { useState } from 'react';
import { Search, X, Loader2, CheckCircle2, MapPin, Building, Globe } from 'lucide-react';

interface ScraperModalProps {
  tenantId: string;
  onClose: () => void;
  onScrapeSuccess: () => void;
}

export const ScraperModal: React.FC<ScraperModalProps> = ({ tenantId, onClose, onScrapeSuccess }) => {
  const [keyword, setKeyword] = useState('Restaurantes Italianos');
  const [city, setCity] = useState('São Paulo, SP');
  const [maxResults, setMaxResults] = useState(3);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);

  const handleRunScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResults(null);

    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId, keyword, city, maxResults })
      });
      const data = await res.json();
      setResults(data.leads || []);
      setLoading(false);
      onScrapeSuccess();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#020408]/80 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-mono text-xs">
      <div className="bg-[#0A0C14] rounded-lg w-full max-w-lg p-5 shadow-2xl border border-slate-800 space-y-4 text-slate-300">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm uppercase">SCRAPER MAPS // GOOGLE PLACES</h3>
              <p className="text-[10px] text-slate-500">Scraper Agent identifica empresas sem site ou com site obsoleto</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-500 hover:text-slate-300 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleRunScrape} className="space-y-3">
          <div>
            <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Nicho / Palavra-Chave</label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Ex: Pizzaria, Clínica Odontológica, Oficina Mecânica"
              className="w-full p-2.5 rounded bg-[#05070B] border border-slate-800 text-slate-200 font-mono text-xs focus:outline-hidden focus:border-cyan-500/50"
              required
            />
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Cidade / Região</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ex: São Paulo - SP, Rio de Janeiro - RJ"
              className="w-full p-2.5 rounded bg-[#05070B] border border-slate-800 text-slate-200 font-mono text-xs"
              required
            />
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Quantidade Máxima por Busca</label>
            <select
              value={maxResults}
              onChange={(e) => setMaxResults(Number(e.target.value))}
              className="w-full p-2.5 rounded bg-[#05070B] border border-slate-800 text-slate-200 font-mono text-xs cursor-pointer"
            >
              <option value={3}>3 LEADS QUALIFICADOS</option>
              <option value={5}>5 LEADS QUALIFICADOS</option>
              <option value={10}>10 LEADS QUALIFICADOS</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded font-mono font-bold text-cyan-950 bg-cyan-400 hover:bg-cyan-300 border border-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.25)] transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>EXECUTANDO SCRAPER MAPS...</span>
              </>
            ) : (
              <>
                <Search className="w-3.5 h-3.5" />
                <span>INICIAR SCRAPING EM TEMPO REAL</span>
              </>
            )}
          </button>
        </form>

        {results && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded space-y-2 text-xs">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>SCRAPING CONCLUÍDO: {results.length} NOVOS LEADS</span>
            </div>
            <div className="space-y-1">
              {results.map((r: any) => (
                <div key={r.id} className="text-slate-300 flex items-center justify-between font-mono text-[11px]">
                  <span>• {r.name}</span>
                  <span className="text-[10px] text-cyan-400">SCORE {r.siteHealthScore}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
