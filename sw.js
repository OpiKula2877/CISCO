const CACHE_NAME = 'v2.1'; // <--- Kdykoliv změníš ikonu nebo web, změň tohle číslo (např. v2, v3...)

const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Instalace a načtení základních souborů
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  // Donutí nový Service Worker, aby se aktivoval okamžitě a nečekal na zavření aplikace
  self.skipWaiting();
});

// Vyčištění staré cache po aktivaci nové verze
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

// Strategie: Stale-While-Revalidate (Načti z cache, ale na pozadí aktualizuj z webu)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(e.request).then((cachedResponse) => {
        // Spustíme síťový požadavek na pozadí
        const networkFetch = fetch(e.request).then((networkResponse) => {
          // Pokud je síťový požadavek v pořádku, uložíme kopii do cache pro příště
          if (networkResponse.status === 200) {
            cache.put(e.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => {
          // Pokud síť selže (jsme offline), fetch selže, ale to neva, vrátí se cachedResponse
        });

        // Vrátíme cachedResponse hned (pokud existuje), jinak čekáme na síť
        return cachedResponse || networkFetch;
      });
    })
  );
});