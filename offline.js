// https://dev.to/naimur/building-offline-ready-webpage-with-service-worker-and-cache-storage-3dbk

const cacheName = "skibidi hawk tuah";
const cacheUrls = ["index.html", "fs.js", "wfs.js", "jszip.js", "target.json"];

self.addEventListener("install", async (event) => {
    try {
        const cache = await caches.open(cacheName);
        await cache.addAll(cacheUrls);
    } catch (error) {
        console.error("Service Worker installation failed:", error);
    }
});

if (navigator.onLine === false) {
    self.addEventListener("fetch", (event) => {
        event.respondWith(
            (async () => {
                const cache = await caches.open(cacheName);

                try {
                    const cachedResponse = await cache.match(event.request);
                    if (cachedResponse) {
                        console.log("cachedResponse: ", event.request.url);
                        return cachedResponse;
                    }

                    const fetchResponse = await fetch(event.request);
                    if (fetchResponse) {
                        console.log("fetchResponse: ", event.request.url);
                        await cache.put(event.request, fetchResponse.clone());
                        return fetchResponse;
                    }
                } catch (error) {
                    console.log("Fetch failed: ", error);
                    const cachedResponse = await cache.match("index.html");
                    return cachedResponse;
                }
            })()
        );
    });

}