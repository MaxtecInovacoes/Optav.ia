import React, { useState, useEffect } from 'react';
import { Tenant, Lead, LearningPattern, SiteData, FunnelStatus } from './types/index.js';
import { Navbar } from './components/Navbar.js';
import { LandingPage } from './components/LandingPage.js';
import { DashboardKpis } from './components/DashboardKpis.js';
import { KanbanBoard } from './components/KanbanBoard.js';
import { LeadTable } from './components/LeadTable.js';
import { LearningsPanel } from './components/LearningsPanel.js';
import { SiteEditorModal } from './components/SiteEditorModal.js';
import { ChatSimulator } from './components/ChatSimulator.js';
import { ScraperModal } from './components/ScraperModal.js';
import { OnboardingModal } from './components/OnboardingModal.js';
import { SuperAdminModal } from './components/SuperAdminModal.js';
import { PipelinePlaybookModal } from './components/PipelinePlaybookModal.js';
import { PixelOfficeCanvas } from './components/PixelOfficeCanvas.js';
import {
  Zap,
  LayoutGrid,
  Table,
  Brain,
  Sparkles,
  Shield,
  Search,
  UserCheck,
  Globe,
  Play,
  Pause,
  RotateCcw,
  Activity,
  History,
  User,
  Plus,
  Phone,
  CheckCircle,
  AlertTriangle,
  FileText,
  Clock,
  TrendingUp,
  BarChart2,
  ExternalLink,
  MessageSquare,
  Lock,
  Server,
  Key,
  Terminal,
  ChevronRight,
  QrCode,
  Wifi,
  WifiOff,
  RefreshCw,
  Send,
  XCircle,
  Bot
} from 'lucide-react';

