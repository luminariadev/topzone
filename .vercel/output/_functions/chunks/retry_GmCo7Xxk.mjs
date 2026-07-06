const prerender = false;
const POST = async ({ request }) => {
  const body = await request.json();
  const { orderId, total, customer } = body;
  if (!orderId || !total || !customer) {
    return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }
  const serverKey = undefined                                   ;
  const baseUrl = "https://api.sandbox.midtrans.com";
  const response = await fetch(`${baseUrl}/v1/payment-links`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Basic " + btoa(serverKey + ":") },
    body: JSON.stringify({
      transaction_details: { order_id: orderId, gross_amount: total },
      customer: { first_name: customer.name, phone: customer.phone, email: customer.email },
      payment_link: { custom_expiry: { duration: 1, unit: "hours" } }
    })
  });
  const data = await response.json();
  return new Response(JSON.stringify({ success: true, token: data.token, redirect_url: data.payment_url }), { status: 200, headers: { "Content-Type": "application/json" } });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
