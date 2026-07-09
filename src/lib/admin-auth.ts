// src/lib/admin-auth.ts
// Shared admin authentication utilities for API routes
import type { APIContext } from 'astro';
import { supabase } from './supabase';

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'super_admin' | 'staff';
  is_active: boolean;
}

export interface AdminAuthResult {
  success: boolean;
  admin?: AdminUser;
  error?: string;
  status: number;
}

/**
 * Verify admin session from request cookies
 */
export async function verifyAdminAuth(context: APIContext): Promise<AdminAuthResult> {
  if (!supabase) {
    return { success: false, error: 'Supabase not configured', status: 503 };
  }

  const token = context.cookies.get('sb-admin-token')?.value;
  if (!token) {
    return { success: false, error: 'Admin session required', status: 401 };
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return { success: false, error: 'Invalid or expired session', status: 401 };
    }

    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('id, email, full_name, role, is_active')
      .eq('email', user.email)
      .single();

    if (adminError || !adminData || !adminData.is_active) {
      return { success: false, error: 'Not authorized as admin', status: 403 };
    }

    return {
      success: true,
      admin: {
        id: adminData.id,
        email: adminData.email,
        full_name: adminData.full_name,
        role: adminData.role,
        is_active: adminData.is_active,
      },
      status: 200,
    };
  } catch (err) {
    console.error('[admin-auth] Authentication failed:', err);
    return { success: false, error: 'Authentication failed', status: 401 };
  }
}

/**
 * Check if admin has required role
 * - super_admin: full access to everything
 * - admin: can manage CRUD, orders, customers, vouchers, audit logs
 * - staff: can only view dashboard, orders, customers (read-only)
 */
export function requireRole(admin: AdminUser, requiredRole: 'admin' | 'super_admin' | 'staff'): boolean {
  if (!admin) return false;
  if (requiredRole === 'staff') return admin.role === 'staff' || admin.role === 'admin' || admin.role === 'super_admin';
  if (requiredRole === 'admin') return admin.role === 'admin' || admin.role === 'super_admin';
  return admin.role === 'super_admin';
}

// ─── Permission Matrix ───────────────────────────────────────────────────────
type Permission = 'read' | 'write' | 'delete' | 'export' | 'moderate' | 'admin';

const PERMISSION_MATRIX: Record<string, Record<string, Permission[]>> = {
  dashboard: { super_admin: ['read'], admin: ['read'], staff: ['read'] },
  products:  { super_admin: ['read', 'write', 'delete', 'export'], admin: ['read', 'write', 'delete', 'export'], staff: ['read'] },
  orders:    { super_admin: ['read', 'write', 'export'], admin: ['read', 'write', 'export'], staff: ['read'] },
  vouchers:  { super_admin: ['read', 'write', 'delete'], admin: ['read', 'write', 'delete'], staff: ['read'] },
  reviews:   { super_admin: ['read', 'write', 'delete', 'moderate'], admin: ['read', 'write', 'moderate'], staff: ['read'] },
  customers: { super_admin: ['read', 'write', 'export'], admin: ['read', 'write', 'export'], staff: ['read'] },
  audit_log: { super_admin: ['read', 'delete'], admin: ['read'], staff: [] },
  settings:  { super_admin: ['read', 'write', 'admin'], admin: ['read'], staff: [] },
  email:     { super_admin: ['read', 'write'], admin: [], staff: [] },
  payment:   { super_admin: ['read', 'write'], admin: [], staff: [] },
  backup:    { super_admin: ['read', 'write'], admin: [], staff: [] },
};

export function hasPermission(admin: AdminUser, module: string, permission: Permission): boolean {
  if (!admin || !admin.is_active) return false;
  if (admin.role === 'super_admin') return true;
  const modulePerms = PERMISSION_MATRIX[module];
  if (!modulePerms) return false;
  const rolePerms = modulePerms[admin.role] || [];
  return rolePerms.includes(permission);
}

export function requirePermission(admin: AdminUser, module: string, permission: Permission): Response | null {
  if (!hasPermission(admin, module, permission)) {
    return createErrorResponse(`Insufficient permissions: ${module}:${permission}`, 403);
  }
  return null;
}

/**
 * Create standardized error response
 */
export function createErrorResponse(error: string, status: number): Response {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Create standardized success response
 */
export function createSuccessResponse<T>(data: T, status = 200): Response {
  return new Response(JSON.stringify({ success: true, ...data }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}