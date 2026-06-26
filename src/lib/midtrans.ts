// src/lib/midtrans.ts
// Midtrans Snap integration utilities

const MIDTRANS_CLIENT_KEY = import.meta.env.PUBLIC_MIDTRANS_CLIENT_KEY || '';

export function loadSnapScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('Not browser'));
    if ((window as any).snap) return resolve();
    const script = document.createElement('script');
    script.src = 'https://app.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', MIDTRANS_CLIENT_KEY);
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Midtrans Snap'));
    document.body.appendChild(script);
  });
}

export async function createSnapTransaction(orderId: string, total: number, customer: { name: string; email: string; phone: string }) {
  if (!MIDTRANS_CLIENT_KEY) { console.warn('Midtrans not configured, using fallback'); return null; }
  const response = await fetch('/api/checkout/snap', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, total, customer }),
  });
  if (!response.ok) { const err = await response.json().catch(() => ({ error: 'Snap failed' })); throw new Error(err.error); }
  const data = await response.json();
  return data.token;
}

export function openSnapPayment(token: string, callbacks: { onSuccess?: () => void; onPending?: () => void; onError?: () => void }) {
  if (!(window as any).snap) { console.error('Snap not loaded'); callbacks.onError?.(); return; }
  (window as any).snap.pay(token, {
    onSuccess: () => callbacks.onSuccess?.(),
    onPending: () => callbacks.onPending?.(),
    onError: () => callbacks.onError?.(),
    onClose: () => console.log('Snap popup closed'),
  });
}
