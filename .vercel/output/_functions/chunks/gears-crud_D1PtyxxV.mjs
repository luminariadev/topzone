import { s as supabase } from './supabase_BNdglYSt.mjs';

const prerender = false;
const GET = async () => {
  if (!supabase) return new Response(JSON.stringify({ gears: [] }), { status: 200, headers: { "Content-Type": "application/json" } });
  const { data } = await supabase.from("products").select("*").eq("type", "gear").order("name");
  return new Response(JSON.stringify({ gears: data || [] }), { status: 200, headers: { "Content-Type": "application/json" } });
};
const POST = async ({ request }) => {
  const gear = await request.json();
  if (!gear.name || !gear.slug) return new Response(JSON.stringify({ error: "Name and slug required" }), { status: 400, headers: { "Content-Type": "application/json" } });
  if (supabase) {
    const { data, error } = await supabase.from("products").insert({ slug: gear.slug, name: gear.name, type: "gear", img: gear.img || "/assets/default-gear.png", price: gear.price || 0, tag: gear.tag || "Gaming", category: gear.category || "keyboard", description: gear.description || "", specs: gear.specs || [], status: gear.status || "published", created_at: (/* @__PURE__ */ new Date()).toISOString() }).select().single();
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
    return new Response(JSON.stringify({ success: true, gear: data }), { status: 201, headers: { "Content-Type": "application/json" } });
  }
  return new Response(JSON.stringify({ success: true, gear }), { status: 201, headers: { "Content-Type": "application/json" } });
};
const PUT = async ({ request }) => {
  const gear = await request.json();
  if (!gear.slug) return new Response(JSON.stringify({ error: "Slug required" }), { status: 400, headers: { "Content-Type": "application/json" } });
  if (supabase) {
    const { error } = await supabase.from("products").update(gear).eq("slug", gear.slug);
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
