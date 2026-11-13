/* Sylva – V1 (test terrain) */
(function () {
  "use strict";

  var VERSION = "0.9.65";
  var ZONE = window.SYLVA_ZONE;
  var ESPECES = window.SYLVA_ESPECES || [];
  var TECHS = window.SYLVA_TECHNIQUES || [];

  // ---------- Utilitaires ----------
  function $(sel) { return document.querySelector(sel); }
  function $all(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function norm(s) { return String(s || "").toLowerCase().replace(/œ/g, "oe").replace(/æ/g, "ae").normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  function load(key, fallback) {
    try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
  }
  function save(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }
  var toastTimer;
  function toast(msg) {
    var t = $("#toast"); t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.hidden = true; }, 2600);
  }
  function distKm(a, b) {
    var R = 6371, toRad = Math.PI / 180;
    var dLat = (b[0] - a[0]) * toRad, dLon = (b[1] - a[1]) * toRad;
    var h = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(a[0] * toRad) * Math.cos(b[0] * toRad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return 2 * R * Math.asin(Math.sqrt(h));
  }
  function fmtKm(km) { return km < 1 ? Math.round(km * 1000) + " m" : km.toFixed(1).replace(".", ",") + " km"; }
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function () { toast("Copié"); }, function () { fallbackCopy(text); });
    }
    fallbackCopy(text);
  }
  function fallbackCopy(text) {
    var ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta);
    ta.select(); try { document.execCommand("copy"); toast("Copié"); } catch (e) { toast("Copie impossible"); }
    document.body.removeChild(ta);
  }

  $("#appVersion").textContent = "Sylva v" + VERSION + " · test terrain";

  // ---------- Réseau ----------
  function updateNet() { $("#netBadge").hidden = navigator.onLine; }
  window.addEventListener("online", updateNet);
  window.addEventListener("offline", updateNet);
  updateNet();

  // ---------- Onglets ----------
  var map;
  $all(".tab").forEach(function (tab) {
    tab.addEventListener("click", function () { showView(tab.dataset.view); });
  });
  function showView(name) {
    $all(".tab").forEach(function (t) { t.classList.toggle("active", t.dataset.view === name); });
    $all(".view").forEach(function (v) { v.classList.toggle("active", v.id === "view-" + name); });
    if (name === "carte" && map) setTimeout(function () { map.invalidateSize(); }, 50);
    if (name === "bivouac") renderBivouac();
    if (name === "accueil") renderAccueil();
    var v = $("#view-" + name); if (v) v.scrollTop = 0;
  }
  $all("[data-goto]").forEach(function (b) { b.addEventListener("click", function () { showView(b.getAttribute("data-goto")); }); });

  // ---------- Thème jour / nuit ----------
  var themePref = load("sylva_theme", "auto");
  function isNight() {
    var now = new Date(), m = load("sylva_meteo", null);
    if (m && m.data && m.data.daily && m.data.daily.time) {
      var today = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0");
      var i = m.data.daily.time.indexOf(today);
      if (i !== -1) {
        var rise = new Date(m.data.daily.sunrise[i]), set = new Date(m.data.daily.sunset[i]);
        return now < rise || now > set;
      }
    }
    var h = now.getHours(); return h < 7 || h >= 18;
  }
  function applyTheme() {
    if (load("sylva_eco", false)) { document.documentElement.setAttribute("data-theme", "nuit"); return; }
    var night = themePref === "nuit" || (themePref === "auto" && isNight());
    document.documentElement.setAttribute("data-theme", night ? "nuit" : "jour");
    var meta = document.querySelector('meta[name="theme-color"]'); if (meta) meta.setAttribute("content", night ? "#0C110E" : "#F5F3EE");
    $all("#themeChips .chip").forEach(function (c) { c.classList.toggle("on", c.getAttribute("data-theme-opt") === themePref); });
  }
  applyTheme();
  setInterval(applyTheme, 60000);
  $("#themeChips").addEventListener("click", function (e) {
    var b = e.target.closest("[data-theme-opt]"); if (!b) return;
    themePref = b.getAttribute("data-theme-opt"); save("sylva_theme", themePref); applyTheme();
  });

  // ---------- Modales & fiche ----------
  function openModal(id) { $(id).hidden = false; }
  function closeModal(el) { el.hidden = true; }
  $all(".modal").forEach(function (m) {
    m.addEventListener("click", function (e) {
      if (e.target === m || e.target.hasAttribute("data-close")) closeModal(m);
    });
  });
  var sheetStack = [], lectureChap = null;
  function openSheet(kicker, html, opts) {
    if (!$("#sheet").hidden) {
      sheetStack.push({ k: $("#sheetKicker").textContent, h: $("#sheetBody").innerHTML, s: $("#sheetBody").scrollTop, c: lectureChap, hero: $("#sheet").classList.contains("has-hero") });
    }
    lectureChap = null;
    $("#sheet").classList.toggle("has-hero", !!(opts && opts.hero));
    $("#sheetKicker").textContent = kicker;
    $("#sheetBody").innerHTML = html;
    $("#sheetBody").scrollTop = 0;
    $("#sheet").hidden = false;
  }
  $("#sheetClose").addEventListener("click", function () {
    var prev = sheetStack.pop();
    if (prev) {
      $("#sheetKicker").textContent = prev.k; $("#sheetBody").innerHTML = prev.h; lectureChap = prev.c;
      $("#sheet").classList.toggle("has-hero", !!prev.hero);
      setTimeout(function () { $("#sheetBody").scrollTop = prev.s; }, 0);
    } else { $("#sheet").hidden = true; lectureChap = null; }
  });

  // ---------- Position ----------
  var me = null; // [lat, lon, accuracy]
  var meMarker = null, meCircle = null, firstFix = true;
  function onPos(p) {
    me = [p.coords.latitude, p.coords.longitude, p.coords.accuracy];
    if (map && window.L) {
      var ll = [me[0], me[1]];
      if (!meMarker) {
        meCircle = L.circle(ll, { radius: me[2], color: "#E9A23B", weight: 1, fillOpacity: 0.08 }).addTo(map);
        meMarker = L.marker(ll, { icon: L.divIcon({ className: "", html: '<div class="me-dot"></div>', iconSize: [18, 18] }), zIndexOffset: 1000 }).addTo(map);
      } else { meMarker.setLatLng(ll); meCircle.setLatLng(ll).setRadius(me[2]); }
      if (firstFix) { firstFix = false; map.setView(ll, 14); }
      updateMapCard();
    }
    updateSosCoords();
    if (nav) navUpdate();
    journalOnPos();
  }
  function onPosErr(err) {
    if (err && err.code === 1) toast("Localisation refusée : activez-la dans Réglages > Safari");
  }
  var geoWatch = null;
  function startGeo() {
    if (!navigator.geolocation) return;
    var eco = !!load("sylva_eco", false) && !nav;
    geoWatch = navigator.geolocation.watchPosition(onPos, onPosErr, eco ? { enableHighAccuracy: false, maximumAge: 60000, timeout: 60000 } : { enableHighAccuracy: true, maximumAge: 15000, timeout: 30000 });
  }
  function restartGeo() { if (geoWatch != null && navigator.geolocation) navigator.geolocation.clearWatch(geoWatch); startGeo(); }

  // ---------- Carte ----------
  var layers = {};
  var osmPlaces = []; // {kind, lat, lon, tags}

  function pinIcon(color, label) {
    return L.divIcon({
      className: "", iconSize: [30, 30], iconAnchor: [15, 36], popupAnchor: [0, -32],
      html: '<div class="pin" style="background:' + color + '"><span>' + label + "</span></div>"
    });
  }

  function initMap() {
    if (!window.L) {
      $("#mapCard").innerHTML = '<div class="map-card-title">Carte indisponible</div><div class="map-card-sub">Ouvrez l\'appli une première fois avec du réseau pour la mettre en cache.</div>';
      return;
    }
    map = L.map("map", { zoomControl: false }).setView(ZONE.centre, ZONE.zoom);
    initBasemaps();
    layers.bivouac = L.layerGroup().addTo(map);
    layers.eau = L.layerGroup().addTo(map);
    layers.spots = L.layerGroup().addTo(map);
    var chc = document.querySelector('.map-chips [data-layer="chasse"]');
    if (chc) chc.classList.toggle("on", load("sylva_layer_chasse", true));
    layers.services = L.layerGroup();
    if (load("sylva_layer_services", true)) layers.services.addTo(map);
    var sc = document.querySelector('.map-chips [data-layer="services"]'); if (sc) sc.classList.toggle("on", map.hasLayer(layers.services));

    $all(".map-chips .chip").forEach(function (c) {
      c.addEventListener("click", function () {
        var on = !c.classList.contains("on");
        c.classList.toggle("on", on);
        var lg = layers[c.dataset.layer];
        if (lg) { if (on) map.addLayer(lg); else map.removeLayer(lg); }
        if (c.dataset.layer === "services") { save("sylva_layer_services", on); if (on) loadPoi(false); }
        if (c.dataset.layer === "chasse") { save("sylva_layer_chasse", on); if (on) loadChasse(false); }
      });
    });

    map.on("popupopen", function (e) {
      var img = e.popup.getElement().querySelector("[data-spot-photo]");
      if (img) spotPhotoUrl(img.getAttribute("data-spot-photo")).then(function (u) { if (u) { img.src = u; img.hidden = false; e.popup.update(); } });
      var btn = e.popup.getElement().querySelector("[data-del-spot]");
      if (btn) btn.addEventListener("click", function () {
        var did = btn.getAttribute("data-del-spot");
        if (btn.dataset.sure) { deleteSpot(did); map.closePopup(); return; }
        btn.dataset.sure = "1"; btn.textContent = "Confirmer ?";
      });
      var ed = e.popup.getElement().querySelector("[data-edit-spot]");
      if (ed) ed.addEventListener("click", function () { map.closePopup(); editSpot(ed.getAttribute("data-edit-spot")); });
      var gp = e.popup.getElement().querySelector("[data-gps-spot]");
      if (gp) gp.addEventListener("click", function () { map.closePopup(); gpsSpot(gp.getAttribute("data-gps-spot")); });
      var gpo = e.popup.getElement().querySelector("[data-go-lat]");
      if (gpo) gpo.addEventListener("click", function () {
        map.closePopup(); startNav({ lat: +gpo.getAttribute("data-go-lat"), lon: +gpo.getAttribute("data-go-lon"), label: gpo.getAttribute("data-go-name") });
      });
      var here = e.popup.getElement().querySelector("[data-spot-here]");
      if (here) here.addEventListener("click", function (ev) { ev.stopPropagation(); spotHere(); });
      var goh = e.popup.getElement().querySelector("[data-go-here]");
      if (goh) goh.addEventListener("click", function (ev) {
        ev.stopPropagation(); if (!tapMarker) return; var ll = tapMarker.getLatLng(); clearTap(); map.closePopup();
        startNav({ lat: ll.lat, lon: ll.lng, label: "Point choisi" });
      });
    });
    map.on("click", onMapTap);
    map.on("dragstart", function () { if (nav) nav.follow = false; });

    renderSpots();
    var cached = load("sylva_osm", null);
    if (cached && cached.elements) renderOsm(cached.elements);
    loadOsm(false);
  }

  // ---------- Fonds de carte ----------
  var OSM_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
  var BASEMAPS = {
    ign_be: { nom: "IGN Belgique", sub: "Topo, sentiers, courbes de niveau",
      url: "https://cartoweb.wmts.ngi.be/1.0.0/topo/default/3857/{z}/{y}/{x}.png", maxNative: 17,
      attr: '&copy; <a href="https://www.ngi.be">IGN Belgique</a> (CartoWeb)' },
  };
  function mtKey() { return load("sylva_mtkey", "") || ""; }
  function addMapTiler() {
    var k = mtKey();
    ["mt_outdoor", "mt_sat"].forEach(function (id) { delete BASEMAPS[id]; });
    if (!k) return;
    var at = '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' + OSM_ATTR;
    BASEMAPS.mt_outdoor = { nom: "MapTiler Outdoor", sub: "Sentiers, relief, courbes · toute l'Europe",
      url: "https://api.maptiler.com/maps/outdoor-v2/256/{z}/{x}/{y}.png?key=" + encodeURIComponent(k), maxNative: 20, cors: true, attr: at };
    BASEMAPS.mt_sat = { nom: "MapTiler Satellite", sub: "Photo aérienne haute résolution", sat: true,
      url: "https://api.maptiler.com/maps/satellite/256/{z}/{x}/{y}.jpg?key=" + encodeURIComponent(k), maxNative: 20, cors: true, attr: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> &copy; fournisseurs d\'imagerie' };
  }
  var baseLayer = null;

  function setBasemap(id) {
    var b = BASEMAPS[id] || BASEMAPS.ign_be;
    if (!BASEMAPS[id]) id = "ign_be";
    if (baseLayer) map.removeLayer(baseLayer);
    var opt = { maxZoom: 19, maxNativeZoom: b.maxNative, attribution: b.attr };
    if (b.sub2) opt.subdomains = b.sub2;
    if (b.cors) opt.crossOrigin = true; // MapTiler : envoie l'en-tête Origin pour la restriction de domaine
    if (b.cors) opt.referrerPolicy = "strict-origin-when-cross-origin";
    baseLayer = L.tileLayer(b.url, opt);
    if (b.cors && baseLayer.on) { var errN = 0; baseLayer.on("tileerror", function () { if (++errN === 3) toast("MapTiler refuse la clé : vérifie-la dans Réglages, et le domaine autorisé dans MapTiler"); }); }
    if (!$("#map").classList.contains("term-vec")) { baseLayer.addTo(map); baseLayer.bringToBack(); }
    $("#map").classList.toggle("map-sat", !!b.sat);
    save("sylva_basemap", id);
    $all("#basemapList [data-basemap]").forEach(function (x) { x.classList.toggle("on", x.dataset.basemap === id); });
  }

  var basemapsWired = false;
  function renderBasemapList() {
    addMapTiler();
    var list = $("#basemapList"); if (!list) return;
    list.innerHTML = Object.keys(BASEMAPS).map(function (k) {
      var b = BASEMAPS[k];
      return '<button type="button" class="basemap-item" data-basemap="' + k + '"><b>' + b.nom + "</b><span>" + b.sub + "</span></button>";
    }).join("");
    var cur = load("sylva_basemap", "ign_be");
    $all("#basemapList [data-basemap]").forEach(function (x) { x.classList.toggle("on", x.dataset.basemap === cur); });
  }
  function initBasemaps() {
    renderBasemapList();
    if (basemapsWired) { var cur = load("sylva_basemap", "ign_be"); if (!BASEMAPS[cur]) setBasemap("ign_be"); return; }
    basemapsWired = true;
    var list = $("#basemapList");
    if (list) list.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-basemap]"); if (!btn) return;
      setBasemap(btn.dataset.basemap); $("#basemapPanel").hidden = true;
    });
    var fab = $("#btnBasemap");
    if (fab) fab.addEventListener("click", function () { var p = $("#basemapPanel"); $("#spotsPanel").hidden = true; p.hidden = !p.hidden; });
    setBasemap(load("sylva_basemap", "ign_be"));
    var sl = $("#skinList");
    if (sl) {
      sl.innerHTML = Object.keys(SKINS).map(function (k) {
        return '<button type="button" class="basemap-item" data-skin="' + k + '"><b>' + SKINS[k][0] + "</b><span>" + SKINS[k][1] + "</span></button>";
      }).join("");
      sl.addEventListener("click", function (e) {
        var b = e.target.closest("[data-skin]"); if (!b) return;
        setSkin(b.dataset.skin); $("#basemapPanel").hidden = true;
      });
    }
    setSkin(load("sylva_skin", "naturel"));
  }
  // Carte vectorielle « Terminal » : OpenFreeMap (gratuit, usage commercial permis) dessinée en vert sur noir
  var G_ROAD = "#48fb4a", G_WATER = "#3ccc3f";
  var TERM_STYLE = {
    version: 8,
    sources: { omt: { type: "vector", url: "https://tiles.openfreemap.org/planet" } },
    layers: [
      { id: "fond", type: "background", paint: { "background-color": "#333333" } },
      { id: "sols", type: "fill", source: "omt", "source-layer": "landcover", paint: { "fill-color": "#353535" } },
      { id: "usages", type: "fill", source: "omt", "source-layer": "landuse", paint: { "fill-color": "#363636" } },
      { id: "parcs", type: "fill", source: "omt", "source-layer": "park", paint: { "fill-color": "#363636" } },
      { id: "eau", type: "fill", source: "omt", "source-layer": "water", paint: { "fill-color": G_WATER } },
      { id: "cours_eau", type: "line", source: "omt", "source-layer": "waterway", paint: { "line-color": G_WATER, "line-width": ["interpolate", ["linear"], ["zoom"], 10, 0.6, 16, 3] } },
      { id: "batiments", type: "fill", source: "omt", "source-layer": "building", paint: { "fill-color": "#3a3a3a" } },
      { id: "limites", type: "line", source: "omt", "source-layer": "boundary", paint: { "line-color": "#2b2b2b", "line-width": 1.2 } },
      { id: "rail", type: "line", source: "omt", "source-layer": "transportation", filter: ["in", ["get", "class"], ["literal", ["rail", "transit"]]], paint: { "line-color": "#6b9f6d", "line-width": 1 } },
      { id: "sentiers", type: "line", source: "omt", "source-layer": "transportation", filter: ["in", ["get", "class"], ["literal", ["path", "track"]]],
        paint: { "line-color": "#44fb46", "line-width": ["interpolate", ["linear"], ["zoom"], 12, 0.5, 17, 2.5], "line-dasharray": [2, 1.5] } },
      { id: "chemins", type: "line", source: "omt", "source-layer": "transportation", filter: ["in", ["get", "class"], ["literal", ["service", "minor"]]],
        paint: { "line-color": "#44fb46", "line-width": ["interpolate", ["linear"], ["zoom"], 12, 0.5, 17, 2.5] } },
      { id: "routes", type: "line", source: "omt", "source-layer": "transportation", filter: ["in", ["get", "class"], ["literal", ["primary", "secondary", "tertiary"]]],
        paint: { "line-color": "#4cfb4e", "line-width": ["interpolate", ["linear"], ["zoom"], 8, 0.6, 16, 5] } },
      { id: "autoroutes", type: "line", source: "omt", "source-layer": "transportation", filter: ["in", ["get", "class"], ["literal", ["motorway", "trunk"]]],
        paint: { "line-color": G_ROAD, "line-width": ["interpolate", ["linear"], ["zoom"], 6, 0.8, 16, 7] } }
    ]
  };
  var glPromise = null, termLayer = null;
  function loadGL() {
    if (glPromise) return glPromise;
    glPromise = new Promise(function (res, rej) {
      var css = document.createElement("link"); css.rel = "stylesheet"; css.href = "https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css"; document.head.appendChild(css);
      function js(src, next) { var sc = document.createElement("script"); sc.src = src; sc.onload = next; sc.onerror = function () { glPromise = null; rej(); }; document.head.appendChild(sc); }
      js("https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js", function () {
        js("https://unpkg.com/@maplibre/maplibre-gl-leaflet@0.1.1/leaflet-maplibre-gl.js", function () { L.maplibreGL ? res() : rej(); });
      });
    });
    return glPromise;
  }
  function terminalVector(on) {
    var m = $("#map");
    if (!on) {
      if (termLayer && map.hasLayer(termLayer)) map.removeLayer(termLayer);
      m.classList.remove("term-vec");
      if (baseLayer && !map.hasLayer(baseLayer)) baseLayer.addTo(map);
      return;
    }
    // en attendant (ou sans réseau la première fois) : filtre vert sur la carte choisie
    loadGL().then(function () {
      if (!m.classList.contains("skin-terminal")) return;
      if (!termLayer) termLayer = L.maplibreGL({ style: TERM_STYLE, attribution: '<a href="https://openfreemap.org">OpenFreeMap</a> &copy; <a href="https://www.openmaptiles.org/">OpenMapTiles</a> ' + OSM_ATTR });
      if (!map.hasLayer(termLayer)) termLayer.addTo(map);
      var gm = termLayer.getMaplibreMap && termLayer.getMaplibreMap();
      var ok = function () {
        if (!m.classList.contains("skin-terminal")) return;
        if (baseLayer && map.hasLayer(baseLayer)) map.removeLayer(baseLayer);
        m.classList.add("term-vec");
      };
      // On ne retire la carte d'origine qu'une fois la carte vectorielle réellement dessinée
      if (gm && gm.on) {
        if (gm.loaded && gm.loaded()) ok(); else gm.once("load", ok);
        gm.on("error", function (ev) { try { console.warn("Terminal :", ev && ev.error && ev.error.message); } catch (e) {} });
      } else ok();
    }).catch(function () {});
  }
  var SKINS = {
    naturel: ["Naturel", "La carte telle quelle"],
    terminal: ["Terminal", "Écran rétro à phosphore vert, carte vectorielle"],
    parchemin: ["Parchemin", "Tons sépia, comme les gravures"],
    nuitrouge: ["Nuit rouge", "Préserve la vision de nuit"]
  };
  function setSkin(id) {
    if (!SKINS[id]) id = "naturel";
    var m = $("#map");
    Object.keys(SKINS).forEach(function (k) { m.classList.remove("skin-" + k); });
    if (id !== "naturel") m.classList.add("skin-" + id);
    save("sylva_skin", id);
    terminalVector(id === "terminal");
    $all("#skinList [data-skin]").forEach(function (x) { x.classList.toggle("on", x.dataset.skin === id); });
  }

  function osmQuery(lat, lon) {
    return "[out:json][timeout:25];(" +
      'nwr["tourism"="camp_site"](around:25000,' + lat + "," + lon + ");" +
      'node["amenity"="drinking_water"](around:12000,' + lat + "," + lon + ");" +
      'node["natural"="spring"]["drinking_water"="yes"](around:12000,' + lat + "," + lon + ");" +
      ");out center tags;";
  }

  var focusPoint = null; // lieu recherché : prioritaire sur la position GPS
  function refPoint() {
    if (focusPoint) return focusPoint;
    if (me) return [me[0], me[1]];
    return map ? [map.getCenter().lat, map.getCenter().lng] : ZONE.centre;
  }

  function loadOsm(force) {
    loadPoi(force); loadChasse(force);
    var c = refPoint();
    var cached = load("sylva_osm", null);
    var fresh = cached && (Date.now() - cached.t < 7 * 864e5) && distKm(cached.c, c) < 8;
    if (fresh && !force) { updateMapCard(); return; }
    if (!navigator.onLine) {
      if (force) toast("Pas de réseau : zones en cache affichées");
      updateMapCard(); return;
    }
    setMapCard("Chargement des zones…", "Aires de bivouac et points d'eau depuis OpenStreetMap");
    fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "data=" + encodeURIComponent(osmQuery(c[0].toFixed(5), c[1].toFixed(5)))
    }).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    }).then(function (data) {
      save("sylva_osm", { t: Date.now(), c: c, elements: data.elements || [] });
      renderOsm(data.elements || []);
      if (force) toast("Zones mises à jour");
    }).catch(function () {
      if (force) toast("Serveur OpenStreetMap indisponible, réessayez");
      updateMapCard();
    });
  }


  // ---------- Chasse : territoires et dates de la saison (SPW, service public CHASSE_DATEFERM) ----------
  // Couche 1 « Territoires de chasse » : un polygone par territoire avec toutes les dates de la saison (battue, affût, autre ; chemins fermés ou non)
  var CHASSE_URL = "https://geoservices3.wallonie.be/arcgis/rest/services/APP_DNFEXT/CHASSE_DATEFERM/MapServer/1/query";
  var CHASSE_OFFICIEL = "https://portalarcgis.spw.wallonie.be/portail/apps/experiencebuilder/experience/?id=ef94a8903433442f8082f3cdf5c7d3bd";
  var chasseErr = "";
  function ymd(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function inWallonie(c) { return c[0] > 49.45 && c[0] < 50.82 && c[1] > 2.8 && c[1] < 6.45; }
  var DATE_FIELDS = [["LISTOFDATEBATTUECLOSE", "Battue", true], ["LISTOFDATEBATTUEOPEN", "Battue", false], ["LISTOFDATEAFFUTCLOSE", "Affût", true],
    ["LISTOFDATEAFFUTOPEN", "Affût", false], ["LISTOFDATEAUTRECLOSE", "Autre chasse", true], ["LISTOFDATEAUTRETOPEN", "Autre chasse", false]];
  function parseDates(str) {
    var out = [], m, re = /(\d{4})-(\d{1,2})-(\d{1,2})|(\d{1,2})[\/.](\d{1,2})[\/.](\d{2,4})/g;
    str = String(str || "");
    while ((m = re.exec(str))) {
      var y, mo, d;
      if (m[1]) { y = +m[1]; mo = +m[2]; d = +m[3]; } else { d = +m[4]; mo = +m[5]; y = +m[6]; if (y < 100) y += 2000; }
      out.push(y + "-" + String(mo).padStart(2, "0") + "-" + String(d).padStart(2, "0"));
    }
    return out;
  }
  function chasseDates(p) {
    var list = [];
    DATE_FIELDS.forEach(function (f) { parseDates(p[f[0]]).forEach(function (d) { list.push({ d: d, mode: f[1], ferme: f[2] }); }); });
    if (!list.length) parseDates(p.LISTOFDATETXT).forEach(function (d) { list.push({ d: d, mode: "Chasse", ferme: false }); });
    list.sort(function (a, b) { return a.d < b.d ? -1 : a.d > b.d ? 1 : 0; });
    return list;
  }
  function fetchChasse(c, km) {
    var dLat = km / 111, dLon = km / (111 * Math.cos(c[0] * Math.PI / 180));
    var q = "where=1%3D1&geometry=" + [c[1] - dLon, c[0] - dLat, c[1] + dLon, c[0] + dLat].map(function (v) { return v.toFixed(4); }).join(",") +
      "&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelIntersects&outSR=4326" +
      "&outFields=KEYG,N_LOT,UGC_NOM,SAISON_TXT,LISTOFDATETXT,LISTOFDATEBATTUECLOSE,LISTOFDATEBATTUEOPEN,LISTOFDATEAFFUTCLOSE,LISTOFDATEAFFUTOPEN,LISTOFDATEAUTRECLOSE,LISTOFDATEAUTRETOPEN,DATE_EXTRACT" +
      "&returnGeometry=true&maxAllowableOffset=0.0002&geometryPrecision=5&f=geojson";
    return fetch(CHASSE_URL + "?" + q).then(function (r) {
      if (!r.ok) throw new Error("le serveur a répondu " + r.status);
      return r.json();
    }).then(function (g) {
      if (g && g.error) throw new Error("erreur du serveur : " + (g.error.message || g.error.code));
      if (!g || !g.features) throw new Error("réponse inattendue du serveur");
      chasseErr = "";
      return g.features.map(function (f) { var p = f.properties || {}; return { geom: f.geometry, nom: p.UGC_NOM || "", lot: p.N_LOT || "", saison: p.SAISON_TXT || "", dates: chasseDates(p), raw: p.LISTOFDATETXT || "" }; });
    }).catch(function (e) {
      chasseErr = e && e.message && !/Failed to fetch|Load failed|NetworkError/i.test(e.message) ? e.message : "serveur wallon injoignable depuis l'appli";
      throw e;
    });
  }
  function frDate(d) { return new Date(d + "T12:00:00").toLocaleDateString("fr-BE", { weekday: "short", day: "numeric", month: "short" }); }
  function pointIn(pt, geom) {
    if (!geom) return false;
    var polys = geom.type === "Polygon" ? [geom.coordinates] : geom.type === "MultiPolygon" ? geom.coordinates : [];
    var x = pt[1], y = pt[0];
    return polys.some(function (poly) {
      var inside = false, ring = poly[0] || [];
      for (var i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        var xi = ring[i][0], yi = ring[i][1], xj = ring[j][0], yj = ring[j][1];
        if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) inside = !inside;
      }
      return inside;
    });
  }
  var chasseLayer = null;
  function renderChasse(terrs) {
    if (!map || !window.L || !L.geoJSON) return;
    if (!chasseLayer) chasseLayer = L.layerGroup();
    chasseLayer.clearLayers();
    var today = ymd(new Date()), lim = ymd(new Date(Date.now() + 14 * 864e5));
    terrs.forEach(function (t) {
      var up = t.dates.filter(function (x) { return x.d >= today; });
      var now = up.some(function (x) { return x.d === today; }), soon = up.some(function (x) { return x.d <= lim; });
      var closedSoon = up.some(function (x) { return x.d <= lim && x.ferme; });
      var lines = up.slice(0, 12).map(function (x) {
        return "<li" + (x.d === today ? ' style="color:#C9472E;font-weight:700"' : "") + "><b>" + esc(frDate(x.d)) + "</b> · " + esc(x.mode) + (x.ferme ? ' · <span style="color:#C9472E;font-weight:700">chemins fermés</span>' : "") + "</li>";
      }).join("");
      var html = "<b>" + (now ? "Chasse aujourd'hui" : soon ? "Chasse dans les 2 semaines" : "Territoire de chasse") + '</b><br><span style="font-size:12px;opacity:.75">' + esc(t.nom || "Territoire") + (t.lot ? " · lot " + esc(t.lot) : "") + "</span>" +
        (lines ? '<div style="margin-top:8px;font-size:12px;font-weight:700">Prochaines dates</div><ul style="margin:4px 0 8px;padding-left:18px">' + lines + "</ul>" : '<p style="margin:8px 0">Aucune date à venir annoncée pour cette saison.</p>') +
        '<span style="font-size:11px;opacity:.75">Source : SPW, annonces au DNF. Seules les affiches sur le terrain font foi.</span><br>' +
        '<a href="' + CHASSE_OFFICIEL + '" target="_blank" rel="noopener">Carte officielle</a>';
      L.geoJSON(t.geom, { style: { color: now ? "#C9472E" : soon ? "#E9A23B" : "#8A7F6A", weight: now || soon ? 2.5 : 1, opacity: now || soon ? .95 : .6,
        fillOpacity: now ? .3 : soon ? .16 : .04, dashArray: closedSoon || now ? null : "4 4" } }).bindPopup(html, { minWidth: 240, maxHeight: 320 }).addTo(chasseLayer);
    });
    layers.chasse = chasseLayer;
    var chip = document.querySelector('.map-chips [data-layer="chasse"]');
    if (chip && chip.classList.contains("on") && !map.hasLayer(chasseLayer)) chasseLayer.addTo(map);
  }
  function loadChasse(force) {
    if (!map) return;
    var c = refPoint(), cached = load("sylva_chasse2", null);
    if (cached) renderChasse(cached.f);
    if (cached && Date.now() - cached.t < 12 * 3600e3 && distKm(cached.c, c) < 5 && !force) return;
    if (!inWallonie(c) || !navigator.onLine) return;
    fetchChasse(c, 8).then(function (f) { save("sylva_chasse2", { t: Date.now(), c: c, f: f }); renderChasse(f); })
      .catch(function () { if (force) toast("Chasse : " + chasseErr); });
  }
  // Bivouac : es-tu dans un territoire de chasse, et y a-t-il une chasse aux dates de la sortie ?
  function tripChasse() {
    var box = $("#tripChasse"); if (!box) return;
    var t = getTrip();
    if (t.lat == null || !inWallonie([t.lat, t.lon])) { box.innerHTML = ""; return; }
    var key = t.lat.toFixed(3) + "," + t.lon.toFixed(3), cached = load("sylva_chasse_trip2", null);
    var days = t.date ? [t.date, ymd(new Date(new Date(t.date + "T12:00:00").getTime() + 864e5))] : [];
    var show = function (terrs, when) {
      var pt = [t.lat, t.lon], inside = terrs.filter(function (x) { return pointIn(pt, x.geom); });
      var hits = [];
      terrs.forEach(function (x) { x.dates.forEach(function (d) { if (days.indexOf(d.d) !== -1) hits.push({ t: x, d: d, here: inside.indexOf(x) !== -1 }); }); });
      var hereHits = hits.filter(function (h) { return h.here; }), closed = hits.some(function (h) { return h.d.ferme; });
      var cls, title, txt;
      if (hereHits.length) { cls = "alert-danger"; title = "Chasse sur ton lieu de bivouac"; }
      else if (hits.length) { cls = "alert-danger"; title = "Chasse tout près de ton lieu"; }
      else if (inside.length) { cls = "alert-warn"; title = "Ton lieu est dans un territoire de chasse"; }
      else { cls = "alert-ok"; title = "Pas de territoire de chasse sur ton lieu"; }
      if (hits.length) {
        txt = hits.slice(0, 4).map(function (h) { return frDate(h.d.d) + " : " + h.d.mode.toLowerCase() + (h.d.ferme ? " (chemins fermés)" : "") + (h.t.nom ? " · " + h.t.nom : ""); }).join(" ; ") +
          (closed ? ". Des chemins seront fermés : change d'endroit ou de date." : ". Porte une couleur vive et respecte les affiches.");
      } else if (inside.length) {
        var nx = inside[0].dates.filter(function (d) { return d.d >= ymd(new Date()); })[0];
        txt = (t.date ? "Aucune chasse annoncée le " + days.map(frDate).join(" et le ") + ". " : "") + (nx ? "Prochaine date annoncée sur ce territoire : " + frDate(nx.d) + " (" + nx.mode.toLowerCase() + ")." : "Pas d'autre date annoncée cette saison.");
      } else txt = "Aucun territoire de chasse déclaré sur ce point.";
      box.innerHTML = '<div class="alert ' + cls + ' meteo-alert"><strong>' + esc(title) + "</strong><span>" + esc(txt) +
        ' <a href="' + CHASSE_OFFICIEL + '" target="_blank" rel="noopener">Carte officielle</a><br><small>' + terrs.length + " territoire(s) lus autour du lieu · vérifié le " +
        new Date(when).toLocaleString("fr-BE", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) + ". Seules les affiches sur le terrain font foi.</small></span></div>";
    };
    if (cached && cached.key === key) show(cached.f, cached.t);
    if ((cached && cached.key === key && Date.now() - cached.t < 6 * 3600e3) || !navigator.onLine) return;
    fetchChasse([t.lat, t.lon], 3).then(function (f) {
      save("sylva_chasse_trip2", { key: key, t: Date.now(), f: f }); show(f, Date.now());
    }).catch(function () {
      if (!(cached && cached.key === key)) box.innerHTML = '<div class="alert alert-warn meteo-alert"><strong>Chasse : vérifie avant de partir</strong><span>Lecture des chasses impossible (' + esc(chasseErr) + '). <a href="' + CHASSE_OFFICIEL + '" target="_blank" rel="noopener">Ouvrir la carte officielle</a></span></div>';
    });
  }
  // ---------- Services autour (OpenStreetMap) : magasins, pharmacie, carburant… ----------
  var POI = [
    ["alim", "Alimentation", "#7FB069", "🛒", function (t) { return /^(supermarket|convenience|bakery|butcher|greengrocer|farm|deli|general)$/.test(t.shop); }],
    ["sante", "Santé", "#E0584A", "+", function (t) { return /^(pharmacy|doctors|hospital|clinic|dentist)$/.test(t.amenity); }],
    ["carbu", "Carburant", "#5B7FC7", "⛽", function (t) { return t.amenity === "fuel"; }],
    ["resto", "Restaurant / café", "#D9822B", "🍴", function (t) { return /^(restaurant|cafe|bar|pub|fast_food)$/.test(t.amenity); }],
    ["outdoor", "Matériel / bricolage", "#8A6D4B", "🔧", function (t) { return /^(outdoor|sports|hardware|doityourself)$/.test(t.shop); }],
    ["argent", "Distributeur", "#4E8F7A", "€", function (t) { return t.amenity === "atm" || t.amenity === "bank"; }],
    ["transport", "Gare", "#6B6B9A", "🚆", function (t) { return t.railway === "station" || t.public_transport === "station"; }],
    ["wc", "Toilettes", "#7C8A80", "WC", function (t) { return t.amenity === "toilets"; }],
    ["police", "Police", "#33497A", "👮", function (t) { return t.amenity === "police"; }],
    ["parking", "Parking", "#2F6FB5", "P", function (t) { return t.amenity === "parking" && !/^(private|no|customers|permit|delivery)$/.test(t.access || ""); }]
  ];
  var PARK_FR = { surface: "en plein air", underground: "souterrain", "multi-storey": "à étages", street_side: "le long de la route", lane: "le long de la route", rooftop: "sur le toit" };
  var POI_FR = { supermarket: "Supermarché", convenience: "Épicerie", bakery: "Boulangerie", butcher: "Boucherie", greengrocer: "Primeur", farm: "Vente à la ferme", deli: "Traiteur", general: "Magasin",
    pharmacy: "Pharmacie", doctors: "Médecin", hospital: "Hôpital", clinic: "Clinique", dentist: "Dentiste", fuel: "Station-service", restaurant: "Restaurant", cafe: "Café",
    bar: "Bar", pub: "Café", parking: "Parking", fast_food: "Snack", outdoor: "Magasin outdoor", sports: "Magasin de sport", hardware: "Quincaillerie", doityourself: "Bricolage",
    atm: "Distributeur", bank: "Banque", toilets: "Toilettes", police: "Police", station: "Gare" };
  function poiQuery(lat, lon) {
    var a = "(around:8000," + lat + "," + lon + ");";
    return "[out:json][timeout:25];(" +
      'nwr["shop"~"^(supermarket|convenience|bakery|butcher|greengrocer|farm|deli|general|outdoor|sports|hardware|doityourself)$"]' + a +
      'nwr["amenity"~"^(pharmacy|doctors|hospital|clinic|dentist|fuel|restaurant|cafe|bar|pub|fast_food|atm|bank|toilets|police)$"]' + a +
      'nwr["amenity"="parking"]["access"!~"^(private|no|customers|permit|delivery)$"]' + a +
      'nwr["railway"="station"]' + a + ");out center tags 700;";
  }
  function hoursFr(h) {
    var D = { Mo: "lun", Tu: "mar", We: "mer", Th: "jeu", Fr: "ven", Sa: "sam", Su: "dim", PH: "fériés" };
    return String(h).replace(/\b(Mo|Tu|We|Th|Fr|Sa|Su|PH)\b/g, function (m) { return D[m]; })
      .replace(/\boff\b|\bclosed\b/g, "fermé").replace(/24\/7/, "24 h/24, 7 j/7").replace(/\s*;\s*/g, " · ").replace(/(\d\d):(\d\d)/g, "$1h$2");
  }
  function loadPoi(force) {
    if (!map || !map.hasLayer(layers.services)) return;
    var c = refPoint(), cached = load("sylva_poi", null);
    var fresh = cached && (Date.now() - cached.t < 7 * 864e5) && distKm(cached.c, c) < 5;
    if (cached) renderPoi(cached.elements);
    if ((fresh && !force) || !navigator.onLine) return;
    fetch("https://overpass-api.de/api/interpreter", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "data=" + encodeURIComponent(poiQuery(c[0].toFixed(5), c[1].toFixed(5))) })
      .then(function (r) { if (!r.ok) throw new Error(); return r.json(); })
      .then(function (d) { save("sylva_poi", { t: Date.now(), c: c, elements: d.elements || [] }); renderPoi(d.elements || []); })
      .catch(function () {});
  }
  function renderPoi(els) {
    if (!map) return;
    layers.services.clearLayers();
    (els || []).forEach(function (el) {
      var lat = el.lat != null ? el.lat : el.center && el.center.lat, lon = el.lon != null ? el.lon : el.center && el.center.lon;
      if (lat == null) return;
      var t = el.tags || {}, k = POI.filter(function (x) { return x[4](t); })[0]; if (!k) return;
      var typ = POI_FR[t.shop] || POI_FR[t.amenity] || (t.railway === "station" ? "Gare" : k[1]);
      var name = t.name || typ, lines = [];
      if (k[0] === "parking") {
        var pk = [PARK_FR[t.parking] || "", t.capacity ? t.capacity + " places" : "", t.fee === "yes" ? "payant" : t.fee === "no" ? "gratuit" : "", t.maxstay ? "durée max. " + t.maxstay : "", t.supervised === "yes" ? "surveillé" : ""].filter(Boolean);
        if (pk.length) lines.push(esc(pk.join(" · ")));
        if (t.fee === "yes" && t.charge) lines.push("Tarif : " + esc(t.charge));
        if (t.access === "destination") lines.push("Réservé aux visiteurs du lieu");
      }
      if (t.opening_hours) lines.push("Horaires : " + esc(hoursFr(t.opening_hours)));
      var tel = t.phone || t["contact:phone"]; if (tel) lines.push('Tél. : <a href="tel:' + esc(tel.replace(/\s/g, "")) + '">' + esc(tel) + "</a>");
      var addr = [t["addr:street"] && (t["addr:street"] + (t["addr:housenumber"] ? " " + t["addr:housenumber"] : "")), t["addr:city"]].filter(Boolean).join(", ");
      if (addr) lines.push(esc(addr));
      var d = me ? '<br><span style="color:#A9B3A6">À ' + fmtKm(distKm([me[0], me[1]], [lat, lon])) + " de toi</span>" : "";
      var web = t.website || t["contact:website"];
      var html = "<b>" + esc(name) + '</b><br><span style="color:#A9B3A6">' + esc(typ) + "</span>" + d +
        (lines.length ? "<br><br>" + lines.join("<br>") : "") + (web ? '<br><a href="' + esc(web) + '" target="_blank" rel="noopener">Site web</a>' : "") +
        '<div class="spot-actions"><button class="sa-gps" data-go-lat="' + lat + '" data-go-lon="' + lon + '" data-go-name="' + esc(name) + '">Y aller</button></div>' +
        '<span style="font-size:11px;color:#A9B3A6">Infos OpenStreetMap : horaires à vérifier.</span>';
      layers.services.addLayer(L.marker([lat, lon], { icon: pinIcon(k[2], k[3]) }).bindPopup(html, { minWidth: 220 }));
    });
  }

  function yesNo(v) { return v === "yes" ? "oui" : v === "no" ? "non" : v; }

  function renderOsm(elements) {
    if (!map) return;
    layers.bivouac.clearLayers(); layers.eau.clearLayers();
    osmPlaces = [];
    elements.forEach(function (el) {
      var lat = el.lat != null ? el.lat : el.center && el.center.lat;
      var lon = el.lon != null ? el.lon : el.center && el.center.lon;
      if (lat == null || lon == null) return;
      var t = el.tags || {};
      var kind;
      if (t.tourism === "camp_site") kind = (t.backcountry === "yes" || t.camp_site === "basic") ? "bivouac" : "camping";
      else kind = "eau";
      osmPlaces.push({ kind: kind, lat: lat, lon: lon, tags: t });
    });
    osmPlaces.forEach(function (p) {
      var t = p.tags, html, marker;
      if (p.kind === "eau") {
        html = "<b>" + esc(t.name || (t.natural === "spring" ? "Source potable" : "Point d'eau potable")) + "</b><br>" +
          '<span style="color:#A9B3A6">Signalé sur OpenStreetMap. Vérifiez sur place qu\'il est en service.</span>';
        marker = L.marker([p.lat, p.lon], { icon: pinIcon("#6FB7D0", "E") }).bindPopup(html);
        layers.eau.addLayer(marker);
        return;
      }
      var isBiv = p.kind === "bivouac";
      var lines = [];
      if (t.maxstay) lines.push("Durée max : " + esc(t.maxstay));
      if (t.maxtents) lines.push("Tentes max : " + esc(t.maxtents));
      if (t.capacity) lines.push("Personnes max : " + esc(t.capacity));
      if (t.openfire) lines.push("Feu autorisé : " + esc(yesNo(t.openfire)));
      if (t.drinking_water) lines.push("Eau potable : " + esc(yesNo(t.drinking_water)));
      if (t.toilets) lines.push("Toilettes : " + esc(yesNo(t.toilets)));
      if (t.fee) lines.push("Payant : " + esc(yesNo(t.fee)));
      if (t.reservation) lines.push("Réservation : " + esc(yesNo(t.reservation)));
      if (t.opening_hours) lines.push("Horaires : " + esc(t.opening_hours));
      var d = me ? '<br><span style="color:#A9B3A6">À ' + fmtKm(distKm([me[0], me[1]], [p.lat, p.lon])) + " de vous</span>" : "";
      html = "<b>" + esc(t.name || (isBiv ? "Aire de bivouac" : "Camping")) + "</b><br>" +
        '<span style="color:' + (isBiv ? "#8CCB7E" : "#A9B3A6") + '">' + (isBiv ? "Aire de bivouac" : "Camping (souvent fermé en hiver)") + "</span>" + d +
        (lines.length ? "<br><br>" + lines.join("<br>") : "") +
        (t.website ? '<br><a href="' + esc(t.website) + '" target="_blank" rel="noopener">Site web</a>' : "") +
        '<br><br><a href="https://maps.apple.com/?daddr=' + p.lat + "," + p.lon + '&dirflg=w" target="_blank" rel="noopener">Itinéraire à pied</a>';
      marker = L.marker([p.lat, p.lon], { icon: pinIcon(isBiv ? "#8CCB7E" : "#7C8A80", isBiv ? "B" : "C") }).bindPopup(html);
      p.marker = marker;
      layers.bivouac.addLayer(marker);
    });
    updateMapCard();
  }

  function setMapCard(title, sub, onClick) {
    var card = $("#mapCard");
    card.innerHTML = '<div class="map-card-title">' + esc(title) + '</div><div class="map-card-sub">' + esc(sub) + "</div>";
    card.onclick = onClick || null;
  }

  function updateMapCard() {
    if (!map) return;
    var from = refPoint();
    var biv = osmPlaces.filter(function (p) { return p.kind === "bivouac"; });
    if (!biv.length) {
      var cached = load("sylva_osm", null);
      setMapCard(cached ? "Aucune aire de bivouac référencée dans un rayon de 25 km" : "Zones pas encore chargées",
        cached ? "Plan B : terrain privé avec l'accord du propriétaire" : "Ouvrez la carte avec du réseau avant de partir");
      return;
    }
    biv.sort(function (a, b) { return distKm(from, [a.lat, a.lon]) - distKm(from, [b.lat, b.lon]); });
    var n = biv[0];
    setMapCard("Bivouac le plus proche : " + fmtKm(distKm(from, [n.lat, n.lon])),
      (n.tags.name || "Aire de bivouac") + " · " + biv.length + " aire(s) dans la zone · toucher pour voir",
      function () { map.setView([n.lat, n.lon], 15); n.marker && n.marker.openPopup(); });
  }

  // ---------- Spots perso ----------
  var SPOT_TYPES = {
    plante: ["#8CCB7E", "P", "Plante"], eau: ["#6FB7D0", "E", "Point d'eau"], bivouac: ["#E9A23B", "B", "Emplacement"],
    danger: ["#F07A5A", "!", "Danger"], animal: ["#C7B9DE", "A", "Animal"], autre: ["#EEE9DD", "•", "Autre"]
  };
  function getSpots() { return load("sylva_spots", []); }
  var spotMarkers = {};
  function renderSpots() {
    if (!map) return;
    layers.spots.clearLayers(); spotMarkers = {};
    getSpots().forEach(function (s) {
      var ty = SPOT_TYPES[s.type] || SPOT_TYPES.autre;
      var html = "<b>" + esc(ty[2]) + "</b><br>" + esc(s.note || "(sans note)") +
        (s.photo ? '<img class="popup-photo" data-spot-photo="' + esc(s.id) + '" alt="Photo du spot" hidden>' : "") +
        '<br><span style="color:#A9B3A6;font-size:12px">' + esc(new Date(s.date).toLocaleString("fr-BE")) + "</span>" +
        '<div class="spot-actions"><button data-gps-spot="' + esc(s.id) + '" class="sa-gps">GPS</button>' +
        '<button data-edit-spot="' + esc(s.id) + '">Modifier</button>' +
        '<button data-del-spot="' + esc(s.id) + '" class="sa-del">Supprimer</button></div>';
      var mk = L.marker([s.lat, s.lon], { icon: pinIcon(ty[0], ty[1]) }).bindPopup(html, { minWidth: 240 });
      spotMarkers[s.id] = mk; layers.spots.addLayer(mk);
    });
  }
  // ---------- Parcourir mes spots depuis la carte ----------
  var spotsFilter = "";
  function renderSpotsPanel() {
    var all = getSpots(), q = norm($("#spotsQ").value.trim());
    var ref = me ? [me[0], me[1]] : (map ? [map.getCenter().lat, map.getCenter().lng] : null);
    var used = {}; all.forEach(function (s) { used[s.type in SPOT_TYPES ? s.type : "autre"] = 1; });
    $("#spotsFilt").innerHTML = Object.keys(used).length > 1 ? '<button type="button" class="chip' + (!spotsFilter ? " on" : "") + '" data-sfilt="">Tous</button>' +
      Object.keys(SPOT_TYPES).filter(function (k) { return used[k]; }).map(function (k) { return '<button type="button" class="chip' + (spotsFilter === k ? " on" : "") + '" data-sfilt="' + k + '">' + esc(SPOT_TYPES[k][2]) + "</button>"; }).join("") : "";
    var list = all.filter(function (s) {
      var ty = s.type in SPOT_TYPES ? s.type : "autre";
      if (spotsFilter && ty !== spotsFilter) return false;
      return !q || norm((s.note || "") + " " + SPOT_TYPES[ty][2]).indexOf(q) !== -1;
    }).map(function (s) { return { s: s, d: ref ? distKm(ref, [s.lat, s.lon]) : null }; });
    list.sort(function (a, b) { return a.d == null ? 0 : a.d - b.d; });
    $("#spotsList").innerHTML = !all.length ? '<p class="tiny muted" style="margin:6px 4px">Aucun spot. Touche la carte puis « Ajouter un spot ».</p>'
      : !list.length ? '<p class="tiny muted" style="margin:6px 4px">Aucun spot ne correspond.</p>'
      : list.map(function (x) {
        var s = x.s, ty = SPOT_TYPES[s.type] || SPOT_TYPES.autre;
        return '<button type="button" class="spot-row" data-spot-go="' + esc(s.id) + '"><i style="background:' + ty[0] + '">' + esc(ty[1]) + "</i><span><b>" + esc(s.note || ty[2]) + "</b><small>" + esc(ty[2]) +
          (x.d != null ? " · " + fmtKm(x.d) + (me ? "" : " du centre") : "") + "</small></span></button>";
      }).join("");
  }
  $("#btnSpots").addEventListener("click", function () {
    var p = $("#spotsPanel"); $("#basemapPanel").hidden = true;
    p.hidden = !p.hidden; if (!p.hidden) { $("#spotsQ").value = ""; renderSpotsPanel(); }
  });
  $("#spotsQ").addEventListener("input", renderSpotsPanel);
  $("#spotsFilt").addEventListener("click", function (e) { var b = e.target.closest("[data-sfilt]"); if (!b) return; spotsFilter = b.dataset.sfilt; renderSpotsPanel(); });
  $("#spotsList").addEventListener("click", function (e) {
    var b = e.target.closest("[data-spot-go]"); if (!b || !map) return;
    var s = getSpots().filter(function (x) { return x.id === b.dataset.spotGo; })[0]; if (!s) return;
    $("#spotsPanel").hidden = true;
    if (!map.hasLayer(layers.spots)) { map.addLayer(layers.spots); var c = document.querySelector('.map-chips [data-layer="spots"]'); if (c) c.classList.add("on"); }
    map.setView([s.lat, s.lon], Math.max(map.getZoom(), 16));
    setTimeout(function () { if (spotMarkers[s.id]) spotMarkers[s.id].openPopup(); }, 150);
  });

  function deleteSpot(id) {
    save("sylva_spots", getSpots().filter(function (s) { return s.id !== id; }));
    idbDo("readwrite", function (st) { return st.delete(id); }).catch(function () {});
    renderSpots(); toast("Spot supprimé");
  }
  var pendingSpotPos = null, pendingSpotBlob = null;
  $("#spotPhoto").addEventListener("change", function (e) {
    var file = e.target.files && e.target.files[0]; e.target.value = "";
    if (!file) return;
    resizeImage(file).then(function (blob) {
      pendingSpotBlob = blob;
      var pv = $("#spotPhotoPreview"); pv.src = URL.createObjectURL(blob); pv.hidden = false;
    }).catch(function () { toast("Photo illisible"); });
  });
  $("#btnAddSpot").addEventListener("click", function () {
    if (!map) return;
    if (me) { pendingSpotPos = [me[0], me[1]]; $("#spotPosInfo").textContent = "Position GPS actuelle (± " + Math.round(me[2]) + " m)"; }
    else { var c = map.getCenter(); pendingSpotPos = [c.lat, c.lng]; $("#spotPosInfo").textContent = "Pas de GPS : le spot sera placé au centre de la carte."; }
    openSpotForm();
  });
  var editingSpot = null;
  function openSpotForm() {
    editingSpot = null; $("#spotTitle").textContent = "Nouveau spot";
    $("#spotNote").value = "";
    pendingSpotBlob = null; $("#spotPhotoPreview").hidden = true;
    openModal("#modalSpot");
  }
  function editSpot(id) {
    var s = getSpots().filter(function (x) { return x.id === id; })[0]; if (!s) return;
    editingSpot = id; pendingSpotBlob = null;
    $("#spotTitle").textContent = "Modifier le spot";
    $("#spotType").value = s.type; $("#spotNote").value = s.note || "";
    $("#spotPosInfo").textContent = "Position : " + s.lat.toFixed(5) + ", " + s.lon.toFixed(5);
    var pv = $("#spotPhotoPreview"); pv.hidden = true;
    if (s.photo) spotPhotoUrl(id).then(function (u) { if (u) { pv.src = u; pv.hidden = false; } });
    openModal("#modalSpot");
  }
  // GPS : guidage vers le spot (appli Plans / Google Maps avec réseau, ligne droite + cap sans réseau)
  var gpsLine = null;
  function capTxt(deg) { return ["nord", "nord-est", "est", "sud-est", "sud", "sud-ouest", "ouest", "nord-ouest"][Math.round(deg / 45) % 8]; }
  function gpsSpot(id) {
    var s = getSpots().filter(function (x) { return x.id === id; })[0]; if (!s) return;
    var ty = SPOT_TYPES[s.type] || SPOT_TYPES.autre;
    startNav({ lat: s.lat, lon: s.lon, label: s.note ? s.note.slice(0, 40) : ty[2] });
  }

  // ---------- Guidage GPS dans Sylva ----------
  // Avec réseau : itinéraire à pied sur les chemins (OSRM, profil piéton, serveurs FOSSGIS / OpenStreetMap).
  // Sans réseau : flèche-boussole, distance et cap en ligne droite. Fonctionne avec l'écran allumé.
  var nav = null; // { t, route, steps, line, straight, lastRoute, arrived, wake }
  var heading = null, headingOn = false;
  function bearingTo(a, b) {
    var y = Math.sin((b[1] - a[1]) * Math.PI / 180) * Math.cos(b[0] * Math.PI / 180);
    var x = Math.cos(a[0] * Math.PI / 180) * Math.sin(b[0] * Math.PI / 180) - Math.sin(a[0] * Math.PI / 180) * Math.cos(b[0] * Math.PI / 180) * Math.cos((b[1] - a[1]) * Math.PI / 180);
    return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
  }
  function mDist(a, b) { return distKm(a, b) * 1000; }
  function fmtM(m) { return m < 1000 ? Math.round(m / 10) * 10 + " m" : (m / 1000).toFixed(m < 10000 ? 1 : 0).replace(".", ",") + " km"; }
  // Modes : profil OSRM (serveurs FOSSGIS), vitesse moyenne sans réseau (km/h), écart toléré (m), mots
  var NAV_MODES = {
    pied: { prof: "routed-foot", kmh: 4, off: 60, by: "par les chemins", how: "à pied", step: 400 },
    velo: { prof: "routed-bike", kmh: 15, off: 80, by: "par les chemins et routes", how: "à vélo", step: 600 },
    voiture: { prof: "routed-car", kmh: 50, off: 120, by: "par la route", how: "en voiture", step: 1200 }
  };
  function navMode() { return NAV_MODES[nav && nav.mode] || NAV_MODES.pied; }
  function fmtSec(sec) { var mn = Math.max(1, Math.round(sec / 60)); return mn < 60 ? mn + " min" : Math.floor(mn / 60) + " h " + String(mn % 60).padStart(2, "0"); }
  function fmtMin(m) { return fmtSec(m / 1000 / navMode().kmh * 3600); }
  function onHeading(e) {
    var h = e.webkitCompassHeading != null ? e.webkitCompassHeading : (e.absolute && e.alpha != null ? 360 - e.alpha : null);
    if (h == null) return;
    heading = h; if (nav) drawNavArrow();
  }
  function startCompass() {
    if (headingOn) return;
    var go = function () { headingOn = true; window.addEventListener("deviceorientationabsolute", onHeading); window.addEventListener("deviceorientation", onHeading); };
    if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === "function") {
      DeviceOrientationEvent.requestPermission().then(function (r) { if (r === "granted") go(); }).catch(function () {});
    } else go();
  }
  var MANEUV = { "turn": "Tourne", "new name": "Continue", "depart": "Pars", "arrive": "Arrivée", "continue": "Continue", "fork": "À la fourche, prends", "end of road": "Au bout du chemin, tourne", "roundabout": "Au rond-point, sors", "rotary": "Au rond-point, sors" };
  var SIDE = { "left": "à gauche", "right": "à droite", "slight left": "légèrement à gauche", "slight right": "légèrement à droite", "sharp left": "franchement à gauche", "sharp right": "franchement à droite", "straight": "tout droit", "uturn": "demi-tour" };
  function stepTxt(st) {
    var m = st.maneuver || {}, v = MANEUV[m.type] || "Continue", sd = SIDE[m.modifier] || "";
    if (m.type === "arrive") return "Tu arrives à destination";
    if ((m.type === "roundabout" || m.type === "rotary") && m.exit) return "Au rond-point, prends la " + m.exit + (m.exit === 1 ? "re" : "e") + " sortie" + (st.name ? " vers " + st.name : "");
    return v + (sd ? " " + sd : "") + (st.name ? " sur " + st.name : "");
  }
  function fetchRoute() {
    if (!nav || !me || !navigator.onLine) return;
    nav.lastRoute = Date.now();
    var url = "https://routing.openstreetmap.de/" + navMode().prof + "/route/v1/driving/" + me[1].toFixed(5) + "," + me[0].toFixed(5) + ";" +
      nav.t.lon.toFixed(5) + "," + nav.t.lat.toFixed(5) + "?overview=full&geometries=geojson&steps=true";
    fetch(url).then(function (r) { if (!r.ok) throw new Error(); return r.json(); }).then(function (j) {
      if (!nav || !j.routes || !j.routes[0]) return;
      var rt = j.routes[0], pts = rt.geometry.coordinates.map(function (c) { return [c[1], c[0]]; });
      // Itinéraire absurde (trop long par rapport à la ligne droite) : on reste sur la ligne droite
      var lim = nav.mode === "pied" ? Math.max(3000, mDist([me[0], me[1]], [nav.t.lat, nav.t.lon]) * 4) : Math.max(15000, mDist([me[0], me[1]], [nav.t.lat, nav.t.lon]) * 6);
      if (rt.distance > lim) { nav.route = null; return navUpdate(); }
      nav.route = pts; nav.routeDist = rt.distance; nav.routeDur = rt.duration;
      nav.steps = (rt.legs[0] && rt.legs[0].steps || []).map(function (st) { return { at: [st.maneuver.location[1], st.maneuver.location[0]], txt: stepTxt(st) }; });
      if (nav.line) map.removeLayer(nav.line);
      nav.line = L.polyline(pts, { color: nav.mode === "voiture" ? "#7A5BC7" : "#2F7FA3", weight: 6, opacity: .85 }).addTo(map);
      navUpdate();
    }).catch(function () {});
  }
  function distToRoute(p) {
    if (!nav.route) return 0;
    var best = 1e9; nav.route.forEach(function (q) { var d = mDist(p, q); if (d < best) best = d; }); return best;
  }
  function remainingOnRoute(p) {
    var r = nav.route, bi = 0, best = 1e9;
    r.forEach(function (q, i) { var d = mDist(p, q); if (d < best) { best = d; bi = i; } });
    var tot = best; for (var i = bi; i < r.length - 1; i++) tot += mDist(r[i], r[i + 1]);
    return tot;
  }
  function drawNavArrow() {
    if (!nav || !me) return;
    var brg = bearingTo([me[0], me[1]], [nav.t.lat, nav.t.lon]);
    var rot = heading == null ? brg : brg - heading;
    $("#navArrow").style.transform = "rotate(" + rot + "deg)";
    $("#navCap").textContent = "Cap " + Math.round(brg) + "° (" + capTxt(brg) + ")" + (heading == null ? " · flèche orientée vers le nord" : "");
  }
  function navUpdate() {
    if (!nav) return;
    if (!me) { $("#navDist").textContent = "…"; $("#navInfo").textContent = "En attente du GPS. Active la localisation."; return; }
    var p = [me[0], me[1]], tg = [nav.t.lat, nav.t.lon], straight = mDist(p, tg);
    if (!nav.straightLine) nav.straightLine = L.polyline([p, tg], { color: "#E9A23B", weight: 3, dashArray: "6 8" }).addTo(map);
    else nav.straightLine.setLatLngs([p, tg]);
    if (straight < 25 + Math.min(me[2] || 0, 40)) {
      if (!nav.arrived) { nav.arrived = true; if (navigator.vibrate) navigator.vibrate([200, 100, 200]); toast("Tu es arrivé"); say("Tu es arrivé : " + (nav.t.label || "destination")); }
      $("#navDist").textContent = "Arrivé"; $("#navInfo").textContent = nav.t.label + " est à moins de 30 m.";
      drawNavArrow(); return;
    }
    var off = nav.route ? distToRoute(p) : 0;
    var md = navMode();
    if (navigator.onLine && (!nav.lastRoute || (off > md.off && Date.now() - nav.lastRoute > 30000))) fetchRoute();
    var onRoute = nav.route && off <= md.off;
    var rem = onRoute ? remainingOnRoute(p) : straight;
    $("#navDist").textContent = fmtM(rem);
    var eta = onRoute && nav.routeDur && nav.routeDist ? fmtSec(nav.routeDur * rem / nav.routeDist) : fmtMin(onRoute ? rem : straight * 1.3);
    var info = (onRoute ? md.by : "à vol d'oiseau") + " · environ " + eta + " " + md.how;
    if (onRoute && nav.steps) {
      var next = nav.steps.filter(function (st) { return mDist(p, st.at) > 15; }).sort(function (a, b) { return mDist(p, a.at) - mDist(p, b.at); })[0];
      if (next && mDist(p, next.at) < md.step) {
        var dn = mDist(p, next.at); info = "Dans " + fmtM(dn) + " : " + next.txt;
        var near = nav.mode === "voiture" ? [800, 200] : nav.mode === "velo" ? [300, 60] : [150, 30];
        var key = next.at.join(",");
        nav.spoken = nav.spoken || {};
        if (dn <= near[1] && nav.spoken[key] !== 2) { nav.spoken[key] = 2; say(next.txt); }
        else if (dn <= near[0] && !nav.spoken[key]) { nav.spoken[key] = 1; say("Dans " + fmtM(dn).replace(",", " virgule ") + ", " + next.txt.charAt(0).toLowerCase() + next.txt.slice(1)); }
      }
    }
    if (nav.route && !onRoute && !nav.offSaid) { nav.offSaid = true; say(nav.mode === "voiture" ? "Recalcul de l'itinéraire" : "Tu t'es écarté du chemin"); }
    if (onRoute) nav.offSaid = false;
    if (!navigator.onLine && !nav.route) info += " · hors ligne : suis la flèche";
    else if (nav.route && !onRoute) info += nav.mode === "voiture" ? " · recalcul de l'itinéraire" : " · tu t'es écarté du chemin";
    $("#navInfo").textContent = info;
    drawNavArrow();
    if (nav.follow) map.panTo(p, { animate: true });
  }
  function startNav(t) {
    stopNav(true);
    if (!map) return;
    nav = { t: t, follow: true, mode: load("sylva_navmode", "pied") };
    $all("#navModes [data-navmode]").forEach(function (x) { x.classList.toggle("on", x.dataset.navmode === nav.mode); });
    $("#navTo").textContent = t.label || "Destination";
    say("Guidage vers " + (t.label || "ta destination"));
    var ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    $("#navExt").href = ios ? "https://maps.apple.com/?daddr=" + t.lat + "," + t.lon + "&dirflg=w" : "https://www.google.com/maps/dir/?api=1&destination=" + t.lat + "," + t.lon + "&travelmode=walking";
    $("#navGoogle").href = "https://www.google.com/maps/dir/?api=1&destination=" + t.lat + "," + t.lon + "&travelmode=walking";
    nav.marker = L.marker([t.lat, t.lon], { icon: pinIcon("#2F7FA3", "★"), zIndexOffset: 980 }).addTo(map);
    $("#navPanel").hidden = false; document.body.classList.add("navigating");
    showView("carte");
    startCompass();
    try { if (navigator.wakeLock) navigator.wakeLock.request("screen").then(function (w) { if (nav) nav.wake = w; else w.release(); }).catch(function () {}); } catch (e) {}
    setTimeout(function () {
      if (me) map.fitBounds([[me[0], me[1]], [t.lat, t.lon]], { padding: [80, 80], maxZoom: 16 }); else map.setView([t.lat, t.lon], 15);
      setTimeout(function () { if (nav) nav.follow = true; }, 2500);
    }, 150);
    nav.follow = false;
    navUpdate();
  }
  function stopNav(silent) {
    if (!nav) return;
    if (window.speechSynthesis) try { speechSynthesis.cancel(); } catch (e) {}
    ["line", "straightLine", "marker"].forEach(function (k) { if (nav[k]) map.removeLayer(nav[k]); });
    try { if (nav.wake) nav.wake.release(); } catch (e) {}
    nav = null; $("#navPanel").hidden = true; document.body.classList.remove("navigating");
    if (!silent) toast("Guidage arrêté");
  }
  $("#navStop").addEventListener("click", function () { stopNav(); });
  $("#navModes").addEventListener("click", function (e) {
    var b = e.target.closest("[data-navmode]"); if (!b || !nav || b.dataset.navmode === nav.mode) return;
    nav.mode = b.dataset.navmode; save("sylva_navmode", nav.mode);
    $all("#navModes [data-navmode]").forEach(function (x) { x.classList.toggle("on", x === b); });
    if (nav.line) { map.removeLayer(nav.line); nav.line = null; }
    nav.route = null; nav.steps = null; nav.lastRoute = 0; nav.arrived = false;
    if (nav.mode === "voiture") toast("En voiture : ne touche pas au téléphone en roulant, fixe-le sur un support.");
    navUpdate();
  });
  $("#navCenter").addEventListener("click", function () { if (nav && me) { nav.follow = true; map.setView([me[0], me[1]], Math.max(map.getZoom(), 16)); } });
  document.addEventListener("visibilitychange", function () {
    if (nav && document.visibilityState === "visible" && navigator.wakeLock) navigator.wakeLock.request("screen").then(function (w) { if (nav) nav.wake = w; }).catch(function () {});
  });
  // Toucher la carte : épingle provisoire, puis « Placer un spot ici »
  var tapMarker = null;
  function clearTap() { if (tapMarker && map) { map.removeLayer(tapMarker); tapMarker = null; } }
  // ---------- Mesurer une distance : points posés au doigt ----------
  var meas = { on: false, pts: [], line: null, dots: null };
  function measDraw() {
    if (!map) return;
    if (!meas.dots) { meas.dots = L.layerGroup().addTo(map); }
    meas.dots.clearLayers(); if (meas.line) { map.removeLayer(meas.line); meas.line = null; }
    var tot = 0;
    meas.pts.forEach(function (p, i) {
      if (i) tot += map.distance(meas.pts[i - 1], p);
      meas.dots.addLayer(L.circleMarker(p, { radius: i ? 6 : 7, color: "#fff", weight: 2, fillColor: "#E0584A", fillOpacity: 1 }));
      if (i) meas.dots.addLayer(L.marker(p, { interactive: false, icon: L.divIcon({ className: "", iconSize: [0, 0], html: '<span class="meas-lbl">' + fmtKm(tot / 1000) + "</span>" }) }));
    });
    if (meas.pts.length > 1) meas.line = L.polyline(meas.pts, { color: "#E0584A", weight: 4, dashArray: "8 8" }).addTo(map);
    var km = tot / 1000, min = Math.round(km / 4 * 60);
    $("#measTot").textContent = meas.pts.length > 1 ? fmtKm(km) : "—";
    $("#measInfo").textContent = meas.pts.length < 2 ? (meas.pts.length ? "Touche le point suivant" : "Touche la carte pour poser le premier point")
      : (meas.pts.length - 1) + " segment" + (meas.pts.length > 2 ? "s" : "") + " · à pied ≈ " + (min >= 60 ? Math.floor(min / 60) + " h " + String(min % 60).padStart(2, "0") : min + " min") + " (sans dénivelé)";
    $("#measUndo").disabled = !meas.pts.length;
  }
  function measStart() {
    meas.on = true; meas.pts = []; clearTap(); document.body.classList.add("measuring"); $("#measPanel").hidden = false; $("#btnMeasure").classList.add("on"); measDraw();
  }
  function measStop() {
    meas.on = false; meas.pts = []; if (meas.dots) meas.dots.clearLayers(); if (meas.line && map) { map.removeLayer(meas.line); meas.line = null; }
    $("#measPanel").hidden = true; document.body.classList.remove("measuring"); $("#btnMeasure").classList.remove("on");
  }
  $("#btnMeasure").addEventListener("click", function () { if (meas.on) measStop(); else measStart(); });
  $("#measClose").addEventListener("click", measStop);
  $("#measUndo").addEventListener("click", function () { meas.pts.pop(); measDraw(); });
  $("#measClear").addEventListener("click", function () { meas.pts = []; measDraw(); });
  $("#measMe").addEventListener("click", function () {
    if (!me) { toast("Position GPS pas encore trouvée"); return; }
    meas.pts.unshift([me[0], me[1]]); measDraw();
  });

  function onMapTap(e) {
    if (meas.on) { meas.pts.push([e.latlng.lat, e.latlng.lng]); measDraw(); return; }
    var bp = $("#basemapPanel"), sp = $("#spotsPanel");
    if (sp && !sp.hidden) { sp.hidden = true; return; }
    if (bp && !bp.hidden) { bp.hidden = true; return; }
    var ll = e.latlng; clearTap();
    var dist = "";
    if (me) {
      var d = map.distance([me[0], me[1]], ll);
      dist = "<br><span style=\"font-size:12px;opacity:.75\">À " + (d < 1000 ? Math.round(d) + " m" : (d / 1000).toFixed(1).replace(".", ",") + " km") + " de toi</span>";
    }
    tapMarker = L.marker(ll, { icon: pinIcon("#EEE9DD", "+"), zIndexOffset: 950 })
      .bindPopup("<b>Point choisi</b><br><span style=\"font-size:12px;opacity:.75\">" + ll.lat.toFixed(5) + ", " + ll.lng.toFixed(5) + "</span>" + dist +
        '<div class="spot-actions"><button data-go-here class="sa-gps">Y aller</button><button data-spot-here>Placer un spot ici</button></div>');
    tapMarker.on("popupclose", function () { setTimeout(function () { if (tapMarker && !tapMarker.isPopupOpen()) clearTap(); }, 0); });
    tapMarker.addTo(map).openPopup();
  }
  function spotHere() {
    if (!tapMarker) return;
    var ll = tapMarker.getLatLng();
    pendingSpotPos = [ll.lat, ll.lng];
    $("#spotPosInfo").textContent = "Point choisi sur la carte (" + ll.lat.toFixed(5) + ", " + ll.lng.toFixed(5) + ")";
    clearTap(); openSpotForm();
  }
  $("#formSpot").addEventListener("submit", function (e) {
    e.preventDefault();
    var spots = getSpots();
    var blob = pendingSpotBlob, id;
    if (editingSpot) {
      id = editingSpot;
      spots.forEach(function (x) { if (x.id === id) { x.type = $("#spotType").value; x.note = $("#spotNote").value.trim(); if (blob) x.photo = true; } });
      editingSpot = null;
    } else {
      id = String(Date.now());
      spots.push({ id: id, lat: pendingSpotPos[0], lon: pendingSpotPos[1], type: $("#spotType").value, note: $("#spotNote").value.trim(), date: Date.now(), photo: !!blob });
    }
    save("sylva_spots", spots);
    closeModal($("#modalSpot"));
    var done = function () { renderSpots(); toast("Spot enregistré"); };
    if (blob) idbDo("readwrite", function (st) { return st.put(blob, id); }).then(done, function () {
      var all = getSpots(); all.forEach(function (x) { if (x.id === id) x.photo = false; }); save("sylva_spots", all);
      done(); toast("Spot enregistré sans photo (stockage indisponible)");
    });
    else done();
  });
  $("#btnLocate").addEventListener("click", function () {
    clearPlace();
    if (me && map) { map.setView([me[0], me[1]], 15); updateMapCard(); }
    else toast("Recherche de votre position…");
  });
  $("#btnReloadOsm").addEventListener("click", function () {
    if (focusPoint && map) { var c = map.getCenter(); focusPoint = [c.lat, c.lng]; }
    loadOsm(true); loadPoi(true);
  });
  // Services gardés avant l'ajout des parkings : on les recharge une fois
  if (!load("sylva_poi_v2", false)) { save("sylva_poi_v2", true); var oldPoi = load("sylva_poi", null); if (oldPoi) { oldPoi.t = 0; save("sylva_poi", oldPoi); } }

  // ---------- Recherche de lieu (Nominatim / OpenStreetMap) ----------
  var placeMarker = null, placeList = [], lastSearch = 0;
  function clearPlace() {
    focusPoint = null;
    if (placeMarker && map) { map.removeLayer(placeMarker); placeMarker = null; }
  }
  function showPlaceResults(html) { var r = $("#placeResults"); r.innerHTML = html; r.hidden = !html; }

  $("#formPlace").addEventListener("submit", function (e) {
    e.preventDefault();
    var q = $("#placeInput").value.trim();
    if (!q) { showPlaceResults(""); return; }
    if (!navigator.onLine) { showPlaceResults('<div class="place-empty">Pas de réseau : recherche impossible.</div>'); return; }
    if (Date.now() - lastSearch < 1100) return; // max 1 recherche par seconde (règle du service)
    lastSearch = Date.now();
    $("#placeInput").blur();
    showPlaceResults('<div class="place-empty">Recherche…</div>');
    var c = map ? map.getCenter() : { lat: ZONE.centre[0], lng: ZONE.centre[1] };
    var url = "https://nominatim.openstreetmap.org/search?format=jsonv2&limit=6&accept-language=fr" +
      "&countrycodes=be,fr,lu,nl,de,ch&q=" + encodeURIComponent(q) +
      "&viewbox=" + (c.lng - 1) + "," + (c.lat + 1) + "," + (c.lng + 1) + "," + (c.lat - 1);
    fetch(url, { headers: { "Accept": "application/json" } }).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    }).then(function (list) {
      placeList = list || [];
      if (!placeList.length) { showPlaceResults('<div class="place-empty">Aucun lieu trouvé.</div>'); return; }
      showPlaceResults(placeList.map(function (p, i) {
        var parts = String(p.display_name || "").split(",");
        return '<button type="button" class="place-item" data-place="' + i + '"><b>' + esc(p.name || parts[0]) +
          "</b><span>" + esc(parts.slice(1).join(",").trim()) + "</span></button>";
      }).join(""));
    }).catch(function () {
      showPlaceResults('<div class="place-empty">Service de recherche indisponible, réessayez.</div>');
    });
  });

  $("#placeResults").addEventListener("click", function (e) {
    var b = e.target.closest("[data-place]"); if (!b || !map) return;
    var p = placeList[+b.getAttribute("data-place")]; if (!p) return;
    var ll = [parseFloat(p.lat), parseFloat(p.lon)];
    var name = p.name || String(p.display_name || "").split(",")[0];
    clearPlace();
    focusPoint = ll;
    placeMarker = L.marker(ll, { icon: pinIcon("#EEE9DD", "★"), zIndexOffset: 900 })
      .bindPopup("<b>" + esc(name) + "</b><br>" +
        (me ? '<span style="color:#A9B3A6">À ' + fmtKm(distKm([me[0], me[1]], ll)) + " de vous</span><br>" : "") +
        '<br><a href="https://maps.apple.com/?daddr=' + ll[0] + "," + ll[1] + '" target="_blank" rel="noopener">Itinéraire</a>')
      .addTo(map);
    if (p.boundingbox) {
      var bb = p.boundingbox.map(parseFloat); // [sud, nord, ouest, est]
      map.fitBounds([[bb[0], bb[2]], [bb[1], bb[3]]], { maxZoom: 14 });
    } else map.setView(ll, 13);
    showPlaceResults("");
    $("#placeInput").value = name;
    loadOsm(true); // charge les aires de bivouac et points d'eau autour du lieu
  });

  $("#placeInput").addEventListener("input", function () {
    if (!$("#placeInput").value) { showPlaceResults(""); clearPlace(); updateMapCard(); }
  });

  // ---------- SOS ----------
  function sosText() {
    if (!me) return null;
    return "SOS Sylva - ma position : " + me[0].toFixed(5) + ", " + me[1].toFixed(5) +
      " (precision " + Math.round(me[2]) + " m) https://maps.apple.com/?ll=" + me[0].toFixed(5) + "," + me[1].toFixed(5);
  }
  function updateSosCoords() {
    if (!me) return;
    $("#sosCoords").innerHTML = "Latitude : " + me[0].toFixed(5) + "<br>Longitude : " + me[1].toFixed(5) +
      "<br>Précision : ± " + Math.round(me[2]) + " m";
    $("#btnSmsPos").href = "sms:&body=" + encodeURIComponent(sosText());
  }
  $("#btnSos").addEventListener("click", function () { updateSosCoords(); openModal("#modalSos"); });
  $("#btnCopyPos").addEventListener("click", function () {
    var t = sosText(); if (t) copyText(t); else toast("Position pas encore disponible");
  });
  $("#btnSmsPos").addEventListener("click", function (e) { if (!me) { e.preventDefault(); toast("Position pas encore disponible"); } });

  // ---------- Réglages ----------
  $("#btnSettings").addEventListener("click", function () {
    $("#apiKey").value = load("sylva_key", "") || ""; $("#mtKey").value = load("sylva_mtkey", "") || ""; openModal("#modalSettings");
  });
  $("#formSettings").addEventListener("submit", function (e) {
    e.preventDefault(); save("sylva_key", $("#apiKey").value.trim());
    var mk = $("#mtKey").value.replace(/\s+/g, ""), oldMk = load("sylva_mtkey", "");
    save("sylva_mtkey", mk);
    if (mk !== oldMk && map) { initBasemaps(); if (mk) toast("Cartes MapTiler ajoutées au menu des cartes"); }
    closeModal($("#modalSettings")); toast("Réglages enregistrés");
  });
  $("#btnPhotos").addEventListener("click", function () { toast("Téléchargement des photos…"); prefetchPhotos(true); });
  $("#btnSources").addEventListener("click", function () {
    closeModal($("#modalSettings"));
    openSheet("À propos", '<h1 id="sheetTitle">Sources et crédits</h1>' +
      "<p>Tous les textes de Sylva sont rédigés pour l'appli, et les schémas des techniques sont dessinés pour elle. Aucun passage de livre protégé n'est reproduit.</p>" +
      "<h3>Contenu</h3><ul>" +
      "<li>Techniques de survie : manuels de l'armée américaine FM 21-76 / FM 3-05.70 (domaine public).</li>" +
      "<li>Premiers secours : consignes grand public (Croix-Rouge, ULB), recoupées avec le manuel FM 4-25.11.</li>" +
      "<li>Champignons dangereux et intoxications : Centre Antipoisons belge (070 245 245).</li>" +
      "<li>Vipère : Province de Liège. Loup : Service public de Wallonie.</li>" +
      "<li>Eau improvisée : revue scientifique medRxiv (2025).</li></ul>" +
      "<h3>Données et services</h3><ul>" +
      '<li>Carte, aires de bivouac, points d\'eau et recherche : © contributeurs <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> (ODbL).</li>' +
      '<li>Photos : Wikimedia Commons, licences libres, auteur indiqué sous chaque photo.</li>' +
      '<li>Météo : <a href="https://open-meteo.com/" target="_blank" rel="noopener">Open-Meteo.com</a> (CC BY 4.0).</li>' +
      "<li>Identification des plantes : Pl@ntNet (CIRAD, INRAE, INRIA, IRD).</li></ul>" +
      '<p class="disclaimer">Sylva est un outil éducatif. Il ne remplace ni un guide de terrain, ni un mycologue, ni une formation aux premiers secours. En cas d\'urgence : 112.</p>');
  });
  $("#btnExportSpots").addEventListener("click", function () {
    var s = getSpots(); if (!s.length) { toast("Aucun spot enregistré"); return; }
    copyText(JSON.stringify(s, null, 1));
  });

  // ---------- Photos (Wikimedia Commons, licences libres) ----------
  var PHOTOS = load("sylva_photos", {});
  function latinMain(latin) { return String(latin || "").split("/")[0].trim(); }
  function photoOf(latin) { var p = PHOTOS[norm(latinMain(latin))]; return p && p.src ? p : null; }
  function stripHtml(h) { var d = document.createElement("div"); d.innerHTML = h || ""; return (d.textContent || "").replace(/\s+/g, " ").trim(); }

  function wikiThumb(lang, latin) {
    return fetch("https://" + lang + ".wikipedia.org/w/api.php?action=query&format=json&origin=*&redirects=1" +
      "&prop=pageimages&piprop=thumbnail%7Cname&pithumbsize=640&pilicense=free&titles=" + encodeURIComponent(latin))
      .then(function (r) { return r.json(); })
      .then(function (d) {
        var pages = d && d.query && d.query.pages;
        for (var k in pages) {
          var pg = pages[k];
          if (pg.thumbnail && pg.pageimage) {
            return { src: pg.thumbnail.source, file: pg.pageimage, page: "https://" + lang + ".wikipedia.org/wiki/" + encodeURIComponent(pg.title) };
          }
        }
        return null;
      });
  }
  function commonsMeta(file) {
    return fetch("https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&prop=imageinfo&iiprop=extmetadata" +
      "&titles=" + encodeURIComponent("File:" + file))
      .then(function (r) { return r.json(); })
      .then(function (d) {
        var pages = d && d.query && d.query.pages;
        for (var k in pages) {
          var ii = pages[k].imageinfo && pages[k].imageinfo[0];
          var m = ii && ii.extmetadata;
          if (m) return { artist: stripHtml(m.Artist && m.Artist.value).slice(0, 80), license: stripHtml(m.LicenseShortName && m.LicenseShortName.value), commons: true };
        }
        return { artist: "", license: "", commons: false };
      })
      .catch(function () { return { artist: "", license: "", commons: false }; });
  }
  function fetchPhoto(latin, langs) {
    var name = latinMain(latin), key = norm(name);
    langs = langs || ["fr", "en"];
    if (PHOTOS[key]) return Promise.resolve(PHOTOS[key].src ? PHOTOS[key] : null);
    return wikiThumb(langs[0], name).then(function (r) { return r || (langs[1] ? wikiThumb(langs[1], name) : null); }).then(function (r) {
      if (!r) { PHOTOS[key] = { none: true }; save("sylva_photos", PHOTOS); return null; }
      return commonsMeta(r.file).then(function (m) {
        r.artist = m.artist; r.license = m.license; r.commons = m.commons;
        PHOTOS[key] = r; save("sylva_photos", PHOTOS);
        return r;
      });
    });
  }
  function photoCredit(p) {
    var link = p.commons ? "https://commons.wikimedia.org/wiki/File:" + encodeURIComponent(p.file) : p.page;
    return "Photo : " + esc(p.artist || "auteur sur Wikimedia") + (p.license ? " · " + esc(p.license) : "") +
      ' · <a href="' + esc(link) + '" target="_blank" rel="noopener">source</a>';
  }
  function allLatins() {
    var out = [];
    ESPECES.forEach(function (s) {
      out.push([s.latin]);
      (s.sosies || []).forEach(function (x) { if (x.latin) out.push([x.latin]); });
    });
    TECHS.forEach(function (t) { if (t.wiki) out.push([t.wiki, ["en"]]); });
    return out;
  }
  var prefetching = false;
  function prefetchPhotos(verbose) {
    if (prefetching || !navigator.onLine) { if (verbose && !navigator.onLine) toast("Pas de réseau"); return; }
    prefetching = true;
    Object.keys(IMGS).forEach(function (k) { var im = new Image(); im.src = IMGS[k]; });
    var list = allLatins(), i = 0, ok = 0;
    (function next() {
      if (i >= list.length) {
        prefetching = false; renderEspeces(); renderGuide();
        if (verbose) toast(ok + " photos prêtes pour le hors-ligne");
        return;
      }
      var it = list[i++];
      fetchPhoto(it[0], it[1]).then(function (p) {
        if (p) { ok++; var img = new Image(); img.src = p.src; }
      }).catch(function () {}).then(function () { setTimeout(next, 250); });
    })();
  }

  // ---------- Espèces ----------
  var CAT_LABEL = { plante: "Plante comestible", toxique: "Plante toxique", champignon: "Champignon", animal: "Faune", poisson: "Poisson et vie aquatique" };
  var CAT_PLURAL = { plante: "Plantes comestibles", toxique: "Plantes toxiques", champignon: "Champignons", animal: "Faune", poisson: "Poissons et vie aquatique" };
  var CAT_ICO = { plante: ["#23382A", "#8CCB7E"], toxique: ["#4A1C14", "#FFB4A1"], champignon: ["#3A3218", "#F2D184"], animal: ["#2A2235", "#C7B9DE"] };
  var curCat = "saison";
  // ---------- Région (pays + milieux) ----------
  var PAYS = window.SYLVA_PAYS || {}, MILIEUX = window.SYLVA_MILIEUX || {};
  var region = load("sylva_region", { pays: "BE", milieux: ["temperee"] });
  function inRegion(s) {
    var z = s.zones || ["temperee", "montagne"];
    if (s.pays && s.pays.indexOf(region.pays) === -1) return false;
    return z.some(function (m) { return region.milieux.indexOf(m) !== -1; });
  }
  function renderRegionBtn() {
    $("#regionPays").textContent = (PAYS[region.pays] || {}).nom || region.pays;
    $("#regionMilieux").textContent = region.milieux.map(function (m) { return MILIEUX[m]; }).join(" · ");
  }
  var draft = null;
  function renderRegionModal() {
    $("#paysChips").innerHTML = Object.keys(PAYS).map(function (k) {
      return '<button type="button" class="chip' + (draft.pays === k ? " on" : "") + '" data-pays="' + k + '">' + esc(PAYS[k].nom) + "</button>";
    }).join("");
    var dispo = PAYS[draft.pays].milieux;
    $("#milieuxChips").innerHTML = Object.keys(MILIEUX).map(function (m) {
      var ok = dispo.indexOf(m) !== -1;
      return '<button type="button" class="chip' + (draft.milieux.indexOf(m) !== -1 ? " on" : "") + '" data-milieu="' + m + '"' + (ok ? "" : " disabled") + ">" + esc(MILIEUX[m]) + "</button>";
    }).join("");
  }
  $("#btnRegion").addEventListener("click", function () {
    draft = { pays: region.pays, milieux: region.milieux.slice() }; renderRegionModal(); openModal("#modalRegion");
  });
  $("#paysChips").addEventListener("click", function (e) {
    var b = e.target.closest("[data-pays]"); if (!b) return;
    draft.pays = b.getAttribute("data-pays");
    var dispo = PAYS[draft.pays].milieux;
    draft.milieux = draft.milieux.filter(function (m) { return dispo.indexOf(m) !== -1; });
    if (!draft.milieux.length) draft.milieux = [dispo[0]];
    renderRegionModal();
  });
  $("#milieuxChips").addEventListener("click", function (e) {
    var b = e.target.closest("[data-milieu]"); if (!b || b.disabled) return;
    var m = b.getAttribute("data-milieu"), i = draft.milieux.indexOf(m);
    if (i === -1) draft.milieux.push(m); else if (draft.milieux.length > 1) draft.milieux.splice(i, 1);
    renderRegionModal();
  });
  $("#btnRegionOk").addEventListener("click", function () {
    region = draft; save("sylva_region", region); closeModal($("#modalRegion"));
    renderRegionBtn(); renderEspeces(); renderLearnCounts(); toast("Région : " + PAYS[region.pays].nom);
  });
  var MOIS_NOMS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  function lvClass(n) { return "lv-" + (n || "info"); }

  function renderEspeces() {
    var q = norm($("#searchEspeces").value);
    var list = ESPECES.filter(function (s) {
      if (!inRegion(s)) return false;
      if (curCat === "saison") { if (!s.mois || s.mois.indexOf(new Date().getMonth() + 1) === -1) return false; }
      else if (curCat !== "tout" && s.cat !== curCat) return false;
      if (!q) return true;
      return norm(s.nom + " " + s.latin + " " + s.resume).indexOf(q) !== -1;
    });
    var html = "";
    var lastCat = null;
    list.forEach(function (s) {
      if ((curCat === "tout" || curCat === "saison") && s.cat !== lastCat) { html += '<div class="section-title">' + esc(CAT_PLURAL[s.cat]) + "</div>"; lastCat = s.cat; }
      var ph = photoOf(s.latin);
      html += '<button class="item" data-esp="' + esc(s.id) + '">' +
        (ph ? '<span class="item-ico item-photo"><img src="' + esc(ph.src) + '" alt="" loading="lazy"></span>'
            : '<span class="item-ico ico-' + esc(s.cat) + '">' + esc(s.nom.charAt(0)) + "</span>") +
        '<span class="item-main"><span class="item-name">' + esc(s.nom) + '</span><span class="item-sub">' + esc(s.saison) + "</span></span>" +
        '<span class="badge ' + lvClass(s.niveau) + '">' + esc(s.statut) + "</span></button>";
    });
    $("#listEspeces").innerHTML = html || '<p class="muted">Aucune espèce trouvée.</p>';
    $("#especesSub").textContent = curCat === "saison"
      ? list.length + " espèces présentes en " + MOIS_NOMS[new Date().getMonth()] + " dans ta région"
      : list.length + " espèces dans ta région · " + ESPECES.length + " au total";
  }
  $("#searchEspeces").addEventListener("input", renderEspeces);
  $all("#catChips .chip").forEach(function (c) {
    c.addEventListener("click", function () {
      curCat = c.dataset.cat;
      $all("#catChips .chip").forEach(function (x) { x.classList.toggle("on", x === c); });
      renderEspeces();
    });
  });
  $("#listEspeces").addEventListener("click", function (e) {
    var b = e.target.closest("[data-esp]"); if (b) openEspece(b.getAttribute("data-esp"));
  });

  function heroHtml(p, alt) {
    return '<figure class="photo"><img src="' + esc(p.src) + '" alt="' + esc(alt) + '"><figcaption>' + photoCredit(p) + "</figcaption></figure>";
  }
  function sosieThumb(x) {
    var p = x.latin && photoOf(x.latin);
    return p ? '<img class="sosie-img" src="' + esc(p.src) + '" alt="' + esc(x.nom) + '">' : "";
  }

  var VERDICT_ICO = { ok: "✓", caution: "!", danger: "✕", info: "i" };
  var VERDICT_SUB = {
    ok: "Vérifie toujours plusieurs critères avant de cueillir.",
    caution: "Comestible sous conditions : lis les consignes.",
    danger: "Ne pas consommer, ne pas porter à la bouche.",
    info: "Infos et conduite à tenir."
  };
  var VERDICT_POISSON = {
    ok: "Avec un permis, en respectant tailles et périodes. Toujours bien cuit.",
    caution: "Comestible avec précautions : lis les consignes avant de le garder.",
    danger: "À relâcher ou à ne pas toucher : protégé, pollué ou venimeux.",
    info: "Petit poisson à connaître, sans intérêt pour la table."
  };
  function verdictHtml(s) {
    var n = s.niveau || "info";
    var sub = s.cat === "poisson" ? VERDICT_POISSON[n] : VERDICT_SUB[n];
    return '<div class="verdict v-' + esc(n) + '"><span class="v-ico" aria-hidden="true">' + VERDICT_ICO[n] + "</span><span><b>" + esc(s.statut) + "</b><span>" + esc(sub) + "</span></span></div>";
  }
  function ficheHeroHtml(p, s) {
    return p ? '<img src="' + esc(p.src) + '" alt="' + esc(s.nom) + '"><figcaption>' + photoCredit(p) + "</figcaption>"
             : '<span class="ph-letter" aria-hidden="true">' + esc(s.nom.charAt(0)) + "</span>";
  }
  function cmpHtml(nom, latin, niveau, txt, tag, self) {
    var p = latin && photoOf(latin);
    return '<div class="cmp ' + (self ? "self" : esc(niveau || "caution")) + '"><span class="cmp-img">' +
      (p ? '<img src="' + esc(p.src) + '" alt="' + esc(nom) + '" loading="lazy">' : esc(nom.charAt(0))) + "</span>" +
      '<span class="tag">' + esc(tag) + "</span><b>" + esc(nom) + "</b>" + esc(txt) + "</div>";
  }
  var SOSIE_TAG = { danger: "Dangereux", caution: "Prudence", ok: "Sans danger" };

  function openEspece(id) {
    var s = ESPECES.filter(function (x) { return x.id === id; })[0]; if (!s) return;
    var ph = photoOf(s.latin);
    var h = '<figure class="fiche-hero" id="heroSlot">' + ficheHeroHtml(ph, s) + "</figure>" +
      '<div class="fiche-card"><h1 id="sheetTitle">' + esc(s.nom) + '</h1><div class="latin">' + esc(s.latin) + " · " + esc(CAT_LABEL[s.cat]) + "</div>" +
      verdictHtml(s) +
      '<div class="facts"><span class="fact"><span>Saison</span><b>' + esc(s.saison) + '</b></span><span class="fact"><span>Catégorie</span><b>' + esc(CAT_LABEL[s.cat]) + "</b></span></div>" +
      "<p>" + esc(s.resume) + "</p>" +
      (s.notes && s.notes[region.pays] ? '<div class="alert alert-warn note-pays"><strong>En ' + esc(PAYS[region.pays].nom) + "</strong><span>" + esc(s.notes[region.pays]) + "</span></div>" : "");
    if (s.identification && s.identification.length) {
      h += "<h3>Reconnaître</h3><ul>" + s.identification.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>";
    }
    if (s.sosies && s.sosies.length) {
      var credits = [];
      h += "<h3>" + (s.niveau === "danger" ? "Ne pas la confondre avec" : "Elle ou son sosie ?") + '</h3><div class="compare">' +
        (s.niveau !== "danger" ? cmpHtml(s.nom, s.latin, s.niveau, (s.identification && s.identification[0]) || s.resume, "La bonne", true) : "") +
        s.sosies.map(function (x) {
          var p = x.latin && photoOf(x.latin);
          if (p) credits.push(esc(x.nom.split(" (")[0]) + " — " + photoCredit(p));
          return cmpHtml(x.nom, x.latin, x.niveau, x.diff, SOSIE_TAG[x.niveau] || "Sosie", false);
        }).join("") + "</div>";
      if (credits.length) h += '<p class="tiny muted credits">' + credits.join("<br>") + "</p>";
    }
    if (s.usages && s.usages.length) {
      h += "<h3>" + (s.cat === "animal" ? "Conseils" : s.cat === "poisson" ? "Pêche et cuisine" : s.niveau === "danger" ? "Consignes" : "Usages") + "</h3><ul>" +
        s.usages.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>";
    }
    h += '<p class="disclaimer">Contenu éducatif. Ne consommez jamais une plante ou un champignon sans certitude absolue de son identité. La photo montre l\'espèce en général : comparez toujours plusieurs critères.</p></div>';
    openSheet(CAT_LABEL[s.cat], h, { hero: true });
    if (!ph && navigator.onLine) {
      fetchPhoto(s.latin).then(function (p) {
        var slot = document.getElementById("heroSlot");
        if (p && slot && !$("#sheet").hidden) slot.innerHTML = ficheHeroHtml(p, s);
      }).catch(function () {});
    }
  }

  // ---------- Techniques ----------
  var ILLUS = window.SYLVA_ILLUS || {};
  // Gravures remplacées : le numéro change l'adresse, sinon l'iPhone garde l'ancienne en cache
  var IMG_REV = window.SYLVA_IMG_REV = { pluie: 2, filtre: 2 };
  var IMGS = {}; (window.SYLVA_IMAGES || []).forEach(function (k) { IMGS[k] = "img/" + k + ".webp" + (IMG_REV[k] ? "?r=" + IMG_REV[k] : ""); });
  function thumbKey(key) { if (IMGS[key]) return key; for (var q = 12; q >= 1; q--) if (IMGS[key + "_" + q]) return key + "_" + q; return key; }
  function thumbOf(key, illus) {
    if (!IMGS[key]) { var last = 0; for (var q = 1; q <= 12; q++) if (IMGS[key + "_" + q]) last = q; if (last) key = key + "_" + last; }
    return IMGS[key] ? '<img src="' + IMGS[key] + '" alt="" loading="lazy">' : (ILLUS[illus] || "");
  }
  function heroIllus(key, illus, alt) {
    if (IMGS[key]) return '<figure class="engr"><img src="' + IMGS[key] + '" alt="' + esc(alt) + '"></figure>';
    return ILLUS[illus] ? '<div class="illus">' + ILLUS[illus] + "</div>" : "";
  }
  var CATS = window.SYLVA_CATEGORIES || [];
  var ficheCat = "";
  function renderTechniques() {
    var h = "";
    TECHS.forEach(function (t) {
      if (t.priorite && (!ficheCat || ficheCat === "Priorités" || t.cat === ficheCat)) {
        h += '<button class="tech-card' + (t.id === "froid" ? " cold" : "") + '" data-tech="' + esc(t.id) + '">' +
          '<span class="k">Priorité</span><span class="t">' + esc(t.titre) + "</span><p>" + esc(t.intro) + "</p></button>";
      }
    });
    CATS.forEach(function (cat) {
      if (ficheCat && cat !== ficheCat) return;
      var items = TECHS.filter(function (t) { return t.cat === cat && !t.priorite; });
      if (!items.length) return;
      h += '<div class="section-title">' + esc(cat) + '</div><div class="list">';
      items.forEach(function (t) {
        h += '<button class="item" data-tech="' + esc(t.id) + '">' +
          (t.wiki && photoOf(t.wiki) && !/_\d+$/.test(thumbKey(t.id))
            ? '<span class="item-illus item-photo" aria-hidden="true"><img src="' + esc(photoOf(t.wiki).src) + '" alt="" loading="lazy"></span>'
            : '<span class="item-illus" aria-hidden="true">' + thumbOf(t.id, t.illus) + "</span>") +
          '<span class="item-main"><span class="item-name">' + esc(t.titre) + '</span><span class="item-sub">' + esc(t.intro) + "</span></span></button>";
      });
      h += "</div>";
    });
    $("#listTechniques").innerHTML = h;
  }
  // Carte « objet de jeu » des recettes du feu
  function recetteHtml(r) {
    var h = '<div class="recipe-card"><div class="rc-head"><span class="rc-k">Inspiré de</span><b>' + esc(r.jeu) + "</b></div>";
    var chips = [];
    if (r.niveau) chips.push('<span class="rc-chip rc-lvl rc-lvl' + r.niv + '">' + esc(r.niveau) + "</span>");
    if (r.cuisson) chips.push('<span class="rc-chip rc-fire">' + esc(r.cuisson) + "</span>");
    if (r.effet) chips.push('<span class="rc-chip rc-buff">' + esc(r.effet) + "</span>");
    (r.tags || []).forEach(function (x) { chips.push('<span class="rc-chip">' + esc(x) + "</span>"); });
    if (chips.length) h += '<div class="rc-chips">' + chips.join("") + "</div>";
    if (r.interet) h += '<p class="rc-int"><span class="rc-k">Intérêt</span> ' + esc(r.interet) + "</p>";
    if (r.ingredients && r.ingredients.length) h += '<div class="rc-k" style="margin-top:10px">Butin</div><ul class="rc-loot">' + r.ingredients.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>";
    return h + "</div>";
  }
  function stepsHtml(etapes, mode, hidden, tid) {
    var n = etapes.length;
    return '<div class="steps" data-cur="0" data-n="' + n + '"' + (mode ? ' data-mode="' + mode + '"' : "") + (hidden ? " hidden" : "") + ">" +
      '<div class="step-bar" aria-hidden="true">' + etapes.map(function (x, i) { return "<span" + (i === 0 ? ' class="on"' : "") + "></span>"; }).join("") + "</div>" +
      etapes.map(function (x, i) {
        var key = tid ? tid + (mode === "isole" ? "_seul_" : "_") + (i + 1) : "";
        var si = key && IMGS[key] ? '<img class="step-img" src="' + IMGS[key] + '" alt="Étape ' + (i + 1) + '"' + (i ? ' loading="lazy"' : "") + ">" : "";
        return '<div class="step' + (i === 0 ? " on" : "") + (si ? " has-img" : "") + '">' + si + '<span class="step-k"><span class="step-n">' + (i + 1) + "</span>Étape " + (i + 1) + " sur " + n + "</span><p>" + esc(x) + "</p></div>";
      }).join("") +
      '<div class="step-nav"><button type="button" class="btn" data-step="-1" disabled>Précédent</button><button type="button" class="btn btn-next" data-step="1">' + (n > 1 ? "Étape suivante" : "Terminé ✓") + "</button></div>" +
      '<button type="button" class="link-btn steps-toggle" data-step-all>Voir toutes les étapes</button></div>';
  }
  function openTechnique(id) {
    var t = TECHS.filter(function (x) { return x.id === id; })[0]; if (!t) return;
    markRead(id);
    var tp = t.wiki && photoOf(t.wiki);
    var both = t.isole && t.etapes && t.etapes.length;
    var stepPics = false;
    for (var si_ = 1; si_ <= 12; si_++) if (IMGS[t.id + "_" + si_] || IMGS[t.id + "_seul_" + si_]) { stepPics = true; break; }
    var main = t.isole || t.etapes, n = main.length;
    var h = (stepPics ? "" : t.wiki ? '<div id="heroSlot" class="knot">' + (tp ? heroHtml(tp, t.titre) : "") + "</div>"
                    : heroIllus(t.id, t.illus, t.titre)) +
      '<div class="chap-k">' + esc(t.cat) + (t.isole ? " · secours injoignables" : " · " + n + " étapes") + '</div><h1 id="sheetTitle">' + esc(t.titre) + "</h1><p>" + esc(t.intro) + "</p>";
    if (t.recette) h += recetteHtml(t.recette);
    h += planBtnHtml(t.id);
    if (t.alerte && t.alerte.length) {
      h += '<div class="alert alert-danger red-flags"><strong>Fais tout pour sortir ou te faire repérer si :</strong><ul>' +
        t.alerte.map(function (a) { return "<li>" + esc(a) + "</li>"; }).join("") + "</ul></div>";
    }
    if (both) {
      h += '<div class="seg seg-2 mode-seg" role="group" aria-label="Situation"><button type="button" class="chip on" data-ps-mode="isole">Seul, sans secours</button><button type="button" class="chip" data-ps-mode="secours">Secours joignables</button></div>';
      h += stepsHtml(t.isole, "isole", false, t.id) + stepsHtml(t.etapes, "secours", true, t.id);
    } else h += stepsHtml(main, t.isole ? "isole" : "", false, t.id);
    (t.attentionIsole || []).forEach(function (a) { h += '<div class="alert alert-warn"><span>' + esc(a) + "</span></div>"; });
    (t.attention || []).forEach(function (a) { h += '<div class="alert alert-warn"><span>' + esc(a) + "</span></div>"; });
    if (t.source) h += '<p class="disclaimer">Source : ' + esc(t.source) + (t.cat === "Premiers secours" ? ". Contenu éducatif : il ne remplace pas une formation aux premiers secours." : ".") + "</p>";
    openSheet(t.cat, h);
    if (t.wiki && !tp && !stepPics && navigator.onLine) {
      fetchPhoto(t.wiki, ["en"]).then(function (p) {
        var slot = document.getElementById("heroSlot");
        if (p && slot && !$("#sheet").hidden) slot.innerHTML = heroHtml(p, t.titre);
      }).catch(function () {});
    }
  }
  function stepGo(box, delta) {
    var n = +box.getAttribute("data-n"), cur = +box.getAttribute("data-cur") + delta;
    if (cur >= n) { toast("Bien joué ✓"); box.classList.add("all"); box.querySelector("[data-step-all]").textContent = "Revenir au pas à pas"; return; }
    cur = Math.max(0, cur); box.setAttribute("data-cur", cur);
    Array.prototype.forEach.call(box.querySelectorAll(".step"), function (el, i) { el.classList.toggle("on", i === cur); });
    Array.prototype.forEach.call(box.querySelectorAll(".step-bar span"), function (el, i) { el.classList.toggle("on", i <= cur); });
    box.querySelector('[data-step="-1"]').disabled = cur === 0;
    box.querySelector('[data-step="1"]').textContent = cur === n - 1 ? "Terminé ✓" : "Étape suivante";
    var sb = $("#sheetBody"), top = box.offsetTop - 90; if (sb.scrollTop > top) sb.scrollTo({ top: top, behavior: "smooth" });
  }
  $("#listTechniques").addEventListener("click", function (e) {
    var b = e.target.closest("[data-tech]"); if (b) openTechnique(b.getAttribute("data-tech"));
  });

  // ---------- Guide de survie (chapitres) ----------
  var GUIDE = window.SYLVA_GUIDE || [];
  var guideMode = "chapitres";
  function chapText(c) {
    return c.titre + " " + c.resume + " " + c.sections.map(function (x) {
      return [x.titre].concat(x.p || [], x.liste || [], x.etapes || [], x.encadre ? [x.encadre.texte] : []).join(" ");
    }).join(" ");
  }
  function minutes(c) { return Math.max(2, Math.round(chapText(c).split(/\s+/).length / 200)); }
  function renderGuide() {
    var lus = load("sylva_lus", {}), q = norm($("#searchGuide").value.trim());
    var nbLus = GUIDE.filter(function (c) { return lus[c.id]; }).length;
    $("#guideSub").textContent = GUIDE.length + " chapitres · " + TECHS.length + " fiches pratiques · " + nbLus + " chapitre" + (nbLus > 1 ? "s" : "") + " lu" + (nbLus > 1 ? "s" : "");
    $("#guideBar").style.width = Math.round(nbLus / Math.max(1, GUIDE.length) * 100) + "%";
    $all("#guideMode .chip").forEach(function (c) { c.classList.toggle("on", c.dataset.mode === guideMode); });
    var chaps = GUIDE.filter(function (c) { return !q || norm(chapText(c)).indexOf(q) !== -1; });
    var showChaps = q || guideMode === "chapitres", showFiches = q || guideMode === "fiches";
    var h = "";
    if (showChaps) {
      if (q) h += '<div class="section-title">Chapitres (' + chaps.length + ")</div>";
      h += chaps.map(function (c) {
        return '<button class="chap" data-chap="' + esc(c.id) + '">' +
          '<span class="chap-illus" aria-hidden="true">' + thumbOf("chap_" + c.id, c.illus) + "</span>" +
          '<span class="chap-main"><span class="chap-k">Chapitre ' + (GUIDE.indexOf(c) + 1) + " · " + minutes(c) + " min" + (lus[c.id] ? ' · <b class="chap-lu">Lu ✓</b>' : "") + "</span>" +
          '<span class="chap-t">' + esc(c.titre) + '</span><span class="chap-r">' + esc(c.resume) + "</span></span></button>";
      }).join("") || '<p class="muted">Aucun chapitre ne correspond.</p>';
    }
    $("#listGuide").innerHTML = h;
    $("#listGuide").hidden = !showChaps;
    $("#listTechniques").hidden = !showFiches;
    if (showFiches) {
      if (q) {
        var fl = TECHS.filter(function (t) { return norm(t.titre + " " + t.intro + " " + (t.etapes || []).concat(t.isole || []).join(" ")).indexOf(q) !== -1; });
        $("#listTechniques").innerHTML = '<div class="section-title">Fiches pratiques (' + fl.length + ')</div><div class="list">' + fl.map(function (t) {
          return '<button class="item" data-tech="' + esc(t.id) + '"><span class="item-illus" aria-hidden="true">' + thumbOf(t.id, t.illus) + "</span>" +
            '<span class="item-main"><span class="item-name">' + esc(t.titre) + '</span><span class="item-sub">' + esc(t.cat) + "</span></span></button>";
        }).join("") + "</div>";
      } else renderTechniques();
    }
  }
  $("#searchGuide").addEventListener("input", renderGuide);
  $("#guideMode").addEventListener("click", function (e) {
    var b = e.target.closest("[data-mode]"); if (!b) return;
    guideMode = b.dataset.mode; ficheCat = ""; $("#guideTitle").textContent = "Guide de survie"; renderGuide();
  });
  $("#listGuide").addEventListener("click", function (e) {
    var b = e.target.closest("[data-chap]"); if (b) openChapitre(b.getAttribute("data-chap"));
  });

  function sectionHtml(x, i) {
    var h = '<section class="g-sec" id="gsec' + i + '"><h2>' + esc(x.titre) + "</h2>";
    (x.p || []).forEach(function (t) { h += "<p>" + esc(t) + "</p>"; });
    if (x.liste) h += "<ul>" + x.liste.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>";
    if (x.etapes) h += '<ol class="g-steps">' + x.etapes.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ol>";
    if (x.encadre) h += '<div class="encadre enc-' + esc(x.encadre.type) + '"><strong>' + esc(x.encadre.titre) + "</strong><span>" + esc(x.encadre.texte) + "</span></div>";
    return h + "</section>";
  }
  function openChapitre(id) {
    var idx = -1;
    GUIDE.forEach(function (c, i) { if (c.id === id) idx = i; });
    var c = GUIDE[idx]; if (!c) return;
    var h = heroIllus("chap_" + c.id, c.illus, c.titre) +
      '<div class="chap-k">Chapitre ' + (idx + 1) + " · " + minutes(c) + ' min de lecture</div><h1 id="sheetTitle">' + esc(c.titre) + "</h1>" +
      '<p class="g-lead">' + esc(c.resume) + "</p>" +
      '<nav class="g-toc" aria-label="Sommaire">' + c.sections.map(function (x, i) {
        return '<button class="chip" data-anchor="gsec' + i + '">' + esc(x.titre) + "</button>";
      }).join("") + "</nav>" +
      c.sections.map(sectionHtml).join("");
    if (c.fiches && c.fiches.length) {
      h += '<h2 class="g-more">Fiches pratiques</h2><div class="list">' + c.fiches.map(function (fid) {
        var t = TECHS.filter(function (x) { return x.id === fid; })[0]; if (!t) return "";
        return '<button class="item" data-tech="' + esc(t.id) + '"><span class="item-illus" aria-hidden="true">' + thumbOf(t.id, t.illus) + "</span>" +
          '<span class="item-main"><span class="item-name">' + esc(t.titre) + '</span><span class="item-sub">' + esc(t.cat) + "</span></span></button>";
      }).join("") + "</div>";
    }
    if (c.especes && c.especes.length) {
      h += '<h2 class="g-more">Espèces liées</h2><div class="chips">' + c.especes.map(function (eid) {
        var e = ESPECES.filter(function (x) { return x.id === eid; })[0]; if (!e) return "";
        return '<button class="chip" data-esp="' + esc(e.id) + '">' + esc(e.nom) + "</button>";
      }).join("") + "</div>";
    }
    var next = GUIDE[idx + 1];
    h += '<div class="g-nav">' + (next ? '<button class="btn btn-primary btn-big" data-chap="' + esc(next.id) + '">Chapitre suivant : ' + esc(next.titre) + " →</button>" : "") + "</div>" +
      '<p class="disclaimer">Guide rédigé pour Sylva à partir des manuels de survie de l\'armée américaine (domaine public), des consignes de premiers secours grand public et des réglementations nationales. Il ne remplace pas une formation.</p>';
    openSheet("Guide de survie", h);
    lectureChap = c.id;
  }
  $("#sheetBody").addEventListener("click", function (e) {
    var pb = e.target.closest("[data-plan]");
    if (pb) { togglePlan(pb.getAttribute("data-plan")); pb.outerHTML = planBtnHtml(pb.getAttribute("data-plan")); return; }
    var pm = e.target.closest("[data-ps-mode]");
    if (pm) {
      var m = pm.getAttribute("data-ps-mode");
      $all("#sheetBody [data-ps-mode]").forEach(function (x) { x.classList.toggle("on", x === pm); });
      $all("#sheetBody .steps[data-mode]").forEach(function (x) { x.hidden = x.getAttribute("data-mode") !== m; });
      return;
    }
    var st = e.target.closest("[data-step],[data-step-all]");
    if (st) {
      var box = st.closest(".steps");
      if (st.hasAttribute("data-step-all")) {
        var all = box.classList.toggle("all");
        st.textContent = all ? "Revenir au pas à pas" : "Voir toutes les étapes";
      } else stepGo(box, +st.getAttribute("data-step"));
      return;
    }
    var b = e.target.closest("[data-anchor],[data-tech],[data-esp],[data-chap]"); if (!b) return;
    if (b.hasAttribute("data-anchor")) {
      var el = document.getElementById(b.getAttribute("data-anchor"));
      if (el) $("#sheetBody").scrollTo({ top: el.offsetTop - 8, behavior: "smooth" });
    } else if (b.hasAttribute("data-tech")) openTechnique(b.getAttribute("data-tech"));
    else if (b.hasAttribute("data-esp") && !b.closest(".result")) openEspece(b.getAttribute("data-esp"));
    else if (b.hasAttribute("data-chap")) openChapitre(b.getAttribute("data-chap"));
  });
  $("#sheetBody").addEventListener("scroll", function () {
    if (!lectureChap) return;
    var sb = $("#sheetBody");
    if (sb.scrollTop + sb.clientHeight >= sb.scrollHeight - 120) {
      var lus = load("sylva_lus", {});
      if (!lus[lectureChap]) { lus[lectureChap] = true; save("sylva_lus", lus); toast("Chapitre lu ✓"); renderGuide(); renderLearnGuide(); }
    }
  });

  // ---------- Scanner ----------
  var organ = "auto";
  $all("#organChips .chip").forEach(function (c) {
    c.addEventListener("click", function () {
      organ = c.dataset.organ;
      $all("#organChips .chip").forEach(function (x) { x.classList.toggle("on", x === c); });
    });
  });

  var LATIN_INDEX = {};
  ESPECES.forEach(function (s) {
    var parts = s.latin.split("/").map(function (p) { return p.trim(); });
    var genus = parts[0].split(" ")[0];
    parts.forEach(function (p, i) { LATIN_INDEX[norm(i === 0 ? p : genus + " " + p)] = s; });
  });

  function setScanStatus(html) { var st = $("#scanStatus"); st.innerHTML = html; st.hidden = !html; }

  function resizeImage(file, maxSize) {
    return new Promise(function (resolve, reject) {
      var img = new Image(), url = URL.createObjectURL(file);
      img.onload = function () {
        var max = maxSize || 1280, w = img.naturalWidth, h = img.naturalHeight, r = Math.min(1, max / Math.max(w, h));
        var cv = document.createElement("canvas"); cv.width = Math.round(w * r); cv.height = Math.round(h * r);
        cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
        URL.revokeObjectURL(url);
        cv.toBlob(function (b) { b ? resolve(b) : reject(new Error("conversion")); }, "image/jpeg", 0.9);
      };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error("lecture")); };
      img.src = url;
    });
  }

  $("#photoInput").addEventListener("change", onPhoto);
  $("#galleryInput").addEventListener("change", onPhoto);
  function onPhoto(e) {
    var file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    $("#scanResults").innerHTML = "";
    var prevUrl = URL.createObjectURL(file);
    $("#scanImg").src = prevUrl; $("#scanPreview").hidden = false;
    var key = load("sylva_key", "");
    if (!key) {
      setScanStatus('Ajoutez d\'abord votre clé Pl@ntNet dans les <a href="#" id="lnkSettings">réglages</a>.');
      var l = $("#lnkSettings"); if (l) l.addEventListener("click", function (ev) { ev.preventDefault(); $("#btnSettings").click(); });
      return;
    }
    if (!navigator.onLine) { setScanStatus("Pas de réseau : l'identification n'est pas possible ici. Consultez les fiches de l'onglet Espèces."); return; }
    setScanStatus("Identification en cours…");
    resizeImage(file).then(function (blob) {
      var fd = new FormData();
      fd.append("images", blob, "photo.jpg");
      fd.append("organs", organ);
      return fetch("https://my-api.plantnet.org/v2/identify/all?api-key=" + encodeURIComponent(key) +
        "&lang=fr&nb-results=5&include-related-images=false", { method: "POST", body: fd });
    }).then(function (r) {
      if (r.ok) return r.json();
      return r.text().catch(function () { return ""; }).then(function (body) {
        var detail = "";
        try { var j = JSON.parse(body); detail = j.message || j.error || body; } catch (e) { detail = body; }
        detail = String(detail || "").slice(0, 200);
        var base;
        if (r.status === 404) base = "Aucune plante reconnue. Rapprochez-vous d'une feuille, d'une fleur ou d'un fruit, bien net et bien éclairé.";
        else if (r.status === 401 || r.status === 403) base = "Clé API refusée. Vérifiez-la dans les réglages, et que le domaine timhurr.github.io est autorisé dans votre compte Pl@ntNet.";
        else if (r.status === 429) base = "Quota du jour atteint (500 identifications).";
        else base = "Le service d'identification a répondu une erreur. Réessayez.";
        throw { msg: base + " [Code " + r.status + (detail ? " : " + detail : "") + "] [Clé : " + key.slice(0, 4) + "…" + key.slice(-3) + ", " + key.length + " caractères]" };
      });
    }).then(function (data) {
      setScanStatus("");
      renderScanResults(data.results || []);
    }).catch(function (err) {
      setScanStatus(esc(err && err.msg ? err.msg : "Connexion au service impossible. Vérifiez le réseau, et que l'adresse du site est autorisée dans votre compte Pl@ntNet."));
    });
  }

  function renderScanResults(results) {
    if (!results.length) { $("#scanResults").innerHTML = '<p class="muted">Aucun résultat.</p>'; return; }
    var dangerHit = null, umbel = false, html = "";
    results.forEach(function (r, i) {
      var sp = r.species || {};
      var latin = sp.scientificNameWithoutAuthor || "";
      var fam = sp.family && sp.family.scientificNameWithoutAuthor;
      if (fam === "Apiaceae") umbel = true;
      var local = LATIN_INDEX[norm(latin)];
      if (local && local.niveau === "danger" && !dangerHit) dangerHit = local;
      if (i === 0) return;
      var common = (sp.commonNames && sp.commonNames[0]) || latin;
      var pct = Math.round((r.score || 0) * 100);
      html += '<div class="result"><span class="score' + (local && local.niveau === "danger" ? " dz" : "") + '">' + pct + " %</span>" +
        '<span class="names"><span>' + esc(common) + "</span><i>" + esc(latin) + "</i>" +
        (local ? '<button class="link" data-esp="' + esc(local.id) + '">Voir la fiche et les sosies</button>' : "") + "</span>" +
        (local ? '<span class="badge ' + lvClass(local.niveau) + '">' + esc(local.statut) + "</span>" : "") + "</div>";
    });
    var head = "";
    if (dangerHit) head += '<div class="alert alert-danger"><strong>Espèce toxique possible : ' + esc(dangerHit.nom) + "</strong><span>Ne touchez pas à la bouche, ne consommez rien.</span></div>";
    if (umbel) head += '<div class="alert alert-danger"><strong>Ombellifère détectée</strong><span>Cette famille compte des plantes mortelles (ciguës, œnanthe). Ne jamais consommer sans expert.</span></div>';
    if (results[0].score < 0.5) head += '<div class="alert alert-warn"><strong>Identification incertaine</strong><span>Score faible : reprenez une photo plus nette, d\'un autre organe.</span></div>';
    var r0 = results[0], sp0 = r0.species || {}, lat0 = sp0.scientificNameWithoutAuthor || "", loc0 = LATIN_INDEX[norm(lat0)];
    var p0 = loc0 && photoOf(loc0.latin);
    var top = '<div class="res-top"><div class="rt-head"><span class="rt-img">' + (p0 ? '<img src="' + esc(p0.src) + '" alt="">' : $("#scanImg").src ? '<img src="' + esc($("#scanImg").src) + '" alt="">' : "") + "</span>" +
      '<span><span class="rt-k">CORRESPONDANCE ' + Math.round((r0.score || 0) * 100) + ' %</span><span class="rt-n">' + esc(loc0 ? loc0.nom : ((sp0.commonNames && sp0.commonNames[0]) || lat0)) + "</span><i>" + esc(lat0) + "</i></span></div>" +
      (loc0 ? verdictHtml(loc0) + '<button class="btn btn-primary" data-esp="' + esc(loc0.id) + '">Voir la fiche complète</button>'
            : '<div class="verdict"><span class="v-ico" aria-hidden="true">?</span><span><b>Pas de fiche Sylva</b><span>Espèce inconnue de l\'appli : ne la consomme pas.</span></span></div>') + "</div>";
    $("#scanResults").innerHTML = head + top + (html ? '<div class="section-title">Autres possibilités</div><div class="list">' + html + "</div>" : "");
  }
  $("#scanResults").addEventListener("click", function (e) {
    var b = e.target.closest("[data-esp]"); if (b) openEspece(b.getAttribute("data-esp"));
  });

  // ---------- Photos des spots (IndexedDB, restent sur le téléphone) ----------
  var idbP = null, spotUrls = {};
  function idb() {
    if (idbP) return idbP;
    idbP = new Promise(function (res, rej) {
      if (!window.indexedDB) { rej(new Error("indisponible")); return; }
      var r = indexedDB.open("sylva", 1);
      r.onupgradeneeded = function () { r.result.createObjectStore("photos"); };
      r.onsuccess = function () { res(r.result); };
      r.onerror = function () { rej(r.error); };
    });
    return idbP;
  }
  function idbDo(mode, fn) {
    return idb().then(function (d) {
      return new Promise(function (res, rej) {
        var tx = d.transaction("photos", mode), req = fn(tx.objectStore("photos"));
        tx.oncomplete = function () { res(req && req.result); };
        tx.onerror = function () { rej(tx.error); };
      });
    });
  }
  function spotPhotoUrl(id) {
    if (spotUrls[id]) return Promise.resolve(spotUrls[id]);
    return idbDo("readonly", function (st) { return st.get(id); }).then(function (blob) {
      if (!blob) return null;
      spotUrls[id] = URL.createObjectURL(blob); return spotUrls[id];
    }).catch(function () { return null; });
  }

  // ---------- Météo (Open-Meteo) ----------
  var WMO = {
    0: "Ciel clair", 1: "Peu nuageux", 2: "Éclaircies", 3: "Couvert", 45: "Brouillard", 48: "Brouillard givrant",
    51: "Bruine", 53: "Bruine", 55: "Bruine forte", 56: "Bruine verglaçante", 57: "Bruine verglaçante",
    61: "Pluie faible", 63: "Pluie", 65: "Forte pluie", 66: "Pluie verglaçante", 67: "Pluie verglaçante",
    71: "Neige faible", 73: "Neige", 75: "Forte neige", 77: "Grains de neige", 80: "Averses", 81: "Averses", 82: "Fortes averses",
    85: "Averses de neige", 86: "Averses de neige", 95: "Orage", 96: "Orage et grêle", 99: "Orage et grêle"
  };
  function hm(iso) { return String(iso || "").slice(11, 16).replace(":", " h "); }
  function placeLabel() {
    if (focusPoint) return $("#placeInput").value || "Lieu recherché";
    if (me) return "Autour de ma position";
    return ZONE.nom;
  }
  function renderMeteo(data, when, note) {
    var d = data.daily, h = note ? '<p class="tiny muted" style="margin:0 0 8px">' + note + "</p>" : "";
    var today = new Date(); today = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0") + "-" + String(today.getDate()).padStart(2, "0");
    var days = [0, 1, 2].filter(function (i) { return d.time && d.time[i]; });
    var minAll = Math.min.apply(null, days.map(function (i) { return d.temperature_2m_min[i]; }));
    var rainMax = Math.max.apply(null, days.map(function (i) { return d.precipitation_sum[i] || 0; }));
    var gustMax = Math.max.apply(null, days.map(function (i) { return d.wind_gusts_10m_max[i] || 0; }));
    var sunset = d.sunset[0], sunrise = d.sunrise[0];
    var setH = parseInt(String(sunset).slice(11, 13), 10), setM = String(sunset).slice(14, 16);
    h += '<div class="sun"><span>Lever <b>' + hm(sunrise) + '</b></span><span>Coucher <b>' + hm(sunset) + "</b></span></div>" +
      '<p class="tiny muted" style="margin:4px 0 0">Rafales en km/h. Monter le camp avant ' + (setH - 1) + " h " + setM + ", tant qu'il fait jour.</p>";
    h += '<div class="meteo-days">' + days.map(function (i) {
      var date = new Date(d.time[i] + "T12:00:00");
      var label = d.time[i] === today ? "Aujourd'hui" : date.toLocaleDateString("fr-BE", { weekday: "long", day: d.time[0] === today ? undefined : "numeric" });
      return '<div class="day"><span class="d">' + esc(label) + '</span><span class="w">' + esc(WMO[d.weather_code[i]] || "—") + "</span>" +
        '<span class="tt">' + Math.round(d.temperature_2m_max[i]) + "° <small>/ " + Math.round(d.temperature_2m_min[i]) + "°</small></span>" +
        '<span class="x">💧 ' + (d.precipitation_sum[i] || 0).toFixed(0) + " mm · " + (d.precipitation_probability_max[i] == null ? "–" : d.precipitation_probability_max[i]) + "%</span>" +
        '<span class="x">Rafales ' + Math.round(d.wind_gusts_10m_max[i] || 0) + "</span></div>";
    }).join("") + "</div>";
    var alerts = [];
    if (minAll <= 0) alerts.push(["danger", "Gel la nuit (" + Math.round(minAll) + " °C)", "Sac de couchage confort sous 0 °C, bonnet pour dormir, gourde dans le sac pour qu'elle ne gèle pas."]);
    else if (minAll <= 5) alerts.push(["warn", "Nuit froide (" + Math.round(minAll) + " °C)", "Couche chaude et matelas bien isolant. Voir « Prévenir l'hypothermie »."]);
    if (rainMax >= 10) alerts.push(["warn", "Fortes pluies annoncées", "Bâche, vêtements de rechange au sec dans un sac étanche, éviter le bord de la rivière (montée des eaux)."]);
    if (gustMax >= 60) alerts.push(["danger", "Rafales de " + Math.round(gustMax) + " km/h", "Ne pas camper sous les arbres : risque de chute de branches."]);
    alerts.forEach(function (a) {
      h += '<div class="alert alert-' + a[0] + ' meteo-alert"><strong>' + esc(a[1]) + "</strong><span>" + esc(a[2]) + "</span></div>";
    });
    var mins = Math.round((Date.now() - when) / 60000);
    h += '<p class="meteo-meta">' + (mins < 2 ? "Mis à jour à l'instant" : "Mis à jour il y a " + (mins < 60 ? mins + " min" : Math.round(mins / 60) + " h")) +
      ' · Données <a href="https://open-meteo.com/" target="_blank" rel="noopener">Open-Meteo.com</a></p>';
    $("#meteo").innerHTML = h;
  }
  function loadMeteo() {
    var c = refPoint();
    if ($("#bivPlace")) $("#bivPlace").textContent = placeLabel();
    var cached = load("sylva_meteo", null);
    var fresh = cached && Date.now() - cached.t < 3600e3 && distKm(cached.c, c) < 5;
    if (cached) renderMeteo(cached.data, cached.t);
    if (fresh || !navigator.onLine) {
      if (!cached) $("#meteo").innerHTML = '<p class="muted">Pas de réseau : ouvrez cet onglet une fois connecté pour garder la météo en mémoire.</p>';
      return;
    }
    fetch("https://api.open-meteo.com/v1/forecast?latitude=" + c[0].toFixed(3) + "&longitude=" + c[1].toFixed(3) +
      "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_gusts_10m_max,sunrise,sunset" +
      "&current=temperature_2m,weather_code&timezone=Europe%2FBrussels&forecast_days=3")
      .then(function (r) { if (!r.ok) throw new Error(); return r.json(); })
      .then(function (data) { save("sylva_meteo", { t: Date.now(), c: c, data: data }); renderMeteo(data, Date.now()); renderHero(); applyTheme(); })
      .catch(function () { if (!cached) $("#meteo").innerHTML = '<p class="muted">Météo indisponible pour le moment.</p>'; });
  }

  // Météo de l'onglet Bivouac : au lieu de la sortie s'il est choisi (l'accueil garde la météo d'ici)
  function loadBivMeteo() {
    var t = getTrip();
    if (t.lat == null) { loadMeteo(); return; }
    if ($("#bivPlace")) $("#bivPlace").textContent = t.lieu || t.pointLabel || "Lieu du bivouac";
    var j = tripDays(t), start = null, note = "";
    if (j !== null && j >= 0 && j <= 13) start = t.date;
    else if (j !== null && j > 13) note = "Prévisions disponibles 2 semaines avant la sortie : en attendant, voici la météo actuelle sur place.";
    var key = t.lat.toFixed(3) + "," + t.lon.toFixed(3) + "," + (start || "now");
    var cached = load("sylva_meteo_trip", null), ok = cached && cached.key === key;
    if (ok) renderMeteo(cached.data, cached.t, note);
    if ((ok && Date.now() - cached.t < 3600e3) || !navigator.onLine) {
      if (!ok) $("#meteo").innerHTML = '<p class="muted">Pas de réseau : ouvre cet onglet une fois connecté pour garder la météo du lieu en mémoire.</p>';
      return;
    }
    var range = start ? "&start_date=" + start + "&end_date=" + new Date(new Date(start + "T12:00:00").getTime() + 2 * 864e5).toISOString().slice(0, 10) : "&forecast_days=3";
    fetch("https://api.open-meteo.com/v1/forecast?latitude=" + t.lat.toFixed(3) + "&longitude=" + t.lon.toFixed(3) +
      "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_gusts_10m_max,sunrise,sunset" +
      "&timezone=Europe%2FBrussels" + range)
      .then(function (r) { if (!r.ok) throw new Error(); return r.json(); })
      .then(function (data) { save("sylva_meteo_trip", { t: Date.now(), key: key, data: data }); if (getTrip().lat != null) renderMeteo(data, Date.now(), note); })
      .catch(function () { if (!ok) $("#meteo").innerHTML = '<p class="muted">Météo du lieu indisponible pour le moment.</p>'; });
  }

  // ---------- Programme du prochain bivouac : recettes et fiches -> sac ----------
  // Matériel repéré dans le texte d'une fiche : [mot-clé (regex), élément à prendre]
  var GEAR = [
    [/alu(minium)?\b/i, "Papier aluminium"], [/popote|gamelle|marmite|casserole/i, "Popote / gamelle"],
    [/\bpo[êe]le\b/i, "Poêle de bivouac"], [/\bquart\b|\btasse\b/i, "Quart (tasse)"], [/cuill[èe]re/i, "Cuillère"],
    [/b[âa]che|tarp/i, "Bâche (tarp)"], [/cordelette|paracorde|ficelle|ligne fa[îi]ti[èe]re/i, "Cordelette (10 m)"],
    [/sardine|piquet/i, "Sardines / piquets"], [/\bscie\b/i, "Scie pliante"], [/hachette|hache\b/i, "Hachette"],
    [/ferro|pierre [àa] feu/i, "Pierre à feu (ferro)"], [/briquet/i, "Briquet"], [/allumette/i, "Allumettes"],
    [/amadou|coton.{0,12}vaseline|allume-feu/i, "Allume-feu"], [/sac poubelle|sac [ée]tanche/i, "Sacs étanches / poubelle"],
    [/couverture de survie/i, "Couverture de survie"], [/sifflet/i, "Sifflet"], [/boussole/i, "Boussole"],
    [/carte (papier|topo|IGN)/i, "Carte papier"], [/frontale|lampe/i, "Lampe frontale"], [/\bgants?\b/i, "Gants"],
    [/tire-tique/i, "Tire-tique"], [/bande|compresse|pansement/i, "Pansements et compresses"], [/[ée]pingle/i, "Épingles de sûreté"],
    [/foulard|triangle de tissu/i, "Foulard / tissu triangulaire"], [/hame[çc]on/i, "Hameçons"], [/fil de p[êe]che|\bligne\b.*p[êe]che|p[êe]che.*\bligne\b/i, "Fil de pêche"],
    [/permis de p[êe]che|un permis/i, "Permis de pêche"], [/bouteille (en )?plastique/i, "Bouteille plastique vide"],
    [/pastilles?|filtre [àa] eau/i, "Pastilles ou filtre à eau"], [/couteau/i, "Couteau"]
  ];
  function getPlan() { var p = load("sylva_plan", []); return Array.isArray(p) ? p : []; }
  function inPlan(id) { return getPlan().indexOf(id) !== -1; }
  function planBtnHtml(id) {
    var on = inPlan(id);
    return '<button type="button" class="btn ' + (on ? "" : "btn-primary ") + 'plan-btn" data-plan="' + esc(id) + '">' +
      (on ? "✓ Au programme du bivouac · retirer" : "+ Ajouter au prochain bivouac") + "</button>";
  }
  function thingsFor(t) {
    var out = [];
    if (t.recette && t.recette.ingredients) out = t.recette.ingredients.slice();
    var txt = [t.intro].concat(t.etapes || [], t.isole || []).join(" ");
    GEAR.forEach(function (g) { if (g[0].test(txt) && out.indexOf(g[1]) === -1) out.push(g[1]); });
    if (!out.length) out.push("Relire la fiche avant de partir");
    return out;
  }
  function togglePlan(id) {
    var t = TECHS.filter(function (x) { return x.id === id; })[0]; if (!t) return;
    var p = getPlan(), cl = getChecklist();
    if (p.indexOf(id) !== -1) {
      p.splice(p.indexOf(id), 1);
      cl = cl.filter(function (g) { return g.src !== id; });
      toast("Retiré du prochain bivouac");
    } else {
      p.push(id);
      if (!cl.some(function (g) { return g.src === id; })) {
        // On n'ajoute pas ce qui est déjà dans le sac
        var have = {}; cl.forEach(function (g) { g.items.forEach(function (it) { have[norm(it.label)] = 1; }); });
        var items = thingsFor(t).filter(function (x) { return !have[norm(x)]; });
        cl.push({ id: uid(), src: id, titre: (t.recette ? "Recette : " : "Pour : ") + t.titre,
          items: (items.length ? items : ["Tout est déjà dans le sac"]).map(function (l) { return { id: uid(), label: l, done: false, photo: false }; }) });
      }
      toast("Ajouté au sac du prochain bivouac");
    }
    save("sylva_plan", p); saveChecklist(cl);
    renderChecklist(); renderPlan(); if (typeof renderAccueil === "function") renderAccueil();
  }
  function renderPlan() {
    var box = $("#planList"); if (!box) return;
    var p = getPlan().map(function (id) { return TECHS.filter(function (x) { return x.id === id; })[0]; }).filter(Boolean);
    $("#planHead").hidden = !p.length; box.hidden = !p.length;
    box.innerHTML = '<div class="list">' + p.map(function (t) {
      return '<div class="plan-row"><button class="item" data-tech="' + esc(t.id) + '"><span class="item-illus" aria-hidden="true">' + thumbOf(t.id, t.illus) + "</span>" +
        '<span class="item-main"><span class="item-name">' + esc(t.titre) + '</span><span class="item-sub">' + esc(t.cat) + "</span></span></button>" +
        '<button class="icon-mini danger" data-unplan="' + esc(t.id) + '" aria-label="Retirer ' + esc(t.titre) + ' du programme">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>';
    }).join("") + "</div>";
  }
  $("#planList").addEventListener("click", function (e) {
    var u = e.target.closest("[data-unplan]"); if (u) { togglePlan(u.getAttribute("data-unplan")); return; }
    var b = e.target.closest("[data-tech]"); if (b) openTechnique(b.getAttribute("data-tech"));
  });

  // ---------- Checklist du sac (modifiable, avec photos perso) ----------
  var CHECKLIST_DEFAUT = [
    ["Abri et couchage", ["Tente ou bâche + 10 m de cordelette", "Sac de couchage confort ≤ 0 °C", "Matelas isolant (R ≥ 3)", "Couverture de survie", "Sacs poubelle (déchets + rangement étanche)"]],
    ["Vêtements", ["Sous-couche laine ou synthétique (pas de coton)", "Polaire ou doudoune", "Veste et pantalon imperméables", "Bonnet et gants", "2 paires de chaussettes de rechange", "Tenue sèche réservée à la nuit", "Chaussures de marche imperméables"]],
    ["Eau et repas", ["Gourdes (2 L minimum)", "Réchaud + combustible + casserole", "Briquet + pierre à feu", "Pastilles ou filtre à eau", "Repas + en-cas énergétiques"]],
    ["Sécurité et orientation", ["Téléphone chargé + batterie externe", "Lampe frontale + piles", "Carte papier et boussole", "Sifflet", "Trousse de secours + tire-tique", "Couteau"]],
    ["Avant de partir", ["Prévenir quelqu'un : itinéraire et heure de retour", "Vérifier la météo (ci-dessus)", "Parcourir la zone sur la carte (cache hors-ligne)", "Télécharger les photos (réglages)", "Vérifier les règles de l'aire de bivouac"]]
  ];
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function defaultChecklist(oldState) {
    return CHECKLIST_DEFAUT.map(function (g, gi) {
      return { id: uid(), titre: g[0], items: g[1].map(function (label, ii) {
        return { id: uid(), label: label, done: !!(oldState && oldState[gi + "-" + ii]), photo: false };
      }) };
    });
  }
  function getChecklist() {
    var cl = load("sylva_checklist", null);
    if (!cl) { cl = defaultChecklist(load("sylva_check", {})); save("sylva_checklist", cl); }
    return cl;
  }
  function saveChecklist(cl) { save("sylva_checklist", cl); }
  function findItem(cl, id) {
    for (var g = 0; g < cl.length; g++) for (var i = 0; i < cl[g].items.length; i++) if (cl[g].items[i].id === id) return { g: g, i: i, item: cl[g].items[i] };
    return null;
  }
  var checkEdit = false;
  var ICO_CAM = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="4"/></svg>';
  var ICO_X = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';

  function renderChecklist() {
    var cl = getChecklist(), total = 0, done = 0, h = "";
    cl.forEach(function (g) {
      h += checkEdit
        ? '<div class="check-group-edit"><input class="edit-input group-input" data-group-title="' + esc(g.id) + '" value="' + esc(g.titre) + '" aria-label="Nom de la catégorie">' +
          '<button class="icon-mini danger" data-del-group="' + esc(g.id) + '" aria-label="Supprimer la catégorie ' + esc(g.titre) + '">' + ICO_X + "</button></div>"
        : '<div class="check-group">' + esc(g.titre) + "</div>";
      g.items.forEach(function (it) {
        total++; if (it.done) done++;
        var thumb = it.photo ? '<img class="check-thumb" data-check-photo="' + esc(it.id) + '" alt="" hidden>' : "";
        if (checkEdit) {
          h += '<div class="check check-edit">' +
            '<button class="icon-mini photo-slot" data-photo-for="' + esc(it.id) + '" aria-label="' + (it.photo ? "Changer la photo" : "Ajouter une photo") + '">' + (it.photo ? thumb : ICO_CAM) + "</button>" +
            '<input class="edit-input" data-item-label="' + esc(it.id) + '" value="' + esc(it.label) + '" aria-label="Nom de l\'élément">' +
            '<button class="icon-mini danger" data-del-item="' + esc(it.id) + '" aria-label="Supprimer ' + esc(it.label) + '">' + ICO_X + "</button></div>";
        } else {
          h += '<label class="check' + (it.done ? " done" : "") + '"><input type="checkbox" data-check="' + esc(it.id) + '"' + (it.done ? " checked" : "") + ">" +
            thumb + "<span>" + esc(it.label) + "</span></label>";
        }
      });
      if (checkEdit) {
        h += '<form class="add-row" data-add-to="' + esc(g.id) + '"><input class="edit-input" placeholder="Ajouter un élément…" aria-label="Nouvel élément dans ' + esc(g.titre) + '">' +
          '<button class="btn btn-primary add-btn" type="submit">Ajouter</button></form>';
      }
    });
    if (checkEdit) {
      h += '<form class="add-row add-group" id="formAddGroup"><input class="edit-input" placeholder="Nouvelle catégorie…" aria-label="Nouvelle catégorie">' +
        '<button class="btn add-btn" type="submit">Créer</button></form>' +
        '<button class="link-btn" id="btnDefaultCheck" type="button">Revenir à la liste par défaut</button>';
    }
    $("#checklist").innerHTML = h;
    $("#checkCount").textContent = done + " sur " + total + " prêts" + (total && done === total ? " · sac prêt ✓" : " · " + (total - done) + " à faire");
    var pct = total ? Math.round(done / total * 100) : 0;
    $("#checkBar").style.width = pct + "%";
    $("#checkPct").textContent = pct + " %";
    $("#checkRing").style.strokeDasharray = (pct / 100 * 201).toFixed(1) + " 201";
    $("#btnEditCheck").textContent = checkEdit ? "Terminé" : "Modifier";
    $("#btnResetCheck").hidden = checkEdit;
    $all("#checklist [data-check-photo]").forEach(function (img) {
      spotPhotoUrl("chk-" + img.getAttribute("data-check-photo")).then(function (u) { if (u) { img.src = u; img.hidden = false; } });
    });
  }

  $("#btnEditCheck").addEventListener("click", function () { checkEdit = !checkEdit; renderChecklist(); });
  $("#btnResetCheck").addEventListener("click", function () {
    var cl = getChecklist(); cl.forEach(function (g) { g.items.forEach(function (it) { it.done = false; }); });
    saveChecklist(cl); renderChecklist();
  });
  $("#checklist").addEventListener("change", function (e) {
    var t = e.target, cl = getChecklist(), f;
    if (t.hasAttribute("data-check")) {
      f = findItem(cl, t.getAttribute("data-check")); if (!f) return;
      f.item.done = t.checked; saveChecklist(cl); renderChecklist();
    } else if (t.hasAttribute("data-item-label")) {
      f = findItem(cl, t.getAttribute("data-item-label")); if (!f) return;
      var v = t.value.trim(); if (v) { f.item.label = v; saveChecklist(cl); } else t.value = f.item.label;
    } else if (t.hasAttribute("data-group-title")) {
      var g = cl.filter(function (x) { return x.id === t.getAttribute("data-group-title"); })[0];
      if (g && t.value.trim()) { g.titre = t.value.trim(); saveChecklist(cl); }
    }
  });
  $("#checklist").addEventListener("submit", function (e) {
    e.preventDefault();
    var form = e.target, input = form.querySelector("input"), v = input.value.trim(); if (!v) return;
    var cl = getChecklist();
    if (form.id === "formAddGroup") cl.push({ id: uid(), titre: v, items: [] });
    else {
      var g = cl.filter(function (x) { return x.id === form.getAttribute("data-add-to"); })[0]; if (!g) return;
      g.items.push({ id: uid(), label: v, done: false, photo: false });
    }
    saveChecklist(cl); renderChecklist();
    var again = form.id ? $("#formAddGroup input") : document.querySelector('[data-add-to="' + form.getAttribute("data-add-to") + '"] input');
    if (again) again.focus();
  });
  var photoTarget = null;
  $("#checklist").addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    var cl = getChecklist(), f;
    if (b.hasAttribute("data-del-item")) {
      var id = b.getAttribute("data-del-item"); f = findItem(cl, id); if (!f) return;
      cl[f.g].items.splice(f.i, 1); saveChecklist(cl);
      idbDo("readwrite", function (st) { return st.delete("chk-" + id); }).catch(function () {});
      renderChecklist();
    } else if (b.hasAttribute("data-del-group")) {
      var gid = b.getAttribute("data-del-group"), g = cl.filter(function (x) { return x.id === gid; })[0];
      if (!g || (g.items.length && !confirm("Supprimer la catégorie « " + g.titre + " » et ses " + g.items.length + " éléments ?"))) return;
      cl = cl.filter(function (x) { return x.id !== gid; }); saveChecklist(cl);
      if (g.src) { save("sylva_plan", getPlan().filter(function (x) { return x !== g.src; })); renderPlan(); }
      renderChecklist();
    } else if (b.hasAttribute("data-photo-for")) {
      photoTarget = b.getAttribute("data-photo-for"); $("#checkPhoto").click();
    } else if (b.id === "btnDefaultCheck") {
      if (!confirm("Remplacer ta liste par la liste par défaut ? Tes éléments et photos perso seront effacés.")) return;
      saveChecklist(defaultChecklist(null)); save("sylva_plan", []); renderPlan(); renderChecklist();
    }
  });
  $("#checkPhoto").addEventListener("change", function (e) {
    var file = e.target.files && e.target.files[0]; e.target.value = "";
    if (!file || !photoTarget) return;
    var id = photoTarget;
    resizeImage(file, 400).then(function (blob) {
      return idbDo("readwrite", function (st) { return st.put(blob, "chk-" + id); });
    }).then(function () {
      if (spotUrls["chk-" + id]) { URL.revokeObjectURL(spotUrls["chk-" + id]); delete spotUrls["chk-" + id]; }
      var cl = getChecklist(), f = findItem(cl, id); if (f) { f.item.photo = true; saveChecklist(cl); }
      renderChecklist();
    }).catch(function () { toast("Photo impossible à enregistrer"); });
  });

  // ---------- Carnet ----------
  function renderCarnet() {
    var spots = getSpots().slice().sort(function (a, b) { return b.date - a.date; });
    if (!spots.length) {
      $("#carnet").innerHTML = '<div class="card"><p class="muted" style="margin:0">Aucun spot pour l\'instant. Sur la carte, touchez le bouton <b>+</b> pour noter une trouvaille, avec une photo si vous voulez.</p></div>';
      return;
    }
    $("#carnet").innerHTML = '<div class="list">' + spots.map(function (s) {
      var ty = SPOT_TYPES[s.type] || SPOT_TYPES.autre;
      var dist = me ? " · " + fmtKm(distKm([me[0], me[1]], [s.lat, s.lon])) : "";
      return '<button class="carnet-item" data-goto-spot="' + esc(s.id) + '">' +
        (s.photo ? '<img class="carnet-thumb" data-spot-photo="' + esc(s.id) + '" alt="" hidden><span class="carnet-pin" data-ph="' + esc(s.id) + '" style="background:' + ty[0] + '">' + esc(ty[1]) + "</span>"
                 : '<span class="carnet-pin" style="background:' + ty[0] + '">' + esc(ty[1]) + "</span>") +
        '<span class="item-main"><span class="item-name">' + esc(ty[2]) + '</span><span class="item-sub">' + esc(s.note || "(sans note)") + "</span>" +
        '<span class="item-sub">' + esc(new Date(s.date).toLocaleString("fr-BE", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })) + esc(dist) + "</span></span></button>";
    }).join("") + "</div>";
    $all("#carnet [data-spot-photo]").forEach(function (img) {
      var id = img.getAttribute("data-spot-photo");
      spotPhotoUrl(id).then(function (u) {
        if (!u) return;
        img.src = u; img.hidden = false;
        var pin = document.querySelector('#carnet [data-ph="' + id + '"]'); if (pin) pin.remove();
      });
    });
  }
  $("#carnet").addEventListener("click", function (e) {
    var b = e.target.closest("[data-goto-spot]"); if (!b || !map) return;
    var id = b.getAttribute("data-goto-spot");
    var s = getSpots().filter(function (x) { return x.id === id; })[0]; if (!s) return;
    showView("carte");
    setTimeout(function () { map.setView([s.lat, s.lon], 16); if (spotMarkers[id]) spotMarkers[id].openPopup(); }, 120);
  });

  function renderBivouac() { renderTrip(); renderPrepState(); renderCar(); loadBivMeteo(); tripChasse(); renderPlan(); renderJournal(); renderGear(); renderChecklist(); renderHist(); renderCarnet(); }

  // ---------- Aujourd'hui ----------
  var MOIS_COURTS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
  function checkStats() {
    var done = 0, total = 0;
    getChecklist().forEach(function (g) { g.items.forEach(function (it) { total++; if (it.done) done++; }); });
    return { done: done, total: total, pct: total ? Math.round(done / total * 100) : 0 };
  }
  function getTrip() { return load("sylva_trip", { lieu: "", date: "" }); }
  function tripDays(t) {
    if (!t.date) return null;
    var d = new Date(t.date + "T00:00:00"), n = new Date(); n.setHours(0, 0, 0, 0);
    return Math.round((d - n) / 864e5);
  }
  function tripWhenTxt(t) {
    var j = tripDays(t);
    if (j === null) return "Prochaine sortie";
    if (j > 1) return "Dans " + j + " jours";
    if (j === 1) return "Demain";
    if (j === 0) return "Aujourd'hui";
    return "Il y a " + (-j) + " jour" + (j < -1 ? "s" : "");
  }
  function renderTrip() {
    var t = getTrip();
    $("#tripWhen").textContent = tripWhenTxt(t);
    $("#tripName").textContent = t.lieu || "Mon bivouac";
    $("#btnTrip").textContent = t.date || t.lieu ? "Modifier la sortie" : "Choisir la date et le lieu";
    $("#btnTripEnd").hidden = !(t.date || t.lieu);
    $("#btnTripGo").hidden = t.lat == null;
  }
  // Lieu de la sortie : recherche, un de mes spots, ou ma position
  var tripPick = null, tripFound = [];
  function showTripPoint() {
    $("#tripPoint").innerHTML = tripPick
      ? "📍 " + esc(tripPick.label || "Point choisi") + ' <span class="muted">(' + tripPick.lat.toFixed(4) + ", " + tripPick.lon.toFixed(4) + ')</span> <button type="button" class="link-btn" id="btnTripClear">effacer</button>'
      : '<span class="muted">Sans point précis, la météo du bivouac suit ta position ou la carte.</span>';
  }
  $("#btnTrip").addEventListener("click", function () {
    var t = getTrip(); $("#tripLieu").value = t.lieu || ""; $("#tripDate").value = t.date || "";
    tripPick = t.lat != null ? { lat: t.lat, lon: t.lon, label: t.pointLabel || t.lieu, spot: t.spot || "" } : null;
    var sel = $("#tripSpot");
    sel.innerHTML = '<option value="">Choisir un spot…</option>' + getSpots().map(function (sp) {
      var ty = SPOT_TYPES[sp.type] || SPOT_TYPES.autre;
      return '<option value="' + esc(sp.id) + '">' + esc(ty[2] + (sp.note ? " · " + sp.note.slice(0, 40) : "")) + "</option>";
    }).join("");
    sel.value = tripPick && tripPick.spot ? tripPick.spot : "";
    $("#btnTripMe").hidden = !me;
    $("#tripResults").hidden = true; showTripPoint(); openModal("#modalTrip");
  });
  function tripSearch() {
    var q = $("#tripLieu").value.trim(), box = $("#tripResults"); if (!q) return;
    if (!navigator.onLine) { box.hidden = false; box.innerHTML = '<div class="place-empty">Pas de réseau : choisis plutôt un spot ou ta position.</div>'; return; }
    if (Date.now() - lastSearch < 1100) return; lastSearch = Date.now();
    box.hidden = false; box.innerHTML = '<div class="place-empty">Recherche…</div>';
    fetch("https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&accept-language=fr&countrycodes=be,fr,lu,nl,de,ch&q=" + encodeURIComponent(q), { headers: { "Accept": "application/json" } })
      .then(function (r) { if (!r.ok) throw new Error(); return r.json(); })
      .then(function (list) {
        tripFound = list || [];
        box.innerHTML = tripFound.length ? tripFound.map(function (p, i) {
          var parts = String(p.display_name || "").split(",");
          return '<button type="button" class="place-item" data-trip-place="' + i + '"><b>' + esc(p.name || parts[0]) + "</b><span>" + esc(parts.slice(1, 4).join(",").trim()) + "</span></button>";
        }).join("") : '<div class="place-empty">Aucun lieu trouvé.</div>';
      }).catch(function () { box.innerHTML = '<div class="place-empty">Recherche indisponible, réessaie.</div>'; });
  }
  $("#btnTripSearch").addEventListener("click", tripSearch);
  $("#btnTripGo").addEventListener("click", function () { var t = getTrip(); if (t.lat != null) startNav({ lat: t.lat, lon: t.lon, label: t.lieu || t.pointLabel || "Bivouac" }); });
  $("#tripLieu").addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); tripSearch(); } });
  $("#tripResults").addEventListener("click", function (e) {
    var b = e.target.closest("[data-trip-place]"); if (!b) return;
    var p = tripFound[+b.getAttribute("data-trip-place")]; if (!p) return;
    var name = p.name || String(p.display_name || "").split(",")[0];
    tripPick = { lat: parseFloat(p.lat), lon: parseFloat(p.lon), label: name, spot: "" };
    $("#tripLieu").value = name; $("#tripSpot").value = ""; $("#tripResults").hidden = true; showTripPoint();
  });
  $("#tripSpot").addEventListener("change", function () {
    var sp = getSpots().filter(function (x) { return x.id === $("#tripSpot").value; })[0];
    if (!sp) return;
    var ty = SPOT_TYPES[sp.type] || SPOT_TYPES.autre, lab = sp.note ? sp.note.slice(0, 40) : ty[2];
    tripPick = { lat: sp.lat, lon: sp.lon, label: lab, spot: sp.id };
    if (!$("#tripLieu").value.trim()) $("#tripLieu").value = lab;
    showTripPoint();
  });
  $("#btnTripMe").addEventListener("click", function () {
    if (!me) return;
    tripPick = { lat: me[0], lon: me[1], label: "Ma position", spot: "" }; $("#tripSpot").value = ""; showTripPoint();
  });
  $("#tripPoint").addEventListener("click", function (e) {
    if (e.target.id === "btnTripClear") { tripPick = null; $("#tripSpot").value = ""; showTripPoint(); }
  });
  $("#formTrip").addEventListener("submit", function (e) {
    e.preventDefault();
    var t = { lieu: $("#tripLieu").value.trim(), date: $("#tripDate").value };
    if (tripPick) { t.lat = tripPick.lat; t.lon = tripPick.lon; t.pointLabel = tripPick.label; t.spot = tripPick.spot || ""; }
    save("sylva_trip", t);
    closeModal($("#modalTrip")); renderTrip(); loadBivMeteo(); tripChasse(); renderAccueil(); toast("Sortie enregistrée");
  });

  // ---------- Historique des bivouacs ----------
  function getHist() { var h = load("sylva_hist", []); return Array.isArray(h) ? h : []; }
  function starsTxt(n) { var s = ""; for (var i = 1; i <= 5; i++) s += i <= n ? "★" : "☆"; return s; }
  function renderHist() {
    var hs = getHist().slice().sort(function (a, b) { return (b.date || "").localeCompare(a.date || "") || b.fin - a.fin; });
    $("#histList").innerHTML = hs.length ? '<div class="list">' + hs.map(function (x) {
      var d = x.date ? new Date(x.date + "T12:00:00").toLocaleDateString("fr-BE", { day: "numeric", month: "long", year: "numeric" }) : "Date inconnue";
      return '<button class="item hist-item" data-hist="' + esc(x.id) + '"><span class="item-main"><span class="item-name">' + esc(x.lieu || "Bivouac") +
        (x.stars ? ' <span class="hist-stars" aria-label="' + x.stars + ' sur 5">' + starsTxt(x.stars) + "</span>" : "") + "</span>" +
        '<span class="item-sub">' + esc(d) + (x.plan && x.plan.length ? " · " + x.plan.length + " recette(s) / fiche(s)" : "") + "</span>" +
        '<span class="item-sub">' + esc(x.note ? x.note.slice(0, 110) + (x.note.length > 110 ? "…" : "") : "Touche pour ajouter un commentaire") + "</span></span></button>";
    }).join("") + "</div>"
      : '<div class="card"><p class="muted" style="margin:0">Pas encore d\'ancien bivouac. Après ta sortie, touche « Terminer ce bivouac » : il arrive ici et tu peux le noter et le commenter.</p></div>';
  }
  var histEdit = null, histStars = 0;
  function drawStars() {
    var h = ""; for (var i = 1; i <= 5; i++) h += '<button type="button" role="radio" aria-checked="' + (i === histStars) + '" aria-label="' + i + ' sur 5" data-star="' + i + '"' + (i <= histStars ? ' class="on"' : "") + ">★</button>";
    $("#histStars").innerHTML = h;
  }
  function openHist(id) {
    var x = id ? getHist().filter(function (y) { return y.id === id; })[0] : null;
    histEdit = x ? x.id : null; histStars = x ? x.stars || 0 : 0;
    $("#histTitle").textContent = x ? "Ancien bivouac" : "Ajouter un ancien bivouac";
    $("#histLieu").value = x ? x.lieu || "" : ""; $("#histDate").value = x ? x.date || "" : "";
    $("#histNote").value = x ? x.note || "" : "";
    $("#histPlan").textContent = x && x.plan && x.plan.length ? "Au programme : " + x.plan.map(function (p) { return p.titre; }).join(", ") : "";
    $("#btnHistDel").hidden = !x;
    $("#histJournal").innerHTML = histJournalHtml(x);
    $all("#histJournal [data-jr-photo]").forEach(function (img) { spotPhotoUrl("jr-" + img.getAttribute("data-jr-photo")).then(function (u) { if (u) { img.src = u; img.hidden = false; } }); });
    drawStars(); openModal("#modalHist");
  }
  $("#histStars").addEventListener("click", function (e) {
    var b = e.target.closest("[data-star]"); if (!b) return;
    var n = +b.getAttribute("data-star"); histStars = histStars === n ? 0 : n; drawStars();
  });
  $("#histList").addEventListener("click", function (e) { var b = e.target.closest("[data-hist]"); if (b) openHist(b.getAttribute("data-hist")); });
  $("#btnAddPast").addEventListener("click", function () { openHist(null); });
  $("#formHist").addEventListener("submit", function (e) {
    e.preventDefault();
    var hs = getHist(), x = histEdit ? hs.filter(function (y) { return y.id === histEdit; })[0] : null;
    if (!x) { x = { id: uid(), fin: Date.now(), plan: [] }; hs.push(x); }
    x.lieu = $("#histLieu").value.trim(); x.date = $("#histDate").value; x.stars = histStars; x.note = $("#histNote").value.trim();
    save("sylva_hist", hs); closeModal($("#modalHist")); renderHist(); toast("Bivouac enregistré");
  });
  $("#btnHistDel").addEventListener("click", function () {
    if (!histEdit || !confirm("Supprimer ce bivouac de l'historique ?")) return;
    save("sylva_hist", getHist().filter(function (y) { return y.id !== histEdit; }));
    closeModal($("#modalHist")); renderHist();
  });
  $("#btnTripEnd").addEventListener("click", function () {
    var t = getTrip();
    if (!confirm("Terminer « " + (t.lieu || "ce bivouac") + " » ? Il passe dans tes anciens bivouacs, et le sac est remis à zéro pour le prochain.")) return;
    var plan = getPlan().map(function (id) { var f = TECHS.filter(function (x) { return x.id === id; })[0]; return f ? { id: id, titre: f.titre } : null; }).filter(Boolean);
    var x = { id: uid(), lieu: t.lieu || t.pointLabel || "Bivouac", date: t.date || new Date().toISOString().slice(0, 10), lat: t.lat, lon: t.lon, plan: plan, stars: 0, note: "", fin: Date.now() };
    journalToHist(x);
    var hs = getHist(); hs.push(x); save("sylva_hist", hs); checkBadges();
    var cl = getChecklist().filter(function (g) { return !g.src; });
    cl.forEach(function (g) { g.items.forEach(function (it) { it.done = false; }); });
    saveChecklist(cl); save("sylva_plan", []); save("sylva_trip", { lieu: "", date: "" }); try { localStorage.removeItem("sylva_meteo_trip"); } catch (e2) {}
    renderBivouac(); renderAccueil();
    openHist(x.id);
  });
  function renderHero() {
    var m = load("sylva_meteo", null);
    $("#heroPlace").textContent = placeLabel();
    $("#homeAlerts").innerHTML = "";
    if (!m || !m.data || !m.data.daily) {
      $("#heroTemp").textContent = "–°";
      $("#heroSky").textContent = navigator.onLine ? "Météo en chargement…" : "Météo disponible avec du réseau";
      $("#heroSun").hidden = true; return;
    }
    var d = m.data.daily, cur = m.data.current;
    var night = isNight();
    var temp = cur && cur.temperature_2m != null ? cur.temperature_2m : d.temperature_2m_max[0];
    var code = cur && cur.weather_code != null ? cur.weather_code : d.weather_code[0];
    var nmin = Math.min(d.temperature_2m_min[0], d.temperature_2m_min[1] != null ? d.temperature_2m_min[1] : 99);
    $("#heroTemp").textContent = Math.round(temp) + "°";
    $("#heroSky").textContent = (WMO[code] || "—") + " · nuit à " + Math.round(nmin) + " °C";
    $("#heroSun").hidden = false;
    $("#heroSun").textContent = night ? "Lever du soleil " + hm(d.sunrise[d.sunrise.length > 1 && new Date() > new Date(d.sunset[0]) ? 1 : 0]) : "Coucher du soleil " + hm(d.sunset[0]);
    var al = [], rain = Math.max(d.precipitation_sum[0] || 0, d.precipitation_sum[1] || 0), gust = Math.max(d.wind_gusts_10m_max[0] || 0, d.wind_gusts_10m_max[1] || 0);
    if (nmin <= 0) al.push(["", "Gel cette nuit", "Duvet confort sous 0 °C, bonnet pour dormir, gourde dans le duvet."]);
    else if (nmin <= 5) al.push(["warn", "Nuit froide (" + Math.round(nmin) + " °C)", "Couche chaude et matelas bien isolant."]);
    if (gust >= 60) al.push(["", "Rafales de " + Math.round(gust) + " km/h", "Ne campe pas sous les arbres : chute de branches."]);
    if (rain >= 10) al.push(["warn", "Fortes pluies", "Bâche, rechange au sec, éloigne-toi du bord de l'eau."]);
    $("#homeAlerts").innerHTML = al.map(function (a) {
      return '<div class="notice ' + a[0] + '"><span class="n-ico"><svg viewBox="0 0 24 24" aria-hidden="true">' +
        (a[1].indexOf("Gel") === 0 || a[1].indexOf("Nuit") === 0 ? '<path d="M12 2v20M4 6l16 12M20 6L4 18"/>' : '<path d="M12 3L2 20h20z"/><path d="M12 10v4M12 17h.01"/>') +
        "</svg></span><span><b>" + esc(a[1]) + "</b><span>" + esc(a[2]) + "</span></span></div>";
    }).join("");
  }
  function guideNext() {
    var lus = load("sylva_lus", {}), nb = 0, next = null;
    GUIDE.forEach(function (c) { if (lus[c.id]) nb++; else if (!next) next = c; });
    return { lus: nb, next: next || GUIDE[0] };
  }
  function resumeHtml() {
    var g = guideNext(); if (!g.next) return "";
    var i = GUIDE.indexOf(g.next);
    return '<span class="r-ico"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5"/></svg></span>' +
      '<span class="tc-main"><span class="s">GUIDE · CHAPITRE ' + (i + 1) + " SUR " + GUIDE.length + "</span><b>" + esc(g.next.titre) + "</b>" +
      '<span class="bar"><span style="width:' + Math.round(g.lus / Math.max(1, GUIDE.length) * 100) + '%"></span></span></span>' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';
  }
  function renderLearnGuide() { $("#learnGuide").innerHTML = resumeHtml(); $("#homeGuide").innerHTML = resumeHtml(); }
  function openNextChap() { var g = guideNext(); if (g.next) openChapitre(g.next.id); }
  $("#learnGuide").addEventListener("click", openNextChap);
  $("#homeGuide").addEventListener("click", openNextChap);
  function renderAccueil() {
    var now = new Date(), h = now.getHours();
    var j = now.toLocaleDateString("fr-BE", { weekday: "long", day: "numeric", month: "long" });
    $("#todayDate").textContent = j.charAt(0).toUpperCase() + j.slice(1);
    $("#hello").textContent = h < 5 || h >= 18 ? "Bonsoir" : "Bonjour";
    renderHero();
    var t = getTrip(), st = checkStats(), d = t.date ? new Date(t.date + "T12:00:00") : null;
    $("#tripCard").innerHTML = '<span class="date-box">' + (d ? "<b>" + d.getDate() + "</b><span>" + MOIS_COURTS[d.getMonth()] + "</span>" : "<b>+</b><span>date</span>") + "</span>" +
      '<span class="tc-main"><b>' + esc(t.lieu || (t.date ? "Prochaine sortie" : "Planifie ta prochaine sortie")) + "</b>" +
      '<span class="s">' + (d ? esc(tripWhenTxt(t)) + " · " : "") + "Sac prêt à " + st.pct + " % · " + st.done + " / " + st.total + "</span>" +
      '<span class="bar"><span style="width:' + st.pct + '%"></span></span></span>';
    var mois = now.getMonth() + 1;
    var sais = ESPECES.filter(function (s) { return inRegion(s) && s.mois && s.mois.indexOf(mois) !== -1 && s.cat !== "animal" && s.cat !== "poisson"; });
    sais.sort(function (a, b) { return (photoOf(b.latin) ? 1 : 0) - (photoOf(a.latin) ? 1 : 0); });
    $("#homeSeason").innerHTML = sais.slice(0, 12).map(function (s) {
      var p = photoOf(s.latin);
      return '<button class="season-card" type="button" data-esp="' + esc(s.id) + '"><span class="season-img">' +
        (p ? '<img src="' + esc(p.src) + '" alt="" loading="lazy">' : esc(s.nom.charAt(0))) +
        '<span class="badge ' + lvClass(s.niveau) + '">' + esc(s.statut) + "</span></span><b>" + esc(s.nom) + "</b></button>";
    }).join("") || '<p class="muted">Rien de particulier ce mois-ci.</p>';
    renderLearnGuide();
    renderSeasonAlerts();
  }
  $("#homeSeason").addEventListener("click", function (e) { var b = e.target.closest("[data-esp]"); if (b) openEspece(b.getAttribute("data-esp")); });
  $("#tripCard").addEventListener("click", function () { showView("bivouac"); });
  $("#heroMeteo").addEventListener("click", function () { showView("bivouac"); });

  // ---------- Apprendre ----------
  function learnShow(which) {
    $("#learnHome").hidden = which !== "home";
    $("#panelEspeces").hidden = which !== "especes";
    $("#panelGuide").hidden = which !== "guide";
    $("#panelQuiz").hidden = which !== "quiz";
    $("#panelBadges").hidden = which !== "badges";
    $("#panelPouls").hidden = which !== "pouls";
    $("#panelNiveau").hidden = which !== "niveau";
    $("#panelRv").hidden = which !== "rvalue";
    $("#panelEau").hidden = which !== "eau";
    $("#panelCiel").hidden = which !== "ciel";
    $("#panelTele").hidden = which !== "tele";
    if (which !== "tele" && typeof stopTele === "function") stopTele();
    if (which !== "pouls" && typeof stopCam === "function") stopCam();
    $("#view-apprendre").scrollTop = 0;
  }
  function setCat(cat) {
    curCat = cat;
    $all("#catChips .chip").forEach(function (x) { x.classList.toggle("on", x.dataset.cat === cat); });
    renderEspeces();
  }
  function renderLearnCounts() {
    $all("[data-count]").forEach(function (el) {
      var c = el.getAttribute("data-count");
      el.textContent = ESPECES.filter(function (s) { return s.cat === c && inRegion(s); }).length;
    });
  }
  $("#view-apprendre").addEventListener("click", function (e) {
    var b = e.target.closest("[data-learn],[data-learn-cat],[data-learn-fiches],[data-open-tech],[data-open-chap]");
    if (!b || b.closest("#learnResults")) return;
    if (b.hasAttribute("data-learn")) {
      var w = b.getAttribute("data-learn");
      if (w === "guide") { guideMode = "chapitres"; ficheCat = ""; $("#guideTitle").textContent = "Guide de survie"; renderGuide(); }
      learnShow(w);
    } else if (b.hasAttribute("data-learn-cat")) { setCat(b.getAttribute("data-learn-cat")); learnShow("especes"); }
    else if (b.hasAttribute("data-learn-fiches")) {
      ficheCat = b.getAttribute("data-learn-fiches"); guideMode = "fiches"; $("#searchGuide").value = "";
      $("#guideTitle").textContent = ficheCat || "Fiches pratiques"; renderGuide(); learnShow("guide");
    } else if (b.hasAttribute("data-open-tech")) openTechnique(b.getAttribute("data-open-tech"));
    else if (b.hasAttribute("data-open-chap")) openChapitre(b.getAttribute("data-open-chap"));
  });
  $("#btnAllSeason").addEventListener("click", function () { setCat("saison"); learnShow("especes"); showView("apprendre"); });
  function itemEsp(s) {
    var ph = photoOf(s.latin);
    return '<button class="item" data-esp="' + esc(s.id) + '">' +
      (ph ? '<span class="item-ico item-photo"><img src="' + esc(ph.src) + '" alt="" loading="lazy"></span>' : '<span class="item-ico ico-' + esc(s.cat) + '">' + esc(s.nom.charAt(0)) + "</span>") +
      '<span class="item-main"><span class="item-name">' + esc(s.nom) + '</span><span class="item-sub">' + esc(CAT_LABEL[s.cat]) + "</span></span>" +
      '<span class="badge ' + lvClass(s.niveau) + '">' + esc(s.statut) + "</span></button>";
  }
  $("#searchAll").addEventListener("input", function () {
    var q = norm(this.value.trim());
    $("#learnTiles").hidden = !!q; $("#learnResults").hidden = !q;
    if (!q) return;
    var esp = ESPECES.filter(function (s) { return norm(s.nom + " " + s.latin + " " + s.resume).indexOf(q) !== -1; }).slice(0, 10);
    var ch = GUIDE.filter(function (c) { return norm(chapText(c)).indexOf(q) !== -1; }).slice(0, 6);
    var fi = TECHS.filter(function (t) { return norm(t.titre + " " + t.intro + " " + (t.etapes || []).concat(t.isole || []).join(" ")).indexOf(q) !== -1; }).slice(0, 10);
    var h = "";
    if (fi.length) h += '<div class="section-title">Fiches pratiques</div><div class="list">' + fi.map(function (t) {
      return '<button class="item" data-tech="' + esc(t.id) + '"><span class="item-illus" aria-hidden="true">' + thumbOf(t.id, t.illus) + "</span>" +
        '<span class="item-main"><span class="item-name">' + esc(t.titre) + '</span><span class="item-sub">' + esc(t.cat) + "</span></span></button>";
    }).join("") + "</div>";
    if (esp.length) h += '<div class="section-title">Espèces</div><div class="list">' + esp.map(itemEsp).join("") + "</div>";
    if (ch.length) h += '<div class="section-title">Chapitres du guide</div><div class="list">' + ch.map(function (c) {
      return '<button class="item" data-chap="' + esc(c.id) + '"><span class="item-illus" aria-hidden="true">' + thumbOf("chap_" + c.id, c.illus) + "</span>" +
        '<span class="item-main"><span class="item-name">' + esc(c.titre) + '</span><span class="item-sub">Chapitre ' + (GUIDE.indexOf(c) + 1) + "</span></span></button>";
    }).join("") + "</div>";
    $("#learnResults").innerHTML = h || '<p class="muted">Rien trouvé pour « ' + esc(this.value) + " ».</p>";
  });
  $("#learnResults").addEventListener("click", function (e) {
    var b = e.target.closest("[data-esp],[data-chap],[data-tech]"); if (!b) return;
    if (b.hasAttribute("data-esp")) openEspece(b.getAttribute("data-esp"));
    else if (b.hasAttribute("data-chap")) openChapitre(b.getAttribute("data-chap"));
    else openTechnique(b.getAttribute("data-tech"));
  });

  // ---------- Démarrage ----------

  // =====================================================================
  // ---------- Journal de bord : trajet GPS, notes et photos ----------
  // =====================================================================
  function getJournal() { var j = load("sylva_journal", null); return j && j.track ? j : { rec: false, track: [], entries: [], t0: 0 }; }
  function saveJournal(j) { save("sylva_journal", j); }
  function trackKm(tr) { var d = 0; for (var i = 1; i < tr.length; i++) d += distKm(tr[i - 1], tr[i]); return d; }
  var trackLine = null, histLine = null;
  function drawTrack() {
    if (!map || !window.L) return;
    var j = getJournal();
    if (trackLine) { map.removeLayer(trackLine); trackLine = null; }
    if (j.track.length > 1) trackLine = L.polyline(j.track.map(function (p) { return [p[0], p[1]]; }), { color: "#C9472E", weight: 4, opacity: .8 }).addTo(map);
  }
  function journalOnPos() {
    var j = getJournal(); if (!j.rec || !me || me[2] > 60) return;
    var last = j.track[j.track.length - 1];
    if (last && distKm(last, [me[0], me[1]]) * 1000 < 15) return;
    j.track.push([+me[0].toFixed(6), +me[1].toFixed(6), Date.now()]);
    saveJournal(j); drawTrack();
    if ($("#journalStats")) renderJournal();
  }
  function fmtDur(ms) { var m = Math.round(ms / 60000); return m < 60 ? m + " min" : Math.floor(m / 60) + " h " + String(m % 60).padStart(2, "0"); }
  function renderJournal() {
    var j = getJournal(), km = trackKm(j.track);
    $("#btnJournalRec").textContent = j.rec ? "⏸ Arrêter l'enregistrement" : (j.track.length ? "▶ Reprendre l'enregistrement" : "▶ Enregistrer mon trajet");
    $("#btnJournalRec").classList.toggle("btn-primary", !j.rec);
    $("#journalStats").innerHTML = (j.rec ? '<span class="rec-dot" aria-hidden="true"></span>Enregistrement en cours · ' : "") +
      km.toFixed(2).replace(".", ",") + " km" + (j.track.length > 1 ? " · " + fmtDur(j.track[j.track.length - 1][2] - j.track[0][2]) : "") +
      " · " + j.entries.length + " note" + (j.entries.length > 1 ? "s" : "");
    var list = j.entries.slice().reverse();
    $("#journalList").innerHTML = list.length ? list.map(function (e) {
      return '<div class="jr-entry">' + (e.photo ? '<img class="jr-photo" data-jr-photo="' + esc(e.id) + '" alt="" hidden>' : "") +
        '<div class="jr-main"><span class="jr-time">' + esc(new Date(e.t).toLocaleString("fr-BE", { weekday: "short", hour: "2-digit", minute: "2-digit" })) + "</span>" +
        (e.txt ? "<p>" + esc(e.txt) + "</p>" : "") + "</div>" +
        '<button class="icon-mini danger" data-jr-del="' + esc(e.id) + '" aria-label="Supprimer cette note"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>';
    }).join("") : '<p class="muted small" style="margin:6px 0 0">Note ce que tu vois, ce qui marche, ce qui ne marche pas. Chaque note garde l\'heure et l\'endroit.</p>';
    $all("#journalList [data-jr-photo]").forEach(function (img) {
      spotPhotoUrl("jr-" + img.getAttribute("data-jr-photo")).then(function (u) { if (u) { img.src = u; img.hidden = false; } });
    });
  }
  $("#btnJournalRec").addEventListener("click", function () {
    var j = getJournal(); j.rec = !j.rec; if (j.rec && !j.t0) j.t0 = Date.now();
    saveJournal(j); renderJournal();
    if (j.rec) { toast(me ? "Trajet enregistré : garde Sylva ouverte, écran allumé" : "En attente du GPS…"); journalOnPos(); }
  });
  var jrBlob = null;
  $("#btnJournalNote").addEventListener("click", function () {
    $("#jrText").value = ""; jrBlob = null; $("#jrPreview").hidden = true; openModal("#modalJournal");
  });
  $("#jrPhoto").addEventListener("change", function (e) {
    var f = e.target.files && e.target.files[0]; e.target.value = ""; if (!f) return;
    resizeImage(f, 900).then(function (b) { jrBlob = b; var pv = $("#jrPreview"); pv.src = URL.createObjectURL(b); pv.hidden = false; }).catch(function () { toast("Photo illisible"); });
  });
  $("#formJournal").addEventListener("submit", function (e) {
    e.preventDefault();
    var txt = $("#jrText").value.trim(); if (!txt && !jrBlob) { closeModal($("#modalJournal")); return; }
    var j = getJournal(), id = uid(), en = { id: id, t: Date.now(), txt: txt, photo: !!jrBlob };
    if (me) { en.lat = me[0]; en.lon = me[1]; }
    j.entries.push(en); saveJournal(j); closeModal($("#modalJournal"));
    var done = function () { renderJournal(); checkBadges(); };
    if (jrBlob) idbDo("readwrite", function (st) { return st.put(jrBlob, "jr-" + id); }).then(done, function () { en.photo = false; saveJournal(j); done(); });
    else done();
  });
  $("#journalList").addEventListener("click", function (e) {
    var b = e.target.closest("[data-jr-del]"); if (!b || !confirm("Supprimer cette note ?")) return;
    var id = b.getAttribute("data-jr-del"), j = getJournal();
    j.entries = j.entries.filter(function (x) { return x.id !== id; }); saveJournal(j);
    idbDo("readwrite", function (st) { return st.delete("jr-" + id); }).catch(function () {});
    renderJournal();
  });
  // Au moment de « Terminer ce bivouac » : le journal part dans l'historique
  function journalToHist(x) {
    var j = getJournal();
    x.track = j.track.map(function (p) { return [p[0], p[1]]; });
    x.km = +trackKm(j.track).toFixed(2);
    x.entries = j.entries;
    var mt = load("sylva_meteo_trip", null) || load("sylva_meteo", null);
    if (mt && mt.data && mt.data.daily) x.tmin = Math.min.apply(null, mt.data.daily.temperature_2m_min.slice(0, 2));
    saveJournal({ rec: false, track: [], entries: [], t0: 0 }); drawTrack();
  }
  function histJournalHtml(x) {
    if (!x || (!(x.track && x.track.length > 1) && !(x.entries && x.entries.length))) return "";
    var h = '<div class="hist-journal"><b>Journal de bord</b> · ' + (x.km ? String(x.km).replace(".", ",") + " km parcourus" : "") +
      (x.tmin != null ? " · nuit à " + Math.round(x.tmin) + " °C" : "") +
      (x.track && x.track.length > 1 ? ' <button type="button" class="link-btn" data-hist-track="' + esc(x.id) + '">Voir le trajet</button>' : "");
    (x.entries || []).forEach(function (e) {
      h += '<div class="jr-entry">' + (e.photo ? '<img class="jr-photo" data-jr-photo="' + esc(e.id) + '" alt="" hidden>' : "") +
        '<div class="jr-main"><span class="jr-time">' + esc(new Date(e.t).toLocaleString("fr-BE", { weekday: "short", hour: "2-digit", minute: "2-digit" })) + "</span>" +
        (e.txt ? "<p>" + esc(e.txt) + "</p>" : "") + "</div></div>";
    });
    return h + "</div>";
  }
  $("#histJournal").addEventListener("click", function (e) {
    var b = e.target.closest("[data-hist-track]"); if (!b || !map) return;
    var x = getHist().filter(function (y) { return y.id === b.getAttribute("data-hist-track"); })[0]; if (!x) return;
    closeModal($("#modalHist")); showView("carte");
    if (histLine) map.removeLayer(histLine);
    histLine = L.polyline(x.track, { color: "#7A5BC7", weight: 4, opacity: .85 }).addTo(map);
    setTimeout(function () { if (histLine.getBounds) map.fitBounds(histLine.getBounds(), { padding: [50, 50] }); }, 150);
    toast("Trajet de « " + (x.lieu || "Bivouac") + " » affiché en violet");
  });


  // =====================================================================
  // ---------- Avant et pendant la sortie : préparer, prévenir, voiture, batterie ----------
  // =====================================================================
  // --- Préparer la sortie : télécharge d'un coup ce qu'il faut autour du lieu ---
  function tileXY(lat, lon, z) {
    var n = Math.pow(2, z), x = Math.floor((lon + 180) / 360 * n);
    var r = lat * Math.PI / 180, y = Math.floor((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2 * n);
    return [x, y];
  }
  function tileUrls(c, km) {
    var out = [], dLat = km / 111, dLon = km / (111 * Math.cos(c[0] * Math.PI / 180));
    var maps = ["ign_be"].concat(BASEMAPS.mt_outdoor ? ["mt_outdoor"] : []);
    maps.forEach(function (id) {
      var b = BASEMAPS[id];
      for (var z = 11; z <= Math.min(16, b.maxNative); z++) {
        var a = tileXY(c[0] + dLat, c[1] - dLon, z), d = tileXY(c[0] - dLat, c[1] + dLon, z);
        for (var x = a[0]; x <= d[0]; x++) for (var y = a[1]; y <= d[1]; y++)
          out.push({ u: b.url.replace("{z}", z).replace("{x}", x).replace("{y}", y).replace("{s}", "a"), cors: !!b.cors });
      }
    });
    return out;
  }
  function prepStep(id, state, txt) {
    var li = $("#prep-" + id); if (!li) return;
    li.className = "prep-" + state; li.querySelector("span").textContent = txt || li.querySelector("span").textContent;
  }
  function analyzeRelief(c) {
    var lats = [c[0]], lons = [c[1]];
    [75, 200].forEach(function (dm) {
      for (var k = 0; k < 8; k++) { var a = k * Math.PI / 4; lats.push(c[0] + dm * Math.cos(a) / 111320); lons.push(c[1] + dm * Math.sin(a) / (111320 * Math.cos(c[0] * Math.PI / 180))); }
    });
    return fetch("https://api.open-meteo.com/v1/elevation?latitude=" + lats.map(function (v) { return v.toFixed(5); }).join(",") + "&longitude=" + lons.map(function (v) { return v.toFixed(5); }).join(","))
      .then(function (r) { if (!r.ok) throw new Error(); return r.json(); })
      .then(function (j) {
        var z = j.elevation; if (!z || z.length < 17) throw new Error();
        var near = z.slice(1, 9), far = z.slice(9, 17), mean = function (a) { return a.reduce(function (s, v) { return s + v; }, 0) / a.length; };
        var res = { c: c, z: z[0], tpi: z[0] - (mean(near) * 0.4 + mean(far) * 0.6), slope: Math.max.apply(null, near.map(function (v) { return Math.abs(v - z[0]); })) / 75 * 100, t: Date.now() };
        save("sylva_relief", res); return res;
      });
  }
  var prepRunning = false;
  function runPrep() {
    var t = getTrip();
    if (t.lat == null) { toast("Choisis d'abord le lieu de la sortie"); $("#btnTrip").click(); return; }
    if (!navigator.onLine) { toast("Il faut du réseau pour préparer la sortie"); return; }
    if (prepRunning) return; prepRunning = true;
    var c = [t.lat, t.lon], urls = tileUrls(c, 2.5);
    $("#prepBox").innerHTML = '<ul class="prep-list">' +
      '<li id="prep-tiles" class="prep-run"><i></i><span>Cartes (' + urls.length + " morceaux, 2,5 km autour)</span></li>" +
      '<li id="prep-meteo" class="prep-wait"><i></i><span>Météo du lieu</span></li>' +
      '<li id="prep-chasse" class="prep-wait"><i></i><span>Chasses annoncées</span></li>' +
      '<li id="prep-poi" class="prep-wait"><i></i><span>Services autour (magasins, santé…)</span></li>' +
      '<li id="prep-relief" class="prep-wait"><i></i><span>Relief : cuvette ou crête</span></li>' +
      '<li id="prep-imgs" class="prep-wait"><i></i><span>Fiches et gravures hors ligne</span></li>' +
      '<li id="prep-gear" class="prep-wait"><i></i><span>Ton matériel face à la nuit</span></li></ul><div class="progress"><span id="prepBar" style="width:0%"></span></div>';
    var done = 0, fail = 0, i = 0, N = 6;
    var bar = function () { $("#prepBar").style.width = Math.round(done / urls.length * 70) + "%"; };
    var tilesDone = new Promise(function (res) {
      if (!urls.length) return res();
      function next() {
        if (i >= urls.length) { if (done + fail >= urls.length) res(); return; }
        var it = urls[i++];
        fetch(it.u, it.cors ? { mode: "cors" } : { mode: "no-cors" }).then(function (r) { if (r.type !== "opaque" && !r.ok) fail++; else done++; }, function () { fail++; })
          .then(function () { bar(); prepStep("tiles", "run", "Cartes : " + (done + fail) + " / " + urls.length); if (done + fail >= urls.length) res(); else next(); });
      }
      for (var k = 0; k < N; k++) next();
    });
    tilesDone.then(function () {
      prepStep("tiles", fail > urls.length / 3 ? "ko" : "ok", "Cartes : " + done + " morceaux gardés hors ligne" + (fail ? " (" + fail + " en échec)" : ""));
      prepStep("meteo", "run"); try { localStorage.removeItem("sylva_meteo_trip"); } catch (e) {}
      loadBivMeteo();
      return new Promise(function (r) { setTimeout(r, 2500); });
    }).then(function () {
      prepStep("meteo", load("sylva_meteo_trip", null) ? "ok" : "ko", load("sylva_meteo_trip", null) ? "Météo du lieu gardée" : "Météo indisponible");
      prepStep("chasse", "run");
      if (!inWallonie(c)) { prepStep("chasse", "ok", "Chasse : hors Wallonie, pas de données"); return; }
      return fetchChasse(c, 3).then(function (f) { save("sylva_chasse_trip2", { key: c[0].toFixed(3) + "," + c[1].toFixed(3), t: Date.now(), f: f }); tripChasse(); prepStep("chasse", "ok", "Chasse : " + f.length + " territoire(s) vérifiés"); })
        .catch(function () { prepStep("chasse", "ko", "Chasse : serveur injoignable, vérifie la carte officielle"); });
    }).then(function () {
      prepStep("poi", "run"); $("#prepBar").style.width = "85%";
      return fetch("https://overpass-api.de/api/interpreter", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: "data=" + encodeURIComponent(poiQuery(c[0].toFixed(5), c[1].toFixed(5))) })
        .then(function (r) { if (!r.ok) throw new Error(); return r.json(); })
        .then(function (d) { save("sylva_poi", { t: Date.now(), c: c, elements: d.elements || [] }); prepStep("poi", "ok", "Services : " + (d.elements || []).length + " lieux gardés"); })
        .catch(function () { prepStep("poi", "ko", "Services indisponibles"); });
    }).then(function () {
      prepStep("relief", "run");
      return analyzeRelief(c).then(function (r) { prepStep("relief", "ok", "Relief : " + (r.tpi <= -4 ? "cuvette" : r.tpi <= -1.5 ? "léger creux" : r.tpi >= 8 ? "crête" : r.tpi >= 3 ? "position haute" : "terrain intermédiaire") + " (" + Math.round(r.z) + " m)"); })
        .catch(function () { prepStep("relief", "ko", "Relief indisponible"); });
    }).then(function () {
      prepStep("imgs", "run");
      if (!window.caches) { prepStep("imgs", "ko", "Cache indisponible sur ce navigateur"); return; }
      var keys = Object.keys(IMGS), miss = [];
      return Promise.all(keys.map(function (k) { return caches.match(IMGS[k]).then(function (r) { if (!r) miss.push(k); }); })).then(function () {
        if (!miss.length) { prepStep("imgs", "ok", "Gravures : " + keys.length + " / " + keys.length + " hors ligne"); return; }
        return Promise.all(miss.map(function (k) { return fetch(IMGS[k]).catch(function () {}); })).then(function () {
          prepStep("imgs", "ok", "Gravures : " + keys.length + " hors ligne (" + miss.length + " ajoutées)");
        });
      });
    }).then(function () {
      if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(function () {});
      if (navigator.storage && navigator.storage.estimate) navigator.storage.estimate().then(function (e) {
        if (e && e.usage) $("#prepBox").insertAdjacentHTML("beforeend", '<p class="tiny muted" style="margin:6px 0 0">Sylva occupe environ ' + Math.round(e.usage / 1048576) + " Mo sur ce téléphone.</p>");
      }).catch(function () {});
      var gc = gearNightCheck();
      prepStep("gear", gc ? (gc.cls === "danger" ? "ko" : "ok") : "ok", gc ? "Nuit à " + gc.t + " °C · " + gc.txt : "Matériel : ajoute ton matelas et ton sac dans « Mon matériel » pour le vérifier");
      $("#prepBar").style.width = "100%"; prepRunning = false;
      save("sylva_prep", { t: Date.now(), c: c });
      $("#prepBox").insertAdjacentHTML("beforeend", '<p class="small" style="margin:10px 0 0"><b>Prêt.</b> Ouvre Sylva une fois en mode avion pour vérifier, et garde ton téléphone chargé.</p>');
      checkBadges();
    });
  }
  function renderPrepState() {
    var p = load("sylva_prep", null), t = getTrip(), box = $("#prepBox"); if (!box || prepRunning) return;
    box.innerHTML = p && t.lat != null && distKm(p.c, [t.lat, t.lon]) < 0.5
      ? '<p class="small muted" style="margin:0">Sortie préparée le ' + new Date(p.t).toLocaleString("fr-BE", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) + ". Refais-le la veille pour une météo fraîche.</p>"
      : '<p class="small muted" style="margin:0">Télécharge d\'un coup, pour le hors ligne : cartes, météo, chasse, services et relief autour du lieu de la sortie.</p>';
  }
  $("#btnPrep").addEventListener("click", runPrep);

  // --- Prévenir un proche ---
  function fmtHeure(v) { return v ? new Date(v).toLocaleString("fr-BE", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }) : ""; }
  function safetyMsg() {
    var t = getTrip(), ret = $("#safeRet").value, alarm = ret ? new Date(new Date(ret).getTime() + 2 * 3600e3) : null;
    var pt = t.lat != null ? [t.lat, t.lon] : me ? [me[0], me[1]] : null;
    var m = "Je pars en bivouac seul" + (t.lieu ? " à " + t.lieu : "") + ".";
    if (pt) m += "\nLieu : " + pt[0].toFixed(5) + ", " + pt[1].toFixed(5) + "\nhttps://maps.google.com/?q=" + pt[0].toFixed(5) + "," + pt[1].toFixed(5);
    if (ret) m += "\nRetour prévu : " + fmtHeure(ret) + ".";
    if (alarm) m += "\nSi tu n'as pas de nouvelles de moi le " + fmtHeure(alarm) + ", appelle le 112, donne-leur ce message et dis que je suis seul.";
    var extra = $("#safeExtra").value.trim(); if (extra) m += "\n" + extra;
    return m;
  }
  function smsHref(num, body) {
    var ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    return "sms:" + encodeURIComponent(num.replace(/\s/g, "")) + (ios ? "&" : "?") + "body=" + encodeURIComponent(body);
  }
  $("#btnSafety").addEventListener("click", function () {
    var s = load("sylva_safety", {}), t = getTrip();
    $("#safeName").value = s.name || ""; $("#safeNum").value = s.num || ""; $("#safeExtra").value = s.extra || "";
    var def = t.date ? t.date + "T16:00" : "";
    $("#safeRet").value = s.ret && (!t.date || s.ret.slice(0, 10) >= t.date) ? s.ret : (t.date ? new Date(new Date(t.date + "T16:00:00").getTime() + 864e5).toISOString().slice(0, 10) + "T16:00" : def);
    $("#safePreview").textContent = safetyMsg(); openModal("#modalSafety");
  });
  ["#safeRet", "#safeExtra"].forEach(function (s) { $(s).addEventListener("input", function () { $("#safePreview").textContent = safetyMsg(); }); });
  function saveSafety() { save("sylva_safety", { name: $("#safeName").value.trim(), num: $("#safeNum").value.trim(), ret: $("#safeRet").value, extra: $("#safeExtra").value.trim() }); }
  $("#btnSafeSms").addEventListener("click", function () {
    saveSafety(); var num = $("#safeNum").value.trim();
    if (!num) { toast("Ajoute le numéro de ton proche"); $("#safeNum").focus(); return; }
    location.href = smsHref(num, safetyMsg());
  });
  $("#btnSafeShare").addEventListener("click", function () {
    saveSafety(); var m = safetyMsg();
    if (navigator.share) navigator.share({ text: m }).catch(function () {});
    else if (navigator.clipboard) navigator.clipboard.writeText(m).then(function () { toast("Message copié"); });
  });
  $("#btnSafeBack").addEventListener("click", function () {
    var s = load("sylva_safety", {}); if (!s.num) { toast("Enregistre d'abord le numéro de ton proche"); return; }
    location.href = smsHref(s.num, "Je suis bien rentré du bivouac. Tout va bien, merci d'avoir veillé !");
  });

  // --- Retour à la voiture ---
  var carMarker = null;
  function drawCar() {
    if (!map || !window.L) return;
    var c = load("sylva_car", null);
    if (carMarker) { map.removeLayer(carMarker); carMarker = null; }
    if (c) carMarker = L.marker([c.lat, c.lon], { icon: pinIcon("#33497A", "🚗"), zIndexOffset: 900 }).bindPopup("<b>Ma voiture</b><br><span style=\"font-size:12px;opacity:.75\">Garée le " + esc(new Date(c.t).toLocaleString("fr-BE", { weekday: "short", hour: "2-digit", minute: "2-digit" })) + "</span>").addTo(map);
  }
  function renderCar() {
    var c = load("sylva_car", null);
    $("#btnCarGo").hidden = !c;
    $("#btnCarSet").textContent = c ? "Déplacer ma voiture ici" : "🚗 Ma voiture est garée ici";
    $("#carInfo").textContent = c ? "Voiture marquée le " + new Date(c.t).toLocaleString("fr-BE", { weekday: "short", hour: "2-digit", minute: "2-digit" }) + (me ? " · à " + fmtKm(distKm([me[0], me[1]], [c.lat, c.lon])) : "") : "Marque l'endroit où tu te gares en arrivant : le retour marche même sans réseau.";
  }
  $("#btnCarSet").addEventListener("click", function () {
    if (!me) { toast("En attente du GPS : active la localisation"); return; }
    if (me[2] > 80) toast("GPS peu précis (" + Math.round(me[2]) + " m) : attends un peu à découvert si possible");
    save("sylva_car", { lat: me[0], lon: me[1], t: Date.now() }); drawCar(); renderCar(); toast("Voiture marquée");
  });
  $("#btnCarGo").addEventListener("click", function () { var c = load("sylva_car", null); if (c) startNav({ lat: c.lat, lon: c.lon, label: "Ma voiture" }); });

  // --- Économie de batterie ---
  function ecoOn() { return !!load("sylva_eco", false); }
  function applyEco() {
    var on = ecoOn();
    document.documentElement.classList.toggle("eco", on);
    if (on) document.documentElement.setAttribute("data-theme", "nuit"); else applyTheme();
    $("#ecoToggle").checked = on;
  }
  $("#ecoToggle").addEventListener("change", function () {
    save("sylva_eco", this.checked); applyEco();
    restartGeo();
    toast(this.checked ? "Économie de batterie : écran sombre, GPS économe" : "Économie de batterie désactivée");
  });
  var lowWarned = false;
  if (navigator.getBattery) navigator.getBattery().then(function (b) {
    var chk = function () {
      var p = Math.round(b.level * 100); $("#batInfo").textContent = "Batterie : " + p + " %" + (b.charging ? " (en charge)" : "");
      if (!b.charging && p <= 20 && !lowWarned) { lowWarned = true; toast("Batterie à " + p + " % : active l'économie et coupe ce qui ne sert pas"); if (!ecoOn()) { save("sylva_eco", true); applyEco(); restartGeo(); } }
    };
    chk(); b.addEventListener("levelchange", chk); b.addEventListener("chargingchange", chk);
  }).catch(function () {});

  // --- Annonces vocales du guidage ---
  var voiceOn = !!load("sylva_voice", true);
  function say(txt) {
    if (!voiceOn || !window.speechSynthesis || !window.SpeechSynthesisUtterance) return;
    try { var u = new SpeechSynthesisUtterance(txt); u.lang = "fr-FR"; u.rate = 1; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch (e) {}
  }
  function renderVoiceBtn() { var b = $("#navVoice"); if (b) { b.textContent = voiceOn ? "🔊" : "🔇"; b.setAttribute("aria-label", voiceOn ? "Couper la voix" : "Activer la voix"); } }
  $("#navVoice").addEventListener("click", function () { voiceOn = !voiceOn; save("sylva_voice", voiceOn); renderVoiceBtn(); if (voiceOn) say("Guidage vocal activé"); else if (window.speechSynthesis) speechSynthesis.cancel(); });
  renderVoiceBtn();


  // =====================================================================
  // ---------- SOS : signal lumineux, sifflet de détresse, infos d'urgence ----------
  // =====================================================================
  // Morse SOS : · · · — — — · · · (unité 250 ms : point 1, trait 3, entre signes 1, entre lettres 3, entre mots 7)
  var SOS_SEQ = (function () {
    var u = 250, out = [], L = function (a) { a.forEach(function (d, i) { out.push([1, d * u]); out.push([0, (i < a.length - 1 ? 1 : 3) * u]); }); };
    L([1, 1, 1]); L([3, 3, 3]); L([1, 1, 1]); out[out.length - 1][1] = 7 * u; return out;
  })();
  var sig = null;
  var actx = null;
  function beep(ms) {
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === "suspended") actx.resume();
      var o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime;
      o.type = "square"; o.frequency.value = 3150;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.9, t + 0.02);
      g.gain.setValueAtTime(0.9, t + ms / 1000 - 0.03); g.gain.exponentialRampToValueAtTime(0.0001, t + ms / 1000);
      o.connect(g); g.connect(actx.destination); o.start(t); o.stop(t + ms / 1000 + 0.02);
    } catch (e) {}
  }
  function stopSignal() {
    if (!sig) return;
    clearTimeout(sig.timer); try { if (sig.wake) sig.wake.release(); } catch (e) {}
    sig = null; $("#sigOverlay").hidden = true; document.body.classList.remove("signaling");
  }
  function startSignal(kind) {
    stopSignal();
    sig = { kind: kind, color: load("sylva_sigcolor", "blanc"), i: 0, sound: kind === "sifflet" };
    $("#sigOverlay").hidden = false; document.body.classList.add("signaling");
    $("#sigOverlay").className = "sig-overlay sig-" + sig.color;
    $("#sigTitle").textContent = kind === "sifflet" ? "Sifflet de détresse" : "Signal SOS lumineux";
    $("#sigHelp").textContent = kind === "sifflet"
      ? "3 coups de sifflet, une pause, en boucle : le signal de détresse. Volume à fond, mode silencieux coupé (bouton sur le côté de l'iPhone)."
      : "SOS en morse (· · · — — — · · ·). Luminosité de l'écran au maximum, écran tourné vers les secours.";
    $("#sigColor").hidden = kind === "sifflet";
    $("#sigSound").textContent = sig.sound ? "🔊 Son activé" : "🔇 Son coupé";
    try { if (navigator.wakeLock) navigator.wakeLock.request("screen").then(function (w) { if (sig) sig.wake = w; else w.release(); }).catch(function () {}); } catch (e) {}
    var seq = kind === "sifflet" ? [[1, 1000], [0, 500], [1, 1000], [0, 500], [1, 1000], [0, 5000]] : SOS_SEQ;
    (function step() {
      if (!sig) return;
      var s = seq[sig.i % seq.length]; sig.i++;
      $("#sigLamp").classList.toggle("on", !!s[0] && kind !== "sifflet");
      $("#sigLamp").classList.toggle("blink", !!s[0] && kind === "sifflet");
      if (s[0] && sig.sound) beep(s[1]);
      sig.timer = setTimeout(step, s[1]);
    })();
  }
  $("#btnSigLight").addEventListener("click", function () { closeModal($("#modalSos")); startSignal("lumiere"); });
  $("#btnSigWhistle").addEventListener("click", function () { closeModal($("#modalSos")); beep(30); startSignal("sifflet"); });
  $("#sigStop").addEventListener("click", stopSignal);
  $("#sigColor").addEventListener("click", function () {
    if (!sig) return; sig.color = sig.color === "blanc" ? "rouge" : "blanc"; save("sylva_sigcolor", sig.color);
    $("#sigOverlay").className = "sig-overlay sig-" + sig.color;
  });
  $("#sigSound").addEventListener("click", function () { if (!sig) return; sig.sound = !sig.sound; if (sig.sound) beep(30); $("#sigSound").textContent = sig.sound ? "🔊 Son activé" : "🔇 Son coupé"; });
  document.addEventListener("visibilitychange", function () {
    if (sig && document.visibilityState === "visible" && navigator.wakeLock) navigator.wakeLock.request("screen").then(function (w) { if (sig) sig.wake = w; }).catch(function () {});
  });

  // --- Mes infos d'urgence (restent sur le téléphone) ---
  var ICE_F = [["nom", "Nom et prénom"], ["naiss", "Date de naissance"], ["sang", "Groupe sanguin"], ["allergies", "Allergies"], ["traitements", "Traitements en cours"],
    ["sante", "Problèmes de santé à connaître"], ["contact", "Personne à prévenir"], ["tel", "Son numéro"], ["notes", "Autres infos"]];
  function getIce() { return load("sylva_ice", {}); }
  function renderIce() {
    var d = getIce(), filled = ICE_F.filter(function (f) { return d[f[0]]; });
    $("#iceView").innerHTML = filled.length ? '<div class="ice-card"><div class="ice-head">INFOS MÉDICALES D\'URGENCE</div>' + filled.map(function (f) {
      var v = esc(d[f[0]]); if (f[0] === "tel") v = '<a href="tel:' + esc(d.tel.replace(/\s/g, "")) + '">' + v + "</a>";
      return '<div class="ice-row"><span>' + esc(f[1]) + "</span><b>" + v + "</b></div>";
    }).join("") + "</div>" : '<p class="muted">Rien d\'enregistré. Remplis tes infos : un secouriste pourra les lire si tu ne peux pas parler.</p>';
    $("#iceForm").innerHTML = ICE_F.map(function (f) {
      return '<label class="field"><span class="field-label">' + esc(f[1]) + "</span>" + (f[0] === "notes" || f[0] === "sante" || f[0] === "traitements"
        ? '<textarea rows="2" data-ice="' + f[0] + '">' + esc(d[f[0]] || "") + "</textarea>" : '<input type="' + (f[0] === "tel" ? "tel" : "text") + '" data-ice="' + f[0] + '" value="' + esc(d[f[0]] || "") + '">') + "</label>";
    }).join("");
  }
  $("#btnIce").addEventListener("click", function () { closeModal($("#modalSos")); renderIce(); $("#iceForm").hidden = true; $("#btnIceEdit").textContent = "Modifier"; openModal("#modalIce"); });
  $("#btnIceEdit").addEventListener("click", function () {
    var f = $("#iceForm");
    if (f.hidden) { f.hidden = false; $("#iceView").hidden = true; this.textContent = "Enregistrer"; return; }
    var d = {}; $all("#iceForm [data-ice]").forEach(function (el) { var v = el.value.trim(); if (v) d[el.dataset.ice] = v; });
    save("sylva_ice", d); f.hidden = true; $("#iceView").hidden = false; this.textContent = "Modifier"; renderIce(); toast("Infos d'urgence enregistrées sur ce téléphone");
  });


  // =====================================================================
  // ---------- Outils photo et visée : clarté de l'eau, ciel et soleil, télémètre ----------
  // =====================================================================
  function imgData(file, max) {
    return new Promise(function (res, rej) {
      var u = URL.createObjectURL(file), im = new Image();
      im.onload = function () {
        var k = Math.min(1, max / Math.max(im.width, im.height)), c = document.createElement("canvas");
        c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
        var x = c.getContext("2d"); x.drawImage(im, 0, 0, c.width, c.height); URL.revokeObjectURL(u);
        res({ c: c, d: x.getImageData(0, 0, c.width, c.height) });
      };
      im.onerror = rej; im.src = u;
    });
  }
  // --- Clarté de l'eau ---
  function renderEau() {
    $("#eauBox").innerHTML = '<div class="alert alert-danger"><strong>Une eau claire peut rendre malade</strong><span>Cet outil mesure seulement la clarté, jamais les microbes. Toute eau trouvée dehors se traite (ébullition 1 minute, filtre ou pastilles).</span></div>' +
      '<p class="muted">Remplis une bouteille transparente. Pose-la devant un fond blanc avec un trait noir (une ligne au stylo sur un papier, ou le texte d\'un emballage), à la lumière du jour, et prends la photo de face, la bouteille au centre.</p>' +
      '<label class="btn btn-primary" style="width:100%"><input type="file" accept="image/*" capture="environment" id="eauPhoto" hidden>📷 Photographier l\'eau</label><div id="eauRes"></div>';
  }
  $("#eauBox").addEventListener("change", function (e) {
    if (e.target.id !== "eauPhoto") return;
    var f = e.target.files && e.target.files[0]; e.target.value = ""; if (!f) return;
    $("#eauRes").innerHTML = '<p class="muted">Analyse…</p>';
    imgData(f, 400).then(function (o) {
      var d = o.d.data, W = o.d.width, H = o.d.height, x0 = Math.floor(W * .3), x1 = Math.ceil(W * .7), y0 = Math.floor(H * .3), y1 = Math.ceil(H * .7);
      var n = 0, sl = 0, sl2 = 0, R = 0, G = 0, B = 0;
      for (var y = y0; y < y1; y++) for (var x = x0; x < x1; x++) {
        var i = (y * W + x) * 4, l = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
        n++; sl += l; sl2 += l * l; R += d[i]; G += d[i + 1]; B += d[i + 2];
      }
      var m = sl / n, sd = Math.sqrt(Math.max(0, sl2 / n - m * m)), contrast = sd / Math.max(20, m);
      R /= n; G /= n; B /= n;
      var brun = ((R + G) / 2 - B) / Math.max(1, (R + G + B) / 3);
      var cls, lvl, txt;
      if (contrast > .28) { cls = "ok"; lvl = "Claire"; txt = "Le trait reste net : pas de préfiltrage nécessaire. Traite-la quand même : ébullition 1 minute, ou filtre puis pastilles."; }
      else if (contrast > .15) { cls = "warn"; lvl = "Un peu trouble"; txt = "Filtre-la dans un tissu propre (t-shirt, chaussette) avant de la traiter. Les pastilles marchent mal dans une eau trouble : l'ébullition est plus sûre."; }
      else if (contrast > .07) { cls = "warn"; lvl = "Trouble"; txt = "Laisse reposer 30 minutes pour que la boue tombe, verse doucement le dessus, filtre au tissu, puis fais bouillir 1 minute. Évite les pastilles seules."; }
      else { cls = "danger"; lvl = "Très trouble"; txt = "Cherche une autre source si possible (plus en amont, source qui sort du sol). Sinon : décanter, filtrer plusieurs fois, puis bouillir. Méfie-toi d'une eau près des champs ou de la route."; }
      var tint = brun > .25 ? "Couleur brune ou thé : souvent des tanins de tourbière ou de feuilles. Pas dangereux en soi, mais elle se traite comme les autres." : brun > .12 ? "Légère teinte jaune : tanins probables." : "";
      $("#eauRes").innerHTML = '<div class="eau-thumb"></div><div class="alert alert-' + cls + '"><strong>' + lvl + " · netteté " + Math.round(Math.min(1, contrast / .4) * 100) + " %</strong><span>" + txt + (tint ? "<br>" + tint : "") + "</span></div>" +
        '<div class="row"><button type="button" class="btn" data-qtech="eau">Rendre l\'eau potable</button><button type="button" class="btn" data-qtech="filtre">Filtres de fortune</button></div>' +
        '<p class="tiny muted">Estimation à partir de la photo : la lumière et le fond changent le résultat. Une odeur chimique, une mousse ou une couleur verte vive : n\'en bois pas, même traitée.</p>';
      o.c.className = "eau-img"; $("#eauRes .eau-thumb").appendChild(o.c);
    }).catch(function () { $("#eauRes").innerHTML = '<p class="muted">Photo illisible, réessaie.</p>'; });
  });
  $("#eauBox").addEventListener("click", function (e) { var t = e.target.closest("[data-qtech]"); if (t && TECHS.some(function (x) { return x.id === t.dataset.qtech; })) openTechnique(t.dataset.qtech); });

  // --- Ciel et soleil : ouverture de la canopée + course du soleil ---
  function sunPos(date, lat, lon) {
    var rad = Math.PI / 180, d = date / 864e5 - 10957.5; // jours depuis J2000
    var g = (357.529 + 0.98560028 * d) * rad, q = 280.459 + 0.98564736 * d;
    var L = (q + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)) * rad, e = (23.439 - 0.00000036 * d) * rad;
    var ra = Math.atan2(Math.cos(e) * Math.sin(L), Math.cos(L)), dec = Math.asin(Math.sin(e) * Math.sin(L));
    var gmst = (18.697374558 + 24.06570982441908 * d) % 24, ha = ((gmst * 15 + lon) * rad) - ra;
    var la = lat * rad, alt = Math.asin(Math.sin(la) * Math.sin(dec) + Math.cos(la) * Math.cos(dec) * Math.cos(ha));
    return alt / rad;
  }
  function sunDay(lat, lon, day) {
    var t0 = new Date(day + "T00:00:00").getTime(), up = 0, good = 0, maxA = -90, rise = null, set = null;
    for (var m = 0; m < 1440; m += 10) {
      var a = sunPos(t0 + m * 6e4, lat, lon);
      if (a > 0) { up += 10; if (rise == null) rise = m; set = m; } if (a > 15) good += 10; if (a > maxA) maxA = a;
    }
    return { up: up, good: good, maxA: maxA, rise: rise, set: set };
  }
  function hm(m) { return Math.floor(m / 60) + " h " + String(m % 60).padStart(2, "0"); }
  function renderCiel() {
    $("#cielBox").innerHTML = '<p class="muted">Allonge-toi ou tiens le téléphone à plat, écran vers le sol, caméra vers le ciel, là où tu veux dormir. Prends la photo bien à la verticale.</p>' +
      '<label class="btn btn-primary" style="width:100%"><input type="file" accept="image/*" capture="environment" id="cielPhoto" hidden>📷 Photographier le ciel</label><div id="cielRes"></div>';
  }
  $("#cielBox").addEventListener("change", function (e) {
    if (e.target.id !== "cielPhoto") return;
    var f = e.target.files && e.target.files[0]; e.target.value = ""; if (!f) return;
    $("#cielRes").innerHTML = '<p class="muted">Analyse…</p>';
    imgData(f, 360).then(function (o) {
      var d = o.d.data, N = d.length / 4, hist = new Array(256).fill(0), bl = new Uint8Array(N);
      for (var i = 0; i < N; i++) { var b = d[i * 4 + 2]; bl[i] = b; hist[b]++; }
      // Seuil d'Otsu sur le canal bleu (méthode des photos hémisphériques)
      var sum = 0; for (var k = 0; k < 256; k++) sum += k * hist[k];
      var sB = 0, wB = 0, best = 0, th = 128;
      for (k = 0; k < 256; k++) { wB += hist[k]; if (!wB) continue; var wF = N - wB; if (!wF) break; sB += k * hist[k]; var mB = sB / wB, mF = (sum - sB) / wF, v = wB * wF * (mB - mF) * (mB - mF); if (v > best) { best = v; th = k; } }
      var sky = 0, out = o.c.getContext("2d").createImageData(o.d.width, o.d.height);
      for (i = 0; i < N; i++) { var s = bl[i] > th; if (s) sky++; out.data[i * 4] = s ? 140 : 30; out.data[i * 4 + 1] = s ? 200 : 60; out.data[i * 4 + 2] = s ? 255 : 30; out.data[i * 4 + 3] = 255; }
      if (best < 200) sky = bl.reduce(function (a, v) { return a + (v > 150 ? 1 : 0); }, 0); // image presque uniforme
      var pct = Math.round(sky / N * 100);
      o.c.getContext("2d").putImageData(out, 0, 0); o.c.className = "eau-img";
      var t = getTrip(), pt = t.lat != null ? [t.lat, t.lon] : me ? [me[0], me[1]] : [50.5, 5], day = t.date || ymd(new Date()), sd = sunDay(pt[0], pt[1], day);
      var real = Math.round(sd.good * pct / 100), cls = pct < 20 ? "info" : pct < 55 ? "ok" : "warn";
      var msg = pct < 20 ? "Couvert fermé : nuit plus douce et moins de rosée sous les arbres, mais le bois et tes affaires sècheront mal, et un panneau solaire ne servira à rien."
        : pct < 55 ? "Ouverture moyenne : un bon compromis. Un peu de soleil pour sécher, et les arbres limitent la rosée et le froid de la nuit."
        : "Ciel très ouvert : bon pour sécher et charger au solaire, mais plus de rosée, de givre et de froid la nuit (le sol perd sa chaleur vers le ciel). Prévois une bâche bien tendue.";
      $("#cielRes").innerHTML = '<div class="eau-thumb"></div><div class="rv-score"><div><span>Ciel visible</span><b>' + pct + ' %</b></div><div><span>Soleil utile (au-dessus de 15°)</span><b>' + hm(real) + "</b></div></div>" +
        '<div class="alert alert-' + cls + '"><span>' + msg + "</span></div>" +
        '<p class="small">Le ' + esc(new Date(day + "T12:00:00").toLocaleDateString("fr-BE", { weekday: "long", day: "numeric", month: "long" })) + " : soleil levé environ " + hm(sd.up) + ", au plus haut à " + Math.round(sd.maxA) + "° au-dessus de l'horizon" +
        (sd.maxA < 25 ? " (soleil bas : les arbres au sud cachent l'essentiel)" : "") + ".</p>" +
        '<div class="alert alert-warn"><strong>Regarde aussi au-dessus de toi</strong><span>Pas de branche morte, ni d\'arbre mort ou penché au-dessus de l\'abri : c\'est l\'un des premiers dangers en forêt, surtout avec du vent.</span></div>' +
        '<p class="tiny muted">Estimation : les nuages blancs et les reflets faussent un peu le calcul. En bleu, ce que Sylva a compté comme ciel.</p>';
      $("#cielRes .eau-thumb").appendChild(o.c);
    }).catch(function () { $("#cielRes").innerHTML = '<p class="muted">Photo illisible, réessaie.</p>'; });
  });

  // --- Télémètre par visée (clinomètre) ---
  var tele = { top: null, base: null, pitch: null, on: false, stream: null };
  function onTelePitch(e) { if (e.beta != null) { tele.pitch = e.beta - 90; var el = $("#tlAngle"); if (el) el.textContent = (tele.pitch >= 0 ? "+" : "") + tele.pitch.toFixed(1).replace(".", ",") + "°"; } }
  function renderTele() {
    var m = load("sylva_telemode", "distance");
    $("#teleBox").innerHTML = '<div class="seg-row"><button type="button" class="chip' + (m === "distance" ? " on" : "") + '" data-tlmode="distance">Distance d\'un objet connu</button><button type="button" class="chip' + (m === "hauteur" ? " on" : "") + '" data-tlmode="hauteur">Hauteur d\'un arbre</button></div>' +
      '<label class="rv-row"><span>' + (m === "distance" ? "Hauteur réelle de l'objet" : "Distance jusqu'au pied (compte tes pas × 0,75)") + '</span><span><input type="text" inputmode="decimal" id="tlKnown" value="' + esc(String(load(m === "distance" ? "sylva_tlh" : "sylva_tld", m === "distance" ? 1.8 : 20)).replace(".", ",")) + '"> m</span></label>' +
      (m === "distance" ? '<p class="tiny muted" style="margin:-4px 0 8px">Repères : une personne 1,75 m ; une porte 2 m ; une voiture 1,5 m ; un étage 3 m ; un poteau électrique 9 m.</p>' : "") +
      '<div class="tl-view"><video id="tlVid" playsinline muted autoplay></video><div class="tl-cross"></div><div class="tl-angle" id="tlAngle">–</div></div>' +
      '<p class="small muted">Tiens le téléphone droit devant toi, à hauteur des yeux, et vise avec la croix.</p>' +
      '<div class="row"><button type="button" class="btn" id="tlTop">Viser le sommet</button><button type="button" class="btn" id="tlBase">Viser la base</button></div><div id="tlRes"></div>';
    tele.top = tele.base = null;
    startTeleSensors();
  }
  function startTeleSensors() {
    var go = function () { if (!tele.on) { tele.on = true; window.addEventListener("deviceorientation", onTelePitch); } };
    if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === "function") DeviceOrientationEvent.requestPermission().then(go).catch(go); else go();
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia && !tele.stream) navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false }).then(function (s) {
      tele.stream = s; var v = $("#tlVid"); if (v) { v.srcObject = s; v.play().catch(function () {}); }
    }).catch(function () { var v = $("#tlVid"); if (v) v.parentNode.classList.add("no-cam"); });
    else if (tele.stream) { var v = $("#tlVid"); if (v) { v.srcObject = tele.stream; v.play().catch(function () {}); } }
  }
  function stopTele() { if (tele.stream) { tele.stream.getTracks().forEach(function (t) { t.stop(); }); tele.stream = null; } }
  function teleCalc() {
    if (tele.top == null || tele.base == null) return;
    var m = load("sylva_telemode", "distance"), k = parseFloat(String($("#tlKnown").value).replace(",", ".")) || 0, rad = Math.PI / 180;
    var dt = Math.tan(tele.top * rad) - Math.tan(tele.base * rad), r;
    if (dt <= 0.002 || k <= 0) { $("#tlRes").innerHTML = '<div class="alert alert-warn"><span>Visée trop serrée ou valeur manquante : recommence en visant bien le haut puis le bas.</span></div>'; return; }
    if (m === "distance") { r = k / dt; save("sylva_tlh", k); $("#tlRes").innerHTML = '<div class="rv-score"><div><span>Distance</span><b>' + (r < 1000 ? Math.round(r) + " m" : (r / 1000).toFixed(1).replace(".", ",") + " km") + "</b></div><div><span>Angle visé</span><b>" + (tele.top - tele.base).toFixed(1).replace(".", ",") + "°</b></div></div>" +
      '<p class="small">Précision de l\'ordre de 10 à 20 % à quelques dizaines de mètres, moins bonne au-delà ou sous 2° d\'angle visé : prends un repère plus grand ou rapproche-toi.</p>'; }
    else { r = k * dt; save("sylva_tld", k); $("#tlRes").innerHTML = '<div class="rv-score"><div><span>Hauteur</span><b>' + r.toFixed(r < 10 ? 1 : 0).replace(".", ",") + ' m</b></div><div><span>Chute possible jusqu\'à</span><b>' + Math.round(r * 1.2) + " m</b></div></div>" +
      '<p class="small">Un arbre peut tomber à une distance égale à sa hauteur, plus les branches : garde au moins ' + Math.round(r * 1.2) + " m entre ton abri et un arbre mort ou penché.</p>"; }
    $("#tlRes").insertAdjacentHTML("beforeend", '<p class="tiny muted">Visée ' + tele.top.toFixed(1).replace(".", ",") + "° / " + tele.base.toFixed(1).replace(".", ",") + "°. Plus l'objet est loin et petit, moins c'est précis.</p>");
  }
  $("#teleBox").addEventListener("click", function (e) {
    var md = e.target.closest("[data-tlmode]"); if (md) { save("sylva_telemode", md.dataset.tlmode); renderTele(); return; }
    if (e.target.id === "tlTop" || e.target.id === "tlBase") {
      if (tele.pitch == null) { toast("Capteurs de mouvement indisponibles : autorise-les"); startTeleSensors(); return; }
      if (e.target.id === "tlTop") tele.top = tele.pitch; else tele.base = tele.pitch;
      e.target.textContent = (e.target.id === "tlTop" ? "Sommet " : "Base ") + (tele.pitch >= 0 ? "+" : "") + tele.pitch.toFixed(1).replace(".", ",") + "° ✓";
      if (navigator.vibrate) navigator.vibrate(20);
      teleCalc();
    }
  });
  $("#teleBox").addEventListener("input", function (e) { if (e.target.id === "tlKnown") teleCalc(); });

  // --- Export GPX et KML (ATAK, iTAK, Garmin, OsmAnd…) ---
  function xmlEsc(s) { return String(s == null ? "" : s).replace(/[<>&"']/g, function (c) { return { "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" }[c]; }); }
  function exportPoints() {
    var pts = getSpots().map(function (s) { var ty = SPOT_TYPES[s.type] || SPOT_TYPES.autre; return { lat: s.lat, lon: s.lon, name: ty[2] + (s.note ? " : " + s.note.slice(0, 60) : ""), desc: s.note || "", t: s.date }; });
    var t = getTrip(); if (t.lat != null) pts.push({ lat: t.lat, lon: t.lon, name: "Bivouac : " + (t.lieu || ""), desc: "Lieu de la sortie " + (t.date || "") });
    var car = load("sylva_car", null); if (car) pts.push({ lat: car.lat, lon: car.lon, name: "Ma voiture", desc: "", t: car.t });
    return pts;
  }
  function downloadFile(name, mime, text) {
    var blob = new Blob([text], { type: mime }), file;
    try { file = new File([blob], name, { type: mime }); } catch (e) {}
    if (file && navigator.canShare && navigator.canShare({ files: [file] })) { navigator.share({ files: [file], title: name }).catch(function () {}); return; }
    var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 2000);
  }
  function buildGpx() {
    var pts = exportPoints(), tr = getJournal().track;
    var x = '<?xml version="1.0" encoding="UTF-8"?>\n<gpx version="1.1" creator="Sylva" xmlns="http://www.topografix.com/GPX/1/1">\n';
    pts.forEach(function (p) { x += '<wpt lat="' + p.lat.toFixed(6) + '" lon="' + p.lon.toFixed(6) + '"><name>' + xmlEsc(p.name) + "</name>" + (p.desc ? "<desc>" + xmlEsc(p.desc) + "</desc>" : "") + (p.t ? "<time>" + new Date(p.t).toISOString() + "</time>" : "") + "</wpt>\n"; });
    if (tr.length > 1) x += "<trk><name>Trajet Sylva</name><trkseg>\n" + tr.map(function (p) { return '<trkpt lat="' + p[0] + '" lon="' + p[1] + '">' + (p[2] ? "<time>" + new Date(p[2]).toISOString() + "</time>" : "") + "</trkpt>"; }).join("\n") + "\n</trkseg></trk>\n";
    return { x: x + "</gpx>\n", n: pts.length, tr: tr.length };
  }
  function buildKml() {
    var pts = exportPoints(), tr = getJournal().track;
    var x = '<?xml version="1.0" encoding="UTF-8"?>\n<kml xmlns="http://www.opengis.net/kml/2.2"><Document><name>Sylva</name>\n';
    pts.forEach(function (p) { x += "<Placemark><name>" + xmlEsc(p.name) + "</name>" + (p.desc ? "<description>" + xmlEsc(p.desc) + "</description>" : "") + "<Point><coordinates>" + p.lon.toFixed(6) + "," + p.lat.toFixed(6) + ",0</coordinates></Point></Placemark>\n"; });
    if (tr.length > 1) x += "<Placemark><name>Trajet Sylva</name><LineString><coordinates>" + tr.map(function (p) { return p[1] + "," + p[0] + ",0"; }).join(" ") + "</coordinates></LineString></Placemark>\n";
    return { x: x + "</Document></kml>\n", n: pts.length, tr: tr.length };
  }
  $("#btnExportGpx").addEventListener("click", function () { var g = buildGpx(); if (!g.n && g.tr < 2) { toast("Rien à exporter"); return; } downloadFile("sylva-" + ymd(new Date()) + ".gpx", "application/gpx+xml", g.x); });
  $("#btnExportKml").addEventListener("click", function () { var g = buildKml(); if (!g.n && g.tr < 2) { toast("Rien à exporter"); return; } downloadFile("sylva-" + ymd(new Date()) + ".kml", "application/vnd.google-earth.kml+xml", g.x); });


  // Bouton ± : le pavé numérique de l'iPhone n'a pas de touche « - »
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-pm]"); if (!b) return;
    var inp = document.getElementById(b.dataset.pm); if (!inp) return;
    var v = String(inp.value).trim();
    inp.value = v.charAt(0) === "-" ? v.slice(1) : "-" + v;
    inp.dispatchEvent(new Event("input", { bubbles: true })); inp.dispatchEvent(new Event("change", { bubbles: true }));
    if (v === "" || v === "-") inp.focus();
  });
  // =====================================================================
  // ---------- Mon matériel : inventaire, catalogue, poids du sac ----------
  // =====================================================================
  var GEAR_CATS = { matelas: "Matelas", sac: "Sac de couchage", abri: "Abri, tente, bâche", rechaud: "Réchaud", cuisine: "Cuisine", vetement: "Vêtement", autre: "Autre" };
  var GCAT = window.SYLVA_GEAR_CAT || [];
  function getGear() { var g = load("sylva_gear", []); return Array.isArray(g) ? g : []; }
  function saveGear(g) { save("sylva_gear", g); syncGearChecklist(); }
  function fmtG(g) { return g >= 1000 ? (g / 1000).toFixed(2).replace(".", ",") + " kg" : Math.round(g) + " g"; }
  function gearSub(x) {
    var p = [GEAR_CATS[x.cat] || "Autre"];
    if (x.poids) p.push(fmtG(+x.poids));
    if (x.r) p.push("R " + String(x.r).replace(".", ","));
    if (x.comf !== "" && x.comf != null) p.push("confort " + x.comf + " °C");
    if (x.lim !== "" && x.lim != null) p.push("limite " + x.lim + " °C");
    return p.join(" · ");
  }
  // Le matériel « à emporter » forme un groupe du sac à dos
  function syncGearChecklist() {
    var cl = getChecklist(), g = getGear().filter(function (x) { return x.take; });
    var grp = cl.filter(function (x) { return x.src === "gear"; })[0];
    if (!g.length) { if (grp) { saveChecklist(cl.filter(function (x) { return x.src !== "gear"; })); } return; }
    if (!grp) { grp = { id: uid(), src: "gear", titre: "Mon matériel", items: [] }; cl.unshift(grp); }
    var old = {}; grp.items.forEach(function (it) { old[it.gid] = it; });
    grp.items = g.map(function (x) { var o = old[x.id]; return { id: o ? o.id : uid(), gid: x.id, label: x.nom + (x.poids ? " (" + fmtG(+x.poids) + ")" : ""), done: o ? o.done : false, photo: false }; });
    saveChecklist(cl);
  }
  function renderGear() {
    var g = getGear(), tk = g.filter(function (x) { return x.take; }), w = tk.reduce(function (a, x) { return a + (+x.poids || 0); }, 0);
    var miss = tk.filter(function (x) { return !x.poids; }).length;
    $("#gearStats").innerHTML = g.length ? "<b>" + fmtG(w) + "</b> à emporter · " + tk.length + " / " + g.length + " objets" + (miss ? ' <span class="muted">(' + miss + " sans poids)</span>" : "") : "";
    var order = Object.keys(GEAR_CATS);
    var sorted = g.slice().sort(function (a, b) { return order.indexOf(a.cat) - order.indexOf(b.cat) || (+b.poids || 0) - (+a.poids || 0); });
    $("#gearList").innerHTML = sorted.length ? sorted.map(function (x) {
      return '<div class="gear-row"><label class="gear-take" aria-label="À emporter"><input type="checkbox" data-gtake="' + esc(x.id) + '"' + (x.take ? " checked" : "") + '></label>' +
        '<button type="button" class="gear-main" data-gedit="' + esc(x.id) + '"><b>' + esc(x.nom) + "</b><span>" + esc(gearSub(x)) + "</span></button></div>";
    }).join("") : '<p class="muted small" style="margin:0">Ajoute ton matos : Sylva calcule le poids du sac, utilise ton matelas et ton sac de couchage dans le calcul de valeur R, et les compare à la météo de la sortie.</p>';
    if (g.length) {
      var heavy = tk.filter(function (x) { return +x.poids; }).sort(function (a, b) { return b.poids - a.poids; }).slice(0, 3);
      if (heavy.length && w) $("#gearList").insertAdjacentHTML("beforeend", '<p class="tiny muted" style="margin:8px 0 0">Le plus lourd : ' + heavy.map(function (x) { return esc(x.nom) + " (" + Math.round(x.poids / w * 100) + " %)"; }).join(", ") + ".</p>");
    }
  }
  var gearEdit = null;
  function gearFormFill(x) {
    $("#gCat").value = x.cat || "autre"; $("#gNom").value = x.nom || ""; $("#gPoids").value = x.poids || "";
    $("#gR").value = x.r != null && x.r !== "" ? String(x.r).replace(".", ",") : ""; $("#gComf").value = x.comf != null ? x.comf : ""; $("#gLim").value = x.lim != null ? x.lim : "";
    $("#gSrc").innerHTML = x.src ? 'Valeurs : <a href="' + esc(x.src) + '" target="_blank" rel="noopener">source</a>' + (x.note ? " · " + esc(x.note) : "") : "";
    gearFields();
  }
  function gearFields() {
    var c = $("#gCat").value;
    $("#gRWrap").hidden = c !== "matelas"; $("#gBagWrap").hidden = c !== "sac";
  }
  function openGear(id) {
    var x = id ? getGear().filter(function (y) { return y.id === id; })[0] : null;
    gearEdit = x ? x.id : null;
    $("#gearTitle").textContent = x ? "Modifier" : "Ajouter du matériel";
    $("#btnGearDel").hidden = !x; $("#gSugg").innerHTML = ""; $("#gSearch").value = "";
    gearFormFill(x || { cat: "matelas", take: true });
    $("#gSearchWrap").hidden = !!x;
    if (!x) gearBrowse();
    openModal("#modalGear");
  }
  $("#btnAddGear").addEventListener("click", function () { openGear(null); });
  $("#gCat").addEventListener("change", function () { gearFields(); if (!gearEdit && !$("#gSearch").value.trim()) gearBrowse(); });
  function gearItemBtn(p) { return '<button type="button" class="place-item" data-gpick="' + GCAT.indexOf(p) + '"><b>' + esc(p.nom) + "</b><span>" + esc(gearSub(p)) + "</span></button>"; }
  function gearOnline(q, n) {
    return '<div class="gear-online"><span class="tiny muted">' + (n ? "Pas dans la liste ?" : "Pas dans le catalogue de Sylva.") + "</span>" +
      (q ? ' <a class="btn" target="_blank" rel="noopener" href="https://www.google.com/search?q=' + encodeURIComponent(q + " fiche technique poids") + '">Chercher en ligne</a>' : "") +
      ' <button type="button" class="btn" data-gmanual>Saisir à la main</button></div>';
  }
  // Sans recherche : catalogue de la catégorie choisie
  function gearBrowse() {
    var c = $("#gCat").value, list = GCAT.filter(function (p) { return p.cat === c; });
    var chips = Object.keys(GEAR_CATS).map(function (k) { var n = GCAT.filter(function (p) { return p.cat === k; }).length; return n ? '<button type="button" class="chip' + (k === c ? " on" : "") + '" data-gcatpick="' + k + '">' + esc(GEAR_CATS[k]) + " (" + n + ")</button>" : ""; }).join("");
    $("#gSugg").innerHTML = '<div class="chips gear-chips">' + chips + "</div>" + (list.length ? '<div class="gear-scroll">' + list.map(gearItemBtn).join("") + "</div>" : '<p class="tiny muted">Rien dans le catalogue pour cette catégorie : tape la marque et le modèle, ou saisis à la main.</p>') + gearOnline("", list.length);
  }
  $("#gSearch").addEventListener("input", function () {
    var q = norm(this.value.trim()); if (q.length < 2) { gearBrowse(); return; }
    var words = q.split(/\s+/);
    var hits = GCAT.filter(function (p) { var n = norm(p.nom + " " + (GEAR_CATS[p.cat] || "")); return words.every(function (w) { return n.indexOf(w) !== -1; }); });
    $("#gSugg").innerHTML = (hits.length ? '<div class="gear-scroll">' + hits.map(gearItemBtn).join("") + "</div>" : "") + gearOnline(this.value.trim(), hits.length);
  });
  $("#gSugg").addEventListener("click", function (e) {
    var cp = e.target.closest("[data-gcatpick]");
    if (cp) { $("#gCat").value = cp.dataset.gcatpick; gearFields(); gearBrowse(); return; }
    var b = e.target.closest("[data-gpick]");
    if (b) { var p = GCAT[+b.dataset.gpick]; gearFormFill(p); $("#gSugg").innerHTML = ""; $("#gSearch").value = p.nom; return; }
    if (e.target.closest("[data-gmanual]")) { $("#gNom").value = $("#gSearch").value.trim(); $("#gSugg").innerHTML = ""; $("#gNom").focus(); }
  });
  function numOrEmpty(v) { v = String(v).replace(",", ".").trim(); return v === "" || isNaN(+v) ? "" : +v; }
  $("#formGear").addEventListener("submit", function (e) {
    e.preventDefault();
    var nom = $("#gNom").value.trim(); if (!nom) { toast("Donne un nom (marque et modèle)"); $("#gNom").focus(); return; }
    var g = getGear(), x = gearEdit ? g.filter(function (y) { return y.id === gearEdit; })[0] : null;
    if (!x) { x = { id: uid(), take: true }; g.push(x); }
    x.cat = $("#gCat").value; x.nom = nom; x.poids = numOrEmpty($("#gPoids").value);
    x.r = x.cat === "matelas" ? numOrEmpty($("#gR").value) : ""; x.comf = x.cat === "sac" ? numOrEmpty($("#gComf").value) : ""; x.lim = x.cat === "sac" ? numOrEmpty($("#gLim").value) : "";
    var srcA = $("#gSrc a"); x.src = srcA ? srcA.getAttribute("href") : (x.src || "");
    saveGear(g); closeModal($("#modalGear")); renderGear(); renderChecklist(); toast("Matériel enregistré");
  });
  $("#btnGearDel").addEventListener("click", function () {
    if (!gearEdit || !confirm("Supprimer cet objet de ton matériel ?")) return;
    saveGear(getGear().filter(function (y) { return y.id !== gearEdit; })); closeModal($("#modalGear")); renderGear(); renderChecklist();
  });
  $("#gearList").addEventListener("click", function (e) { var b = e.target.closest("[data-gedit]"); if (b) openGear(b.dataset.gedit); });
  $("#gearList").addEventListener("change", function (e) {
    var c = e.target.closest("[data-gtake]"); if (!c) return;
    var g = getGear(); g.forEach(function (x) { if (x.id === c.dataset.gtake) x.take = c.checked; }); saveGear(g); renderGear(); renderChecklist();
  });
  // Matériel face à la nuit prévue (affiché dans Préparer la sortie et le calculateur)
  function gearNightCheck() {
    var g = getGear().filter(function (x) { return x.take; }), n = nightTemp();
    var pads = g.filter(function (x) { return x.cat === "matelas" && x.r; }), bags = g.filter(function (x) { return x.cat === "sac"; });
    if (!pads.length && !bags.length) return null;
    if (!n.src) return { cls: "ok", t: "?", txt: "pas de météo pour vérifier ton matelas et ton sac." };
    var R = pads.reduce(function (a, x) { return a + +x.r; }, 0), need = rNeed(n.t), out = [], worst = "ok";
    if (pads.length) { var ok = R >= need; out.push("Matelas : R " + R.toFixed(1).replace(".", ",") + " pour R " + need.toFixed(1).replace(".", ",") + " conseillé" + (ok ? "" : " : ajoute une couche")); if (!ok) worst = R >= need - 1 ? "warn" : "danger"; }
    if (bags.length) {
      var b = bags.slice().sort(function (a, c) { return (a.lim === "" ? 99 : a.lim) - (c.lim === "" ? 99 : c.lim); })[0];
      if (b.comf !== "" && n.t >= b.comf) out.push("Sac : confort " + b.comf + " °C, bon pour " + n.t + " °C");
      else if (b.lim !== "" && n.t >= b.lim) { out.push("Sac : entre confort et limite, dors avec bonnet et une couche sèche"); if (worst === "ok") worst = "warn"; }
      else if (b.lim !== "") { out.push("Sac : limite " + b.lim + " °C, trop juste pour " + n.t + " °C (risque d'hypothermie)"); worst = "danger"; }
    }
    return { cls: worst, txt: out.join(". ") + ".", t: n.t };
  }

  // =====================================================================
  // ---------- Quiz de survie ----------
  // =====================================================================
  var QZ_LV = { novice: ["Novice", 5], apprenti: ["Apprenti", 10], maitre: ["Maître trappeur", 15] };
  var qz = null;
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var k = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[k]; a[k] = t; } return a; }
  function pick(a, n) { return shuffle(a).slice(0, n); }
  var VERD = { ok: "Comestible", caution: "Comestible avec précautions", danger: "Toxique ou mortel" };
  function qEspece() {
    var s = pick(ESPECES.filter(function (e) { return VERD[e.niveau] && e.cat !== "animal" && e.cat !== "poisson"; }), 1)[0]; if (!s) return null;
    return { q: "« " + s.nom + " » (" + s.latin + ") : que faut-il savoir ?", opts: shuffle([VERD.ok, VERD.caution, VERD.danger]), ok: VERD[s.niveau],
      why: s.statut + (s.resume ? ". " + s.resume : ""), esp: s.id };
  }
  function ficheOpts(t) {
    var same = TECHS.filter(function (x) { return x.cat === t.cat && x.id !== t.id; });
    var other = TECHS.filter(function (x) { return x.cat !== t.cat; });
    var d = pick(same, 3); if (d.length < 3) d = d.concat(pick(other, 3 - d.length));
    return shuffle([t.titre].concat(d.map(function (x) { return x.titre; })));
  }
  function qImage() {
    var t = pick(TECHS.filter(function (x) { return IMGS[x.id] && x.cat !== "Nœuds"; }), 1)[0]; if (!t) return null;
    return { img: IMGS[t.id], q: "Quelle fiche illustre cette gravure ?", opts: ficheOpts(t), ok: t.titre, why: t.intro, tech: t.id };
  }
  function qIntro() {
    var t = pick(TECHS.filter(function (x) { return x.intro && x.intro.length > 40; }), 1)[0]; if (!t) return null;
    var txt = t.intro.length > 220 ? t.intro.slice(0, 217) + "…" : t.intro;
    return { q: "De quelle fiche vient ce passage ?\n« " + txt + " »", opts: ficheOpts(t), ok: t.titre, why: "Fiche « " + t.titre + " » (" + t.cat + ").", tech: t.id };
  }
  function qSosie() {
    var s = pick(ESPECES.filter(function (e) { return e.sosies && e.sosies.some(function (x) { return x.niveau === "danger"; }); }), 1)[0]; if (!s) return null;
    var so = s.sosies.filter(function (x) { return x.niveau === "danger"; })[0];
    var wrong = pick(ESPECES.filter(function (e) { return e.id !== s.id && e.niveau !== "danger" && e.cat === s.cat; }), 3).map(function (e) { return e.nom; });
    if (wrong.length < 3) return null;
    return { q: "Quel sosie dangereux peut se confondre avec « " + s.nom + " » ?", opts: shuffle([so.nom].concat(wrong)), ok: so.nom, why: so.diff || "", esp: s.id };
  }
  function qAlerte() {
    var t = pick(TECHS.filter(function (x) { return x.alerte && x.alerte.length; }), 1)[0]; if (!t) return null;
    var others = TECHS.filter(function (x) { return x.alerte && x.alerte.length && x.id !== t.id; });
    var wrong = pick(others, 3).map(function (x) { return x.titre; }); if (wrong.length < 3) return null;
    return { q: "Seul et sans secours, ce signe doit te faire sortir au plus vite :\n« " + t.alerte[0] + " »\nÀ quelle fiche correspond-il ?", opts: shuffle([t.titre].concat(wrong)), ok: t.titre, why: "Les signes d'alerte sont en haut de la fiche « " + t.titre + " ».", tech: t.id };
  }
  function buildQuiz(lv) {
    var gens = lv === "novice" ? [qImage, qEspece] : lv === "apprenti" ? [qImage, qEspece, qIntro, qAlerte] : [qEspece, qIntro, qSosie, qAlerte, qSosie];
    var n = QZ_LV[lv][1], out = [], seen = {}, guard = 0;
    while (out.length < n && guard++ < 200) {
      var q = gens[out.length % gens.length]();
      if (q && !seen[q.q + q.ok]) { seen[q.q + q.ok] = 1; out.push(q); }
    }
    return out;
  }
  function getQuizStats() { return load("sylva_quiz", {}); }
  function renderQuizHome() {
    var st = getQuizStats();
    $("#quizBox").innerHTML = '<p class="muted">Teste ce que tu sais avant de partir. Les questions viennent des fiches et des espèces de Sylva, et changent à chaque partie.</p>' +
      '<div class="list">' + Object.keys(QZ_LV).map(function (k, i) {
        var best = st[k] != null ? " · meilleur score " + st[k] + " %" : "";
        return '<button class="item" data-quiz-lv="' + k + '"><span class="quiz-lv quiz-lv' + (i + 1) + '">' + (i + 1) + '</span><span class="item-main"><span class="item-name">Niveau ' + (i + 1) + " · " + QZ_LV[k][0] + '</span><span class="item-sub">' +
          QZ_LV[k][1] + " questions" + esc(best) + "</span></span></button>";
      }).join("") + "</div>";
  }
  function renderQuizQ() {
    var q = qz.qs[qz.i];
    $("#quizBox").innerHTML = '<div class="quiz-top"><span>Question ' + (qz.i + 1) + " / " + qz.qs.length + "</span><span>Score " + qz.score + '</span></div><div class="progress"><span style="width:' + Math.round(qz.i / qz.qs.length * 100) + '%"></span></div>' +
      (q.img ? '<figure class="engr quiz-img"><img src="' + q.img + '" alt=""></figure>' : "") +
      '<p class="quiz-q">' + esc(q.q).replace(/\n/g, "<br>") + '</p><div class="quiz-opts">' +
      q.opts.map(function (o, i) { return '<button type="button" class="quiz-opt" data-qopt="' + i + '">' + esc(o) + "</button>"; }).join("") + '</div><div id="quizFeedback"></div>';
  }
  $("#quizBox").addEventListener("click", function (e) {
    var lv = e.target.closest("[data-quiz-lv]");
    if (lv) { qz = { lv: lv.dataset.quizLv, qs: buildQuiz(lv.dataset.quizLv), i: 0, score: 0, done: false }; renderQuizQ(); return; }
    var o = e.target.closest("[data-qopt]");
    if (o && qz && !qz.done) {
      qz.done = true;
      var q = qz.qs[qz.i], val = q.opts[+o.dataset.qopt], good = val === q.ok;
      if (good) qz.score++;
      $all("#quizBox .quiz-opt").forEach(function (b) { b.disabled = true; var v = q.opts[+b.dataset.qopt]; if (v === q.ok) b.classList.add("good"); else if (b === o) b.classList.add("bad"); });
      $("#quizFeedback").innerHTML = '<div class="alert ' + (good ? "alert-ok" : "alert-warn") + '"><strong>' + (good ? "Bien vu !" : "Raté : " + esc(q.ok)) + "</strong><span>" + esc(q.why || "") + "</span></div>" +
        '<div class="row">' + (q.tech ? '<button type="button" class="btn" data-qtech="' + esc(q.tech) + '">Voir la fiche</button>' : q.esp ? '<button type="button" class="btn" data-qesp="' + esc(q.esp) + '">Voir l\'espèce</button>' : "") +
        '<button type="button" class="btn btn-primary" data-qnext>' + (qz.i + 1 < qz.qs.length ? "Question suivante" : "Voir mon score") + "</button></div>";
      return;
    }
    var t = e.target.closest("[data-qtech]"); if (t) { openTechnique(t.dataset.qtech); return; }
    var sp = e.target.closest("[data-qesp]"); if (sp) { openEspece(sp.dataset.qesp); return; }
    if (e.target.closest("[data-qnext]")) {
      qz.i++; qz.done = false;
      if (qz.i < qz.qs.length) { renderQuizQ(); $("#view-apprendre").scrollTop = 0; return; }
      var pct = Math.round(qz.score / qz.qs.length * 100), st = getQuizStats();
      if (st[qz.lv] == null || pct > st[qz.lv]) st[qz.lv] = pct;
      st.parties = (st.parties || 0) + 1; save("sylva_quiz", st);
      $("#quizBox").innerHTML = '<div class="quiz-end"><b>' + qz.score + " / " + qz.qs.length + "</b><span>" + pct + " % · niveau " + esc(QZ_LV[qz.lv][0]) + "</span><p>" +
        (pct === 100 ? "Parfait. Tu es prêt pour le terrain." : pct >= 80 ? "Très bien. Relis les fiches ratées et tu y es." : pct >= 50 ? "Pas mal. Revois les fiches avant de partir." : "Il reste du travail : les fiches sont là pour ça.") +
        '</p></div><div class="row"><button type="button" class="btn" data-quiz-home>Changer de niveau</button><button type="button" class="btn btn-primary" data-quiz-lv="' + qz.lv + '">Rejouer</button></div>';
      checkBadges();
      return;
    }
    if (e.target.closest("[data-quiz-home]")) renderQuizHome();
  });

  // =====================================================================
  // ---------- Défis et badges ----------
  // =====================================================================
  function readSet() { return load("sylva_read", []); }
  function markRead(id) { var r = readSet(); if (r.indexOf(id) === -1) { r.push(id); save("sylva_read", r); checkBadges(); } }
  var DEFIS = [
    ["feu_sans", "Allumer un feu sans briquet ni allumettes", "feu"], ["abri_bache", "Monter un abri en bâche en moins de 10 minutes", "bache_montages"],
    ["eau_pure", "Rendre potable de l'eau trouvée dehors", ""], ["nuit_seul", "Passer une nuit seul en bivouac", ""],
    ["recette_feu", "Cuisiner une recette du feu sur place", ""], ["orient", "Retrouver son chemin avec carte et boussole, sans téléphone", ""],
    ["noeuds5", "Faire 5 nœuds les yeux fermés", ""], ["zero_trace", "Repartir sans laisser aucune trace", ""]
  ];
  function badgeStats() {
    var hs = getHist(), r = readSet(), q = getQuizStats(), d = load("sylva_defis", {});
    var km = hs.reduce(function (a, x) { return a + (x.km || 0); }, 0) + trackKm(getJournal().track);
    var knots = r.filter(function (id) { var t = TECHS.filter(function (x) { return x.id === id; })[0]; return t && t.cat === "Nœuds"; }).length;
    var recettes = hs.reduce(function (a, x) { return a + (x.plan || []).filter(function (p) { return /^rj_/.test(p.id); }).length; }, 0) + getPlan().filter(function (id) { return /^rj_/.test(id); }).length;
    return { spots: getSpots().length, biv: hs.length, froid: hs.some(function (x) { return x.tmin != null && x.tmin <= 0; }), read: r.length, knots: knots, km: km,
      recettes: recettes, q: q, defis: Object.keys(d).filter(function (k) { return d[k]; }).length,
      notes: hs.reduce(function (a, x) { return a + (x.entries || []).length; }, 0) + getJournal().entries.length };
  }
  var BADGES = [
    ["spot1", "🗺️", "Premier repère", "Placer un spot sur la carte", function (s) { return s.spots >= 1; }],
    ["spot10", "📍", "Cartographe", "Placer 10 spots", function (s) { return s.spots >= 10; }],
    ["biv1", "⛺", "Première nuit", "Terminer un bivouac", function (s) { return s.biv >= 1; }],
    ["biv5", "🏕️", "Vétéran", "Terminer 5 bivouacs", function (s) { return s.biv >= 5; }],
    ["froid", "❄️", "Nuit sous zéro", "Terminer un bivouac où il a gelé", function (s) { return s.froid; }],
    ["km10", "🥾", "Marcheur", "Enregistrer 10 km de trajet", function (s) { return s.km >= 10; }],
    ["km50", "🧭", "Explorateur", "Enregistrer 50 km de trajet", function (s) { return s.km >= 50; }],
    ["notes", "📓", "Carnet de bord", "Écrire 10 notes de journal", function (s) { return s.notes >= 10; }],
    ["read25", "📖", "Studieux", "Lire 25 fiches", function (s) { return s.read >= 25; }],
    ["read100", "📚", "Encyclopédie", "Lire 100 fiches", function (s) { return s.read >= 100; }],
    ["knots", "🪢", "Matelot", "Étudier 10 fiches de nœuds", function (s) { return s.knots >= 10; }],
    ["chef", "🍲", "Chef du feu", "Prévoir 5 recettes du feu", function (s) { return s.recettes >= 5; }],
    ["qz1", "🥉", "Novice confirmé", "80 % au quiz Novice", function (s) { return (s.q.novice || 0) >= 80; }],
    ["qz2", "🥈", "Apprenti confirmé", "80 % au quiz Apprenti", function (s) { return (s.q.apprenti || 0) >= 80; }],
    ["qz3", "🥇", "Maître trappeur", "80 % au quiz Maître trappeur", function (s) { return (s.q.maitre || 0) >= 80; }],
    ["defis4", "🔥", "Débrouillard", "Réussir 4 défis de terrain", function (s) { return s.defis >= 4; }],
    ["defis8", "🏆", "Survivant", "Réussir les 8 défis de terrain", function (s) { return s.defis >= 8; }]
  ];
  function checkBadges() {
    var s = badgeStats(), seen = load("sylva_badges", []), fresh = [];
    BADGES.forEach(function (b) { if (b[4](s) && seen.indexOf(b[0]) === -1) { seen.push(b[0]); fresh.push(b); } });
    if (fresh.length) { save("sylva_badges", seen); toast(fresh[0][1] + " Badge débloqué : " + fresh[0][2] + (fresh.length > 1 ? " (+" + (fresh.length - 1) + ")" : "")); }
    if ($("#panelBadges") && !$("#panelBadges").hidden) renderBadges();
  }
  function renderBadges() {
    var s = badgeStats(), d = load("sylva_defis", {}), n = 0;
    var h = '<div class="badge-grid">' + BADGES.map(function (b) {
      var on = b[4](s); if (on) n++;
      return '<div class="badge-tile' + (on ? " on" : "") + '"><span class="bt-ico">' + b[1] + "</span><b>" + esc(b[2]) + "</b><span>" + esc(b[3]) + "</span></div>";
    }).join("") + "</div>";
    h = '<p class="muted">' + n + " badge" + (n > 1 ? "s" : "") + " sur " + BADGES.length + " · " + s.read + " fiches lues · " + s.km.toFixed(1).replace(".", ",") + " km enregistrés</p>" + h;
    h += '<div class="sec-head"><h2>Défis de terrain</h2><span class="muted small">à cocher toi-même</span></div><div class="card">' + DEFIS.map(function (x) {
      return '<label class="check' + (d[x[0]] ? " done" : "") + '"><input type="checkbox" data-defi="' + x[0] + '"' + (d[x[0]] ? " checked" : "") + "><span>" + esc(x[1]) + "</span></label>";
    }).join("") + "</div>";
    $("#badgeBox").innerHTML = h;
  }
  $("#badgeBox").addEventListener("change", function (e) {
    var c = e.target.closest("[data-defi]"); if (!c) return;
    var d = load("sylva_defis", {}); d[c.dataset.defi] = c.checked; save("sylva_defis", d); renderBadges(); checkBadges();
  });

  // =====================================================================
  // ---------- Alertes de saison (accueil) ----------
  // =====================================================================
  var SAISON = [
    [[3, 4, 5, 6, 7, 8, 9, 10], "Tiques actives", "Pantalon dans les chaussettes, et inspection complète le soir. Retire une tique au tire-tique, sans l'écraser.", "tech:ps_tique", "warn"],
    [[8, 9, 10, 11], "Champignons mortels de saison", "L'amanite phalloïde pousse en ce moment. Ne mange jamais un champignon sauvage sans certitude absolue.", "esp:phalloide", "danger"],
    [[10, 11, 12, 1], "Chasse en battue", "Respecte les panneaux « Chasse » à l'entrée des bois : l'accès est interdit ce jour-là. Porte une couleur vive. Les dates annoncées sont sur la carte (couche « Chasse »).", "url:" + CHASSE_OFFICIEL, "danger"],
    [[9, 10], "Brame du cerf", "Les cerfs sont agités la nuit, surtout en Ardenne. Garde tes distances, ne campe pas sur les places de brame.", "", "info"],
    [[3, 4, 5], "Ail des ours et sosies", "Le muguet et la colchique, mortels, poussent au même endroit. Froisse la feuille : l'ail des ours sent l'ail, pas les autres.", "esp:aildesours", "warn"],
    [[4, 5, 6, 7, 8, 9], "Vipères au soleil", "Regarde où tu poses les mains et les pieds sur les rochers ensoleillés. Morsure : reste calme et immobile.", "tech:ps_morsure", "warn"],
    [[6, 7, 8], "Chaleur et orages", "Bois plus que tu n'as soif. En cas d'orage, quitte les crêtes et les arbres isolés.", "tech:chaleur", "warn"],
    [[7, 8, 9], "Guêpes et frelons", "Ne laisse pas de sucré ouvert au camp. Une piqûre dans la bouche ou la gorge est une urgence.", "tech:ps_piqure", "info"],
    [[11, 12, 1, 2, 3], "Nuits froides", "Le gel arrive vite la nuit. Couche-toi au sec et au chaud, et garde une tenue sèche pour dormir.", "tech:froid", "warn"],
    [[9, 10, 11], "Nuit qui tombe tôt", "Il fait sombre en forêt bien avant le coucher du soleil. Monte le camp avec au moins une heure de jour.", "tech:doigts_soleil", "info"]
  ];
  function renderSeasonAlerts() {
    var box = $("#homeSeasonAlerts"); if (!box) return;
    var m = new Date().getMonth() + 1;
    var list = SAISON.filter(function (a) { return a[0].indexOf(m) !== -1; }).slice(0, 4);
    box.innerHTML = list.length ? '<div class="sec-head"><h2>En ce moment</h2><span class="muted small">alertes de saison</span></div>' + list.map(function (a) {
      if (/^url:/.test(a[3])) return '<a class="season-alert sa-' + a[4] + '" href="' + esc(a[3].slice(4)) + '" target="_blank" rel="noopener"><b>' + esc(a[1]) + "</b><span>" + esc(a[2]) + "</span><i>Carte officielle des chasses ›</i></a>";
      var link = a[3] ? a[3].split(":") : null;
      var ok = link && (link[0] === "tech" ? TECHS.some(function (t) { return t.id === link[1]; }) : ESPECES.some(function (s) { return s.id === link[1]; }));
      return '<button type="button" class="season-alert sa-' + a[4] + '"' + (ok ? " data-sa-" + link[0] + '="' + esc(link[1]) + '"' : "") + "><b>" + esc(a[1]) + "</b><span>" + esc(a[2]) + "</span>" + (ok ? '<i>Voir la fiche ›</i>' : "") + "</button>";
    }).join("") : "";
  }
  $("#homeSeasonAlerts").addEventListener("click", function (e) {
    var t = e.target.closest("[data-sa-tech]"); if (t) { openTechnique(t.getAttribute("data-sa-tech")); return; }
    var s = e.target.closest("[data-sa-esp]"); if (s) openEspece(s.getAttribute("data-sa-esp"));
  });
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-learn-x]"); if (!b) return;
    var w = b.getAttribute("data-learn-x");
    if (b.closest("#view-accueil")) showView("apprendre");
    learnShow(w);
    if (w === "quiz") renderQuizHome(); else if (w === "badges") renderBadges(); else if (w === "pouls") renderPouls(); else if (w === "niveau") renderNiveau(); else if (w === "rvalue") renderRv(); else if (w === "eau") renderEau(); else if (w === "ciel") renderCiel(); else if (w === "tele") renderTele();
  });

  // =====================================================================
  // ---------- Pouls : minuteur guidé (fiable) + caméra (expérimental) ----------
  // =====================================================================
  var pl = null; // { t0, taps, timer }
  function poulsVerdict(bpm) {
    if (bpm < 40) return ["danger", "Très lent", "Sous 40 au repos, surtout avec froid, somnolence ou confusion : hypothermie ou état grave possible. Réchauffe, isole du sol, et fais tout pour te faire secourir."];
    if (bpm < 50) return ["warn", "Lent", "Normal chez un sportif reposé. Avec froid, frissons qui s'arrêtent ou confusion : pense à l'hypothermie."];
    if (bpm <= 100) return ["ok", "Normal", "Entre 50 et 100 au repos, c'est normal pour un adulte."];
    if (bpm <= 120) return ["warn", "Rapide", "Normal juste après un effort ou un stress. Reprends ta mesure après 5 minutes de repos assis."];
    return ["danger", "Très rapide", "Au-dessus de 120 au repos, avec pâleur, sueurs froides ou malaise : état de choc possible. Allonge-toi, jambes surélevées, couvre-toi."];
  }
  function poulsHist() { return load("sylva_pouls", []); }
  function renderPouls() {
    var hs = poulsHist().slice(-6).reverse();
    $("#poulsBox").innerHTML =
      '<p class="muted">Pose deux doigts (pas le pouce) sur le côté du cou, sous la mâchoire, ou à l\'intérieur du poignet côté pouce. Reste assis, au calme.</p>' +
      '<div class="pouls-zone"><div class="pouls-count" id="plCount">30 s</div><div class="pouls-bpm" id="plBpm">Touche « Démarrer », puis le gros bouton à chaque battement</div></div>' +
      '<button type="button" class="pouls-tap" id="plTap" disabled>♥</button>' +
      '<div class="row"><button type="button" class="btn btn-primary" id="plStart">Démarrer (30 s)</button><button type="button" class="btn" id="plCam">Caméra (expérimental)</button></div>' +
      '<div id="plResult"></div><div id="plCamBox"></div>' +
      (hs.length ? '<div class="sec-head"><h2>Mesures précédentes</h2></div><div class="card">' + hs.map(function (x) {
        var v = poulsVerdict(x.bpm); return '<div class="pl-hist"><b>' + x.bpm + ' bpm</b><span class="pl-tag pl-' + v[0] + '">' + v[1] + "</span><span>" + esc(new Date(x.t).toLocaleString("fr-BE", { weekday: "short", hour: "2-digit", minute: "2-digit" })) + (x.cam ? " · caméra" : "") + "</span></div>";
      }).join("") + "</div>" : "") +
      '<p class="tiny muted">Repère, pas un diagnostic médical. Note l\'heure et répète la mesure toutes les 15 à 30 minutes pour suivre un blessé.</p>';
  }
  function poulsResult(bpm, cam) {
    bpm = Math.round(bpm);
    var v = poulsVerdict(bpm), hs = poulsHist(); hs.push({ t: Date.now(), bpm: bpm, cam: !!cam }); save("sylva_pouls", hs.slice(-50));
    $("#plResult").innerHTML = '<div class="alert alert-' + (v[0] === "ok" ? "ok" : v[0]) + '"><strong>' + bpm + " battements par minute · " + v[1] + "</strong><span>" + v[2] + "</span></div>" +
      (v[0] !== "ok" ? '<div class="row"><button type="button" class="btn" data-qtech="froid">Hypothermie</button><button type="button" class="btn" data-qtech="ps_choc">État de choc</button></div>' : "");
  }
  $("#poulsBox").addEventListener("click", function (e) {
    var q = e.target.closest("[data-qtech]"); if (q) { openTechnique(q.dataset.qtech); return; }
    if (e.target.id === "plStart") {
      if (pl && pl.timer) clearInterval(pl.timer);
      pl = { t0: Date.now(), taps: [] }; $("#plTap").disabled = false; $("#plResult").innerHTML = ""; $("#plStart").textContent = "Recommencer";
      pl.timer = setInterval(function () {
        var left = 30 - Math.floor((Date.now() - pl.t0) / 1000);
        $("#plCount").textContent = Math.max(0, left) + " s";
        if (left <= 0) {
          clearInterval(pl.timer); pl.timer = null; $("#plTap").disabled = true;
          var n = pl.taps.length;
          if (n < 5) { $("#plResult").innerHTML = '<div class="alert alert-warn"><strong>Trop peu de battements comptés</strong><span>Cherche bien le pouls avant de démarrer, puis tape à chaque battement.</span></div>'; return; }
          var span = (pl.taps[n - 1] - pl.taps[0]) / 1000;
          poulsResult(span > 10 ? (n - 1) / span * 60 : n * 2);
        }
      }, 200);
      return;
    }
    if (e.target.closest("#plTap") && pl && pl.timer) {
      pl.taps.push(Date.now()); $("#plBpm").textContent = pl.taps.length + " battement" + (pl.taps.length > 1 ? "s" : "");
      if (navigator.vibrate) navigator.vibrate(15);
      return;
    }
    if (e.target.id === "plCam") camPouls();
    if (e.target.id === "plCamStop") stopCam();
  });
  var cam = null;
  function stopCam() {
    if (!cam) return;
    cam.stop = true; try { cam.stream.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {}
    cam = null;
  }
  function camPouls() {
    stopCam();
    var box = $("#plCamBox");
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { box.innerHTML = '<p class="muted">Caméra indisponible sur cet appareil.</p>'; return; }
    box.innerHTML = '<div class="alert alert-warn"><strong>Mode expérimental</strong><span>Couvre entièrement la caméra arrière du bout de l\'index, sans appuyer fort, dans un endroit éclairé. Ne bouge plus pendant 20 secondes. Peu fiable avec des doigts froids : préfère le comptage au doigt.</span></div>' +
      '<canvas id="plGraph" width="600" height="120" class="pl-graph"></canvas><p id="plCamTxt" class="muted">Démarrage de la caméra…</p><button type="button" class="btn" id="plCamStop">Arrêter</button><video id="plVid" playsinline muted hidden></video>';
    navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" }, width: { ideal: 160 }, height: { ideal: 120 }, frameRate: { ideal: 30 } }, audio: false }).then(function (stream) {
      cam = { stream: stream, vals: [], ts: [], t0: performance.now(), stop: false };
      var track = stream.getVideoTracks()[0];
      try { track.applyConstraints({ advanced: [{ torch: true }] }).catch(function () {}); } catch (e) {}
      var v = $("#plVid"); v.srcObject = stream; v.play().catch(function () {});
      var c = document.createElement("canvas"); c.width = 40; c.height = 30; var cx = c.getContext("2d", { willReadFrequently: true });
      var g = $("#plGraph").getContext("2d");
      (function loop() {
        if (!cam || cam.stop) return;
        if (v.readyState >= 2) {
          cx.drawImage(v, 0, 0, 40, 30);
          var d = cx.getImageData(0, 0, 40, 30).data, r = 0, gg = 0;
          for (var i = 0; i < d.length; i += 4) { r += d[i]; gg += d[i + 1]; }
          r /= d.length / 4; gg /= d.length / 4;
          var now = performance.now();
          cam.vals.push(r); cam.ts.push(now);
          var covered = r > 60 && r > gg * 1.6;
          var el = (now - cam.t0) / 1000;
          $("#plCamTxt").textContent = covered ? "Mesure… " + Math.max(0, Math.ceil(20 - el)) + " s" : "Doigt mal placé : couvre toute la caméra (l'image doit être rouge).";
          if (!covered) { cam.vals = []; cam.ts = []; cam.t0 = now; }
          drawSig(g, cam.vals.slice(-150));
          if (covered && el >= 20) { var bpm = camBpm(cam.vals, cam.ts); stopCam(); $("#plCamBox").innerHTML = bpm ? "" : '<p class="muted">Signal trop faible : réessaie avec plus de lumière, ou compte au doigt.</p>'; if (bpm) poulsResult(bpm, true); return; }
        }
        requestAnimationFrame(loop);
      })();
    }).catch(function () { box.innerHTML = '<p class="muted">Accès à la caméra refusé. Autorise-le dans Réglages > Safari > Caméra, ou utilise le comptage au doigt.</p>'; });
  }
  function drawSig(g, vals) {
    var W = 600, H = 120; g.clearRect(0, 0, W, H); if (vals.length < 3) return;
    var mn = Math.min.apply(null, vals), mx = Math.max.apply(null, vals) || 1, rg = mx - mn || 1;
    g.strokeStyle = "#C9472E"; g.lineWidth = 3; g.beginPath();
    vals.forEach(function (v, i) { var x = i / 149 * W, y = H - 8 - (v - mn) / rg * (H - 16); if (i) g.lineTo(x, y); else g.moveTo(x, y); }); g.stroke();
  }
  // Signal rouge -> lissage, retrait de la tendance, comptage des pics espacés de 0,33 s minimum (180 bpm max)
  function camBpm(vals, ts) {
    if (vals.length < 60) return 0;
    var sm = vals.map(function (v, i) { var a = 0, n = 0; for (var k = i - 2; k <= i + 2; k++) if (vals[k] != null) { a += vals[k]; n++; } return a / n; });
    var dt = sm.map(function (v, i) { var a = 0, n = 0; for (var k = i - 15; k <= i + 15; k++) if (sm[k] != null) { a += sm[k]; n++; } return v - a / n; });
    var sd = Math.sqrt(dt.reduce(function (a, v) { return a + v * v; }, 0) / dt.length); if (sd < 0.05) return 0;
    var peaks = [];
    for (var i = 2; i < dt.length - 2; i++) {
      if (dt[i] > sd * 0.4 && dt[i] >= dt[i - 1] && dt[i] >= dt[i + 1] && dt[i] >= dt[i - 2] && dt[i] >= dt[i + 2]) {
        if (!peaks.length || ts[i] - ts[peaks[peaks.length - 1]] > 330) peaks.push(i);
      }
    }
    if (peaks.length < 6) return 0;
    var iv = []; for (var p = 1; p < peaks.length; p++) iv.push(ts[peaks[p]] - ts[peaks[p - 1]]);
    iv.sort(function (a, b) { return a - b; }); var med = iv[Math.floor(iv.length / 2)];
    var bpm = 60000 / med; return bpm >= 35 && bpm <= 190 ? bpm : 0;
  }

  // =====================================================================
  // ---------- Niveau à bulle + relief du spot (cuvette / crête) ----------
  // =====================================================================
  var lvOn = false;
  function onTilt(e) {
    if (e.beta == null || !$("#lvBubble")) return;
    var b = e.beta * Math.PI / 180, gm = e.gamma * Math.PI / 180;
    var tilt = Math.acos(Math.max(-1, Math.min(1, Math.cos(b) * Math.cos(gm)))) * 180 / Math.PI;
    var bx = Math.max(-1, Math.min(1, e.gamma / 15)), by = Math.max(-1, Math.min(1, e.beta / 15));
    $("#lvBubble").style.transform = "translate(" + (-bx * 70) + "px," + (-by * 70) + "px)";
    $("#lvDeg").textContent = tilt.toFixed(1).replace(".", ",") + "°";
    var dir = Math.abs(e.beta) > Math.abs(e.gamma) ? (e.beta > 0 ? "le haut du téléphone" : "le bas du téléphone") : (e.gamma > 0 ? "la droite" : "la gauche");
    var v = tilt < 2 ? ["ok", "Plat : parfait pour dormir."] : tilt < 6 ? ["ok", "Légère pente : bon. Dors la tête du côté le plus haut, pieds vers la descente."]
      : tilt < 10 ? ["warn", "Pente marquée : tu vas glisser la nuit. Cherche plus plat, ou cale le matelas."] : ["danger", "Trop pentu pour dormir. L'eau de pluie coulera aussi vers toi."];
    $("#lvVerdict").className = "alert alert-" + v[0]; $("#lvVerdict").innerHTML = "<span>" + v[1] + "</span>";
    $("#lvLow").textContent = tilt >= 2 ? "Le sol descend vers " + dir + "." : "";
  }
  function startLevel() {
    var go = function () { if (!lvOn) { lvOn = true; window.addEventListener("deviceorientation", onTilt); } };
    if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === "function")
      DeviceOrientationEvent.requestPermission().then(function (r) { go(); if (r !== "granted") toast("Autorise les capteurs de mouvement pour le niveau"); }).catch(function () { go(); });
    else go();
  }
  function reliefPoint() {
    var t = getTrip();
    if (t.lat != null) return { c: [t.lat, t.lon], label: t.lieu || "lieu du bivouac" };
    if (me) return { c: [me[0], me[1]], label: "ta position" };
    if (map) { var m = map.getCenter(); return { c: [m.lat, m.lng], label: "centre de la carte" }; }
    return null;
  }
  function renderNiveau() {
    var rp = reliefPoint(), cached = load("sylva_relief", null);
    $("#niveauBox").innerHTML =
      '<p class="muted">Pose le téléphone à plat sur le sol, là où tu veux dormir.</p>' +
      '<div class="lv-ring"><div class="lv-cross"></div><div class="lv-bubble" id="lvBubble"></div></div>' +
      '<div class="lv-deg" id="lvDeg">–</div><p class="center small" id="lvLow"></p><div id="lvVerdict" class="alert"><span>Touche « Activer le niveau ».</span></div>' +
      '<button type="button" class="btn btn-primary" id="lvStart">Activer le niveau</button>' +
      '<div class="sec-head"><h2>Cuvette ou crête ?</h2></div>' +
      '<div class="card"><p class="small" style="margin-top:0">Sylva compare l\'altitude du point avec 16 points autour (à 75 et 200 m). Point analysé : <b>' + esc(rp ? rp.label : "aucun") + "</b>.</p>" +
      '<button type="button" class="btn" id="rlGo"' + (rp ? "" : " disabled") + '>Analyser le relief</button><div id="rlRes"></div></div>';
    if (cached && rp && distKm(cached.c, rp.c) < 0.05) showRelief(cached);
  }
  function showRelief(r) {
    var tpi = r.tpi, slope = r.slope, cls, t, x;
    if (tpi <= -4) { cls = "danger"; t = "Cuvette"; x = "Ton point est " + Math.abs(tpi).toFixed(0) + " m plus bas que les alentours. L'eau de pluie et l'air froid s'y accumulent la nuit : monte un peu sur une pente douce ou un replat."; }
    else if (tpi <= -1.5) { cls = "warn"; t = "Léger creux"; x = "Un peu plus bas que les alentours : vérifie qu'aucune rigole ne passe sous l'abri, et creuse un petit fossé côté pente si la pluie est annoncée."; }
    else if (tpi >= 8) { cls = "danger"; t = "Crête ou sommet"; x = "Ton point domine les alentours de " + tpi.toFixed(0) + " m : très exposé au vent et à la foudre. Descends un peu sous la crête, côté abrité du vent."; }
    else if (tpi >= 3) { cls = "warn"; t = "Position haute"; x = "Un peu exposée au vent : oriente l'entrée de l'abri dos au vent et tends bien la bâche."; }
    else { cls = "ok"; t = "Terrain intermédiaire"; x = "Ni creux ni crête : une bonne position pour bivouaquer."; }
    if (slope > 15) { x += " Attention, la pente autour est forte (environ " + Math.round(slope) + " %)."; if (cls === "ok") cls = "warn"; }
    $("#rlRes").innerHTML = '<div class="alert alert-' + cls + '" style="margin-top:10px"><strong>' + t + " · altitude " + Math.round(r.z) + " m</strong><span>" + x + '</span></div><p class="tiny muted">Modèle d\'altitude à environ 90 m de précision (Open-Meteo / Copernicus) : vérifie toujours le terrain sur place.</p>';
  }
  $("#niveauBox").addEventListener("click", function (e) {
    if (e.target.id === "lvStart") { startLevel(); e.target.textContent = "Niveau actif"; }
    if (e.target.id === "rlGo") {
      var rp = reliefPoint(); if (!rp) return;
      if (!navigator.onLine) { $("#rlRes").innerHTML = '<p class="muted">Pas de réseau : fais l\'analyse avant de partir (elle reste en mémoire pour ce lieu).</p>'; return; }
      $("#rlRes").innerHTML = '<p class="muted">Analyse…</p>';
      analyzeRelief(rp.c).then(showRelief).catch(function () { $("#rlRes").innerHTML = '<p class="muted">Service d\'altitude indisponible, réessaie.</p>'; });
    }
  });


  // =====================================================================
  // ---------- Calculateur de valeur R (isolation du sol + sac de couchage) ----------
  // =====================================================================
  var RPADS = [
    ["ccf_fin", "Mousse fermée fine (8 à 10 mm)", 2.0], ["ccf_ep", "Mousse fermée épaisse (15 à 20 mm)", 2.6],
    ["auto25", "Autogonflant 2,5 cm", 3.0], ["auto5", "Autogonflant 5 cm", 4.5],
    ["air_nu", "Gonflable sans isolant", 1.0], ["air_3s", "Gonflable isolé 3 saisons", 4.0], ["air_hiver", "Gonflable hiver", 6.5],
    ["feuilles", "Lit de feuilles ou fougères sèches (30 cm) · estimation", 1.5], ["sac_dos", "Sac à dos et corde sous les jambes · estimation", 0.5],
    ["perso", "Mon matelas (valeur R inscrite dessus)", null]
  ];
  function rNeed(t) { return t >= 10 ? 2 : t >= 5 ? 3 : t >= 0 ? 3.8 : t >= -5 ? 4.5 : t >= -10 ? 5.5 : 6.5; }
  function nightTemp() {
    var mt = load("sylva_meteo_trip", null), src = "la météo de ta sortie";
    if (!(mt && mt.data && mt.data.daily)) { mt = load("sylva_meteo", null); src = "la météo d'ici"; }
    if (mt && mt.data && mt.data.daily && mt.data.daily.temperature_2m_min) return { t: Math.round(mt.data.daily.temperature_2m_min[0]), src: src };
    return { t: 5, src: "" };
  }
  function getRv() {
    var d = load("sylva_rvalue", null);
    if (!d) { var n = nightTemp(); d = { pads: [{ k: "ccf_fin", r: 2 }], frileux: false, mouille: false, t: n.t, auto: true, comf: "", lim: "" }; }
    if (d.auto) d.t = nightTemp().t;
    return d;
  }
  function renderRv() {
    var d = getRv(), n = nightTemp();
    var myPads = getGear().filter(function (x) { return x.cat === "matelas" && x.r; });
    var opts = function (sel) { return myPads.map(function (x) { return '<option value="gear:' + esc(x.id) + '"' + ("gear:" + x.id === sel ? " selected" : "") + ">★ " + esc(x.nom) + " · R " + String(x.r).replace(".", ",") + "</option>"; }).join("") + RPADS.map(function (p) { return '<option value="' + p[0] + '"' + (p[0] === sel ? " selected" : "") + ">" + esc(p[1]) + (p[2] != null ? " · R " + String(p[2]).replace(".", ",") : "") + "</option>"; }).join(""); };
    var h = '<p class="muted">Ajoute tout ce que tu mets entre toi et le sol. Les valeurs R s\'additionnent. <button type="button" class="link-btn" data-qtech="isolation_sol">Comprendre la valeur R</button></p>';
    h += '<div class="card"><div class="rv-k">Sous toi</div>' + d.pads.map(function (p, i) {
      var preset = RPADS.filter(function (x) { return x[0] === p.k; })[0] || (String(p.k).indexOf("gear:") === 0 ? [p.k, "", 0] : null);
      return '<div class="rv-pad"><select data-rv-k="' + i + '">' + opts(p.k) + "</select>" +
        (preset && preset[2] == null ? '<input type="text" inputmode="decimal" data-rv-r="' + i + '" value="' + (p.r || "") + '" placeholder="R" aria-label="Valeur R">' : "") +
        (d.pads.length > 1 ? '<button type="button" class="icon-mini danger" data-rv-del="' + i + '" aria-label="Retirer"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' : "") + "</div>";
    }).join("") + '<button type="button" class="link-btn" data-rv-add>+ Ajouter une couche</button></div>';
    h += '<div class="card"><div class="rv-k">La nuit</div><label class="rv-row"><span>Température minimale</span><span><button type="button" class="pm-btn" data-pm="rvT" aria-label="Changer le signe (moins)">±</button><input type="text" inputmode="decimal" id="rvT" value="' + d.t + '"> °C</span></label>' +
      '<p class="tiny muted" style="margin:0 0 8px">' + (d.auto && n.src ? "D'après " + n.src + "." : "Saisie à la main.") + (n.src ? ' <button type="button" class="link-btn" data-rv-auto>Reprendre la météo</button>' : "") + "</p>" +
      '<label class="check"><input type="checkbox" id="rvFri"' + (d.frileux ? " checked" : "") + '><span>Je suis frileux (+1)</span></label>' +
      '<label class="check"><input type="checkbox" id="rvWet"' + (d.mouille ? " checked" : "") + '><span>Sol mouillé ou neige (+1)</span></label></div>';
    var myBags = getGear().filter(function (x) { return x.cat === "sac"; });
    h += '<div class="card"><div class="rv-k">Mon sac de couchage (facultatif)</div>' + (myBags.length ? '<div class="rv-pad"><select id="rvBag"><option value="">Choisir dans mon matériel…</option>' + myBags.map(function (x) { return '<option value="' + esc(x.id) + '">' + esc(x.nom) + "</option>"; }).join("") + "</select></div>" : "") + '<label class="rv-row"><span>Température confort</span><span><button type="button" class="pm-btn" data-pm="rvComf" aria-label="Changer le signe (moins)">±</button><input type="text" inputmode="decimal" id="rvComf" value="' + esc(d.comf) + '"> °C</span></label>' +
      '<label class="rv-row"><span>Température limite</span><span><button type="button" class="pm-btn" data-pm="rvLim" aria-label="Changer le signe (moins)">±</button><input type="text" inputmode="decimal" id="rvLim" value="' + esc(d.lim) + '"> °C</span></label><p class="tiny muted" style="margin:0">Inscrites sur l\'étiquette (norme EN 13537 ou ISO 23537).</p></div>';
    h += '<div id="rvRes"></div>';
    $("#rvBox").innerHTML = h; rvResult();
  }
  function rvResult() {
    var d = getRv(), tot = d.pads.reduce(function (a, p) { return a + (+p.r || 0); }, 0);
    var need = rNeed(d.t) + (d.frileux ? 1 : 0) + (d.mouille ? 1 : 0), gap = tot - need, f = function (v) { return v.toFixed(1).replace(".", ","); };
    var cls = gap >= 0 ? "ok" : gap >= -1 ? "warn" : "danger";
    var msg = gap >= 0 ? "Ton isolation suffit pour cette nuit." : gap >= -1 ? "Un peu juste : tu risques d'avoir froid au petit matin. Ajoute une couche (mousse, lit de feuilles sèches)." : "Insuffisant : le sol va te refroidir toute la nuit. Ajoute une mousse sous ton matelas, ou un lit épais de feuilles sèches.";
    var h = '<div class="rv-score rv-' + cls + '"><div><span>Ton total</span><b>R ' + f(tot) + '</b></div><div><span>Conseillé</span><b>R ' + f(need) + "</b></div></div>" +
      '<div class="alert alert-' + cls + '"><strong>' + (gap >= 0 ? "Bon pour " : "Pour ") + d.t + " °C</strong><span>" + msg + "</span></div>";
    if (d.comf !== "" || d.lim !== "") {
      var c = d.comf === "" ? null : +d.comf, l = d.lim === "" ? null : +d.lim, cs, ms;
      if (c != null && d.t >= c) { cs = "ok"; ms = "La nuit prévue est au-dessus de la température confort : tu dormiras bien."; }
      else if (l != null && d.t >= l) { cs = "warn"; ms = "Entre confort et limite : garde bonnet, chaussettes et une couche sèche pour dormir" + (d.frileux ? ". Frileux : c'est trop juste, prévois plus chaud." : "."); }
      else if (l != null) { cs = "danger"; ms = "Sous la température limite de ton sac : risque d'hypothermie. Prends un sac plus chaud ou un drap de sac, et dors tout habillé au sec."; }
      else { cs = "warn"; ms = "Sous la température confort : prévois des vêtements chauds pour dormir."; }
      h += '<div class="alert alert-' + cs + '"><strong>Sac de couchage</strong><span>' + ms + "</span></div>";
    }
    h += '<p class="tiny muted">Repères indicatifs basés sur les valeurs ASTM F3340 et les recommandations des fabricants. La sensation de froid varie selon la fatigue, le repas du soir et le vent.</p>';
    $("#rvRes").innerHTML = h;
  }
  function rvSave(d, full) { save("sylva_rvalue", d); if (full) renderRv(); else rvResult(); }
  $("#rvBox").addEventListener("change", function (e) {
    var d = getRv(), el = e.target;
    if (el.dataset.rvK != null) {
      if (el.value.indexOf("gear:") === 0) { var gx = getGear().filter(function (y) { return "gear:" + y.id === el.value; })[0]; d.pads[+el.dataset.rvK] = { k: el.value, r: gx ? +gx.r : 0 }; return rvSave(d, true); }
      var p = RPADS.filter(function (x) { return x[0] === el.value; })[0]; d.pads[+el.dataset.rvK] = { k: el.value, r: p[2] != null ? p[2] : 3 }; return rvSave(d, true);
    }
    if (el.id === "rvBag") { var bg = getGear().filter(function (y) { return y.id === el.value; })[0]; if (bg) { d.comf = bg.comf === "" ? "" : String(bg.comf); d.lim = bg.lim === "" ? "" : String(bg.lim); } return rvSave(d, true); }
    if (el.id === "rvFri") d.frileux = el.checked; if (el.id === "rvWet") d.mouille = el.checked;
    rvSave(d);
  });
  $("#rvBox").addEventListener("input", function (e) {
    var d = getRv(), el = e.target;
    if (el.dataset.rvR != null) d.pads[+el.dataset.rvR].r = parseFloat(String(el.value).replace(",", ".")) || 0;
    else if (el.id === "rvT") { var tv = String(el.value).replace(",", ".").trim(); if (tv === "" || isNaN(+tv)) return; d.t = Math.round(+tv); d.auto = false; }
    else if (el.id === "rvComf") d.comf = String(numOrEmpty(el.value)); else if (el.id === "rvLim") d.lim = String(numOrEmpty(el.value)); else return;
    rvSave(d);
  });
  $("#rvBox").addEventListener("click", function (e) {
    var t = e.target.closest("[data-qtech]"); if (t) { openTechnique(t.dataset.qtech); return; }
    var d = getRv();
    if (e.target.closest("[data-rv-add]")) { d.pads.push({ k: "ccf_fin", r: 2 }); rvSave(d, true); }
    var del = e.target.closest("[data-rv-del]"); if (del) { d.pads.splice(+del.dataset.rvDel, 1); rvSave(d, true); }
    if (e.target.closest("[data-rv-auto]")) { d.auto = true; d.t = nightTemp().t; rvSave(d, true); }
  });


  renderRegionBtn();
  renderEspeces();
  renderGuide();
  renderLearnCounts();
  renderLearnGuide();
  renderAccueil();
  loadMeteo();
  setTimeout(function () { prefetchPhotos(false); }, 3000);
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(function () {}); } catch (e) {}
  initMap();
  startGeo();
  setTimeout(function () { drawTrack(); drawCar(); checkBadges(); }, 1500);
  applyEco();

  if ("serviceWorker" in navigator) {
    var hadController = !!navigator.serviceWorker.controller, reloaded = false;
    navigator.serviceWorker.addEventListener("controllerchange", function () {
      // Une nouvelle version vient de s'installer : on recharge une fois pour l'afficher
      if (hadController && !reloaded) { reloaded = true; window.location.reload(); }
    });
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js", { updateViaCache: "none" }).then(function (reg) {
        reg.update();
        document.addEventListener("visibilitychange", function () { if (!document.hidden) reg.update(); });
      }).catch(function () {});
    });
  }
})();
