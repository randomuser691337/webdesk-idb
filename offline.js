const CACHE_NAME = 'Fuck off (for now) 2';
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
    console.log('<i> Installed!');
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        navigator.onLine ? fetch(event.request) : caches.match(event.request)
    );
});
