import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware.js';

export function requireTenant(req: AuthRequest, res: Response, next: NextFunction): void {
  const tenantId = (req.headers['x-tenant-id'] as string) || req.body?.tenantId || req.query?.tenantId || req.admin?.tenantId;
  if (!tenantId) {
    res.status(400).json({ error: 'X-Tenant-ID header ou tenantId obrigatório para isolamento multi-tenant' });
    return;
  }
  req.tenantId = tenantId;
  next();
}
