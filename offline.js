// https://dev.to/naimur/building-offline-ready-webpage-with-service-worker-and-cache-storage-3dbk

const cacheName = "skibidi hawk tuah";
const cacheUrls = ["index.html", "fs.js", "wfs.js", "jszip.js", "target.json"];
const ver = "0.0.1";

self.addEventListener("install", async (event) => {
    try {
        const cache = await caches.open(cacheName);
        await cache.addAll(cacheUrls);
    } catch (error) {
        console.error("Service Worker installation failed:", error);
    }
});

self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "stop") {
        console.log("<i> Goodbye, cruel world");
        self.registration.unregister().then(() => {
            return self.clients.matchAll().then(clients => {
                clients.forEach(client => client.navigate(client.url));
            });
        });
    } else if (event.data && event.data.type === "hello") {
        console.log(ver);
        event.source.postMessage({ type: ver });
    }
});

if (navigator.onLine === false) {
    console.log(`<i> Worker ${ver} is initializing... (active)`);
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
} else {
    console.log(`<i> Worker ${ver} is initializing... (dormant)`);
}