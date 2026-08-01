import {
  Tenant,
  Lead,
  PersonaData,
  SiteData,
  ConversationMessage,
  DecisionRecord,
  LearningPattern,
  LostLeadRecord,
  PipelineEvent,
  AuditLog,
  AgentPromptVersion
} from '../src/types/index.js';
import { AdminUser, AdminSession } from '../src/types/admin.js';
import { getPostgresPool, initPostgresTables } from './db/postgres.js';
import { logger } from './logger.js';

class IntegratedDB {
  tenants: Map<string, Tenant> = new Map();
  leads: Map<string, Lead> = new Map();
  personas: Map<string, PersonaData> = new Map();
  sites: Map<string, SiteData> = new Map();
  messages: Map<string, ConversationMessage[]> = new Map();
  decisions: DecisionRecord[] = [];
  learnings: LearningPattern[] = [];
  lostLeads: LostLeadRecord[] = [];
  pipelineEvents: PipelineEvent[] = [];
  auditLogs: AuditLog[] = [];
  prompts: Map<string, AgentPromptVersion[]> = new Map();
  admins: Map<string, AdminUser> = new Map();
  sessions: Map<string, AdminSession> = new Map();
  caktoEventsList: any[] = [];
  lidMap: Map<string, string> = new Map();

  private pgConnected = false;

  constructor() {
    this.seedInitialData();
  }

  async init(): Promise<void> {
    try {
      const ok = await initPostgresTables();
      if (ok) {
        this.pgConnected = true;
        logger.info('[DB] PostgreSQL initialized successfully. Operating in SQL persistence mode.');
        await this.syncMemoryToPg();
      } else {
        logger.info('[DB] Operating in dual memory mode.');
      }
    } catch (err) {
      logger.warn({ err }, '[DB] Postgres initialization error. Falling back to memory mode.');
    }
  }

  private async syncMemoryToPg(): Promise<void> {
    if (!this.pgConnected) return;
    try {
      const pool = getPostgresPool();
      // Sync default tenant
      for (const tenant of this.tenants.values()) {
        await pool.query(
          `INSERT INTO tenants (id, name, segment, region, plan, sdr_config, whatsapp_connected)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (id) DO NOTHING`,
          [tenant.id, tenant.name, tenant.segment, tenant.region, tenant.plan, JSON.stringify(tenant.sdrConfig), tenant.whatsappConnected]
        );
      }
      // Sync sample leads
      for (const lead of this.leads.values()) {
        await pool.query(
          `INSERT INTO leads (id, tenant_id, name, category, segment, phone, address, rating, reviews_count, has_website, site_health_score, pipeline_status, pipeline_stage, reviews_sample)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
           ON CONFLICT (id) DO NOTHING`,
          [
            lead.id, lead.tenantId, lead.name, lead.category, lead.segment, lead.phone, lead.address,
            lead.rating, lead.reviewsCount, lead.hasWebsite, lead.siteHealthScore, lead.pipelineStatus,
            lead.pipelineStage, JSON.stringify(lead.reviewsSample || [])
          ]
        );
      }
    } catch (err) {
      logger.warn({ err }, '[DB Sync] Error syncing memory seed to PostgreSQL');
    }
  }

  // Tenant methods
  async getAllTenants(): Promise<Tenant[]> {
    if (this.pgConnected) {
      try {
        const pool = getPostgresPool();
        const res = await pool.query('SELECT * FROM tenants');
        if (res.rows.length > 0) {
          return res.rows.map(r => ({
            id: r.id,
            name: r.name,
            segment: r.segment,
            region: r.region,
            plan: r.plan,
            targetQueueGoal: r.target_queue_goal,
            minQueueThreshold: r.min_queue_threshold,
            autoRefillEnabled: r.auto_refill_enabled,
            sdrConfig: typeof r.sdr_config === 'string' ? JSON.parse(r.sdr_config) : r.sdr_config,
            whatsappConnected: r.whatsapp_connected,
            createdAt: r.created_at?.toISOString ? r.created_at.toISOString() : r.created_at
          }));
        }
      } catch (err) {
        logger.error({ err }, '[DB] PostgreSQL query failed for getAllTenants');
      }
    }
    return Array.from(this.tenants.values());
  }

