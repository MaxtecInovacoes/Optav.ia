import React, { useState, useEffect } from 'react';
import { SiteData, Lead } from '../types/index.js';
import { CinematicSiteView } from './CinematicSiteView.js';
import { X, Save, Sparkles, RefreshCw, Palette, Type, LayoutList, Layers, ExternalLink, Plus, Code, Cpu, ShieldCheck } from 'lucide-react';

interface SiteEditorModalProps {
  leadId: string;
  lead: Lead | undefined;
  onClose: () => void;
  onSaveSite: (leadId: string, updatedSite: Partial<SiteData>) => Promise<void>;
  onAddAiSection: (leadId: string, promptText: string) => Promise<void>;
}

export const SiteEditorModal: React.FC<SiteEditorModalProps> = ({
  leadId,
  lead,
  onClose,
  onSaveSite,
  onAddAiSection
}) => {
  const [site, setSite] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [addingSection, setAddingSection] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'prd'>('editor');
  const [selectedProvider, setSelectedProvider] = useState<'openai' | 'anthropic' | 'nvidia' | 'assembly-engine'>('assembly-engine');

  useEffect(() => {
    fetch(`/api/sites/${leadId}`)
      .then((res) => res.json())
      .then((data) => {
        setSite(data);
        if (data.provider) setSelectedProvider(data.provider);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [leadId]);

  if (!lead) return null;

  const handleSave = async () => {
    if (!site) return;
    setSaving(true);
    try {
      await onSaveSite(leadId, {
        copy: site.copy,
        colors: site.colors,
        fonts: site.fonts,
        sections: site.sections,
        provider: selectedProvider
      });
      setSaving(false);
    } catch (e) {
      console.error(e);
      setSaving(false);
    }
  };

  const handleAiSectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    setAddingSection(true);
    try {
      await onAddAiSection(leadId, aiPrompt);
      // Refresh site
      const res = await fetch(`/api/sites/${leadId}`);
      const refreshed = await res.json();
      setSite(refreshed);
      setAiPrompt('');
      setAddingSection(false);
    } catch (e) {
      console.error(e);
      setAddingSection(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#020408]/80 backdrop-blur-xs flex items-center justify-center z-50 p-2 md:p-4 font-mono text-xs">
      <div className="bg-[#0A0C14] border border-slate-800 rounded-lg w-full max-w-7xl h-[92vh] flex flex-col overflow-hidden shadow-2xl text-slate-300">
        {/* Editor Top Bar */}
        <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-[#05070B] shrink-0">
          <div className="flex items-center space-x-4">
            <div className="p-1.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-bold text-sm text-white uppercase tracking-tight">HERMES ENGINE // DESIGNER PRD PIPELINE</h2>
                <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold">
                  {selectedProvider.toUpperCase()}
                </span>
              </div>
              <p className="text-[10px] text-slate-500">
                Arquitetura E2E de Exclusividade & Personalização para <strong className="text-cyan-400">{lead.name}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* View Mode Tabs */}
            <div className="flex bg-[#0A0C14] p-0.5 rounded border border-slate-800">
              <button
                onClick={() => setActiveTab('editor')}
                className={`px-3 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                  activeTab === 'editor' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                EDITOR VISUAL
              </button>
              <button
                onClick={() => setActiveTab('prd')}
                className={`px-3 py-1 rounded text-[11px] font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                  activeTab === 'prd' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Code className="w-3 h-3" />
                <span>INSPECTOR PRD (ARQUITETO)</span>
              </button>
            </div>

            {site?.deployedUrl && (
              <a
                href={site.deployedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded bg-[#0A0C14] hover:bg-slate-800 text-[11px] font-mono text-slate-300 border border-slate-800 flex items-center space-x-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                <span>Ver no Ar</span>
              </a>
            )}

            <button
              onClick={handleSave}
              disabled={saving || !site}
              className="px-3.5 py-1.5 rounded font-mono font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 border border-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.25)] flex items-center space-x-1.5 cursor-pointer transition-all"
            >
              <Save className={`w-3.5 h-3.5 ${saving ? 'animate-spin' : ''}`} />
              <span>{saving ? 'SALVANDO...' : 'SALVAR & DEPLOY'}</span>
            </button>

            <button onClick={onClose} className="p-1.5 rounded bg-[#0A0C14] border border-slate-800 text-slate-500 hover:text-slate-300">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Split Screen Container */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Controls Panel */}
          <div className="w-full md:w-[380px] bg-[#05070B] border-r border-slate-800 p-4 overflow-y-auto space-y-4 shrink-0 text-xs">
            {loading || !site ? (
              <div className="p-8 text-center text-slate-500 space-y-2">
                <RefreshCw className="w-5 h-5 animate-spin mx-auto text-cyan-400" />
                <p>[ CARREGANDO MOTOR DE PIPELINE... ]</p>
              </div>
            ) : activeTab === 'prd' ? (
              /* PRD Inspector View */
              <div className="space-y-4">
                <div className="bg-[#0A0C14] p-3.5 rounded border border-purple-500/30 space-y-2">
                  <div className="flex items-center space-x-2 text-purple-400 font-bold text-[11px] uppercase">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>SELETOR DE PROVEDOR LLM</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Selecione qual motor utilizar para o Arquiteto e o Component Assembler:
                  </p>
                  <select
                    value={selectedProvider}
                    onChange={(e) => setSelectedProvider(e.target.value as any)}
                    className="w-full p-2 rounded bg-[#05070B] border border-slate-800 text-slate-200 font-mono text-xs focus:border-purple-500/50"
                  >
                    <option value="assembly-engine">Hermes Native Component Engine (Auto)</option>
                    <option value="openai">OpenAI GPT-4o / O3 API</option>
                    <option value="anthropic">Anthropic Claude 3.7 Sonnet API</option>
                    <option value="nvidia">NVIDIA NIM Free API</option>
                  </select>
                </div>

                <div className="bg-[#0A0C14] p-3.5 rounded border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-white text-[11px] uppercase">JSON PRD DO ARQUITETO</span>
                    <span className="text-[10px] text-emerald-400 font-bold">DNA: {site.prd?.archetype || 'custom'}</span>
                  </div>
                  <pre className="p-3 bg-[#030508] border border-slate-900 rounded text-[10px] text-purple-300 font-mono overflow-x-auto max-h-[380px] leading-relaxed">
                    {JSON.stringify(site.prd || { archetype: site.template, colors: site.colors, layout: 'split-hero' }, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              /* Visual Editor View */
              <>
                {/* AI Section Prompt Box */}
                <div className="bg-[#0A0C14] p-3.5 rounded border border-slate-800 space-y-2.5">
                  <div className="flex items-center space-x-1.5 text-cyan-400 font-bold text-[11px]">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>INJETAR SEÇÃO VIA HERMES ENGINE</span>
                  </div>
                  <form onSubmit={handleAiSectionSubmit} className="space-y-2">
                    <input
                      type="text"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="ex: adicionar tabela de preços e diferenciais"
                      className="w-full px-2.5 py-2 rounded bg-[#05070B] border border-slate-800 text-slate-200 placeholder-slate-600 font-mono text-[11px] focus:outline-hidden focus:border-cyan-500/50"
                    />
                    <button
                      type="submit"
                      disabled={addingSection || !aiPrompt.trim()}
                      className="w-full py-1.5 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30 text-[11px] flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{addingSection ? 'GERANDO...' : 'INJETAR SEÇÃO AI'}</span>
                    </button>
                  </form>
                </div>

                {/* Text Copy Controls */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-1.5 font-bold text-white text-[11px] uppercase border-b border-slate-800 pb-2">
                    <Type className="w-3.5 h-3.5 text-amber-400" />
                    <span>TEXTOS & TÍTULOS PRINCIPAIS</span>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Hero Title</label>
                    <input
                      type="text"
                      value={site.copy.heroTitle}
                      onChange={(e) =>
                        setSite({ ...site, copy: { ...site.copy, heroTitle: e.target.value } })
                      }
                      className="w-full p-2 rounded bg-[#0A0C14] border border-slate-800 text-slate-200 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Hero Subtitle</label>
                    <textarea
                      rows={2}
                      value={site.copy.heroSubtitle}
                      onChange={(e) =>
                        setSite({ ...site, copy: { ...site.copy, heroSubtitle: e.target.value } })
                      }
                      className="w-full p-2 rounded bg-[#0A0C14] border border-slate-800 text-slate-200 font-mono text-xs"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Texto Seção Sobre</label>
                    <textarea
                      rows={3}
                      value={site.copy.aboutText}
                      onChange={(e) =>
                        setSite({ ...site, copy: { ...site.copy, aboutText: e.target.value } })
                      }
                      className="w-full p-2 rounded bg-[#0A0C14] border border-slate-800 text-slate-200 font-mono text-xs"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Texto do Botão CTA</label>
                    <input
                      type="text"
                      value={site.copy.ctaText}
                      onChange={(e) =>
                        setSite({ ...site, copy: { ...site.copy, ctaText: e.target.value } })
                      }
                      className="w-full p-2 rounded bg-[#0A0C14] border border-slate-800 text-slate-200 font-mono text-xs"
                    />
                  </div>
                </div>

                {/* Color Palette Controls */}
                <div className="space-y-2.5">
                  <div className="flex items-center space-x-1.5 font-bold text-white text-[11px] uppercase border-b border-slate-800 pb-2">
                    <Palette className="w-3.5 h-3.5 text-emerald-400" />
                    <span>PALETA DE CORES</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-slate-400 text-[10px] uppercase mb-1">Cor Primária</label>
                      <input
                        type="color"
                        value={site.colors.primary}
                        onChange={(e) =>
                          setSite({ ...site, colors: { ...site.colors, primary: e.target.value } })
                        }
                        className="w-full h-8 rounded bg-[#0A0C14] border border-slate-800 cursor-pointer p-0.5"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 text-[10px] uppercase mb-1">Cor Secundária</label>
                      <input
                        type="color"
                        value={site.colors.secondary}
                        onChange={(e) =>
                          setSite({ ...site, colors: { ...site.colors, secondary: e.target.value } })
                        }
                        className="w-full h-8 rounded bg-[#0A0C14] border border-slate-800 cursor-pointer p-0.5"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right Live Preview Area */}
          <div className="flex-1 bg-[#020408] p-4 overflow-y-auto">
            {site && (
              <div className="w-full max-w-5xl mx-auto rounded overflow-hidden shadow-2xl border border-slate-800 bg-white min-h-full">
                <CinematicSiteView
                  site={site}
                  leadName={lead.name}
                  leadPhone={lead.phone}
                  leadAddress={lead.address}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

