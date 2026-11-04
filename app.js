/* Sylva – V1 (test terrain) */
(function () {
  "use strict";

  var VERSION = "0.9.3";
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
  }
  function onPosErr(err) {
    if (err && err.code === 1) toast("Localisation refusée : activez-la dans Réglages > Safari");
  }
  function startGeo() {
    if (!navigator.geolocation) return;
    navigator.geolocation.watchPosition(onPos, onPosErr, { enableHighAccuracy: true, maximumAge: 15000, timeout: 30000 });
  }

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
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    layers.bivouac = L.layerGroup().addTo(map);
    layers.eau = L.layerGroup().addTo(map);
    layers.spots = L.layerGroup().addTo(map);

    $all(".map-chips .chip").forEach(function (c) {
      c.addEventListener("click", function () {
        var on = !c.classList.contains("on");
        c.classList.toggle("on", on);
        var lg = layers[c.dataset.layer];
        if (on) map.addLayer(lg); else map.removeLayer(lg);
      });
    });

    map.on("popupopen", function (e) {
      var img = e.popup.getElement().querySelector("[data-spot-photo]");
      if (img) spotPhotoUrl(img.getAttribute("data-spot-photo")).then(function (u) { if (u) { img.src = u; img.hidden = false; e.popup.update(); } });
      var btn = e.popup.getElement().querySelector("[data-del-spot]");
      if (btn) btn.addEventListener("click", function () { deleteSpot(btn.getAttribute("data-del-spot")); map.closePopup(); });
    });

    renderSpots();
    var cached = load("sylva_osm", null);
    if (cached && cached.elements) renderOsm(cached.elements);
    loadOsm(false);
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
        '<br><br><button data-del-spot="' + esc(s.id) + '" style="background:none;border:0;color:#FFB4A1;font-weight:600;padding:0;cursor:pointer">Supprimer</button>';
      var mk = L.marker([s.lat, s.lon], { icon: pinIcon(ty[0], ty[1]) }).bindPopup(html);
      spotMarkers[s.id] = mk; layers.spots.addLayer(mk);
    });
  }
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
    $("#spotNote").value = "";
    pendingSpotBlob = null; $("#spotPhotoPreview").hidden = true;
    openModal("#modalSpot");
  });
  $("#formSpot").addEventListener("submit", function (e) {
    e.preventDefault();
    var spots = getSpots();
    var id = String(Date.now()), blob = pendingSpotBlob;
    spots.push({ id: id, lat: pendingSpotPos[0], lon: pendingSpotPos[1], type: $("#spotType").value, note: $("#spotNote").value.trim(), date: Date.now(), photo: !!blob });
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
    loadOsm(true);
  });

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
    $("#apiKey").value = load("sylva_key", "") || ""; openModal("#modalSettings");
  });
  $("#formSettings").addEventListener("submit", function (e) {
    e.preventDefault(); save("sylva_key", $("#apiKey").value.trim());
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
  var CAT_LABEL = { plante: "Plante comestible", toxique: "Plante toxique", champignon: "Champignon", animal: "Faune" };
  var CAT_PLURAL = { plante: "Plantes comestibles", toxique: "Plantes toxiques", champignon: "Champignons", animal: "Faune" };
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
  function verdictHtml(s) {
    var n = s.niveau || "info";
    return '<div class="verdict v-' + esc(n) + '"><span class="v-ico" aria-hidden="true">' + VERDICT_ICO[n] + "</span><span><b>" + esc(s.statut) + "</b><span>" + esc(VERDICT_SUB[n]) + "</span></span></div>";
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
      h += "<h3>" + (s.cat === "animal" ? "Conseils" : s.niveau === "danger" ? "Consignes" : "Usages") + "</h3><ul>" +
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
  var IMGS = {}; (window.SYLVA_IMAGES || []).forEach(function (k) { IMGS[k] = "img/" + k + ".webp"; });
  function thumbOf(key, illus) {
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
      if (t.priorite && (!ficheCat || t.cat === ficheCat)) {
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
          (t.wiki && photoOf(t.wiki)
            ? '<span class="item-illus item-photo" aria-hidden="true"><img src="' + esc(photoOf(t.wiki).src) + '" alt="" loading="lazy"></span>'
            : '<span class="item-illus" aria-hidden="true">' + thumbOf(t.id, t.illus) + "</span>") +
          '<span class="item-main"><span class="item-name">' + esc(t.titre) + '</span><span class="item-sub">' + esc(t.intro) + "</span></span></button>";
      });
      h += "</div>";
    });
    $("#listTechniques").innerHTML = h;
  }
  function stepsHtml(etapes, mode, hidden) {
    var n = etapes.length;
    return '<div class="steps" data-cur="0" data-n="' + n + '"' + (mode ? ' data-mode="' + mode + '"' : "") + (hidden ? " hidden" : "") + ">" +
      '<div class="step-bar" aria-hidden="true">' + etapes.map(function (x, i) { return "<span" + (i === 0 ? ' class="on"' : "") + "></span>"; }).join("") + "</div>" +
      etapes.map(function (x, i) {
        return '<div class="step' + (i === 0 ? " on" : "") + '"><span class="step-k"><span class="step-n">' + (i + 1) + "</span>Étape " + (i + 1) + " sur " + n + "</span><p>" + esc(x) + "</p></div>";
      }).join("") +
      '<div class="step-nav"><button type="button" class="btn" data-step="-1" disabled>Précédent</button><button type="button" class="btn btn-next" data-step="1">' + (n > 1 ? "Étape suivante" : "Terminé ✓") + "</button></div>" +
      '<button type="button" class="link-btn steps-toggle" data-step-all>Voir toutes les étapes</button></div>';
  }
  function openTechnique(id) {
    var t = TECHS.filter(function (x) { return x.id === id; })[0]; if (!t) return;
    var tp = t.wiki && photoOf(t.wiki);
    var both = t.isole && t.etapes && t.etapes.length;
    var main = t.isole || t.etapes, n = main.length;
    var h = (t.wiki ? '<div id="heroSlot" class="knot">' + (tp ? heroHtml(tp, t.titre) : "") + "</div>"
                    : heroIllus(t.id, t.illus, t.titre)) +
      '<div class="chap-k">' + esc(t.cat) + (t.isole ? " · secours injoignables" : " · " + n + " étapes") + '</div><h1 id="sheetTitle">' + esc(t.titre) + "</h1><p>" + esc(t.intro) + "</p>";
    if (t.alerte && t.alerte.length) {
      h += '<div class="alert alert-danger red-flags"><strong>Fais tout pour sortir ou te faire repérer si :</strong><ul>' +
        t.alerte.map(function (a) { return "<li>" + esc(a) + "</li>"; }).join("") + "</ul></div>";
    }
    if (both) {
      h += '<div class="seg seg-2 mode-seg" role="group" aria-label="Situation"><button type="button" class="chip on" data-ps-mode="isole">Seul, sans secours</button><button type="button" class="chip" data-ps-mode="secours">Secours joignables</button></div>';
      h += stepsHtml(t.isole, "isole", false) + stepsHtml(t.etapes, "secours", true);
    } else h += stepsHtml(main, "", false);
    (t.attentionIsole || []).forEach(function (a) { h += '<div class="alert alert-warn"><span>' + esc(a) + "</span></div>"; });
    (t.attention || []).forEach(function (a) { h += '<div class="alert alert-warn"><span>' + esc(a) + "</span></div>"; });
    if (t.source) h += '<p class="disclaimer">Source : ' + esc(t.source) + ". Contenu éducatif : il ne remplace pas une formation aux premiers secours.</p>";
    openSheet(t.cat, h);
    if (t.wiki && !tp && navigator.onLine) {
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
  function renderMeteo(data, when) {
    var d = data.daily, h = "";
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
      var label = i === 0 ? "Aujourd'hui" : date.toLocaleDateString("fr-BE", { weekday: "long" });
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
      cl = cl.filter(function (x) { return x.id !== gid; }); saveChecklist(cl); renderChecklist();
    } else if (b.hasAttribute("data-photo-for")) {
      photoTarget = b.getAttribute("data-photo-for"); $("#checkPhoto").click();
    } else if (b.id === "btnDefaultCheck") {
      if (!confirm("Remplacer ta liste par la liste par défaut ? Tes éléments et photos perso seront effacés.")) return;
      saveChecklist(defaultChecklist(null)); renderChecklist();
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

  function renderBivouac() { renderTrip(); loadMeteo(); renderChecklist(); renderCarnet(); }

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
  }
  $("#btnTrip").addEventListener("click", function () {
    var t = getTrip(); $("#tripLieu").value = t.lieu || ""; $("#tripDate").value = t.date || ""; openModal("#modalTrip");
  });
  $("#formTrip").addEventListener("submit", function (e) {
    e.preventDefault();
    save("sylva_trip", { lieu: $("#tripLieu").value.trim(), date: $("#tripDate").value });
    closeModal($("#modalTrip")); renderTrip(); renderAccueil(); toast("Sortie enregistrée");
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
    var sais = ESPECES.filter(function (s) { return inRegion(s) && s.mois && s.mois.indexOf(mois) !== -1 && s.cat !== "animal"; });
    sais.sort(function (a, b) { return (photoOf(b.latin) ? 1 : 0) - (photoOf(a.latin) ? 1 : 0); });
    $("#homeSeason").innerHTML = sais.slice(0, 12).map(function (s) {
      var p = photoOf(s.latin);
      return '<button class="season-card" type="button" data-esp="' + esc(s.id) + '"><span class="season-img">' +
        (p ? '<img src="' + esc(p.src) + '" alt="" loading="lazy">' : esc(s.nom.charAt(0))) +
        '<span class="badge ' + lvClass(s.niveau) + '">' + esc(s.statut) + "</span></span><b>" + esc(s.nom) + "</b></button>";
    }).join("") || '<p class="muted">Rien de particulier ce mois-ci.</p>';
    renderLearnGuide();
  }
  $("#homeSeason").addEventListener("click", function (e) { var b = e.target.closest("[data-esp]"); if (b) openEspece(b.getAttribute("data-esp")); });
  $("#tripCard").addEventListener("click", function () { showView("bivouac"); });
  $("#heroMeteo").addEventListener("click", function () { showView("bivouac"); });

  // ---------- Apprendre ----------
  function learnShow(which) {
    $("#learnHome").hidden = which !== "home";
    $("#panelEspeces").hidden = which !== "especes";
    $("#panelGuide").hidden = which !== "guide";
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
  renderRegionBtn();
  renderEspeces();
  renderGuide();
  renderLearnCounts();
  renderLearnGuide();
  renderAccueil();
  loadMeteo();
  setTimeout(function () { prefetchPhotos(false); }, 3000);
  initMap();
  startGeo();

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
