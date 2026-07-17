// src/lib/midtrans.ts
// Midtrans Snap integration utilities
// Supports both Sandbox and Production environments automatically

const MIDTRANS_CLIENT_KEY = import.meta.env.PUBLIC_MIDTRANS_CLIENT_KEY || '';
const IS_SANDBOX = import.meta.env.PUBLIC_MIDTRANS_SANDBOX === 'true';

/** Get the appropriate Snap script URL based on environment */
function getSnapScriptUrl(): string {
  return IS_SANDBOX
    ? 'https://app.sandbox.midtrans.com/snap/snap.js'
    : 'https://app.midtrans.com/snap/snap.js';
}

export function loadSnapScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('Not browser'));
    if ((window as any).snap) return resolve();
    const script = document.createElement('script');
    script.src = getSnapScriptUrl();
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
  const snapWin = window as unknown as SnapWindow;
  if (!snapWin.snap) { callbacks.onError?.(); return; }
  snapWin.snap.pay(token, {
    onSuccess: () => callbacks.onSuccess?.(),
    onPending: () => callbacks.onPending?.(),
    onError: () => callbacks.onError?.(),
  });
}

/**
 * Midtrans Snap window type declaration
 */
interface SnapWindow extends Window {
  snap?: {
    pay: (token: string, callbacks: { onSuccess: () => void; onPending: () => void; onError: () => void }) => void;
  };
}
