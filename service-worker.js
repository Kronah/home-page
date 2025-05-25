const CACHE_NAME = 'v2-l2-mobs-cache';
const FILES_TO_CACHE = [
  '/home-page/',
  '/home-page/index.html',
  '/home-page/style.css',
  '/home-page/script.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(FILES_TO_CACHE);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request))
  );
});
