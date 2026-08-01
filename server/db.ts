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

class InMemoryDB {
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
  users: Map<string, any> = new Map();

  constructor() {
    this.seedInitialData();
  }

  public clearAllMockData() {
    this.leads.clear();
    this.personas.clear();
    this.sites.clear();
    this.messages.clear();
    this.decisions = [];
    this.lostLeads = [];
    this.pipelineEvents = [];
    return { success: true, message: 'Base de dados limpa com sucesso. Pronta para dados reais.' };
  }

  private seedInitialData() {
    // Initial Tenant
    const defaultTenant: Tenant = {
      id: 'tenant-1',
      name: 'Agência Digital Elite',
      segment: 'restaurante',
      region: 'São Paulo, SP',
      plan: 'pro',
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

    // Initial Prompts
    const initialAgents = ['ScraperAgent', 'PersonaAgent', 'SiteBuilderAgent', 'OutreachAgent', 'LearnerAgent', 'SDRAgent'];
    initialAgents.forEach((agent) => {
      this.prompts.set(agent, [
        {
          id: `p-${agent}-v1`,
          agent,
          version: 1,
          promptText: `System prompt base para ${agent}. Foco em alta conversão e precisão sem alucinação de dados.`,
          active: true,
          updatedAt: new Date().toISOString()
        }
      ]);
    });

    // Seed Leads
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
        siteHealthScore: 32, // Sites velhos precisam de novo site!
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
      },
      {
        id: 'lead-103',
        tenantId: 'tenant-1',
        name: 'Auto Center Mecânica Express',
        category: 'Oficina Mecânica',
        segment: 'oficina',
        phone: '+55 11 99887-1122',
        address: 'Av. Santo Amaro, 3400 - Brooklin, São Paulo - SP',
        rating: 4.2,
        reviewsCount: 65,
        hasWebsite: true,
        siteHealthScore: 41,
        pipelineStatus: 'aguardando',
        pipelineStage: 'messaged',
        siteUrl: 'https://mecanica-express.optav.ia',
        siteCreatedAt: new Date(Date.now() - 86400000).toISOString(),
        siteDeployedAt: new Date(Date.now() - 86400000).toISOString(),
        lastMessageAt: new Date(Date.now() - 3600000 * 12).toISOString(),
        reviewsSample: [
          { author: 'Roberto S.', text: 'Resolveram o barulho da suspensão rápido. Falta um site com a tabela de serviços.', rating: 4, date: 'há 5 dias' }
        ],
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        id: 'lead-104',
        tenantId: 'tenant-1',
        name: 'Bistro Gourmet Jardin',
        category: 'Restaurante',
        segment: 'restaurante',
        phone: '+55 11 96543-9900',
        address: 'Rua Oscar Freire, 890 - Jardins, São Paulo - SP',
        rating: 4.9,
        reviewsCount: 310,
        hasWebsite: false,
        siteHealthScore: 0,
        pipelineStatus: 'followup_2',
        pipelineStage: 'messaged',
        siteUrl: 'https://bistro-gourmet-jardin.optav.ia',
        siteCreatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        siteDeployedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        lastMessageAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        reviewsSample: [
          { author: 'Mariana K.', text: 'Experiência gastronômica surreal! Precisa ter reserva fácil online.', rating: 5, date: 'há 1 dia' }
        ],
        createdAt: new Date(Date.now() - 86400000 * 6).toISOString()
      },
      {
        id: 'lead-105',
        tenantId: 'tenant-1',
        name: 'Barbearia Vintage Club',
        category: 'Serviços de Estética',
        segment: 'servicos',
        phone: '+55 11 95432-1100',
        address: 'Rua Pinheiros, 600 - Pinheiros, São Paulo - SP',
        rating: 4.7,
        reviewsCount: 140,
        hasWebsite: true,
        siteHealthScore: 28,
        pipelineStatus: 'perdido',
        pipelineStage: 'completed',
        siteUrl: 'https://barbearia-vintage-club.optav.ia',
        siteCreatedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
        reviewsSample: [
          { author: 'Lucas V.', text: 'Corte de cabelo nota 10, ambiente top!', rating: 5, date: 'há 2 semanas' }
        ],
        createdAt: new Date(Date.now() - 86400000 * 8).toISOString()
      }
    ];

    sampleLeads.forEach((l) => this.leads.set(l.id!, l as Lead));

    // Seed Lost Record for Lead 105
    this.lostLeads.push({
      id: 'lost-1',
      leadId: 'lead-105',
      tenantId: 'tenant-1',
      reason: 'preço',
      notes: 'Achou o orçamento de R$ 1.500 alto para o momento.',
      valueLost: 1500,
      lostAt: new Date(Date.now() - 86400000 * 6).toISOString()
    });

