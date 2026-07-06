import { s as supabase } from './supabase_BNdglYSt.mjs';

async function verifyAdminAuth(context) {
  if (!supabase) {
    return { success: false, error: "Supabase not configured", status: 503 };
  }
  const token = context.cookies.get("sb-admin-token")?.value;
  if (!token) {
    return { success: false, error: "Admin session required", status: 401 };
  }
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return { success: false, error: "Invalid or expired session", status: 401 };
    }
    const { data: adminData, error: adminError } = await supabase.from("admin_users").select("id, email, full_name, role, is_active").eq("email", user.email).single();
    if (adminError || !adminData || !adminData.is_active) {
      return { success: false, error: "Not authorized as admin", status: 403 };
    }
    return {
      success: true,
      admin: {
        id: adminData.id,
        email: adminData.email,
        full_name: adminData.full_name,
        role: adminData.role,
        is_active: adminData.is_active
      },
      status: 200
    };
  } catch (err) {
    console.error("[admin-auth] Authentication failed:", err);
    return { success: false, error: "Authentication failed", status: 401 };
  }
}
function createErrorResponse(error, status) {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}
function createSuccessResponse(data, status = 200) {
  return new Response(JSON.stringify({ success: true, ...data }), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}

export { createSuccessResponse as a, createErrorResponse as c, verifyAdminAuth as v };
