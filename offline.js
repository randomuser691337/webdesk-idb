
const CACHE_NAME = 'WebBoot Beta 2';
const CACHE_FILES = [
    '/go/fs.js',
    '/go/wfs.js',
    '/index.html',
    '/offline.js',
    '/go/target.json'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(CACHE_FILES).catch((error) => {
                console.error('<!> Failed:', error);
            });
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).catch(() => {
                if (event.request.mode === 'navigate') {
                    return caches.match(OFFLINE_URL);
                }
            });
        })
    );
});