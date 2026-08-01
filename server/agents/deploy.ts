import { Agent } from './base.js';
import { db } from '../db.js';
import { SiteData } from '../../src/types/index.js';

export class DeployAgent extends Agent {
  constructor() {
    super(
      'DeployAgent',
      'Você é o Deploy Agent responsável por publicar sites na esteira estática e gerar os links de demonstração.'
    );
  }

  generateStandaloneHtml(site: SiteData, leadName: string, leadPhone: string): string {
    const bg = site.colors?.background || '#0a0c14';

    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${leadName} — Website Oficial & Agendamento</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap" />
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: ${bg}; color: #f8fafc; }
  </style>
</head>
<body class="antialiased selection:bg-cyan-500 selection:text-black">
  <!-- Header -->
  <header class="border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
    <div class="flex items-center space-x-2">
      <span class="text-xl font-extrabold text-white">${leadName}</span>
    </div>
    <a href="https://wa.me/${leadPhone.replace(/\D/g, '')}" target="_blank" class="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg flex items-center space-x-2">
      <span>Falar no WhatsApp</span>
    </a>
  </header>

  <!-- Hero Section -->
  <section class="py-20 px-6 max-w-5xl mx-auto text-center space-y-6">
    <div class="inline-block px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider">
      Atendimento Exclusivo & Avaliado no Google
    </div>
    <h1 class="text-4xl md:text-6xl font-black text-white leading-tight">
      ${site.copy?.heroTitle || leadName}
    </h1>
    <p class="text-slate-300 text-lg max-w-2xl mx-auto">
      ${site.copy?.heroSubtitle || 'Qualidade máxima e atendimento rápido.'}
    </p>
    <div class="pt-4">
      <a href="https://wa.me/${leadPhone.replace(/\D/g, '')}" target="_blank" class="inline-flex items-center space-x-2 px-8 py-4 bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-lg rounded-xl shadow-xl transition-all">
        <span>AGENDAR AGORA MESMO</span>
      </a>
    </div>
  </section>

  <!-- Sections -->
  <div class="max-w-4xl mx-auto px-6 py-12 space-y-12">
    ${site.sections?.map(s => `
      <div class="bg-slate-900/80 border border-slate-800 p-8 rounded-2xl space-y-4">
        <h2 class="text-2xl font-bold text-cyan-300">${s.title}</h2>
        ${s.subtitle ? `<p class="text-slate-400 text-sm">${s.subtitle}</p>` : ''}
        ${s.content ? `<p class="text-slate-200 text-base leading-relaxed">${s.content}</p>` : ''}
        ${s.items ? `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            ${s.items.map(it => `
              <div class="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <div class="font-bold text-white">${it.title}</div>
                <div class="text-xs text-slate-400">${it.description}</div>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `).join('')}
  </div>

  <footer class="border-t border-slate-800 py-8 text-center text-xs text-slate-500">
    <p>© ${new Date().getFullYear()} ${leadName}. Desenvolvido por OPTAV.IA Esteira Automática.</p>
  </footer>
</body>
</html>`;
  }

  async deploySite(leadId: string): Promise<string> {
    const startTime = Date.now();
    const lead = await db.getLeadById(leadId);
    if (!lead) throw new Error(`Lead ${leadId} não encontrado`);

    const site = await db.getSiteByLeadId(leadId);
    if (!site) throw new Error(`Site para o lead ${leadId} não foi gerado`);

    const cleanSlug = lead.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const shortId = lead.id.substring(0, 8);
    const deployedUrl = `/sites/${lead.tenantId}/${cleanSlug}-${shortId}`;
    const now = new Date().toISOString();

    const compiledHtml = this.generateStandaloneHtml(site, lead.name, lead.phone);
    site.compiledHtml = compiledHtml;
    site.deployedUrl = deployedUrl;
    site.deployedAt = now;
    site.visionScore = site.sections && site.sections.length >= 3 ? 9.2 : 8.0;
    site.chunksCount = site.sections?.length || 3;
    await db.saveSite(site);

    lead.siteUrl = deployedUrl;
    lead.siteDeployedAt = now;
    lead.pipelineStage = 'deployed';
    lead.pipelineStatus = 'concluido';
    await db.saveLead(lead);

    const duration = Date.now() - startTime;
    this.recordDecision(lead.tenantId, leadId, { slug: cleanSlug }, { deployedUrl, visionScore: site.visionScore }, 'success', { durationMs: duration });
    this.logEvent(leadId, lead.tenantId, 'deploy', 'completed', { deployedUrl }, undefined, duration);

    return deployedUrl;
  }
}

export const deployAgent = new DeployAgent();
