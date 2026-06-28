// src/lib/supabase.ts
import { createClient, type SupabaseClient, type AuthChangeEvent, type Session } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

const isConfigured = !!(supabaseUrl && supabaseAnonKey);

let supabaseInstance: SupabaseClient | null = null;

if (isConfigured) {
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn('Supabase not configured. Using fallback data.');
}

export const supabase = supabaseInstance;

interface SupabaseQueryOptions {
  select?: string;
}

interface SupabaseQueryResult<T = Record<string, unknown>> {
  data: T[] | null;
  error: Error | null;
}

export async function supabaseQuery<T = Record<string, unknown>>(
  table: string,
  options?: SupabaseQueryOptions
): Promise<SupabaseQueryResult<T>> {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };
  return supabase.from(table).select(options?.select || '*') as Promise<SupabaseQueryResult<T>>;
}

// ---- Auth Helpers ----

/** Listen to Supabase auth state changes. Returns unsubscribe function. */
export function onAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void,
) {
  if (!supabase) {
    console.warn('Supabase not configured — auth listener unavailable');
    return () => {};
  }
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
  return () => data?.subscription?.unsubscribe?.();
}

/** Get current session (restored from cookie/session). */
export async function getSession(): Promise<Session | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

/** Sign out from Supabase Auth. */
export async function signOut(): Promise<{ error: Error | null }> {
  if (!supabase) return { error: new Error('Supabase not configured') };
  const { error } = await supabase.auth.signOut();
  return { error };
}

/** Sign in with email and password. */
export async function signInWithPassword(email: string, password: string) {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };
  return supabase.auth.signInWithPassword({ email, password });
}

/** Sign up with email, password, and optional metadata. */
export async function signUp(email: string, password: string, fullName?: string) {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  });
}

/** Send password reset email. */
export async function resetPassword(email: string) {
  if (!supabase) return { error: new Error('Supabase not configured') };
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });
  return { error };
}

/** Update user password (used after reset). */
export async function updatePassword(newPassword: string) {
  if (!supabase) return { error: new Error('Supabase not configured') };
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  return { error };
}
