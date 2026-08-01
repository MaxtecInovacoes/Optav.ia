import { SegmentType } from './index.js';

export type AdminRole = 'super_admin' | 'admin';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: AdminRole;
  tenantId?: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AdminSession {
  id: string;
  adminUserId: string;
  token: string;
  refreshToken: string;
  expiresAt: string;
  createdAt: string;
}

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminRegisterRequest {
  email: string;
  password: string;
  name: string;
  role?: AdminRole;
  tenantId?: string;
}

export interface AdminCreateTenantRequest {
  name: string;
  segment: SegmentType;
  region: string;
  sdrConfig?: {
    sdrType: 'nativo' | 'custom';
    name: string;
    tone: 'formal' | 'informal' | 'descontraido' | 'tecnico';
    rules: string[];
    basePrompt: string;
  };
}
