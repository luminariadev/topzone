import { z } from 'zod';
import { s as supabase } from './supabase_BNdglYSt.mjs';

const prerender = false;
const CheckoutItemSchema = z.object({
  id: z.string().min(1, "Item id required"),
  name: z.string().min(1, "Item name required").optional(),
  price: z.number().positive("Price must be positive"),
  qty: z.number().int().positive("Quantity must be positive"),
  img: z.string().optional(),
  type: z.enum(["game", "gear"]).optional()
});
const CheckoutSchema = z.object({
  items: z.array(CheckoutItemSchema).min(1, "Cart cannot be empty").max(100, "Too many items"),
  name: z.string().min(2, "Name is required").max(100),
  phone: z.string().min(8, "Valid phone required").max(20).regex(/^[0-9+\-\s()]+$/, "Invalid phone format"),
  payment: z.enum(["bank", "ewallet", "gopay"]).default("bank"),
  voucherCode: z.string().max(50).optional()
});
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}
const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const parsed = CheckoutSchema.safeParse(body);
    if (!parsed.success) {
      const fields = parsed.error.issues.map((i) => ({
        field: i.path.join("."),
        message: i.message,
        code: i.code
      }));
      return jsonResponse({ error: "Validation failed", fields }, 400);
    }
    const { items, name, phone, payment, voucherCode } = parsed.data;
    let validatedTotal = 0;
    for (const item of items) {
      validatedTotal += item.price * item.qty;
    }
    let discount = 0;
    if (voucherCode && voucherCode.startsWith("WELCOME-")) {
      discount = 10;
      validatedTotal = Math.round(validatedTotal * (100 - discount) / 100);
    }
    const orderId = "ORD-" + Date.now() + "-" + Math.random().toString(36).substr(2, 5).toUpperCase();
    if (supabase) {
      await supabase.from("orders").insert({
        id: orderId,
        customer_name: name,
        customer_phone: phone,
        payment_method: payment,
        total: validatedTotal,
        discount,
        status: "pending",
        items: JSON.stringify(items),
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      }).catch((e) => {
        console.error("DB save failed:", e);
      });
    }
    return jsonResponse({ success: true, orderId, total: validatedTotal, discount });
  } catch (err) {
    console.error("Checkout error:", err);
    return jsonResponse({ error: "Internal server error" }, 500);
  }
};
const GET = async () => {
  return jsonResponse({ message: "Checkout API ready", version: "1.0.0" });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
