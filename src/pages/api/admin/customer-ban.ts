// src/pages/api/admin/customer-ban.ts
export const prerender = false;
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { verifyAdminAuth, createSuccessResponse, createErrorResponse, requireRole } from '../../../lib/admin-auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success) return createErrorResponse(authResult.error || 'Unauthorized', authResult.status);
  if (!requireRole(authResult.admin, 'admin')) return createErrorResponse('Admin access required', 403);
  if (!supabase) return createErrorResponse('Supabase not configured', 503);

  const body = await request.json();
  const { email, action } = body;
  if (!email || !action) return createErrorResponse('email and action required', 400);
  if (!['ban', 'unban', 'suspend', 'unsuspend'].includes(action)) return createErrorResponse('Invalid action', 400);

  const isBanned = action === 'ban' || action === 'suspend';
  const isSuspended = action === 'suspend';

  try {
    const { error } = await supabase.from('user_profiles').upsert({
      email,
      is_banned: isBanned,
      is_suspended: isSuspended,
      banned_at: isBanned ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'email' });

    if (error) return createErrorResponse(error.message, 500);
    return createSuccessResponse({ success: true, email, status: isBanned ? 'banned' : 'active' });
  } catch (err) {
    return createErrorResponse(String(err), 500);
  }
};