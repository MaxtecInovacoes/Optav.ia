import React, { useState } from 'react';
import {
  Zap,
  CheckCircle,
  ShieldCheck,
  Globe,
  Bot,
  Search,
  ArrowRight,
  User,
  Lock,
  Mail,
  Building,
  Star,
  Check,
  Server,
  Sparkles,
  PhoneCall,
  BarChart3,
  Layers,
  X,
  ChevronDown,
  MessageSquare,
  Play,
  TrendingUp,
  Award,
  Users,
  Target,
  Clock,
  HelpCircle,
  Send,
  Sliders,
  Sun,
  Moon
} from 'lucide-react';

interface LandingPageProps {
  onLoginSuccess: (user: any, tenant: any) => void;
  onNavigateToDashboard: () => void;
  isLoggedIn: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLoginSuccess,
  onNavigateToDashboard,
  isLoggedIn
}) => {
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [selectedPlan, setSelectedPlan] = useState<string>('starter');
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');

  // Simulator State
  const [simCidade, setSimCidade] = useState('Curitiba, PR');
  const [simNicho, setSimNicho] = useState('Pizzarias');
  const [simTicket, setSimTicket] = useState(1000);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simResults, setSimResults] = useState({
    encontradas: 187,
    semSite: 42,
    previewName: 'Pizzaria São José',
    faturamentoEstimado: 42000
  });

  // ROI Calculator State
  const [roiSitesCount, setRoiSitesCount] = useState<number>(5);
  const [roiPricePerSite, setRoiPricePerSite] = useState<number>(1000);

  // Studio Interactive Preview State
  const [studioDevice, setStudioDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [studioAccent, setStudioAccent] = useState<string>('#9333ea');
  const [studioFontHeading, setStudioFontHeading] = useState<string>('Playfair Display');
  const [studioAiPrompt, setStudioAiPrompt] = useState<string>('');
  const [studioAiMessage, setStudioAiStatus] = useState<string>('');

  // Simulator submit handler
  const handleSimular = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSimulating(true);
    setTimeout(() => {
      const hash = (simCidade + simNicho).length * 17;
      const encontradas = 120 + (hash % 150);
      const semSite = Math.floor(encontradas * 0.28);
      const sampleNames: Record<string, string> = {
        Pizzarias: `Pizzaria ${simCidade.split(',')[0]} Bella`,
        Clínicas: `Clínica Odontológica ${simCidade.split(',')[0]}`,
        Salões: `Studio & Barbearia ${simCidade.split(',')[0]}`,
        'Prestadores de Serviço': `Eletro & Reformas ${simCidade.split(',')[0]}`,
        'Lojas Físicas': `Boutique & Modas ${simCidade.split(',')[0]}`
      };
      setSimResults({
        encontradas,
        semSite,
        previewName: sampleNames[simNicho] || `Empresa Destaque ${simCidade.split(',')[0]}`,
        faturamentoEstimado: semSite * simTicket
      });
      setIsSimulating(false);
    }, 600);
  };

  // Beta Lead Form state
  const [betaNome, setBetaNome] = useState('');
  const [betaEmail, setBetaEmail] = useState('');
  const [betaPhone, setBetaPhone] = useState('');
  const [betaCidade, setBetaCidade] = useState('');
  const [betaNicho, setBetaNicho] = useState('');
  const [betaSubmitted, setBetaSubmitted] = useState(false);

  const handleBetaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBetaSubmitted(true);
    setTimeout(() => {
      handleOpenRegister('starter');
    }, 1200);
  };

  // Auth Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // FAQ Accordion
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleOpenRegister = (planId: string = 'starter') => {
    setSelectedPlan(planId);
    setAuthMode('register');
    setAuthError('');
    setAuthSuccess('');
    setShowAuthModal(true);
  };

  const handleOpenLogin = () => {
    setAuthMode('login');
    setAuthError('');
    setAuthSuccess('');
    setShowAuthModal(true);
  };

  const handleSubmitAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');
    setAuthSuccess('');

    try {
      const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body = authMode === 'login' 
        ? { email, password }
        : { email, password, name, agencyName, plan: selectedPlan };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Falha na autenticação');
      }

      setAuthSuccess(authMode === 'login' ? 'Login realizado com sucesso!' : 'Conta criada com sucesso! Redirecionando...');
      
      setTimeout(() => {
        onLoginSuccess(data.user, data.tenant);
        setShowAuthModal(false);
      }, 1000);
    } catch (err: any) {
      setAuthError(err.message || 'Erro ao conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  const isLight = themeMode === 'light';

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${isLight ? 'bg-slate-50 text-slate-900' : 'bg-[#0a0714] text-slate-100'} selection:bg-purple-500 selection:text-white`}>
      {/* Dynamic Style injection for Pixel Art Buttons & Glows */}
      <style>{`
        .fl-pixel-btn {
          image-rendering: pixelated;
          border-radius: 0px;
          box-shadow: inset -3px -3px 0 rgba(0,0,0,0.35), inset 3px 3px 0 rgba(255,255,255,0.25), 0 4px 0 rgba(0,0,0,0.4);
          transition: transform 60ms, box-shadow 60ms;
        }
        .fl-pixel-btn:active {
          transform: translateY(4px);
          box-shadow: inset -3px -3px 0 rgba(0,0,0,0.35), inset 3px 3px 0 rgba(255,255,255,0.25), 0 0 0 rgba(0,0,0,0.4);
        }
        .fl-grad-text {
          background: linear-gradient(135deg, #c084fc, #00ffb3);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

      {/* Top Banner Navigation */}
      <header className={`sticky top-0 z-40 px-4 md:px-8 py-3.5 backdrop-blur-xl border-b ${isLight ? 'bg-white/90 border-slate-200' : 'bg-[#0a0714]/90 border-purple-900/40'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-purple-600 rounded-lg flex items-center justify-center font-black text-white text-lg shadow-[0_0_15px_rgba(147,51,234,0.5)]">
              F
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-white font-mono flex items-center gap-1">
                FraLib <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-400 text-black font-black">OS</span>
              </span>
              <span className="text-[10px] text-purple-300/80 font-mono tracking-wider uppercase">
                Esteira IA de Vendas no WhatsApp
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center space-x-7 text-xs font-mono font-medium text-slate-300">
            <a href="#como-funciona" className="hover:text-purple-400 transition-colors">Como funciona</a>
            <a href="#simulador" className="hover:text-purple-400 transition-colors">Simulador</a>
            <a href="#beneficios" className="hover:text-purple-400 transition-colors">Benefícios</a>
            <a href="#planos" className="hover:text-purple-400 transition-colors">Planos</a>
            <a href="#faq" className="hover:text-purple-400 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setThemeMode(isLight ? 'dark' : 'light')}
              className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 cursor-pointer ${isLight ? 'bg-slate-200 border-slate-300 text-slate-800' : 'bg-purple-950/50 border-purple-800/60 text-purple-200'}`}
              title="Alternar Tema"
            >
              {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-yellow-400" />}
            </button>

            {isLoggedIn ? (
              <button
                onClick={onNavigateToDashboard}
                className="flex items-center space-x-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-4 py-2 rounded font-mono text-xs fl-pixel-btn shadow-[0_4px_0_#a16207]"
              >
                <span>Acessar Painel</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <>
                <button
                  onClick={handleOpenLogin}
                  className="px-3.5 py-2 rounded text-xs font-mono font-bold text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  ENTRAR
                </button>
                <button
                  onClick={() => handleOpenRegister('starter')}
                  className="bg-yellow-400 hover:bg-yellow-300 text-black font-black px-4 py-2 text-xs font-mono fl-pixel-btn shadow-[0_4px_0_#a16207] cursor-pointer"
                >
                  ENTRAR NO BETA
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 md:px-8 text-center overflow-hidden">
        {/* Glow ambient background effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-purple-600/15 blur-[140px] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-[450px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-purple-500/40 bg-purple-900/30 text-purple-300 font-mono text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>A IA que vende no WhatsApp enquanto você dorme</span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight uppercase font-mono">
            Você escolhe cidade e nicho. <br />
            <span className="fl-grad-text">
              A FraLib encontra empresas sem site, cria a prévia com IA e vende no WhatsApp 24/7
            </span>
          </h1>

          <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            A IA qualifica, agenda e fecha. Você só acorda com a venda feita.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => handleOpenRegister('starter')}
              className="w-full sm:w-auto px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs font-mono fl-pixel-btn shadow-[0_6px_0_#713f12] cursor-pointer flex items-center justify-center space-x-2"
            >
              <Zap className="w-4 h-4 fill-black" />
              <span>QUERO VENDER NO WHATSAPP</span>
            </button>
            <a
              href="#simulador"
              className="w-full sm:w-auto px-6 py-4 bg-purple-950/60 hover:bg-purple-900/80 text-purple-200 border border-purple-700/60 font-bold text-xs font-mono rounded flex items-center justify-center space-x-2"
            >
              <Play className="w-3.5 h-3.5 fill-purple-300" />
              <span>VER MINHA IA FUNCIONANDO</span>
            </a>
          </div>

          <div className="pt-2 flex items-center justify-center space-x-2 text-xs text-slate-400 font-mono">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>Fale comigo no WhatsApp: <strong className="text-white">(41) 98513-4105</strong></span>
          </div>

          {/* Sub-bar Pipeline Highlight */}
          <div className="mt-8 p-4 rounded-xl border border-purple-800/40 bg-purple-950/40 backdrop-blur-md text-xs font-mono text-purple-200 flex flex-wrap items-center justify-center gap-3">
            <span className="text-emerald-400 font-bold">Encontra leads sem site</span>
            <span>→</span>
            <span className="text-cyan-400 font-bold">Cria site com IA</span>
            <span>→</span>
            <span className="text-yellow-400 font-bold">Vende no WhatsApp enquanto você dorme</span>
            <span className="text-slate-500">•</span>
            <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">R$97 no 1º mês</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">Garantia de 30 dias</span>
          </div>
        </div>
      </section>

      {/* Simulator Section (Simulador de Oportunidades por Cidade e Nicho) */}
      <section id="simulador" className="py-16 px-4 md:px-8 border-t border-purple-900/40 bg-[#07050e]">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono font-bold text-yellow-400 uppercase tracking-widest px-3 py-1 rounded bg-yellow-400/10 border border-yellow-400/20">
              SIMULADOR INTERATIVO // APP.FRALIB.COM.BR
            </span>
            <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-white font-mono">
              Quantas Oportunidades Existem na Sua Cidade Agora?
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              Antes de vender site, você precisa saber quem abordar. A FraLib ajuda você a encontrar empresas locais com sinais de oportunidade e transforma esses dados em prévias de site e abordagens prontas.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Input Controls */}
            <form onSubmit={handleSimular} className="lg:col-span-5 bg-[#0e0a1a] p-6 rounded-2xl border border-purple-800/50 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-purple-300 uppercase font-bold flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Cidade</span>
                </label>
                <input
                  type="text"
                  value={simCidade}
                  onChange={(e) => setSimCidade(e.target.value)}
                  placeholder="Ex: Curitiba, PR"
                  className="w-full px-3.5 py-2.5 rounded bg-[#07050e] border border-purple-800/60 text-slate-100 font-mono text-sm focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-purple-300 uppercase font-bold flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Nicho</span>
                </label>
                <select
                  value={simNicho}
                  onChange={(e) => setSimNicho(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded bg-[#07050e] border border-purple-800/60 text-slate-100 font-mono text-sm focus:outline-none focus:border-yellow-400"
                >
                  <option value="Pizzarias">Pizzarias & Restaurantes</option>
                  <option value="Clínicas">Clínicas & Odontologia</option>
                  <option value="Salões">Salões & Barbearias</option>
                  <option value="Prestadores de Serviço">Prestadores de Serviço</option>
                  <option value="Lojas Físicas">Lojas Físicas & Comércio</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-purple-300 uppercase font-bold flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Ticket Pretendido (R$)</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[500, 1000, 1500].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setSimTicket(val)}
                      className={`py-2 rounded text-xs font-mono font-bold cursor-pointer transition-all ${
                        simTicket === val
                          ? 'bg-yellow-400 text-black border border-yellow-500'
                          : 'bg-[#07050e] text-slate-300 border border-purple-800/60 hover:border-purple-600'
                      }`}
                    >
                      R$ {val}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSimulating}
                className="w-full py-3.5 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs font-mono fl-pixel-btn shadow-[0_4px_0_#713f12] cursor-pointer flex items-center justify-center space-x-2"
              >
                {isSimulating ? (
                  <span>ANALISANDO OPORTUNIDADES...</span>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-black" />
                    <span>ANALISAR OPORTUNIDADES</span>
                  </>
                )}
              </button>
            </form>

            {/* Results Live Simulation Card */}
            <div className="lg:col-span-7 bg-[#0e0a1a] p-6 rounded-2xl border border-purple-800/50 space-y-6">
              <div className="flex items-center justify-between border-b border-purple-800/40 pb-3">
                <span className="text-xs font-mono text-slate-400 uppercase">RESULTADO DA SIMULAÇÃO — {simCidade.toUpperCase()}</span>
                <span className="text-xs font-mono text-emerald-400 font-bold">STATUS: OPORTUNIDADE ALTA</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#07050e] border border-purple-800/40 space-y-1">
                  <div className="text-3xl font-black text-yellow-400 font-mono">{simResults.encontradas}</div>
                  <div className="text-xs font-mono text-slate-400">Empresas Encontradas</div>
                </div>

                <div className="p-4 rounded-xl bg-[#07050e] border border-purple-800/40 space-y-1">
                  <div className="text-3xl font-black text-emerald-400 font-mono">{simResults.semSite}</div>
                  <div className="text-xs font-mono text-slate-400">Sem Site Detectado</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-700/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-300">PRÉVIA CRIADA COM IA</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ABORDAGEM PRONTA
                  </span>
                </div>
                <div className="text-base font-bold text-white font-mono">{simResults.previewName}</div>
                <div className="p-3 rounded bg-[#07050e] border border-purple-900/60 text-xs text-slate-300 font-mono leading-relaxed">
                  "Oi! Vi que sua empresa se destaca em {simCidade}, mas não encontrei um site profissional. Montei uma prévia de como o site de vocês poderia ficar: <span className="text-cyan-400 underline">demo.fralib.site</span>. Posso te mandar sem compromisso?"
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-purple-800/40 text-xs font-mono">
                <span className="text-slate-400">Potencial de Faturamento Estimado:</span>
                <span className="text-lg font-bold text-yellow-400">R$ {simResults.faturamentoEstimado.toLocaleString('pt-BR')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promo Highlight: Starter + Upgrade Pro */}
      <section className="py-12 px-4 md:px-8 bg-gradient-to-r from-purple-950/80 via-purple-900/60 to-purple-950/80 border-y border-purple-800/60 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="px-3 py-1 rounded-full bg-yellow-400 text-black text-xs font-mono font-black uppercase">
            DE R$ 197 POR R$ 97
          </span>
          <h3 className="text-xl md:text-3xl font-black font-mono text-white">
            STARTER + UPGRADE PRO · 1º MÊS
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed max-w-2xl mx-auto">
            Plano Starter (R$ 97/mês) com upgrade automático para Pro no primeiro mês: cooldown reduzido (60 → 30 min), SDR com retries e prioridade alta na fila (nível 5). A partir do 2º mês segue pelo valor do plano escolhido.
          </p>
          <div className="pt-2">
            <button
              onClick={() => handleOpenRegister('starter')}
              className="px-8 py-3.5 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs font-mono fl-pixel-btn shadow-[0_4px_0_#713f12] cursor-pointer inline-flex items-center space-x-2"
            >
              <span>ATIVAR STARTER + PRO POR R$ 97</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 90 Seconds Flow / Video Steps */}
      <section id="como-funciona" className="py-20 px-4 md:px-8 border-b border-purple-900/40">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl md:text-4xl font-black uppercase font-mono text-white">
              Veja o Fluxo Completo em Menos de 90 Segundos
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              A FraLib não entrega só uma lista. Ela transforma o lead em uma oportunidade visual para você abordar com algo pronto.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Mocked Demo Video Player */}
            <div className="relative rounded-2xl border-2 border-purple-700/60 bg-[#07050e] p-6 text-center space-y-4 shadow-2xl overflow-hidden group">
              <div className="w-16 h-16 rounded-full bg-yellow-400 text-black flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(250,204,21,0.5)] cursor-pointer group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 fill-black ml-1" />
              </div>
              <div className="text-sm font-mono font-bold text-white">[ VIDEO_DEMO_90S ] · 1:23</div>
              <p className="text-xs font-mono text-purple-300">
                Demonstração da Varredura no Maps + Geração de Prévia + Abordagem SDR
              </p>
            </div>

            {/* 7-Step List */}
            <div className="space-y-3 font-mono text-xs">
              {[
                'Você define cidade + nicho',
                'A FraLib busca empresas locais',
                'O sistema filtra os leads com oportunidade',
                'A IA gera a prévia de site',
                'A plataforma cria a abordagem',
                'O CRM organiza tudo por status',
                'Você só chama no WhatsApp com algo concreto'
              ].map((step, idx) => (
                <div key={idx} className="flex items-center space-x-3 p-3 rounded-lg bg-[#0e0a1a] border border-purple-800/40 text-slate-200">
                  <span className="w-6 h-6 rounded-full bg-purple-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}

              <div className="pt-2">
                <button
                  onClick={() => handleOpenRegister('starter')}
                  className="w-full py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs font-mono fl-pixel-btn shadow-[0_4px_0_#713f12] cursor-pointer"
                >
                  QUERO TESTAR ESSE FLUXO
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison: Prospectar Manualmente vs FraLib */}
      <section className="py-20 px-4 md:px-8 bg-[#07050e] border-b border-purple-900/40">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl md:text-4xl font-black uppercase font-mono text-white">
              Prospectar Manualmente Limita Sua Escala
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              O problema não é só criar site com IA. O problema é saber quem abordar e como chamar atenção logo no primeiro contato.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Today manual */}
            <div className="p-6 rounded-2xl bg-[#0e0a1a] border border-rose-500/30 space-y-4">
              <div className="flex items-center space-x-2 text-rose-400 font-mono font-bold text-xs uppercase">
                <X className="w-4 h-4" />
                <span>Hoje, Fazendo Tudo na Mão</span>
              </div>
              <ul className="space-y-2.5 text-xs font-mono text-slate-300">
                <li className="flex items-center space-x-2"><span className="text-rose-400">•</span> <span>Você abre o Google</span></li>
                <li className="flex items-center space-x-2"><span className="text-rose-400">•</span> <span>Procura empresa por empresa</span></li>
                <li className="flex items-center space-x-2"><span className="text-rose-400">•</span> <span>Analisa se tem site</span></li>
                <li className="flex items-center space-x-2"><span className="text-rose-400">•</span> <span>Tenta entender se vale abordar</span></li>
                <li className="flex items-center space-x-2"><span className="text-rose-400">•</span> <span>Escreve uma mensagem fria</span></li>
                <li className="flex items-center space-x-2"><span className="text-rose-400">•</span> <span>Cria proposta só depois de resposta</span></li>
                <li className="flex items-center space-x-2"><span className="text-rose-400">•</span> <span>Perde horas em tarefas repetitivas</span></li>
              </ul>
            </div>

            {/* With FraLib */}
            <div className="p-6 rounded-2xl bg-[#0e0a1a] border border-emerald-500/40 space-y-4 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
              <div className="flex items-center space-x-2 text-emerald-400 font-mono font-bold text-xs uppercase">
                <Check className="w-4 h-4" />
                <span>Com a FraLib</span>
              </div>
              <ul className="space-y-2.5 text-xs font-mono text-slate-200">
                <li className="flex items-center space-x-2"><span className="text-emerald-400">✓</span> <span>Você escolhe cidade e nicho</span></li>
                <li className="flex items-center space-x-2"><span className="text-emerald-400">✓</span> <span>A FraLib encontra oportunidades</span></li>
                <li className="flex items-center space-x-2"><span className="text-emerald-400">✓</span> <span>A IA cria uma prévia de site</span></li>
                <li className="flex items-center space-x-2"><span className="text-emerald-400">✓</span> <span>A plataforma gera a abordagem</span></li>
                <li className="flex items-center space-x-2"><span className="text-emerald-400">✓</span> <span>Você chama o lead com algo concreto</span></li>
                <li className="flex items-center space-x-2"><span className="text-emerald-400">✓</span> <span>Tudo fica organizado no painel CRM</span></li>
              </ul>
            </div>
          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => handleOpenRegister('starter')}
              className="px-8 py-3.5 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs font-mono fl-pixel-btn shadow-[0_4px_0_#713f12] cursor-pointer inline-flex items-center space-x-2"
            >
              <span>PARAR DE PROSPECTAR NO ESCURO</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* WhatsApp Interactive Demo Chat */}
      <section className="py-20 px-4 md:px-8 border-b border-purple-900/40">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-2xl md:text-4xl font-black uppercase font-mono text-white">
              Você Não Vende Só Falando. Você Vende Mostrando.
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              A maioria dos freelancers manda mensagens iguais. A FraLib ajuda você a chegar com uma prévia pronta, aumentando a curiosidade e a percepção de valor.
            </p>
          </div>

          {/* Simulated WhatsApp Phone */}
          <div className="max-w-md mx-auto rounded-3xl border-4 border-slate-800 bg-[#0b141a] overflow-hidden shadow-2xl font-sans">
            <div className="bg-[#1f2c33] p-3 flex items-center space-x-3 text-white">
              <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-sm">
                V
              </div>
              <div>
                <div className="font-bold text-sm">Você (FraLib SDR)</div>
                <div className="text-[10px] text-emerald-400 font-mono">online · conversa com cliente</div>
              </div>
            </div>

            <div className="p-4 space-y-3 text-xs leading-relaxed bg-[#0b141a]">
              <div className="bg-[#005c4b] text-white p-3 rounded-xl max-w-[85%] ml-auto rounded-br-none space-y-1">
                <p>Oi, tudo bem? Vi que sua empresa aparece no Google, mas não encontrei um site profissional.</p>
                <div className="text-[9px] text-slate-300 text-right">10:32</div>
              </div>

              <div className="bg-[#005c4b] text-white p-3 rounded-xl max-w-[85%] ml-auto rounded-br-none space-y-1">
                <p>Montei uma prévia gratuita de como o site de vocês poderia ficar. Posso te mandar?</p>
                <div className="text-[9px] text-slate-300 text-right">10:33</div>
              </div>

              <div className="bg-[#1f2c33] text-slate-100 p-3 rounded-xl max-w-[85%] mr-auto rounded-bl-none space-y-1">
                <p>Pode sim, manda aí.</p>
                <div className="text-[9px] text-slate-400 text-right">10:41</div>
              </div>

              <div className="bg-[#005c4b] text-white p-3 rounded-xl max-w-[85%] ml-auto rounded-br-none space-y-1">
                <p>Aqui está a prévia: <span className="text-cyan-300 underline font-mono">pizzaria-sao-jose.fralib.site</span></p>
                <div className="text-[9px] text-slate-300 text-right">10:42</div>
              </div>

              <div className="bg-[#1f2c33] text-slate-100 p-3 rounded-xl max-w-[85%] mr-auto rounded-bl-none space-y-1">
                <p>Ficou muito bom! Quanto ficaria pra deixar no ar?</p>
                <div className="text-[9px] text-slate-400 text-right">10:50</div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => handleOpenRegister('starter')}
              className="px-8 py-3.5 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs font-mono fl-pixel-btn shadow-[0_4px_0_#713f12] cursor-pointer inline-flex items-center space-x-2"
            >
              <span>USAR ABORDAGEM COM EFEITO WOW</span>
              <Zap className="w-4 h-4 fill-black" />
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="beneficios" className="py-20 px-4 md:px-8 bg-[#07050e] border-b border-purple-900/40">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl md:text-4xl font-black uppercase font-mono text-white">
              Tudo para Transformar Dados Locais em Oportunidades de Venda
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#0e0a1a] border border-purple-800/40 space-y-3 hover:border-purple-600 transition-all">
              <Search className="w-8 h-8 text-yellow-400" />
              <h3 className="font-bold text-white font-mono text-base">Busca de leads locais</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Encontre empresas por cidade e nicho, sem ficar pesquisando manualmente.</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0e0a1a] border border-purple-800/40 space-y-3 hover:border-purple-600 transition-all">
              <BarChart3 className="w-8 h-8 text-cyan-400" />
              <h3 className="font-bold text-white font-mono text-base">Análise de oportunidade</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Veja sinais que ajudam a decidir quem vale abordar primeiro.</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0e0a1a] border border-purple-800/40 space-y-3 hover:border-purple-600 transition-all">
              <Globe className="w-8 h-8 text-emerald-400" />
              <h3 className="font-bold text-white font-mono text-base">Prévia de site com IA</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Gere uma demonstração visual baseada nos dados públicos do negócio.</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0e0a1a] border border-purple-800/40 space-y-3 hover:border-purple-600 transition-all">
              <MessageSquare className="w-8 h-8 text-purple-400" />
              <h3 className="font-bold text-white font-mono text-base">Abordagem personalizada</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Receba mensagens prontas para iniciar conversa no WhatsApp.</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0e0a1a] border border-purple-800/40 space-y-3 hover:border-purple-600 transition-all">
              <Layers className="w-8 h-8 text-pink-400" />
              <h3 className="font-bold text-white font-mono text-base">CRM simples</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Organize leads por status: novo, site criado, enviado, respondeu, proposta, fechado.</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0e0a1a] border border-purple-800/40 space-y-3 hover:border-purple-600 transition-all">
              <Users className="w-8 h-8 text-amber-400" />
              <h3 className="font-bold text-white font-mono text-base">Grupo WhatsApp</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Acesso ao grupo para suporte, networking, troca de nichos, scripts e aprendizados.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CALCULADORA DE LUCRO E ROI */}
      <section id="calculadora-roi" className="py-20 px-4 md:px-8 bg-[#090712] border-b border-purple-900/40">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest px-3 py-1 rounded bg-cyan-400/10 border border-cyan-400/20">
              SIMULADOR DE FATURAMENTO // MENSALIDADE VS VENDAS
            </span>
            <h2 className="text-2xl md:text-4xl font-black uppercase font-mono text-white">
              Calculadora de Lucro Líquido & ROI
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              Veja o impacto financeiro de fechar apenas alguns sites por mês utilizando a esteira automatizada da FraLib.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#0e0a1a] p-6 md:p-8 rounded-3xl border border-purple-800/50 shadow-2xl">
            {/* Sliders Area */}
            <div className="lg:col-span-6 space-y-6 font-mono text-xs">
              <div className="space-y-2">
                <div className="flex justify-between font-bold text-slate-200 text-sm">
                  <span>Sites Fechados por Mês:</span>
                  <span className="text-yellow-400 text-base">{roiSitesCount} sites</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={roiSitesCount}
                  onChange={(e) => setRoiSitesCount(Number(e.target.value))}
                  className="w-full accent-yellow-400 cursor-pointer h-2 bg-purple-950 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>1 site (iniciante)</span>
                  <span>10 sites (agência)</span>
                  <span>20 sites (escala)</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between font-bold text-slate-200 text-sm">
                  <span>Valor Médio do Site:</span>
                  <span className="text-emerald-400 text-base">R$ {roiPricePerSite.toLocaleString('pt-BR')}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="3000"
                  step="100"
                  value={roiPricePerSite}
                  onChange={(e) => setRoiPricePerSite(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer h-2 bg-purple-950 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>R$ 500 (rápido)</span>
                  <span>R$ 1.500 (padrão)</span>
                  <span>R$ 3.000 (premium)</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#07050e] border border-purple-900/60 text-slate-400 text-[11px] leading-relaxed">
                💡 <strong className="text-white">Apenas 1 site vendido</strong> a R$ 1.000 cobre <strong className="text-yellow-400">10 meses de assinatura</strong> do plano Starter (R$ 97/mês). Todo o restante é lucro líquido!
              </div>
            </div>

            {/* Calculations Display Card */}
            <div className="lg:col-span-6 bg-[#07050e] p-6 rounded-2xl border border-purple-800/60 font-mono space-y-5 text-center">
              <div className="space-y-1">
                <div className="text-xs text-slate-400 uppercase">Faturamento Bruto Mensal</div>
                <div className="text-3xl md:text-4xl font-black text-white">
                  R$ {(roiSitesCount * roiPricePerSite).toLocaleString('pt-BR')}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 py-3 border-y border-purple-900/60 text-xs">
                <div>
                  <div className="text-slate-500 text-[10px] uppercase">Assinatura FraLib</div>
                  <div className="font-bold text-purple-300">R$ 97 /mês</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[10px] uppercase">Retorno Estimado (ROI)</div>
                  <div className="font-bold text-cyan-400">
                    {((((roiSitesCount * roiPricePerSite) - 97) / 97) * 100).toFixed(0)}%
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-emerald-400 font-bold uppercase">LUCRO LÍQUIDO NO SEU BOLSO</div>
                <div className="text-3xl md:text-5xl font-black text-emerald-400 tracking-tight">
                  R$ {((roiSitesCount * roiPricePerSite) - 97).toLocaleString('pt-BR')}
                </div>
              </div>

              <button
                onClick={() => handleOpenRegister('starter')}
                className="w-full py-3.5 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs font-mono fl-pixel-btn shadow-[0_4px_0_#713f12] cursor-pointer flex items-center justify-center space-x-2"
              >
                <Zap className="w-4 h-4 fill-black" />
                <span>QUERO ESTES RESULTADOS AGORA</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* STUDIO EDITOR INSPECTOR DEMO */}
      <section id="studio-editor" className="py-20 px-4 md:px-8 border-b border-purple-900/40">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono font-bold text-purple-300 uppercase tracking-widest px-3 py-1 rounded bg-purple-900/30 border border-purple-500/40">
              FRALIB STUDIO // EDITOR DE SITES EM TEMPO REAL
            </span>
            <h2 className="text-2xl md:text-4xl font-black uppercase font-mono text-white">
              Edite Qualquer Prévia em Segundos com IA ou Visualmente
            </h2>
            <p className="text-slate-400 text-sm max-w-2xl mx-auto">
              Altere cores, fontes, seções e até mande instruções em texto para a IA atualizar o site do seu cliente antes do fechamento.
            </p>
          </div>

          {/* Simulated FraLib Studio Frame */}
          <div className="bg-[#12121a] border-2 border-purple-800/80 rounded-2xl overflow-hidden shadow-2xl font-sans">
            {/* Studio Header Bar */}
            <div className="bg-[#08080c] px-4 py-3 border-b border-purple-900/60 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center space-x-3">
                <span className="font-brand text-xs text-purple-400 font-bold tracking-wider">STUDIO</span>
                <span className="text-slate-400">|</span>
                <span className="text-slate-200 font-bold">Pizzaria São José</span>
              </div>

              <div className="flex items-center space-x-2 bg-[#12121a] p-1 rounded border border-purple-800/40">
                <button
                  onClick={() => setStudioDevice('desktop')}
                  className={`px-2.5 py-1 text-[11px] rounded transition-colors ${studioDevice === 'desktop' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  Desktop
                </button>
                <button
                  onClick={() => setStudioDevice('tablet')}
                  className={`px-2.5 py-1 text-[11px] rounded transition-colors ${studioDevice === 'tablet' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  Tablet
                </button>
                <button
                  onClick={() => setStudioDevice('mobile')}
                  className={`px-2.5 py-1 text-[11px] rounded transition-colors ${studioDevice === 'mobile' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  Mobile
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded shadow">
                  🚀 PUBLICAR
                </button>
              </div>
            </div>

            {/* Studio Body: Sidebar + Canvas */}
            <div className="flex flex-col md:flex-row min-h-[460px]">
              {/* Studio Sidebar Controls */}
              <div className="w-full md:w-64 bg-[#12121a] border-r border-purple-900/60 p-4 space-y-5 text-xs font-mono text-slate-300 shrink-0">
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">CORES & ESTILO</h4>
                  <div className="flex items-center justify-between">
                    <label>Cor de Destaque</label>
                    <input
                      type="color"
                      value={studioAccent}
                      onChange={(e) => setStudioAccent(e.target.value)}
                      className="w-7 h-6 rounded cursor-pointer bg-transparent border-0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">FONTE DOS TÍTULOS</h4>
                  <select
                    value={studioFontHeading}
                    onChange={(e) => setStudioFontHeading(e.target.value)}
                    className="w-full p-2 bg-[#08080c] border border-purple-800/60 rounded text-slate-200 text-xs font-mono"
                  >
                    <option value="Playfair Display">Playfair Display (Elegante)</option>
                    <option value="Montserrat">Montserrat (Moderno)</option>
                    <option value="Poppins">Poppins (Despojado)</option>
                    <option value="Oswald">Oswald (Forte)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">✦ EDITAR COM IA</h4>
                  <textarea
                    rows={2}
                    value={studioAiPrompt}
                    onChange={(e) => setStudioAiPrompt(e.target.value)}
                    placeholder="Ex: Mude o fundo pra escuro, adicione banner de cupom..."
                    className="w-full p-2 bg-[#08080c] border border-purple-800/60 rounded text-slate-200 text-xs font-mono resize-none"
                  />
                  <button
                    onClick={() => {
                      if (!studioAiPrompt) return;
                      setStudioAiStatus('⏳ IA Aplicando edição no site...');
                      setTimeout(() => {
                        setStudioAiStatus('✅ Edição com IA concluída com sucesso!');
                        setStudioAiPrompt('');
                      }, 1000);
                    }}
                    className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded text-[11px] cursor-pointer"
                  >
                    ✦ APLICAR COM IA
                  </button>
                  {studioAiMessage && (
                    <div className="text-[10px] text-emerald-400 font-bold mt-1">{studioAiMessage}</div>
                  )}
                </div>
              </div>

              {/* Studio Live Canvas View */}
              <div className="flex-1 bg-[#1a1a2e] p-4 flex items-center justify-center overflow-auto">
                <div
                  className={`bg-white text-slate-900 transition-all shadow-2xl rounded-lg overflow-hidden border border-slate-300 ${
                    studioDevice === 'mobile' ? 'w-[360px] h-[400px]' : studioDevice === 'tablet' ? 'w-[640px] h-[400px]' : 'w-full max-w-2xl h-[400px]'
                  }`}
                  style={{ fontFamily: studioFontHeading }}
                >
                  {/* Mock Site Canvas Content */}
                  <div className="p-6 space-y-4" style={{ borderTop: `4px solid ${studioAccent}` }}>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <span className="font-bold text-lg" style={{ color: studioAccent }}>🍕 Pizzaria São José</span>
                      <a href="#contato" className="px-3 py-1 rounded text-xs font-bold text-white shadow" style={{ backgroundColor: studioAccent }}>
                        Pedir no WhatsApp
                      </a>
                    </div>

                    <div className="space-y-2 py-4">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">A Melhor de Curitiba</span>
                      <h1 className="text-2xl font-black leading-tight" style={{ color: studioAccent }}>
                        Pizzas Artesanais Assadas no Forno a Lenha
                      </h1>
                      <p className="text-xs text-slate-600 leading-relaxed font-sans">
                        Massa de fermentação natural 48h, ingredientes selecionados e entrega rápida em até 35 minutos.
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                      <div className="px-3 py-2 rounded text-xs font-bold text-white" style={{ backgroundColor: studioAccent }}>
                        Ver Cardápio Completo
                      </div>
                      <div className="px-3 py-2 rounded text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">
                        ⭐ 4.8 / 5.0 (180 avaliações)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Story */}
      <section className="py-16 px-4 md:px-8 border-b border-purple-900/40">
        <div className="max-w-4xl mx-auto bg-[#0e0a1a] p-8 md:p-10 rounded-3xl border border-purple-800/50 flex flex-col md:flex-row items-center gap-8">
          <div className="w-28 h-28 rounded-2xl bg-gradient-to-tr from-purple-700 to-yellow-400 flex items-center justify-center text-black font-black font-mono text-3xl shrink-0 shadow-xl">
            FC
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-yellow-400 uppercase">Franz Capeleto — Fundador FraLib</span>
            </div>
            <h3 className="text-xl font-bold font-mono text-white">
              "A FraLib nasceu da minha dor como designer"
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Designer Gráfico formado em 2011. A dificuldade no início da carreira era sempre a mesma: ter clientes e ter visibilidade. Resolvi criar a FraLib para ajudar a melhorar a possibilidade de mais clientes em escala, com menos trabalho — porque trabalhar mais não garante qualidade e terceirizar também não fecha a conta.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => handleOpenRegister('starter')}
                className="px-6 py-2.5 bg-yellow-400 text-black font-bold font-mono text-xs fl-pixel-btn shadow-[0_3px_0_#713f12] cursor-pointer"
              >
                Quero vender no WhatsApp
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Beta Social Proof */}
      <section className="py-16 px-4 md:px-8 bg-[#07050e] border-b border-purple-900/40">
        <div className="max-w-5xl mx-auto space-y-8 text-center">
          <h2 className="text-xl md:text-3xl font-black font-mono uppercase text-white">
            O Beta Já Está Rodando
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-[#0e0a1a] border border-purple-800/40">
              <div className="text-3xl font-black font-mono text-yellow-400">40</div>
              <div className="text-xs font-mono text-slate-400">Usuários Beta</div>
            </div>
            <div className="p-5 rounded-xl bg-[#0e0a1a] border border-purple-800/40">
              <div className="text-3xl font-black font-mono text-emerald-400">+1.000</div>
              <div className="text-xs font-mono text-slate-400">Buscas em 1 mês</div>
            </div>
            <div className="p-5 rounded-xl bg-[#0e0a1a] border border-purple-800/40">
              <div className="text-3xl font-black font-mono text-cyan-400">+1.000</div>
              <div className="text-xs font-mono text-slate-400">Leads Encontrados</div>
            </div>
            <div className="p-5 rounded-xl bg-[#0e0a1a] border border-purple-800/40">
              <div className="text-3xl font-black font-mono text-purple-400">2</div>
              <div className="text-xs font-mono text-slate-400">Vendas Reportadas</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="planos" className="py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl md:text-4xl font-black uppercase font-mono text-white">
              Escolha Seu Plano
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              Comece com 1 pipeline grátis. Escale quando quiser. Cancele quando quiser.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {/* Trial */}
            <div className="p-6 rounded-2xl bg-[#0e0a1a] border border-purple-800/40 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">TRIAL</span>
                <h3 className="text-xl font-bold font-mono text-white">Grátis</h3>
                <div className="text-xs font-bold text-emerald-400 font-mono">1 SITE PRA TESTAR</div>
                <p className="text-xs text-slate-400">Veja o sistema funcionando antes de investir.</p>
                <ul className="space-y-2 text-xs font-mono text-slate-300 pt-2 border-t border-purple-900/40">
                  <li>✓ 1 site gerado</li>
                  <li>✓ Prospecção básica</li>
                  <li>✓ SDR Franz (1 abordagem)</li>
                  <li>✓ Fila com menor prioridade</li>
                </ul>
              </div>
              <button
                onClick={() => handleOpenRegister('trial')}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold font-mono text-xs rounded cursor-pointer"
              >
                TESTAR GRÁTIS
              </button>
            </div>

            {/* Starter */}
            <div className="p-6 rounded-2xl bg-[#0e0a1a] border border-yellow-500/50 flex flex-col justify-between space-y-6 relative">
              <div className="space-y-3">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-yellow-400 text-black uppercase">STARTER</span>
                <div>
                  <span className="text-2xl font-black text-white font-mono">R$ 97</span>
                  <span className="text-xs text-slate-400 font-mono"> / mês</span>
                </div>
                <div className="text-xs font-bold text-emerald-400 font-mono">7 DIAS DE GARANTIA</div>
                <p className="text-xs text-slate-400">Pra validar e começar a faturar. Cooldown de 60 min.</p>
                <ul className="space-y-2 text-xs font-mono text-slate-300 pt-2 border-t border-purple-900/40">
                  <li>✓ Sites ilimitados (cooldown 60min)</li>
                  <li>✓ Prospecção automática completa</li>
                  <li>✓ Dashboard básico</li>
                  <li>✓ Hospedagem inclusa</li>
                </ul>
              </div>
              <button
                onClick={() => handleOpenRegister('starter')}
                className="w-full py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-black font-mono text-xs fl-pixel-btn shadow-[0_4px_0_#713f12] cursor-pointer"
              >
                ASSINAR STARTER
              </button>
            </div>

            {/* Pro */}
            <div className="p-6 rounded-2xl bg-[#0e0a1a] border-2 border-purple-500 flex flex-col justify-between space-y-6 shadow-[0_0_25px_rgba(168,85,247,0.2)] relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase">
                MAIS POPULAR
              </div>
              <div className="space-y-3">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-600 text-white uppercase">PRO</span>
                <div>
                  <span className="text-2xl font-black text-white font-mono">R$ 197</span>
                  <span className="text-xs text-slate-400 font-mono"> / mês</span>
                </div>
                <div className="text-xs font-bold text-purple-400 font-mono">COOLDOWN REDUZIDO (30 MIN)</div>
                <p className="text-xs text-slate-400">Pra quem quer escalar rápido. Prioridade alta na fila.</p>
                <ul className="space-y-2 text-xs font-mono text-slate-300 pt-2 border-t border-purple-900/40">
                  <li>✓ Sites ilimitados (cooldown 30min)</li>
                  <li>✓ Prospecção avançada</li>
                  <li>✓ SDR Franz com retries</li>
                  <li>✓ Dashboard completo + analytics</li>
                  <li>✓ Prioridade alta na fila (nível 5)</li>
                </ul>
              </div>
              <button
                onClick={() => handleOpenRegister('pro')}
                className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-black font-mono text-xs fl-pixel-btn shadow-[0_4px_0_#3b0764] cursor-pointer"
              >
                ASSINAR PRO
              </button>
            </div>

            {/* Agency */}
            <div className="p-6 rounded-2xl bg-[#0e0a1a] border border-cyan-500/50 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-400 text-black uppercase">AGENCY</span>
                <div>
                  <span className="text-2xl font-black text-white font-mono">R$ 497</span>
                  <span className="text-xs text-slate-400 font-mono"> / mês</span>
                </div>
                <div className="text-xs font-bold text-cyan-400 font-mono">SEM COOLDOWN</div>
                <p className="text-xs text-slate-400">Para agências que precisam vender em volume.</p>
                <ul className="space-y-2 text-xs font-mono text-slate-300 pt-2 border-t border-purple-900/40">
                  <li>✓ Sites ilimitados (sem cooldown)</li>
                  <li>✓ Subcontas de operação</li>
                  <li>✓ Painel administrativo master</li>
                  <li>✓ Prioridade máxima na fila</li>
                  <li>✓ Suporte VIP</li>
                </ul>
              </div>
              <button
                onClick={() => handleOpenRegister('agency')}
                className="w-full py-2.5 bg-cyan-400 hover:bg-cyan-300 text-black font-bold font-mono text-xs rounded cursor-pointer"
              >
                ASSINAR AGENCY
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience Cards */}
      <section className="py-20 px-4 md:px-8 bg-[#07050e] border-t border-purple-900/40">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-xl md:text-3xl font-black uppercase font-mono text-white">
              Feito para Quem Quer Vender Serviços Digitais com Mais Velocidade
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
            {[
              { title: 'Freelancer', desc: 'Para quem vende site ou landing page e quer encontrar oportunidades sem depender só de indicação.' },
              { title: 'Social Media', desc: 'Para quem quer abrir conversa com empresas locais e oferecer presença digital ou conteúdo.' },
              { title: 'Gestor de Tráfego', desc: 'Para quem precisa de uma porta de entrada antes de vender anúncios ou captação.' },
              { title: 'Agência Pequena', desc: 'Para quem quer escalar prospecção e criar prévias sem sobrecarregar a equipe.' },
              { title: 'Designer/Criador', desc: 'Para quem cria sites e quer chegar na conversa com prévia pronta.' },
              { title: 'Iniciante', desc: 'Para quem ainda não sabe onde encontrar clientes e precisa de um caminho claro.' },
              { title: 'Já Usa IA', desc: 'Para quem usa tecnologia, mas ainda perde tempo fazendo busca e abordagem na mão.' }
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#0e0a1a] border border-purple-800/40 space-y-2">
                <h4 className="font-bold text-yellow-400 uppercase text-sm">{item.title}</h4>
                <p className="text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 md:px-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-4xl font-black uppercase font-mono text-white">
              Perguntas Frequentes
            </h2>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {[
              { q: 'Preciso saber programar?', a: 'Não. A FraLib gera o site completo com IA e entrega com visual cinematográfico sem necessidade de programar.' },
              { q: 'A FraLib garante vendas?', a: 'Não garantimos faturamento fixo, pois depende do seu contato e oferta. Porém fornecemos o lead quente e a prévia pronta.' },
              { q: 'A prévia é o site oficial do cliente?', a: 'Ela funciona como demonstração completa em subdomínio ou prévia. Ao fechar contrato, você pode publicar no domínio oficial.' },
              { q: 'Posso usar para vender automação também?', a: 'Sim! Muitos usuários utilizam o site como porta de entrada para depois vender gestão de redes ou automação de WhatsApp.' },
              { q: 'Posso começar mesmo sem experiência?', a: 'Sim, a interface é guiada e os scripts de abordagem já vêm pré-configurados.' },
              { q: 'Quanto eu posso cobrar?', a: 'Os valores de mercado praticados variam de R$ 500 a R$ 3.000 por site, além de mensalidades de manutenção.' },
              { q: 'Tem grupo de suporte?', a: 'Sim, todos os usuários têm acesso à comunidade no WhatsApp para troca de scripts e tirada de dúvidas.' }
            ].map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="rounded-xl border border-purple-800/40 bg-[#0e0a1a] overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left font-bold text-slate-100 flex items-center justify-between hover:bg-purple-900/30 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-purple-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-0 text-slate-300 border-t border-purple-900/30 bg-[#07050e]/50 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Beta Lead Simulation Form Section */}
      <section className="py-20 px-4 md:px-8 bg-[#07050e] border-t border-purple-900/40 text-center">
        <div className="max-w-xl mx-auto space-y-6">
          <span className="px-3 py-1 rounded bg-yellow-400 text-black text-xs font-mono font-black uppercase">
            VAGAS DO BETA ABERTAS
          </span>
          <h2 className="text-2xl md:text-4xl font-black uppercase font-mono text-white">
            Pare de Procurar Cliente no Escuro
          </h2>
          <p className="text-slate-400 text-xs font-mono">
            Simule sua região, encontre oportunidades locais e use a FraLib para gerar lead, prévia de site e abordagem pronta.
          </p>

          <form onSubmit={handleBetaSubmit} className="bg-[#0e0a1a] p-6 rounded-2xl border border-purple-800/50 space-y-4 text-left font-mono text-xs">
            {betaSubmitted ? (
              <div className="p-4 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-center space-y-2">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
                <div className="font-bold">Simulação enviada com sucesso!</div>
                <div className="text-[11px]">Redirecionando para o cadastro beta...</div>
              </div>
            ) : (
              <>
                <div className="space-y-1">
                  <label className="text-slate-400">Seu nome</label>
                  <input
                    type="text"
                    required
                    value={betaNome}
                    onChange={(e) => setBetaNome(e.target.value)}
                    placeholder="Ex: João Silva"
                    className="w-full px-3 py-2.5 rounded bg-[#07050e] border border-purple-800/60 text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400">E-mail</label>
                  <input
                    type="email"
                    required
                    value={betaEmail}
                    onChange={(e) => setBetaEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full px-3 py-2.5 rounded bg-[#07050e] border border-purple-800/60 text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400">WhatsApp</label>
                  <input
                    type="text"
                    required
                    value={betaPhone}
                    onChange={(e) => setBetaPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full px-3 py-2.5 rounded bg-[#07050e] border border-purple-800/60 text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-400">Cidade</label>
                    <input
                      type="text"
                      required
                      value={betaCidade}
                      onChange={(e) => setBetaCidade(e.target.value)}
                      placeholder="Ex: São Paulo"
                      className="w-full px-3 py-2.5 rounded bg-[#07050e] border border-purple-800/60 text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400">Nicho que quer atacar</label>
                    <input
                      type="text"
                      required
                      value={betaNicho}
                      onChange={(e) => setBetaNicho(e.target.value)}
                      placeholder="Ex: Pizzarias..."
                      className="w-full px-3 py-2.5 rounded bg-[#07050e] border border-purple-800/60 text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs font-mono fl-pixel-btn shadow-[0_4px_0_#713f12] cursor-pointer"
                >
                  QUERO SIMULAR MINHA REGIÃO
                </button>
              </>
            )}
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-900/40 py-10 px-4 text-center font-mono text-xs text-slate-500 space-y-4">
        <div className="flex justify-center space-x-4 text-slate-400">
          <a href="#como-funciona" className="hover:underline">Como funciona</a>
          <a href="#simulador" className="hover:underline">Simulador</a>
          <a href="#planos" className="hover:underline">Planos</a>
          <a href="#faq" className="hover:underline">FAQ</a>
        </div>
        <p>© 2026 FraLib OS · Todos os direitos reservados. CNPJ 21.199.022/0001-00</p>
      </footer>

      {/* Auth Modal (Login / Register) */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e0a1a] border border-purple-800/80 w-full max-w-md rounded-2xl p-6 space-y-6 relative shadow-2xl text-slate-200">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded hover:bg-purple-900/40 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center border-b border-purple-800/60 pb-3">
              <button
                onClick={() => { setAuthMode('login'); setAuthError(''); setAuthSuccess(''); }}
                className={`flex-1 py-2 text-center text-xs font-bold font-mono transition-colors border-b-2 ${
                  authMode === 'login'
                    ? 'border-yellow-400 text-yellow-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                ENTRAR
              </button>
              <button
                onClick={() => { setAuthMode('register'); setAuthError(''); setAuthSuccess(''); }}
                className={`flex-1 py-2 text-center text-xs font-bold font-mono transition-colors border-b-2 ${
                  authMode === 'register'
                    ? 'border-yellow-400 text-yellow-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                CRIAR CONTA BETA
              </button>
            </div>

            {authError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded text-rose-300 text-xs font-mono">
                {authError}
              </div>
            )}

            {authSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-300 text-xs font-mono">
                {authSuccess}
              </div>
            )}

            <form onSubmit={handleSubmitAuth} className="space-y-4 font-mono text-xs">
              {authMode === 'register' && (
                <>
                  <div className="space-y-1">
                    <label className="text-slate-400">Nome Completo</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: João Silva"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#07050e] border border-purple-800/60 rounded px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400">Nome da Agência / Empresa</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Agência Digital Elite"
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                      className="w-full bg-[#07050e] border border-purple-800/60 rounded px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                </>
              )}

              <div className="space-y-1">
                <label className="text-slate-400">E-mail</label>
                <input
                  type="email"
                  required
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#07050e] border border-purple-800/60 rounded px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Senha</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#07050e] border border-purple-800/60 rounded px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
                />
              </div>

              {authMode === 'register' && (
                <div className="space-y-1">
                  <label className="text-slate-400">Plano Selecionado</label>
                  <select
                    value={selectedPlan}
                    onChange={(e) => setSelectedPlan(e.target.value)}
                    className="w-full bg-[#07050e] border border-purple-800/60 rounded px-3 py-2 text-yellow-300 focus:outline-none focus:border-yellow-400"
                  >
                    <option value="trial">Trial - Grátis (1 site)</option>
                    <option value="starter">Starter - R$ 97/mês (7 dias garantia)</option>
                    <option value="pro">Pro - R$ 197/mês (Cooldown 30min)</option>
                    <option value="agency">Agency - R$ 497/mês (Sem cooldown)</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs font-mono fl-pixel-btn shadow-[0_4px_0_#713f12] cursor-pointer"
              >
                {loading ? 'Aguarde...' : authMode === 'login' ? 'ENTRAR NO PAINEL' : 'CONCLUIR CADASTRO'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

