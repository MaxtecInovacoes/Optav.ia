import { Agent } from './base.js';
import { db } from '../db.js';
import { generatePersona } from '../gemini.js';
import { PersonaData } from '../../src/types/index.js';

export class PersonaAgent extends Agent {
  constructor() {
    super(
      'PersonaAgent',
      'Você é o Persona Agent responsável por analisar o comportamento, dores e percepções dos clientes de cada empresa.'
    );
  }

  async analyzeLead(leadId: string): Promise<PersonaData> {
    const startTime = Date.now();
    const lead = db.leads.get(leadId);
    if (!lead) throw new Error(`Lead ${leadId} not found`);

    const personaResult = await generatePersona(
      lead.name,
      lead.segment,
      lead.reviewsSample
    );

    const paletteMap: Record<string, { primary: string; secondary: string; accent: string; background: string }> = {
      restaurante: { primary: '#b91c1c', secondary: '#15803d', accent: '#eab308', background: '#fffbe1' },
      clinica: { primary: '#0284c7', secondary: '#0d9488', accent: '#38bdf8', background: '#f0f9ff' },
      oficina: { primary: '#1e293b', secondary: '#ea580c', accent: '#f59e0b', background: '#f8fafc' },
      servicos: { primary: '#4f46e5', secondary: '#7c3aed', accent: '#06b6d4', background: '#faf5ff' },
      geral: { primary: '#0f172a', secondary: '#2563eb', accent: '#3b82f6', background: '#f8fafc' }
    };

    const fontMap: Record<string, { display: string; body: string }> = {
      restaurante: { display: 'Playfair Display', body: 'Plus Jakarta Sans' },
      clinica: { display: 'Plus Jakarta Sans', body: 'Inter' },
      oficina: { display: 'Space Grotesk', body: 'Inter' },
      servicos: { display: 'Syne', body: 'Plus Jakarta Sans' },
      geral: { display: 'Playfair Display', body: 'Inter' }
    };

    const colors = paletteMap[lead.segment] || paletteMap.geral;
    const fonts = fontMap[lead.segment] || fontMap.geral;

    const personaData: PersonaData = {
      leadId: lead.id,
      publicoAlvo: personaResult.publicoAlvo,
      dores: personaResult.dores,
      tomMensagem: personaResult.tomMensagem,
      keywords: personaResult.keywords,
      personaSummary: personaResult.personaSummary,
      recommendedColors: colors,
      recommendedFonts: fonts
    };

    db.personas.set(leadId, personaData);

    // Update lead pipeline stage
    lead.pipelineStage = 'persona_done';
    db.leads.set(leadId, lead);

    const duration = Date.now() - startTime;
    this.recordDecision(lead.tenantId, leadId, { reviewsCount: lead.reviewsCount }, personaData, 'success', { durationMs: duration });
    this.logEvent(leadId, lead.tenantId, 'persona', 'completed', personaData, undefined, duration);

    return personaData;
  }
}
