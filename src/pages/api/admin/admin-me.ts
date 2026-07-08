// src/pages/api/admin/admin-me.ts
// Admin profile endpoint - get current admin profile with permissions
export const prerender = false;
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { verifyAdminAuth, createSuccessResponse, createErrorResponse, requireRole } from '../../../lib/admin-auth';

export const GET: APIRoute = async ({ cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success) return createErrorResponse(authResult.error || 'Unauthorized', authResult.status);
  if (!supabase) return createSuccessResponse({ admin: authResult.admin, permissions: {} });

  const admin = authResult.admin!;
  const permissions = {
    canManageGames: requireRole(admin, 'admin'),
    canManageGears: requireRole(admin, 'admin'),
    canManageVouchers: requireRole(admin, 'admin'),
    canManageOrders: requireRole(admin, 'admin'),
    canViewReports: requireRole(admin, 'admin'),
    canViewAuditLog: requireRole(admin, 'admin'),
    canManageAdmins: requireRole(admin, 'super_admin'),
    canManageSettings: requireRole(admin, 'super_admin'),
    canViewSystemHealth: requireRole(admin, 'admin'),
  };

  return createSuccessResponse({ admin, permissions });
};