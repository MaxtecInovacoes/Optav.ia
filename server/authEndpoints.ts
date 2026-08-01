import { Router } from 'express';
import { hashPassword, verifyPassword, generateAccessToken, generateRefreshToken, verifyRefreshToken } from './auth.js';
import { db } from './db.js';
import { requireAuth, requireRole, AuthRequest } from './middleware.js';
import { AdminRegisterRequest, AdminLoginRequest } from '../src/types/admin.js';

const router = Router();

// POST /api/auth/admin/register
router.post('/register', requireAuth, requireRole(['super_admin']), async (req: AuthRequest, res) => {
  const { email, password, name, role, tenantId }: AdminRegisterRequest = req.body;
  if (!email || !password || !name) {
    res.status(400).json({ error: 'Campos email, password e name são obrigatórios.' });
    return;
  }

  const existing = await db.getAdminByEmail(email);
  if (existing) {
    res.status(409).json({ error: 'Email já cadastrado.' });
    return;
  }

  const passwordHash = await hashPassword(password);
  const newAdmin = {
    id: `adm-${Date.now()}`,
    email,
    name,
    passwordHash,
    role: role || 'admin',
    tenantId: tenantId || 'tenant-1',
    isActive: true,
    createdAt: new Date().toISOString()
  };

  await db.createAdmin(newAdmin);
  res.status(201).json({ id: newAdmin.id, email: newAdmin.email, name: newAdmin.name, role: newAdmin.role, tenantId: newAdmin.tenantId });
});

// POST /api/auth/admin/login
router.post('/login', async (req, res) => {
  const { email, password }: AdminLoginRequest = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    return;
  }

  const admin = await db.getAdminByEmail(email);
  if (!admin) {
    res.status(401).json({ error: 'Email ou senha inválidos.' });
    return;
  }

  const validPassword = await verifyPassword(password, admin.passwordHash);
  if (!validPassword) {
    res.status(401).json({ error: 'Email ou senha inválidos.' });
    return;
  }

  if (!admin.isActive) {
    res.status(403).json({ error: 'Conta de usuário desativada.' });
    return;
  }

  const accessToken = generateAccessToken(admin);
  const refreshToken = generateRefreshToken(admin);

  await db.saveSession({
    id: `sess-${Date.now()}`,
    adminUserId: admin.id,
    token: accessToken,
    refreshToken,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString()
  });

  res.json({
    accessToken,
    refreshToken,
    admin: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      tenantId: admin.tenantId
    }
  });
});

// POST /api/auth/admin/refresh
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    res.status(400).json({ error: 'refreshToken é obrigatório.' });
    return;
  }

  const payload = verifyRefreshToken(refreshToken);
  if (!payload) {
    res.status(401).json({ error: 'Refresh token inválido ou expirado.' });
    return;
  }

  const session = await db.getSessionByRefreshToken(refreshToken);
  if (!session) {
    res.status(401).json({ error: 'Sessão revogada ou inválida.' });
    return;
  }

  const admin = await db.getAdminById(payload.adminUserId);
  if (!admin || !admin.isActive) {
    res.status(401).json({ error: 'Usuário administrador inativo.' });
    return;
  }

  const newAccessToken = generateAccessToken(admin);
  res.json({ accessToken: newAccessToken });
});

// POST /api/auth/admin/logout
router.post('/logout', requireAuth, async (req: AuthRequest, res) => {
  const token = req.headers.authorization?.slice(7);
  if (token) {
    await db.deleteSessionByToken(token);
  }
  res.json({ ok: true, message: 'Sessão encerrada com sucesso.' });
});

// GET /api/auth/admin/me
router.get('/me', requireAuth, async (req: AuthRequest, res) => {
  const adminId = req.admin?.adminUserId;
  if (!adminId) {
    res.status(401).json({ error: 'Não autenticado.' });
    return;
  }

  const admin = await db.getAdminById(adminId);
  if (!admin) {
    res.status(404).json({ error: 'Usuário administrador não encontrado.' });
    return;
  }

  const { passwordHash, ...safeAdmin } = admin;
  res.json(safeAdmin);
});

export default router;
