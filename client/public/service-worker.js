// This is the service worker with the combined offline experience (Offline page + Offline copy of pages)

const CACHE_NAME = "pwabuilder-offline";

// Load Workbox through a CDN
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

// Verify Workbox loaded correctly
if (workbox) {
    console.log(`Yay! Workbox is loaded 🎉`);
} else {
    console.log(`Boo! Workbox didn't load 😬`);
}

const offlineFallbackPage = "offline.html";  // Ensure this is the correct offline fallback page name

// Precache the offline fallback page during the install step
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.add(offlineFallbackPage))
      .then(() => self.skipWaiting())
  );
});

// Enable navigation preload if it's supported
if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

// Use Stale-While-Revalidate strategy for CSS and JS files
workbox.routing.registerRoute(
  ({request}) => request.destination === 'style' || request.destination === 'script',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'css-js-cache',
  })
);

// Use Cache First strategy for images, with custom cache expiration
workbox.routing.registerRoute(
  ({request}) => request.destination === 'image',
  new workbox.strategies.CacheFirst({
    cacheName: 'image-cache',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  })
);

// Handle offline fallback for navigation requests
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Check if we received a valid response
          return response || caches.match(offlineFallbackPage);
        })
        .catch(() => {
          // Attempt to serve the offline page from the cache
          return caches.match(offlineFallbackPage);
        })
    );
  }
});

// This event listener is to handle background sync (if applicable)
self.addEventListener('sync', (event) => {
  console.log('Background sync event fired', event.tag);
});

// Cleanup outdated caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Clearing Old Cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});
