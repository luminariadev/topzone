import { s as supabase } from './supabase_BNdglYSt.mjs';

const prerender = false;
const START_TIME = Date.now();
const GET = async () => {
  const checks = [];
  let allOk = true;
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
  const uptime = Math.floor((Date.now() - START_TIME) / 1e3);
  const mem = process.memoryUsage();
  return new Response(
    JSON.stringify({
      status: allOk ? "ok" : "degraded",
      version: "1.0.0",
      environment: "production" ,
      checks,
      meta: {
        uptime: `${uptime}s`,
        memory: {
          heapUsed: `${Math.round(mem.heapUsed / 1024 / 1024)}MB`,
          heapTotal: `${Math.round(mem.heapTotal / 1024 / 1024)}MB`,
          rss: `${Math.round(mem.rss / 1024 / 1024)}MB`
        },
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }
    }),
    {
      status: allOk ? 200 : 503,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, max-age=0"
      }
    }
  );
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
