const CACHE_NAME = 'turnos-v4';
const urlsToCache = [
  '/manifest.json',
  '/icon.svg',
  '/logo.jpg',
  '/badge.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// ESCUCHAR MENSAJES DE PROGRAMACIÓN DE RECORDATORIOS EN SEGUNDO PLANO
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SCHEDULE_REMINDER') {
    const { title, body, delayMs } = event.data;

    if (delayMs && delayMs > 0) {
      setTimeout(() => {
        self.registration.showNotification(title, {
          body,
          icon: '/icon.svg',
          badge: '/badge.svg',
          vibrate: [300, 100, 300, 100, 500],
          tag: 'turno-bg-reminder-' + Date.now(),
          renotify: true,
          requireInteraction: true
        });
      }, delayMs);
    }
  }
});

// Manejar clic en la notificación
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (
    url.pathname === '/' ||
    url.pathname.endsWith('.html') ||
    url.pathname.startsWith('/@') || 
    url.pathname.startsWith('/src/') || 
    url.pathname.startsWith('/api/') || 
    url.pathname.startsWith('/assets/') ||
    event.request.method !== 'GET'
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }).catch(() => fetch(event.request))
  );
});
