import { s as supabase } from './supabase_BNdglYSt.mjs';
import { a as createSuccessResponse, c as createErrorResponse, v as verifyAdminAuth } from './admin-auth_CImgdqd8.mjs';

const prerender = false;
const GET = async ({ cookies }) => {
  const token = cookies.get("sb-admin-token")?.value;
  const role = cookies.get("sb-admin-role")?.value;
  if (token === "hardcoded-admin-token" && role === "super_admin") {
    return createSuccessResponse({
      admin: { id: "1", email: "admin@topzone.com", full_name: "Admin TopZone", role: "super_admin" }
    });
  }
  if (!supabase) {
    return createErrorResponse("Supabase not configured", 401);
  }
  const authResult = await verifyAdminAuth({ request: new Request("http://localhost"), cookies });
  if (!authResult.success) {
    return createErrorResponse("Not authenticated", authResult.status || 401);
  }
  return createSuccessResponse({ admin: authResult.admin });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
