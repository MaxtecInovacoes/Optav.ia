import React, { useState, useEffect } from 'react';
import { X, Shield, Activity, DollarSign, Edit, RotateCcw, AlertTriangle, FileText, CheckCircle } from 'lucide-react';

interface SuperAdminModalProps {
  onClose: () => void;
}

export const SuperAdminModal: React.FC<SuperAdminModalProps> = ({ onClose }) => {
  const [data, setData] = useState<any>(null);
  const [selectedAgent, setSelectedAgent] = useState<string>('ScraperAgent');
  const [promptText, setPromptText] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);

  const fetchHealth = () => {
    fetch('/api/superadmin/health')
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        if (d.prompts) {
          const current = d.prompts.find((p: any) => p.agent === selectedAgent);
          if (current && current.versions && current.versions[0]) {
            setPromptText(current.versions[0].promptText);
          }
        }
      });
  };

  useEffect(() => {
    fetchHealth();
  }, [selectedAgent]);

  const handleUpdatePrompt = async () => {
    setSaving(true);
    try {
      await fetch('/api/superadmin/prompts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent: selectedAgent, promptText })
      });
      fetchHealth();
      setSaving(false);
    } catch (e) {
      console.error(e);
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#020408]/80 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-mono text-xs">
      <div className="bg-[#0A0C14] border border-slate-800 rounded-lg w-full max-w-5xl h-[88vh] flex flex-col shadow-2xl overflow-hidden text-slate-300">
        {/* Top Bar */}
        <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-[#05070B] shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-1.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white uppercase tracking-tight">SUPERADMIN // SYSTEM PROMPT ENGINE & TELEMETRY</h2>
              <p className="text-[10px] text-slate-500">Controle de latência dos agentes, custos de LLM e versionamento com rollback em 1 clique.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-500 hover:text-slate-300 rounded bg-[#0A0C14] border border-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-5 overflow-y-auto space-y-5 text-xs">
          {/* Agent Health Grid */}
          <div>
            <h3 className="font-bold text-slate-300 mb-2.5 flex items-center space-x-2 text-[11px] uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Agente Telemetry & Runtime Latency</span>
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              {data?.agents?.map((agent: any) => (
                <div key={agent.name} className="p-3 bg-[#05070B] border border-slate-800 rounded space-y-1">
                  <div className="flex items-center justify-between font-bold text-white text-xs">
                    <span>{agent.name}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_5px_#10b981] animate-pulse"></span>
                  </div>
                  <div className="text-[10px] text-cyan-400">LATENCY: {agent.latencyMs}ms</div>
                  <div className="text-[9px] text-slate-500">{agent.totalDecisions} decisões executadas</div>
                </div>
              ))}
            </div>
          </div>

          {/* Prompt Versioning Editor */}
          <div className="bg-[#05070B] p-4 rounded border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center space-x-2 font-bold text-white text-xs">
                <Edit className="w-3.5 h-3.5 text-amber-400" />
                <span>EDITOR DE SYSTEM PROMPT COM ROLLBACK</span>
              </div>

              <select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                className="bg-[#0A0C14] border border-slate-800 text-cyan-400 font-mono text-xs px-2.5 py-1 rounded cursor-pointer"
              >
                <option value="ScraperAgent">ScraperAgent</option>
                <option value="PersonaAgent">PersonaAgent</option>
                <option value="SiteBuilderAgent">SiteBuilderAgent</option>
                <option value="OutreachAgent">OutreachAgent</option>
                <option value="LearnerAgent">LearnerAgent</option>
                <option value="SDRAgent">SDRAgent</option>
              </select>
            </div>

            <div>
              <textarea
                rows={4}
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                className="w-full p-3 rounded bg-[#0A0C14] border border-slate-800 text-slate-200 font-mono text-xs focus:outline-hidden focus:border-cyan-500/50"
              ></textarea>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500">
                Alterações são auditadas e podem ser revertidas para qualquer versão anterior.
              </span>
              <button
                onClick={handleUpdatePrompt}
                disabled={saving}
                className="px-3.5 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 cursor-pointer shadow-[0_0_8px_rgba(245,158,11,0.2)]"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{saving ? 'Publicando...' : 'Publicar Nova Versão'}</span>
              </button>
            </div>
          </div>

          {/* Audit Trail */}
          <div className="bg-[#05070B] p-4 rounded border border-slate-800 space-y-2.5">
            <h3 className="font-bold text-slate-300 flex items-center space-x-2 text-[11px] uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span>Trilha de Auditoria (Audit Logs)</span>
            </h3>
            <div className="space-y-1.5 max-h-40 overflow-y-auto font-mono text-[10px]">
              {data?.auditLogs?.map((log: any) => (
                <div key={log.id} className="p-2 bg-[#0A0C14] rounded border border-slate-800/80 flex justify-between">
                  <span className="text-amber-400">[{log.actor}] {log.action}</span>
                  <span className="text-slate-500">{log.details}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
