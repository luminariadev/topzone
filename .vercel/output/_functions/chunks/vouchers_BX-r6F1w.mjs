import { s as supabase } from './supabase_BNdglYSt.mjs';

const prerender = false;
const GET = async () => {
  if (!supabase) return new Response(JSON.stringify({ vouchers: [] }), { status: 200, headers: { "Content-Type": "application/json" } });
  const { data } = await supabase.from("vouchers").select("*").order("created_at", { ascending: false });
  return new Response(JSON.stringify({ vouchers: data || [] }), { status: 200, headers: { "Content-Type": "application/json" } });
};
const POST = async ({ request }) => {
  const v = await request.json();
  if (!v.code || !v.discount) return new Response(JSON.stringify({ error: "code and discount required" }), { status: 400, headers: { "Content-Type": "application/json" } });
  if (supabase) {
    const { data, error } = await supabase.from("vouchers").insert({
      code: v.code.toUpperCase(),
      discount: v.discount,
      discount_type: v.discount_type || "percentage",
      min_purchase: v.min_purchase || 0,
      max_uses: v.max_uses || null,
      used_count: 0,
      expires_at: v.expires_at || null,
      is_active: v.is_active !== false,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    }).select().single();
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
    return new Response(JSON.stringify({ success: true, voucher: data }), { status: 201, headers: { "Content-Type": "application/json" } });
  }
  return new Response(JSON.stringify({ success: true, voucher: v }), { status: 201, headers: { "Content-Type": "application/json" } });
};
const PUT = async ({ request }) => {
  const v = await request.json();
  if (!v.id) return new Response(JSON.stringify({ error: "id required" }), { status: 400, headers: { "Content-Type": "application/json" } });
  if (supabase) {
    const update = {};
    if (v.code) update.code = v.code.toUpperCase();
    if (v.discount !== void 0) update.discount = v.discount;
    if (v.discount_type) update.discount_type = v.discount_type;
    if (v.min_purchase !== void 0) update.min_purchase = v.min_purchase;
    if (v.max_uses !== void 0) update.max_uses = v.max_uses;
    if (v.is_active !== void 0) update.is_active = v.is_active;
    if (v.expires_at !== void 0) update.expires_at = v.expires_at;
    const { error } = await supabase.from("vouchers").update(update).eq("id", v.id);
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
  return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json" } });
};
const DELETE = async ({ url }) => {
  const id = url.searchParams.get("id");
  if (!id) return new Response(JSON.stringify({ error: "id required" }), { status: 400, headers: { "Content-Type": "application/json" } });
  if (supabase) {
    const { error } = await supabase.from("vouchers").update({ is_active: false }).eq("id", id);
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
  return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json" } });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  POST,
  PUT,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
