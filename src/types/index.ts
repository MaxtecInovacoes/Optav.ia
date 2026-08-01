export type SegmentType = 'restaurante' | 'clinica' | 'oficina' | 'servicos' | 'geral';

export type FunnelStatus = 'aguardando' | 'followup_1' | 'followup_2' | 'lead_frio' | 'lead_quente' | 'perdido';

export type PipelineStage = 'pending' | 'scraped' | 'persona_done' | 'site_generated' | 'deployed' | 'messaged' | 'completed' | 'failed';

export interface Tenant {
  id: string;
  name: string;
  segment: SegmentType;
  region: string;
  plan: 'pro' | 'enterprise' | 'growth';
  targetQueueGoal?: number; // e.g. 300
  minQueueThreshold?: number; // e.g. 50
  autoRefillEnabled?: boolean;
  exhaustedWarning?: string;
  sdrConfig: {
    sdrType: 'nativo' | 'custom';
    name: string; // Customizable SDR name (e.g. Lucas, Gabriel, Julia)
    tone: 'formal' | 'informal' | 'descontraido' | 'tecnico';
    rules: string[];
    basePrompt: string;
  };
  whatsappConnected: boolean;
  createdAt: string;
}

export interface ReviewSample {
  author: string;
  text: string;
  rating: number;
  date: string;
}

export interface Lead {
  id: string;
  tenantId: string;
  name: string;
  category: string;
  segment: SegmentType;
  phone: string;
  email?: string;
  address: string;
  openingHours?: string; // e.g. "Aberto 24 horas", "Fechado"
  existingSiteUrl?: string; // e.g. "http://desentupidorastrobel.com.br"
  rating: number;
  reviewsCount: number;
  hasWebsite: boolean;
  siteHealthScore: number; // 0-100 (<50 needs new site)
  qualificationScore?: number; // 0-100 score calculated by Qualifier
  qualificationReason?: string;
  isDisqualified?: boolean;
  disqualificationReason?: string; // e.g. "Já possui site funcional", "Grande marca/franquia"
  manualOverride?: boolean; // User manually approved from Disqualified pool
  emailSent?: boolean;
  emailSentAt?: string;
  reviewQuotes?: string[]; // e.g. "Recomendo para quem busca desentupidora confiável em Curitiba!"
  pipelineStatus: FunnelStatus;
  pipelineStage: PipelineStage;
  saleValue?: number;
  saleDate?: string;
  siteCreatedAt?: string;
  siteDeployedAt?: string;
  siteUrl?: string;
  lastMessageAt?: string;
  lastReplyAt?: string;
  reviewsSample: ReviewSample[];
  createdAt: string;
}

export interface PersonaData {
  leadId: string;
  publicoAlvo: string;
  dores: string[];
  tomMensagem: string;
  keywords: string[];
  personaSummary: string;
  recommendedColors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  recommendedFonts: {
    display: string;
    body: string;
  };
}

export interface SiteSection {
  id: string;
  type: 'hero' | 'about' | 'services' | 'testimonials' | 'cta' | 'gallery' | 'contact' | 'custom';
  title: string;
  subtitle?: string;
  content?: string;
  items?: Array<{ title: string; description: string; price?: string; icon?: string; image?: string }>;
}

export interface SiteData {
  leadId: string;
  template: SegmentType;
  copy: {
    heroTitle: string;
    heroSubtitle: string;
    aboutText: string;
    ctaText: string;
    guaranteeText: string;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  fonts: {
    display: string;
    body: string;
  };
  images: {
    hero: string;
    about: string;
    gallery: string[];
  };
  logoUrl?: string;
  sections: SiteSection[];
  deployedUrl?: string;
  deployedAt?: string;
  version: number;
  history?: Array<{ timestamp: string; note: string }>;
}

export interface ConversationMessage {
  id: string;
  leadId: string;
  tenantId: string;
  role: 'sdr' | 'lead' | 'human';
  text: string;
  sentAt: string;
  sdrName: string;
}

export interface DecisionRecord {
  id: string;
  agent: string;
  tenantId: string;
  leadId: string;
  context: any;
  decision: any;
  outcome: 'success' | 'fail' | 'partial';
  metrics: Record<string, any>;
  createdAt: string;
}

export interface LearningPattern {
  id: string;
  pattern: string;
  agent: string;
  scope: 'global' | 'segment' | 'region';
  segment?: SegmentType;
  region?: string;
  confidence: number; // 0 - 1
  nExamples: number;
  promptDelta: string;
  active: boolean;
  createdAt: string;
}

export interface LostLeadRecord {
  id: string;
  leadId: string;
  tenantId: string;
  reason: 'preço' | 'timing' | 'concorrente' | 'sem_interesse' | 'outro';
  notes: string;
  valueLost?: number;
  lostAt: string;
}

export interface PipelineEvent {
  id: string;
  leadId: string;
  tenantId: string;
  stage: string;
  event: 'started' | 'completed' | 'failed' | 'retried';
  agent: string;
  output?: any;
  error?: string;
  durationMs: number;
  traceId: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actor: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface AgentPromptVersion {
  id: string;
  agent: string;
  version: number;
  promptText: string;
  active: boolean;
  updatedAt: string;
}
