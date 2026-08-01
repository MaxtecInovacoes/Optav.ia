import { WebSocket } from 'ws';
import { logger } from './logger.js';
import { db } from './db.js';
import { sdrAgent } from './agents/sdr.js';

const MEOWHATS_WS_URL = process.env.MEOWHATS_WS_URL || 'ws://localhost:3001/ws';
const MEOWHATS_API_URL = process.env.MEOWHATS_API_URL || 'https://api.meowhats.com/v1';
const MEOWHATS_API_TOKEN = process.env.MEOWHATS_API_TOKEN || '';
const MEOWHATS_KEY = process.env.MEOWHATS_KEY || '1763kovQ@';

let wsClient: WebSocket | null = null;

export async function resolveLidToPhone(jid: string): Promise<string> {
  if (jid.includes('@lid')) {
    const lid = jid.split('@')[0];
    const mappedPhone = await db.getPhoneFromLid(lid);
    if (mappedPhone) return mappedPhone;
  }
  // Extract number directly if @s.whatsapp.net
  const rawNumber = jid.replace('@s.whatsapp.net', '').replace('@lid', '').replace(/\D/g, '');
  return `+${rawNumber}`;
}

export async function sendWhatsAppMessage(tenantId: string, phone: string, text: string): Promise<boolean> {
  try {
    logger.info({ tenantId, phone, textLength: text.length }, '[WhatsApp Send Request]');
    const response = await fetch(`${MEOWHATS_API_URL}/sessions/${tenantId}/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': MEOWHATS_KEY,
        ...(MEOWHATS_API_TOKEN ? { Authorization: `Bearer ${MEOWHATS_API_TOKEN}` } : {})
      },
      body: JSON.stringify({
        jid: phone.includes('@') ? phone : `${phone.replace(/\D/g, '')}@s.whatsapp.net`,
        type: 'text',
        text
      })
    });

    if (!response.ok) {
      logger.warn({ status: response.status }, '[WhatsApp API Send Failed] Status non-200');
      return false;
    }
    return true;
  } catch (err: any) {
    logger.error({ error: err.message }, '[WhatsApp API Send Exception]');
    return false;
  }
}

export function initWhatsAppListener(): void {
  try {
    logger.info({ wsUrl: MEOWHATS_WS_URL }, '[WhatsApp Listener] Initializing WebSocket client connection...');
    wsClient = new WebSocket(MEOWHATS_WS_URL);

    wsClient.on('open', () => {
      logger.info('[WhatsApp Listener] Connected to Meowhats WebSocket server.');
    });

    wsClient.on('message', async (data: any) => {
      try {
        const payload = JSON.parse(data.toString());
        logger.info({ event: payload.event }, '[WhatsApp WS Message Received]');

        if (payload.event === 'message' || payload.type === 'message') {
          const jid = payload.data?.from || payload.data?.jid || payload.from;
          const text = payload.data?.body || payload.data?.text || payload.text;
          const tenantId = payload.tenantId || 'tenant-1';

          if (jid && text) {
            const phone = await resolveLidToPhone(jid);
            // Locate lead in DB by phone
            const lead = await db.getLeadByPhone(tenantId, phone);
            if (lead) {
              logger.info({ leadId: lead.id, phone }, '[WhatsApp Listener] Routing message to SDR agent');
              await sdrAgent.handleLeadMessage(lead.id, text, 'lead');
            } else {
              logger.info({ phone }, '[WhatsApp Listener] Lead not found for incoming phone number.');
            }
          }
        }
      } catch (err: any) {
        logger.error({ error: err.message }, '[WhatsApp WS Message Error]');
      }
    });

    wsClient.on('error', (err) => {
      logger.warn({ error: err.message }, '[WhatsApp Listener WS Error]');
    });

    wsClient.on('close', () => {
      logger.warn('[WhatsApp Listener WS Closed] Reconnecting in 10s...');
      setTimeout(initWhatsAppListener, 10000);
    });
  } catch (err: any) {
    logger.warn({ error: err.message }, '[WhatsApp Listener Init Failed] Operating in API polling/webhook mode.');
  }
}
