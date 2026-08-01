import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from './auth.js';

export interface AuthRequest extends Request {
  admin?: { userId: string; adminUserId: string; email: string; role: string; tenantId?: string };
  tenantId?: string;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token de autenticação necessário (Bearer token missing)' });
    return;
  }
  const token = authHeader.slice(7);
  const payload = verifyAccessToken(token);
  if (!payload) {
    res.status(401).json({ error: 'Token inválido ou expirado' });
    return;
  }
  req.admin = payload;
  if (payload.tenantId) {
    req.tenantId = payload.tenantId;
  }
  next();
}

export function requireRole(allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.admin?.role || !allowedRoles.includes(req.admin.role)) {
      res.status(403).json({ error: 'Permissão insuficiente para esta ação' });
      return;
    }
    next();
  };
}

export const requireAdmin = requireAuth;

export const requireSuperAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  requireAuth(req, res, () => {
    if (req.admin?.role !== 'super_admin') {
      res.status(403).json({ error: 'Acesso restrito a super_admin' });
      return;
    }
    next();
  });
};
