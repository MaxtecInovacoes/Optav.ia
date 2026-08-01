import { Agent } from './base.js';
import { db } from '../db.js';
import { generateSiteCopy } from '../gemini.js';
import { SiteData, SiteSection, DesignerPRD } from '../../src/types/index.js';

export class SiteBuilderAgent extends Agent {
  constructor() {
    super(
      'SiteBuilderAgent',
      'Você é o SiteBuilder/Hermes Component Assembly Engine responsável por processar o PRD do Arquiteto e montar um site cinematográfico e totalmente personalizado.'
    );
  }

  // Generates authoritative Designer PRD JSON (Arquiteto step)
  generateDesignerPRD(lead: any): DesignerPRD {
    const segment = (lead.segment || 'geral').toLowerCase();
    const hash = (lead.id + lead.name).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

    // Archetype mapping based on niche and score/rating
    let archetype: DesignerPRD['archetype'] = 'minimal-clean';
    let layoutFamily: DesignerPRD['layoutDna']['layoutFamily'] = 'split-hero';
    let heroVariant: DesignerPRD['layoutDna']['heroVariant'] = 'split-70-30';

    if (segment.includes('academia') || segment.includes('fitness') || segment.includes('oficina') || segment.includes('crossfit')) {
      archetype = 'industrial-bold';
      layoutFamily = 'split-hero';
      heroVariant = 'split-70-30';
    } else if (segment.includes('clinica') || segment.includes('saude') || segment.includes('dentista') || segment.includes('medico')) {
      archetype = 'soft-medical';
      layoutFamily = 'minimal-floating';
      heroVariant = 'fullscreen-minimal';
    } else if (segment.includes('advocacia') || segment.includes('luxo') || segment.includes('joalheria') || segment.includes('imobiliaria')) {
      archetype = 'luxury-dark-gold';
      layoutFamily = 'luxury-dark';
      heroVariant = 'parallax';
    } else if (segment.includes('restaurante') || segment.includes('padaria') || segment.includes('cafe')) {
      archetype = 'organic-warm';
      layoutFamily = 'bento-grid';
      heroVariant = 'bento-card';
    } else if (segment.includes('tech') || segment.includes('software') || segment.includes('marketing')) {
      archetype = 'tech-neon';
      layoutFamily = 'parallax-hero';
      heroVariant = 'parallax';
    } else {
      const options: Array<{ a: DesignerPRD['archetype']; lf: DesignerPRD['layoutDna']['layoutFamily']; hv: DesignerPRD['layoutDna']['heroVariant'] }> = [
        { a: 'cyberpunk-sharp', lf: 'parallax-hero', hv: 'parallax' },
        { a: 'industrial-bold', lf: 'split-hero', hv: 'split-70-30' },
        { a: 'soft-medical', lf: 'minimal-floating', hv: 'fullscreen-minimal' },
        { a: 'organic-warm', lf: 'bento-grid', hv: 'bento-card' }
      ];
      const selected = options[hash % options.length];
      archetype = selected.a;
      layoutFamily = selected.lf;
      heroVariant = selected.hv;
    }

    const archetypePalettes: Record<string, DesignerPRD['designTokens']> = {
      'industrial-bold': {
        archetype: 'industrial-bold',
        googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Anton:wght@400;900&family=Inter:wght@400;700&display=swap',
        displayFont: 'Anton',
        bodyFont: 'Inter',
        radius: '0px',
        colors: { primary: '#08252E', accent: '#17A2B8', ink: '#E8F6F8', paper: '#04161C', surface: '#0C333E' },
        forbiddenRadiusClasses: ['rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-2xl', 'rounded-3xl'],
        forbiddenPhrases: ['transforme sua vida', 'soluções completas', 'veja nossos serviços']
      },
      'soft-medical': {
        archetype: 'soft-medical',
        googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;800&family=Outfit:wght@400;700&display=swap',
        displayFont: 'Outfit',
        bodyFont: 'Plus Jakarta Sans',
        radius: '16px',
        colors: { primary: '#0f4c81', accent: '#38bdf8', ink: '#0f172a', paper: '#f8fafc', surface: '#ffffff' },
        forbiddenRadiusClasses: ['rounded-none'],
        forbiddenPhrases: ['o melhor da cidade', 'preço imbatível']
      },
      'luxury-dark-gold': {
        archetype: 'luxury-dark-gold',
        googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Plus+Jakarta+Sans:wght@400;600&display=swap',
        displayFont: 'Playfair Display',
        bodyFont: 'Plus Jakarta Sans',
        radius: '8px',
        colors: { primary: '#1a1814', accent: '#d4af37', ink: '#f5f0e6', paper: '#0d0c0a', surface: '#24211c' },
        forbiddenRadiusClasses: ['rounded-full'],
        forbiddenPhrases: ['barato', 'desconto louco']
      },
      'organic-warm': {
        archetype: 'organic-warm',
        googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;600&display=swap',
        displayFont: 'Syne',
        bodyFont: 'Inter',
        radius: '16px',
        colors: { primary: '#2d3b2d', accent: '#e07a5f', ink: '#1f241f', paper: '#f4f1de', surface: '#ffffff' },
        forbiddenRadiusClasses: ['rounded-none'],
        forbiddenPhrases: ['soluções 360', 'venha conferir']
      },
      'tech-neon': {
        archetype: 'tech-neon',
        googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=JetBrains+Mono:wght@400;600&display=swap',
        displayFont: 'Space Grotesk',
        bodyFont: 'JetBrains Mono',
        radius: '8px',
        colors: { primary: '#0f172a', accent: '#00ffb3', ink: '#f8fafc', paper: '#020617', surface: '#1e293b' },
        forbiddenRadiusClasses: ['rounded-2xl'],
        forbiddenPhrases: ['somos uma empresa', 'qualidade em primeiro lugar']
      },
      'minimal-clean': {
        archetype: 'minimal-clean',
        googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap',
        displayFont: 'Inter',
        bodyFont: 'Inter',
        radius: '8px',
        colors: { primary: '#09090b', accent: '#2563eb', ink: '#09090b', paper: '#ffffff', surface: '#f4f4f5' },
        forbiddenRadiusClasses: [],
        forbiddenPhrases: ['confira já']
      },
      'cyberpunk-sharp': {
        archetype: 'cyberpunk-sharp',
        googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Syne:wght@800&family=JetBrains+Mono:wght@400;700&display=swap',
        displayFont: 'Syne',
        bodyFont: 'JetBrains Mono',
        radius: '0px',
        colors: { primary: '#120024', accent: '#ff0055', ink: '#ffffff', paper: '#080010', surface: '#200038' },
        forbiddenRadiusClasses: ['rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-full'],
        forbiddenPhrases: ['bem vindo ao nosso site']
      }
    };

    const tokens = archetypePalettes[archetype] || archetypePalettes['minimal-clean'];

    const faqs = [
      {
        question: `Como funciona o atendimento na ${lead.name}?`,
        answer: `Nosso atendimento é realizado de forma direta e personalizada para a cidade de ${lead.cidade || lead.address || 'região local'}. Entre em contato pelo WhatsApp para agendamento imediato.`
      },
      {
        question: `Quais são as opções de pagamento e garantia dos serviços?`,
        answer: `Oferecemos facilidades no pagamento via Pix, cartões e faturamento. Todos os serviços contam com garantia de satisfação e execução qualificada.`
      },
      {
        question: `Qual é o horário de funcionamento e localização?`,
        answer: `Estamos localizados em ${lead.address || 'centro da cidade'}. Nosso horário é ${lead.openingHours || 'de Segunda a Sábado com suporte rápido'}.`
      }
    ];

    return {
      business_name: lead.name,
      cidade: lead.address || 'Curitiba, PR',
      segmento: lead.category || segment,
      archetype,
      layoutDna: {
        layoutFamily,
        heroVariant,
        motionConfig: {
          hasGsap: true,
          hasLenis: true,
          hasParallax: true,
          hover3d: true
        },
        sectionCountRange: [5, 8]
      },
      designTokens: tokens,
      conversionMap: {
        ctaPrimaryLabel: `Agende seu Atendimento — ${lead.name}`,
        ctaSecondaryLabel: 'Falar com Especialista no WhatsApp',
        guaranteeText: 'Satisfação Garantida • Atendimento Certificado no Google Maps',
        trustBadge: `Nota ${lead.rating || 4.9}/5.0 no Google (${lead.reviewsCount || 24} avaliações reais)`
      },
      faqs,
      hero: {
        h1: segment.includes('academia') ? 'Treino Sem Limite' : segment.includes('clinica') ? 'Sua Saúde em Primeiro Lugar' : `Excelência em ${lead.category || 'Serviços'}`,
        subheadline: `Atendimento de alta performance em ${lead.address || 'região local'}. Infraestrutura completa e profissionais dedicados a entregar o melhor resultado.`,
        ctaPrimary: {
          label: 'Quero meu diagnóstico',
          action: `https://wa.me/${(lead.phone || '').replace(/\D/g, '')}`
        },
        imageStyle: 'industrial-overlay'
      }
    };
  }

