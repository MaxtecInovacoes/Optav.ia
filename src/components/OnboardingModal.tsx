import React, { useState } from 'react';
import { SegmentType } from '../types/index.js';
import { UserCheck, X, Check, ArrowRight, QrCode, Building, MapPin } from 'lucide-react';

interface OnboardingModalProps {
  onClose: () => void;
  onTenantCreated: (newTenant: any) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onClose, onTenantCreated }) => {
  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState<string>('Agência Crescer Digital');
  const [segment, setSegment] = useState<SegmentType>('restaurante');
  const [region, setRegion] = useState<string>('São Paulo, SP');
  const [loading, setLoading] = useState<boolean>(false);

  const handleFinish = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, segment, region, plan: 'pro' })
      });
      const newTenant = await res.json();
      setLoading(false);
      onTenantCreated(newTenant);
      onClose();
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#020408]/80 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-mono text-xs">
      <div className="bg-[#0A0C14] rounded-lg w-full max-w-md p-5 shadow-2xl border border-slate-800 space-y-4 text-slate-300">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm uppercase">ONBOARDING // NOVO TENANT</h3>
              <p className="text-[10px] text-slate-500">Configuração de workspace em menos de 60 segundos</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-500 hover:text-slate-300 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Wizard Steps indicator */}
        <div className="flex items-center justify-between text-[10px] font-bold">
          <span className={`px-2.5 py-1 rounded border ${step >= 1 ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' : 'bg-[#05070B] text-slate-600 border-slate-800'}`}>
            1. IDENTIDADE
          </span>
          <span className={`px-2.5 py-1 rounded border ${step >= 2 ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' : 'bg-[#05070B] text-slate-600 border-slate-800'}`}>
            2. REGIÃO
          </span>
          <span className={`px-2.5 py-1 rounded border ${step >= 3 ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' : 'bg-[#05070B] text-slate-600 border-slate-800'}`}>
            3. WHATSAPP
          </span>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-3">
            <div>
              <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Nome da Agência / Licenciado</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded bg-[#05070B] border border-slate-800 text-slate-200 font-mono text-xs focus:outline-hidden focus:border-cyan-500/50"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Nicho Principal de Atuação</label>
              <select
                value={segment}
                onChange={(e) => setSegment(e.target.value as SegmentType)}
                className="w-full p-2.5 rounded bg-[#05070B] border border-slate-800 text-slate-200 font-mono text-xs cursor-pointer focus:outline-hidden"
              >
                <option value="restaurante">GASTRONOMIA & RESTAURANTES</option>
                <option value="clinica">SAÚDE & CLÍNICAS ODONTOLÓGICAS</option>
                <option value="oficina">AUTOMOTIVO & OFICINAS MECÂNICAS</option>
                <option value="servicos">SERVIÇOS GERAIS & ESTÉTICA</option>
              </select>
            </div>
            <button
              onClick={() => setStep(2)}
              className="w-full py-2.5 rounded bg-cyan-400 hover:bg-cyan-300 text-cyan-950 font-bold text-xs flex items-center justify-center space-x-2 border border-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.25)] cursor-pointer"
            >
              <span>PRÓXIMO PASSO</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-3">
            <div>
              <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Cidade e Estado de Foco</label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full p-2.5 rounded bg-[#05070B] border border-slate-800 text-slate-200 font-mono text-xs"
              />
            </div>
            <div className="p-2.5 bg-[#05070B] rounded border border-slate-800 text-slate-400 text-[10px]">
              O Scraper Agent focará automaticamente a busca de negócios do Google Maps nesta região.
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 py-2.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs cursor-pointer"
              >
                Voltar
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-2/3 py-2.5 rounded bg-cyan-400 hover:bg-cyan-300 text-cyan-950 font-bold text-xs flex items-center justify-center space-x-2 border border-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.25)] cursor-pointer"
              >
                <span>PRÓXIMO PASSO</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-4 text-center">
            <div className="p-4 bg-[#05070B] rounded border border-slate-800 space-y-2">
              <QrCode className="w-12 h-12 mx-auto text-cyan-400" />
              <p className="font-bold text-white">MEOWHATS REST GATEWAY</p>
              <p className="text-[10px] text-slate-500">
                WhatsApp integrado com sucesso para disparos automáticos do Outreach Agent.
              </p>
            </div>
            <button
              onClick={handleFinish}
              disabled={loading}
              className="w-full py-2.5 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 border border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.25)] cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{loading ? 'CRIANDO TENANT...' : 'CONCLUIR & ACESSAR DASHBOARD'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
