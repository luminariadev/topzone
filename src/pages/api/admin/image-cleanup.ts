// src/pages/api/admin/image-cleanup.ts
// Bulk image cleanup - remove orphaned images from storage
export const prerender = false;
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { verifyAdminAuth, createSuccessResponse, createErrorResponse, requireRole, logAdminAction } from '../../../lib/admin-auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success || !authResult.admin) return createErrorResponse(authResult.error || 'Unauthorized', authResult.status);
  if (!requireRole(authResult.admin, 'super_admin')) return createErrorResponse('Super Admin access required', 403);
  if (!supabase) return createErrorResponse('Supabase not configured', 503);

  try {
    const { productId } = await request.json();

    // Get all image records
    let query = supabase.from('product_images').select('id, product_id, storage_path');
    if (productId) query = query.eq('product_id', productId);
    const { data: images, error } = await query;
    if (error) return createErrorResponse(error.message, 500);

    // Check for orphaned images (no matching product)
    const { data: products } = await supabase.from('products').select('id');
    const validIds = new Set((products || []).map(p => p.id));
    const toDelete = (images || []).filter(img => !validIds.has(img.product_id));

    if (toDelete.length === 0) {
      return createSuccessResponse({ message: 'No orphaned images found', deleted: 0 });
    }

    // Delete from storage
    const paths = toDelete.map(i => i.storage_path).filter(Boolean);
    if (paths.length > 0) {
      await supabase.storage.from('product-images').remove(paths);
    }

    // Delete from database
    const ids = toDelete.map(i => i.id);
    const { error: delErr } = await supabase.from('product_images').delete().in('id', ids);
    if (delErr) return createErrorResponse(delErr.message, 500);

    await logAdminAction(authResult.admin, 'delete', 'product_images', null, {
      action: 'cleanup', count: toDelete.length,
    });

    return createSuccessResponse({ message: `Deleted ${toDelete.length} orphaned image(s)`, deleted: toDelete.length });
  } catch (err) {
    console.error('[image-cleanup] Error:', err);
    return createErrorResponse('Internal server error', 500);
  }
};