  async buildSite(leadId: string, provider: 'openai' | 'anthropic' | 'nvidia' | 'assembly-engine' = 'assembly-engine'): Promise<SiteData> {
    const startTime = Date.now();
    const lead = db.leads.get(leadId);
    if (!lead) throw new Error(`Lead ${leadId} not found`);

    const persona = db.personas.get(leadId);
    const personaSummary = persona?.personaSummary || `Empresa de destaque no segmento de ${lead.segment}.`;

    const copy = await generateSiteCopy(
      lead.name,
      lead.segment,
      personaSummary,
      lead.reviewsSample
    );

    // Generate Authoritative PRD via Arquiteto Agent Engine
    const prd = this.generateDesignerPRD(lead);

    const imageMap: Record<string, { hero: string; about: string; gallery: string[] }> = {
      restaurante: {
        hero: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
        about: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80'
        ]
      },
      clinica: {
        hero: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80',
        about: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80'
        ]
      },
      oficina: {
        hero: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
        about: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?auto=format&fit=crop&w=600&q=80'
        ]
      },
      servicos: {
        hero: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80',
        about: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80'
        ]
      },
      geral: {
        hero: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
        about: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80'
        ]
      }
    };

    const images = imageMap[lead.segment] || imageMap.geral;

    const colors = {
      primary: prd.designTokens.colors.primary,
      secondary: prd.designTokens.colors.accent,
      accent: prd.designTokens.colors.accent,
      background: prd.designTokens.colors.paper,
      ink: prd.designTokens.colors.ink,
      paper: prd.designTokens.colors.paper,
      surface: prd.designTokens.colors.surface
    };

    const fonts = {
      display: prd.designTokens.displayFont,
      body: prd.designTokens.bodyFont
    };

    // Extract real reviews or quotes
    const realTestimonials = (lead.reviewsSample && lead.reviewsSample.length > 0)
      ? lead.reviewsSample.map((r) => ({ title: r.author, description: `"${r.text}" — Nota ${r.rating}/5 no Google` }))
      : (lead.reviewQuotes || []).map((q, idx) => ({ title: `Cliente Verificado ${idx + 1}`, description: `"${q}"` }));

    // Assemble dynamic layout sections according to Layout DNA
    const sections: SiteSection[] = [
      {
        id: 's-hero',
        type: 'hero',
        title: prd.hero.h1 || copy.heroTitle,
        subtitle: prd.hero.subheadline || copy.heroSubtitle
      },
      {
        id: 's-bento',
        type: 'bento',
        title: 'Nossos Diferenciais de Atendimento',
        subtitle: `Porque somos referência em ${lead.category || lead.segment} em ${lead.address}`,
        items: [
          { title: 'Equipamentos e Estrutura de Ponta', description: 'Tecnologia moderna e ambiente calibrado para máxima qualidade.', tag: 'TECNOLOGIA' },
          { title: 'Atendimento Rápido e Humanizado', description: 'Equipe pronta para resolver seu problema sem enrolação.', tag: 'RAPIDEZ' },
          { title: 'Transparência e Preço Justo', description: 'Orçamentos claros antes da execução de qualquer serviço.', tag: 'GARANTIA' },
          { title: 'Pontualidade e Foco em Resultado', description: 'Compromisso com prazos e excelência no atendimento.', tag: 'PONTUALIDADE' }
        ]
      },
      {
        id: 's-about',
        type: 'about',
        title: `Sobre a ${lead.name}`,
        content: `${copy.aboutText}\n\n📍 Endereço: ${lead.address}\n🕒 Horário: ${lead.openingHours || 'Aberto 24 horas'}`
      },
      {
        id: 's-services',
        type: 'services',
        title: lead.segment === 'restaurante' ? 'Especialidades & Cardápio' : 'Serviços em Destaque',
        subtitle: `Atendimento direto em ${lead.address}`,
        items: [
          { title: `${lead.category || 'Serviço'} Personalizado`, description: `Qualidade certificada no Google Maps com nota ${lead.rating || 4.9}/5 estrelas.`, price: 'Consulte via WhatsApp' },
          { title: 'Atendimento Prioritário', description: `Entre em contato direto pelo telefone ${lead.phone}`, price: lead.openingHours || 'Disponível' }
        ]
      },
      {
        id: 's-testimonials',
        type: 'testimonials',
        title: `Avaliações Reais do Google (${lead.reviewsCount || 24} Avaliações)`,
        subtitle: `Classificação Média: ${lead.rating || 4.9} ★★★★★ no Google Meu Negócio`,
        items: realTestimonials
      },
      {
        id: 's-faq',
        type: 'faq',
        title: 'Perguntas Frequentes',
        subtitle: 'Tire suas dúvidas antes de solicitar o seu orçamento',
        items: prd.faqs?.map((f) => ({ title: f.question, description: f.answer }))
      },
      {
        id: 's-contact',
        type: 'contact',
        title: `Contato & Agendamento — ${lead.name}`,
        subtitle: `📍 Endereço: ${lead.address} | 📞 Telefone: ${lead.phone} | 🕒 ${lead.openingHours || 'Aberto 24 horas'}`
      },
      {
        id: 's-cta',
        type: 'cta',
        title: prd.conversionMap.ctaPrimaryLabel || copy.ctaText,
        subtitle: `${prd.conversionMap.guaranteeText} | WhatsApp: ${lead.phone}`
      }
    ];

    const siteData: SiteData = {
      leadId,
      template: lead.segment,
      provider,
      prd,
      copy,
      colors,
      fonts,
      images,
      sections,
      faqs: prd.faqs,
      version: 1
    };

    db.sites.set(leadId, siteData);

    lead.pipelineStage = 'site_generated';
    lead.siteCreatedAt = new Date().toISOString();
    db.leads.set(leadId, lead);

    const duration = Date.now() - startTime;
    this.recordDecision(lead.tenantId, leadId, { archetype: prd.archetype, layoutFamily: prd.layoutDna.layoutFamily, provider }, siteData, 'success', { durationMs: duration });
    this.logEvent(leadId, lead.tenantId, 'site_builder', 'completed', siteData, undefined, duration);

    return siteData;
  }
}