export function App() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [currentTenantId, setCurrentTenantId] = useState<string>('tenant-1');
  const [appMode, setAppMode] = useState<'landing' | 'app'>('app');
  const [currentUser, setCurrentUser] = useState<any>(null);

  const handleClearMockData = async () => {
    if (!window.confirm('Tem certeza que deseja zerar a base de dados de teste? Todos os leads fictícios serão removidos para uso 100% real na VPS.')) return;
    try {
      const res = await fetch('/api/db/clear-mock-data', { method: 'POST' });
      const data = await res.json();
      showToast(data.message || 'Base de dados zerada com sucesso!');
      loadData();
    } catch (err) {
      showToast('Erro ao zerar dados da base.');
    }
  };
  const [leads, setLeads] = useState<Lead[]>([]);
  const [kpis, setKpis] = useState<any>({
    totalLeads: 0,
    sitesDeployed: 0,
    messagedCount: 0,
    hotLeads: 0,
    conversionRate: 0,
    totalSales: 0,
    learningsCount: 0,
    averageSiteHealth: 0
  });
  const [learnings, setLearnings] = useState<LearningPattern[]>([]);
  const [activeView, setActiveView] = useState<'motor' | 'overview' | 'crm' | 'uti' | 'ciclos' | 'sites' | 'learnings' | 'perfil'>('motor');

  // Pipeline Execution State
  const [pipelineState, setPipelineStatus] = useState<'idle' | 'running' | 'paused'>('idle');
  const [cycleNicho, setCycleNicho] = useState<string>('Clínica Odontológica');
  const [cycleCidade, setCycleCidade] = useState<string>('Curitiba, PR');
  const [cycleQuantity, setCycleQuantity] = useState<number>(5);
  const [cycleScoreMin, setCycleScoreMin] = useState<number>(70);

  // Esteira Uptime Timer & Generation Stage Tracking
  const [esteiraUptimeSeconds, setEsteiraUptimeSeconds] = useState<number>(0);
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0); // 0 = idle, 1..5
  const [currentLeadProcessing, setCurrentLeadProcessing] = useState<string>('');

  useEffect(() => {
    let timer: any = null;
    if (pipelineState === 'running') {
      timer = setInterval(() => {
        setEsteiraUptimeSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [pipelineState]);

  const formatUptime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Terminal / SSE Logs Stream
  const [terminalLogs, setTerminalLogs] = useState<Array<{ id: string; time: string; agent: string; text: string; type: 'info' | 'success' | 'warn' | 'error' }>>([
    { id: '1', time: '18:30:12', agent: 'SYS_CORE', text: 'Optav.ia OS v4.2 Cluster Ativo — US-East Server Node 01', type: 'info' },
    { id: '2', time: '18:30:15', agent: 'ScraperAgent', text: 'Buscando nichos em Curitiba PR no Google Maps...', type: 'info' },
    { id: '3', time: '18:30:20', agent: 'PersonaAgent', text: 'Persona do público-alvo odontológico calibra tom no tom empático', type: 'success' },
  ]);

  // Modals
  const [activeModal, setActiveModal] = useState<'siteEditor' | 'chat' | 'scraper' | 'onboarding' | 'superadmin' | 'playbook' | 'leadManual' | null>(null);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [loadingLeadId, setLoadingLeadId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Manual Lead Form State
  const [manualName, setManualName] = useState('');
  const [manualCategory, setManualCategory] = useState('');
  const [manualCity, setManualCity] = useState('');
  const [manualPhone, setManualPhone] = useState('');

  // WhatsApp QR Code Instance State
  const [qrStatus, setQrStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connected');
  const [qrSessionToken, setQrSessionToken] = useState<string>('meow_optavia_live_8842');
  const [qrPhoneNumber, setQrPhoneNumber] = useState<string>('+55 (41) 98513-4105');
  const [qrRefreshing, setQrRefreshing] = useState<boolean>(false);

  // SDR Live Conversation Stream State in Perfil View
  const [sdrActiveLeadId, setSdrActiveLeadId] = useState<string | null>(null);
  const [sdrLiveMessages, setSdrLiveMessages] = useState<any[]>([]);
  const [sdrLiveInput, setSdrLiveInput] = useState<string>('');
  const [sdrLiveHumanMode, setSdrLiveHumanMode] = useState<boolean>(false);
  const [sdrSending, setSdrSending] = useState<boolean>(false);

  const fetchSdrLiveMessages = (leadId: string) => {
    fetch(`/api/conversations/${leadId}`)
      .then((res) => res.json())
      .then((data) => setSdrLiveMessages(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (sdrActiveLeadId) {
      fetchSdrLiveMessages(sdrActiveLeadId);
    } else if (leads.length > 0) {
      setSdrActiveLeadId(leads[0].id);
    }
  }, [sdrActiveLeadId, leads]);

  const handleSendSdrLiveMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sdrActiveLeadId || !sdrLiveInput.trim()) return;

    setSdrSending(true);
    const textToSend = sdrLiveInput;
    setSdrLiveInput('');

    try {
      await fetch(`/api/conversations/${sdrActiveLeadId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToSend,
          isHuman: sdrLiveHumanMode
        })
      });
      fetchSdrLiveMessages(sdrActiveLeadId);
      setSdrSending(false);
      showToast('✅ Mensagem enviada via WhatsApp!');
    } catch (err) {
      console.error(err);
      setSdrSending(false);
      showToast('❌ Erro ao enviar mensagem no WhatsApp.');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadData = () => {
    fetch('/api/tenants')
      .then((res) => res.json())
      .then((data) => setTenants(data))
      .catch((err) => console.error(err));

    fetch(`/api/leads?tenantId=${currentTenantId}`)
      .then((res) => res.json())
      .then((data) => setLeads(data))
      .catch((err) => console.error(err));

    fetch('/api/kpis')
      .then((res) => res.json())
      .then((data) => setKpis(data))
      .catch((err) => console.error(err));

    fetch('/api/learnings')
      .then((res) => res.json())
      .then((data) => setLearnings(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadData();
  }, [currentTenantId]);

  const handleStartPipelineCycle = async () => {
    setPipelineStatus('running');
    setCurrentStageIndex(1); // 1/5 Scraping
    setCurrentLeadProcessing(`Prospecção: ${cycleNicho} em ${cycleCidade}`);

    const pushLog = (agent: string, text: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') => {
      setTerminalLogs((prev) => [
        {
          id: Date.now().toString() + Math.random(),
          time: new Date().toLocaleTimeString('pt-BR'),
          agent,
          text,
          type
        },
        ...prev
      ]);
    };

    pushLog('ScraperAgent', `[ETAPA 1/5] Scraping ativo com Gemini AI: Buscando "${cycleNicho}" em ${cycleCidade}...`, 'info');

    // Simulate stage progress timers for visual feedback
    const timer2 = setTimeout(() => {
      setCurrentStageIndex(2);
      pushLog('PersonaAgent', `[ETAPA 2/5] Caio Agent analisando reputação, reviews e perfil da empresa...`, 'info');
    }, 2000);

    const timer3 = setTimeout(() => {
      setCurrentStageIndex(3);
      pushLog('SiteBuilderAgent', `[ETAPA 3/5] Liam Agent gerando site cinematográfico (Tailwind CSS, GSAP, Astro UI)...`, 'info');
    }, 4500);

    const timer4 = setTimeout(() => {
      setCurrentStageIndex(4);
      pushLog('DeployAgent', `[ETAPA 4/5] Publicando site no Edge Cloudflare CDN com domínio seguro SSL...`, 'info');
    }, 7000);

    const timer5 = setTimeout(() => {
      setCurrentStageIndex(5);
      pushLog('OutreachAgent', `[ETAPA 5/5] Bryan Agent preparando abordagem SDR personalizada para WhatsApp...`, 'info');
    }, 9000);

    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId: currentTenantId,
          keyword: cycleNicho,
          city: cycleCidade,
          maxResults: cycleQuantity,
          autoBuild: true
        })
      });
      const data = await res.json();
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);

      if (data.success) {
        setCurrentStageIndex(5);
        setPipelineStatus('idle');
        setCurrentLeadProcessing(`Finalizado: ${data.count} sites gerados com sucesso em ${cycleCidade}!`);
        pushLog(
          'SiteBuilderAgent',
          `✅ [ESTEIRA CONCLUÍDA] ${data.count} empresas encontradas e sites publicados com sucesso!`,
          'success'
        );
        showToast(`✅ ${data.count} novos sites gerados para "${cycleNicho}" em ${cycleCidade}!`);
        loadData();
      } else {
        setPipelineStatus('idle');
        setCurrentStageIndex(0);
        showToast(`Erro ao realizar scraping: ${data.error}`);
      }
    } catch (e: any) {
      console.error(e);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      setPipelineStatus('idle');
      setCurrentStageIndex(0);
      showToast('Erro de conexão ao rodar o pipeline.');
    }
  };

  const handlePausePipeline = () => {
    setPipelineStatus('paused');
    showToast('⏸ Pipeline pausado.');
  };

  const handleResumePipeline = () => {
    setPipelineStatus('running');
    showToast('▶ Pipeline retomado.');
  };

  const handleRunPipelineForSingleLead = async (leadId: string) => {
    setLoadingLeadId(leadId);
    setPipelineStatus('running');
    const targetLead = leads.find((l) => l.id === leadId);
    const leadName = targetLead?.name || 'Empresa';
    setCurrentLeadProcessing(`Gerando para: ${leadName}`);
    setCurrentStageIndex(1);

    const pushLog = (agent: string, text: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') => {
      setTerminalLogs((prev) => [
        { id: Date.now().toString() + Math.random(), time: new Date().toLocaleTimeString('pt-BR'), agent, text, type },
        ...prev
      ]);
    };

    pushLog('ScraperAgent', `[ETAPA 1/5] Processando lead individual: ${leadName}`, 'info');

    const t2 = setTimeout(() => { setCurrentStageIndex(2); pushLog('PersonaAgent', `[ETAPA 2/5] Persona Agent analisando ICP de ${leadName}`, 'info'); }, 1500);
    const t3 = setTimeout(() => { setCurrentStageIndex(3); pushLog('SiteBuilderAgent', `[ETAPA 3/5] Liam Agent construindo site cinematográfico para ${leadName}`, 'info'); }, 3000);
    const t4 = setTimeout(() => { setCurrentStageIndex(4); pushLog('DeployAgent', `[ETAPA 4/5] Deployando site de ${leadName} no Edge`, 'info'); }, 4500);
    const t5 = setTimeout(() => { setCurrentStageIndex(5); pushLog('OutreachAgent', `[ETAPA 5/5] Bryan Agent enviando pitch SDR no WhatsApp`, 'info'); }, 6000);

    try {
      const res = await fetch('/api/pipeline/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId })
      });
      const data = await res.json();
      clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5);
      setLoadingLeadId(null);
      if (data.success) {
        setCurrentStageIndex(5);
        setPipelineStatus('idle');
        setCurrentLeadProcessing(`Concluído: ${leadName}`);
        pushLog('SYS_CORE', `✅ Site de ${leadName} publicado e link de demonstração pronto!`, 'success');
        showToast(`Pipeline completa executada para ${data.lead.name}! Site publicado.`);
        loadData();
      } else {
        setPipelineStatus('idle');
        setCurrentStageIndex(0);
      }
    } catch (e) {
      console.error(e);
      clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5);
      setLoadingLeadId(null);
      setPipelineStatus('idle');
      setCurrentStageIndex(0);
      showToast('Erro ao rodar pipeline do agente');
    }
  };

  const handleStatusChange = async (
    leadId: string,
    newStatus: FunnelStatus,
    reasonData?: { reason: string; notes: string; valueLost?: number }
  ) => {
    try {
      await fetch(`/api/leads/${leadId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          ...reasonData
        })
      });
      showToast(`Status do lead atualizado para "${newStatus.toUpperCase()}"`);
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveSite = async (leadId: string, updatedSite: Partial<SiteData>) => {
    try {
      await fetch(`/api/sites/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSite)
      });
      showToast('Alterações salvas e site re-deployado na Cloudflare com sucesso!');
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddAiSection = async (leadId: string, promptText: string) => {
    try {
      await fetch(`/api/sites/${leadId}/ai-section`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText })
      });
      showToast('Nova seção gerada pela IA e injetada no site!');
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleRunLearnerCycle = async () => {
    try {
      await fetch('/api/learnings/cycle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId: currentTenantId })
      });
      showToast('Ciclo diário do Learner Agent concluído! Prompts atualizados.');
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddManualLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName || !manualCategory || !manualCity) return;

    const newLead: Partial<Lead> = {
      tenantId: currentTenantId,
      name: manualName,
      category: manualCategory,
      segment: 'servicos',
      phone: manualPhone || '41999999999',
      address: `${manualCity}, PR`,
      rating: 4.8,
      reviewsCount: 15,
      hasWebsite: false,
      siteHealthScore: 25,
      pipelineStatus: 'aguardando',
      pipelineStage: 'pending',
      saleValue: 1500,
      reviewsSample: []
    };

    fetch('/api/leads/manual', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLead)
    })
      .then(() => {
        showToast(`Lead "${manualName}" cadastrado com sucesso!`);
        setActiveModal(null);
        setManualName('');
        setManualCategory('');
        setManualCity('');
        setManualPhone('');
        loadData();
      })
      .catch((e) => console.error(e));
  };

  const currentTenant = tenants.find((t) => t.id === currentTenantId) || tenants[0];

  if (appMode === 'landing') {
    return (
      <LandingPage
        isLoggedIn={!!currentUser}
        onNavigateToDashboard={() => setAppMode('app')}
        onLoginSuccess={(user, tenant) => {
          setCurrentUser(user);
          if (tenant && tenant.id) {
            setCurrentTenantId(tenant.id);
          }
          setAppMode('app');
          showToast(`Bem-vindo, ${user.name}!`);
          loadData();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0714] text-[#f0f0f5] flex flex-col font-sans select-none antialiased">
      {/* Top Navbar */}
      <Navbar
        tenants={tenants}
        currentTenantId={currentTenantId}
        onSelectTenant={(id) => setCurrentTenantId(id)}
        onOpenScraperModal={() => setActiveModal('scraper')}
        onOpenOnboardingModal={() => setActiveModal('onboarding')}
        onOpenSuperAdminModal={() => setActiveModal('superadmin')}
        onOpenPlaybookModal={() => setActiveModal('playbook')}
        onNavigateLanding={() => setAppMode('landing')}
        currentUser={currentUser}
        onLogout={() => {
          setCurrentUser(null);
          showToast('Você saiu da sua conta.');
        }}
      />

      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0d0d12] text-cyan-400 px-4 py-3 rounded border border-cyan-500/40 flex items-center space-x-3 text-xs font-mono shadow-[0_0_20px_rgba(6,182,212,0.25)] animate-bounce">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR NAVIGATION */}
        <aside className="w-60 bg-[#0d0d12] border-r-2 border-purple-500/15 flex flex-col justify-between p-4 shrink-0 font-mono text-xs shadow-2xl">
          <div className="space-y-4">
            {/* Sidebar Logo / Header */}
            <div className="pb-3 border-b border-purple-500/15 space-y-1">
              <div className="font-brand text-xs text-purple-300 tracking-wider flex items-center space-x-2">
                <span className="w-2.5 h-2.5 bg-cyan-400 rotate-45 inline-block shadow-[0_0_8px_#00FFB3]"></span>
                <span>OPTAV.IA OS</span>
              </div>
              <p className="text-[10px] text-slate-500">Central de Comando Multi-Tenant</p>
            </div>

            {/* Navigation Menu Links */}
            <nav className="space-y-1">
              <button
                onClick={() => setActiveView('motor')}
                className={`w-full text-left px-3 py-2.5 rounded font-mono text-xs font-bold transition-all flex items-center space-x-2.5 border cursor-pointer ${
                  activeView === 'motor'
                    ? 'bg-purple-900/40 text-purple-300 border-purple-500/50 shadow-pixel'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#1c1c28] border-transparent'
                }`}
              >
                <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Motor Optav.ia</span>
              </button>

              <button
                onClick={() => setActiveView('overview')}
                className={`w-full text-left px-3 py-2.5 rounded font-mono text-xs font-bold transition-all flex items-center space-x-2.5 border cursor-pointer ${
                  activeView === 'overview'
                    ? 'bg-purple-900/40 text-purple-300 border-purple-500/50 shadow-pixel'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#1c1c28] border-transparent'
                }`}
              >
                <BarChart2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Visão Geral</span>
              </button>

              <button
                onClick={() => setActiveView('crm')}
                className={`w-full text-left px-3 py-2.5 rounded font-mono text-xs font-bold transition-all flex items-center space-x-2.5 border cursor-pointer ${
                  activeView === 'crm'
                    ? 'bg-purple-900/40 text-purple-300 border-purple-500/50 shadow-pixel'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#1c1c28] border-transparent'
                }`}
              >
                <LayoutGrid className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>CRM / Leads</span>
              </button>

              <button
                onClick={() => setActiveView('uti')}
                className={`w-full text-left px-3 py-2.5 rounded font-mono text-xs font-bold transition-all flex items-center justify-between border cursor-pointer ${
                  activeView === 'uti'
                    ? 'bg-purple-900/40 text-purple-300 border-purple-500/50 shadow-pixel'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#1c1c28] border-transparent'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Leads Incompletos</span>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[9px] bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
                  UTI
                </span>
              </button>

              <button
                onClick={() => setActiveView('ciclos')}
                className={`w-full text-left px-3 py-2.5 rounded font-mono text-xs font-bold transition-all flex items-center space-x-2.5 border cursor-pointer ${
                  activeView === 'ciclos'
                    ? 'bg-purple-900/40 text-purple-300 border-purple-500/50 shadow-pixel'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#1c1c28] border-transparent'
                }`}
              >
                <History className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Histórico</span>
              </button>

              <button
                onClick={() => setActiveView('sites')}
                className={`w-full text-left px-3 py-2.5 rounded font-mono text-xs font-bold transition-all flex items-center space-x-2.5 border cursor-pointer ${
                  activeView === 'sites'
                    ? 'bg-purple-900/40 text-purple-300 border-purple-500/50 shadow-pixel'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#1c1c28] border-transparent'
                }`}
              >
                <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Sites Gerados</span>
              </button>

              <button
                onClick={() => setActiveView('learnings')}
                className={`w-full text-left px-3 py-2.5 rounded font-mono text-xs font-bold transition-all flex items-center space-x-2.5 border cursor-pointer ${
                  activeView === 'learnings'
                    ? 'bg-purple-900/40 text-purple-300 border-purple-500/50 shadow-pixel'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#1c1c28] border-transparent'
                }`}
              >
                <Brain className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Learner Agent</span>
              </button>
            </nav>

            {/* Manual Lead Trigger Button */}
            <button
              onClick={() => setActiveModal('leadManual')}
              className="w-full py-2 px-3 rounded font-mono text-xs font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-pixel"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Lead Manual</span>
            </button>
          </div>

          {/* Sidebar Footer User Info */}
          <div className="pt-4 border-t border-purple-500/15 space-y-2">
            <button
              onClick={() => setActiveView('perfil')}
              className={`w-full flex items-center space-x-2.5 p-2 rounded border cursor-pointer text-xs font-mono transition-colors ${
                activeView === 'perfil' ? 'bg-purple-900/40 border-purple-500/50 text-white' : 'bg-[#12121a] border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-purple-900 border border-purple-400 flex items-center justify-center font-bold text-purple-300 text-[10px]">
                B
              </div>
              <div className="text-left truncate">
                <div className="font-bold text-white truncate text-[11px]">Agente Bryan</div>
                <div className="text-[9px] text-slate-500 uppercase">{currentTenant?.plan || 'PRO'}</div>
              </div>
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {/* Header Controls Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-purple-500/15">
            <div>
              <h1 className="font-brand text-sm md:text-base text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-cyan-400 to-amber-300 tracking-wider">
                CENTRAL DE COMANDO
              </h1>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Workspace: <strong className="text-white">{currentTenant?.name || 'Agência Principal'}</strong> [{currentTenant?.segment?.toUpperCase()}]
              </p>
            </div>

            {/* Pipeline Controls in Header */}
            <div className="flex items-center space-x-3 font-mono">
              {/* Esteira Active Timer Badge */}
              <div className="hidden sm:flex items-center space-x-2 px-2.5 py-1.5 rounded bg-[#0A0D18] border border-cyan-500/30 text-xs">
                <Clock className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
                <span className="text-[10px] text-slate-400 uppercase font-bold">ESTEIRA:</span>
                <span className="font-bold text-cyan-300 font-mono">{formatUptime(esteiraUptimeSeconds)}</span>
              </div>

              <div className="flex items-center space-x-2 px-3 py-1.5 rounded bg-[#12121a] border border-purple-500/20 text-xs">
                <span className={`w-2 h-2 rounded-full ${
                  pipelineState === 'running' ? 'bg-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse' : pipelineState === 'paused' ? 'bg-amber-400' : 'bg-slate-500'
                }`}></span>
                <span className="font-bold text-slate-300 uppercase">
                  {pipelineState === 'running' ? '● RODANDO' : pipelineState === 'paused' ? '⏸ PAUSADO' : '○ IDLE'}
                </span>
              </div>

              {pipelineState === 'idle' && (
                <button
                  onClick={handleStartPipelineCycle}
                  className="px-4 py-1.5 rounded font-mono font-bold text-xs text-slate-950 bg-emerald-400 hover:bg-emerald-300 border border-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)] transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>INICIAR</span>
                </button>
              )}

              {pipelineState === 'running' && (
                <button
                  onClick={handlePausePipeline}
                  className="px-4 py-1.5 rounded font-mono font-bold text-xs text-slate-950 bg-amber-400 hover:bg-amber-300 border border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)] transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>PAUSAR</span>
                </button>
              )}

              {pipelineState === 'paused' && (
                <button
                  onClick={handleResumePipeline}
                  className="px-4 py-1.5 rounded font-mono font-bold text-xs text-slate-950 bg-cyan-400 hover:bg-cyan-300 border border-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)] transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>RETOMAR</span>
                </button>
              )}
            </div>
          </div>

          {/* VIEW: MOTOR OPTAV.IA */}
          {activeView === 'motor' && (
            <div className="space-y-6">
              {/* PAINEL MONITOR DE ESTEIRA & FASE DO LEAD */}
              <div className="bg-[#0B0E17] border border-cyan-500/30 rounded-xl p-4 font-mono space-y-4 shadow-xl relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />

                {/* Top Row: Timer and Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2.5 rounded-lg border ${
                      pipelineState === 'running'
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 animate-pulse'
                        : pipelineState === 'paused'
                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}>
                      <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest">
                          ESTEIRA DE GERACÃO AUTOMÁTICA
                        </h3>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                          pipelineState === 'running'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                            : pipelineState === 'paused'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          {pipelineState === 'running' ? '● LIGADA' : pipelineState === 'paused' ? '⏸ PAUSADA' : '○ IDLE'}
                        </span>
                      </div>
                      <p className="text-[11px] text-cyan-400 mt-0.5 font-semibold truncate max-w-md">
                        {currentLeadProcessing || 'Pronta para prospecção no Google Maps & IA'}
                      </p>
                    </div>
                  </div>

                  {/* Uptime Box */}
                  <div className="flex items-center space-x-2.5 bg-[#05070D] px-3.5 py-2 rounded-lg border border-cyan-500/30 shrink-0">
                    <Clock className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '5s' }} />
                    <div>
                      <div className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">TEMPO DA ESTEIRA LIGADA</div>
                      <div className="text-sm font-bold font-mono text-cyan-300 tracking-wider">
                        {formatUptime(esteiraUptimeSeconds)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5-Stage Lead Pipeline Visual Tracker */}
                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-bold mb-2">
                    <span className="flex items-center space-x-1.5">
                      <Zap className="w-3 h-3 text-cyan-400" />
                      <span>FASE DA ETAPA DE GERAÇÃO DO LEAD</span>
                    </span>
                    <span className="text-cyan-300 font-extrabold">
                      {currentStageIndex > 0 ? `ETAPA ${currentStageIndex}/5 (${currentStageIndex * 20}%)` : 'STANDBY'}
                    </span>
                  </div>

                  {/* Stage Progress Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                    {[
                      { step: 1, title: '1. SCRAPING', agent: 'ScraperAgent', desc: 'Google Places' },
                      { step: 2, title: '2. PERSONA', agent: 'Caio Agent', desc: 'Scoring ICP' },
                      { step: 3, title: '3. SITE BUILD', agent: 'Liam Agent', desc: 'Astro + GSAP' },
                      { step: 4, title: '4. DEPLOY CDN', agent: 'DeployAgent', desc: 'Cloudflare' },
                      { step: 5, title: '5. WHATSAPP SDR', agent: 'Bryan Agent', desc: 'Disparo SDR' },
                    ].map((st) => {
                      const isCurrent = currentStageIndex === st.step;
                      const isDone = currentStageIndex > st.step;

                      return (
                        <div
                          key={st.step}
                          className={`p-2.5 rounded-lg border text-xs transition-all relative ${
                            isCurrent
                              ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_12px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400/50'
                              : isDone
                              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                              : 'bg-[#05070D] border-slate-800 text-slate-500'
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold text-[11px] mb-1">
                            <span className={isCurrent ? 'text-cyan-200 font-extrabold' : ''}>{st.title}</span>
                            {isDone && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                            {isCurrent && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />}
                          </div>
                          <div className="text-[9px] opacity-80 uppercase truncate">{st.agent}</div>
                          <div className="text-[9px] text-slate-500 truncate">{st.desc}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Pixel Office Canvas */}
              <PixelOfficeCanvas
                isRunning={pipelineState === 'running'}
                activeAgent="Liam"
                latestLogMessage={terminalLogs[0]?.text}
              />

              {/* Iniciar Novo Ciclo & Configuration Form */}
              <div className="bg-[#12121a] border border-purple-500/20 rounded-lg p-5 space-y-4 font-mono">
                <div className="flex items-center space-x-2 font-bold text-sm text-purple-300 uppercase border-b border-purple-500/20 pb-3">
                  <Play className="w-4 h-4 text-cyan-400" />
                  <span>INICIAR NOVO CICLO // CONFIGURAÇÃO</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Nicho / Segmento</label>
                    <input
                      type="text"
                      value={cycleNicho}
                      onChange={(e) => setCycleNicho(e.target.value)}
                      placeholder="ex: Dentistas, Clínicas"
                      className="w-full p-2.5 rounded bg-[#0a0714] border border-purple-500/20 text-slate-200 font-mono text-xs focus:outline-hidden focus:border-cyan-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Cidade Alvo</label>
                    <input
                      type="text"
                      value={cycleCidade}
                      onChange={(e) => setCycleCidade(e.target.value)}
                      placeholder="ex: Curitiba, PR"
                      className="w-full p-2.5 rounded bg-[#0a0714] border border-purple-500/20 text-slate-200 font-mono text-xs focus:outline-hidden focus:border-cyan-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Leads por Ciclo</label>
                    <input
                      type="number"
                      value={cycleQuantity}
                      onChange={(e) => setCycleQuantity(Number(e.target.value))}
                      className="w-full p-2.5 rounded bg-[#0a0714] border border-purple-500/20 text-slate-200 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Score Mínimo</label>
                    <input
                      type="number"
                      value={cycleScoreMin}
                      onChange={(e) => setCycleScoreMin(Number(e.target.value))}
                      className="w-full p-2.5 rounded bg-[#0a0714] border border-purple-500/20 text-slate-200 font-mono text-xs"
                    />
                  </div>
                </div>

                <button
                  onClick={handleStartPipelineCycle}
                  className="w-full py-3 rounded font-mono font-bold text-xs text-slate-950 bg-cyan-400 hover:bg-cyan-300 border border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>EXECUTAR CICLO DE PROSPECÇÃO NO GOOGLE MAPS</span>
                </button>
              </div>

              {/* REFILL AUTOMÁTICO DA FILA DE PROSPECÇÃO (MOTOR DE BUSCA) */}
              <div className="bg-[#12121a] border border-amber-500/30 rounded-lg p-5 space-y-4 font-mono">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2 font-bold text-sm text-amber-400 uppercase">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>REFILL AUTOMÁTICO DA FILA DE PROSPECÇÃO (MOTOR DE BUSCA)</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                    FILA INTEGRADA AO MOTOR
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Meta da Fila de Leads (Alvo)</label>
                    <input
                      type="number"
                      defaultValue={currentTenant?.targetQueueGoal || 300}
                      onBlur={async (e) => {
                        const val = Number(e.target.value);
                        try {
                          await fetch(`/api/tenants/${currentTenantId}/settings`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ targetQueueGoal: val })
                          });
                          showToast(`✅ Meta da fila de prospecção atualizada para ${val} leads!`);
                          loadData();
                        } catch (err) {
                          console.error(err);
                        }
                      }}
                      className="w-full p-2.5 rounded bg-[#0a0714] border border-slate-700 text-white font-bold"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">Quantidade ideal de leads no motor.</p>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Gatilho Mínimo de Refill (Threshold)</label>
                    <input
                      type="number"
                      defaultValue={currentTenant?.minQueueThreshold || 50}
                      onBlur={async (e) => {
                        const val = Number(e.target.value);
                        try {
                          await fetch(`/api/tenants/${currentTenantId}/settings`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ minQueueThreshold: val })
                          });
                          showToast(`✅ Gatilho mínimo atualizado para ${val} leads!`);
                          loadData();
                        } catch (err) {
                          console.error(err);
                        }
                      }}
                      className="w-full p-2.5 rounded bg-[#0a0714] border border-slate-700 text-white font-bold"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">Dispara o Scraper quando os leads ativos no motor caírem abaixo deste valor.</p>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Status do Refill Automático</label>
                    <div className="p-2.5 rounded bg-[#0a0714] border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span className="font-bold text-emerald-300 text-xs">ATIVO NO MOTOR</span>
                      </div>
                      <span className="text-[10px] text-slate-400">Leads Atuais: {leads.length}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">Varredura automática sem paralisações na esteira.</p>
                  </div>
                </div>
              </div>

              {/* Real-time Terminal Logs Stream */}
              <div className="bg-[#0d0d12] border border-purple-500/20 rounded-lg p-4 font-mono text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-purple-500/20 pb-2 text-slate-400">
                  <div className="flex items-center space-x-2 text-cyan-400 font-bold">
                    <FileText className="w-4 h-4" />
                    <span>TERMINAL STREAM // LIVE SYSTEM LOGS</span>
                  </div>
                  <span className="text-[10px] text-slate-500">REALTIME SSE STREAM</span>
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-2">
                  {terminalLogs.map((log) => (
                    <div key={log.id} className="p-2 rounded bg-[#0a0714] border border-slate-800/80 flex items-start justify-between text-[11px]">
                      <div className="flex items-start space-x-2 truncate">
                        <span className="text-amber-400 shrink-0">[{log.agent}]</span>
                        <span className="text-slate-200 truncate">{log.text}</span>
                      </div>
                      <span className="text-slate-500 text-[10px] shrink-0 ml-2">{log.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW: VISÃO GERAL */}
          {activeView === 'overview' && (
            <div className="space-y-6">
              <DashboardKpis kpis={kpis} onRunLearnerCycle={handleRunLearnerCycle} />

              {/* Funil Visual Overview */}
              <div className="bg-[#12121a] border border-purple-500/20 rounded-lg p-5 space-y-4 font-mono">
                <h3 className="font-bold text-sm text-purple-300 uppercase">FUNIL DE CONVERSÃO ACUMULADO</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Leads Prospectados</span>
                      <span className="text-cyan-400 font-bold">{kpis.totalLeads}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded overflow-hidden">
                      <div className="h-full bg-cyan-400 w-full"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Sites Cinematográficos Gerados</span>
                      <span className="text-indigo-400 font-bold">{kpis.sitesDeployed}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded overflow-hidden">
                      <div className="h-full bg-indigo-400 w-[80%]"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Abordagens via WhatsApp</span>
                      <span className="text-emerald-400 font-bold">{kpis.messagedCount}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded overflow-hidden">
                      <div className="h-full bg-emerald-400 w-[65%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: CRM KANBAN */}
          {activeView === 'crm' && (
            <KanbanBoard
              leads={leads}
              onStatusChange={handleStatusChange}
              onRunPipeline={handleRunPipelineForSingleLead}
              onOpenSiteEditor={(id) => {
                setSelectedLeadId(id);
                setActiveModal('siteEditor');
              }}
              onOpenChat={(id) => {
                setSelectedLeadId(id);
                setActiveModal('chat');
              }}
              loadingLeadId={loadingLeadId}
            />
          )}

          {/* VIEW: UTI / LEADS DESQUALIFICADOS E INCOMPLETOS */}
          {activeView === 'uti' && (
            <div className="space-y-4">
              <div className="bg-[#12121a] p-4 rounded-lg border border-amber-500/30 text-xs font-mono flex items-center justify-between text-amber-300">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <span>PAINEL UTI // LEADS DESQUALIFICADOS PELO QUALIFIER AGENT OU COM DADOS INCOMPLETOS</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
                  {leads.filter((l) => l.isDisqualified).length} LEADS DESQUALIFICADOS
                </span>
              </div>

              {/* Table of Disqualified / UTI Leads */}
              <div className="overflow-x-auto border border-slate-800 rounded bg-[#0A0C14] font-mono text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500 bg-[#05070B] uppercase text-[10px]">
                      <th className="py-2.5 px-3">Empresa / Categoria</th>
                      <th className="py-2.5 px-3">Motivo da Desqualificação</th>
                      <th className="py-2.5 px-3">Score de Qualificação</th>
                      <th className="py-2.5 px-3">Contato</th>
                      <th className="py-2.5 px-3 text-right">Ação de Aprovação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {leads.filter((l) => l.isDisqualified).length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-600 italic">
                          [ NENHUM LEAD DESQUALIFICADO NO MOMENTO. TODOS OS LEADS ATIVOS FORAM APROVADOS! ]
                        </td>
                      </tr>
                    ) : (
                      leads.filter((l) => l.isDisqualified).map((lead) => (
                        <tr key={lead.id} className="hover:bg-[#0D1018]">
                          <td className="py-3 px-3">
                            <div className="font-bold text-white">{lead.name}</div>
                            <div className="text-[10px] text-slate-500">{lead.category} • {lead.address}</div>
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-1 rounded text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/30 font-bold inline-block">
                              {lead.disqualificationReason || lead.qualificationReason || 'Desqualificado pelo QualifierAgent'}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-bold text-amber-400">
                            {lead.qualificationScore || 15}/100 PTS
                          </td>
                          <td className="py-3 px-3 text-[11px] text-slate-400">
                            <div>📞 {lead.phone || 'Sem telefone'}</div>
                            <div>✉️ {lead.email || 'Sem e-mail'}</div>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={async () => {
                                try {
                                  await fetch(`/api/leads/${lead.id}/approve-disqualified`, { method: 'POST' });
                                  showToast(`✅ Lead "${lead.name}" aprovado manualmente e movido para a esteira!`);
                                  loadData();
                                } catch (e) {
                                  console.error(e);
                                }
                              }}
                              className="px-3 py-1.5 rounded font-bold text-xs bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/25 transition-all cursor-pointer inline-flex items-center space-x-1"
                            >
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Aprovar Manualmente</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW: HISTÓRICO DE CICLOS */}
          {activeView === 'ciclos' && (
            <div className="bg-[#12121a] border border-purple-500/20 rounded-lg p-5 space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
                <h3 className="font-bold text-sm text-purple-300 uppercase flex items-center space-x-2">
                  <History className="w-4 h-4 text-cyan-400" />
                  <span>HISTÓRICO DE EXECUÇÃO DE PIPELINES</span>
                </h3>
                <span className="text-[10px] text-slate-500">ÚLTIMOS 10 CICLOS</span>
              </div>

              <div className="overflow-x-auto border border-slate-800 rounded">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500 bg-[#0a0714] text-[10px] uppercase">
                      <th className="py-2.5 px-3">Ciclo #</th>
                      <th className="py-2.5 px-3">Nicho</th>
                      <th className="py-2.5 px-3">Cidade Alvo</th>
                      <th className="py-2.5 px-3">Leads Capturados</th>
                      <th className="py-2.5 px-3">Sites Gerados</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-300">
                    <tr className="hover:bg-[#1c1c28]">
                      <td className="py-2.5 px-3 font-bold text-cyan-400">#042</td>
                      <td className="py-2.5 px-3">Clínica Odontológica</td>
                      <td className="py-2.5 px-3">Curitiba - PR</td>
                      <td className="py-2.5 px-3 font-bold">10</td>
                      <td className="py-2.5 px-3 font-bold text-emerald-400">10</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          CONCLUÍDO
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-[#1c1c28]">
                      <td className="py-2.5 px-3 font-bold text-cyan-400">#041</td>
                      <td className="py-2.5 px-3">Restaurantes & Gastronomia</td>
                      <td className="py-2.5 px-3">São Paulo - SP</td>
                      <td className="py-2.5 px-3 font-bold">15</td>
                      <td className="py-2.5 px-3 font-bold text-emerald-400">15</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          CONCLUÍDO
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW: SITES GERADOS */}
          {activeView === 'sites' && (
            <div className="space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
                <h3 className="font-bold text-sm text-purple-300 uppercase flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span>GALERIA DE SITES CINEMATOGRÁFICOS NO AR</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {leads.filter((l) => l.siteUrl).map((lead) => (
                  <div key={lead.id} className="bg-[#12121a] border border-slate-800 rounded-lg p-4 space-y-3 hover:border-purple-500/40 transition-all">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="font-bold text-white text-xs truncate">{lead.name}</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        LIVE
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400">{lead.category} • {lead.address}</p>

                    <div className="flex items-center justify-between text-xs pt-2">
                      <a
                        href={lead.siteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold flex items-center space-x-1 hover:bg-cyan-500/20"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Abrir Site</span>
                      </a>

                      <button
                        onClick={() => {
                          setSelectedLeadId(lead.id);
                          setActiveModal('siteEditor');
                        }}
                        className="px-3 py-1.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30 font-bold hover:bg-purple-500/20 cursor-pointer"
                      >
                        Studio Editor
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: LEARNER AGENT PATTERNS */}
          {activeView === 'learnings' && (
            <LearningsPanel learnings={learnings} onRunCycle={handleRunLearnerCycle} />
          )}

          {/* VIEW: MEU PERFIL & CONFIGURAÇÃO DO AGENTE SDR + CONEXÃO WHATSAPP */}
          {activeView === 'perfil' && (
            <div className="space-y-6 font-mono text-xs">
              <div className="bg-[#12121a] border border-purple-500/20 rounded-lg p-5 space-y-6">
                <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
                  <h3 className="font-bold text-sm text-white uppercase flex items-center space-x-2">
                    <User className="w-4 h-4 text-purple-400" />
                    <span>CENTRAL DO AGENTE SDR & CONEXÃO WHATSAPP INSTÂNCIA</span>
                  </h3>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    SDR BOT ONLINE
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* SDR Config */}
                  <div className="bg-[#0a0714] border border-slate-800 rounded-lg p-4 space-y-4">
                    <h4 className="font-bold text-cyan-400 text-xs uppercase flex items-center space-x-2 border-b border-slate-800 pb-2">
                      <UserCheck className="w-4 h-4" />
                      <span>PERFIL DO AGENTE SDR (AUTOMAÇÃO DE MENSAGENS)</span>
                    </h4>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Nome do SDR (Atendente IA)</label>
                      <input
                        type="text"
                        defaultValue={currentTenant?.sdrConfig?.name || 'Bryan Santos'}
                        onBlur={async (e) => {
                          const newName = e.target.value;
                          if (!newName) return;
                          try {
                            await fetch(`/api/tenants/${currentTenantId}/settings`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ sdrName: newName })
                            });
                            showToast(`✅ Nome do Agente SDR atualizado para "${newName}"!`);
                            loadData();
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                        className="w-full p-2.5 rounded bg-[#12121a] border border-slate-700 text-white font-bold focus:border-cyan-400 focus:outline-hidden"
                      />
                      <p className="text-[10px] text-slate-500 mt-1">Este nome será usado pelo SDR em todos os contatos via WhatsApp e E-mail.</p>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Tom de Voz da Abordagem</label>
                      <select
                        defaultValue={currentTenant?.sdrConfig?.tone || 'informal'}
                        onChange={async (e) => {
                          try {
                            await fetch(`/api/tenants/${currentTenantId}/settings`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ sdrTone: e.target.value })
                            });
                            showToast(`✅ Tom de voz do SDR atualizado!`);
                            loadData();
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                        className="w-full p-2.5 rounded bg-[#12121a] border border-slate-700 text-slate-200 cursor-pointer"
                      >
                        <option value="informal">Informal & Direto (Recomendado para WhatsApp)</option>
                        <option value="consultivo">Consultivo & Profissional</option>
                        <option value="urgente">Urgente & Promocional</option>
                      </select>
                    </div>
                  </div>

                  {/* WHATSAPP QR CODE CONNECTOR CARD */}
                  <div className="bg-[#0a0714] border border-emerald-500/30 rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <h4 className="font-bold text-emerald-400 text-xs uppercase flex items-center space-x-2">
                        <QrCode className="w-4 h-4 text-emerald-400" />
                        <span>CONEXÃO DO WHATSAPP VIA QR CODE</span>
                      </h4>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase flex items-center space-x-1 ${
                        qrStatus === 'connected'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : qrStatus === 'connecting'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      }`}>
                        {qrStatus === 'connected' ? <Wifi className="w-3 h-3 text-emerald-400" /> : <WifiOff className="w-3 h-3 text-rose-400" />}
                        <span>{qrStatus === 'connected' ? 'CONECTADO' : qrStatus === 'connecting' ? 'AGUARDANDO LEITURA' : 'DESCONECTADO'}</span>
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#05070d] p-3 rounded-lg border border-slate-800">
                      {/* QR Code Graphic Box */}
                      <div className="relative w-28 h-28 bg-white p-2 rounded-lg shrink-0 flex items-center justify-center border-2 border-emerald-500/40 shadow-lg group">
                        {/* Custom Styled QR Code Matrix */}
                        <div className="w-full h-full bg-[#000] p-1 grid grid-cols-7 gap-0.5 rounded">
                          {Array.from({ length: 49 }).map((_, i) => (
                            <div
                              key={i}
                              className={`${
                                i % 2 === 0 || i % 5 === 0 || i < 7 || i > 42 || i % 7 === 0 || i % 7 === 6
                                  ? 'bg-black'
                                  : 'bg-white'
                              } rounded-[1px]`}
                            />
                          ))}
                        </div>
                        {qrStatus === 'connected' && (
                          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center text-center p-2 rounded-lg space-y-1">
                            <CheckCircle className="w-6 h-6 text-emerald-400" />
                            <span className="text-[9px] font-bold text-emerald-300 uppercase">ONLINE</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2 flex-1 text-center sm:text-left">
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase font-bold">DISPOSITIVO CONECTADO:</span>
                          <div className="text-sm font-bold text-white flex items-center space-x-1 justify-center sm:justify-start">
                            <Phone className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{qrPhoneNumber}</span>
                          </div>
                        </div>

                        <div className="text-[10px] text-slate-400 space-y-0.5">
                          <p>Instância: <code className="text-cyan-300">{qrSessionToken}</code></p>
                          <p>Gateway: <span className="text-emerald-400 font-bold">Meowhats / Baileys API v2.4</span></p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 pt-1 justify-center sm:justify-start">
                          <button
                            onClick={() => {
                              setQrRefreshing(true);
                              setTimeout(() => {
                                setQrRefreshing(false);
                                setQrStatus('connected');
                                showToast('✅ QR Code recarregado e conexão estabelecida!');
                              }, 1200);
                            }}
                            disabled={qrRefreshing}
                            className="px-2.5 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold flex items-center space-x-1 cursor-pointer"
                          >
                            <RefreshCw className={`w-3 h-3 ${qrRefreshing ? 'animate-spin' : ''}`} />
                            <span>Gerar QR Code</span>
                          </button>

                          {qrStatus === 'connected' ? (
                            <button
                              onClick={() => {
                                setQrStatus('disconnected');
                                showToast('⚠️ Dispositivo WhatsApp desconectado.');
                              }}
                              className="px-2.5 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold cursor-pointer"
                            >
                              Desconectar
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setQrStatus('connected');
                                showToast('✅ WhatsApp reconectado com sucesso!');
                              }}
                              className="px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold cursor-pointer"
                            >
                              Reconectar
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* VISOR DE CONVERSAS EM TEMPO REAL DO SDR (LIVE WHATSAPP MONITOR) */}
              <div className="bg-[#12121a] border border-cyan-500/30 rounded-lg p-5 space-y-4 font-mono">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2 font-bold text-sm text-cyan-300 uppercase">
                    <MessageSquare className="w-4 h-4 text-cyan-400" />
                    <span>VISOR DE CONVERSAS EM TEMPO REAL DO SDR & WHATSAPP</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-[10px] text-emerald-300 font-bold uppercase">LIVE FEED ATIVO</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[500px]">
                  {/* Left Column: Lead List for Conversations */}
                  <div className="bg-[#0a0714] border border-slate-800 rounded-lg p-3 overflow-y-auto space-y-2">
                    <div className="text-[10px] font-bold text-slate-400 uppercase border-b border-slate-800 pb-2">
                      LEADS EM ATENDIMENTO ({leads.length})
                    </div>
                    {leads.map((lead) => {
                      const isSelected = sdrActiveLeadId === lead.id;
                      return (
                        <button
                          key={lead.id}
                          onClick={() => setSdrActiveLeadId(lead.id)}
                          className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-cyan-500/15 border-cyan-500/50 text-white shadow-pixel'
                              : 'bg-[#05070d] border-slate-800/80 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold text-xs">
                            <span className="truncate max-w-[140px]">{lead.name}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[8px] uppercase border ${
                              lead.pipelineStatus === 'fechado'
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                : lead.pipelineStatus === 'qualificado'
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                : 'bg-slate-800 text-slate-400 border-slate-700'
                            }`}>
                              {lead.pipelineStatus}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-between">
                            <span>{lead.phone}</span>
                            <span className="text-cyan-400 font-bold">{lead.score} pts</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Right Column: Live Chat Thread & Sender */}
                  <div className="lg:col-span-2 bg-[#05070d] border border-slate-800 rounded-lg flex flex-col overflow-hidden">
                    {/* Active Lead Header */}
                    {sdrActiveLeadId ? (
                      (() => {
                        const activeLead = leads.find((l) => l.id === sdrActiveLeadId);
                        return (
                          <>
                            <div className="p-3 bg-[#0a0714] border-b border-slate-800 flex items-center justify-between">
                              <div className="flex items-center space-x-2.5">
                                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-400 text-xs">
                                  <Phone className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className="font-bold text-white text-xs">{activeLead?.name}</div>
                                  <div className="text-[10px] text-slate-400">{activeLead?.phone} • {activeLead?.category}</div>
                                </div>
                              </div>

                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => setSdrLiveHumanMode(!sdrLiveHumanMode)}
                                  className={`px-2.5 py-1 rounded text-[10px] font-bold border flex items-center space-x-1 cursor-pointer transition-colors ${
                                    sdrLiveHumanMode
                                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                      : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                                  }`}
                                >
                                  {sdrLiveHumanMode ? <UserCheck className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                                  <span>{sdrLiveHumanMode ? 'INTERVENÇÃO HUMANA' : 'SDR IA AUTOMÁTICO'}</span>
                                </button>
                              </div>
                            </div>

                            {/* Chat History Messages Stream */}
                            <div className="flex-1 p-4 overflow-y-auto space-y-3 font-mono text-xs bg-[#020408]">
                              {sdrLiveMessages.length === 0 ? (
                                <div className="text-center py-16 text-slate-600 italic">
                                  [ NENHUMA MENSAGEM REGISTRADA AINDA. O SDR IA DISPARARÁ AO INICIAR CONTATO ]
                                </div>
                              ) : (
                                sdrLiveMessages.map((msg) => {
                                  const isSdr = msg.role === 'sdr';
                                  return (
                                    <div
                                      key={msg.id}
                                      className={`flex flex-col ${isSdr ? 'items-start' : 'items-end'} space-y-1`}
                                    >
                                      <span className="text-[9px] text-slate-500 px-1">
                                        {msg.sdrName ? msg.sdrName.toUpperCase() : isSdr ? 'SDR IA' : 'LEAD (WHATSAPP)'} • {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </span>
                                      <div
                                        className={`max-w-[85%] p-3 rounded-lg text-xs leading-relaxed border ${
                                          isSdr
                                            ? 'bg-[#0b0e17] text-slate-200 border-slate-800'
                                            : 'bg-emerald-950/60 text-emerald-200 border-emerald-500/40'
                                        }`}
                                      >
                                        {msg.text}
                                      </div>
                                    </div>
                                  );
                                })
                              )}
                            </div>

                            {/* Live Chat Form Input */}
                            <form onSubmit={handleSendSdrLiveMessage} className="p-3 bg-[#0a0714] border-t border-slate-800 flex items-center space-x-2">
                              <input
                                type="text"
                                value={sdrLiveInput}
                                onChange={(e) => setSdrLiveInput(e.target.value)}
                                placeholder={
                                  sdrLiveHumanMode
                                    ? 'Digite como operador humano no WhatsApp...'
                                    : 'Simule resposta do cliente para o SDR IA...'
                                }
                                className="flex-1 p-2.5 rounded bg-[#05070d] border border-slate-800 text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500/50"
                              />
                              <button
                                type="submit"
                                disabled={sdrSending || !sdrLiveInput.trim()}
                                className="px-4 py-2.5 rounded font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 border border-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.25)] flex items-center space-x-1.5 cursor-pointer text-xs"
                              >
                                <Send className="w-3.5 h-3.5" />
                                <span>Enviar</span>
                              </button>
                            </form>
                          </>
                        );
                      })()
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-slate-500 italic">
                        [ SELECIONE UM LEAD À ESQUERDA PARA ACOMPANHAR A CONVERSA EM TEMPO REAL ]
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* VPS DEPLOYMENT & DOCKER INSTRUCTIONS CARD */}
              <div className="bg-[#0a0714] border border-cyan-500/30 rounded-lg p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="font-bold text-cyan-300 text-xs uppercase flex items-center space-x-2">
                    <Server className="w-4 h-4 text-cyan-400" />
                    <span>IMPLANTAÇÃO VPS (LINUX / WINDOWS / DOCKER & MEOWHATS API)</span>
                  </h4>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/40">
                    SELF-HOSTED READY
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Esta aplicação está totalmente pronta para rodar em sua própria VPS Linux ou Windows. Ao atualizar ou enviar alterações para o repositório no GitHub, a VPS é atualizada **automaticamente** via CI/CD.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Option 1: Docker */}
                  <div className="p-3 bg-[#05070d] border border-slate-800 rounded font-mono space-y-2">
                    <div className="text-[11px] font-bold text-emerald-400 uppercase flex items-center space-x-1.5">
                      <Terminal className="w-3.5 h-3.5" />
                      <span>Opção 1: Docker Compose (1 Clique)</span>
                    </div>
                    <pre className="p-2 bg-[#0a0d18] rounded text-[10px] text-slate-300 overflow-x-auto border border-slate-800/80">
                      <code>
{`git clone https://github.com/seu-repo/optavia.git
cd optavia
cp .env.example .env
nano .env # (cole sua GEMINI_API_KEY e MEOWHATS_API_TOKEN)
docker compose up -d --build`}
                      </code>
                    </pre>
                  </div>

                  {/* Option 2: Linux Setup Script */}
                  <div className="p-3 bg-[#05070d] border border-slate-800 rounded font-mono space-y-2">
                    <div className="text-[11px] font-bold text-cyan-400 uppercase flex items-center space-x-1.5">
                      <Terminal className="w-3.5 h-3.5" />
                      <span>Opção 2: Script Linux Ubuntu/Debian</span>
                    </div>
                    <pre className="p-2 bg-[#0a0d18] rounded text-[10px] text-slate-300 overflow-x-auto border border-slate-800/80">
                      <code>
{`git clone https://github.com/seu-repo/optavia.git
cd optavia
chmod +x setup.sh
./setup.sh`}
                      </code>
                    </pre>
                  </div>
                </div>

                <div className="p-3 bg-[#111625] rounded border border-purple-500/30 text-[11px] text-slate-300 space-y-2">
                  <div className="font-bold text-purple-300 flex items-center space-x-1">
                    <Key className="w-3.5 h-3.5" />
                    <span>Meowhats REST API Webhook & Atualização Automática (GitHub Actions):</span>
                  </div>
                  <ul className="text-[10px] text-slate-400 space-y-1 list-disc pl-4">
                    <li>
                      <strong className="text-cyan-300">Webhook do WhatsApp:</strong> No painel Meowhats, configure a URL de webhook para: <code className="text-amber-300">http://SEU_IP_DA_VPS:3000/api/webhooks/whatsapp</code>
                    </li>
                    <li>
                      <strong className="text-emerald-300">GitHub Push-to-Deploy:</strong> O arquivo <code className="text-white">.github/workflows/deploy.yml</code> atualiza e reinicia o servidor na VPS automaticamente a cada <code className="text-white">git push</code>.
                    </li>
                    <li>
                      <strong className="text-purple-300">Chaves de API Isoladas:</strong> As chaves <code className="text-white">GEMINI_API_KEY</code> e <code className="text-white">MEOWHATS_API_TOKEN</code> permanecem exclusivamente no servidor em <code className="text-white">/.env</code>.
                    </li>
                  </ul>
                </div>
              </div>

            </div>
          )}
        </main>
      </div>

      {/* Render Modals */}
      {activeModal === 'siteEditor' && selectedLeadId && (
        <SiteEditorModal
          leadId={selectedLeadId}
          lead={leads.find((l) => l.id === selectedLeadId)}
          onClose={() => {
            setActiveModal(null);
            setSelectedLeadId(null);
          }}
          onSaveSite={handleSaveSite}
          onAddAiSection={handleAddAiSection}
        />
      )}

      {activeModal === 'chat' && selectedLeadId && (
        <ChatSimulator
          leadId={selectedLeadId}
          lead={leads.find((l) => l.id === selectedLeadId)}
          onClose={() => {
            setActiveModal(null);
            setSelectedLeadId(null);
          }}
        />
      )}

      {activeModal === 'scraper' && (
        <ScraperModal
          tenantId={currentTenantId}
          onClose={() => setActiveModal(null)}
          onScrapeSuccess={() => loadData()}
        />
      )}

      {activeModal === 'onboarding' && (
        <OnboardingModal
          onClose={() => setActiveModal(null)}
          onTenantCreated={(newTenant) => {
            setCurrentTenantId(newTenant.id);
            loadData();
          }}
        />
      )}

      {activeModal === 'superadmin' && (
        <SuperAdminModal onClose={() => setActiveModal(null)} />
      )}

      {activeModal === 'playbook' && (
        <PipelinePlaybookModal
          onClose={() => setActiveModal(null)}
          leads={leads}
          onRefreshLeads={() => loadData()}
          showToast={(msg) => showToast(msg)}
        />
      )}

      {/* Modal Lead Manual */}
      {activeModal === 'leadManual' && (
        <div className="fixed inset-0 bg-[#020408]/80 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-mono text-xs">
          <div className="bg-[#0A0C14] rounded-lg w-full max-w-md p-5 shadow-2xl border border-slate-800 space-y-4 text-slate-300">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm uppercase flex items-center space-x-2">
                <Plus className="w-4 h-4 text-amber-400" />
                <span>CADASTRAR LEAD MANUAL</span>
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-500 hover:text-slate-300">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddManualLead} className="space-y-3">
              <div>
                <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Nome do Negócio *</label>
                <input
                  type="text"
                  required
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  placeholder="ex: Clínica Odontológica Sorriso"
                  className="w-full p-2.5 rounded bg-[#0a0714] border border-slate-800 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Categoria / Nicho *</label>
                <input
                  type="text"
                  required
                  value={manualCategory}
                  onChange={(e) => setManualCategory(e.target.value)}
                  placeholder="ex: Dentista"
                  className="w-full p-2.5 rounded bg-[#0a0714] border border-slate-800 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Cidade / Estado *</label>
                <input
                  type="text"
                  required
                  value={manualCity}
                  onChange={(e) => setManualCity(e.target.value)}
                  placeholder="ex: Curitiba"
                  className="w-full p-2.5 rounded bg-[#0a0714] border border-slate-800 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Telefone WhatsApp</label>
                <input
                  type="text"
                  value={manualPhone}
                  onChange={(e) => setManualPhone(e.target.value)}
                  placeholder="ex: 41999999999"
                  className="w-full p-2.5 rounded bg-[#0a0714] border border-slate-800 text-slate-200"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded font-mono font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 border border-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.25)] transition-all cursor-pointer"
              >
                CADASTRAR LEAD NO FUNIL
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
