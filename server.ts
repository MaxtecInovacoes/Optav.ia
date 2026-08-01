import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db.js';
import { ScraperAgent } from './server/agents/scraper.js';
import { PersonaAgent } from './server/agents/persona.js';
import { SiteBuilderAgent } from './server/agents/site_builder.js';
import { DeployAgent } from './server/agents/deploy.ts';
import { OutreachAgent } from './server/agents/outreach.js';
import { LearnerAgent } from './server/agents/learner.js';
import { SDRAgent } from './server/agents/sdr.js';
import { generateAiSiteSection } from './server/gemini.js';
import { FunnelStatus, SegmentType } from './src/types/index.js';

const scraperAgent = new ScraperAgent();
const personaAgent = new PersonaAgent();
const siteBuilderAgent = new SiteBuilderAgent();
const deployAgent = new DeployAgent();
const outreachAgent = new OutreachAgent();
const learnerAgent = new LearnerAgent();
const sdrAgent = new SDRAgent();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // AUTHENTICATION ROUTES
  app.post('/api/auth/register', (req, res) => {
    const { email, password, name, agencyName, plan } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Preencha todos os campos obrigatórios (E-mail, Senha e Nome).' });
    }

    const existingUser = Array.from(db.users.values()).find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ error: 'Já existe uma conta cadastrada com este e-mail.' });
    }

    // Create new Tenant for this user
    const tenantId = `tenant-${Date.now()}`;
    const newTenant = {
      id: tenantId,
      name: agencyName || `Agência de ${name}`,
      segment: 'restaurante' as SegmentType,
      region: 'São Paulo, SP',
      plan: plan || 'pro',
      targetQueueGoal: 300,
      minQueueThreshold: 50,
      autoRefillEnabled: true,
      sdrConfig: {
        sdrType: 'custom' as const,
        name: 'Lucas Mendes',
        tone: 'informal' as const,
        rules: ['Apresente o site rapidamente', 'Mencione o diferencial da empresa'],
        basePrompt: 'Você é Lucas, especialista em conversão digital.'
      },
      whatsappConnected: true,
      createdAt: new Date().toISOString()
    };
    db.tenants.set(newTenant.id, newTenant);

    const newUser = {
      id: `usr-${Date.now()}`,
      name,
      email: email.toLowerCase(),
      password, // Em produção na VPS com PostgreSQL usa hash bcrypt
      tenantId: newTenant.id,
      plan: plan || 'pro',
      createdAt: new Date().toISOString()
    };
    db.users.set(newUser.id, newUser);

    res.json({
      success: true,
      token: `token-${newUser.id}`,
      user: { id: newUser.id, name: newUser.name, email: newUser.email, tenantId: newUser.tenantId },
      tenant: newTenant
    });
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    }

    // Default admin login or registered user
    let user = Array.from(db.users.values()).find((u: any) => u.email.toLowerCase() === email.toLowerCase());

    if (!user && (email === 'admin@optavia.ai' || email === 'trabalho.maxtec@gmail.com')) {
      // Create admin user dynamically
      user = {
        id: 'usr-admin',
        name: 'Administrador OPTAV.IA',
        email: email.toLowerCase(),
        password: password,
        tenantId: 'tenant-1',
        plan: 'enterprise',
        createdAt: new Date().toISOString()
      };
      db.users.set(user.id, user);
    }

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Credenciais inválidas. Verifique seu e-mail e senha.' });
    }

    const tenant = db.tenants.get(user.tenantId) || db.tenants.get('tenant-1');

    res.json({
      success: true,
      token: `token-${user.id}`,
      user: { id: user.id, name: user.name, email: user.email, tenantId: user.tenantId },
      tenant
    });
  });

  app.get('/api/auth/me', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Não autenticado' });

    const userId = authHeader.replace('Bearer token-', '');
    const user = db.users.get(userId) || db.users.get('usr-admin');

    if (!user) return res.status(401).json({ error: 'Sessão expirada' });
    const tenant = db.tenants.get(user.tenantId) || db.tenants.get('tenant-1');

    res.json({ user: { id: user.id, name: user.name, email: user.email, tenantId: user.tenantId }, tenant });
  });

  // CLEAR MOCK DATA FOR REAL PRODUCTION VPS USE
  app.post('/api/db/clear-mock-data', (req, res) => {
    const result = db.clearAllMockData();
    res.json(result);
  });

  // API Routes
  app.get('/api/tenants', (req, res) => {
    res.json(Array.from(db.tenants.values()));
  });

  app.post('/api/tenants', (req, res) => {
    const { name, segment, region, plan } = req.body;
    const newTenant = {
      id: `tenant-${Date.now()}`,
      name: name || 'Nova Agência Partner',
      segment: segment || 'restaurante',
      region: region || 'São Paulo, SP',
      plan: plan || 'pro',
      targetQueueGoal: 300,
      minQueueThreshold: 50,
      autoRefillEnabled: true,
      sdrConfig: {
        sdrType: 'custom' as const,
        name: 'Lucas Mendes',
        tone: 'informal' as const,
        rules: ['Apresente o site rapidamente', 'Mencione o diferencial da empresa'],
        basePrompt: 'Você é Lucas, especialista em conversão digital.'
      },
      whatsappConnected: true,
      createdAt: new Date().toISOString()
    };
    db.tenants.set(newTenant.id, newTenant);
    res.json(newTenant);
  });

  app.put('/api/tenants/:tenantId/settings', (req, res) => {
    const { tenantId } = req.params;
    const { sdrName, sdrTone, sdrRules, targetQueueGoal, minQueueThreshold, autoRefillEnabled } = req.body;
    const tenant = db.tenants.get(tenantId) || db.tenants.get('tenant-1');
    if (!tenant) return res.status(404).json({ error: 'Tenant não encontrado' });

    if (sdrName) tenant.sdrConfig.name = sdrName;
    if (sdrTone) tenant.sdrConfig.tone = sdrTone;
    if (sdrRules) tenant.sdrConfig.rules = sdrRules;
    if (targetQueueGoal !== undefined) tenant.targetQueueGoal = Number(targetQueueGoal);
    if (minQueueThreshold !== undefined) tenant.minQueueThreshold = Number(minQueueThreshold);
    if (autoRefillEnabled !== undefined) tenant.autoRefillEnabled = Boolean(autoRefillEnabled);

    db.tenants.set(tenant.id, tenant);
    res.json(tenant);
  });

  app.get('/api/leads', (req, res) => {
    const { tenantId, status, segment, search, minVal, maxVal, month } = req.query;
    let list = Array.from(db.leads.values());

    if (tenantId) list = list.filter((l) => l.tenantId === tenantId);
    if (status) list = list.filter((l) => l.pipelineStatus === status);
    if (segment) list = list.filter((l) => l.segment === segment);
    if (search) {
      const q = (search as string).toLowerCase();
      list = list.filter((l) => l.name.toLowerCase().includes(q) || l.address.toLowerCase().includes(q) || l.category.toLowerCase().includes(q));
    }
    if (minVal) list = list.filter((l) => (l.saleValue || 0) >= Number(minVal));
    if (maxVal) list = list.filter((l) => (l.saleValue || 0) <= Number(maxVal));
    if (month) list = list.filter((l) => l.siteCreatedAt && l.siteCreatedAt.startsWith(month as string));

    res.json(list);
  });

  app.post('/api/leads/:leadId/approve-disqualified', (req, res) => {
    const { leadId } = req.params;
    const lead = db.leads.get(leadId);
    if (!lead) return res.status(404).json({ error: 'Lead não encontrado' });

    lead.isDisqualified = false;
    lead.manualOverride = true;
    lead.pipelineStatus = 'aguardando';
    lead.qualificationReason = `Aprovado manualmente pelo usuário a partir dos leads desqualificados`;
    db.leads.set(leadId, lead);

    res.json({ success: true, lead });
  });

  app.post('/api/scrape', async (req, res) => {
    const { tenantId, keyword, city, maxResults, autoBuild, targetGoal } = req.body;
    try {
      const activeTenant = db.tenants.get(tenantId || 'tenant-1');
      const goal = targetGoal || activeTenant?.targetQueueGoal || 50;
      
      const newLeads = await scraperAgent.runScrape(
        tenantId || 'tenant-1',
        keyword || 'Desentupidora',
        city || 'Curitiba, PR',
        maxResults || 10
      );

      // Check if exhaustion warning should be set/cleared
      if (newLeads.length === 0 && activeTenant) {
        activeTenant.exhaustedWarning = `⚠️ Nenhum novo lead encontrado para "${keyword}" em "${city}". Todos os estabelecimentos locais já foram mapeados. Adicione novos nichos ou cidades.`;
        db.tenants.set(activeTenant.id, activeTenant);
      } else if (activeTenant) {
        activeTenant.exhaustedWarning = undefined;
        db.tenants.set(activeTenant.id, activeTenant);
      }

      const generatedSites = [];
      if (autoBuild !== false) {
        // Build sites for qualified leads
        const qualifiedLeads = newLeads.filter((l) => !l.isDisqualified);
        for (const lead of qualifiedLeads) {
          try {
            await personaAgent.analyzeLead(lead.id);
            const siteData = await siteBuilderAgent.buildSite(lead.id);
            const siteUrl = await deployAgent.deploySite(lead.id);
            await outreachAgent.sendOutreach(lead.id);
            generatedSites.push({ leadId: lead.id, siteUrl, siteData });
          } catch (pipelineErr) {
            console.error(`Pipeline error for lead ${lead.id}:`, pipelineErr);
          }
        }
      }

      res.json({
        success: true,
        count: newLeads.length,
        qualifiedCount: newLeads.filter((l) => !l.isDisqualified).length,
        disqualifiedCount: newLeads.filter((l) => l.isDisqualified).length,
        exhaustedWarning: activeTenant?.exhaustedWarning,
        leads: newLeads,
        sites: generatedSites
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/pipeline/run', async (req, res) => {
    const { leadId } = req.body;
    try {
      const lead = db.leads.get(leadId);
      if (!lead) return res.status(404).json({ error: 'Lead não encontrado' });

      // Run Pipeline stages sequentially with logging & error handling
      await personaAgent.analyzeLead(leadId);
      await siteBuilderAgent.buildSite(leadId);
      const siteUrl = await deployAgent.deploySite(leadId);
      const outreachMsg = await outreachAgent.sendOutreach(leadId);

      const updatedLead = db.leads.get(leadId);
      res.json({ success: true, lead: updatedLead, siteUrl, outreachMsg });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get('/api/sites/:leadId', (req, res) => {
    const site = db.sites.get(req.params.leadId);
    if (!site) return res.status(404).json({ error: 'Site não encontrado' });
    res.json(site);
  });

  app.put('/api/sites/:leadId', (req, res) => {
    const { leadId } = req.params;
    const { copy, colors, fonts, sections } = req.body;
    const site = db.sites.get(leadId);
    if (!site) return res.status(404).json({ error: 'Site não encontrado' });

    if (copy) site.copy = copy;
    if (colors) site.colors = colors;
    if (fonts) site.fonts = fonts;
    if (sections) site.sections = sections;
    site.version += 1;
    site.deployedAt = new Date().toISOString();

    db.sites.set(leadId, site);
    res.json(site);
  });

  app.post('/api/sites/:leadId/ai-section', async (req, res) => {
    const { leadId } = req.params;
    const { prompt } = req.body;
    const site = db.sites.get(leadId);
    const lead = db.leads.get(leadId);
    if (!site || !lead) return res.status(404).json({ error: 'Site ou Lead não encontrado' });

    try {
      const newSec = await generateAiSiteSection(prompt, lead.segment);
      newSec.id = `sec-${Date.now()}`;
      site.sections.push(newSec as any);
      site.version += 1;
      db.sites.set(leadId, site);
      res.json(site);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get('/api/conversations/:leadId', (req, res) => {
    const msgs = db.messages.get(req.params.leadId) || [];
    res.json(msgs);
  });

  // Webhook for Meowhats / WhatsApp Gateway incoming messages
  app.post('/api/webhooks/whatsapp', async (req, res) => {
    const { phone, message, text, senderName } = req.body;
    const incomingText = text || message || '';
    if (!phone || !incomingText) {
      return res.status(400).json({ error: 'Telefone e mensagem são obrigatórios' });
    }

    // Match lead by phone
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const allLeads = Array.from(db.leads.values());
    const lead = allLeads.find((l) => l.phone && l.phone.replace(/[^0-9]/g, '').includes(cleanPhone));

    if (lead) {
      // Process incoming message with SDR Agent
      try {
        const sdrResponse = await sdrAgent.handleLeadMessage(lead.id, incomingText);
        return res.json({ success: true, leadId: lead.id, sdrResponse });
      } catch (err: any) {
        return res.status(500).json({ error: err.message });
      }
    }

    res.json({ success: true, note: 'Mensagem recebida, mas telefone não cadastrado na base' });
  });

  app.post('/api/conversations/:leadId', async (req, res) => {
    const { leadId } = req.params;
    const { text, isHuman } = req.body;
    try {
      if (isHuman) {
        const lead = db.leads.get(leadId);
        const tenant = db.tenants.get(lead?.tenantId || '');
        const sdrMsg = {
          id: `msg-${Date.now()}-human`,
          leadId,
          tenantId: lead?.tenantId || 'tenant-1',
          role: 'sdr' as const,
          text,
          sentAt: new Date().toISOString(),
          sdrName: `${tenant?.sdrConfig.name || 'SDR'} (Intervenção Humana)`
        };
        const list = db.messages.get(leadId) || [];
        list.push(sdrMsg);
        db.messages.set(leadId, list);
        res.json(sdrMsg);
      } else {
        const sdrMsg = await sdrAgent.handleLeadMessage(leadId, text);
        res.json(sdrMsg);
      }
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put('/api/leads/:leadId/status', (req, res) => {
    const { leadId } = req.params;
    const { status, reason, notes, valueLost, saleValue } = req.body;
    const lead = db.leads.get(leadId);
    if (!lead) return res.status(404).json({ error: 'Lead não encontrado' });

    lead.pipelineStatus = status as FunnelStatus;
    if (saleValue) lead.saleValue = saleValue;
    if (status === 'lead_quente') lead.saleDate = new Date().toISOString();

    if (status === 'perdido') {
      db.lostLeads.push({
        id: `lost-${Date.now()}`,
        leadId,
        tenantId: lead.tenantId,
        reason: reason || 'outro',
        notes: notes || '',
        valueLost: valueLost || lead.saleValue || 1000,
        lostAt: new Date().toISOString()
      });
    }

    db.leads.set(leadId, lead);
    res.json(lead);
  });

  app.get('/api/learnings', (req, res) => {
    res.json(db.learnings);
  });

  app.post('/api/learnings/cycle', async (req, res) => {
    try {
      const patterns = await learnerAgent.runDailyLearningCycle(req.body.tenantId);
      res.json(patterns);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get('/api/superadmin/health', (req, res) => {
    const totalDecisions = db.decisions.length;
    const totalEvents = db.pipelineEvents.length;
    const totalLearnings = db.learnings.length;
    const lostCount = db.lostLeads.length;

    res.json({
      agents: [
        { name: 'ScraperAgent', status: 'healthy', latencyMs: 140, totalDecisions: db.decisions.filter((d) => d.agent === 'ScraperAgent').length },
        { name: 'PersonaAgent', status: 'healthy', latencyMs: 420, totalDecisions: db.decisions.filter((d) => d.agent === 'PersonaAgent').length },
        { name: 'SiteBuilderAgent', status: 'healthy', latencyMs: 680, totalDecisions: db.decisions.filter((d) => d.agent === 'SiteBuilderAgent').length },
        { name: 'DeployAgent', status: 'healthy', latencyMs: 90, totalDecisions: db.decisions.filter((d) => d.agent === 'DeployAgent').length },
        { name: 'OutreachAgent', status: 'healthy', latencyMs: 310, totalDecisions: db.decisions.filter((d) => d.agent === 'OutreachAgent').length },
        { name: 'LearnerAgent', status: 'healthy', latencyMs: 210, totalDecisions: db.decisions.filter((d) => d.agent === 'LearnerAgent').length },
        { name: 'SDRAgent', status: 'healthy', latencyMs: 350, totalDecisions: db.decisions.filter((d) => d.agent === 'SDRAgent').length }
      ],
      prompts: Array.from(db.prompts.entries()).map(([k, v]) => ({ agent: k, versions: v })),
      auditLogs: db.auditLogs,
      lostLeads: db.lostLeads,
      stats: { totalDecisions, totalEvents, totalLearnings, lostCount, estimatedLlmCostUsd: (totalDecisions * 0.002).toFixed(3) }
    });
  });

  app.put('/api/superadmin/prompts', (req, res) => {
    const { agent, promptText } = req.body;
    const current = db.prompts.get(agent) || [];
    const newVer = current.length + 1;
    const versionObj = {
      id: `p-${agent}-v${newVer}`,
      agent,
      version: newVer,
      promptText,
      active: true,
      updatedAt: new Date().toISOString()
    };
    current.forEach((p) => (p.active = false));
    current.unshift(versionObj);
    db.prompts.set(agent, current);

    db.auditLogs.unshift({
      id: `al-${Date.now()}`,
      actor: 'SuperAdmin',
      action: 'Prompt Atualizado',
      details: `Prompt do ${agent} atualizado para versão v${newVer}`,
      timestamp: new Date().toISOString()
    });

    res.json(versionObj);
  });

  app.get('/api/kpis', (req, res) => {
    const leads = Array.from(db.leads.values());
    const totalLeads = leads.length;
    const sitesDeployed = leads.filter((l) => l.siteDeployedAt).length;
    const messagedCount = leads.filter((l) => l.lastMessageAt).length;
    const hotLeads = leads.filter((l) => l.pipelineStatus === 'lead_quente').length;
    const conversionRate = messagedCount > 0 ? Number(((hotLeads / messagedCount) * 100).toFixed(1)) : 0;
    const totalSales = leads.reduce((acc, curr) => acc + (curr.saleValue || 0), 0);

    res.json({
      totalLeads,
      sitesDeployed,
      messagedCount,
      hotLeads,
      conversionRate,
      totalSales,
      learningsCount: db.learnings.length,
      averageSiteHealth: leads.length ? Math.round(leads.reduce((a, b) => a + b.siteHealthScore, 0) / leads.length) : 0
    });
  });

  // Vite Middleware in Dev
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Optav.ia Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
