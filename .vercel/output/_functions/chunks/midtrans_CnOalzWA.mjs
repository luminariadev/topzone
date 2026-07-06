import { s as supabase } from './supabase_BNdglYSt.mjs';

const prerender = false;
function verifySignature(request, payload) {
  const signatureHeader = request.headers.get("x-midtrans-signature");
  if (!signatureHeader) return false;
  return false;
}
async function isAlreadyProcessed(transactionId) {
  if (!supabase) return false;
  const { data } = await supabase.from("transactions").select("id").eq("midtrans_transaction_id", transactionId).single();
  return !!data;
}
const POST = async ({ request }) => {
  try {
    const notification = await request.json();
    const { order_id, transaction_status, fraud_status, payment_type, gross_amount, transaction_id } = notification;
    if (!verifySignature(request, notification)) {
      return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    if (transaction_id && await isAlreadyProcessed(transaction_id)) {
      return new Response(JSON.stringify({ success: true, status: "already_processed" }), { status: 200, headers: { "Content-Type": "application/json" } });
    }
    let newStatus = "pending";
    switch (transaction_status) {
      case "capture":
      case "settlement":
        newStatus = fraud_status === "challenge" ? "pending" : "completed";
        break;
      case "pending":
        newStatus = "pending";
        break;
      case "deny":
      case "cancel":
      case "expire":
        newStatus = "cancelled";
        break;
      default:
        newStatus = "pending";
    }
    if (supabase) {
      await supabase.from("orders").update({ status: newStatus, updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", order_id);
      await supabase.from("transactions").insert({ order_id, midtrans_transaction_id: transaction_id, payment_type, gross_amount, status: transaction_status, fraud_status, raw_response: JSON.stringify(notification), created_at: (/* @__PURE__ */ new Date()).toISOString() });
    }
    return new Response(JSON.stringify({ success: true, status: newStatus }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response(JSON.stringify({ error: "Webhook processing failed" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
};
const GET = async () => {
  return new Response(JSON.stringify({ message: "Midtrans webhook endpoint ready" }), { status: 200, headers: { "Content-Type": "application/json" } });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
