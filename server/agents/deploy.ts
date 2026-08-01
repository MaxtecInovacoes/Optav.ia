import { Agent } from './base.js';
import { db } from '../db.js';
import { SiteData } from '../../src/types/index.js';

export class DeployAgent extends Agent {
  constructor() {
    super(
      'DeployAgent',
      'Você é o Deploy Agent responsável por publicar sites na infraestrutura de borda da Cloudflare Pages.'
    );
  }

  async deploySite(leadId: string): Promise<string> {
    const startTime = Date.now();
    const lead = db.leads.get(leadId);
    if (!lead) throw new Error(`Lead ${leadId} not found`);

    const site = db.sites.get(leadId);
    if (!site) throw new Error(`Site for lead ${leadId} not generated`);

    // Clean URL slug
    const cleanSlug = lead.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const deployedUrl = `https://${cleanSlug}.optav.ia`;
    const now = new Date().toISOString();

    site.deployedUrl = deployedUrl;
    site.deployedAt = now;
    db.sites.set(leadId, site);

    lead.siteUrl = deployedUrl;
    lead.siteDeployedAt = now;
    lead.pipelineStage = 'deployed';
    db.leads.set(leadId, lead);

    const duration = Date.now() - startTime;
    this.recordDecision(lead.tenantId, leadId, { slug: cleanSlug }, { deployedUrl }, 'success', { durationMs: duration });
    this.logEvent(leadId, lead.tenantId, 'deploy', 'completed', { deployedUrl }, undefined, duration);

    return deployedUrl;
  }
}
