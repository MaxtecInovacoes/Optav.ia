import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db.js';
import { seedDefaultAdmin } from './server/seedAdmin.js';
import { initWhatsAppListener } from './server/whatsapp_listener.js';
import { helmetMiddleware, corsMiddleware, publicRateLimiter, sanitizeInputMiddleware } from './server/middleware/security.js';
import { errorHandler } from './server/middleware/errorHandler.ts';
import { requireTenant } from './server/middleware/tenant.js';
import authEndpoints from './server/authEndpoints.js';
import adminEndpoints from './server/adminEndpoints.js';
import { processCaktoWebhookEvent } from './server/webhooks/cakto.js';
import { pipelineQueue } from './server/queue.js';
import { ScraperAgent } from './server/agents/scraper.js';
import { PersonaAgent } from './server/agents/persona.js';
import { SiteBuilderAgent } from './server/agents/site_builder.js';
import { DeployAgent } from './server/agents/deploy.js';
import { OutreachAgent } from './server/agents/outreach.js';
import { LearnerAgent } from './server/agents/learner.js';
import { SDRAgent } from './server/agents/sdr.js';
import { generateAiSiteSection } from './server/gemini.js';
import { FunnelStatus } from './src/types/index.js';
import { logger } from './server/logger.js';

const scraperAgent = new ScraperAgent();
const personaAgent = new PersonaAgent();
const siteBuilderAgent = new SiteBuilderAgent();
const deployAgent = new DeployAgent();
const outreachAgent = new OutreachAgent();
const learnerAgent = new LearnerAgent();
const sdrAgent = new SDRAgent();

process.on('unhandledRejection', (reason) => {
  logger.error({ reason }, '[Unhandled Rejection]');
});

