const prerender = false;
const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const { items } = body;
    if (!items || !Array.isArray(items)) {
      return new Response(JSON.stringify({ error: "Invalid items" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    const results = items.map((item) => ({
      id: item.id || "unknown",
      name: item.name || "unknown",
      requested: item.qty || 0,
      available: true,
      stock: 999
    }));
    const allAvailable = results.every((r) => r.available);
    return new Response(JSON.stringify({ success: true, allAvailable, results }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Stock validation error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
