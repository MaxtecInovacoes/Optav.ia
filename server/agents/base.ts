import { db } from '../db.js';
import { DecisionRecord, PipelineEvent } from '../../src/types/index.js';

export abstract class Agent {
  name: string;
  systemPrompt: string;

  constructor(name: string, systemPrompt: string) {
    this.name = name;
    this.systemPrompt = systemPrompt;
  }

  getPromptWithLearnings(segment?: string): string {
    const activeLearnings = db.learnings.filter((l) => l.active && l.agent === this.name);
    let prompt = this.systemPrompt;
    if (activeLearnings.length > 0) {
      prompt += '\n\n[APRENDIZADOS DO SISTEMA APLICADOS]:\n';
      activeLearnings.forEach((l) => {
        if (!l.segment || l.segment === segment) {
          prompt += `- ${l.promptDelta}\n`;
        }
      });
    }
    return prompt;
  }

  recordDecision(
    tenantId: string,
    leadId: string,
    context: any,
    decision: any,
    outcome: 'success' | 'fail' | 'partial',
    metrics: Record<string, any>
  ): DecisionRecord {
    const record: DecisionRecord = {
      id: `dec-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      agent: this.name,
      tenantId,
      leadId,
      context,
      decision,
      outcome,
      metrics,
      createdAt: new Date().toISOString()
    };
    db.decisions.push(record);
    return record;
  }

  logEvent(
    leadId: string,
    tenantId: string,
    stage: string,
    event: 'started' | 'completed' | 'failed' | 'retried',
    output?: any,
    error?: string,
    durationMs: number = 0,
    traceId?: string
  ): PipelineEvent {
    const eventObj: PipelineEvent = {
      id: `pe-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      leadId,
      tenantId,
      stage,
      event,
      agent: this.name,
      output,
      error,
      durationMs,
      traceId: traceId || `tr-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    db.pipelineEvents.push(eventObj);
    return eventObj;
  }
}
