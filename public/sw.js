// RoboCraft offline support: after the first visit the app opens without internet.
// Pages: network first (fresh updates), cached copy when offline.
// App files (JS/CSS/images/fonts): cache first — their names change on every build.
// The app registers this file as sw.js?v=<app version>, so each release
// installs a fresh worker (and a fresh cache) instead of keeping the old one.
const VERSION = new URL(self.location.href).searchParams.get('v') || '1';
const CACHE = `robocraft-${VERSION}`;
const BASE = self.registration.scope;

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll([BASE, BASE + 'manifest.json', BASE + 'icon-192.png'])).then(() => self.skipWaiting()));
});

// Every build gives the JS and CSS new hashed names, so the old ones would sit
// in the cache for ever and the app's storage would grow with each update.
// They are dropped when a new service worker takes over; the handful still in
// use are fetched again on the next load.
async function pruneOldAssets() {
  const cache = await caches.open(CACHE);
  const keys = await cache.keys();
  await Promise.all(
    keys.filter((r) => new URL(r.url).pathname.includes('/assets/')).map((r) => cache.delete(r))
  );
}

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await pruneOldAssets();
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.pathname.includes('/api/')) return; // never cache backend calls

  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then((res) => { caches.open(CACHE).then((c) => c.put(BASE, res.clone())); return res; })
        .catch(() => caches.match(BASE))
    );
    return;
  }
  // Python (Pyodide) files are versioned, so they are safe to keep for offline use.
  const cacheable = url.origin === location.origin || /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)
    || (url.hostname === 'cdn.jsdelivr.net' && url.pathname.startsWith('/pyodide/'));
  if (!cacheable) return;
  e.respondWith(
    caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      if (res.ok || res.type === 'opaque') { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
      return res;
    }))
  );
});
