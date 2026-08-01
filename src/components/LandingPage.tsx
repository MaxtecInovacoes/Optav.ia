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
  X
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
  const [selectedPlan, setSelectedPlan] = useState<string>('pro');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  const handleOpenRegister = (planId: string = 'pro') => {
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

  return (
    <div className="min-h-screen bg-[#05070D] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Banner / Hero Navigation */}
      <header className="border-b border-slate-800/80 bg-[#0A0C14]/90 backdrop-blur-md sticky top-0 z-40 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-cyan-400 flex items-center justify-center rounded rotate-45 shadow-[0_0_12px_rgba(6,182,212,0.5)]">
              <div className="w-3.5 h-3.5 bg-black rounded-full"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-white font-mono">
                OPTAV<span className="text-cyan-400">.IA</span>
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                Esteira IA de Vendas
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-cyan-400 transition-colors">Recursos</a>
            <a href="#how-it-works" className="hover:text-cyan-400 transition-colors">Como Funciona</a>
            <a href="#plans" className="hover:text-cyan-400 transition-colors">Planos & Preços</a>
            <a href="#vps" className="hover:text-cyan-400 transition-colors">Deploy VPS</a>
          </nav>

          <div className="flex items-center space-x-3">
            {isLoggedIn ? (
              <button
                onClick={onNavigateToDashboard}
                className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold px-4 py-2 rounded-lg text-sm shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer font-mono"
              >
                <span>Acessar Painel</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={handleOpenLogin}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all cursor-pointer font-mono"
                >
                  Entrar
                </button>
                <button
                  onClick={() => handleOpenRegister('pro')}
                  className="bg-cyan-400 hover:bg-cyan-300 text-black font-bold px-4 py-2 rounded-lg text-sm shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer font-mono"
                >
                  Criar Conta
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-4 md:px-8 overflow-hidden">
        {/* Ambient Glow background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[250px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/30 px-3.5 py-1.5 rounded-full text-cyan-300 text-xs font-mono font-medium">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sistema Autônomo de Vendas B2B com IA e WhatsApp</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Prospecção no Google Maps, <br />
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
              Criação de Sites & SDR no WhatsApp
            </span>
          </h1>

          <p className="text-slate-300 text-base md:text-xl max-w-3xl mx-auto leading-relaxed">
            Substitua equipes inteiras de prospecção. A <strong className="text-white">OPTAV.IA</strong> varre empresas locais sem site, gera uma landing page profissional instantânea e envia um SDR autônomo para fechar a venda no WhatsApp.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => handleOpenRegister('pro')}
              className="w-full sm:w-auto px-8 py-4 bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-base rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center space-x-2 cursor-pointer font-mono"
            >
              <Zap className="w-5 h-5 fill-black" />
              <span>TESTAR AGORA GRATUITAMENTE</span>
            </button>
            <a
              href="#plans"
              className="w-full sm:w-auto px-8 py-4 bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold text-base rounded-xl border border-slate-700 transition-all flex items-center justify-center space-x-2 font-mono"
            >
              <span>VER PLANOS & PREÇOS</span>
            </a>
          </div>

          {/* Key metrics highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 border-t border-slate-800/80">
            <div className="p-4 bg-[#0A0C14] border border-slate-800/80 rounded-xl">
              <div className="text-2xl md:text-3xl font-black text-cyan-400 font-mono">+10.000</div>
              <div className="text-xs text-slate-400 mt-1">Leads Raspados no GMB</div>
            </div>
            <div className="p-4 bg-[#0A0C14] border border-slate-800/80 rounded-xl">
              <div className="text-2xl md:text-3xl font-black text-emerald-400 font-mono">15 seg</div>
              <div className="text-xs text-slate-400 mt-1">Tempo Médio do Site</div>
            </div>
            <div className="p-4 bg-[#0A0C14] border border-slate-800/80 rounded-xl">
              <div className="text-2xl md:text-3xl font-black text-purple-400 font-mono">24/7</div>
              <div className="text-xs text-slate-400 mt-1">Atendimento SDR Humanizado</div>
            </div>
            <div className="p-4 bg-[#0A0C14] border border-slate-800/80 rounded-xl">
              <div className="text-2xl md:text-3xl font-black text-amber-400 font-mono">100%</div>
              <div className="text-xs text-slate-400 mt-1">Self-Hosted na sua VPS</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 md:px-8 bg-[#080A10] border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">Recursos do Sistema</h2>
            <p className="text-3xl font-extrabold text-white">Como a Esteira Autônoma Funciona</p>
            <p className="text-slate-400 text-sm">Todas as ferramentas integradas em um só lugar para maximizar suas conversões.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0D101D] border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-cyan-500/40 transition-all">
              <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/30 rounded-xl flex items-center justify-center text-cyan-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">1. Scraper Google Maps em Tempo Real</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Busca milhares de empresas por cidade e nicho (Ex: Restaurantes, Odonto, Estética), identificando quem não possui site ou possui site desatualizado.
              </p>
            </div>

            <div className="bg-[#0D101D] border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-emerald-500/40 transition-all">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-center text-emerald-400">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">2. Gerador Instantâneo de Sites (PWA)</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                A IA analisa as avaliações do Google do cliente e cria um site profissional em segundos para usar como demonstração irresistível na abordagem.
              </p>
            </div>

            <div className="bg-[#0D101D] border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-purple-500/40 transition-all">
              <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/30 rounded-xl flex items-center justify-center text-purple-400">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">3. Agente SDR no WhatsApp (Meowhats)</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Envia a proposta com a prévia do site no WhatsApp, responde dúvidas de forma humanizada, negocia valores e conduz o lead para o pagamento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="plans" className="py-20 px-4 md:px-8 border-t border-slate-800/80 relative">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">Planos & Preços</h2>
            <p className="text-3xl font-extrabold text-white">Escolha o Plano Ideal para Sua Operação</p>
            <p className="text-slate-400 text-sm">Sem contratos de fidelidade. Cancele quando quiser ou rode em sua própria VPS.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Starter Plan */}
            <div className="bg-[#0A0C14] border border-slate-800 rounded-2xl p-8 flex flex-col justify-between space-y-6 hover:border-slate-700 transition-all">
              <div className="space-y-4">
                <span className="text-xs font-mono font-bold px-2.5 py-1 bg-slate-800 text-slate-300 rounded uppercase">Iniciante</span>
                <h3 className="text-2xl font-bold text-white">Starter</h3>
                <p className="text-slate-400 text-xs">Ideal para quem está começando na prospecção B2B.</p>
                <div className="pt-2">
                  <span className="text-4xl font-extrabold text-white font-mono">R$ 197</span>
                  <span className="text-slate-400 text-xs"> / mês</span>
                </div>
                <ul className="space-y-3 pt-4 border-t border-slate-800/80 text-xs text-slate-300">
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Até 200 leads raspados/mês</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Gerador de Sites IA Instantâneo</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>1 Número de WhatsApp Conectado</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Agente SDR Padrão</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => handleOpenRegister('starter')}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-xl transition-all cursor-pointer font-mono"
              >
                ASSINAR STARTER
              </button>
            </div>

            {/* Pro Plan (Featured) */}
            <div className="bg-[#0D101D] border-2 border-cyan-500/80 rounded-2xl p-8 flex flex-col justify-between space-y-6 shadow-[0_0_30px_rgba(6,182,212,0.15)] relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-cyan-400 text-black text-[10px] font-black uppercase font-mono px-3 py-1 rounded-full shadow">
                MAIS POPULAR & RECOMENDADO
              </div>
              <div className="space-y-4">
                <span className="text-xs font-mono font-bold px-2.5 py-1 bg-cyan-500/20 text-cyan-300 rounded uppercase">Pro Agência</span>
                <h3 className="text-2xl font-bold text-white">Agência Pro</h3>
                <p className="text-slate-400 text-xs">Para agências que buscam escala máxima de clientes.</p>
                <div className="pt-2">
                  <span className="text-4xl font-extrabold text-cyan-400 font-mono">R$ 497</span>
                  <span className="text-slate-400 text-xs"> / mês</span>
                </div>
                <ul className="space-y-3 pt-4 border-t border-slate-800/80 text-xs text-slate-300">
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                    <strong className="text-white">Leads e Scraper ILIMITADOS</strong>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Criação de Sites PWA ILIMITADOS</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Até 5 Números de WhatsApp (Meowhats)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Agentes SDR Personalizáveis (Personalidade/Tom)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Funil Kanban & Aprendizado de IA</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => handleOpenRegister('pro')}
                className="w-full py-3 bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-sm rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer font-mono"
              >
                ASSINAR PRO AGÊNCIA
              </button>
            </div>

            {/* Enterprise / VPS White-Label */}
            <div className="bg-[#0A0C14] border border-slate-800 rounded-2xl p-8 flex flex-col justify-between space-y-6 hover:border-slate-700 transition-all">
              <div className="space-y-4">
                <span className="text-xs font-mono font-bold px-2.5 py-1 bg-purple-500/20 text-purple-300 rounded uppercase">Enterprise / VPS</span>
                <h3 className="text-2xl font-bold text-white">White-Label VPS</h3>
                <p className="text-slate-400 text-xs">Instalação total na sua VPS própria com código-fonte.</p>
                <div className="pt-2">
                  <span className="text-4xl font-extrabold text-white font-mono">R$ 997</span>
                  <span className="text-slate-400 text-xs"> / licença vitalícia</span>
                </div>
                <ul className="space-y-3 pt-4 border-t border-slate-800/80 text-xs text-slate-300">
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <strong className="text-white">Código-fonte completo (Git)</strong>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Instalação em 1 clique na sua VPS (Docker/Script)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Banco de dados PostgreSQL Privado</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Chaves de API (Gemini/DeployHub) isoladas</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => handleOpenRegister('enterprise')}
                className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm rounded-xl transition-all cursor-pointer font-mono"
              >
                COMPRAR WHITE-LABEL
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* VPS Section */}
      <section id="vps" className="py-16 px-4 md:px-8 bg-[#080A10] border-t border-slate-800/80">
        <div className="max-w-5xl mx-auto bg-[#0A0C14] border border-cyan-500/30 rounded-2xl p-8 space-y-6">
          <div className="flex items-center space-x-3">
            <Server className="w-6 h-6 text-cyan-400" />
            <h3 className="text-xl font-bold text-white">Instalação Self-Hosted na VPS (DeployFlow / Docker)</h3>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            Deseja privacidade total? O sistema foi projetado para rodar em qualquer VPS Linux ou Windows Server com banco de dados PostgreSQL. Sua chave de API de LLM permanece 100% isolada e segura fora do navegador.
          </p>
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-cyan-300">
            <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded">✅ DeployFlow CI/CD</span>
            <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded">✅ PostgreSQL 16</span>
            <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded">✅ Docker Compose</span>
            <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded">✅ Meowhats REST API</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 px-4 text-center text-xs text-slate-500 font-mono">
        <p>© 2026 OPTAV.IA — Esteira Autônoma de Vendas B2B com IA & WhatsApp.</p>
      </footer>

      {/* Auth Modal (Login / Register) */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0A0C14] border border-slate-800 w-full max-w-md rounded-2xl p-6 space-y-6 relative shadow-2xl">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header Tabs */}
            <div className="flex items-center border-b border-slate-800 pb-3">
              <button
                onClick={() => { setAuthMode('login'); setAuthError(''); setAuthSuccess(''); }}
                className={`flex-1 py-2 text-center text-sm font-bold font-mono transition-colors border-b-2 ${
                  authMode === 'login'
                    ? 'border-cyan-400 text-cyan-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                ENTRAR
              </button>
              <button
                onClick={() => { setAuthMode('register'); setAuthError(''); setAuthSuccess(''); }}
                className={`flex-1 py-2 text-center text-sm font-bold font-mono transition-colors border-b-2 ${
                  authMode === 'register'
                    ? 'border-cyan-400 text-cyan-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                CRIAR CONTA
              </button>
            </div>

            {authError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-300 text-xs font-mono">
                {authError}
              </div>
            )}

            {authSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-300 text-xs font-mono">
                {authSuccess}
              </div>
            )}

            <form onSubmit={handleSubmitAuth} className="space-y-4">
              {authMode === 'register' && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400">Nome Completo</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="Ex: João Silva"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[#05070D] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400">Nome da Agência / Empresa</label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="Ex: Agência Digital Elite"
                        value={agencyName}
                        onChange={(e) => setAgencyName(e.target.value)}
                        className="w-full bg-[#05070D] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">E-mail</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#05070D] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">Senha</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#05070D] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>

              {authMode === 'register' && (
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400">Plano Selecionado</label>
                  <select
                    value={selectedPlan}
                    onChange={(e) => setSelectedPlan(e.target.value)}
                    className="w-full bg-[#05070D] border border-slate-800 rounded-lg px-3 py-2 text-sm text-cyan-300 focus:outline-none focus:border-cyan-400 font-mono"
                  >
                    <option value="starter">Starter - R$ 197/mês</option>
                    <option value="pro">Pro Agência - R$ 497/mês</option>
                    <option value="enterprise">White-Label VPS - R$ 997</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-sm rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer font-mono mt-2"
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
