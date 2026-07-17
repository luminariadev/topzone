// public/sw-background-sync.js
// Service Worker background sync script for pending orders
// Loaded by vite-plugin-pWA workbox for runtime caching

// Background sync for pending orders when coming back online
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-pending-orders') {
    event.waitUntil(syncPendingOrders());
  }
});

async function syncPendingOrders() {
  try {
    // Get pending orders from IndexedDB
    const db = await openOrderDB();
    const pending = await db.getAll('pending-orders');
    
    for (const order of pending) {
      try {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(order),
        });
        
        if (response.ok) {
          await db.delete('pending-orders', order.id);
          // Notify the user
          self.registration.showNotification('TopZone', {
            body: '✅ Pesanan berhasil diproses!',
            icon: '/pwa-192x192.png',
            badge: '/favicon.svg',
            tag: 'order-sync',
          });
        }
      } catch (err) {
        console.error('Failed to sync order:', order.id, err);
      }
    }
  } catch (err) {
    console.error('Background sync failed:', err);
  }
}

// IndexedDB helper for pending orders
function openOrderDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('TopZoneOffline', 1);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pending-orders')) {
        db.createObjectStore('pending-orders', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('cart-backup')) {
        db.createObjectStore('cart-backup', { keyPath: 'sessionId' });
      }
    };
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const tx = db.transaction(['pending-orders', 'cart-backup'], 'readwrite');
      resolve({
        getAll: (store) => new Promise((res, rej) => {
          const req = tx.objectStore(store).getAll();
          req.onsuccess = () => res(req.result);
          req.onerror = () => rej(req.error);
        }),
        delete: (store, id) => new Promise((res, rej) => {
          const req = tx.objectStore(store).delete(id);
          req.onsuccess = () => res();
          req.onerror = () => rej(req.error);
        }),
      });
    };
    
    request.onerror = () => reject(request.error);
  });
}

// Periodically check connectivity and attempt sync
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'pending-orders-sync') {
    event.waitUntil(syncPendingOrders());
  }
});

// Cache cart data for offline use
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Cache product detail pages for offline reading
  if (url.pathname.startsWith('/games/') || url.pathname.startsWith('/gear/')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return cached || fetch(event.request).then((response) => {
          const clone = response.clone();
          caches.open('product-pages-cache').then((cache) => {
            cache.put(event.request, clone);
          });
          return response;
        });
      })
    );
  }
});