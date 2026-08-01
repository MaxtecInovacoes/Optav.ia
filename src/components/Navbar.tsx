import React from 'react';
import { Tenant } from '../types/index.js';
import { Sparkles, Search, Layers, Shield, UserCheck, Plus, CheckCircle2, Zap } from 'lucide-react';

interface NavbarProps {
  tenants: Tenant[];
  currentTenantId: string;
  onSelectTenant: (id: string) => void;
  onOpenScraperModal: () => void;
  onOpenOnboardingModal: () => void;
  onOpenSuperAdminModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  tenants,
  currentTenantId,
  onSelectTenant,
  onOpenScraperModal,
  onOpenOnboardingModal,
  onOpenSuperAdminModal
}) => {
  const currentTenant = tenants.find((t) => t.id === currentTenantId) || tenants[0];

  return (
    <header className="w-full bg-[#0A0C14] border-b border-slate-800 text-slate-300 px-4 py-2.5 flex items-center justify-between sticky top-0 z-50 shrink-0 font-mono">
      {/* Brand & Logo */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-5 h-5 bg-cyan-500 flex items-center justify-center rounded-xs rotate-45 shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.4)]">
            <div className="w-2 h-2 bg-black rounded-full"></div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-white font-black tracking-tight text-base">
              OPTAV<span className="text-cyan-400">.IA</span>
            </span>
            <span className="bg-slate-800 text-cyan-400 text-[9px] font-bold px-1.5 py-0.5 rounded border border-slate-700">
              v4.2_MULTI
            </span>
          </div>
        </div>

        {/* Telemetry Status Items */}
        <div className="hidden lg:flex items-center space-x-3 text-[10px] tracking-wider text-slate-500 border-l border-slate-800 pl-4">
          <span className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_5px_#10b981]"></span>
            <span className="text-slate-300">US-EAST-CLUSTER</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_5px_#10b981]"></span>
            <span className="text-slate-300">DB_SYNC_ACTIVE</span>
          </span>
          <span className="bg-[#05070B] px-2 py-0.5 rounded border border-slate-800 text-slate-400">
            LATENCY: 14MS
          </span>
        </div>
      </div>

      {/* Tenant Selector & Actions */}
      <div className="flex items-center space-x-2.5">
        {/* Tenant Selector */}
        <div className="flex items-center space-x-2 bg-[#05070B] border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-300">
          <Layers className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <select
            value={currentTenantId}
            onChange={(e) => onSelectTenant(e.target.value)}
            className="bg-transparent font-mono text-xs text-white focus:outline-hidden cursor-pointer pr-1"
          >
            {tenants.map((t) => (
              <option key={t.id} value={t.id} className="bg-[#0A0C14] text-slate-200">
                {t.name} [{t.segment.toUpperCase()}]
              </option>
            ))}
          </select>
          {currentTenant && (
            <span className="px-1.5 py-0.5 text-[9px] rounded font-mono font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              {currentTenant.plan}
            </span>
          )}
        </div>

        {/* Quick Onboarding Trigger */}
        <button
          onClick={onOpenOnboardingModal}
          className="hidden md:flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-mono bg-[#05070B] hover:bg-slate-800/80 text-slate-300 border border-slate-800 transition-colors cursor-pointer"
        >
          <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
          <span>+Tenant</span>
        </button>

        {/* Scraper Job Trigger */}
        <button
          onClick={onOpenScraperModal}
          className="flex items-center space-x-1.5 px-3 py-1 rounded text-xs font-mono font-bold text-cyan-950 bg-cyan-400 hover:bg-cyan-300 border border-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.25)] transition-all cursor-pointer"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Scraper Maps</span>
        </button>

        {/* Super Admin Modal Trigger */}
        <button
          onClick={onOpenSuperAdminModal}
          className="flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-mono bg-[#05070B] hover:bg-slate-800 text-amber-400 border border-amber-500/30 transition-colors cursor-pointer"
          title="Painel Super Admin & Prompts"
        >
          <Shield className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">SuperAdmin</span>
        </button>
      </div>
    </header>
  );
};
