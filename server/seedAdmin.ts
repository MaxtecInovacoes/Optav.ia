import { hashPassword } from './auth.js';
import { db } from './db.js';
import { logger } from './logger.js';

export async function seedDefaultAdmin(): Promise<void> {
  const adminEmail = process.env.DEFAULT_ADMIN_EMAIL;
  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    logger.warn('[seedAdmin] DEFAULT_ADMIN_EMAIL ou DEFAULT_ADMIN_PASSWORD não configurados — seed pulado.');
    return;
  }

  const existing = await db.getAdminByEmail(adminEmail);
  if (existing) {
    logger.info({ adminEmail }, '[seedAdmin] Super admin já cadastrado.');
    return;
  }

  const passwordHash = await hashPassword(adminPassword);
  const superAdmin = {
    id: `adm-seed-${Date.now()}`,
    email: adminEmail,
    name: 'Super Admin',
    passwordHash,
    role: 'super_admin' as const,
    tenantId: 'tenant-1',
    isActive: true,
    createdAt: new Date().toISOString()
  };

  await db.createAdmin(superAdmin);
  logger.info({ adminEmail }, '[seedAdmin] Super admin seed criado com senha criptografada em bcrypt.');
}
