// Service Worker for offline support
// Caches the app shell and serves it when offline

const CACHE_NAME = 'photo-puzzle-v1';

// Files to cache on install (app shell)
const STATIC_ASSETS = ['/', '/index.html', '/manifest.json'];

// Install event: cache the app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).then(() => {
        // Force the waiting service worker to become the active service worker
        self.skipWaiting();
      });
    }),
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName)),
      );
    }),
  );
  // Claim all clients immediately
  self.clients.claim();
});

// Fetch event: serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests
  if (!request.url.startsWith(self.location.origin)) {
    return;
  }

  // Cache-first strategy for static assets (CSS, JS, images, manifest, icons)
  if (
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'image' ||
    request.url.includes('/manifest.json') ||
    request.url.includes('/icon-') ||
    request.url.includes('/favicon')
  ) {
    event.respondWith(
      caches
        .match(request)
        .then((response) => response || fetch(request))
        .then((response) => {
          // Cache successful responses
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Return cached version if fetch fails
          return caches.match(request);
        }),
    );
    return;
  }

  // Network-first strategy for HTML and other documents
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful responses
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Return cached version if fetch fails
        return caches
          .match(request)
          .then(
            (response) =>
              response ||
              new Response('Offline - page not available', { status: 503 }),
          );
      }),
  );
});
