// src/pages/api/health/index.ts
// Health check endpoint for uptime monitoring and load balancers
export const prerender = false;
import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

interface HealthCheck {
  name: string;
  status: "ok" | "error" | "not_configured";
  detail?: string;
}

const START_TIME = Date.now();

export const GET: APIRoute = async () => {
  const checks: HealthCheck[] = [];
  let allOk = true;

  // Check Supabase connectivity
  if (supabase) {
    try {
      const { error } = await supabase.from("orders").select("id").limit(1);
      checks.push({ name: "supabase", status: error ? "error" : "ok", detail: error?.message });
      if (error) allOk = false;
    } catch (err) {
      checks.push({ name: "supabase", status: "error", detail: String(err) });
      allOk = false;
    }
  } else {
    checks.push({ name: "supabase", status: "not_configured" });
  }

  const uptime = Math.floor((Date.now() - START_TIME) / 1000);
  const mem = process.memoryUsage();

  return new Response(
    JSON.stringify({
      status: allOk ? "ok" : "degraded",
      version: "1.0.0",
      environment: import.meta.env.PROD ? "production" : "development",
      checks,
      meta: {
        uptime: `${uptime}s`,
        memory: {
          heapUsed: `${Math.round(mem.heapUsed / 1024 / 1024)}MB`,
          heapTotal: `${Math.round(mem.heapTotal / 1024 / 1024)}MB`,
          rss: `${Math.round(mem.rss / 1024 / 1024)}MB`,
        },
        timestamp: new Date().toISOString(),
      },
    }),
    {
      status: allOk ? 200 : 503,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
};