  async getTenantById(id: string): Promise<Tenant | undefined> {
    if (this.pgConnected) {
      try {
        const pool = getPostgresPool();
        const res = await pool.query('SELECT * FROM tenants WHERE id = $1', [id]);
        if (res.rows[0]) {
          const r = res.rows[0];
          return {
            id: r.id,
            name: r.name,
            segment: r.segment,
            region: r.region,
            plan: r.plan,
            targetQueueGoal: r.target_queue_goal,
            minQueueThreshold: r.min_queue_threshold,
            autoRefillEnabled: r.auto_refill_enabled,
            sdrConfig: typeof r.sdr_config === 'string' ? JSON.parse(r.sdr_config) : r.sdr_config,
            whatsappConnected: r.whatsapp_connected,
            createdAt: r.created_at?.toISOString ? r.created_at.toISOString() : r.created_at
          };
        }
      } catch (err) {
        logger.error({ err }, '[DB] PostgreSQL query failed for getTenantById');
      }
    }
    return this.tenants.get(id);
  }

  async createTenant(tenant: Tenant): Promise<Tenant> {
    this.tenants.set(tenant.id, tenant);
    if (this.pgConnected) {
      try {
        const pool = getPostgresPool();
        await pool.query(
          `INSERT INTO tenants (id, name, segment, region, plan, target_queue_goal, min_queue_threshold, auto_refill_enabled, sdr_config, whatsapp_connected)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [
            tenant.id, tenant.name, tenant.segment, tenant.region, tenant.plan,
            tenant.targetQueueGoal || 300, tenant.minQueueThreshold || 50, tenant.autoRefillEnabled || false,
            JSON.stringify(tenant.sdrConfig), tenant.whatsappConnected
          ]
        );
      } catch (err) {
        logger.error({ err }, '[DB] PostgreSQL insert failed for createTenant');
      }
    }
    return tenant;
  }

  async updateTenant(id: string, updates: Partial<Tenant>): Promise<Tenant | undefined> {
    const existing = await this.getTenantById(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates };
    this.tenants.set(id, updated);
    if (this.pgConnected) {
      try {
        const pool = getPostgresPool();
        await pool.query(
          `UPDATE tenants SET name = $1, plan = $2, target_queue_goal = $3, min_queue_threshold = $4, sdr_config = $5, whatsapp_connected = $6 WHERE id = $7`,
          [updated.name, updated.plan, updated.targetQueueGoal, updated.minQueueThreshold, JSON.stringify(updated.sdrConfig), updated.whatsappConnected, id]
        );
      } catch (err) {
        logger.error({ err }, '[DB] PostgreSQL update failed for updateTenant');
      }
    }
    return updated;
  }

  async updateTenantPlanByEmail(email: string, plan: 'free' | 'pro' | 'enterprise' | 'growth'): Promise<void> {
    for (const tenant of this.tenants.values()) {
      if (tenant.name.toLowerCase().includes(email.toLowerCase()) || email.includes(tenant.id)) {
        tenant.plan = plan;
        this.tenants.set(tenant.id, tenant);
      }
    }
    if (this.pgConnected) {
      try {
        const pool = getPostgresPool();
        await pool.query('UPDATE tenants SET plan = $1 WHERE name ILIKE $2', [plan, `%${email}%`]);
      } catch (err) {
        logger.error({ err }, '[DB] PostgreSQL update failed for updateTenantPlanByEmail');
      }
    }
  }

  // Lead methods
  async getAllLeads(tenantId?: string): Promise<Lead[]> {
    if (this.pgConnected) {
      try {
        const pool = getPostgresPool();
        const res = tenantId
          ? await pool.query('SELECT * FROM leads WHERE tenant_id = $1 ORDER BY created_at DESC', [tenantId])
          : await pool.query('SELECT * FROM leads ORDER BY created_at DESC');
        if (res.rows.length > 0) {
          return res.rows.map(r => ({
            id: r.id,
            tenantId: r.tenant_id,
            name: r.name,
            category: r.category,
            segment: r.segment,
            phone: r.phone,
            email: r.email,
            address: r.address,
            openingHours: r.opening_hours,
            existingSiteUrl: r.existing_site_url,
            rating: r.rating ? Number(r.rating) : undefined,
            reviewsCount: r.reviews_count,
            hasWebsite: r.has_website,
            siteHealthScore: r.site_health_score,
            qualificationScore: r.qualification_score,
            qualificationReason: r.qualification_reason,
            isDisqualified: r.is_disqualified,
            disqualificationReason: r.disqualification_reason,
            manualOverride: r.manual_override,
            emailSent: r.email_sent,
            pipelineStatus: r.pipeline_status,
            pipelineStage: r.pipeline_stage,
            saleValue: r.sale_value ? Number(r.sale_value) : undefined,
            siteUrl: r.site_url,
            reviewsSample: typeof r.reviews_sample === 'string' ? JSON.parse(r.reviews_sample) : r.reviews_sample || [],
            createdAt: r.created_at?.toISOString ? r.created_at.toISOString() : r.created_at
          }));
        }
      } catch (err) {
        logger.error({ err }, '[DB] PostgreSQL query failed for getAllLeads');
      }
    }

    const all = Array.from(this.leads.values());
    if (tenantId) {
      return all.filter(l => l.tenantId === tenantId);
    }
    return all;
  }

  async getLeadById(id: string): Promise<Lead | undefined> {
    if (this.pgConnected) {
      try {
        const pool = getPostgresPool();
        const res = await pool.query('SELECT * FROM leads WHERE id = $1', [id]);
        if (res.rows[0]) {
          const r = res.rows[0];
          return {
            id: r.id,
            tenantId: r.tenant_id,
            name: r.name,
            category: r.category,
            segment: r.segment,
            phone: r.phone,
            email: r.email,
            address: r.address,
            openingHours: r.opening_hours,
            existingSiteUrl: r.existing_site_url,
            rating: r.rating ? Number(r.rating) : undefined,
            reviewsCount: r.reviews_count,
            hasWebsite: r.has_website,
            siteHealthScore: r.site_health_score,
            qualificationScore: r.qualification_score,
            pipelineStatus: r.pipeline_status,
            pipelineStage: r.pipeline_stage,
            saleValue: r.sale_value ? Number(r.sale_value) : undefined,
            siteUrl: r.site_url,
            reviewsSample: typeof r.reviews_sample === 'string' ? JSON.parse(r.reviews_sample) : r.reviews_sample || [],
            createdAt: r.created_at?.toISOString ? r.created_at.toISOString() : r.created_at
          };
        }
      } catch (err) {
        logger.error({ err }, '[DB] PostgreSQL query failed for getLeadById');
      }
    }
    return this.leads.get(id);
  }

  async getLeadByPhone(tenantId: string, phone: string): Promise<Lead | undefined> {
    const cleanPhone = phone.replace(/\D/g, '');
    const all = await this.getAllLeads(tenantId);
    return all.find(l => l.phone.replace(/\D/g, '').includes(cleanPhone) || cleanPhone.includes(l.phone.replace(/\D/g, '')));
  }

  async saveLead(lead: Lead): Promise<Lead> {
    this.leads.set(lead.id, lead);
    if (this.pgConnected) {
      try {
        const pool = getPostgresPool();
        await pool.query(
          `INSERT INTO leads (id, tenant_id, name, category, segment, phone, address, rating, reviews_count, has_website, site_health_score, pipeline_status, pipeline_stage, reviews_sample)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
           ON CONFLICT (id) DO UPDATE SET
             pipeline_status = EXCLUDED.pipeline_status,
             pipeline_stage = EXCLUDED.pipeline_stage,
             site_url = EXCLUDED.site_url`,
          [
            lead.id, lead.tenantId, lead.name, lead.category, lead.segment, lead.phone, lead.address,
            lead.rating, lead.reviewsCount, lead.hasWebsite, lead.siteHealthScore, lead.pipelineStatus,
            lead.pipelineStage, JSON.stringify(lead.reviewsSample || [])
          ]
        );
      } catch (err) {
        logger.error({ err }, '[DB] PostgreSQL save failed for saveLead');
      }
    }
    return lead;
  }

  // Persona methods
  async savePersona(persona: PersonaData): Promise<PersonaData> {
    this.personas.set(persona.leadId, persona);
    return persona;
  }

  async getPersonaByLeadId(leadId: string): Promise<PersonaData | undefined> {
    return this.personas.get(leadId);
  }

  // Site methods
  async saveSite(site: SiteData): Promise<SiteData> {
    this.sites.set(site.leadId, site);
    return site;
  }

  async getSiteByLeadId(leadId: string): Promise<SiteData | undefined> {
    return this.sites.get(leadId);
  }

  // Message methods
  async getMessagesByLeadId(leadId: string): Promise<ConversationMessage[]> {
    return this.messages.get(leadId) || [];
  }

  async addMessage(msg: ConversationMessage): Promise<ConversationMessage> {
    const list = this.messages.get(msg.leadId) || [];
    list.push(msg);
    this.messages.set(msg.leadId, list);
    return msg;
  }

  // Admin and Auth methods
  async getAdminByEmail(email: string): Promise<AdminUser | undefined> {
    for (const adm of this.admins.values()) {
      if (adm.email === email) return adm;
    }
    if (this.pgConnected) {
      try {
        const pool = getPostgresPool();
        const res = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
        if (res.rows[0]) {
          const r = res.rows[0];
          return {
            id: r.id,
            email: r.email,
            name: r.name,
            passwordHash: r.password_hash,
            role: r.role,
            tenantId: r.tenant_id,
            isActive: r.is_active,
            createdAt: r.created_at?.toISOString ? r.created_at.toISOString() : r.created_at
          };
        }
      } catch (err) {
        logger.error({ err }, '[DB] PostgreSQL query failed for getAdminByEmail');
      }
    }
    return undefined;
  }

  async getAdminById(id: string): Promise<AdminUser | undefined> {
    if (this.admins.has(id)) return this.admins.get(id);
    if (this.pgConnected) {
      try {
        const pool = getPostgresPool();
        const res = await pool.query('SELECT * FROM admins WHERE id = $1', [id]);
        if (res.rows[0]) {
          const r = res.rows[0];
          return {
            id: r.id,
            email: r.email,
            name: r.name,
            passwordHash: r.password_hash,
            role: r.role,
            tenantId: r.tenant_id,
            isActive: r.is_active,
            createdAt: r.created_at?.toISOString ? r.created_at.toISOString() : r.created_at
          };
        }
      } catch (err) {
        logger.error({ err }, '[DB] PostgreSQL query failed for getAdminById');
      }
    }
    return undefined;
  }

  async createAdmin(admin: AdminUser): Promise<AdminUser> {
    this.admins.set(admin.id, admin);
    if (this.pgConnected) {
      try {
        const pool = getPostgresPool();
        await pool.query(
          `INSERT INTO admins (id, email, name, password_hash, role, tenant_id, is_active)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [admin.id, admin.email, admin.name, admin.passwordHash, admin.role, admin.tenantId || 'tenant-1', admin.isActive]
        );
      } catch (err) {
        logger.error({ err }, '[DB] PostgreSQL insert failed for createAdmin');
      }
    }
    return admin;
  }

