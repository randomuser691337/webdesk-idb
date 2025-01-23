const CACHE_NAME = 'Fuck off (for now)';
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
            return Promise.all(
                CACHE_FILES.map((file) =>
                    fetch(file)
                        .then((response) => {
                            console.log(`Caching: ${file}`);
                            return cache.put(file, response);
                        })
                        .catch((error) => {
                            console.error(`Failed to cache ${file}:`, error);
                        })
                )
            );
        })
    );
    console.log('<i> Installed!');
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