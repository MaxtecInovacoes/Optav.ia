import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AdminUser } from '../src/types/admin.js';

const JWT_SECRET = (() => {
  const v = process.env.JWT_SECRET;
  if (!v) throw new Error('JWT_SECRET ausente no .env — servidor não inicia sem segredo configurado.');
  return v;
})();

const JWT_REFRESH_SECRET = (() => {
  const v = process.env.JWT_REFRESH_SECRET;
  if (!v) throw new Error('JWT_REFRESH_SECRET ausente no .env — servidor não inicia sem segredo configurado.');
  return v;
})();
const JWT_EXPIRY = '24h';
const REFRESH_EXPIRY = '7d';
const BCRYPT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateAccessToken(admin: { id: string; email: string; role: string; tenantId?: string }): string {
  return jwt.sign(
    { userId: admin.id, adminUserId: admin.id, email: admin.email, role: admin.role, tenantId: admin.tenantId },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
}

export function generateRefreshToken(admin: { id: string; email: string }): string {
  return jwt.sign(
    { adminUserId: admin.id, type: 'refresh' },
    JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_EXPIRY }
  );
}

export function verifyAccessToken(token: string): { userId: string; adminUserId: string; email: string; role: string; tenantId?: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; adminUserId: string; email: string; role: string; tenantId?: string };
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): { adminUserId: string; type: string } | null {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as { adminUserId: string; type: string };
  } catch {
    return null;
  }
}

export function signToken(userId: string, email: string): string {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

export function verifyToken(token: string): { userId: string; email: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
  } catch {
    return null;
  }
}
