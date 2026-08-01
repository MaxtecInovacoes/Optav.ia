import crypto from 'crypto';
import { db } from '../db.js';
import { logger } from '../logger.js';

const CAKTO_SECRET = process.env.CAKTO_WEBHOOK_SECRET || 'SECRET_938a94e0';

export function validateCaktoSignature(rawBody: Buffer, xCaktoHash: string | undefined): boolean {
  if (!process.env.CAKTO_WEBHOOK_SECRET) {
    logger.warn('[Cakto] CAKTO_WEBHOOK_SECRET não configurado — permitindo sem validação rigorosa em dev');
    return true;
  }
  if (!xCaktoHash || !rawBody) return false;
  try {
    const expected = crypto.createHmac('sha256', CAKTO_SECRET).update(rawBody).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(xCaktoHash));
  } catch (err) {
    return false;
  }
}

export async function processCaktoWebhookEvent(rawBody: Buffer, xCaktoHash: string | undefined) {
  if (!validateCaktoSignature(rawBody, xCaktoHash)) {
    throw { statusCode: 400, message: 'Assinatura x-cakto-hash inválida' };
  }

  let data: Record<string, any>;
  try {
    data = JSON.parse(rawBody.toString('utf-8'));
  } catch {
    throw { statusCode: 422, message: 'Body de requisição JSON inválido' };
  }

  const eventId = data.id || data.event_id || `evt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const eventType = data.event || data.event_type || 'purchase_approved';
  const customerEmail = data.data?.customer?.email || data.customer?.email || 'cliente@optavia.ai';

  // Idempotency Check via PostgreSQL / DB
  const isNew = await db.saveCaktoEvent(eventId, customerEmail, eventType, data);
  if (!isNew) {
    logger.info({ eventId }, '[Cakto Webhook] Evento duplicado ignorado (Idempotency)');
    return { ok: true, detail: 'duplicate_ignored' };
  }

  logger.info({ eventId, eventType, customerEmail }, '[Cakto Webhook] Processing event');

  let detail = 'evento_processado';

  if (eventType === 'purchase_approved' || eventType === 'subscription_created') {
    await db.updateTenantPlanByEmail(customerEmail, 'pro');
    detail = `Plano PRO ativado para ${customerEmail}`;
  } else if (eventType === 'subscription_canceled') {
    await db.updateTenantPlanByEmail(customerEmail, 'free');
    detail = `Plano desativado (FREE) para ${customerEmail}`;
  } else if (eventType === 'purchase_refused') {
    detail = `Compra recusada para ${customerEmail}`;
  } else if (eventType === 'refund') {
    await db.updateTenantPlanByEmail(customerEmail, 'free');
    detail = `Reembolso processado. Plano alterado para FREE para ${customerEmail}`;
  }

  return { ok: true, event: eventType, detail };
}
