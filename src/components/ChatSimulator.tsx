import React, { useState, useEffect, useRef } from 'react';
import { ConversationMessage, Lead } from '../types/index.js';
import { MessageSquare, Send, UserCheck, Bot, RefreshCw, X, ShieldAlert, Phone, ExternalLink } from 'lucide-react';

interface ChatSimulatorProps {
  leadId: string;
  lead: Lead | undefined;
  onClose: () => void;
}

export const ChatSimulator: React.FC<ChatSimulatorProps> = ({ leadId, lead, onClose }) => {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isHumanMode, setIsHumanMode] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = () => {
    fetch(`/api/conversations/${leadId}`)
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchMessages();
  }, [leadId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!lead) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setSending(true);
    const textToSend = inputText;
    setInputText('');

    try {
      await fetch(`/api/conversations/${leadId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToSend,
          isHuman: isHumanMode
        })
      });
      fetchMessages();
      setSending(false);
    } catch (e) {
      console.error(e);
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#020408]/80 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-mono text-xs">
      <div className="bg-[#0A0C14] rounded-lg w-full max-w-2xl h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-slate-800 text-slate-300">
        {/* Chat Header */}
        <div className="bg-[#05070B] px-5 py-3 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">{lead.name}</h3>
              <p className="text-[10px] text-emerald-400 font-mono">
                WHATSAPP • {lead.phone} • {lead.pipelineStatus.toUpperCase()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Mode Switcher */}
            <button
              onClick={() => setIsHumanMode(!isHumanMode)}
              className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold flex items-center space-x-1 transition-colors cursor-pointer border ${
                isHumanMode
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
              }`}
            >
              {isHumanMode ? <UserCheck className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              <span>{isHumanMode ? 'HUMANO OPERADOR' : 'SDR AGENT AI'}</span>
            </button>

            <button onClick={onClose} className="p-1.5 text-slate-500 hover:text-slate-300 rounded bg-[#0A0C14] border border-slate-800">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-5 overflow-y-auto bg-[#020408] space-y-3 font-mono text-xs">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-slate-600 italic">
              [ NENHUMA MENSAGEM REGISTRADA AINDA. OUTREACH AGENT PODE INICIAR DISPARO ]
            </div>
          ) : (
            messages.map((msg) => {
              const isSdr = msg.role === 'sdr';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isSdr ? 'items-start' : 'items-end'} space-y-1`}
                >
                  <span className="text-[9px] text-slate-500 px-1">
                    {msg.sdrName.toUpperCase()} • {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <div
                    className={`max-w-[80%] p-3 rounded leading-relaxed text-xs border ${
                      isSdr
                        ? 'bg-[#0A0C14] text-slate-200 border-slate-800'
                        : 'bg-emerald-950/60 text-emerald-200 border-emerald-500/40'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Footer */}
        <form onSubmit={handleSend} className="p-3 bg-[#05070B] border-t border-slate-800 flex items-center space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isHumanMode
                ? 'Escreva como operador humano no WhatsApp...'
                : 'Simular resposta do lead para acionar SDR AI...'
            }
            className="flex-1 px-3 py-2 rounded bg-[#0A0C14] border border-slate-800 text-xs font-mono text-slate-200 focus:outline-hidden focus:border-cyan-500/50"
          />
          <button
            type="submit"
            disabled={sending || !inputText.trim()}
            className="px-4 py-2 rounded font-mono font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 border border-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.25)] flex items-center space-x-1.5 cursor-pointer text-xs transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Enviar</span>
          </button>
        </form>
      </div>
    </div>
  );
};