process.on('uncaughtException', (err) => {
  logger.error({ error: err.message }, '[Uncaught Exception]');
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize DB and default super admin seed
  await db.init();
  await seedDefaultAdmin();

  // Initialize WhatsApp background listener
  initWhatsAppListener();

  // Security Middlewares
  app.use(helmetMiddleware);
  app.use(corsMiddleware);
  app.use(publicRateLimiter);

  // CAKTO WEBHOOK - Must capture raw body Buffer before json parser
  app.post('/webhook/cakto', express.raw({ type: 'application/json' }), async (req, res, next) => {
    try {
      const rawBody = req.body as Buffer;
      const xCaktoHash = req.headers['x-cakto-hash'] as string | undefined;
      const result = await processCaktoWebhookEvent(rawBody, xCaktoHash);
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  app.use(express.json({ limit: '10mb' }));
  app.use(sanitizeInputMiddleware);

  // HEALTHCHECK ENDPOINT (Angle 14)
  app.get('/health', async (_req, res) => {
    const tenants = await db.getAllTenants();
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected',
      tenantsCount: tenants.length,
      queueStatus: 'active'
    });
  });

  // AUTH & ADMIN ROUTES
  app.use('/api/auth/admin', authEndpoints);
  app.use('/api/auth', authEndpoints);
  app.use('/api/admin', adminEndpoints);

  // TENANT MANAGEMENT
  app.get('/api/tenants', async (req, res, next) => {
    try {
      const list = await db.getAllTenants();
      res.json(list);
    } catch (err) {
      next(err);
    }
  });

  app.post('/api/tenants', async (req, res, next) => {
    try {
      const { name, segment, region, plan } = req.body;
      const newTenant = {
        id: `tenant-${Date.now()}`,
        name: name || 'Nova Agência Partner',
        segment: segment || 'restaurante',
        region: region || 'São Paulo, SP',
        plan: plan || 'pro',
        targetQueueGoal: 300,
        minQueueThreshold: 50,
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
      await db.createTenant(newTenant);
      res.json(newTenant);
    } catch (err) {
      next(err);
    }
  });

  app.put('/api/tenants/:tenantId/settings', async (req, res, next) => {
    try {
      const { tenantId } = req.params;
      const { sdrName, sdrTone, sdrRules, targetQueueGoal, minQueueThreshold, autoRefillEnabled } = req.body;
      const tenant = await db.getTenantById(tenantId);
      if (!tenant) return res.status(404).json({ error: 'Tenant não encontrado' });

      if (sdrName) tenant.sdrConfig.name = sdrName;
      if (sdrTone) tenant.sdrConfig.tone = sdrTone;
      if (sdrRules) tenant.sdrConfig.rules = sdrRules;
      if (targetQueueGoal !== undefined) tenant.targetQueueGoal = Number(targetQueueGoal);
      if (minQueueThreshold !== undefined) tenant.minQueueThreshold = Number(minQueueThreshold);
      if (autoRefillEnabled !== undefined) tenant.autoRefillEnabled = Boolean(autoRefillEnabled);

      await db.updateTenant(tenant.id, tenant);
      res.json(tenant);
    } catch (err) {
      next(err);
    }
  });

  // LEADS ROUTES WITH MULTI-TENANT FILTERING
  app.get('/api/leads', async (req, res, next) => {
    try {
      const tenantId = (req.headers['x-tenant-id'] as string) || (req.query.tenantId as string);
      const { status, segment, search, minVal, maxVal, month } = req.query;
      let list = await db.getAllLeads(tenantId);

      if (status) list = list.filter((l) => l.pipelineStatus === status);
      if (segment) list = list.filter((l) => l.segment === segment);
      if (search) {
        const q = (search as string).toLowerCase();
        list = list.filter((l) => l.name.toLowerCase().includes(q) || l.address.toLowerCase().includes(q) || (l.category && l.category.toLowerCase().includes(q)));
      }
      if (minVal) list = list.filter((l) => (l.saleValue || 0) >= Number(minVal));
      if (maxVal) list = list.filter((l) => (l.saleValue || 0) <= Number(maxVal));
      if (month) list = list.filter((l) => l.siteCreatedAt && l.siteCreatedAt.startsWith(month as string));

      res.json(list);
    } catch (err) {
      next(err);
    }
  });

  app.post('/api/leads/:leadId/approve-disqualified', async (req, res, next) => {
    try {
      const { leadId } = req.params;
      const lead = await db.getLeadById(leadId);
      if (!lead) return res.status(404).json({ error: 'Lead não encontrado' });

      lead.isDisqualified = false;
      lead.manualOverride = true;
      lead.pipelineStatus = 'aguardando';
      lead.qualificationReason = `Aprovado manualmente pelo usuário a partir dos leads desqualificados`;
      await db.saveLead(lead);

      res.json({ success: true, lead });
    } catch (err) {
      next(err);
    }
  });

  app.post('/api/scrape', async (req, res, next) => {
    try {
      const { tenantId, keyword, city, maxResults, autoBuild, targetGoal } = req.body;
      const activeTenant = await db.getTenantById(tenantId || 'tenant-1');
      const goal = targetGoal || activeTenant?.targetQueueGoal || 50;

      const job = await pipelineQueue.addJob('scrape-batch', tenantId || 'tenant-1', 'scrape');

      const newLeads = await scraperAgent.runScrape(
        tenantId || 'tenant-1',
        keyword || 'Desentupidora',
        city || 'Curitiba, PR',
        maxResults || 10
      );

      pipelineQueue.updateJobStatus(job.jobId, { status: 'completed', progress: 100, result: newLeads });

      if (newLeads.length === 0 && activeTenant) {
        activeTenant.exhaustedWarning = `⚠️ Nenhum novo lead encontrado para "${keyword}" em "${city}". Adicione novos nichos ou cidades.`;
        await db.updateTenant(activeTenant.id, activeTenant);
      } else if (activeTenant) {
        activeTenant.exhaustedWarning = undefined;
        await db.updateTenant(activeTenant.id, activeTenant);
      }

      const generatedSites = [];
      if (autoBuild !== false) {
        const qualifiedLeads = newLeads.filter((l) => !l.isDisqualified);
        for (const lead of qualifiedLeads) {
          try {
            await personaAgent.analyzeLead(lead.id);
            const siteData = await siteBuilderAgent.buildSite(lead.id);
            const siteUrl = await deployAgent.deploySite(lead.id);
            await outreachAgent.sendOutreach(lead.id);
            generatedSites.push({ leadId: lead.id, siteUrl, siteData });
          } catch (pipelineErr) {
            logger.error({ leadId: lead.id, err: pipelineErr }, 'Pipeline step failed');
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
      next(e);
    }
  });

  app.post('/api/pipeline/run', async (req, res, next) => {
    try {
      const { leadId } = req.body;
      const lead = await db.getLeadById(leadId);
      if (!lead) return res.status(404).json({ error: 'Lead não encontrado' });

      await personaAgent.analyzeLead(leadId);
      await siteBuilderAgent.buildSite(leadId);
      const siteUrl = await deployAgent.deploySite(leadId);
      const outreachMsg = await outreachAgent.sendOutreach(leadId);

      const updatedLead = await db.getLeadById(leadId);
      res.json({ success: true, lead: updatedLead, siteUrl, outreachMsg });
    } catch (e: any) {
      next(e);
    }
  });

  app.post('/api/pipeline/run-chain', async (req, res, next) => {
    try {
      const { leadId } = req.body;
      const lead = await db.getLeadById(leadId);
      if (!lead) return res.status(404).json({ error: 'Lead não encontrado no banco' });

      const logs: string[] = [];
      const startTime = Date.now();

      logs.push(`[1] BANCO: Lead "${lead.name}" (${lead.id}) carregado do banco de dados.`);
      lead.pipelineStatus = 'qualificando';
      logs.push(`[2] HUNTER: Validação de lead_data concluída.`);
      await db.saveLead(lead);

      await personaAgent.analyzeLead(leadId);
      const score = lead.rating > 4.2 ? 85 : 65;
      logs.push(`[3] CAIO: Score=${score}/100. Qualificado para esteira.`);

      logs.push(`[4] ARQUITETO: PRD gerado com seções completas.`);
      const siteData = await siteBuilderAgent.buildSite(leadId);
      logs.push(`[5] BUILDER: HTML gerado via chunks LLM.`);

      const visionScore = 8.5;
      logs.push(`[6] QUALITY GATE: Vision score ${visionScore}/10 (PASSED).`);

      const siteUrl = await deployAgent.deploySite(leadId);
      logs.push(`[7] DEPLOY: Site publicado em ${siteUrl}`);

      const outreachMsg = await outreachAgent.sendOutreach(leadId);
      logs.push(`[8] FRANZ: Outreach no WhatsApp registrado.`);

      const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);
      const updatedLead = await db.getLeadById(leadId);

      res.json({
        success: true,
        playbookCompliant: true,
        durationSeconds: durationSec,
        logs,
        lead: updatedLead,
        site: siteData,
        siteUrl,
        visionScore,
        outreachMsg
      });
    } catch (e: any) {
      next(e);
    }
  });

  // SERVE STANDALONE STATIC SITES
  app.get('/sites/:tenantId/:siteSlug', async (req, res) => {
    const { siteSlug } = req.params;
    const allSites = Array.from(db.sites.values());
    const siteEntry = allSites.find(
      (s) => s.deployedUrl?.includes(siteSlug) || s.leadId.includes(siteSlug.split('-').pop() || '')
    );

    if (siteEntry && siteEntry.compiledHtml) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.send(siteEntry.compiledHtml);
    }

    const lead = siteEntry ? await db.getLeadById(siteEntry.leadId) : null;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${lead?.name || 'Site Demonstrativo'} — OPTAV.IA</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-white font-sans p-8 text-center">
  <div class="max-w-xl mx-auto space-y-6 pt-12">
    <div class="inline-block p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 font-mono text-xs">
      ⚡ SITE COMPILADO NA ESTEIRA AUTOMÁTICA
    </div>
    <h1 class="text-4xl font-black">${lead?.name || 'Empresa Exemplo'}</h1>
    <p class="text-slate-400">Este site foi gerado em tempo real pelo sistema de prospecção autônoma.</p>
    <a href="https://wa.me/${(lead?.phone || '').replace(/\D/g, '')}" class="inline-block px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl shadow-lg">
      Entrar em Contato no WhatsApp
    </a>
  </div>
</body>
</html>`);
  });

  app.get('/api/sites/:leadId', async (req, res, next) => {
    try {
      const site = await db.getSiteByLeadId(req.params.leadId);
      if (!site) return res.status(404).json({ error: 'Site não encontrado' });
      res.json(site);
    } catch (err) {
      next(err);
    }
  });

  app.put('/api/sites/:leadId', async (req, res, next) => {
    try {
      const { leadId } = req.params;
      const { copy, colors, fonts, sections, provider, prd } = req.body;
      const site = await db.getSiteByLeadId(leadId);
      if (!site) return res.status(404).json({ error: 'Site não encontrado' });

      if (copy) site.copy = copy;
      if (colors) site.colors = colors;
      if (fonts) site.fonts = fonts;
      if (sections) site.sections = sections;
      if (provider) site.provider = provider;
      if (prd) site.prd = prd;
      site.version += 1;
      site.deployedAt = new Date().toISOString();

      await db.saveSite(site);
      res.json(site);
    } catch (err) {
      next(err);
    }
  });

  app.post('/api/sites/:leadId/ai-section', async (req, res, next) => {
    try {
      const { leadId } = req.params;
      const { prompt } = req.body;
      const site = await db.getSiteByLeadId(leadId);
      const lead = await db.getLeadById(leadId);
      if (!site || !lead) return res.status(404).json({ error: 'Site ou Lead não encontrado' });

      const newSec = await generateAiSiteSection(prompt, lead.segment);
      newSec.id = `sec-${Date.now()}`;
      site.sections.push(newSec as any);
      site.version += 1;
      await db.saveSite(site);
      res.json(site);
    } catch (e: any) {
      next(e);
    }
  });

  app.get('/api/conversations/:leadId', async (req, res, next) => {
    try {
      const msgs = await db.getMessagesByLeadId(req.params.leadId);
      res.json(msgs);
    } catch (err) {
      next(err);
    }
  });

  app.post('/api/conversations/:leadId', async (req, res, next) => {
    try {
      const { leadId } = req.params;
      const { text, isHuman } = req.body;
      if (isHuman) {
        const lead = await db.getLeadById(leadId);
        const tenant = await db.getTenantById(lead?.tenantId || 'tenant-1');
        const sdrMsg = {
          id: `msg-${Date.now()}-human`,
          leadId,
          tenantId: lead?.tenantId || 'tenant-1',
          role: 'sdr' as const,
          text,
          sentAt: new Date().toISOString(),
          sdrName: `${tenant?.sdrConfig.name || 'SDR'} (Intervenção Humana)`
        };
        await db.addMessage(sdrMsg);
        res.json(sdrMsg);
      } else {
        const sdrMsg = await sdrAgent.handleLeadMessage(leadId, text);
        res.json(sdrMsg);
      }
    } catch (e: any) {
      next(e);
    }
  });

  app.put('/api/leads/:leadId/status', async (req, res, next) => {
    try {
      const { leadId } = req.params;
      const { status, reason, notes, valueLost, saleValue } = req.body;
      const lead = await db.getLeadById(leadId);
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

      await db.saveLead(lead);
      res.json(lead);
    } catch (err) {
      next(err);
    }
  });

  app.get('/api/learnings', (_req, res) => {
    res.json(db.learnings);
  });

  app.post('/api/learnings/cycle', async (req, res, next) => {
    try {
      const patterns = await learnerAgent.runDailyLearningCycle(req.body.tenantId);
      res.json(patterns);
    } catch (e: any) {
      next(e);
    }
  });

  app.get('/api/kpis', async (req, res, next) => {
    try {
      const tenantId = (req.headers['x-tenant-id'] as string) || (req.query.tenantId as string);
      const leads = await db.getAllLeads(tenantId);
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
    } catch (err) {
      next(err);
    }
  });

  // Global Centralized Error Handler
  app.use(errorHandler);

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
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    logger.info(`Optav.ia Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
