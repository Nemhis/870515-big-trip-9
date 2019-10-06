const CACHE_NAME = `BIG_TRIP_APP2`;

self.addEventListener('install', (evt) => {
  self.skipWaiting();

  evt.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll([
          '/index.html',
          '/css/style.css',
          '/bundle.js',

          '/img/header-bg.png',
          '/img/header-bg@2x.png',
          '/img/logo.png',

          '/img/icons/bus.png',
          '/img/icons/check-in.png',
          '/img/icons/drive.png',
          '/img/icons/flight.png',
          '/img/icons/restaurant.png',
          '/img/icons/ship.png',
          '/img/icons/taxi.png',
          '/img/icons/train.png',
          '/img/icons/transport.png',
          '/img/icons/trip.png',
        ]);
      })
  );
});


self.addEventListener('fetch', (evt) => {
  evt.respondWith(
    fetch(evt.request)
      .then(function(response) {
        if (evt.request.method === 'GET') {
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(evt.request, response.clone())
            });
        }

        return response.clone();
      })
      .catch(() => {
        return caches.match(evt.request);
    })
  );
});
