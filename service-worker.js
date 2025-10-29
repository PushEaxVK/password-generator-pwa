const CACHE = "pwgen-cache-v1";
const ASSETS = ["./", "index.html", "manifest.json"];

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(ASSETS))
      .catch(() => {})
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(
      (r) =>
        r ||
        fetch(e.request)
          .then((f) => {
            caches.open(CACHE).then((c) => c.put(e.request, f.clone()));
            return f;
          })
          .catch(() => caches.match("index.html"))
    )
  );
});
