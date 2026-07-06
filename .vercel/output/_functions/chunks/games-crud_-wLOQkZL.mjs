import { s as supabase } from './supabase_BNdglYSt.mjs';

const prerender = false;
const GET = async () => {
  if (!supabase) return new Response(JSON.stringify({ games: [] }), { status: 200, headers: { "Content-Type": "application/json" } });
  const { data } = await supabase.from("products").select("*").eq("type", "game").order("name");
  return new Response(JSON.stringify({ games: data || [] }), { status: 200, headers: { "Content-Type": "application/json" } });
};
const POST = async ({ request }) => {
  const game = await request.json();
  if (!game.name || !game.slug) return new Response(JSON.stringify({ error: "Name and slug required" }), { status: 400, headers: { "Content-Type": "application/json" } });
  if (supabase) {
    const { data, error } = await supabase.from("products").insert({ slug: game.slug, name: game.name, type: "game", img: game.img || "/assets/default-game.png", color: game.color || "#39FF14", badge: game.badge || "New", category: game.category || "mobile", currency: game.currency || "Diamond", description: game.description || "", packages: game.packages || [], status: game.status || "published", created_at: (/* @__PURE__ */ new Date()).toISOString() }).select().single();
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
    return new Response(JSON.stringify({ success: true, game: data }), { status: 201, headers: { "Content-Type": "application/json" } });
  }
  return new Response(JSON.stringify({ success: true, game }), { status: 201, headers: { "Content-Type": "application/json" } });
};
const PUT = async ({ request }) => {
  const game = await request.json();
  if (!game.slug) return new Response(JSON.stringify({ error: "Slug required" }), { status: 400, headers: { "Content-Type": "application/json" } });
  if (supabase) {
    const { error } = await supabase.from("products").update(game).eq("slug", game.slug);
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
  return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json" } });
};
const DELETE = async ({ url }) => {
  const slug = url.searchParams.get("slug");
  if (!slug) return new Response(JSON.stringify({ error: "Slug required" }), { status: 400, headers: { "Content-Type": "application/json" } });
  if (supabase) {
    const { error } = await supabase.from("products").update({ is_deleted: true, status: "archived" }).eq("slug", slug);
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
