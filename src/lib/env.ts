// src/lib/env.ts
// Environment variable validation with Zod
import { z } from "zod";

const envSchema = z.object({
  PUBLIC_SUPABASE_URL: z.string().url().optional(),
  PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  PUBLIC_MIDTRANS_CLIENT_KEY: z.string().min(1).optional(),
  MIDTRANS_SERVER_KEY: z.string().min(1).optional(),
  MIDTRANS_PRODUCTION: z.enum(["true","false"]).optional().default("false"),
  SITE_URL: z.string().url().optional().default("https://topzone.vercel.app"),
  ADMIN_HARDCODED_FALLBACK: z.enum(["true","false"]).optional().default("false"),
});

function validateEnv() {
  if (typeof import.meta === "undefined") return;
  const env = {
    PUBLIC_SUPABASE_URL: import.meta.env.PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY: import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
    PUBLIC_MIDTRANS_CLIENT_KEY: import.meta.env.PUBLIC_MIDTRANS_CLIENT_KEY,
    MIDTRANS_SERVER_KEY: import.meta.env.MIDTRANS_SERVER_KEY,
    MIDTRANS_PRODUCTION: import.meta.env.MIDTRANS_PRODUCTION,
    SITE_URL: import.meta.env.SITE_URL,
    ADMIN_HARDCODED_FALLBACK: import.meta.env.ADMIN_HARDCODED_FALLBACK,
  };
  const result = envSchema.safeParse(env);
  if (!result.success) {
    const missing = result.error.issues.map(i => i.path.join(".")+": "+i.message).join(", ");
    if (import.meta.env.PROD) {
      console.error("[env] CRITICAL - Production missing required config: "+missing);
    } else {
      console.warn("[env] Configuration warnings: "+missing);
    }
  }
  return result.data;
}

export const env = validateEnv();
export { envSchema };
