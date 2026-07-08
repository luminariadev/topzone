// src/pages/api/admin/admin-roles.ts
// Admin role management API - list, update, invite admins
export const prerender = false;
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { verifyAdminAuth, createSuccessResponse, createErrorResponse } from '../../../lib/admin-auth';

export const GET: APIRoute = async ({ cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success) return createErrorResponse(authResult.error || 'Unauthorized', authResult.status);
  if (!supabase) return createSuccessResponse({ admins: [] });

  if (authResult.admin?.role !== 'super_admin') {
    return createErrorResponse('Only super admin can manage roles', 403);
  }

  const { data, error } = await supabase
    .from('admin_users')
    .select('id, email, full_name, role, is_active, last_login, created_at')
    .order('created_at', { ascending: false });

  if (error) return createErrorResponse(error.message, 500);
  return createSuccessResponse({ admins: data || [] });
};

export const POST: APIRoute = async ({ request, cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success) return createErrorResponse(authResult.error || 'Unauthorized', authResult.status);
  if (!supabase) return createErrorResponse('Supabase not configured', 503);

  if (authResult.admin?.role !== 'super_admin') {
    return createErrorResponse('Only super admin can invite admins', 403);
  }

  const body = await request.json();
  const { email, full_name, role } = body;
  if (!email || !role) return createErrorResponse('email and role required', 400);

  const validRoles = ['admin', 'staff', 'super_admin'];
  if (!validRoles.includes(role)) return createErrorResponse('Invalid role', 400);

  const { data: existing } = await supabase.from('admin_users').select('id').eq('email', email).single();
  if (existing) return createErrorResponse('Admin already exists', 409);

  const { data, error } = await supabase.from('admin_users').insert({
    email,
    full_name: full_name || '',
    role,
    is_active: true,
    created_at: new Date().toISOString(),
  }).select().single();

  if (error) return createErrorResponse(error.message, 500);
  return createSuccessResponse({ admin: data }, 201);
};

export const PUT: APIRoute = async ({ request, cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success) return createErrorResponse(authResult.error || 'Unauthorized', authResult.status);
  if (!supabase) return createErrorResponse('Supabase not configured', 503);

  if (authResult.admin?.role !== 'super_admin') {
    return createErrorResponse('Only super admin can update roles', 403);
  }

  const body = await request.json();
  const { admin_id, role, is_active, full_name } = body;
  if (!admin_id) return createErrorResponse('admin_id required', 400);

  const updates: Record<string, unknown> = {};
  if (role !== undefined) {
    const validRoles = ['admin', 'staff', 'super_admin'];
    if (!validRoles.includes(role)) return createErrorResponse('Invalid role', 400);
    updates.role = role;
  }
  if (is_active !== undefined) updates.is_active = is_active;
  if (full_name !== undefined) updates.full_name = full_name;
  updates.updated_at = new Date().toISOString();

  const { error } = await supabase.from('admin_users').update(updates).eq('id', admin_id);
  if (error) return createErrorResponse(error.message, 500);
  return createSuccessResponse({ success: true });
};

export const DELETE: APIRoute = async ({ url, cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success) return createErrorResponse(authResult.error || 'Unauthorized', authResult.status);
  if (!supabase) return createErrorResponse('Supabase not configured', 503);

  if (authResult.admin?.role !== 'super_admin') {
    return createErrorResponse('Only super admin can deactivate admins', 403);
  }

  const adminId = url.searchParams.get('id');
  if (!adminId) return createErrorResponse('id required', 400);

  if (authResult.admin?.id === adminId) return createErrorResponse('Cannot deactivate yourself', 400);

  const { error } = await supabase.from('admin_users').update({ is_active: false, updated_at: new Date().toISOString() }).eq('id', adminId);
  if (error) return createErrorResponse(error.message, 500);
  return createSuccessResponse({ success: true });
};
