const CACHE_NAME = 'v3';

const ASSETS = [
  '/',
  '/index.html',
  '/quiz.html',
  '/quiz.css',
  '/quiz.js',
  '/tahak.css',
  '/tahak.js',
  '/manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return fetch(e.request).then((networkResponse) => {
        if (networkResponse.status === 200) {
          cache.put(e.request, networkResponse.clone());
        }
        return networkResponse;
      }).catch(() => {
        return cache.match(e.request);
      });
    })
  );
});