import React from 'react';
import { LearningPattern } from '../types/index.js';
import { Brain, CheckCircle2, TrendingUp, Sparkles, RefreshCw, Layers } from 'lucide-react';

interface LearningsPanelProps {
  learnings: LearningPattern[];
  onRunCycle: () => void;
}

export const LearningsPanel: React.FC<LearningsPanelProps> = ({ learnings, onRunCycle }) => {
  return (
    <div className="w-full bg-[#0A0C14] border border-slate-800 rounded-lg p-4 space-y-4 font-mono text-xs text-slate-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-3 gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-white flex items-center space-x-2">
              <span>LEARNER AGENT // PATTERN DELTA LOGS</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-purple-500/10 text-purple-400 border border-purple-500/30">
                PROMPTS_UPDATED
              </span>
            </h2>
            <p className="text-[11px] text-slate-500">
              Padrões extraídos automaticamente de outcomes diários e injetados nos system prompts dos agentes.
            </p>
          </div>
        </div>

        <button
          onClick={onRunCycle}
          className="px-3 py-1.5 rounded text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all flex items-center space-x-2 cursor-pointer shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Executar Ciclo Diário</span>
        </button>
      </div>

      {/* Pattern Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {learnings.length === 0 ? (
          <p className="text-slate-600 italic text-xs col-span-2 text-center py-6 bg-[#05070B] rounded border border-dashed border-slate-800">
            [ NENHUM PADRÃO REGISTRADO AINDA. EXECUTE O CICLO DO LEARNER AGENT ]
          </p>
        ) : (
          learnings.map((pattern) => (
            <div
              key={pattern.id}
              className="p-3.5 rounded-lg bg-[#080A0F] border border-slate-800 space-y-2.5 relative group hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  AGENTE: {pattern.agent.toUpperCase()}
                </span>
                <span className="text-[10px] font-bold text-emerald-400 flex items-center">
                  <TrendingUp className="w-3.5 h-3.5 mr-1" />
                  {(pattern.confidence * 100).toFixed(0)}% CONFIDENCE ({pattern.nExamples} CASES)
                </span>
              </div>

              <p className="text-xs font-bold text-white leading-relaxed flex items-start space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>"{pattern.pattern}"</span>
              </p>

              <div className="bg-[#020408] p-2.5 rounded border border-slate-800 text-[10px] font-mono">
                <span className="font-bold text-slate-500 block mb-0.5 uppercase text-[9px]">INJEÇÃO NO SYSTEM PROMPT (DELTA):</span>
                <span className="text-cyan-400 font-medium italic">{pattern.promptDelta}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
