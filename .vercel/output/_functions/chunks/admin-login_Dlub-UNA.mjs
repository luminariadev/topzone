import { s as supabase } from './supabase_BNdglYSt.mjs';

const prerender = false;
const POST = async ({ request, cookies }) => {
  const body = await request.json().catch(() => null);
  if (!body) {
    return new Response(JSON.stringify({ error: "Invalid request body" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }
  const { email, password } = body;
  if (!email || !password) {
    return new Response(JSON.stringify({ error: "Email and password required" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }
  if (!supabase) {
    return new Response(JSON.stringify({ error: "Supabase not configured" }), { status: 503, headers: { "Content-Type": "application/json" } });
  }
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError || !authData.user) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401, headers: { "Content-Type": "application/json" } });
    }
    const { data: adminData, error: adminError } = await supabase.from("admin_users").select("id, email, full_name, role, is_active").eq("email", email).single();
    if (adminError || !adminData || !adminData.is_active) {
      await supabase.auth.signOut();
      return new Response(JSON.stringify({ error: "Not authorized as admin" }), { status: 403, headers: { "Content-Type": "application/json" } });
    }
    await supabase.from("admin_users").update({ last_login: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", adminData.id);
    cookies.set("sb-admin-token", authData.session.access_token, { httpOnly: true, path: "/", maxAge: 60 * 30, sameSite: "lax" });
    cookies.set("sb-admin-refresh", authData.session.refresh_token, { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 7, sameSite: "lax" });
    cookies.set("sb-admin-role", adminData.role, { httpOnly: true, path: "/", maxAge: 60 * 30, sameSite: "lax" });
    return new Response(JSON.stringify({ success: true, admin: { id: adminData.id, email: adminData.email, full_name: adminData.full_name, role: adminData.role } }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("Admin login error:", err);
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
