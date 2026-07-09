// src/pages/api/admin/canned-responses.ts
// Admin canned responses API - pre-made reply templates
export const prerender = false;
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { verifyAdminAuth, createSuccessResponse, createErrorResponse, requireRole } from '../../../lib/admin-auth';

const DEFAULT_RESPONSES = [
  { id: 'welcome', title: 'Selamat Datang', category: 'support', content: 'Halo! Selamat datang di TopZone. Ada yang bisa kami bantu?' },
  { id: 'payment_success', title: 'Pembayaran Berhasil', category: 'order', content: 'Pembayaran Anda telah berhasil diproses. Pesanan sedang diproses dan akan segera dikirim.' },
  { id: 'order_delayed', title: 'Pesanan Tertunda', category: 'order', content: 'Mohon maaf atas keterlambatan. Pesanan Anda sedang dalam proses dan akan segera selesai.' },
  { id: 'refund_info', title: 'Info Refund', category: 'order', content: 'Refund akan diproses dalam 1-3 hari kerja ke metode pembayaran awal.' },
  { id: 'account_issue', title: 'Masalah Akun', category: 'account', content: 'Silakan reset password Anda melalui halaman forgot password. Jika masih bermasalah, hubungi kami.' },
  { id: 'thank_you', title: 'Terima Kasih', category: 'support', content: 'Terima kasih telah menghubungi TopZone. Semoga harimu menyenangkan! 🎮' },
];

export const GET: APIRoute = async ({ cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success) return createErrorResponse(authResult.error || 'Unauthorized', authResult.status);
  if (!requireRole(authResult.admin, 'staff')) return createErrorResponse('Staff access required', 403);

  if (!supabase) return createSuccessResponse({ responses: DEFAULT_RESPONSES });

  try {
    const { data } = await supabase.from('site_config')
      .select('value').eq('key', 'canned_responses').single();
    if (data?.value) {
      return createSuccessResponse({ responses: JSON.parse(data.value) });
    }
    return createSuccessResponse({ responses: DEFAULT_RESPONSES });
  } catch (err) {
    return createSuccessResponse({ responses: DEFAULT_RESPONSES });
  }
};

export const PUT: APIRoute = async ({ request, cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success) return createErrorResponse(authResult.error || 'Unauthorized', authResult.status);
  if (!requireRole(authResult.admin, 'super_admin')) return createErrorResponse('Super admin access required', 403);

  const body = await request.json();
  const { responses } = body;
  if (!responses) return createErrorResponse('responses required', 400);

  try {
    await supabase.from('site_config').upsert({
      key: 'canned_responses', value: JSON.stringify(responses),
      category: 'admin', updated_at: new Date().toISOString(),
    }, { onConflict: 'key' });
    return createSuccessResponse({ success: true });
  } catch (err) {
    return createErrorResponse(String(err), 500);
  }
};
