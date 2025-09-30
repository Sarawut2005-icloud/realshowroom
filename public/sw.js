const CACHE_NAME = 'bigbike-showroom-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/images/yamaha-r1.jpg',
  '/images/yamaha-r15.jpg',
  '/images/kawasaki-zx10r.jpg',
  '/images/kawasaki-ninja-400.jpg',
  '/images/kawasaki-h2.jpg',
  '/images/bmw-s1000rr.jpg',
  '/images/honda-cbr650r.jpg',
  '/images/honda-cbr1000rr.jpg',
  '/images/ducati-panigale-v4.jpg',
  '/images/ducati-panigale-v2.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
