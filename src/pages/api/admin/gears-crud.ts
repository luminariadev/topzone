// src/pages/api/admin/gears-crud.ts
// Admin CRUD operations for gears (Supabase-backed)
export const prerender = false;
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { verifyAdminAuth, createSuccessResponse, createErrorResponse, requireRole } from '../../../lib/admin-auth';

export const GET: APIRoute = async ({ cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success) return createErrorResponse(authResult.error || 'Unauthorized', authResult.status);

  if (!supabase) return createSuccessResponse({ gears: [] });
  const { data } = await supabase.from('products').select('*').eq('type', 'gear').order('name');
  return createSuccessResponse({ gears: data || [] });
};

export const POST: APIRoute = async ({ request, cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success) return createErrorResponse(authResult.error || 'Unauthorized', authResult.status);
  if (!requireRole(authResult.admin, 'admin')) return createErrorResponse('Admin access required', 403);

  const gear = await request.json();
  if (!gear.name || !gear.slug) return createErrorResponse('Name and slug required', 400);
  if (supabase) {
    const { data, error } = await supabase.from('products').insert({ slug: gear.slug, name: gear.name, type: 'gear', img: gear.img || '/assets/default-gear.png', price: gear.price || 0, tag: gear.tag || 'Gaming', category: gear.category || 'keyboard', description: gear.description || '', specs: gear.specs || [], status: gear.status || 'published', created_at: new Date().toISOString() }).select().single();
    if (error) return createErrorResponse(error.message, 500);
    return createSuccessResponse({ gear: data }, 201);
  }
  return createSuccessResponse({ gear }, 201);
};

export const PUT: APIRoute = async ({ request, cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success) return createErrorResponse(authResult.error || 'Unauthorized', authResult.status);
  if (!requireRole(authResult.admin, 'admin')) return createErrorResponse('Admin access required', 403);

  const gear = await request.json();
  if (!gear.slug) return createErrorResponse('Slug required', 400);
  if (supabase) { const { error } = await supabase.from('products').update(gear).eq('slug', gear.slug); if (error) return createErrorResponse(error.message, 500); }
  return createSuccessResponse({ success: true });
};

export const DELETE: APIRoute = async ({ url, cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success) return createErrorResponse(authResult.error || 'Unauthorized', authResult.status);
  if (!requireRole(authResult.admin, 'super_admin')) return createErrorResponse('Super Admin access required', 403);

  const slug = url.searchParams.get('slug');
  if (!slug) return createErrorResponse('Slug required', 400);
  if (supabase) { const { error } = await supabase.from('products').update({ is_deleted: true, status: 'archived' }).eq('slug', slug); if (error) return createErrorResponse(error.message, 500); }
  return createSuccessResponse({ success: true });
};
