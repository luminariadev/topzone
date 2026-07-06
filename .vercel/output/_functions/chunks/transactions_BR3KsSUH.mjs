import { s as supabase } from './supabase_BNdglYSt.mjs';

const prerender = false;
const GET = async ({ url }) => {
  const orderId = url.searchParams.get("orderId");
  if (!orderId) {
    return new Response(JSON.stringify({ error: "orderId required" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }
  if (supabase) {
    const { data, error } = await supabase.from("transactions").select("*").eq("order_id", orderId).order("created_at", { ascending: false });
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
    return new Response(JSON.stringify({ transactions: data || [] }), { status: 200, headers: { "Content-Type": "application/json" } });
  }
  const orders = JSON.parse(localStorage.getItem("topzone_orders") || "[]");
  const order = orders.find((o) => o.id === orderId);
  if (order) {
    return new Response(JSON.stringify({ transactions: order.transactions || [] }), { status: 200, headers: { "Content-Type": "application/json" } });
  }
  return new Response(JSON.stringify({ transactions: [] }), { status: 200, headers: { "Content-Type": "application/json" } });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