  async saveSession(session: AdminSession): Promise<AdminSession> {
    this.sessions.set(session.token, session);
    return session;
  }

  async getSessionByRefreshToken(refreshToken: string): Promise<AdminSession | undefined> {
    for (const sess of this.sessions.values()) {
      if (sess.refreshToken === refreshToken) return sess;
    }
    return undefined;
  }

  async deleteSessionByToken(token: string): Promise<void> {
    this.sessions.delete(token);
  }

  // Cakto Event Tracking
  async saveCaktoEvent(eventId: string, tenantId: string, eventType: string, payload: any): Promise<boolean> {
    if (this.caktoEventsList.some(e => e.caktoEventId === eventId)) {
      return false;
    }
    this.caktoEventsList.push({ id: `cakto-${Date.now()}`, caktoEventId: eventId, tenantId, eventType, payload, createdAt: new Date().toISOString() });
    if (this.pgConnected) {
      try {
        const pool = getPostgresPool();
        const res = await pool.query(
          `INSERT INTO cakto_events (id, cakto_event_id, tenant_id, event_type, payload)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (cakto_event_id) DO NOTHING
           RETURNING id`,
          [`cakto-${Date.now()}`, eventId, tenantId, eventType, JSON.stringify(payload)]
        );
        return res.rows.length > 0;
      } catch (err) {
        logger.error({ err }, '[DB] PostgreSQL insert failed for saveCaktoEvent');
      }
    }
    return true;
  }

