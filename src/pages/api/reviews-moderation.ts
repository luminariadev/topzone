// src/pages/api/reviews-moderation.ts
// Admin review moderation API — approve, reject, or reply to reviews

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    const body = await request.json();
    const { action, reviewId, replyText, adminId } = body;

    if (!action || !reviewId) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400, headers: corsHeaders,
      });
    }

    // Dynamic import to avoid top-level await issues
    const { supabase } = await import('../../lib/supabase');
    const { verifyAdminSession } = await import('../../middleware/auth');

    const adminAuth = await verifyAdminSession(request);
    if (!adminAuth) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: corsHeaders,
      });
    }

    const admin_id = adminAuth.id;

    switch (action) {
      case 'approve': {
        const { error } = await supabase!
          .from('reviews')
          .update({ 
            is_approved: true, 
            approved_at: new Date().toISOString(),
            approved_by: admin_id 
          })
          .eq('id', reviewId);

        if (error) throw error;

        // Log to audit
        await supabase!.from('audit_log').insert({
          admin_id,
          action: 'approve_review',
          resource: 'reviews',
          resource_id: reviewId,
          description: 'Approved review',
        });

        return new Response(JSON.stringify({ success: true, message: 'Review approved' }), {
          status: 200, headers: corsHeaders,
        });
      }

      case 'reject': {
        const { error } = await supabase!
          .from('reviews')
          .update({ 
            is_approved: false,
            approved_at: new Date().toISOString(),
            approved_by: admin_id
          })
          .eq('id', reviewId);

        if (error) throw error;

        await supabase!.from('audit_log').insert({
          admin_id,
          action: 'reject_review',
          resource: 'reviews',
          resource_id: reviewId,
          description: 'Rejected review',
        });

        return new Response(JSON.stringify({ success: true, message: 'Review rejected' }), {
          status: 200, headers: corsHeaders,
        });
      }

      case 'reply': {
        if (!replyText || replyText.trim().length === 0) {
          return new Response(JSON.stringify({ error: 'Reply text is required' }), {
            status: 400, headers: corsHeaders,
          });
        }

        const { error } = await supabase!
          .from('reviews')
          .update({ 
            admin_reply: replyText.trim(),
            replied_at: new Date().toISOString(),
            replied_by: admin_id
          })
          .eq('id', reviewId);

        if (error) throw error;

        await supabase!.from('audit_log').insert({
          admin_id,
          action: 'reply_review',
          resource: 'reviews',
          resource_id: reviewId,
          description: `Admin replied to review: ${replyText.slice(0, 100)}`,
        });

        return new Response(JSON.stringify({ success: true, message: 'Reply added' }), {
          status: 200, headers: corsHeaders,
        });
      }

      default:
        return new Response(JSON.stringify({ error: 'Unknown action' }), {
          status: 400, headers: corsHeaders,
        });
    }
  } catch (err) {
    console.error('[reviews-moderation] Error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: corsHeaders,
    });
  }
};

export const OPTIONS: APIRoute = () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};