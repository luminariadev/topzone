import { s as supabase } from './supabase_BNdglYSt.mjs';
import { v as verifyAdminAuth, c as createErrorResponse, a as createSuccessResponse } from './admin-auth_CImgdqd8.mjs';

const prerender = false;
const GET = async ({ url, cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request("http://localhost"), cookies });
  if (!authResult.success) {
    return createErrorResponse("Not authenticated", authResult.status || 401);
  }
  const status = url.searchParams.get("status");
  const limit = parseInt(url.searchParams.get("limit") || "50");
  const offset = parseInt(url.searchParams.get("offset") || "0");
  if (!supabase) return createSuccessResponse({ orders: [] });
  let query = supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false }).range(offset, offset + limit - 1);
  if (status) query = query.eq("status", status);
  const { data, error } = await query;
  if (error) return createErrorResponse(error.message, 500);
  const { count } = await supabase.from("orders").select("*", { count: "exact", head: true });
  return createSuccessResponse({ orders: data || [], total: count || 0 });
};
const PUT = async ({ request, cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request("http://localhost"), cookies });
  if (!authResult.success) {
    return createErrorResponse("Not authenticated", authResult.status || 401);
  }
  const { order_id, status } = await request.json();
  if (!order_id || !status) return createErrorResponse("order_id and status required", 400);
  const valid = ["pending", "processing", "completed", "cancelled"];
  if (!valid.includes(status)) return createErrorResponse("Invalid status", 400);
  if (supabase) {
    const { error } = await supabase.from("orders").update({ status, updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", order_id);
    if (error) return createErrorResponse(error.message, 500);
  }
  return createSuccessResponse({ success: true });
};
const DELETE = async ({ url, cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request("http://localhost"), cookies });
  if (!authResult.success) {
    return createErrorResponse("Not authenticated", authResult.status || 401);
  }
  const orderId = url.searchParams.get("id");
  if (!orderId) return createErrorResponse("id required", 400);
  if (supabase) {
    const { error } = await supabase.from("orders").update({ status: "cancelled", updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", orderId);
    if (error) return createErrorResponse(error.message, 500);
  }
  return createSuccessResponse({ success: true });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  PUT,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
