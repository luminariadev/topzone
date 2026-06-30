// src/pages/api/health/index.ts
// Health check endpoint for uptime monitoring and load balancers
export const prerender = false;
import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const GET: APIRoute = async () => {
  const checks: Record<string, string> = {};
  let allOk = true;

  // Check Supabase connectivity
  if (supabase) {
    try {
      const { error } = await supabase.from("orders").select("id").limit(1);
      checks.database = error ? "error" : "ok";
      if (error) allOk = false;
    } catch {
      checks.database = "error";
      allOk = false;
    }
  } else {
    checks.database = "not_configured";
  }

  checks.uptime = process.uptime().toFixed(0) + "s";
  checks.timestamp = new Date().toISOString();

  return new Response(
    JSON.stringify({ status: allOk ? "ok" : "degraded", checks }),
    {
      status: allOk ? 200 : 503,
      headers: { "Content-Type": "application/json" },
    }
  );
};
