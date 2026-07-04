/* Service Worker voor MeetSum PWA */
const CACHE_VERSION = 'meetsum-v6';
const CACHE_URLS = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/lang/nl.js',
  '/lang/en.js',
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

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Fetch event â€“ network first, fall back to cache
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET, API calls, and all cross-origin requests.
  // External assets like Google Fonts and cdnjs must be fetched by the browser,
  // otherwise CSP connect-src rules can block the service worker fetch.
  if (
    request.method !== 'GET' ||
    request.url.includes('/api/') ||
    url.pathname === '/version.json' ||
    url.origin !== self.location.origin
  ) {
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
      .catch(async () => {
        // Fallback to cache if offline. If nothing is cached, let the request fail
        // with a real error response instead of returning undefined.
        const cached = await caches.match(request);
        return cached || Response.error();
      })
  );
});

