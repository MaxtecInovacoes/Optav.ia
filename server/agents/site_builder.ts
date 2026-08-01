import { Agent } from './base.js';
import { db } from '../db.js';
import { generateSiteCopy } from '../gemini.js';
import { SiteData, SiteSection } from '../../src/types/index.js';

export class SiteBuilderAgent extends Agent {
  constructor() {
    super(
      'SiteBuilderAgent',
      'Você é o Site Builder Agent responsável por construir sites de altíssimo padrão cinematográfico usando Astro/GSAP.'
    );
  }

  async buildSite(leadId: string): Promise<SiteData> {
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

    // Generate unique, distinct color palettes dynamically for each site based on lead ID hash
    const hash = (lead.id + lead.name).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colorPalettes = [
      { primary: '#0f172a', secondary: '#2563eb', accent: '#3b82f6', background: '#f8fafc' },
      { primary: '#1e1b4b', secondary: '#7c3aed', accent: '#a855f7', background: '#faf5ff' },
      { primary: '#022c22', secondary: '#059669', accent: '#10b981', background: '#ecfdf5' },
      { primary: '#451a03', secondary: '#d97706', accent: '#f59e0b', background: '#fffbeb' },
      { primary: '#881337', secondary: '#e11d48', accent: '#f43f5e', background: '#fff1f2' },
      { primary: '#082f49', secondary: '#0284c7', accent: '#06b6d4', background: '#f0f9ff' },
    ];
    const fontPairs = [
      { display: 'Playfair Display', body: 'Plus Jakarta Sans' },
      { display: 'Syne', body: 'Inter' },
      { display: 'Space Grotesk', body: 'Plus Jakarta Sans' },
      { display: 'Outfit', body: 'Inter' },
      { display: 'Cabinet Grotesk', body: 'Plus Jakarta Sans' }
    ];

    const colors = colorPalettes[hash % colorPalettes.length];
    const fonts = fontPairs[hash % fontPairs.length];
    const images = imageMap[lead.segment] || imageMap.geral;

    // Use REAL testimonials and quotes extracted from Google Meu Negocio profile
    const realTestimonials = (lead.reviewsSample && lead.reviewsSample.length > 0)
      ? lead.reviewsSample.map((r) => ({ title: r.author, description: `"${r.text}" — Nota ${r.rating}/5 no Google` }))
      : (lead.reviewQuotes || []).map((q, idx) => ({ title: `Cliente Verificado ${idx + 1}`, description: `"${q}"` }));

    const sections: SiteSection[] = [
      { id: 's-hero', type: 'hero', title: copy.heroTitle, subtitle: copy.heroSubtitle },
      { id: 's-about', type: 'about', title: `Sobre ${lead.name}`, content: `${copy.aboutText}\n\nLocalização: ${lead.address}\nHorário: ${lead.openingHours || 'Aberto 24 horas'}` },
      {
        id: 's-services',
        type: 'services',
        title: lead.segment === 'restaurante' ? 'Especialidades & Destaques' : 'Nossos Serviços Principais',
        subtitle: `Atendimento direto no ${lead.category} — ${lead.address}`,
        items: [
          { title: `${lead.category} Especializado`, description: `Qualidade certificada no Google Maps com nota ${lead.rating}/5 estrelas.`, price: 'Agendar via WhatsApp' },
          { title: 'Atendimento Rápido e Seguro', description: `Contato direto pelo telefone ${lead.phone}`, price: lead.openingHours || 'Aberto' }
        ]
      },
      {
        id: 's-testimonials',
        type: 'testimonials',
        title: `Avaliações Reais do Google (${lead.reviewsCount} Avaliações)`,
        subtitle: `Classificação Média: ${lead.rating} ★★★★★ no Google Meu Negócio`,
        items: realTestimonials
      },
      {
        id: 's-contact',
        type: 'contact',
        title: `Contato & Agendamento — ${lead.name}`,
        subtitle: `📍 Endereço: ${lead.address} | 📞 Telefone: ${lead.phone} | 🕒 ${lead.openingHours || 'Aberto 24 horas'}`
      },
      { id: 's-cta', type: 'cta', title: copy.ctaText, subtitle: `${copy.guaranteeText} | Ligue: ${lead.phone}` }
    ];

    const siteData: SiteData = {
      leadId,
      template: lead.segment,
      copy,
      colors,
      fonts,
      images,
      sections,
      version: 1
    };

    db.sites.set(leadId, siteData);

    lead.pipelineStage = 'site_generated';
    lead.siteCreatedAt = new Date().toISOString();
    db.leads.set(leadId, lead);

    const duration = Date.now() - startTime;
    this.recordDecision(lead.tenantId, leadId, { template: lead.segment }, siteData, 'success', { durationMs: duration });
    this.logEvent(leadId, lead.tenantId, 'site_builder', 'completed', siteData, undefined, duration);

    return siteData;
  }
}
