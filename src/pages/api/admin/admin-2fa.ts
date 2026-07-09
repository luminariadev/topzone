// src/pages/api/admin/admin-2fa.ts
// Admin 2FA management API - TOTP-based two-factor authentication
export const prerender = false;
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { verifyAdminAuth, createSuccessResponse, createErrorResponse } from '../../../lib/admin-auth';

export const GET: APIRoute = async ({ cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success) return createErrorResponse(authResult.error || 'Unauthorized', authResult.status);

  // Check if admin has 2FA enabled
  const { data } = await supabase
    .from('admin_users')
    .select('id')
    .eq('id', authResult.admin?.id)
    .single();

  return createSuccessResponse({
    enabled: false, // 2FA setup pending - requires TOTP library
    method: null,
  });
};

export const POST: APIRoute = async ({ request, cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success) return createErrorResponse(authResult.error || 'Unauthorized', authResult.status);

  const body = await request.json();
  const { action } = body;

  if (action === 'setup') {
    // Generate TOTP secret (placeholder - needs authenticator library)
    return createSuccessResponse({
      secret: 'PLACEHOLDER_SECRET_' + Date.now(),
      qr_code: null,
      message: '2FA setup - TOTP integration pending',
    });
  }

  if (action === 'verify') {
    const { code } = body;
    if (!code) return createErrorResponse('Verification code required', 400);
    // Placeholder verification
    return createSuccessResponse({ verified: true, message: '2FA verified (placeholder)' });
  }

  if (action === 'disable') {
    return createSuccessResponse({ disabled: true, message: '2FA disabled' });
  }

  return createErrorResponse('Invalid action', 400);
};
