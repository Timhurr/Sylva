/* Sylva – service worker : appli et fiches hors-ligne, tuiles de carte vues gardées en cache */
var VERSION = "sylva-v0.1.0";
var SHELL = VERSION + "-shell";
var TILES = "sylva-tiles";
var MAX_TILES = 2500;

var LOCAL = [
  "./", "index.html", "styles.css", "app.js", "data.js", "manifest.webmanifest",
  "icons/icon-180.png", "icons/icon-192.png", "icons/icon-512.png"
];
var CDN = [
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
  "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(SHELL).then(function (c) {
    return c.addAll(LOCAL).then(function () {
      return Promise.all(CDN.map(function (u) {
        return fetch(u, { mode: "cors" }).then(function (r) { if (r.ok) return c.put(u, r); }).catch(function () {});
      }));
    });
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== SHELL && k !== TILES; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

function trimTiles() {
  return caches.open(TILES).then(function (c) {
    return c.keys().then(function (keys) {
      var extra = keys.length - MAX_TILES;
      if (extra <= 0) return;
      return Promise.all(keys.slice(0, extra).map(function (k) { return c.delete(k); }));
    });
  });
}

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return; // API (Pl@ntNet, Overpass) : toujours en direct
  var url = new URL(req.url);

  // Tuiles OpenStreetMap : cache d'abord (celles déjà affichées), réseau sinon
  if (url.hostname === "tile.openstreetmap.org") {
    e.respondWith(caches.open(TILES).then(function (c) {
      return c.match(req).then(function (hit) {
        if (hit) return hit;
        return fetch(req).then(function (res) {
          if (res && (res.ok || res.type === "opaque")) { c.put(req, res.clone()).then(trimTiles); }
          return res;
        });
      });
    }));
    return;
  }

  // Appli + bibliothèque carte : cache immédiat, mise à jour en arrière-plan
  if (url.origin === self.location.origin || url.hostname === "unpkg.com") {
    e.respondWith(caches.open(SHELL).then(function (c) {
      return c.match(req, { ignoreSearch: true }).then(function (hit) {
        var net = fetch(req).then(function (res) {
          if (res && res.ok) c.put(req, res.clone());
          return res;
        }).catch(function () { return hit; });
        return hit || net;
      });
    }));
  }
});
