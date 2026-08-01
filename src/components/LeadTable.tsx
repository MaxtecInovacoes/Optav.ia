import React, { useState } from 'react';
import { Lead, SegmentType, FunnelStatus } from '../types/index.js';
import { Search, Filter, Play, Edit, MessageSquare, Globe, ExternalLink, Calendar, DollarSign, Star } from 'lucide-react';

interface LeadTableProps {
  leads: Lead[];
  onRunPipeline: (leadId: string) => void;
  onOpenSiteEditor: (leadId: string) => void;
  onOpenChat: (leadId: string) => void;
  loadingLeadId: string | null;
}

export const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  onRunPipeline,
  onOpenSiteEditor,
  onOpenChat,
  loadingLeadId
}) => {
  const [search, setSearch] = useState('');
  const [selectedSegment, setSelectedSegment] = useState<string>('todos');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [minVal, setMinVal] = useState<string>('');

  const filteredLeads = leads.filter((l) => {
    if (search) {
      const q = search.toLowerCase();
      const match = l.name.toLowerCase().includes(q) || l.address.toLowerCase().includes(q) || l.category.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (selectedSegment !== 'todos' && l.segment !== selectedSegment) return false;
    if (selectedStatus !== 'todos' && l.pipelineStatus !== selectedStatus) return false;
    if (minVal && (l.saleValue || 0) < Number(minVal)) return false;
    return true;
  });

  return (
    <div className="w-full bg-[#0A0C14] rounded-lg border border-slate-800 p-4 space-y-4 font-mono text-xs text-slate-300">
      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#05070B] p-3 rounded border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="FILTER_LEADS [Nome, Endereço, Categoria]..."
            className="w-full pl-8 pr-3 py-1.5 rounded bg-[#0A0C14] border border-slate-800 text-slate-200 font-mono text-xs placeholder:text-slate-600 focus:outline-hidden focus:border-cyan-500/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Segment Filter */}
          <select
            value={selectedSegment}
            onChange={(e) => setSelectedSegment(e.target.value)}
            className="px-2.5 py-1.5 rounded bg-[#0A0C14] border border-slate-800 text-slate-300 text-xs font-mono cursor-pointer focus:outline-hidden"
          >
            <option value="todos">SEG: TODOS</option>
            <option value="restaurante">SEG: RESTAURANTE</option>
            <option value="clinica">SEG: CLÍNICA</option>
            <option value="oficina">SEG: OFICINA</option>
            <option value="servicos">SEG: SERVIÇOS</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 rounded bg-[#0A0C14] border border-slate-800 text-slate-300 text-xs font-mono cursor-pointer focus:outline-hidden"
          >
            <option value="todos">STATUS: TODOS</option>
            <option value="aguardando">AGUARDANDO</option>
            <option value="followup_1">1º CONTATO</option>
            <option value="followup_2">SEGUINDO</option>
            <option value="lead_frio">ESFRIOU</option>
            <option value="lead_quente">QUALIFICADO / VENDA</option>
            <option value="perdido">PERDIDO</option>
          </select>

          {/* Min Value Input */}
          <input
            type="number"
            value={minVal}
            onChange={(e) => setMinVal(e.target.value)}
            placeholder="MIN_VAL (R$)"
            className="w-28 px-2.5 py-1.5 rounded bg-[#0A0C14] border border-slate-800 text-slate-200 font-mono text-xs placeholder:text-slate-600"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto border border-slate-800 rounded">
        <table className="w-full text-left border-collapse font-mono text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-500 bg-[#05070B] uppercase tracking-wider text-[10px]">
              <th className="py-2.5 px-3">Empresa / Categoria</th>
              <th className="py-2.5 px-3">Segmento & Nota</th>
              <th className="py-2.5 px-3">Saúde do Site</th>
              <th className="py-2.5 px-3">Status Funil</th>
              <th className="py-2.5 px-3">Valor Estimado</th>
              <th className="py-2.5 px-3">Site Deploy</th>
              <th className="py-2.5 px-3 text-right">Ações Agente</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-slate-300">
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-600 italic">
                  [ NENHUM RECORD LOCALIZADO COM OS FILTROS SELECIONADOS ]
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => {
                const isLoading = loadingLeadId === lead.id;

                return (
                  <tr key={lead.id} className="hover:bg-[#0D1018] transition-colors">
                    {/* Lead Name & Category */}
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-white text-xs">{lead.name}</div>
                      <div className="text-[10px] text-slate-500 uppercase">{lead.category}</div>
                      <div className="text-[10px] text-slate-600 truncate max-w-xs">{lead.address}</div>
                    </td>

                    {/* Segment & Rating */}
                    <td className="py-2.5 px-3">
                      <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-slate-800 text-cyan-400 border border-slate-700 mb-1">
                        {lead.segment}
                      </span>
                      <div className="flex items-center space-x-1 text-slate-400 text-[10px]">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span>{lead.rating} ({lead.reviewsCount})</span>
                      </div>
                    </td>

                    {/* Site Health Score */}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
                            lead.siteHealthScore < 40 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          HEALTH {lead.siteHealthScore}/100
                        </span>
                      </div>
                    </td>

                    {/* Pipeline Status */}
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          lead.pipelineStatus === 'lead_quente'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : lead.pipelineStatus === 'perdido'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                        }`}
                      >
                        {lead.pipelineStatus}
                      </span>
                    </td>

                    {/* Value */}
                    <td className="py-2.5 px-3 font-bold text-cyan-400">
                      R$ {(lead.saleValue || 1200).toLocaleString('pt-BR')}
                    </td>

                    {/* Site Created / Live Link */}
                    <td className="py-2.5 px-3">
                      {lead.siteUrl ? (
                        <a
                          href={lead.siteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-cyan-400 font-bold hover:underline flex items-center space-x-1"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>VER SITE</span>
                        </a>
                      ) : (
                        <span className="text-slate-600 italic text-[10px]">[ PENDENTE ]</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => onRunPipeline(lead.id)}
                          disabled={isLoading}
                          className="p-1 rounded bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/30 font-bold text-xs flex items-center space-x-1 cursor-pointer"
                          title="Executar Pipeline Completa de Agentes"
                        >
                          <Play className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                          <span className="hidden sm:inline">Executar</span>
                        </button>

                        <button
                          onClick={() => onOpenSiteEditor(lead.id)}
                          className="p-1 rounded bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30 font-bold cursor-pointer"
                          title="Editor Visual de Site"
                        >
                          <Edit className="w-3 h-3" />
                        </button>

                        <button
                          onClick={() => onOpenChat(lead.id)}
                          className="p-1 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 font-bold cursor-pointer"
                          title="Conversa WhatsApp SDR"
                        >
                          <MessageSquare className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
