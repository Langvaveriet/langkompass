const CACHE_VERSION = "langkompass-shell-v1";
const PUBLIC_SHELL = [
  "/offline",
  "/icon.svg",
  "/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(PUBLIC_SHELL)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys
        .filter((key) => key.startsWith("langkompass-shell-") && key !== CACHE_VERSION)
        .map((key) => caches.delete(key)),
    )),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("/offline")),
    );
    return;
  }

  if (PUBLIC_SHELL.includes(url.pathname)) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request)),
    );
  }
});
