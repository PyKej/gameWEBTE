
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installed');

    event.waitUntil(
        caches.open('static')
            .then((cache) => {
                console.log('Service Worker: Caching Files');
                cache.addAll([]); // Add files to cache here
            })
    );
});

self.addEventListener('activate', () => {
    console.log('Service Worker: Activated');
});

self.addEventListener('fetch', (event) => {
    console.log('Service Worker: Fetching');
    event.respondWith(
        caches.match(event.request)
            .then(cacheRes => {
                return cacheRes || fetch(event.request);
            })
    );
});
