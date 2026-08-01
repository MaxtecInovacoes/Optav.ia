import { Agent } from './base.js';
import { db } from '../db.js';
import { LearningPattern } from '../../src/types/index.js';
import { logger } from '../logger.js';

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

    const total = decisions.length;
    if (total < 10) {
      logger.info({ total }, '[LearnerAgent] Amostras insuficientes para extração de padrões reais (< 10 decisões).');
      db.auditLogs.unshift({
        id: `al-${Date.now()}`,
        actor: 'LearnerAgent',
        action: 'Ciclo de Aprendizado',
        details: `Amostra de dados insuficiente (${total}/10 decisões). Nenhum padrão fictício gerado.`,
        timestamp: new Date().toISOString()
      });
      return db.learnings;
    }

    const successful = decisions.filter((d) => d.outcome === 'success').length;
    const successRate = (successful / total) * 100;

    const newLearning: LearningPattern = {
      id: `lr-${Date.now()}`,
      pattern: `Análise real de ${total} interações: Taxa de conversão atual em ${successRate.toFixed(1)}%.`,
      agent: 'OutreachAgent',
      scope: 'global',
      confidence: Number((successful / total).toFixed(2)),
      nExamples: total,
      promptDelta: 'Foque nos pontos de conversão direta destacados pelo cliente nas interações bem-sucedidas.',
      active: true,
      createdAt: new Date().toISOString()
    };

    db.learnings.unshift(newLearning);

    db.auditLogs.unshift({
      id: `al-${Date.now()}`,
      actor: 'LearnerAgent',
      action: 'Ciclo de Aprendizado Concluído',
      details: `Analisou ${total} decisões reais com ${successRate.toFixed(1)}% de sucesso.`,
      timestamp: new Date().toISOString()
    });

    const duration = Date.now() - startTime;
    this.recordDecision(tenantId || 'global', 'system', { totalDecisions: total }, newLearning, 'success', { durationMs: duration });
    this.logEvent('system', tenantId || 'global', 'learner_cycle', 'completed', newLearning, undefined, duration);

    return db.learnings;
  }
}

export const learnerAgent = new LearnerAgent();
