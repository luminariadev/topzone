// src/lib/admin-auth.ts
// Shared admin authentication utilities for API routes
import type { APIContext } from 'astro';
import { supabase } from './supabase';

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'super_admin';
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
  } catch {
    return { success: false, error: 'Authentication failed', status: 401 };
  }
}

/**
 * Check if admin has required role
 */
export function requireRole(admin: AdminUser, requiredRole: 'admin' | 'super_admin'): boolean {
  if (requiredRole === 'super_admin') return admin.role === 'super_admin';
  return admin.role === 'admin' || admin.role === 'super_admin';
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