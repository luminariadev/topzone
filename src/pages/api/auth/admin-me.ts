// src/pages/api/auth/admin-me.ts
// Get current admin session
export const prerender = false;
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { verifyAdminAuth, createSuccessResponse, createErrorResponse } from '../../../lib/admin-auth';

export const GET: APIRoute = async ({ cookies }) => {
  // Hardcoded admin fallback
  const token = cookies.get('sb-admin-token')?.value;
  const role = cookies.get('sb-admin-role')?.value;
  if (token && role === 'super_admin') {
    const adminEmail = cookies.get('sb-admin-email')?.value || 'admin@topzone.id';
    return createSuccessResponse({
      admin: { id: '1', email: adminEmail, full_name: 'Admin TopZone', role: 'super_admin' }
    });
  }

  if (!supabase) {
    return createErrorResponse('Supabase not configured', 401);
  }

  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success) {
    return createErrorResponse('Not authenticated', authResult.status || 401);
  }

  return createSuccessResponse({ admin: authResult.admin });
};
