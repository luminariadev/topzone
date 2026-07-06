import { s as supabase } from './supabase_BNdglYSt.mjs';

const prerender = false;
const POST = async ({ cookies }) => {
  if (!supabase) {
    return new Response(JSON.stringify({ error: "Supabase not configured" }), { status: 503, headers: { "Content-Type": "application/json" } });
  }
  const refreshToken = cookies.get("sb-refresh-token")?.value;
  if (!refreshToken) {
    return new Response(JSON.stringify({ error: "No refresh token" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }
  try {
    const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });
    if (error || !data.session) {
      return new Response(JSON.stringify({ error: "Failed to refresh session" }), { status: 401, headers: { "Content-Type": "application/json" } });
    }
    cookies.set("sb-auth-token", data.session.access_token, { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 7, sameSite: "lax" });
    cookies.set("sb-refresh-token", data.session.refresh_token, { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 30, sameSite: "lax" });
    return new Response(JSON.stringify({ success: true, user: data.session.user }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Token refresh failed" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
