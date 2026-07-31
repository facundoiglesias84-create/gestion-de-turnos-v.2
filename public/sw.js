const CACHE_NAME = 'turnos-v3';
const urlsToCache = [
  '/manifest.json',
  '/icon.svg',
  '/logo.jpg'
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
          return caches.delete(cacheName);
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // NUNCA cachear index.html ni peticiones API ni assets hashed para evitar 404 de bundles viejos
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
