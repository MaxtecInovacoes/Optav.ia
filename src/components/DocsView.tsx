import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  ChevronRight,
  Sparkles,
  Zap,
  CheckCircle,
  Bot,
  DollarSign,
  ShieldCheck,
  Globe,
  ArrowRight,
  Code,
  Wrench,
  MessageSquare,
  HelpCircle,
  FileText
} from 'lucide-react';

interface DocsViewProps {
  onOpenRegister: (planId?: string) => void;
  onNavigateHome: () => void;
}

export const DocsView: React.FC<DocsViewProps> = ({ onOpenRegister, onNavigateHome }) => {
  const [activeSection, setActiveSection] = useState<string>('visao-geral');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const docSections = [
    {
      id: 'visao-geral',
      title: 'Visão Geral',
      category: 'Início',
      icon: BookOpen,
      content: (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-black font-mono text-white mb-2 uppercase">
              Documentação OPTAV.IA OS
            </h1>
            <p className="text-slate-400 font-mono text-xs md:text-sm border-b border-purple-900/60 pb-4">
              Tudo o que você precisa saber para prospectar negócios locais, criar sites com IA e fechar vendas no WhatsApp.
            </p>
          </div>

          <div className="space-y-4 font-sans text-sm text-slate-200 leading-relaxed">
            <h2 className="text-xl font-bold font-mono text-[#00FFB3]">O que é o OPTAV.IA OS?</h2>
            <p>
              O <strong>OPTAV.IA OS</strong> é uma plataforma multi-tenant autônoma que automatiza todo o processo de venda de serviços digitais para negócios locais (como pizzarias, clínicas, barbearias e advocacias).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
              <div className="bg-[#0e0a1a] p-5 rounded-2xl border border-purple-800/60 space-y-2">
                <div className="flex items-center space-x-2 text-purple-400 font-mono font-bold text-xs uppercase">
                  <Search className="w-4 h-4" />
                  <span>1. Prospecta</span>
                </div>
                <p className="text-xs text-slate-400">
                  Encontra negócios sem site ou com presença desatualizada no Google Maps automaticamente.
                </p>
              </div>

              <div className="bg-[#0e0a1a] p-5 rounded-2xl border border-purple-800/60 space-y-2">
                <div className="flex items-center space-x-2 text-cyan-400 font-mono font-bold text-xs uppercase">
                  <Wrench className="w-4 h-4" />
                  <span>2. Cria</span>
                </div>
                <p className="text-xs text-slate-400">
                  Gera sites profissionais cinematográficos em segundos usando 7 agentes autônomos de IA.
                </p>
              </div>

              <div className="bg-[#0e0a1a] p-5 rounded-2xl border border-purple-800/60 space-y-2">
                <div className="flex items-center space-x-2 text-yellow-400 font-mono font-bold text-xs uppercase">
                  <Bot className="w-4 h-4" />
                  <span>3. Vende</span>
                </div>
                <p className="text-xs text-slate-400">
                  Envia a demonstração pronta pelo WhatsApp através do vendedor virtual SDR Bryan.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-700/50 space-y-1">
              <span className="text-xs font-mono font-bold text-purple-300 uppercase">💡 Para quem é?</span>
              <p className="text-xs text-slate-300">
                Freelancers, agências solo e empreendedores que desejam vender sites e apps de R$ 800 a R$ 5.000 sem precisar programar ou gastar faturas em dólar.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'primeiros-passos',
      title: 'Primeiros Passos',
      category: 'Início',
      icon: Zap,
      content: (
        <div className="space-y-6">
          <h1 className="text-2xl font-black font-mono text-white uppercase">Guia Rápido: 5 Minutos</h1>
          <p className="text-slate-400 font-mono text-xs border-b border-purple-900/60 pb-4">
            Aprenda a rodar seu primeiro ciclo autônomo.
          </p>

          <ol className="space-y-4 font-mono text-xs text-slate-300 list-decimal pl-5">
            <li className="space-y-1">
              <strong className="text-white">Configure o Perfil da Sua Agência:</strong>
              <p className="font-sans text-slate-400">Defina o nome de exibição e número do WhatsApp Business para receber as respostas dos clientes.</p>
            </li>
            <li className="space-y-1">
              <strong className="text-white">Escolha a Cidade e o Nicho:</strong>
              <p className="font-sans text-slate-400">Ex: "Clínicas Odontológicas em Curitiba, PR". O motor de busca varre o Google Maps em tempo real.</p>
            </li>
            <li className="space-y-1">
              <strong className="text-white">Ative a Esteira Autônoma:</strong>
              <p className="font-sans text-slate-400">Os agentes geram a prévia do site, aplicam SEO local e disparam o link pelo WhatsApp.</p>
            </li>
          </ol>
        </div>
      )
    },
    {
      id: 'como-funciona',
      title: 'Como Funciona',
      category: 'O Sistema',
      icon: Code,
      content: (
        <div className="space-y-6">
          <h1 className="text-2xl font-black font-mono text-white uppercase">O Fluxo Completo de Operação</h1>
          <p className="text-slate-400 font-mono text-xs border-b border-purple-900/60 pb-4">
            Entenda como a automação funciona da prospeção ao recebimento no PIX.
          </p>

          <div className="space-y-4 font-sans text-sm text-slate-300">
            <p>
              Diferente de criadores de site tradicionais que exigem arrastar blocos manualmente, a <strong>OPTAV.IA</strong> funciona como uma esteira autônoma baseada em intenção.
            </p>
            <div className="bg-[#0e0a1a] p-5 rounded-2xl border border-purple-800/60 font-mono text-xs space-y-3">
              <div className="text-cyan-400 font-bold uppercase">✦ Arquitetura dos Agentes:</div>
              <ul className="space-y-2 text-slate-300">
                <li>• <strong>Scraper Maps:</strong> Coleta telefone, endereço, rating e link cadastrado.</li>
                <li>• <strong>Niche Copywriter:</strong> Cria chamadas persuasivas focadas em conversão local.</li>
                <li>• <strong>Tailwind UI Generator:</strong> Gera os componentes visuais limpos e responsivos.</li>
                <li>• <strong>SDR Outreach:</strong> Envia a demonstração pelo WhatsApp.</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'sdr-bryan',
      title: 'SDR Bryan (Vendedor IA)',
      category: 'O Sistema',
      icon: Bot,
      content: (
        <div className="space-y-6">
          <h1 className="text-2xl font-black font-mono text-white uppercase">SDR Bryan — Seu Vendedor 24/7</h1>
          <p className="text-slate-400 font-mono text-xs border-b border-purple-900/60 pb-4">
            O agente de IA especialista em fechar contratos no WhatsApp.
          </p>

          <div className="space-y-4 font-sans text-sm text-slate-300">
            <p>
              O <strong>SDR Bryan</strong> aborda os proprietários dos estabelecimentos de forma educada e estratégica. Ele não envia textos longos ou robotizados.
            </p>
            <div className="p-4 bg-[#0a0714] border border-cyan-800/60 rounded-xl font-mono text-xs space-y-2">
              <div className="text-[#00FFB3] font-bold">💬 Exemplo de Mensagem Enviada:</div>
              <p className="text-slate-300 italic">
                "Olá, [Nome do Responsável]! Vi o perfil da [Nome da Empresa] no Google Maps. Notamos que vocês ainda não possuem um site otimizado para celulares. Criamos uma prévia gratuita do novo site de vocês para avaliação: [Link do Site]. Gostou do visual?"
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'planos',
      title: 'Planos e Preços',
      category: 'Financeiro',
      icon: DollarSign,
      content: (
        <div className="space-y-6">
          <h1 className="text-2xl font-black font-mono text-white uppercase">Comparativo de Planos</h1>
          <p className="text-slate-400 font-mono text-xs border-b border-purple-900/60 pb-4">
            Escolha o plano ideal para o momento da sua agência ou atividade freela.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            <div className="bg-[#0e0a1a] p-6 rounded-2xl border border-purple-800/60 space-y-4">
              <div className="font-bold text-white text-base">STARTER</div>
              <div className="text-2xl font-black text-cyan-400">R$ 97 <span className="text-xs text-slate-400">/mês</span></div>
              <p className="text-slate-400 text-[11px]">Para quem quer começar a vender os primeiros 5 sites no mês.</p>
              <button onClick={() => onOpenRegister('starter')} className="w-full py-2.5 bg-cyan-400 text-black font-bold rounded fl-pixel-btn">
                ASSINAR STARTER
              </button>
            </div>

            <div className="bg-[#0e0a1a] p-6 rounded-2xl border-2 border-[#00FFB3] space-y-4 relative shadow-[0_0_20px_rgba(0,255,179,0.2)]">
              <span className="absolute -top-3 right-4 px-2 py-0.5 bg-[#00FFB3] text-black text-[9px] font-black rounded uppercase">MAIS POPULAR</span>
              <div className="font-bold text-white text-base">PRO</div>
              <div className="text-2xl font-black text-[#00FFB3]">R$ 197 <span className="text-xs text-slate-400">/mês</span></div>
              <p className="text-slate-400 text-[11px]">Para agências e freelas em escala constante com automação ilimitada.</p>
              <button onClick={() => onOpenRegister('pro')} className="w-full py-2.5 bg-[#00FFB3] text-black font-bold rounded fl-pixel-btn">
                ASSINAR PRO
              </button>
            </div>

            <div className="bg-[#0e0a1a] p-6 rounded-2xl border border-purple-800/60 space-y-4">
              <div className="font-bold text-white text-base">ILIMITADO</div>
              <div className="text-2xl font-black text-yellow-400">R$ 497 <span className="text-xs text-slate-400">/mês</span></div>
              <p className="text-slate-400 text-[11px]">Suporte BYOK, servidores dedicados e suporte prioritário no WhatsApp.</p>
              <button onClick={() => onOpenRegister('ilimitado')} className="w-full py-2.5 bg-yellow-400 text-black font-bold rounded fl-pixel-btn">
                ASSINAR ILIMITADO
              </button>
            </div>
          </div>
        </div>
      )
    }
  ];

  const currentDoc = docSections.find(s => s.id === activeSection) || docSections[0];

  return (
    <div className="min-h-screen bg-[#06040a] text-slate-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-[#0e0a1a] p-4 rounded-2xl border border-purple-900/60 space-y-4">
            <button
              onClick={onNavigateHome}
              className="text-xs font-mono text-purple-400 hover:text-purple-300 flex items-center space-x-1"
            >
              <span>← Voltar para a Home</span>
            </button>

            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar na documentação..."
                className="w-full p-2.5 pl-9 bg-[#06040a] border border-purple-800/60 rounded-xl text-xs font-mono text-white outline-none focus:border-cyan-400"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>

            <nav className="space-y-1 font-mono text-xs">
              {docSections
                .filter(sec => !searchQuery || sec.title.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((sec) => {
                  const IconComp = sec.icon;
                  const isActive = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => setActiveSection(sec.id)}
                      className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between transition-colors ${
                        isActive
                          ? 'bg-purple-900/40 text-[#00FFB3] border border-purple-500/50 font-bold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-purple-950/30'
                      }`}
                    >
                      <span className="flex items-center space-x-2">
                        <IconComp className="w-4 h-4 shrink-0" />
                        <span>{sec.title}</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                    </button>
                  );
                })}
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="lg:col-span-9 bg-[#0e0a1a] p-6 md:p-10 rounded-3xl border border-purple-900/60 shadow-2xl">
          {currentDoc.content}
        </main>
      </div>
    </div>
  );
};
