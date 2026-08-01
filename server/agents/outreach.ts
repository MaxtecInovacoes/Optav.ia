import { Agent } from './base.js';
import { db } from '../db.js';
import { generateOutreachMessage, generateEmailOutreachMessage } from '../gemini.js';
import { ConversationMessage } from '../../src/types/index.js';

export class OutreachAgent extends Agent {
  constructor() {
    super(
      'OutreachAgent',
      'Você é o Outreach Agent responsável por compor e enviar abordagens via WhatsApp e E-mail.'
    );
  }

  async sendOutreach(leadId: string): Promise<{ whatsappMsg: ConversationMessage; emailData?: any }> {
    const startTime = Date.now();
    const lead = db.leads.get(leadId);
    if (!lead) throw new Error(`Lead ${leadId} not found`);

    const tenant = db.tenants.get(lead.tenantId);
    const sdrName = tenant?.sdrConfig.name || 'Camila Santos';

    const persona = db.personas.get(leadId);
    const site = db.sites.get(leadId);
    const siteUrl = site?.deployedUrl || lead.siteUrl || `https://${lead.id}.optav.ia`;

    // Fetch applicable learnings
    const promptDelta = this.getPromptWithLearnings(lead.segment);

    // 1. Generate WhatsApp Outreach Message
    const messageText = await generateOutreachMessage(
      lead.name,
      sdrName,
      siteUrl,
      persona?.personaSummary || 'Empresa local no Google Maps',
      promptDelta
    );

    // Call Meowhats REST API if configured
    let meowhatsDeliveryStatus = 'dry-run';
    const meowhatsApiUrl = process.env.MEOWHATS_API_URL || 'https://api.meowhats.com/v1';
    const meowhatsToken = process.env.MEOWHATS_API_TOKEN;
    const meowhatsInstance = process.env.MEOWHATS_INSTANCE_ID;

    if (meowhatsToken && lead.phone) {
      try {
        const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
        const res = await fetch(`${meowhatsApiUrl}/messages/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${meowhatsToken}`
          },
          body: JSON.stringify({
            instanceId: meowhatsInstance,
            phone: cleanPhone,
            message: messageText
          })
        });
        if (res.ok) {
          meowhatsDeliveryStatus = 'delivered';
        } else {
          meowhatsDeliveryStatus = `error-${res.status}`;
        }
      } catch (err) {
        console.warn('⚠️ Meowhats API Dispatch Error:', err);
        meowhatsDeliveryStatus = 'network-error';
      }
    }

    const msgObj: ConversationMessage = {
      id: `msg-${Date.now()}`,
      leadId,
      tenantId: lead.tenantId,
      role: 'sdr',
      text: messageText,
      sentAt: new Date().toISOString(),
      sdrName
    };

    const existingMsgs = db.messages.get(leadId) || [];
    existingMsgs.push(msgObj);
    db.messages.set(leadId, existingMsgs);

    // 2. Generate Email Outreach if email is available
    let emailData: any = null;
    if (lead.email) {
      emailData = await generateEmailOutreachMessage(
        lead.name,
        sdrName,
        siteUrl,
        persona?.personaSummary || 'Empresa em destaque no Google Maps'
      );
      lead.emailSent = true;
      lead.emailSentAt = new Date().toISOString();
    }

    lead.pipelineStatus = 'aguardando';
    lead.pipelineStage = 'messaged';
    lead.lastMessageAt = msgObj.sentAt;
    db.leads.set(leadId, lead);

    const duration = Date.now() - startTime;
    this.recordDecision(lead.tenantId, leadId, { sdrName }, { messageText, emailData, siteUrl }, 'success', { durationMs: duration });
    this.logEvent(leadId, lead.tenantId, 'outreach', 'completed', { whatsapp: msgObj, email: emailData }, undefined, duration);

    return { whatsappMsg: msgObj, emailData };
  }
}
