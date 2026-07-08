// src/pages/api/admin/audit-log.ts
// Admin audit log API - get audit trail with search, filter, and pagination
export const prerender = false;
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { verifyAdminAuth, createSuccessResponse, createErrorResponse, requireRole } from '../../../lib/admin-auth';

export const GET: APIRoute = async ({ url, cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success) return createErrorResponse(authResult.error || 'Unauthorized', authResult.status);
  // Only admins/super_admins can view audit logs (staff cannot)
  if (!requireRole(authResult.admin, 'admin')) return createErrorResponse('Admin access required', 403);
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 200);
  const offset = parseInt(url.searchParams.get('offset') || '0');
  const adminEmail = url.searchParams.get('admin');
  const action = url.searchParams.get('action');
  const entityType = url.searchParams.get('entity_type');
  const search = url.searchParams.get('search');
  const dateFrom = url.searchParams.get('from');
  const dateTo = url.searchParams.get('to');

  if (!supabase) return new Response(JSON.stringify({ logs: [], total: 0 }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  let query = supabase.from('audit_log').select('*', { count: 'exact' });
  let dataQuery = supabase.from('audit_log').select('*');

  // Apply filters
  if (adminEmail) { query = query.eq('admin_email', adminEmail); dataQuery = dataQuery.eq('admin_email', adminEmail); }
  if (action) { query = query.eq('action', action); dataQuery = dataQuery.eq('action', action); }
  if (entityType) { query = query.eq('entity_type', entityType); dataQuery = dataQuery.eq('entity_type', entityType); }
  if (dateFrom) { query = query.gte('created_at', dateFrom); dataQuery = dataQuery.gte('created_at', dateFrom); }
  if (dateTo) { query = query.lte('created_at', dateTo); dataQuery = dataQuery.lte('created_at', dateTo); }
  if (search) {
    query = query.or(`admin_email.ilike.%${search}%,entity_id.ilike.%${search}%`);
    dataQuery = dataQuery.or(`admin_email.ilike.%${search}%,entity_id.ilike.%${search}%`);
  }

  query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);
  dataQuery = dataQuery.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

  const [{ count }, { data, error }] = await Promise.all([query, dataQuery]);

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });

  // Summary stats for the log
  const { data: allLogs } = await supabase.from('audit_log').select('action, entity_type, admin_email');

  const actionCounts: Record<string, number> = {};
  const entityCounts: Record<string, number> = {};
  const adminCounts: Record<string, number> = {};
  (allLogs || []).forEach(l => {
    actionCounts[l.action] = (actionCounts[l.action] || 0) + 1;
    entityCounts[l.entity_type] = (entityCounts[l.entity_type] || 0) + 1;
    adminCounts[l.admin_email] = (adminCounts[l.admin_email] || 0) + 1;
  });

  return new Response(JSON.stringify({
    logs: data || [],
    total: count || 0,
    summary: { actionCounts, entityCounts, adminCounts },
  }), { status: 200, headers: { 'Content-Type': 'application/json' } });
};

export const POST: APIRoute = async ({ request, cookies }) => {
  // No auth needed for POST, as it's used for logging all admin actions (even failed logins).
  // But ensure the log entry itself has admin_email for accountability.
  const log = await request.json();
  if (!log.admin_email || !log.action || !log.entity_type) {
    return createErrorResponse('admin_email, action, entity_type required', 400);
  }
  if (supabase) {
    const { error } = await supabase.from('audit_log').insert({
      admin_email: log.admin_email,
      action: log.action,
      entity_type: log.entity_type,
      entity_id: log.entity_id || null,
      details: log.details || {},
      ip_address: log.ip_address || null,
      created_at: new Date().toISOString(),
    });
    if (error) return createErrorResponse(error.message, 500);
  }
  return createSuccessResponse({ success: true }, 201);
};

export const DELETE: APIRoute = async ({ url, cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success) return createErrorResponse(authResult.error || 'Unauthorized', authResult.status);
  if (!requireRole(authResult.admin, 'super_admin')) return createErrorResponse('Super Admin access required', 403);

  const id = url.searchParams.get('id');
  const days = url.searchParams.get('days');

  if (!supabase) return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  if (id) {
    const { error } = await supabase.from('audit_log').delete().eq('id', id);
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  // Bulk delete older than N days
  if (days) {
    const cutoff = new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000).toISOString();
    const { error, count } = await supabase.from('audit_log').delete().lt('created_at', cutoff);
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    return new Response(JSON.stringify({ success: true, deleted: count || 0 }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  return new Response(JSON.stringify({ error: 'id or days parameter required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
};
