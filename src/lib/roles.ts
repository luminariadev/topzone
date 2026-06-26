// src/lib/roles.ts
// Role-based access control utilities

export type UserRole = 'user' | 'admin' | 'super_admin';

export interface RoleCheck {
  isAdmin: boolean;
  isSuperAdmin: boolean;
  role: UserRole;
}

export function getUserRole(email: string | null | undefined): RoleCheck {
  const role: UserRole = getRoleFromEmail(email);
  return { role, isAdmin: role === 'admin' || role === 'super_admin', isSuperAdmin: role === 'super_admin' };
}

function getRoleFromEmail(email: string | null | undefined): UserRole {
  if (!email) return 'user';
  const normalized = email.toLowerCase().trim();
  const superAdmins = ['admin@topzone.com', 'super@topzone.com'];
  if (superAdmins.includes(normalized)) return 'super_admin';
  if (normalized.endsWith('@topzone.com') || normalized.endsWith('@admin.topzone.com')) return 'admin';
  return 'user';
}

export function canAdmin(role: UserRole): boolean { return role === 'admin' || role === 'super_admin'; }
export function canSuperAdmin(role: UserRole): boolean { return role === 'super_admin'; }
