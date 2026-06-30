// src/pages/api/admin/validate-session.ts
// Admin session validation endpoint (used by frontend to check auth status)
export const prerender = false;
import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";
import { verifyAdminAuth, createSuccessResponse, createErrorResponse } from "../../../lib/admin-auth";

export const GET: APIRoute = async ({ cookies }) => {
  // Check hardcoded admin first
  const token = cookies.get("sb-admin-token")?.value;
  const role = cookies.get("sb-admin-role")?.value;
  if (token === "hardcoded-admin-token" && role === "super_admin") {
    return createSuccessResponse({
      admin: { id: "1", email: "admin@topzone.com", full_name: "Admin TopZone", role: "super_admin" },
    });
  }

  if (!supabase) {
    return createErrorResponse("Supabase not configured", 503);
  }

  const authResult = await verifyAdminAuth({ request: new Request("http://localhost"), cookies });
  if (!authResult.success) {
    return createErrorResponse(authResult.error || "Not authenticated", authResult.status);
  }

  return createSuccessResponse({ admin: authResult.admin });
};
