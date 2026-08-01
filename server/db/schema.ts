import { pgTable, text, timestamp, boolean, integer, numeric, jsonb } from 'drizzle-orm/pg-core';

export const tenants = pgTable('tenants', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  segment: text('segment').notNull(),
  region: text('region').notNull(),
  plan: text('plan').notNull().default('pro'),
  targetQueueGoal: integer('target_queue_goal').default(300),
  minQueueThreshold: integer('min_queue_threshold').default(50),
  autoRefillEnabled: boolean('auto_refill_enabled').default(false),
  exhaustedWarning: text('exhausted_warning'),
  sdrConfig: jsonb('sdr_config').notNull(),
  whatsappConnected: boolean('whatsapp_connected').default(false),
  createdAt: timestamp('created_at').defaultNow()
});

export const leads = pgTable('leads', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  category: text('category').notNull(),
  segment: text('segment').notNull(),
  phone: text('phone').notNull(),
  email: text('email'),
  address: text('address').notNull(),
  openingHours: text('opening_hours'),
  existingSiteUrl: text('existing_site_url'),
  rating: numeric('rating'),
  reviewsCount: integer('reviews_count').default(0),
  hasWebsite: boolean('has_website').default(false),
  siteHealthScore: integer('site_health_score').default(0),
  qualificationScore: integer('qualification_score'),
  qualificationReason: text('qualification_reason'),
  isDisqualified: boolean('is_disqualified').default(false),
  disqualificationReason: text('disqualification_reason'),
  manualOverride: boolean('manual_override').default(false),
  emailSent: boolean('email_sent').default(false),
  emailSentAt: timestamp('email_sent_at'),
  reviewQuotes: text('review_quotes').array(),
  pipelineStatus: text('pipeline_status').notNull().default('aguardando'),
  pipelineStage: text('pipeline_stage').notNull().default('pending'),
  saleValue: numeric('sale_value'),
  saleDate: timestamp('sale_date'),
  siteCreatedAt: timestamp('site_created_at'),
  siteDeployedAt: timestamp('site_deployed_at'),
  siteUrl: text('site_url'),
  lastMessageAt: timestamp('last_message_at'),
  lastReplyAt: timestamp('last_reply_at'),
  reviewsSample: jsonb('reviews_sample'),
  createdAt: timestamp('created_at').defaultNow()
});

export const personas = pgTable('personas', {
  leadId: text('lead_id').primaryKey().references(() => leads.id, { onDelete: 'cascade' }),
  publicoAlvo: text('publico_alvo').notNull(),
  dores: text('dores').array(),
  tomMensagem: text('tom_mensagem').notNull(),
  keywords: text('keywords').array(),
  personaSummary: text('persona_summary').notNull(),
  recommendedColors: jsonb('recommended_colors'),
  recommendedFonts: jsonb('recommended_fonts'),
  createdAt: timestamp('created_at').defaultNow()
});

export const sites = pgTable('sites', {
  leadId: text('lead_id').primaryKey().references(() => leads.id, { onDelete: 'cascade' }),
  template: text('template').notNull(),
  provider: text('provider').default('assembly-engine'),
  prd: jsonb('prd'),
  copy: jsonb('copy').notNull(),
  colors: jsonb('colors').notNull(),
  fonts: jsonb('fonts').notNull(),
  images: jsonb('images').notNull(),
  logoUrl: text('logo_url'),
  sections: jsonb('sections').notNull(),
  faqs: jsonb('faqs'),
  deployedUrl: text('deployed_url'),
  deployedAt: timestamp('deployed_at'),
  compiledHtml: text('compiled_html'),
  visionScore: numeric('vision_score'),
  chunksCount: integer('chunks_count'),
  version: integer('version').default(1),
  history: jsonb('history'),
  createdAt: timestamp('created_at').defaultNow()
});

export const messages = pgTable('messages', {
  id: text('id').primaryKey(),
  leadId: text('lead_id').notNull().references(() => leads.id, { onDelete: 'cascade' }),
  tenantId: text('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  role: text('role').notNull(),
  text: text('text').notNull(),
  sentAt: timestamp('sent_at').defaultNow(),
  sdrName: text('sdr_name').notNull()
});

export const decisions = pgTable('decisions', {
  id: text('id').primaryKey(),
  agent: text('agent').notNull(),
  tenantId: text('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  leadId: text('lead_id').notNull(),
  context: jsonb('context'),
  decision: jsonb('decision'),
  outcome: text('outcome').notNull(),
  metrics: jsonb('metrics'),
  createdAt: timestamp('created_at').defaultNow()
});

export const learningPatterns = pgTable('learning_patterns', {
  id: text('id').primaryKey(),
  pattern: text('pattern').notNull(),
  agent: text('agent').notNull(),
  scope: text('scope').notNull().default('global'),
  segment: text('segment'),
  region: text('region'),
  confidence: numeric('confidence').notNull(),
  nExamples: integer('n_examples').notNull(),
  promptDelta: text('prompt_delta').notNull(),
  active: boolean('active').default(true),
  createdAt: timestamp('created_at').defaultNow()
});

export const lostLeads = pgTable('lost_leads', {
  id: text('id').primaryKey(),
  leadId: text('lead_id').notNull().references(() => leads.id, { onDelete: 'cascade' }),
  tenantId: text('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  reason: text('reason').notNull(),
  notes: text('notes'),
  valueLost: numeric('value_lost'),
  lostAt: timestamp('lost_at').defaultNow()
});

export const pipelineEvents = pgTable('pipeline_events', {
  id: text('id').primaryKey(),
  leadId: text('lead_id').notNull(),
  tenantId: text('tenant_id').notNull(),
  stage: text('stage').notNull(),
  event: text('event').notNull(),
  agent: text('agent').notNull(),
  output: jsonb('output'),
  error: text('error'),
  durationMs: integer('duration_ms').notNull(),
  traceId: text('trace_id').notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

export const auditLogs = pgTable('audit_logs', {
  id: text('id').primaryKey(),
  actor: text('actor').notNull(),
  action: text('action').notNull(),
  details: text('details').notNull(),
  timestamp: timestamp('timestamp').defaultNow()
});

export const agentPrompts = pgTable('agent_prompts', {
  id: text('id').primaryKey(),
  agent: text('agent').notNull(),
  version: integer('version').notNull(),
  promptText: text('prompt_text').notNull(),
  active: boolean('active').default(true),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const admins = pgTable('admins', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull().default('admin'),
  tenantId: text('tenant_id').references(() => tenants.id, { onDelete: 'set null' }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow()
});

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  adminUserId: text('admin_user_id').notNull().references(() => admins.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  refreshToken: text('refresh_token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

export const caktoEvents = pgTable('cakto_events', {
  id: text('id').primaryKey(),
  caktoEventId: text('cakto_event_id').notNull().unique(),
  tenantId: text('tenant_id').notNull(),
  eventType: text('event_type').notNull(),
  payload: jsonb('payload').notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

export const whatsmeowLidMap = pgTable('whatsmeow_lid_map', {
  lid: text('lid').primaryKey(),
  phone: text('phone').notNull(),
  createdAt: timestamp('created_at').defaultNow()
});
