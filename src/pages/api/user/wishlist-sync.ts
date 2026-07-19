import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

const SUPABASE_WISHLIST_KEY = 'topzone_wishlist_';

/**
 * POST /api/user/wishlist-sync — sync local wishlist with Supabase
 * Body: { items: WishlistItem[] }  (local wishlist items)
 * Reads user from session, merges with Supabase, returns merged list.
 */
export const POST: APIRoute = async ({ request }) => {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), {
      status: 401, headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const localItems: any[] = Array.isArray(body?.items) ? body.items : [];

    const key = SUPABASE_WISHLIST_KEY + user.email.replace(/[^a-zA-Z0-9]/g, '_');

    // Load existing Supabase wishlist
    const { data: existing } = await supabase
      .from('user_data')
      .select('value')
      .eq('key', key)
      .single();

    const supabaseItems: any[] = existing?.value ? JSON.parse(existing.value) : [];

    // Merge: local items take priority for adding, supabase for existing items
    const mergedMap = new Map<string, any>();

    // Add Supabase items first
    supabaseItems.forEach((item) => mergedMap.set(item.id, item));

    // Override/merge with local items
    localItems.forEach((localItem) => {
      const existing = mergedMap.get(localItem.id);
      if (existing) {
        // Keep the one with more recent addedAt
        mergedMap.set(localItem.id,
          (existing.addedAt ?? 0) >= (localItem.addedAt ?? 0) ? existing : localItem
        );
      } else {
        mergedMap.set(localItem.id, localItem);
      }
    });

    const merged = Array.from(mergedMap.values());

    // Save merged to Supabase
    await supabase.from('user_data').upsert({
      key,
      value: JSON.stringify(merged),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'key' });

    return new Response(JSON.stringify({
      success: true,
      items: merged,
      synced: true,
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
};

/**
 * GET /api/user/wishlist-sync — get wishlist from Supabase (for logged-in users)
 */
export const GET: APIRoute = async () => {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), {
      status: 401, headers: { 'Content-Type': 'application/json' },
    });
  }

  const key = SUPABASE_WISHLIST_KEY + user.email.replace(/[^a-zA-Z0-9]/g, '_');
  const { data } = await supabase
    .from('user_data')
    .select('value')
    .eq('key', key)
    .single();

  const items = data?.value ? JSON.parse(data.value) : [];

  return new Response(JSON.stringify({ items }), {
    status: 200, headers: { 'Content-Type': 'application/json' },
  });
};