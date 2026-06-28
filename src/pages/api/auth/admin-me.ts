// src/pages/api/auth/admin-me.ts
// Get current admin session
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const GET: APIRoute = async ({ cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success) {
    return createErrorResponse('Not authenticated', authResult.status || 401);
  }

  return createSuccessResponse({ admin: authResult.admin });
};
