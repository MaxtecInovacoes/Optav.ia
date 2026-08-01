import { Agent } from './base.js';
import { db } from '../db.js';
import { generateSdrReply } from '../gemini.js';
import { ConversationMessage } from '../../src/types/index.js';
import { sendWhatsAppMessage } from '../whatsapp_listener.js';

export class SDRAgent extends Agent {
  constructor() {
    super(
      'SDRAgent',
      'Você é o SDR Agent responsável por manter conversas de prospecção consultiva pelo WhatsApp.'
    );
  }

  async handleLeadMessage(leadId: string, leadText: string, senderRole: 'lead' | 'human' = 'lead'): Promise<ConversationMessage> {
    const startTime = Date.now();
    const lead = await db.getLeadById(leadId);
    if (!lead) throw new Error(`Lead ${leadId} não encontrado`);

    const tenant = await db.getTenantById(lead.tenantId);
    const sdrName = tenant?.sdrConfig.name || 'Camila Santos';
    const sdrTone = tenant?.sdrConfig.tone || 'informal';
    const sdrRules = tenant?.sdrConfig.rules || ['Mencione o nome da empresa'];

    const leadMsg: ConversationMessage = {
      id: `msg-${Date.now()}-lead`,
      leadId,
      tenantId: lead.tenantId,
      role: senderRole,
      text: leadText,
      sentAt: new Date().toISOString(),
      sdrName: lead.name
    };

    await db.addMessage(leadMsg);

    lead.lastReplyAt = leadMsg.sentAt;
    lead.pipelineStatus = 'followup_1';
    await db.saveLead(lead);

    const history = await db.getMessagesByLeadId(leadId);

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

    await db.addMessage(sdrMsg);

    lead.lastMessageAt = sdrMsg.sentAt;
    await db.saveLead(lead);

    // Send WhatsApp dispatch
    if (lead.phone) {
      await sendWhatsAppMessage(lead.tenantId, lead.phone, replyText);
    }

    const duration = Date.now() - startTime;
    this.recordDecision(lead.tenantId, leadId, { leadText }, { replyText }, 'success', { durationMs: duration });
    this.logEvent(leadId, lead.tenantId, 'sdr_reply', 'completed', sdrMsg, undefined, duration);

    return sdrMsg;
  }
}

export const sdrAgent = new SDRAgent();
