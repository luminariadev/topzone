import { s as supabase } from './supabase_BNdglYSt.mjs';

const prerender = false;
const GET = async ({ cookies }) => {
  if (!supabase) {
    return new Response(JSON.stringify({ user: null, error: "Supabase not configured" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
  const token = cookies.get("sb-auth-token")?.value;
  if (!token) {
    return new Response(JSON.stringify({ user: null }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return new Response(JSON.stringify({ user: null }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ user: { id: user.id, email: user.email, name: user.user_metadata?.full_name || user.email?.split("@")[0] } }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch {
    return new Response(JSON.stringify({ user: null }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