  async getCaktoEvents(): Promise<any[]> {
    return this.caktoEventsList;
  }

  // WhatsApp LID map
  async getPhoneFromLid(lid: string): Promise<string | undefined> {
    return this.lidMap.get(lid);
  }

  async setLidPhoneMapping(lid: string, phone: string): Promise<void> {
    this.lidMap.set(lid, phone);
  }

  private seedInitialData() {
    const defaultTenant: Tenant = {
      id: 'tenant-1',
      name: 'Agência Digital Elite',
      segment: 'restaurante',
      region: 'São Paulo, SP',
      plan: 'pro',
      targetQueueGoal: 300,
      minQueueThreshold: 50,
      sdrConfig: {
        sdrType: 'custom',
        name: 'Camila Santos',
        tone: 'informal',
        rules: ['Mencione o nome do estabelecimento', 'Destaque o design moderno', 'Responda sem gírias pesadas'],
        basePrompt: 'Você é Camila, especialista em presença digital para gastronomia.'
      },
      whatsappConnected: true,
      createdAt: new Date().toISOString()
    };
    this.tenants.set(defaultTenant.id, defaultTenant);

    const sampleLeads: Partial<Lead>[] = [
      {
        id: 'lead-101',
        tenantId: 'tenant-1',
        name: 'Cantina Bella Italia',
        category: 'Restaurante Italiano',
        segment: 'restaurante',
        phone: '+55 11 98765-4321',
        address: 'Rua Augusta, 1420 - Consolação, São Paulo - SP',
        rating: 4.6,
        reviewsCount: 184,
        hasWebsite: true,
        siteHealthScore: 32,
        pipelineStatus: 'lead_quente',
        pipelineStage: 'completed',
        saleValue: 1800,
        siteUrl: 'https://cantina-bella-italia.optav.ia',
        siteCreatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        siteDeployedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        lastMessageAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        lastReplyAt: new Date(Date.now() - 3600000).toISOString(),
        reviewsSample: [
          { author: 'Carlos M.', text: 'Massa artesanal excelente, mas o cardápio no Google está desatualizado!', rating: 5, date: 'há 2 dias' },
          { author: 'Fernanda R.', text: 'Comida boa, falta um site fácil para fazer reservas no fds.', rating: 4, date: 'há 1 semana' }
        ],
        createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
      },
      {
        id: 'lead-102',
        tenantId: 'tenant-1',
        name: 'Clínica OdontoSorriso',
        category: 'Clínica Odontológica',
        segment: 'clinica',
        phone: '+55 11 97123-8899',
        address: 'Av. Paulista, 2000 - Bela Vista, São Paulo - SP',
        rating: 4.8,
        reviewsCount: 92,
        hasWebsite: false,
        siteHealthScore: 0,
        pipelineStatus: 'followup_1',
        pipelineStage: 'messaged',
        siteUrl: 'https://odontosorriso-paulista.optav.ia',
        siteCreatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        siteDeployedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        lastMessageAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        reviewsSample: [
          { author: 'Juliana P.', text: 'Atendimento impecável! Queria ter agendado online antes de ir.', rating: 5, date: 'há 3 dias' }
        ],
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
      }
    ];

    sampleLeads.forEach((l) => this.leads.set(l.id!, l as Lead));

    this.messages.set('lead-101', [
      {
        id: 'm-1',
        leadId: 'lead-101',
        tenantId: 'tenant-1',
        role: 'sdr',
        text: 'Olá! Sou a Camila da Agência Digital Elite. Notamos que a Cantina Bella Italia tem 4.6 estrelas no Google! Criamos uma prévia de um site moderno com reserva online: https://cantina-bella-italia.optav.ia. O que achou?',
        sentAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        sdrName: 'Camila Santos'
      }
    ]);
  }
}

export const db = new IntegratedDB();
