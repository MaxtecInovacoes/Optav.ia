import { Agent } from './base.js';
import { db } from '../db.js';
import { generateSdrReply } from '../gemini.js';
import { ConversationMessage } from '../../src/types/index.js';

export class SDRAgent extends Agent {
  constructor() {
    super(
      'SDRAgent',
      'Você é o SDR Agent responsável por manter conversas de prospecção consultiva pelo WhatsApp.'
    );
  }

  async handleLeadMessage(leadId: string, leadText: string): Promise<ConversationMessage> {
    const startTime = Date.now();
    const lead = db.leads.get(leadId);
    if (!lead) throw new Error(`Lead ${leadId} not found`);

    const tenant = db.tenants.get(lead.tenantId);
    const sdrName = tenant?.sdrConfig.name || 'Camila Santos';
    const sdrTone = tenant?.sdrConfig.tone || 'informal';
    const sdrRules = tenant?.sdrConfig.rules || ['Mencione o nome da empresa'];

    // Append lead message to db
    const leadMsg: ConversationMessage = {
      id: `msg-${Date.now()}-lead`,
      leadId,
      tenantId: lead.tenantId,
      role: 'lead',
      text: leadText,
      sentAt: new Date().toISOString(),
      sdrName: lead.name
    };

    const history = db.messages.get(leadId) || [];
    history.push(leadMsg);

    // Update lead status
    lead.lastReplyAt = leadMsg.sentAt;
    lead.pipelineStatus = 'followup_1';
    db.leads.set(leadId, lead);

    // Generate SDR reply
    const replyText = await generateSdrReply(
      lead.name,
      sdrName,
      sdrTone,
      sdrRules,
      history.map((h) => ({ role: h.role, text: h.text }))
    );

    const sdrMsg: ConversationMessage = {
      id: `msg-${Date.now()}-sdr`,
      leadId,
      tenantId: lead.tenantId,
      role: 'sdr',
      text: replyText,
      sentAt: new Date().toISOString(),
      sdrName
    };

    history.push(sdrMsg);
    db.messages.set(leadId, history);

    lead.lastMessageAt = sdrMsg.sentAt;
    db.leads.set(leadId, lead);

    const duration = Date.now() - startTime;
    this.recordDecision(lead.tenantId, leadId, { leadText }, { replyText }, 'success', { durationMs: duration });
    this.logEvent(leadId, lead.tenantId, 'sdr_reply', 'completed', sdrMsg, undefined, duration);

    return sdrMsg;
  }
}
