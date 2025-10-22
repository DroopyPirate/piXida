self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('compass-cache-v1').then(cache =>
      cache.addAll([
        './',
        './index.html',
        './manifest.webmanifest',
      ])
    )
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});

const CACHE_NAME = 'pixida-shell-v1';
const ASSETS = [
  '/', '/index.html', '/manifest.webmanifest',
  // add icon paths if you have them
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting(); // Activate worker immediately
});
/* What install means, when does it trigger, etc.
The user visits your site.
The browser registers the service worker.
The service worker completes its installation.
*/

// Activate: remove old caches and take control immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});


// Fetch: cache-first for same-origin GET requests
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return; // ignore POST/etc.

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return; // let cross-origin go to network

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});