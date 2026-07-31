const CACHE_NAME = 'turnos-v5';
const urlsToCache = [
  '/manifest.json',
  '/icon.svg',
  '/logo.jpg',
  '/badge.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
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

// PROGRAMAR NOTIFICACIÓN DIARIA AUTOMÁTICA A LAS 20:00 HS EN SEGUNDO PLANO
const scheduleDaily20pmAlarm = () => {
  const now = new Date();
  const target = new Date();
  target.setHours(20, 0, 0, 0);

  // Si ya pasaron las 20:00 hs hoy, programar para mañana a las 20:00 hs
  if (now.getTime() >= target.getTime()) {
    target.setDate(target.getDate() + 1);
  }

  const delayMs = target.getTime() - now.getTime();

  setTimeout(() => {
    self.registration.showNotification('⏰ RESUMEN DE TURNOS DE MAÑANA', {
      body: 'Recuerda revisar tus turnos agendados para el día de mañana.',
      icon: '/icon.svg',
      badge: '/badge.svg',
      vibrate: [300, 100, 300, 100, 500],
      tag: 'daily-20pm-summary',
      renotify: true,
      requireInteraction: true
    });

    // Volver a programar para el día siguiente
    scheduleDaily20pmAlarm();
  }, delayMs);
};

// Iniciar programación diaria a las 20:00 hs
scheduleDaily20pmAlarm();

// Escuchar mensajes de la aplicación
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

// Manejar clic en la notificación para abrir la app
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
