// RoboCraft offline support: after the first visit the app opens without internet.
// Pages: network first (fresh updates), cached copy when offline.
// App files (JS/CSS/images/fonts): cache first — their names change on every build.
const CACHE = 'robocraft-v1';
const BASE = self.registration.scope;

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll([BASE, BASE + 'manifest.json', BASE + 'icon-192.png'])).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
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
  const cacheable = url.origin === location.origin || /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (!cacheable) return;
  e.respondWith(
    caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      if (res.ok || res.type === 'opaque') { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
      return res;
    }))
  );
});
