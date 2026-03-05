const CACHE_NAME = 'bioflow-v22.9.12';
const FILES_TO_CACHE = [
  '/g-calculator.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  'https://cdn.jsdelivr.net/npm/chart.js@4.3.0/dist/chart.umd.min.js'
];

self.addEventListener('install', evt => {
    evt.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
    );
    self.skipWaiting();
});

self.addEventListener('activate', evt => {
    evt.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null)
        ))
    );
    self.clients.claim();
});

self.addEventListener('fetch', evt => {
    if(evt.request.method !== 'GET') return;
    evt.respondWith(
        caches.match(evt.request).then(resp => resp || fetch(evt.request).then(fetchResp => {
            return caches.open(CACHE_NAME).then(cache => {
                cache.put(evt.request, fetchResp.clone());
                return fetchResp;
            });
        })).catch(() => {
            if(evt.request.destination === 'document') return caches.match('/g-calculator.html');
        })
    );
});