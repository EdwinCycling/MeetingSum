/* Service Worker voor MeetSum PWA */
const CACHE_VERSION = 'meetsum-v4';
const CACHE_URLS = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/manifest.json'
];

// Install event â€“ cache essentials
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache => {
      return cache.addAll(CACHE_URLS);
    }).catch(err => console.log('Cache install error:', err))
  );
  self.skipWaiting();
});

// Activate event â€“ cleanup old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_VERSION) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event â€“ network first, fall back to cache
self.addEventListener('fetch', event => {
  const { request } = event;
  
  // Skip non-GET or API calls
  if (request.method !== 'GET' || request.url.includes('/api/')) {
    return;
  }
  
  event.respondWith(
    fetch(request)
      .then(response => {
        // Cache successful responses
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_VERSION).then(cache => {
            cache.put(request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache if offline
        return caches.match(request);
      })
  );
});

