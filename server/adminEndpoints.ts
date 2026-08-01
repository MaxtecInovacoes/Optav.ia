import { Router } from 'express';
import { requireAuth, requireSuperAdmin, AuthRequest } from './middleware.js';
import { db } from './db.js';
import { AdminCreateTenantRequest } from '../src/types/admin.js';

const router = Router();
router.use(requireAuth);

// POST /api/admin/tenants — Criar novo tenant (super_admin)
router.post('/tenants', requireSuperAdmin, async (req: AuthRequest, res) => {
  const { name, segment, region, sdrConfig }: AdminCreateTenantRequest = req.body;
  if (!name || !segment) {
    res.status(400).json({ error: 'Nome e segmento são obrigatórios para criar tenant.' });
    return;
  }

  const tenant = {
    id: `tenant-${Date.now()}`,
    name,
    segment,
    region: region || 'Brasil',
    plan: 'growth' as const,
    sdrConfig: sdrConfig || {
      sdrType: 'nativo' as const,
      name: 'Camila Santos',
      tone: 'informal' as const,
      rules: ['Responda cordialmente', 'Foque no agendamento de apresentação do site'],
      basePrompt: 'Você é um assistente de vendas da agência digital.'
    },
    whatsappConnected: false,
    createdAt: new Date().toISOString()
  };

  await db.createTenant(tenant);
  res.status(201).json(tenant);
});

// GET /api/admin/tenants — Listar tenants
router.get('/tenants', async (req: AuthRequest, res) => {
  if (req.admin?.role === 'super_admin') {
    const allTenants = await db.getAllTenants();
    res.json(allTenants);
  } else if (req.admin?.tenantId) {
    const tenant = await db.getTenantById(req.admin.tenantId);
    res.json(tenant ? [tenant] : []);
  } else {
    res.status(403).json({ error: 'Sem tenant vinculado para listagem.' });
  }
});

// PUT /api/admin/tenants/:id/plan — Atualizar plano
router.put('/tenants/:id/plan', async (req: AuthRequest, res) => {
  const { plan } = req.body;
  const validPlans = ['free', 'pro', 'enterprise', 'growth'] as const;
  if (!validPlans.includes(plan)) {
    res.status(400).json({ error: `Plano inválido. Use um dos seguintes: ${validPlans.join(', ')}` });
    return;
  }

  const tenant = await db.getTenantById(req.params.id);
  if (!tenant) {
    res.status(404).json({ error: 'Tenant não encontrado.' });
    return;
  }

  tenant.plan = plan;
  await db.updateTenant(tenant.id, { plan });
  res.json(tenant);
});

// GET /api/admin/stats — Dashboard stats
router.get('/stats', async (req: AuthRequest, res) => {
  const allTenants = await db.getAllTenants();
  const tenantIds = req.admin?.role === 'super_admin' ? allTenants.map(t => t.id) : (req.admin?.tenantId ? [req.admin.tenantId] : []);
  const allLeads = await db.getAllLeads();
  const tenantLeads = allLeads.filter(l => tenantIds.includes(l.tenantId));

  const byStatus: Record<string, number> = {};
  tenantLeads.forEach(l => {
    byStatus[l.pipelineStatus] = (byStatus[l.pipelineStatus] || 0) + 1;
  });

  res.json({
    totalTenants: allTenants.length,
    totalLeads: tenantLeads.length,
    byStatus,
    connectedWhatsappCount: allTenants.filter(t => t.whatsappConnected).length
  });
});

// GET /api/admin/cakto/events — Listar eventos Cakto
router.get('/cakto/events', async (req: AuthRequest, res) => {
  const events = await db.getCaktoEvents();
  res.json(events);
});

export default router;
