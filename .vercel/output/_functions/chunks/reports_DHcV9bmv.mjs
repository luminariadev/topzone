import { s as supabase } from './supabase_BNdglYSt.mjs';

const prerender = false;
const GET = async ({ url }) => {
  if (!supabase) return new Response(JSON.stringify({ stats: null }), { status: 200, headers: { "Content-Type": "application/json" } });
  const period = url.searchParams.get("period") || "all";
  let dateFilter = "";
  const now = /* @__PURE__ */ new Date();
  if (period === "today") {
    dateFilter = now.toISOString().slice(0, 10);
  } else if (period === "week") {
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1e3).toISOString();
    dateFilter = weekAgo;
  } else if (period === "month") {
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1e3).toISOString();
    dateFilter = monthAgo;
  }
  try {
    let orderQuery = supabase.from("orders").select("*", { count: "exact", head: true });
    let revenueQuery = supabase.from("orders").select("total");
    let statusQuery = supabase.from("orders").select("status");
    if (dateFilter) {
      const op = period === "today" ? "gte" : "gte";
      orderQuery = orderQuery[op]("created_at", dateFilter);
      revenueQuery = revenueQuery[op]("created_at", dateFilter);
      statusQuery = statusQuery[op]("created_at", dateFilter);
    }
    const { count: totalOrders } = await orderQuery;
    const { data: revenueData } = await revenueQuery;
    const { data: statusData } = await statusQuery;
    const totalRevenue = (revenueData || []).reduce((sum, o) => sum + (o.total || 0), 0);
    const statusCounts = (statusData || []).reduce((acc, o) => {
      acc[o.status || "unknown"] = (acc[o.status || "unknown"] || 0) + 1;
      return acc;
    }, {});
    const recentQuery = supabase.from("orders").select("created_at, total").order("created_at", { ascending: true }).limit(30);
    if (dateFilter) recentQuery.gte("created_at", dateFilter);
    const { data: chartData } = await recentQuery;
    const { count: totalGames } = await supabase.from("products").select("*", { count: "exact", head: true }).eq("type", "game").neq("is_deleted", true);
    const { count: totalGears } = await supabase.from("products").select("*", { count: "exact", head: true }).eq("type", "gear").neq("is_deleted", true);
    return new Response(JSON.stringify({
      stats: {
        totalOrders: totalOrders || 0,
        totalRevenue,
        totalGames: totalGames || 0,
        totalGears: totalGears || 0,
        statusCounts,
        chartData: chartData || []
      }
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("Reports error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
};
const POST = async () => {
  if (!supabase) return new Response(JSON.stringify({ error: "Supabase not configured" }), { status: 503 });
  const { data: orders } = await supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false });
  if (!orders || orders.length === 0) {
    return new Response(JSON.stringify({ error: "No data" }), { status: 404 });
  }
  const csv = "\uFEFFID Order,Pelanggan,Email,Total Items,Total Harga,Status,Pembayaran,Tanggal\n" + orders.map(
    (o) => `${o.id || ""},${(o.customer_name || "").replace(/,/g, " ")},${o.customer_email || ""},${(o.order_items || []).length},${o.total || 0},${o.status || ""},${o.payment_method || ""},${o.created_at || ""}`
  ).join("\n");
  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="topzone-report-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv"`
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
