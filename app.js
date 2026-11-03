/* Sylva – V1 (test terrain) */
(function () {
  "use strict";

  var VERSION = "0.1.4";
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
  function norm(s) { return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
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

  $("#zoneName").textContent = ZONE.nom;
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
  }

  // ---------- Modales & fiche ----------
  function openModal(id) { $(id).hidden = false; }
  function closeModal(el) { el.hidden = true; }
  $all(".modal").forEach(function (m) {
    m.addEventListener("click", function (e) {
      if (e.target === m || e.target.hasAttribute("data-close")) closeModal(m);
    });
  });
  function openSheet(kicker, html) {
    $("#sheetKicker").textContent = kicker;
    $("#sheetBody").innerHTML = html;
    $("#sheetBody").scrollTop = 0;
    $("#sheet").hidden = false;
  }
  $("#sheetClose").addEventListener("click", function () { $("#sheet").hidden = true; });

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
  function renderSpots() {
    if (!map) return;
    layers.spots.clearLayers();
    getSpots().forEach(function (s) {
      var ty = SPOT_TYPES[s.type] || SPOT_TYPES.autre;
      var html = "<b>" + esc(ty[2]) + "</b><br>" + esc(s.note || "(sans note)") +
        '<br><span style="color:#A9B3A6;font-size:12px">' + esc(new Date(s.date).toLocaleString("fr-BE")) + "</span>" +
        '<br><br><button data-del-spot="' + esc(s.id) + '" style="background:none;border:0;color:#FFB4A1;font-weight:600;padding:0;cursor:pointer">Supprimer</button>';
      layers.spots.addLayer(L.marker([s.lat, s.lon], { icon: pinIcon(ty[0], ty[1]) }).bindPopup(html));
    });
  }
  function deleteSpot(id) {
    save("sylva_spots", getSpots().filter(function (s) { return s.id !== id; }));
    renderSpots(); toast("Spot supprimé");
  }
  var pendingSpotPos = null;
  $("#btnAddSpot").addEventListener("click", function () {
    if (!map) return;
    if (me) { pendingSpotPos = [me[0], me[1]]; $("#spotPosInfo").textContent = "Position GPS actuelle (± " + Math.round(me[2]) + " m)"; }
    else { var c = map.getCenter(); pendingSpotPos = [c.lat, c.lng]; $("#spotPosInfo").textContent = "Pas de GPS : le spot sera placé au centre de la carte."; }
    $("#spotNote").value = "";
    openModal("#modalSpot");
  });
  $("#formSpot").addEventListener("submit", function (e) {
    e.preventDefault();
    var spots = getSpots();
    spots.push({ id: String(Date.now()), lat: pendingSpotPos[0], lon: pendingSpotPos[1], type: $("#spotType").value, note: $("#spotNote").value.trim(), date: Date.now() });
    save("sylva_spots", spots);
    renderSpots(); closeModal($("#modalSpot")); toast("Spot enregistré");
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
  $("#btnExportSpots").addEventListener("click", function () {
    var s = getSpots(); if (!s.length) { toast("Aucun spot enregistré"); return; }
    copyText(JSON.stringify(s, null, 1));
  });

  // ---------- Espèces ----------
  var CAT_LABEL = { plante: "Plante comestible", toxique: "Plante toxique", champignon: "Champignon", animal: "Faune" };
  var CAT_PLURAL = { plante: "Plantes comestibles", toxique: "Plantes toxiques", champignon: "Champignons", animal: "Faune" };
  var CAT_ICO ={ plante: ["#23382A", "#8CCB7E"], toxique: ["#4A1C14", "#FFB4A1"], champignon: ["#3A3218", "#F2D184"], animal: ["#2A2235", "#C7B9DE"] };
  var curCat = "tout";
  function lvClass(n) { return "lv-" + (n || "info"); }

  function renderEspeces() {
    var q = norm($("#searchEspeces").value);
    var list = ESPECES.filter(function (s) {
      if (curCat !== "tout" && s.cat !== curCat) return false;
      if (!q) return true;
      return norm(s.nom + " " + s.latin + " " + s.resume).indexOf(q) !== -1;
    });
    var html = "";
    var lastCat = null;
    list.forEach(function (s) {
      if (curCat === "tout" && s.cat !== lastCat) { html += '<div class="section-title">' + esc(CAT_PLURAL[s.cat]) + "</div>"; lastCat = s.cat; }
      var ic = CAT_ICO[s.cat];
      html += '<button class="item" data-esp="' + esc(s.id) + '">' +
        '<span class="item-ico" style="background:' + ic[0] + ";color:" + ic[1] + '">' + esc(s.nom.charAt(0)) + "</span>" +
        '<span class="item-main"><span class="item-name">' + esc(s.nom) + '</span><span class="item-sub">' + esc(s.saison) + "</span></span>" +
        '<span class="badge ' + lvClass(s.niveau) + '">' + esc(s.statut) + "</span></button>";
    });
    $("#listEspeces").innerHTML = html || '<p class="muted">Aucune espèce trouvée.</p>';
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

  function openEspece(id) {
    var s = ESPECES.filter(function (x) { return x.id === id; })[0]; if (!s) return;
    var h = '<h1 id="sheetTitle">' + esc(s.nom) + '</h1><div class="latin">' + esc(s.latin) + "</div>" +
      '<div class="row" style="flex-wrap:wrap;gap:6px;margin:0 0 12px"><span class="badge ' + lvClass(s.niveau) + '">' + esc(s.statut) + '</span><span class="badge lv-info">' + esc(s.saison) + "</span></div>" +
      "<p>" + esc(s.resume) + "</p>";
    if (s.identification && s.identification.length) {
      h += "<h3>Reconnaître</h3><ul>" + s.identification.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>";
    }
    if (s.sosies && s.sosies.length) {
      h += "<h3>Ne pas confondre</h3>" + s.sosies.map(function (x) {
        return '<div class="sosie ' + esc(x.niveau) + '"><b>' + esc(x.nom) + "</b>" + esc(x.diff) + "</div>";
      }).join("");
    }
    if (s.usages && s.usages.length) {
      h += "<h3>" + (s.cat === "animal" ? "Conseils" : s.niveau === "danger" ? "Consignes" : "Usages") + "</h3><ul>" +
        s.usages.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>";
    }
    h += '<p class="disclaimer">Contenu éducatif. Ne consommez jamais une plante ou un champignon sans certitude absolue de son identité.</p>';
    openSheet(CAT_LABEL[s.cat], h);
  }

  // ---------- Techniques ----------
  function renderTechniques() {
    var h = "";
    TECHS.forEach(function (t) {
      if (t.priorite) {
        h += '<button class="tech-card' + (t.id === "froid" ? " cold" : "") + '" data-tech="' + esc(t.id) + '">' +
          '<span class="k">Priorité</span><span class="t">' + esc(t.titre) + "</span><p>" + esc(t.intro) + "</p></button>";
      }
    });
    h += '<div class="section-title">Toutes les techniques</div><div class="list">';
    TECHS.forEach(function (t) {
      if (t.priorite) return;
      h += '<button class="item" data-tech="' + esc(t.id) + '">' +
        '<span class="item-ico" style="background:#203027;color:#E9A23B">' + esc(t.titre.charAt(0)) + "</span>" +
        '<span class="item-main"><span class="item-name">' + esc(t.titre) + '</span><span class="item-sub">' + esc(t.intro) + "</span></span></button>";
    });
    h += "</div>";
    $("#listTechniques").innerHTML = h;
  }
  $("#listTechniques").addEventListener("click", function (e) {
    var b = e.target.closest("[data-tech]"); if (!b) return;
    var t = TECHS.filter(function (x) { return x.id === b.getAttribute("data-tech"); })[0]; if (!t) return;
    openSheet("Technique", '<h1 id="sheetTitle">' + esc(t.titre) + "</h1><p>" + esc(t.intro) + "</p><h3>Étapes</h3><ol>" +
      t.etapes.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ol>");
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

  function resizeImage(file) {
    return new Promise(function (resolve, reject) {
      var img = new Image(), url = URL.createObjectURL(file);
      img.onload = function () {
        var max = 1280, w = img.naturalWidth, h = img.naturalHeight, r = Math.min(1, max / Math.max(w, h));
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
    results.forEach(function (r) {
      var sp = r.species || {};
      var latin = sp.scientificNameWithoutAuthor || "";
      var fam = sp.family && sp.family.scientificNameWithoutAuthor;
      if (fam === "Apiaceae") umbel = true;
      var local = LATIN_INDEX[norm(latin)];
      if (local && local.niveau === "danger" && !dangerHit) dangerHit = local;
      var common = (sp.commonNames && sp.commonNames[0]) || latin;
      var pct = Math.round((r.score || 0) * 100);
      html += '<div class="result"><span class="score" style="color:' + (local && local.niveau === "danger" ? "#FFB4A1" : "#EEE9DD") + '">' + pct + " %</span>" +
        '<span class="names"><span>' + esc(common) + "</span><i>" + esc(latin) + "</i>" +
        (local ? '<button class="link" data-esp="' + esc(local.id) + '">Voir la fiche et les sosies</button>' : "") + "</span>" +
        (local ? '<span class="badge ' + lvClass(local.niveau) + '">' + esc(local.statut) + "</span>" : "") + "</div>";
    });
    var head = "";
    if (dangerHit) head += '<div class="alert alert-danger"><strong>Espèce toxique possible : ' + esc(dangerHit.nom) + "</strong><span>Ne touchez pas à la bouche, ne consommez rien.</span></div>";
    if (umbel) head += '<div class="alert alert-danger"><strong>Ombellifère détectée</strong><span>Cette famille compte des plantes mortelles (ciguës, œnanthe). Ne jamais consommer sans expert.</span></div>';
    if (results[0].score < 0.5) head += '<div class="alert alert-warn"><strong>Identification incertaine</strong><span>Score faible : reprenez une photo plus nette, d\'un autre organe.</span></div>';
    $("#scanResults").innerHTML = head + "<h3>Correspondances possibles</h3>" + html;
  }
  $("#scanResults").addEventListener("click", function (e) {
    var b = e.target.closest("[data-esp]"); if (b) openEspece(b.getAttribute("data-esp"));
  });

  // ---------- Démarrage ----------
  renderEspeces();
  renderTechniques();
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
