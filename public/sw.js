/* Service worker minimal — précache la coquille, sert hors-ligne.
   Le build Vite hashe les assets ; on ne précache que ce qui est stable et on
   fait du "stale-while-revalidate" pour le reste — SAUF les pages (navigate),
   toujours réseau d'abord : sinon une mise à jour du jeu reste invisible tant
   que le cache n'a pas eu l'occasion de se rafraîchir en arrière-plan lors
   d'une PRÉCÉDENTE visite (un cran de retard systématique). */
const CACHE = 'starship-v2';
const SHELL = ['./', './index.html', './manifest.webmanifest', './favicon.svg'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
        )
      )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (
    request.method !== 'GET' ||
    new URL(request.url).origin !== location.origin
  )
    return;

  if (request.mode === 'navigate') {
    e.respondWith(
      fetch(request)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(request, copy));
          }
          return res;
        })
        .catch(() =>
          caches
            .match(request)
            .then((cached) => cached || caches.match('./index.html'))
        )
    );
    return;
  }

  // Assets hashés (JS/CSS/polices) : sans risque à servir depuis le cache
  // d'abord, le nom de fichier change dès que le contenu change.
  e.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(request, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
