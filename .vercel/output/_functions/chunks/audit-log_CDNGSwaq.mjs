import { s as supabase } from './supabase_BNdglYSt.mjs';

const prerender = false;
const GET = async ({ url }) => {
  const limit = parseInt(url.searchParams.get("limit") || "50");
  const adminEmail = url.searchParams.get("admin");
  if (!supabase) return new Response(JSON.stringify({ logs: [] }), { status: 200, headers: { "Content-Type": "application/json" } });
  let query = supabase.from("audit_log").select("*").order("created_at", { ascending: false }).limit(limit);
  if (adminEmail) query = query.eq("admin_email", adminEmail);
  const { data, error } = await query;
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  return new Response(JSON.stringify({ logs: data || [] }), { status: 200, headers: { "Content-Type": "application/json" } });
};
const POST = async ({ request }) => {
  const log = await request.json();
  if (!log.admin_email || !log.action || !log.entity_type) {
    return new Response(JSON.stringify({ error: "admin_email, action, entity_type required" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }
  if (supabase) {
    const { error } = await supabase.from("audit_log").insert({
      admin_email: log.admin_email,
      action: log.action,
      entity_type: log.entity_type,
      entity_id: log.entity_id || null,
      details: log.details || {},
      ip_address: log.ip_address || null,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    });
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
  return new Response(JSON.stringify({ success: true }), { status: 201, headers: { "Content-Type": "application/json" } });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