    // Seed Sample Site for Cantina Bella Italia
    this.sites.set('lead-101', {
      leadId: 'lead-101',
      template: 'restaurante',
      copy: {
        heroTitle: 'Autêntica Gastronomia Italiana no Coração de São Paulo',
        heroSubtitle: 'Massas artesanais preparadas diariamente com ingredientes importados e receitas de família.',
        aboutText: 'Com mais de 15 anos de tradição na Consolação, a Cantina Bella Italia une acolhimento, sabor inesquecível e uma carta de vinhos selecionados.',
        ctaText: 'Garantir Reserva de Mesa',
        guaranteeText: 'Atendimento exclusivo e ambiente climatizado.'
      },
      colors: {
        primary: '#b91c1c',
        secondary: '#15803d',
        accent: '#eab308',
        background: '#fffbe1'
      },
      fonts: { display: 'Playfair Display', body: 'Plus Jakarta Sans' },
      images: {
        hero: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
        about: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80'
        ]
      },
      sections: [
        { id: 's-hero', type: 'hero', title: 'Autêntica Gastronomia Italiana no Coração de São Paulo', subtitle: 'Massas artesanais preparadas diariamente com ingredientes importados.' },
        {
          id: 's-services',
          type: 'services',
          title: 'Nosso Cardápio Destaque',
          subtitle: 'Pratos recomendados pelos nossos clientes',
          items: [
            { title: 'Fettuccine ao Tartufo', description: 'Massa fresca artesanal com trufas negras e parmesão reggiano', price: 'R$ 89,00' },
            { title: 'Lasagna della Nonna', description: 'Camadas generosas com ragù di carne 12 horas', price: 'R$ 78,00' },
            { title: 'Tiramisù Tradizionale', description: 'Café espresso, mascarpone e cacau em pó italiano', price: 'R$ 32,00' }
          ]
        },
        {
          id: 's-testimonials',
          type: 'testimonials',
          title: 'O Que Dizem Nossos Clientes',
          subtitle: 'Avaliações reais extraídas do Google Maps',
          items: [
            { title: 'Carlos M.', description: 'Massa artesanal excelente e atendimento acolhedor!' },
            { title: 'Fernanda R.', description: 'Ambiente charmoso, perfeito para jantares a dois.' }
          ]
        },
        { id: 's-cta', type: 'cta', title: 'Pronto para uma Experiência Gastronômica Única?', subtitle: 'Faça sua reserva pelo WhatsApp em poucos segundos.' }
      ],
      deployedUrl: 'https://cantina-bella-italia.optav.ia',
      deployedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      version: 1
    });

    // Seed Messages
    this.messages.set('lead-101', [
      {
        id: 'm-1',
        leadId: 'lead-101',
        tenantId: 'tenant-1',
        role: 'sdr',
        text: 'Olá! Sou a Camila da Agência Digital Elite. Notamos que a Cantina Bella Italia tem 4.6 estrelas com mais de 180 avaliações no Google! Criamos uma prévia de um site moderno com reserva online para vocês: https://cantina-bella-italia.optav.ia. O que achou?',
        sentAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        sdrName: 'Camila Santos'
      },
      {
        id: 'm-2',
        leadId: 'lead-101',
        tenantId: 'tenant-1',
        role: 'lead',
        text: 'Nossa, que rápido! Gostei bastante das fotos da massa. Quanto custa para colocar no nosso domínio próprio?',
        sentAt: new Date(Date.now() - 3600000).toISOString(),
        sdrName: 'Cantina Bella Italia'
      }
    ]);

    // Seed Initial Learner Patterns
    this.learnings = [
      {
        id: 'lr-1',
        pattern: 'Restaurantes em SP com nota > 4.5 e site antigo convertem +42% quando o tom da mensagem enfatiza reservas de mesa pelo WhatsApp.',
        agent: 'OutreachAgent',
        scope: 'segment',
        segment: 'restaurante',
        region: 'São Paulo, SP',
        confidence: 0.94,
        nExamples: 38,
        promptDelta: 'Para restaurantes com boas avaliações, mencione explicitamente a facilidade de reservas via WhatsApp no primeiro parágrafo.',
        active: true,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        id: 'lr-2',
        pattern: 'Clínicas Odontológicas sem site possuem taxa de abertura de 68% quando a prévia exibe botão flutuante de agendamento.',
        agent: 'SiteBuilderAgent',
        scope: 'segment',
        segment: 'clinica',
        confidence: 0.88,
        nExamples: 24,
        promptDelta: 'Para clínicas de saúde/odontologia, adicione sempre o CTA de "Agendamento Rápido" destacado na primeira dobra.',
        active: true,
        createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
      }
    ];

    // Seed Audit Logs
    this.auditLogs.push({
      id: 'al-1',
      actor: 'Sistema Automatico',
      action: 'Ciclo Diario de Aprendizado',
      details: 'Learner Agent analisou 48 decisões e extraiu 2 novos padrões de conversão.',
      timestamp: new Date(Date.now() - 86400000).toISOString()
    });
  }
}

export const db = new InMemoryDB();
