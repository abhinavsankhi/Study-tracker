const CACHE = "study-tracker-v3";
const CORE = ["./","./index.html","./manifest.json","./icon-192.png","./icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  if(e.request.method !== "GET") return;
  e.respondWith(
    caches.open(CACHE).then(async cache => {
      const cached = await cache.match(e.request);
      if(cached) return cached;
      try {
        const response = await fetch(e.request);
        if(response && response.status===200) cache.put(e.request, response.clone());
        return response;
      } catch(err) {
        return await cache.match("./index.html");
      }
    })
  );
});
