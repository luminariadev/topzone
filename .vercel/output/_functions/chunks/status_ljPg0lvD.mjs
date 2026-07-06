const prerender = false;
const GET = async ({ url }) => {
  const orderId = url.searchParams.get("orderId");
  if (!orderId) {
    return new Response(JSON.stringify({ error: "orderId required" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }
  return new Response(JSON.stringify({ orderId, status: "pending", paymentUrl: "" }), { status: 200, headers: { "Content-Type": "application/json" } });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
