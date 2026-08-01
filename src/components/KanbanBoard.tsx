import React, { useState } from 'react';
import { Lead, FunnelStatus } from '../types/index.js';
import { Play, Globe, MessageSquare, Edit, AlertCircle, X, DollarSign, CheckCircle, Clock } from 'lucide-react';

interface KanbanBoardProps {
  leads: Lead[];
  onStatusChange: (leadId: string, newStatus: FunnelStatus, reasonData?: { reason: string; notes: string; valueLost?: number }) => void;
  onRunPipeline: (leadId: string) => void;
  onOpenSiteEditor: (leadId: string) => void;
  onOpenChat: (leadId: string) => void;
  loadingLeadId: string | null;
}

const columns: Array<{ status: FunnelStatus; title: string; color: string; borderColor: string; badgeBg: string }> = [
  { status: 'aguardando', title: 'FILA [AGUARDANDO]', color: 'text-slate-400', borderColor: 'border-slate-800', badgeBg: 'bg-slate-800 text-slate-300' },
  { status: 'followup_1', title: '1º CONTATO [ENVIADO]', color: 'text-cyan-400', borderColor: 'border-cyan-500/30', badgeBg: 'bg-cyan-500/10 text-cyan-400' },
  { status: 'followup_2', title: '2º CONTATO [SEGUINDO]', color: 'text-blue-400', borderColor: 'border-blue-500/30', badgeBg: 'bg-blue-500/10 text-blue-400' },
  { status: 'lead_frio', title: 'ESFRIOU [>7 DIAS]', color: 'text-amber-400', borderColor: 'border-amber-500/30', badgeBg: 'bg-amber-500/10 text-amber-400' },
  { status: 'lead_quente', title: 'QUALIFICADO / VENDA', color: 'text-emerald-400', borderColor: 'border-emerald-500/30', badgeBg: 'bg-emerald-500/10 text-emerald-400' },
  { status: 'perdido', title: 'PERDIDO [LOST]', color: 'text-rose-400', borderColor: 'border-rose-500/30', badgeBg: 'bg-rose-500/10 text-rose-400' }
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  leads,
  onStatusChange,
  onRunPipeline,
  onOpenSiteEditor,
  onOpenChat,
  loadingLeadId
}) => {
  const [lostModalLeadId, setLostModalLeadId] = useState<string | null>(null);
  const [lostReason, setLostReason] = useState<string>('preço');
  const [lostNotes, setLostNotes] = useState<string>('');
  const [lostValue, setLostValue] = useState<number>(1500);

  const handleOpenLostModal = (leadId: string) => {
    const lead = leads.find((l) => l.id === leadId);
    setLostModalLeadId(leadId);
    setLostValue(lead?.saleValue || 1500);
  };

  const handleConfirmLost = () => {
    if (lostModalLeadId) {
      onStatusChange(lostModalLeadId, 'perdido', {
        reason: lostReason,
        notes: lostNotes,
        valueLost: lostValue
      });
      setLostModalLeadId(null);
      setLostNotes('');
    }
  };

  return (
    <div className="w-full max-w-full space-y-4 font-mono overflow-hidden">
      {/* Kanban Column Layout - Responsive Scrollable Grid */}
      <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
        <div className="flex space-x-3 min-w-max pb-2">
          {columns.map((col) => {
            const colLeads = leads.filter((l) => l.pipelineStatus === col.status);
            const colTotalValue = colLeads.reduce((acc, curr) => acc + (curr.saleValue || 0), 0);

            return (
              <div key={col.status} className={`w-[250px] lg:w-[270px] shrink-0 p-3 rounded-lg bg-[#0A0C14] border ${col.borderColor} flex flex-col justify-start max-h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar`}>
              {/* Column Header */}
              <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-800">
                <div>
                  <h3 className={`text-[10px] font-bold tracking-widest ${col.color}`}>
                    {col.title}
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    {colLeads.length} NODES • R$ {colTotalValue.toLocaleString('pt-BR')}
                  </p>
                </div>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${col.badgeBg} border border-current/20`}>
                  {colLeads.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="space-y-2">
                {colLeads.length === 0 ? (
                  <div className="p-4 text-center text-[10px] text-slate-600 italic bg-[#05070B] rounded border border-dashed border-slate-800">
                    [ ZERO LEADS ]
                  </div>
                ) : (
                  colLeads.map((lead) => {
                    const isLoading = loadingLeadId === lead.id;

                    return (
                      <div
                        key={lead.id}
                        className="p-3 bg-[#0D1018] rounded border border-slate-800 hover:border-slate-700 transition-all space-y-2 relative group"
                      >
                        {/* Title & Category */}
                        <div className="flex items-start justify-between gap-1">
                          <div className="truncate">
                            <h4 className="font-bold text-white text-xs leading-snug truncate">{lead.name}</h4>
                            <p className="text-[10px] text-slate-500 uppercase truncate">{lead.category} • {lead.segment}</p>
                          </div>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0 ${
                              lead.siteHealthScore < 40 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            }`}
                          >
                            HEALTH {lead.siteHealthScore}
                          </span>
                        </div>

                        {/* Health & Commercial value */}
                        <div className="flex items-center justify-between text-[10px] text-slate-400 bg-[#05070B] p-1.5 rounded border border-slate-800/80">
                          <span>★ {lead.rating} ({lead.reviewsCount})</span>
                          <span className="font-bold text-cyan-400">R$ {lead.saleValue || 1200}</span>
                        </div>

                        {/* Deployed Site URL Link if exists */}
                        {lead.siteUrl && (
                          <a
                            href={lead.siteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-cyan-400 font-semibold hover:underline flex items-center space-x-1 truncate"
                          >
                            <Globe className="w-3 h-3 shrink-0" />
                            <span className="truncate">{lead.siteUrl}</span>
                          </a>
                        )}

                        {/* Action Buttons Row */}
                        <div className="pt-1.5 flex items-center justify-between border-t border-slate-800/80 text-xs gap-1">
                          {/* Pipeline Trigger */}
                          <button
                            onClick={() => onRunPipeline(lead.id)}
                            disabled={isLoading}
                            className="p-1 rounded bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/30 transition-colors cursor-pointer"
                            title="Rodar Pipeline Completa"
                          >
                            <Play className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                          </button>

                          {/* Visual Site Editor */}
                          <button
                            onClick={() => onOpenSiteEditor(lead.id)}
                            className="p-1 rounded bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30 transition-colors cursor-pointer"
                            title="Editor Visual do Site"
                          >
                            <Edit className="w-3 h-3" />
                          </button>

                          {/* Chat / WhatsApp SDR Simulator */}
                          <button
                            onClick={() => onOpenChat(lead.id)}
                            className="p-1 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors cursor-pointer"
                            title="Conversa WhatsApp SDR"
                          >
                            <MessageSquare className="w-3 h-3" />
                          </button>

                          {/* Move Status Selector */}
                          <select
                            value={lead.pipelineStatus}
                            onChange={(e) => {
                              const newSt = e.target.value as FunnelStatus;
                              if (newSt === 'perdido') {
                                handleOpenLostModal(lead.id);
                              } else {
                                onStatusChange(lead.id, newSt);
                              }
                            }}
                            className="text-[9px] bg-[#05070B] text-slate-300 font-bold px-1 py-1 rounded border border-slate-800 cursor-pointer focus:outline-hidden"
                          >
                            <option value="aguardando">Fila</option>
                            <option value="followup_1">1º Contato</option>
                            <option value="followup_2">Seguindo</option>
                            <option value="lead_frio">Esfriou</option>
                            <option value="lead_quente">Quente/Venda</option>
                            <option value="perdido">Perdido</option>
                          </select>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
        </div>
      </div>

      {/* Lost Lead Reason Modal */}
      {lostModalLeadId && (
        <div className="fixed inset-0 bg-[#020408]/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[#0A0C14] rounded-xl p-5 max-w-md w-full shadow-2xl border border-slate-800 space-y-4 text-slate-300">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-rose-400 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4" />
                <span>[ REGISTRAR PERDA DE LEAD ]</span>
              </h3>
              <button onClick={() => setLostModalLeadId(null)} className="text-slate-500 hover:text-slate-300">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              O <strong className="text-purple-400">Learner Agent</strong> registrará o motivo para calibrar os prompts de abordagem:
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-400 block mb-1 uppercase text-[10px]">Motivo Principal</label>
                <select
                  value={lostReason}
                  onChange={(e) => setLostReason(e.target.value)}
                  className="w-full p-2 rounded bg-[#05070B] border border-slate-800 font-mono text-slate-200"
                >
                  <option value="preço">Preço alto / Out of budget</option>
                  <option value="timing">Momento inadequado / Sem tempo</option>
                  <option value="concorrente">Já fecho com outra agência</option>
                  <option value="sem_interesse">Sem interesse no momento</option>
                  <option value="outro">Outro motivo</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-400 block mb-1 uppercase text-[10px]">Observações do Atendimento</label>
                <textarea
                  rows={3}
                  value={lostNotes}
                  onChange={(e) => setLostNotes(e.target.value)}
                  placeholder="Detalhes ditos pelo lead durante o contato..."
                  className="w-full p-2 rounded bg-[#05070B] border border-slate-800 text-slate-200 font-mono"
                ></textarea>
              </div>

              <div>
                <label className="font-bold text-slate-400 block mb-1 uppercase text-[10px]">Valor Perdido (R$)</label>
                <input
                  type="number"
                  value={lostValue}
                  onChange={(e) => setLostValue(Number(e.target.value))}
                  className="w-full p-2 rounded bg-[#05070B] border border-slate-800 font-bold text-rose-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setLostModalLeadId(null)}
                className="px-3 py-1.5 rounded text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmLost}
                className="px-3 py-1.5 rounded text-xs font-mono font-bold text-white bg-rose-600 hover:bg-rose-500 border border-rose-500/50 shadow-md"
              >
                Confirmar Perda
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
