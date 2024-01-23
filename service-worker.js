const cacheName = 'weather-app-v1';
const staticAssets = [
  './',
  './styles.css',
  './script.js',
  './manifest.json',
  './index.html'
  // Include other assets like icons, images, etc.
];

self.addEventListener('install', event => {
    console.log('Service Worker installing.');
    event.waitUntil(
        caches.open(cacheName)
        .then(cache => cache.addAll(staticAssets))
    );
});

self.addEventListener('fetch', event => {
    console.log('Service Worker fetching.');
    event.respondWith(
        caches.match(event.request)
        .then(cachedResponse => cachedResponse || fetch(event.request))
    );
});
