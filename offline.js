
const CACHE_NAME = 'WebBoot 1';
const OFFLINE_URL = '/';
const CACHE_FILES = [
    OFFLINE_URL,
    '/go/fs.js',
    '/go/wfs.js',
    '/go/jszip.js',
    '/index.html',
    '/offline.js',
    '/go/target.json'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(CACHE_FILES);
        })
    );
    console.log('<i> Offline mode is well... online');
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            if (event.request.mode === 'navigate') {
                return caches.match(OFFLINE_URL);
            }
        })
    );
});
