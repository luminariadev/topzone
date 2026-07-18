// src/lib/notification.ts
// Notification utilities — send toast, push, and email notifications

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: Record<string, unknown>;
  tag?: string;
  timestamp?: number;
}

/**
 * Request push notification permission
 */
export async function requestPushPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch {
    return false;
  }
}

/**
 * Show a browser push notification
 */
export function sendBrowserNotification(payload: NotificationPayload): void {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  try {
    new Notification(payload.title, {
      body: payload.body,
      icon: payload.icon || '/favicon.svg',
      badge: payload.badge || '/favicon.svg',
      data: payload.data || {},
      tag: payload.tag || `notification-${Date.now()}`,
      timestamp: payload.timestamp || Date.now(),
    });
  } catch (err) {
    console.warn('[Notification] Failed to send:', err);
  }
}

/**
 * Send notification via push subscription (service worker)
 */
export async function sendPushViaServiceWorker(
  subscription: PushSubscription,
  payload: NotificationPayload
): Promise<boolean> {
  try {
    const response = await fetch('/api/notifications/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscription,
        payload: {
          title: payload.title,
          body: payload.body,
          icon: payload.icon || '/favicon.svg',
          badge: payload.badge || '/favicon.svg',
          data: payload.data || {},
          tag: payload.tag,
          timestamp: payload.timestamp,
        },
      }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Subscribe to push notifications
 */
export async function subscribeToPush(): Promise<PushSubscription | null> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return null;

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        import.meta.env.PUBLIC_VAPID_PUBLIC_KEY || ''
      ),
    });
    return subscription;
  } catch (err) {
    console.warn('[Notification] Push subscribe failed:', err);
    return null;
  }
}

/**
 * Helper to convert VAPID key from base64 to Uint8Array
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Check if there are unread notifications and alert the user
 */
export function checkUnreadNotifications(key: string): number {
  try {
    const notifications = JSON.parse(localStorage.getItem(key) || '[]');
    const unread = notifications.filter((n: { read: boolean }) => !n.read).length;
    return unread;
  } catch {
    return 0;
  }
}

/**
 * Schedule a local notification reminder (uses setTimeout)
 */
export function scheduleLocalNotification(
  title: string,
  body: string,
  delayMs: number
): number {
  if (typeof window === 'undefined') return 0;

  return window.setTimeout(() => {
    sendBrowserNotification({ title, body, tag: 'scheduled-reminder' });
  }, delayMs);
}

/**
 * Cancel a scheduled notification
 */
export function cancelScheduledNotification(timeoutId: number): void {
  if (typeof window !== 'undefined' && timeoutId) {
    clearTimeout(timeoutId);
  }
}