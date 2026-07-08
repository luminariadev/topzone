// src/pages/api/admin/games-crud.ts
// Admin CRUD operations for games (Supabase-backed)
export const prerender = false;
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { verifyAdminAuth, createSuccessResponse, createErrorResponse, requireRole } from '../../../lib/admin-auth';

export const GET: APIRoute = async ({ cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success) return createErrorResponse(authResult.error || 'Unauthorized', authResult.status);

  if (!supabase) return createSuccessResponse({ games: [] });
  const { data } = await supabase.from('products').select('*').eq('type', 'game').order('name');
  return createSuccessResponse({ games: data || [] });
};

export const POST: APIRoute = async ({ request, cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success) return createErrorResponse(authResult.error || 'Unauthorized', authResult.status);
  if (!requireRole(authResult.admin, 'admin')) return createErrorResponse('Admin access required', 403);

  const game = await request.json();
  if (!game.name || !game.slug) return createErrorResponse('Name and slug required', 400);
  if (supabase) {
    const { data, error } = await supabase.from('products').insert({ slug: game.slug, name: game.name, type: 'game', img: game.img || '/assets/default-game.png', color: game.color || '#39FF14', badge: game.badge || 'New', category: game.category || 'mobile', currency: game.currency || 'Diamond', description: game.description || '', packages: game.packages || [], status: game.status || 'published', created_at: new Date().toISOString() }).select().single();
    if (error) return createErrorResponse(error.message, 500);
    return createSuccessResponse({ game: data }, 201);
  }
  return createSuccessResponse({ game }, 201);
};

export const PUT: APIRoute = async ({ request, cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success) return createErrorResponse(authResult.error || 'Unauthorized', authResult.status);
  if (!requireRole(authResult.admin, 'admin')) return createErrorResponse('Admin access required', 403);

  const game = await request.json();
  if (!game.slug) return createErrorResponse('Slug required', 400);
  if (supabase) { const { error } = await supabase.from('products').update(game).eq('slug', game.slug); if (error) return createErrorResponse(error.message, 500); }
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
