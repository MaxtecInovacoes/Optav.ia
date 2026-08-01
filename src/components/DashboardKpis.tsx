import React from 'react';
import { Users, Globe, Send, Flame, DollarSign, Activity, Brain, ArrowUpRight } from 'lucide-react';

interface KpisData {
  totalLeads: number;
  sitesDeployed: number;
  messagedCount: number;
  hotLeads: number;
  conversionRate: number;
  totalSales: number;
  learningsCount: number;
  averageSiteHealth: number;
}

interface DashboardKpisProps {
  kpis: KpisData;
  onRunLearnerCycle: () => void;
}

export const DashboardKpis: React.FC<DashboardKpisProps> = ({ kpis, onRunLearnerCycle }) => {
  return (
    <div className="w-full space-y-3 font-mono">
      {/* Top Banner Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#0A0C14] border border-slate-800 rounded-lg p-3.5 text-slate-300 gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-white flex items-center space-x-2">
              <span>SYSTEM TELEMETRY // PIPELINE RUNTIME</span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                ● AGENTS_ONLINE
              </span>
            </h2>
            <p className="text-[11px] text-slate-500">
              Scraper Maps, Persona Engine, Site Builder, Outreach & Learner Agents em execução autônoma.
            </p>
          </div>
        </div>

        <button
          onClick={onRunLearnerCycle}
          className="px-3 py-1.5 rounded text-xs font-bold text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all flex items-center space-x-2 shrink-0 cursor-pointer shadow-[0_0_8px_rgba(6,182,212,0.15)]"
        >
          <Brain className="w-3.5 h-3.5" />
          <span>Executar Learner Cycle</span>
        </button>
      </div>

      {/* High Density Metric Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {/* Scraped Leads */}
        <div className="bg-[#0A0C14] p-3 rounded-lg border border-slate-800 space-y-1.5 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase tracking-wider">
            <span>Leads Scrapados</span>
            <Users className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">{kpis.totalLeads}</div>
          <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-500 w-[85%]"></div>
          </div>
          <div className="text-[10px] text-slate-500 flex items-center justify-between pt-0.5">
            <span className="text-cyan-400">Google Maps</span>
            <span className="text-[9px] text-slate-600">85% QUAL</span>
          </div>
        </div>

        {/* Sites Deployed */}
        <div className="bg-[#0A0C14] p-3 rounded-lg border border-slate-800 space-y-1.5 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase tracking-wider">
            <span>Sites no Ar</span>
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">{kpis.sitesDeployed}</div>
          <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 w-[100%]"></div>
          </div>
          <div className="text-[10px] text-slate-500 flex items-center justify-between pt-0.5">
            <span className="text-indigo-400">Cloudflare Pages</span>
            <span className="text-[9px] text-emerald-400">100% DEPLOYED</span>
          </div>
        </div>

        {/* WhatsApp Outreach */}
        <div className="bg-[#0A0C14] p-3 rounded-lg border border-slate-800 space-y-1.5 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase tracking-wider">
            <span>Abordagens WA</span>
            <Send className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">{kpis.messagedCount}</div>
          <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 w-[72%]"></div>
          </div>
          <div className="text-[10px] text-slate-500 flex items-center justify-between pt-0.5">
            <span className="text-emerald-400">Meowhats REST</span>
            <span className="text-[9px] text-slate-600">72% SENT</span>
          </div>
        </div>

        {/* Hot Leads / Conversion */}
        <div className="bg-[#0A0C14] p-3 rounded-lg border border-slate-800 space-y-1.5 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase tracking-wider">
            <span>Leads Quentes</span>
            <Flame className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-400 font-mono">{kpis.hotLeads}</div>
          <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 w-[48%]"></div>
          </div>
          <div className="text-[10px] text-emerald-400 flex items-center justify-between pt-0.5">
            <span className="flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-0.5" />
              <span>{kpis.conversionRate}% CONV</span>
            </span>
            <span className="text-[9px] text-slate-600">HOT</span>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-[#0A0C14] p-3 rounded-lg border border-slate-800 space-y-1.5 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase tracking-wider">
            <span>Contratos Realizados</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-extrabold text-white font-mono truncate">
            R$ {kpis.totalSales.toLocaleString('pt-BR')}
          </div>
          <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 w-[90%]"></div>
          </div>
          <div className="text-[10px] text-slate-500 flex items-center justify-between pt-0.5">
            <span>Valor Total</span>
            <span className="text-[9px] text-emerald-400">CLOSED</span>
          </div>
        </div>

        {/* Learner Patterns */}
        <div className="bg-[#0A0C14] p-3 rounded-lg border border-slate-800 space-y-1.5 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase tracking-wider">
            <span>Learner Patterns</span>
            <Brain className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-purple-400 font-mono">{kpis.learningsCount}</div>
          <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 w-[95%]"></div>
          </div>
          <div className="text-[10px] text-purple-400 flex items-center justify-between pt-0.5">
            <span>Injetados System</span>
            <span className="text-[9px] text-purple-400">PROMPTS_UPDATED</span>
          </div>
        </div>
      </div>
    </div>
  );
};
