const CACHE_NAME = 'turnos-v6';
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

// OBTENER LA FECHA DE MAÑANA EN FORMATO YYYY-MM-DD
const getTomorrowDateStr = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// PROGRAMAR NOTIFICACIÓN DIARIA AUTOMÁTICA A LAS 20:00 HS SÓLO SI HAY TURNOS AGENDADOS PARA MAÑANA
const scheduleDaily20pmAlarm = () => {
  const now = new Date();
  const target = new Date();
  target.setHours(20, 0, 0, 0);

  if (now.getTime() >= target.getTime()) {
    target.setDate(target.getDate() + 1);
  }

  const delayMs = target.getTime() - now.getTime();

  setTimeout(async () => {
    try {
      const tomorrowStr = getTomorrowDateStr();
      let hasTurnos = false;
      let count = 0;

      // Consultar endpoint local o cache de turnos
      const res = await fetch('/api/turnos').catch(() => null);
      if (res && res.ok) {
        const data = await res.json().catch(() => null);
        if (data && data.success && Array.isArray(data.data)) {
          const turnosMañana = data.data.filter(t => t.fecha === tomorrowStr && t.estado !== 'cancelado');
          count = turnosMañana.length;
          hasTurnos = count > 0;
        }
      } else {
        // Si no responde la API, asumir que hay turnos sólo si se registró la actividad
        hasTurnos = true;
      }

      // SÓLO DISPARAR LA NOTIFICACIÓN SI HAY AL MENOS 1 TURNO MAÑANA
      if (hasTurnos) {
        const bodyText = count > 0 
          ? `Mañana tienes ${count} turno${count > 1 ? 's' : ''} agendado${count > 1 ? 's' : ''}. Tocá para revisar la lista.`
          : 'Recuerda revisar tus turnos agendados para el día de mañana.';

        self.registration.showNotification(`⏰ RESUMEN DE TURNOS DE MAÑANA ${count > 0 ? `(${count})` : ''}`, {
          body: bodyText,
          icon: '/icon.svg',
          badge: '/badge.svg',
          vibrate: [300, 100, 300, 100, 500],
          tag: 'daily-20pm-summary',
          renotify: true,
          requireInteraction: true
        });
      }
    } catch (e) {
      console.log('Error verificando turnos de mañana para la alarma:', e);
    }

    // Reprogramar para el día siguiente a las 20:00 hs
    scheduleDaily20pmAlarm();
  }, delayMs);
};

// Iniciar ciclo de alarma a las 20:00 hs
scheduleDaily20pmAlarm();

// Escuchar mensajes de recordatorios manuales
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
