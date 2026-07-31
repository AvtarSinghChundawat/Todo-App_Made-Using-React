const CACHE_NAME = 'todo-app-v1';

self.addEventListener('install', () => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
        )
    );
    self.clients.claim();
});

// Network-first: always try the network so todos/sessions stay fresh,
// only fall back to the cache when there's no connection at all.
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            try {
                const response = await fetch(event.request);
                cache.put(event.request, response.clone());
                return response;
            } catch (err) {
                const cached = await cache.match(event.request);
                if (cached) return cached;
                throw err;
            }
        })()
    );
});
