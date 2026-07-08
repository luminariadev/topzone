// src/pages/api/admin/system-health.ts
// Admin system health status API - checks database, auth, storage, and API health
export const prerender = false;
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { verifyAdminAuth, createSuccessResponse, createErrorResponse } from '../../../lib/admin-auth';

interface HealthCheck {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  latency?: number;
  message?: string;
}

export const GET: APIRoute = async ({ cookies }) => {
  const authResult = await verifyAdminAuth({ request: new Request('http://localhost'), cookies });
  if (!authResult.success) return createErrorResponse(authResult.error || 'Unauthorized', authResult.status);

  const checks: HealthCheck[] = [];

  const dbStart = Date.now();
  try {
    if (supabase) {
      const { error } = await supabase.from('admin_users').select('id', { count: 'exact', head: true });
      checks.push({ name: 'Database', status: error ? 'degraded' : 'healthy', latency: Date.now() - dbStart, message: error ? error.message : 'OK' });
    } else { checks.push({ name: 'Database', status: 'down', message: 'Not configured' }); }
  } catch (err) { checks.push({ name: 'Database', status: 'down', latency: Date.now() - dbStart, message: String(err) }); }

  const authStart = Date.now();
  try {
    if (supabase) {
      const { error } = await supabase.auth.getSession();
      checks.push({ name: 'Auth', status: error ? 'degraded' : 'healthy', latency: Date.now() - authStart, message: error ? error.message : 'OK' });
    } else { checks.push({ name: 'Auth', status: 'down', message: 'Not configured' }); }
  } catch (err) { checks.push({ name: 'Auth', status: 'down', latency: Date.now() - authStart, message: String(err) }); }

  const storageStart = Date.now();
  try {
    if (supabase) {
      const { error } = await supabase.storage.listBuckets();
      checks.push({ name: 'Storage', status: error ? 'degraded' : 'healthy', latency: Date.now() - storageStart, message: error ? error.message : 'OK' });
    } else { checks.push({ name: 'Storage', status: 'down', message: 'Not configured' }); }
  } catch (err) { checks.push({ name: 'Storage', status: 'down', latency: Date.now() - storageStart, message: String(err) }); }

  const prodStart = Date.now();
  try {
    if (supabase) {
      const { count } = await supabase.from('products').select('*', { count: 'exact', head: true });
      checks.push({ name: 'Products Table', status: 'healthy', latency: Date.now() - prodStart, message: `${count || 0} products` });
    } else { checks.push({ name: 'Products Table', status: 'down', message: 'Not configured' }); }
  } catch (err) { checks.push({ name: 'Products Table', status: 'down', latency: Date.now() - prodStart, message: String(err) }); }

  const orderStart = Date.now();
  try {
    if (supabase) {
      const { count } = await supabase.from('orders').select('*', { count: 'exact', head: true });
      checks.push({ name: 'Orders Table', status: 'healthy', latency: Date.now() - orderStart, message: `${count || 0} orders` });
    } else { checks.push({ name: 'Orders Table', status: 'down', message: 'Not configured' }); }
  } catch (err) { checks.push({ name: 'Orders Table', status: 'down', latency: Date.now() - orderStart, message: String(err) }); }

  const adminStart = Date.now();
  try {
    if (supabase) {
      const { count } = await supabase.from('admin_users').select('*', { count: 'exact', head: true });
      checks.push({ name: 'Admin Users', status: 'healthy', latency: Date.now() - adminStart, message: `${count || 0} admins` });
    } else { checks.push({ name: 'Admin Users', status: 'down', message: 'Not configured' }); }
  } catch (err) { checks.push({ name: 'Admin Users', status: 'down', latency: Date.now() - adminStart, message: String(err) }); }

  const voucherStart = Date.now();
  try {
    if (supabase) {
      const { count } = await supabase.from('vouchers').select('*', { count: 'exact', head: true });
      checks.push({ name: 'Vouchers Table', status: 'healthy', latency: Date.now() - voucherStart, message: `${count || 0} vouchers` });
    } else { checks.push({ name: 'Vouchers Table', status: 'down', message: 'Not configured' }); }
  } catch (err) { checks.push({ name: 'Vouchers Table', status: 'down', latency: Date.now() - voucherStart, message: String(err) }); }

  const overallStatus = checks.every(c => c.status === 'healthy') ? 'healthy' : checks.some(c => c.status === 'down') ? 'degraded' : 'healthy';

  return createSuccessResponse({
    status: overallStatus,
    checks,
    uptime: process.uptime(),
    memory: { used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024), total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) },
    checkedAt: new Date().toISOString(),
  });
};