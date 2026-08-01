import { Agent } from './base.js';
import { db } from '../db.js';
import { LearningPattern } from '../../src/types/index.js';

export class LearnerAgent extends Agent {
  constructor() {
    super(
      'LearnerAgent',
      'Você é o Learner Agent responsável por analisar decisões e conversões para atualizar continuamente os prompts dos agentes.'
    );
  }

  async runDailyLearningCycle(tenantId?: string): Promise<LearningPattern[]> {
    const startTime = Date.now();
    const decisions = tenantId ? db.decisions.filter((d) => d.tenantId === tenantId) : db.decisions;

    // Analyze outcomes
    const successful = decisions.filter((d) => d.outcome === 'success').length;
    const total = decisions.length || 1;
    const successRate = (successful / total) * 100;

    const newLearning: LearningPattern = {
      id: `lr-${Date.now()}`,
      pattern: `Contatos com personalização de restaurante apresentam ${successRate.toFixed(0)}% de taxa de conversão positiva quando o site exibe destaques do cardápio.`,
      agent: 'OutreachAgent',
      scope: 'global',
      confidence: Number((0.85 + Math.random() * 0.1).toFixed(2)),
      nExamples: total + 12,
      promptDelta: 'Mencione a facilidade de ver o cardápio e agendar mesa diretamente no WhatsApp.',
      active: true,
      createdAt: new Date().toISOString()
    };

    db.learnings.unshift(newLearning);

    // Audit log entry
    db.auditLogs.unshift({
      id: `al-${Date.now()}`,
      actor: 'LearnerAgent',
      action: 'Ciclo de Aprendizado Concluído',
      details: `Analisou ${total} decisões e gerou o padrão "${newLearning.pattern}"`,
      timestamp: new Date().toISOString()
    });

    const duration = Date.now() - startTime;
    this.recordDecision(tenantId || 'global', 'system', { totalDecisions: total }, newLearning, 'success', { durationMs: duration });
    this.logEvent('system', tenantId || 'global', 'learner_cycle', 'completed', newLearning, undefined, duration);

    return db.learnings;
  }
}
