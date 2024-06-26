const cacheName = 'weather-app-v1.5';
const staticAssets = [
  './',
  './offlineLog.js',
  './manifest.json',
  './icons/',
  './backgrounds/',
  './buttons/',
  './images/',
  //'./script.js',
  './styleFrontPage.css',
  './styleMenuPage.css',
  './stylesAi-agriculture-chatPage.css',
  //'./styles.css',
  './index.html',
  './forecast-weather.html',
  './ai-agriculture-chat.html',
  './history-weather.html',
  './menu.html',
];

self.addEventListener('install', event => {
    console.log('Service Worker installing.');
    event.waitUntil(
        caches.open(cacheName)
        .then(cache => cache.addAll(staticAssets))
    );
});

self.addEventListener('fetch', event => {
    console.log('Service Worker fetching:', event.request.url);
    event.respondWith(
        caches.match(event.request)
        .then(cachedResponse => {
            if (cachedResponse) {
                console.log('Serving from cache:', event.request.url);
                return cachedResponse;
            }
            console.log('Fetching from network:', event.request.url);
            return fetch(event.request)
                .then(networkResponse => {
                    return caches.open(cacheName)
                        .then(cache => {
                            cache.put(event.request, networkResponse.clone());
                            return networkResponse;
                        });
                });
        })
        .catch(() => caches.match('./offline.html')) // Fallback page if both cache and network fail
    );
});
