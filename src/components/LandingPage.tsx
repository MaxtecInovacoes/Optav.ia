import React, { useState, useEffect } from 'react';
import { DocsView } from './DocsView.js';
import { BlogView } from './BlogView.js';
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
  XCircle,
  ChevronDown,
  MessageSquare,
  Play,
  Pause,
  TrendingUp,
  Award,
  Users,
  Target,
  Clock,
  HelpCircle,
  Send,
  Sliders,
  Code,
  Wrench,
  RefreshCw,
  Scissors,
  Briefcase,
  Calendar,
  Utensils,
  Palette,
  Stethoscope,
  Dumbbell,
  Home,
  Smile,
  ShoppingBag,
  BookOpen,
  FileText,
  ChevronRight,
  Share2,
  ExternalLink,
  AlertTriangle,
  Smartphone
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
  const [pageView, setPageView] = useState<'landing' | 'docs' | 'blog'>('landing');
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [selectedPlan, setSelectedPlan] = useState<string>('starter');

  // Auth form states
  const [loginEmail, setLoginEmail] = useState('demo@optav.ia');
  const [loginPassword, setLoginPassword] = useState('123456');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerAgency, setRegisterAgency] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Live Simulator state ("QUANTAS OPORTUNIDADES EXISTEM NA SUA CIDADE AGORA?")
  const [simCity, setSimCity] = useState('Curitiba');
  const [simNiche, setSimNiche] = useState('Pizzarias');
  const [simTicket, setSimTicket] = useState<number>(1500);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedLeads, setSimulatedLeads] = useState(187);
  const [simulatedNoSite, setSimulatedNoSite] = useState(42);

  // 90s Video Demo playback simulator
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const [demoProgress, setDemoProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(1);

  // Beta Lead Simulation Form state
  const [leadFormName, setLeadFormName] = useState('');
  const [leadFormEmail, setLeadFormEmail] = useState('');
  const [leadFormPhone, setLeadFormPhone] = useState('');
  const [leadFormCity, setLeadFormCity] = useState('');
  const [leadFormNiche, setLeadFormNiche] = useState('');
  const [leadFormSuccess, setLeadFormSuccess] = useState(false);

  // FAQ Accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Particle background animation effect
  useEffect(() => {
    const canvas = document.getElementById('claude-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: Array<{ x: number; y: number; vx: number; vy: number; radius: number; alpha: number }> = [];
    const particleCount = Math.min(Math.floor((width * height) / 20000), 50);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.4 + 0.1
      });
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 158, 11, ${p.alpha})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Handle Demo progress timer
  useEffect(() => {
    let interval: any = null;
    if (isPlayingDemo) {
      interval = setInterval(() => {
        setDemoProgress((prev) => {
          if (prev >= 100) {
            setIsPlayingDemo(false);
            return 0;
          }
          const next = prev + 2;
          if (next > 85) setActiveStep(7);
          else if (next > 70) setActiveStep(6);
          else if (next > 55) setActiveStep(5);
          else if (next > 40) setActiveStep(4);
          else if (next > 25) setActiveStep(3);
          else if (next > 10) setActiveStep(2);
          else setActiveStep(1);
          return next;
        });
      }, 300);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlayingDemo]);

  const handleSimulate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      const randomLeads = Math.floor(Math.random() * 120) + 90;
      const randomNoSite = Math.floor(randomLeads * 0.28);
      setSimulatedLeads(randomLeads);
      setSimulatedNoSite(randomNoSite);
    }, 800);
  };

  const handleOpenLogin = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const handleOpenRegister = (planId?: string) => {
    if (planId) setSelectedPlan(planId);
    setAuthMode('register');
    setShowAuthModal(true);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });

      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Falha no login');
        setAuthLoading(false);
        return;
      }

      setAuthLoading(false);
      setShowAuthModal(false);
      onLoginSuccess(data.user, data.tenant);
    } catch (err) {
      setAuthError('Erro ao conectar ao servidor.');
      setAuthLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: registerName,
          email: registerEmail,
          password: registerPassword,
          agencyName: registerAgency,
          plan: selectedPlan
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Falha no registro');
        setAuthLoading(false);
        return;
      }

      setAuthLoading(false);
      setShowAuthModal(false);
      onLoginSuccess(data.user, data.tenant);
    } catch (err) {
      setAuthError('Erro ao conectar ao servidor.');
      setAuthLoading(false);
    }
  };

  const handleLeadFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadFormName || !leadFormEmail) return;
    setLeadFormSuccess(true);
    setTimeout(() => {
      handleOpenRegister('starter');
    }, 1500);
  };

  const faqItems = [
    {
      q: 'Preciso saber programar?',
      a: 'Não! A Optav.ia gera o site inteiro com inteligência artificial, copy persuasiva, layout adaptado ao celular e link de demonstração pronto. Você não precisa escrever nenhuma linha de código.'
    },
    {
      q: 'A Optav.ia garante vendas?',
      a: 'Não. A Optav.ia fornece ferramentas autônomas de mineração de negócios no Google Maps, geração de prévias e scripts de abordagem. O fechamento das vendas depende do seu nicho, negociação e acompanhamento do lead.'
    },
    {
      q: 'A prévia é o site oficial do cliente?',
      a: 'É uma demonstração funcional de alto nível em link temporário (ex: pizzaria-sao-jose.optav.ia) que você envia para encantar o proprietário. Após fechar o contrato, você personaliza os detalhes e pode publicar no domínio oficial do cliente.'
    },
    {
      q: 'Posso usar para vender automação também?',
      a: 'Com certeza! A criação de sites serve como a melhor porta de entrada para você abrir conversas no WhatsApp e depois oferecer tráfego pago, automação com robô de atendimento, gestão de redes sociais e CRM.'
    },
    {
      q: 'Posso começar mesmo sem experiência?',
      a: 'Sim! O fluxo da plataforma foi desenhado para ser intuitivo até para uma criança: você escolhe a cidade, escolhe o nicho e a IA indica quem abordar com uma prévia visual pronta.'
    },
    {
      q: 'Quanto eu posso cobrar?',
      a: 'Nossos usuários beta costumam cobrar de R$ 500 a R$ 3.000 por site entregue, além de estabelecerem uma taxa de manutenção mensal de R$ 99 a R$ 299 para hospedagem e pequenas atualizações.'
    },
    {
      q: 'Tem grupo de suporte e networking?',
      a: 'Sim! Todos os membros do beta têm acesso ao nosso grupo exclusivo no WhatsApp para suporte direto, troca de scripts de vendas, análises de nichos lucrativos e aprendizados práticos.'
    },
    {
      q: 'Posso cancelar minha assinatura?',
      a: 'Sim, a qualquer momento sem multas ou fidelidade. Além disso, você conta com nossa Garantia Incondicional de 30 Dias no plano Starter e Pro.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#09090d] text-zinc-100 font-sans relative selection:bg-amber-500/30 selection:text-amber-300">
      {/* Background canvas for smooth particle animation */}
      <canvas id="claude-canvas" className="fixed inset-0 pointer-events-none z-0 opacity-40" />

      {/* TOP KPA-STYLE GUARANTEE TICKER BAR */}
      <div className="relative z-50 bg-[#0d0d14] border-b border-zinc-800/80 text-[11px] font-mono py-2 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-zinc-400 text-center">
          <span className="text-amber-400 font-bold flex items-center space-x-1">
            <span>✓</span> <span>BUSCA MAPS API TEMPO REAL</span>
          </span>
          <span className="hidden sm:inline text-zinc-600">•</span>
          <span className="text-emerald-400 font-bold flex items-center space-x-1">
            <span>✓</span> <span>PRÉVIA TAILWIND/REACT EM 90S</span>
          </span>
          <span className="hidden md:inline text-zinc-600">•</span>
          <span className="text-cyan-400 font-bold flex items-center space-x-1">
            <span>✓</span> <span>7 AGENTES AUTÔNOMOS INCLUSOS</span>
          </span>
          <span className="hidden lg:inline text-zinc-600">•</span>
          <span className="text-zinc-200 font-bold flex items-center space-x-1">
            <span>✓</span> <span>ATIVAÇÃO IMEDIATA DO BETA</span>
          </span>
        </div>
      </div>

      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-40 bg-[#09090d]/95 backdrop-blur-md border-b border-zinc-800/80 px-4 md:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Version */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setPageView('landing')}>
            <div className="w-9 h-9 rounded-lg bg-amber-500 text-black flex items-center justify-center font-mono font-black text-xl shadow-lg shadow-amber-500/20">
              O
            </div>
            <div className="flex flex-col">
              <span className="font-mono font-black text-lg text-white tracking-wider flex items-center space-x-1">
                <span>OPTAV</span><span className="text-amber-400">.IA</span>
              </span>
              <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">
                OS v4.2 • AI SALES AUTOPILOT
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-6 text-xs font-mono text-zinc-300">
            <button
              onClick={() => { setPageView('landing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`hover:text-amber-400 transition-colors ${pageView === 'landing' ? 'text-amber-400 font-bold' : ''}`}
            >
              Home
            </button>
            <a href="#como-funciona" onClick={() => setPageView('landing')} className="hover:text-amber-400 transition-colors">
              Como funciona
            </a>
            <a href="#simulador" onClick={() => setPageView('landing')} className="hover:text-amber-400 transition-colors">
              Simulador
            </a>
            <a href="#provas" onClick={() => setPageView('landing')} className="hover:text-amber-400 transition-colors text-emerald-400 font-bold">
              Prova Social
            </a>
            <a href="#planos" onClick={() => setPageView('landing')} className="hover:text-amber-400 transition-colors text-amber-300 font-bold">
              Planos
            </a>
            <a href="#faq" onClick={() => setPageView('landing')} className="hover:text-amber-400 transition-colors">
              FAQ
            </a>
            <button
              onClick={() => { setPageView('docs'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`hover:text-amber-400 transition-colors flex items-center space-x-1 ${pageView === 'docs' ? 'text-amber-400 font-bold' : ''}`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Docs</span>
            </button>
            <button
              onClick={() => { setPageView('blog'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`hover:text-amber-400 transition-colors flex items-center space-x-1 ${pageView === 'blog' ? 'text-amber-400 font-bold' : ''}`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Blog</span>
            </button>
          </nav>

          {/* Nav Actions */}
          <div className="flex items-center space-x-3">
            {isLoggedIn ? (
              <button
                onClick={onNavigateToDashboard}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-mono font-black text-xs rounded-lg transition-all flex items-center space-x-2 shadow-md cursor-pointer"
              >
                <span>ACESSAR MEU PAINEL →</span>
              </button>
            ) : (
              <>
                <button
                  onClick={handleOpenLogin}
                  className="px-3.5 py-1.5 text-xs font-mono font-bold text-zinc-300 hover:text-white transition-colors cursor-pointer"
                >
                  ENTRAR
                </button>
                <button
                  onClick={() => handleOpenRegister('starter')}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-mono font-black text-xs rounded-lg transition-all cursor-pointer shadow-md shadow-amber-500/20 flex items-center space-x-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>ENTRAR NO BETA</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* DYNAMIC VIEW SWITCH (LANDING, DOCS, BLOG) */}
      {pageView === 'docs' ? (
        <DocsView
          onOpenRegister={handleOpenRegister}
          onNavigateHome={() => setPageView('landing')}
        />
      ) : pageView === 'blog' ? (
        <BlogView
          onOpenRegister={handleOpenRegister}
          onNavigateHome={() => setPageView('landing')}
        />
      ) : (
        <main className="relative z-10">
          {/* ========================================== */}
          {/* 1. HERO SECTION (DARK HIGH CONTRAST) */}
          {/* ========================================== */}
          <section className="pt-10 md:pt-16 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Left Column - Headline & CTA */}
              <div className="lg:col-span-7 space-y-6 text-left">
                
                {/* Eyebrow Tag */}
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                  <span>OPTAV.IA OS • ENTREGA IMEDIATA DE DEMO</span>
                </div>

                {/* Main Headline */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white font-sans tracking-tight leading-tight">
                  Prospecção de Clientes Locais com até{' '}
                  <span className="text-amber-400 underline decoration-amber-500/40 decoration-4">
                    75% de economia de tempo.
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-zinc-300 font-sans text-sm md:text-base leading-relaxed max-w-2xl">
                  O plano com IA autônoma que varre o Google Maps, descobre empresas sem site, cria a demonstração em 90 segundos e gera a abordagem no WhatsApp. Tudo sem travar no meio do projeto.
                </p>

                {/* Stock Limit Progress Bar (KPA Style) */}
                <div className="bg-[#12121c] border border-zinc-800 rounded-xl p-4 space-y-2 max-w-xl font-mono text-xs">
                  <div className="flex justify-between items-center text-zinc-300 font-bold">
                    <span>Ativações liberadas neste lote beta:</span>
                    <span className="text-amber-400 font-black">77% concluído</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-full w-[77%] rounded-full shadow-sm"></div>
                  </div>
                  <div className="text-[10px] text-zinc-500">
                    Vagas controladas para o servidor manter a geração de sites e buscas em alta velocidade.
                  </div>
                </div>

                {/* Main CTA Button & Sub-guarantees */}
                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => handleOpenRegister('starter')}
                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-black font-black rounded-xl text-base transition-all shadow-xl shadow-amber-500/25 flex items-center justify-center space-x-3 cursor-pointer uppercase tracking-wider font-mono"
                  >
                    <span>QUERO MEU ACESSO À OPTAV.IA OS →</span>
                  </button>

                  {/* 4 Checks Under CTA */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-mono text-zinc-400 pt-1">
                    <span className="text-emerald-400 font-bold">✓ BUSCA MAPS API</span>
                    <span className="text-emerald-400 font-bold">✓ PRÉVIA REACT</span>
                    <span className="text-emerald-400 font-bold">✓ SCRIPT WHATSAPP</span>
                    <span className="text-emerald-400 font-bold">✓ ATIVAÇÃO IMEDIATA</span>
                  </div>
                </div>

                {/* Direct WhatsApp Contact Bar */}
                <div className="pt-2">
                  <a
                    href="https://wa.me/5541985134105"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-xs font-mono text-zinc-400 hover:text-emerald-400 transition-colors bg-zinc-900/80 border border-zinc-800 px-4 py-2 rounded-lg"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    <span>Dúvidas? Fale direto no WhatsApp (41) 98513-4105</span>
                  </a>
                </div>
              </div>

              {/* Right Column - Dual Interactive Visual Frame */}
              <div className="lg:col-span-5 relative">
                <div className="bg-[#121218] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden font-mono text-xs">
                  {/* Browser Address Bar */}
                  <div className="bg-[#181822] px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
                      <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                      <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                    </div>
                    <div className="bg-[#09090d] text-zinc-400 px-5 py-1 rounded border border-zinc-800 text-[11px] flex items-center space-x-2">
                      <Lock className="w-3 h-3 text-emerald-400" />
                      <span className="text-zinc-200 font-bold">app.optav.ia/engine</span>
                    </div>
                    <div className="text-[10px] text-emerald-400 font-bold flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                      <span>ACTIVE</span>
                    </div>
                  </div>

                  {/* Visual Dashboard Engine Mockup */}
                  <div className="p-5 space-y-4 bg-[#0d0d14]">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-[#151522] p-3 rounded-xl border border-zinc-800">
                        <div className="text-zinc-500 text-[10px] uppercase font-bold">CIDADE / NICHO</div>
                        <div className="text-amber-400 font-bold text-xs mt-1">Curitiba • Pizzarias</div>
                      </div>
                      <div className="bg-[#151522] p-3 rounded-xl border border-zinc-800">
                        <div className="text-zinc-500 text-[10px] uppercase font-bold">SEM SITE DETECTADO</div>
                        <div className="text-emerald-400 font-black text-sm mt-1">42 oportunidades</div>
                      </div>
                    </div>

                    {/* Active Generated Lead Card */}
                    <div className="bg-[#161624] p-4 rounded-xl border border-amber-500/40 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold text-[9px] border border-emerald-800">
                          SITE PRONTO EM 90s
                        </span>
                        <span className="text-zinc-400 text-[10px]">98.4% Score IA</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white font-sans">🍕 Pizzaria São José</h4>
                        <p className="text-zinc-400 text-[11px] mt-0.5">Cardápio digital, localização no Google Maps e botão WhatsApp.</p>
                      </div>
                      
                      <div className="bg-[#0b141a] p-2.5 rounded-lg border border-emerald-900/50 text-[10px] space-y-1 text-zinc-300">
                        <div className="text-emerald-400 font-bold flex items-center space-x-1">
                          <MessageSquare className="w-3 h-3" />
                          <span>Script de Abordagem WhatsApp:</span>
                        </div>
                        <p className="italic text-zinc-400">"Oi! Montei uma prévia gratuita de como o site da Pizzaria São José ficaria no celular. Posso te enviar o link?"</p>
                      </div>

                      <button
                        onClick={() => handleOpenRegister('starter')}
                        className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg text-xs transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                      >
                        <span>USAR ESTE LEAD E ABRIR DEMO →</span>
                      </button>
                    </div>

                    {/* 7 Autonomous Agents Status */}
                    <div className="bg-[#11111a] p-3 rounded-xl border border-zinc-800 text-[10px] text-zinc-400 space-y-1.5">
                      <div className="text-zinc-300 font-bold flex items-center justify-between">
                        <span>7 Agentes Autônomos de Execução:</span>
                        <span className="text-emerald-400 font-mono">100% OPERACIONAIS</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-[9px] text-zinc-500 font-mono">
                        <div>• Scraper Google Maps</div>
                        <div>• Validador SEO / WHOIS</div>
                        <div>• Copywriter Persuasivo</div>
                        <div>• Designer Tailwind/React</div>
                        <div>• SDR Abordagem WhatsApp</div>
                        <div>• Gerenciador de Dominio</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* ========================================== */}
          {/* 2. DARK SECTION: COMPARISON & AGENCY COST BREAKDOWN */}
          {/* ========================================== */}
          <section className="py-16 md:py-24 px-4 md:px-8 border-t border-b border-zinc-800/80 bg-[#0d0d14]">
            <div className="max-w-6xl mx-auto space-y-14 text-center">
              
              {/* Headline */}
              <div className="space-y-4 max-w-4xl mx-auto">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
                  O COMPARATIVO DEFINITIVO DE CUSTOS
                </span>
                <h2 className="text-3xl md:text-5xl font-black font-sans tracking-tight leading-tight text-white">
                  Por que pagar <span className="text-amber-400">R$ 1.500/mês para agências</span> ou montar uma equipe cara se você não precisa?
                </h2>
                <p className="text-zinc-300 font-sans text-base md:text-lg leading-relaxed">
                  Para entregar a mesma velocidade e qualidade da <strong className="text-white">Optav.ia OS</strong>, uma agência tradicional precisa contratar 7 profissionais especializados. Veja a diferença brutal de custos, tempo e dor de cabeça:
                </p>
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-sm font-bold text-amber-300 max-w-3xl mx-auto font-mono">
                  ⚡ Com a Optav.ia OS, você tem 7 Agentes de IA trabalhando 24h por dia por uma <span className="text-white underline">fração mínima</span>: a partir de R$ 97/mês (menos de R$ 3,23 por dia).
                </div>
              </div>

              {/* Side-by-Side Detailed Agency Cost Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left font-sans text-xs md:text-sm items-stretch">
                
                {/* Left Card - Agency / Human Team (12-col span 6) */}
                <div className="lg:col-span-6 bg-[#12121a] border border-rose-500/30 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
                      <div className="font-mono text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center space-x-2">
                        <span>✕</span>
                        <span>MONTAR AGÊNCIA / EQUIPE HUMANA</span>
                      </div>
                      <span className="px-2.5 py-1 bg-rose-950/80 text-rose-300 border border-rose-800 rounded font-mono font-bold text-[10px]">
                        R$ 29.000+/mês
                      </span>
                    </div>

                    <p className="text-zinc-400 text-xs mb-4">
                      Custos de salários para ter 7 papéis executando a prospecção e criação manual:
                    </p>

                    <ul className="space-y-3.5 text-zinc-300 font-mono text-xs">
                      <li className="flex items-start justify-between border-b border-zinc-800/50 pb-2">
                        <span>• 1 SDR Hunter (Busca Google Maps)</span>
                        <span className="text-rose-400 font-bold">R$ 3.500/mês</span>
                      </li>
                      <li className="flex items-start justify-between border-b border-zinc-800/50 pb-2">
                        <span>• 1 Auditor SEO / Diagnóstico Técnico</span>
                        <span className="text-rose-400 font-bold">R$ 3.000/mês</span>
                      </li>
                      <li className="flex items-start justify-between border-b border-zinc-800/50 pb-2">
                        <span>• 1 Copywriter Publicitário</span>
                        <span className="text-rose-400 font-bold">R$ 4.000/mês</span>
                      </li>
                      <li className="flex items-start justify-between border-b border-zinc-800/50 pb-2">
                        <span>• 1 UI/UX Designer Mobile</span>
                        <span className="text-rose-400 font-bold">R$ 5.000/mês</span>
                      </li>
                      <li className="flex items-start justify-between border-b border-zinc-800/50 pb-2">
                        <span>• 1 Desenvolvedor React/Tailwind</span>
                        <span className="text-rose-400 font-bold">R$ 6.000/mês</span>
                      </li>
                      <li className="flex items-start justify-between border-b border-zinc-800/50 pb-2">
                        <span>• 1 SDR de Abordagem WhatsApp</span>
                        <span className="text-rose-400 font-bold">R$ 3.500/mês</span>
                      </li>
                      <li className="flex items-start justify-between border-b border-zinc-800/50 pb-2">
                        <span>• 1 DevOps & Infraestrutura</span>
                        <span className="text-rose-400 font-bold">R$ 4.000/mês</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-[#181216] border border-rose-900/50 p-4 rounded-xl text-xs space-y-2 text-rose-200">
                    <div className="font-bold font-mono text-rose-400 flex items-center space-x-1">
                      <AlertTriangle className="w-4 h-4" />
                      <span>E TEM MAIS DORES DE CABEÇA:</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-zinc-400 font-sans">
                      Encargos CLT, impostos, 13º salário, férias, aluguel de escritório, equipamentos, reuniões diárias de alinhamento e atrasos nas entregas. <strong className="text-rose-300">E você precisa gerenciar todos eles!</strong>
                    </p>
                  </div>
                </div>

                {/* Right Card - Optav.ia OS (Highlighted 12-col span 6) */}
                <div className="lg:col-span-6 bg-[#141420] border-2 border-amber-500 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl relative flex flex-col justify-between shadow-amber-500/10">
                  <span className="absolute -top-3.5 right-6 bg-gradient-to-r from-amber-500 to-orange-500 text-black text-[10px] font-mono font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                    ECONOMIA SUPERIOR A 99%
                  </span>

                  <div>
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
                      <div className="font-mono text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-2">
                        <span>✓</span>
                        <span>COM A OPTAV.IA OS (7 AGENTES IA)</span>
                      </div>
                      <span className="px-2.5 py-1 bg-amber-950 text-amber-300 border border-amber-700 rounded font-mono font-bold text-xs">
                        A partir de R$ 97/mês
                      </span>
                    </div>

                    <p className="text-zinc-300 text-xs mb-4">
                      Os 7 Agentes Autônomos substituem toda a cadeia operacional em 90 segundos:
                    </p>

                    <ul className="space-y-3.5 text-zinc-200 font-mono text-xs">
                      <li className="flex items-start space-x-2">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span><strong>Agente Scraper Google Maps:</strong> Varre empresas sem site automaticamente.</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span><strong>Agente Validador SEO/WHOIS:</strong> Audit de falhas e domínios.</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span><strong>Agente Copywriter Persuasivo:</strong> Cria textos focados na conversão do nicho.</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span><strong>Agente Designer & Coder:</strong> Gera o site em código React + Tailwind responsivo.</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span><strong>Agente SDR WhatsApp:</strong> Redige abordagens perfeitas com o link da prévia.</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span><strong>Agente DevOps Autônomo:</strong> Publica links de demonstração instantâneos.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-[#1b1928] to-[#12121d] border border-emerald-500/40 p-4 rounded-xl text-xs space-y-2 text-emerald-300">
                    <div className="font-bold font-mono text-emerald-400 flex items-center space-x-1">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span>VOCÊ PRATICAMENTE NÃO TEM TRABALHO BRAÇAL:</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-zinc-300 font-sans">
                      Você não digita código, não contrata ninguém e não precisa gerenciar pessoas. Apenas insere a cidade e o nicho, a IA gera tudo em 90 segundos e você só envia a prévia pelo WhatsApp.
                    </p>
                  </div>
                </div>

              </div>

              {/* Additional Deep-Dive Comparison: Tráfego Pago vs Prospecção Autônoma Optav.ia */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left font-sans text-xs md:text-sm pt-4">
                
                {/* Paid Traffic Comparison Card */}
                <div className="bg-[#11111a] border border-rose-500/30 rounded-2xl p-6 space-y-4 shadow-xl">
                  <div className="flex items-center space-x-2 text-rose-400 font-mono font-bold text-xs uppercase border-b border-zinc-800 pb-3">
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <span>ARMADILHA DO TRÁFEGO PAGO & ANÚNCIOS</span>
                  </div>
                  <ul className="space-y-3 text-zinc-300 font-sans">
                    <li className="flex items-start space-x-2">
                      <span className="text-rose-400 font-bold">•</span>
                      <span><strong>R$ 1.500 a R$ 3.000/mês queimados em Anúncios:</strong> Verba no Meta Ads/Google Ads sem garantia nenhuma de retorno.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-rose-400 font-bold">•</span>
                      <span><strong>Custo por Lead (CPL) absurdo:</strong> Dezenas de curiosos preenchem o formulário, não atendem o WhatsApp e somem.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-rose-400 font-bold">•</span>
                      <span><strong>Dependência de Gestor de Tráfego:</strong> Mensalidade fixa para terceiros configurarem pixel, públicos e testes de criativos.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-rose-400 font-bold">•</span>
                      <span><strong>Processo Manual Cansativo:</strong> Mesmo se o lead responder, você ainda tem que fazer reunião, criar briefing e desenhar o site do zero.</span>
                    </li>
                  </ul>
                  <div className="bg-[#181216] border border-rose-900/50 p-3.5 rounded-xl text-rose-300 text-xs">
                    <strong>Resultado Tradicional:</strong> Alto risco financeiro antes de ver o primeiro real de lucro.
                  </div>
                </div>

                {/* Optav.ia OS Zero Ads & End-to-End Automation Card */}
                <div className="bg-[#141424] border border-amber-500/50 rounded-2xl p-6 space-y-4 shadow-2xl">
                  <div className="flex items-center space-x-2 text-amber-400 font-mono font-bold text-xs uppercase border-b border-zinc-800 pb-3">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>REVOLUÇÃO OPTAV.IA: 0 ANÚNCIOS + IA AUTÔNOMA END-TO-END</span>
                  </div>
                  <ul className="space-y-3 text-zinc-200 font-sans">
                    <li className="flex items-start space-x-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span><strong>R$ 0 em Anúncios ou Tráfego Pago:</strong> A mineração inteligente varre o Google Maps e descobre quem precisa de site agora.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span><strong>A IA Faz TUDO Antes da Abordagem:</strong> Encontra a empresa, cria a copy persuasiva, projeta e publica a demonstração em 90s.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span><strong>Zero Intervenção Humana na Produção:</strong> Você não escreve código, não desenha telas e não precisa de equipe.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span><strong>Venda Pronta no Celular:</strong> Você envia o link no WhatsApp com o site funcionando e fecha o contrato direto no PIX.</span>
                    </li>
                  </ul>
                  <div className="bg-emerald-950/50 border border-emerald-900/60 p-3.5 rounded-xl text-emerald-300 text-xs">
                    <strong>Resultado Optav.ia:</strong> Prospecção ativa de altíssima conversão com custo operacional próximo a zero.
                  </div>
                </div>

              </div>

            </div>
          </section>

          {/* ========================================== */}
          {/* 3. DARK SECTION: TRANSPARENCY / HOW IT WORKS */}
          {/* ========================================== */}
          <section className="py-16 md:py-24 px-4 md:px-8 max-w-6xl mx-auto space-y-12 text-center">
            <div className="space-y-3 max-w-3xl mx-auto">
              <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                SEM PEGADINHA
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white font-sans tracking-tight">
                Por que é tão mais <span className="text-amber-400">eficiente e acessível?</span>
              </h2>
              <p className="text-zinc-400 font-sans text-sm md:text-base leading-relaxed">
                A Optav.ia é um HUB de agentes de inteligência artificial otimizados para prospecção local. A gente contrata capacidade em lote nos servidores e entrega tudo pronto pra você usar, sem enrolação.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left font-sans text-xs md:text-sm">
              <div className="bg-[#121218] border border-zinc-800 rounded-2xl p-6 space-y-3">
                <h3 className="text-lg font-bold text-amber-400 font-mono">E a qualidade do site gerado?</h3>
                <p className="text-zinc-300 leading-relaxed">
                  É código React + Tailwind responsivo de alto nível, com copy persuasiva adaptada ao nicho local (pizzarias, clínicas, advogados). O proprietário do negócio vê o nome dele no site e se encanta na hora.
                </p>
              </div>

              <div className="bg-[#121218] border border-zinc-800 rounded-2xl p-6 space-y-3">
                <h3 className="text-lg font-bold text-amber-400 font-mono">Por que entregamos a prévia pronta?</h3>
                <p className="text-zinc-300 leading-relaxed">
                  Porque prospecção no escuro não funciona mais. Quando você aborda um cliente mostrando a prévia do site dele pronta no celular, a curiosidade e a taxa de fechamento disparam.
                </p>
              </div>
            </div>
          </section>

          {/* ========================================== */}
          {/* 4. DARK SECTION: INCLUDED FEATURES MATRIX */}
          {/* ========================================== */}
          <section className="bg-[#0b0b10] text-white py-16 md:py-24 px-4 md:px-8 border-t border-b border-zinc-800/80">
            <div className="max-w-4xl mx-auto space-y-10 text-center">
              
              <div className="space-y-3">
                <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                  TUDO QUE VEM NO PLANO
                </div>
                <h2 className="text-3xl md:text-5xl font-black font-sans tracking-tight">
                  Você não leva só a busca. <span className="text-amber-400">Leva o ecossistema.</span>
                </h2>
                <p className="text-zinc-400 font-sans text-sm md:text-base">
                  Uma assinatura completa, tudo isto incluso sem taxas ocultas:
                </p>
              </div>

              {/* Comprehensive Feature Table (Dark Luxury Style) */}
              <div className="bg-[#121218] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl text-left font-sans text-xs md:text-sm">
                
                <div className="divide-y divide-zinc-800">
                  <div className="p-4 md:p-5 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-emerald-400 font-bold text-base">✓</span>
                      <div>
                        <div className="font-bold text-white">Mineração no Google Maps em Tempo Real</div>
                        <div className="text-zinc-400 text-xs">Varra cidades inteiras filtrando quem tem ou não tem site.</div>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-zinc-400">Incluso</span>
                  </div>

                  <div className="p-4 md:p-5 flex items-center justify-between bg-[#161622]">
                    <div className="flex items-center space-x-3">
                      <span className="text-emerald-400 font-bold text-base">✓</span>
                      <div>
                        <div className="font-bold text-white">7 Agentes Autônomos de Copy, Design e Código</div>
                        <div className="text-zinc-400 text-xs">Agentes especializados geram a estrutura completa do site.</div>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-amber-400 uppercase">Exclusivo Optav.ia</span>
                  </div>

                  <div className="p-4 md:p-5 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-emerald-400 font-bold text-base">✓</span>
                      <div>
                        <div className="font-bold text-white">Gerador de Prévia Responsiva Tailwind/React</div>
                        <div className="text-zinc-400 text-xs">Links de demonstração prontos para enviar via WhatsApp.</div>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-zinc-400">Incluso</span>
                  </div>

                  <div className="p-4 md:p-5 flex items-center justify-between bg-[#161622]">
                    <div className="flex items-center space-x-3">
                      <span className="text-emerald-400 font-bold text-base">✓</span>
                      <div>
                        <div className="font-bold text-white">Script de Abordagem WhatsApp de Alta Conversão</div>
                        <div className="text-zinc-400 text-xs">Cópia personalizada criada especificamente para cada cliente.</div>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-zinc-400">Incluso</span>
                  </div>

                  <div className="p-4 md:p-5 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-emerald-400 font-bold text-base">✓</span>
                      <div>
                        <div className="font-bold text-white">CRM Kanban e Gestão de Estágios de Venda</div>
                        <div className="text-zinc-400 text-xs">Organize seus contatos por status até o fechamento.</div>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-zinc-400">Incluso</span>
                  </div>

                  <div className="p-4 md:p-5 flex items-center justify-between bg-[#161622]">
                    <div className="flex items-center space-x-3">
                      <span className="text-emerald-400 font-bold text-base">✓</span>
                      <div>
                        <div className="font-bold text-white">Garantia Incondicional de 30 Dias</div>
                        <div className="text-zinc-400 text-xs">Testou o sistema e não gostou? Devolvemos 100%.</div>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-emerald-400 uppercase">100% Garantido</span>
                  </div>
                </div>

                {/* Bottom Highlight Banner */}
                <div className="bg-[#09090d] border-t border-zinc-800 text-white p-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
                  <div>
                    <div className="text-zinc-500 text-xs line-through">Valor de Mercado: R$ 1.980/mês</div>
                    <div className="text-2xl font-black text-amber-400">Por apenas R$ 97/mês</div>
                  </div>
                  <button
                    onClick={() => handleOpenRegister('starter')}
                    className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-xs rounded-xl transition-all cursor-pointer uppercase tracking-wider shadow-lg shadow-amber-500/20"
                  >
                    QUERO ESSA OFERTA →
                  </button>
                </div>

              </div>

            </div>
          </section>

          {/* ========================================== */}
          {/* 5. SIMPLE STEPS: COMO FUNCIONA */}
          {/* ========================================== */}
          <section id="como-funciona" className="py-16 md:py-24 px-4 md:px-8 max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-3 max-w-3xl mx-auto">
              <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                SIMPLES ASSIM
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white font-sans tracking-tight">
                Como funciona
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Step 1 */}
              <div className="bg-[#121218] border border-zinc-800 rounded-2xl p-6 space-y-4 relative">
                <div className="w-10 h-10 rounded-xl bg-orange-500 text-black font-black font-mono text-lg flex items-center justify-center">
                  1
                </div>
                <h3 className="text-lg font-bold text-white font-sans">Escolha seu plano e nicho</h3>
                <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                  Selecione a cidade (Curitiba, SP, RJ...) e o nicho que deseja prospectar (pizzarias, clínicas, barbearias).
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-[#121218] border border-zinc-800 rounded-2xl p-6 space-y-4 relative">
                <div className="w-10 h-10 rounded-xl bg-orange-500 text-black font-black font-mono text-lg flex items-center justify-center">
                  2
                </div>
                <h3 className="text-lg font-bold text-white font-sans">Receba a mineração + prévia</h3>
                <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                  O sistema varre o Google Maps e os 7 agentes criam a prévia do site com copy persuasiva e botão para o WhatsApp.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-[#121218] border border-zinc-800 rounded-2xl p-6 space-y-4 relative">
                <div className="w-10 h-10 rounded-xl bg-orange-500 text-black font-black font-mono text-lg flex items-center justify-center">
                  3
                </div>
                <h3 className="text-lg font-bold text-white font-sans">Envie a abordagem e feche</h3>
                <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                  Mande a demonstração pronta via WhatsApp. O cliente se impressiona ao ver o próprio negócio no site e você fecha no PIX.
                </p>
              </div>

            </div>
          </section>

          {/* ========================================== */}
          {/* 6. PROVA SOCIAL & WHATSAPP SCREENSHOT CARDS */}
          {/* ========================================== */}
          <section id="provas" className="bg-[#0b0b10] py-16 md:py-24 px-4 md:px-8 border-t border-b border-zinc-800/80">
            <div className="max-w-6xl mx-auto space-y-12 text-center">
              
              <div className="space-y-3 max-w-3xl mx-auto">
                <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                  PROVA SOCIAL REAL
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white font-sans tracking-tight">
                  Veja nossos usuários que já têm acesso ao Optav.ia e <span className="text-amber-400">escalando vendas.</span>
                </h2>
                <p className="text-zinc-400 font-sans text-xs md:text-sm">
                  Exemplos de abordagens enviadas com prévias prontas e pagamentos recebidos no PIX:
                </p>
              </div>

              {/* 3 WhatsApp Proof Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left font-sans text-xs">
                
                {/* Proof 1 */}
                <div className="bg-[#12121a] border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center">
                        P
                      </div>
                      <div>
                        <div className="font-bold text-white">Pizzaria São José</div>
                        <div className="text-[10px] text-emerald-400">Curitiba, PR</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded text-[10px] font-mono font-bold">
                      PIX R$ 1.500
                    </span>
                  </div>

                  <div className="bg-[#0b141a] p-3 rounded-xl space-y-2 border border-zinc-800 text-[11px]">
                    <div className="bg-[#005c4b] text-white p-2 rounded-lg max-w-[90%] font-mono">
                      "Montei uma prévia gratuita para a Pizzaria São José: pizzaria-sao-jose.optav.ia"
                    </div>
                    <div className="bg-[#202c33] text-white p-2 rounded-lg max-w-[90%] font-mono">
                      "Cara, ficou muito bom! Quanto fica pra deixar esse site no ar com o nosso cardápio?"
                    </div>
                  </div>

                  <div className="text-[10px] text-zinc-400 font-mono flex items-center justify-between pt-1">
                    <span>Fechado em menos de 24h</span>
                    <span className="text-emerald-400 font-bold">✓ Venda Confirmada</span>
                  </div>
                </div>

                {/* Proof 2 */}
                <div className="bg-[#12121a] border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">
                        C
                      </div>
                      <div>
                        <div className="font-bold text-white">Clínica Odonto Sorriso</div>
                        <div className="text-[10px] text-cyan-400">São Paulo, SP</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded text-[10px] font-mono font-bold">
                      PIX R$ 2.500
                    </span>
                  </div>

                  <div className="bg-[#0b141a] p-3 rounded-xl space-y-2 border border-zinc-800 text-[11px]">
                    <div className="bg-[#005c4b] text-white p-2 rounded-lg max-w-[90%] font-mono">
                      "Doutor, montei a estrutura da clínica no celular: odonto-sorriso.optav.ia"
                    </div>
                    <div className="bg-[#202c33] text-white p-2 rounded-lg max-w-[90%] font-mono">
                      "Gostei demais do botão de agendamento online. Pode gerar a chave PIX da entrada."
                    </div>
                  </div>

                  <div className="text-[10px] text-zinc-400 font-mono flex items-center justify-between pt-1">
                    <span>Fechado na 1ª mensagem</span>
                    <span className="text-emerald-400 font-bold">✓ Venda Confirmada</span>
                  </div>
                </div>

                {/* Proof 3 */}
                <div className="bg-[#12121a] border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center">
                        B
                      </div>
                      <div>
                        <div className="font-bold text-white">Barbearia Vintage</div>
                        <div className="text-[10px] text-purple-400">Joinville, SC</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded text-[10px] font-mono font-bold">
                      PIX R$ 1.200
                    </span>
                  </div>

                  <div className="bg-[#0b141a] p-3 rounded-xl space-y-2 border border-zinc-800 text-[11px]">
                    <div className="bg-[#005c4b] text-white p-2 rounded-lg max-w-[90%] font-mono">
                      "Fala mestre! Fiz essa demonstração pra vocês: barbearia-vintage.optav.ia"
                    </div>
                    <div className="bg-[#202c33] text-white p-2 rounded-lg max-w-[90%] font-mono">
                      "Show de bola! O pessoal adorou a foto dos cortes. Me manda os dados pra pagar."
                    </div>
                  </div>

                  <div className="text-[10px] text-zinc-400 font-mono flex items-center justify-between pt-1">
                    <span>Fechado em 15 min</span>
                    <span className="text-emerald-400 font-bold">✓ Venda Confirmada</span>
                  </div>
                </div>

              </div>

            </div>
          </section>

          {/* ========================================== */}
          {/* 7. LIVE OPPORTUNITY SIMULATOR */}
          {/* ========================================== */}
          <section id="simulador" className="py-16 md:py-24 px-4 md:px-8 max-w-6xl mx-auto">
            <div className="bg-[#12121a] border border-zinc-800 rounded-3xl p-6 md:p-10 space-y-8 shadow-2xl">
              <div className="text-center space-y-3 max-w-3xl mx-auto">
                <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">SIMULADOR DE MERCADO</div>
                <h2 className="text-2xl md:text-4xl font-black text-white font-sans">
                  QUANTAS OPORTUNIDADES EXISTEM NA SUA CIDADE AGORA?
                </h2>
                <p className="text-zinc-400 font-sans text-xs md:text-sm">
                  Antes de vender site, você precisa saber quem abordar. A Optav.ia ajuda você a encontrar empresas locais com sinais de oportunidade e transforma esses dados em prévias de site e abordagens prontas.
                </p>
              </div>

              {/* Form Controls */}
              <form onSubmit={handleSimulate} className="grid grid-cols-1 md:grid-cols-3 gap-5 font-mono text-xs">
                <div className="space-y-2">
                  <label className="text-zinc-300 font-bold uppercase">Cidade</label>
                  <input
                    type="text"
                    value={simCity}
                    onChange={(e) => setSimCity(e.target.value)}
                    placeholder="Selecione ou digite sua cidade"
                    className="w-full p-3 bg-[#09090d] border border-zinc-700 rounded-xl text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-zinc-300 font-bold uppercase">Nicho</label>
                  <select
                    value={simNiche}
                    onChange={(e) => setSimNiche(e.target.value)}
                    className="w-full p-3 bg-[#09090d] border border-zinc-700 rounded-xl text-white outline-none focus:border-amber-400"
                  >
                    <option value="Pizzarias">Pizzarias e Restaurantes</option>
                    <option value="Clinicas">Clínicas e Consultórios</option>
                    <option value="Saloes">Salões e Barbearias</option>
                    <option value="Prestadores">Prestadores de Serviço</option>
                    <option value="Lojas">Lojas Físicas</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-zinc-300 font-bold uppercase">Ticket que pretende cobrar (R$)</label>
                  <select
                    value={simTicket}
                    onChange={(e) => setSimTicket(Number(e.target.value))}
                    className="w-full p-3 bg-[#09090d] border border-zinc-700 rounded-xl text-white outline-none focus:border-amber-400"
                  >
                    <option value={500}>R$ 500 (Básico)</option>
                    <option value={1500}>R$ 1.500 (Recomendado)</option>
                    <option value={3000}>R$ 3.000 (Premium)</option>
                  </select>
                </div>

                <div className="md:col-span-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSimulating}
                    className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-sm rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer uppercase tracking-wider font-mono"
                  >
                    {isSimulating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>ANALISANDO OPORTUNIDADES NA REGIÃO...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        <span>ANALISAR OPORTUNIDADES EM {simCity.toUpperCase()}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Dynamic Results Box */}
              <div className="bg-[#09090d] p-6 rounded-2xl border border-zinc-800 grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
                <div className="space-y-1">
                  <div className="text-zinc-500 uppercase">Leads Mapeados</div>
                  <div className="text-2xl font-black text-white">{simulatedLeads} empresas</div>
                  <div className="text-[11px] text-zinc-400">Em {simCity} para o nicho de {simNiche}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-zinc-500 uppercase">Oportunidades Sem Site</div>
                  <div className="text-2xl font-black text-emerald-400">{simulatedNoSite} prontas p/ abordar</div>
                  <div className="text-[11px] text-zinc-400">Taxa de conversão estimada de 20%</div>
                </div>

                <div className="space-y-1">
                  <div className="text-zinc-500 uppercase">Faturamento Potencial</div>
                  <div className="text-2xl font-black text-amber-400">
                    R$ {(simulatedNoSite * simTicket * 0.2).toLocaleString('pt-BR')}
                  </div>
                  <div className="text-[11px] text-zinc-400">Cobrando R$ {simTicket} por site</div>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================== */}
          {/* 8. PRICING CARDS (KPA LABS STYLED) */}
          {/* ========================================== */}
          <section id="planos" className="py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto space-y-12">
            <div className="text-center space-y-3 max-w-3xl mx-auto">
              <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                PLANOS E ASSINATURA
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white font-sans tracking-tight">
                Escolha seu plano <span className="text-amber-400">Optav.ia OS</span>
              </h2>
              <p className="text-zinc-400 font-sans text-xs md:text-sm">
                Ativação imediata após a compra. Cancele quando quiser.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-mono text-xs">
              
              {/* TRIAL */}
              <div className="bg-[#121218] p-6 rounded-2xl border border-zinc-800 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="text-zinc-400 font-bold uppercase text-xs">TRIAL TESTE</div>
                  <div className="text-3xl font-black text-white">Grátis</div>
                  <div className="text-zinc-400 text-[11px]">1 SITE PRA TESTAR</div>
                  <p className="text-zinc-500 text-[11px]">Veja o sistema funcionando antes de investir.</p>

                  <ul className="space-y-2 border-t border-zinc-800 pt-4 text-zinc-300">
                    <li>✓ 1 site gerado</li>
                    <li>✓ Prospecção básica</li>
                    <li>✓ 1 script de abordagem</li>
                    <li>✓ Fila com menor prioridade</li>
                    <li>✓ Suporte comunidade</li>
                  </ul>
                </div>

                <button
                  onClick={() => handleOpenRegister('trial')}
                  className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-colors cursor-pointer"
                >
                  TESTAR GRÁTIS
                </button>
              </div>

              {/* STARTER */}
              <div className="bg-[#121218] p-6 rounded-2xl border border-amber-500/40 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="text-amber-400 font-bold uppercase text-xs">STARTER</div>
                  <div className="text-3xl font-black text-white">R$97 <span className="text-xs font-normal text-zinc-400">/mês</span></div>
                  <div className="text-amber-300 text-[11px] font-bold">30 DIAS DE GARANTIA</div>
                  <p className="text-zinc-400 text-[11px]">Pra validar e começar a faturar. Cooldown de 60 min entre sites.</p>

                  <ul className="space-y-2 border-t border-zinc-800 pt-4 text-zinc-300">
                    <li>✓ Sites ilimitados (cooldown 60min)</li>
                    <li>✓ Prospecção automática completa</li>
                    <li>✓ Dashboard básico</li>
                    <li>✓ Hospedagem inclusa</li>
                    <li>✓ Prioridade na fila (nível 2)</li>
                    <li>✓ Suporte WhatsApp</li>
                  </ul>
                </div>

                <button
                  onClick={() => handleOpenRegister('starter')}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-xl transition-colors cursor-pointer"
                >
                  ASSINAR STARTER →
                </button>
              </div>

              {/* PRO (HIGHLIGHTED) */}
              <div className="bg-[#141420] p-6 rounded-2xl border-2 border-orange-500 flex flex-col justify-between space-y-6 relative shadow-[0_0_35px_rgba(245,158,11,0.2)]">
                <span className="absolute -top-3 right-4 px-3 py-0.5 bg-orange-500 text-black text-[9px] font-black rounded-full uppercase tracking-wider">
                  ★ MAIS POPULAR
                </span>

                <div className="space-y-4">
                  <div className="text-orange-400 font-bold uppercase text-xs">PRO AUTOPILOT 20x</div>
                  <div>
                    <span className="text-zinc-500 line-through text-xs">R$ 197/mês</span>
                    <div className="text-3xl font-black text-amber-400">R$350 <span className="text-xs font-normal text-zinc-400">/mês</span></div>
                  </div>
                  <div className="text-emerald-400 text-[11px] font-bold">ECONOMIA DE 77% vs AGÊNCIA</div>
                  <p className="text-zinc-300 text-[11px]">Pra quem quer escalar rápido. Cooldown de 30 min. Prioridade alta na fila.</p>

                  <ul className="space-y-2 border-t border-zinc-800 pt-4 text-zinc-200">
                    <li>✓ Sites ilimitados (cooldown 30min)</li>
                    <li>✓ Prospecção avançada com Maps API</li>
                    <li>✓ 7 Agentes de IA com retries automáticos</li>
                    <li>✓ Dashboard completo + analytics</li>
                    <li>✓ Prioridade alta na fila (nível 5)</li>
                    <li>✓ Suporte prioritário no WhatsApp</li>
                  </ul>
                </div>

                <button
                  onClick={() => handleOpenRegister('pro')}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black rounded-xl transition-all shadow-md cursor-pointer uppercase tracking-wider"
                >
                  QUERO O PRO 20x →
                </button>
              </div>

              {/* AGENCY */}
              <div className="bg-[#121218] p-6 rounded-2xl border border-purple-500/40 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="text-purple-400 font-bold uppercase text-xs">AGENCY / VIP</div>
                  <div className="text-3xl font-black text-white">R$497 <span className="text-xs font-normal text-zinc-400">/mês</span></div>
                  <div className="text-purple-300 text-[11px] font-bold">SEM COOLDOWN</div>
                  <p className="text-zinc-400 text-[11px]">Para operações e agências que precisam vender em volume sem esperar fila.</p>

                  <ul className="space-y-2 border-t border-zinc-800 pt-4 text-zinc-300">
                    <li>✓ Sites ilimitados (sem cooldown)</li>
                    <li>✓ Infraestrutura com capacidade ampliada</li>
                    <li>✓ Painel administrativo master</li>
                    <li>✓ Subcontas para equipe/revenda</li>
                    <li>✓ Agentes com identidade personalizada</li>
                    <li>✓ Prioridade máxima na fila</li>
                  </ul>
                </div>

                <button
                  onClick={() => handleOpenRegister('agency')}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-xl transition-colors cursor-pointer"
                >
                  ASSINAR AGENCY →
                </button>
              </div>

            </div>
          </section>

          {/* ========================================== */}
          {/* 9. FAQ ACCORDION (DARK LUXURY STYLE) */}
          {/* ========================================== */}
          <section id="faq" className="bg-[#09090d] text-white py-16 md:py-24 px-4 md:px-8 border-t border-b border-zinc-800/80">
            <div className="max-w-4xl mx-auto space-y-10 text-center">
              
              <div className="space-y-3">
                <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                  DÚVIDAS FREQUENTES
                </div>
                <h2 className="text-3xl md:text-5xl font-black font-sans tracking-tight">
                  Perguntas <span className="text-amber-400">Frequentes</span>
                </h2>
              </div>

              {/* Accordion Stack */}
              <div className="space-y-3 font-sans text-xs md:text-sm text-left">
                {faqItems.map((item, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="bg-[#121218] border border-zinc-800 rounded-xl overflow-hidden transition-all shadow-md"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full p-4.5 text-left font-bold text-white flex items-center justify-between cursor-pointer hover:text-amber-400 transition-colors"
                      >
                        <span className="text-sm md:text-base">{item.q}</span>
                        <ChevronDown className={`w-5 h-5 transition-transform shrink-0 ${isOpen ? 'rotate-180 text-amber-400' : 'text-zinc-500'}`} />
                      </button>
                      {isOpen && (
                        <div className="px-4.5 pb-4 pt-1 text-zinc-300 border-t border-zinc-800/80 text-xs md:text-sm leading-relaxed">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Bottom Big CTA Button */}
              <div className="pt-4 space-y-4">
                <button
                  onClick={() => handleOpenRegister('starter')}
                  className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-sm rounded-xl transition-all shadow-xl shadow-amber-500/20 cursor-pointer uppercase tracking-wider font-mono"
                >
                  QUERO MEU ACESSO AO OPTAV.IA OS →
                </button>

                <div className="pt-2">
                  <a
                    href="https://wa.me/5541985134105"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-xs font-mono text-zinc-300 hover:text-emerald-400 bg-[#121218] border border-zinc-800 px-5 py-2.5 rounded-xl shadow-sm transition-colors"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    <span>CANAL NO WHATSAPP: Tire suas dúvidas com a gente →</span>
                  </a>
                </div>
              </div>

            </div>
          </section>

          {/* ========================================== */}
          {/* 10. LEAD FORM / BETA REGISTER */}
          {/* ========================================== */}
          <section className="py-16 md:py-24 px-4 md:px-8 max-w-4xl mx-auto">
            <div className="bg-[#121218] border-2 border-amber-500/40 rounded-3xl p-6 md:p-10 space-y-6 shadow-2xl font-mono text-xs">
              <div className="text-center space-y-2">
                <span className="px-3 py-1 bg-amber-950 border border-amber-700/60 text-amber-400 font-bold rounded-full uppercase text-[10px]">
                  VAGAS DO BETA ABERTAS
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-white font-sans">
                  PARE DE PROSPECTAR NO ESCURO
                </h2>
                <p className="text-zinc-400 text-xs font-sans max-w-xl mx-auto">
                  Simule sua região, encontre oportunidades locais e use a Optav.ia para gerar lead, prévia de site e abordagem pronta.
                </p>
              </div>

              {leadFormSuccess ? (
                <div className="p-6 bg-emerald-950/60 border border-emerald-500/50 rounded-2xl text-center space-y-2">
                  <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
                  <div className="text-base font-bold text-white">Simulação iniciada com sucesso!</div>
                  <p className="text-zinc-300 text-xs font-sans">Redirecionando você para a criação da sua conta no beta...</p>
                </div>
              ) : (
                <form onSubmit={handleLeadFormSubmit} className="space-y-4 max-w-xl mx-auto">
                  <div className="space-y-1">
                    <label className="text-zinc-300 font-bold uppercase">Seu nome</label>
                    <input
                      type="text"
                      required
                      value={leadFormName}
                      onChange={(e) => setLeadFormName(e.target.value)}
                      placeholder="Ex: João Silva"
                      className="w-full p-3 bg-[#09090d] border border-zinc-700 rounded-xl text-white outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-zinc-300 font-bold uppercase">E-mail</label>
                      <input
                        type="email"
                        required
                        value={leadFormEmail}
                        onChange={(e) => setLeadFormEmail(e.target.value)}
                        placeholder="seu@email.com"
                        className="w-full p-3 bg-[#09090d] border border-zinc-700 rounded-xl text-white outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-zinc-300 font-bold uppercase">WhatsApp</label>
                      <input
                        type="text"
                        value={leadFormPhone}
                        onChange={(e) => setLeadFormPhone(e.target.value)}
                        placeholder="(11) 99999-9999"
                        className="w-full p-3 bg-[#09090d] border border-zinc-700 rounded-xl text-white outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-sm rounded-xl transition-all cursor-pointer shadow-lg mt-2 uppercase tracking-wider"
                  >
                    QUERO SIMULAR MINHA REGIÃO →
                  </button>

                  <p className="text-[10px] text-zinc-500 text-center font-sans">
                    Você recebe acesso ao beta, grupo WhatsApp e instruções para começar.
                  </p>
                </form>
              )}
            </div>
          </section>
        </main>
      )}

      {/* FOOTER */}
      <footer className="relative z-10 bg-[#060609] border-t border-zinc-800 py-12 px-4 md:px-8 font-mono text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded bg-amber-500 text-black font-black flex items-center justify-center font-mono">
                O
              </div>
              <span className="font-bold text-white text-base">Optav.ia</span>
            </div>
            <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
              Plataforma de prospecção com prévia de site pronta. Encontre leads, gere demonstração e aborde mostrando algo concreto.
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-white font-bold uppercase text-[11px] text-zinc-300">PRODUTO</div>
            <ul className="space-y-1.5 text-[11px]">
              <li><a href="#como-funciona" onClick={() => setPageView('landing')} className="hover:text-amber-400">Como funciona</a></li>
              <li><a href="#simulador" onClick={() => setPageView('landing')} className="hover:text-amber-400">Simulador</a></li>
              <li><a href="#provas" onClick={() => setPageView('landing')} className="hover:text-amber-400">Prova Social</a></li>
              <li><a href="#planos" onClick={() => setPageView('landing')} className="hover:text-amber-400">Planos</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="text-white font-bold uppercase text-[11px] text-zinc-300">SUPORTE & DOCUMENTAÇÃO</div>
            <ul className="space-y-1.5 text-[11px]">
              <li><a href="#faq" onClick={() => setPageView('landing')} className="hover:text-amber-400">FAQ</a></li>
              <li><a href="https://wa.me/5541985134105" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400">Grupo WhatsApp</a></li>
              <li><button onClick={() => setPageView('docs')} className="hover:text-amber-400">Documentação</button></li>
              <li><button onClick={() => setPageView('blog')} className="hover:text-amber-400">Blog</button></li>
              <li className="text-zinc-500">suporte@optav.ia</li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="text-white font-bold uppercase text-[11px] text-zinc-300">LEGAL & REGULATÓRIO</div>
            <ul className="space-y-1.5 text-[11px]">
              <li><button onClick={() => setPageView('landing')} className="hover:text-amber-400">Termos de uso</button></li>
              <li><button onClick={() => setPageView('landing')} className="hover:text-amber-400">Política de privacidade</button></li>
              <li><button onClick={() => setPageView('landing')} className="hover:text-amber-400">LGPD</button></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-zinc-900 space-y-4 text-[10px] text-zinc-500 font-sans">
          <p>
            A Optav.ia não garante vendas, faturamento ou resultados específicos. A plataforma fornece ferramentas para prospecção, criação de prévias e abordagem. Resultados dependem da execução, oferta, nicho e follow-up de cada usuário.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-zinc-400">
            <div>© 2026 Optav.ia OS · Todos os direitos reservados</div>
            <div>CNPJ 21.199.022/0001-00</div>
          </div>
        </div>
      </footer>

      {/* AUTH MODAL (LOGIN / REGISTER) */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#121218] border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-2xl font-mono text-xs">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-amber-500 text-black font-black text-xl flex items-center justify-center mx-auto">
                O
              </div>
              <h3 className="text-xl font-black text-white font-sans">
                {authMode === 'login' ? 'Entrar na Optav.ia OS' : 'Criar Conta no Beta'}
              </h3>
              <p className="text-zinc-400 text-[11px]">
                {authMode === 'login'
                  ? 'Informe seus dados de acesso'
                  : `Seu plano escolhido: ${selectedPlan.toUpperCase()}`}
              </p>
            </div>

            {authError && (
              <div className="p-3 mb-4 bg-rose-950/60 border border-rose-500/50 rounded-xl text-rose-300 text-center text-[11px]">
                {authError}
              </div>
            )}

            {authMode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-zinc-300 uppercase">E-mail</label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full p-3 bg-[#09090d] border border-zinc-700 rounded-xl text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-300 uppercase">Senha</label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full p-3 bg-[#09090d] border border-zinc-700 rounded-xl text-white outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs rounded-xl transition-all cursor-pointer shadow-md"
                >
                  {authLoading ? 'ENTRANDO...' : 'ENTRAR NO PAINEL →'}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setAuthMode('register')}
                    className="text-zinc-400 hover:text-amber-400 text-[11px]"
                  >
                    Não tem conta? <span className="underline font-bold">Criar conta grátis</span>
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-zinc-300 uppercase">Seu Nome</label>
                  <input
                    type="text"
                    required
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    placeholder="João Silva"
                    className="w-full p-3 bg-[#09090d] border border-zinc-700 rounded-xl text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-300 uppercase">E-mail</label>
                  <input
                    type="email"
                    required
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full p-3 bg-[#09090d] border border-zinc-700 rounded-xl text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-300 uppercase">Nome da sua Agência / Projeto</label>
                  <input
                    type="text"
                    required
                    value={registerAgency}
                    onChange={(e) => setRegisterAgency(e.target.value)}
                    placeholder="Minha Agência Digital"
                    className="w-full p-3 bg-[#09090d] border border-zinc-700 rounded-xl text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-300 uppercase">Criar Senha</label>
                  <input
                    type="password"
                    required
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className="w-full p-3 bg-[#09090d] border border-zinc-700 rounded-xl text-white outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs rounded-xl transition-all cursor-pointer shadow-md mt-2"
                >
                  {authLoading ? 'CRIANDO SUA CONTA...' : 'FINALIZAR REGISTRO E ACESSAR →'}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className="text-zinc-400 hover:text-amber-400 text-[11px]"
                  >
                    Já tem uma conta? <span className="underline font-bold">Fazer login</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
