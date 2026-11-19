/* Bivaska – page de modération (script séparé pour la politique de sécurité du contenu) */
if (window.top !== window.self) { document.documentElement.innerHTML = ""; throw new Error("cadre interdit"); }
(function () {
  var C = window.SylvaCloud, $ = function (s) { return document.querySelector(s); };
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  if (!C || !C.enabled) { $("#login").innerHTML = "<p>Supabase n'est pas encore configuré (config.js).</p>"; return; }
  var email = "", tab = "spots";
  var STATUTS = { aire_officielle: "Aire officielle", terrain_prive_accord: "Terrain privé avec accord", camping: "Camping", zone_toleree: "Zone tolérée" };
  function login() {
    if (C.user()) return check();
    $("#login").innerHTML = email
      ? '<p>Code envoyé à ' + esc(email) + '</p><input id="code" inputmode="numeric" placeholder="Code"><div class="row"><button class="pri" id="go">Valider</button></div>'
      : '<input id="em" type="email" placeholder="Adresse e-mail administrateur"><div class="row"><button class="pri" id="send">Recevoir un code</button></div>';
  }
  document.addEventListener("click", function (e) {
    var t = e.target.closest("button"); if (!t) return;
    if (t.id === "send") { email = $("#em").value.trim(); C.sendCode(email).then(login).catch(function (er) { alert(er.message); }); }
    if (t.id === "go") C.verifyCode(email, $("#code").value.trim()).then(check).catch(function () { alert("Code incorrect"); });
    if (t.dataset.t) { tab = t.dataset.t; document.querySelectorAll("#tabs button").forEach(function (b) { b.classList.toggle("on", b === t); }); render(); }
    if (t.dataset.act) act(t.dataset.act, t.dataset.id, t.dataset.v);
  });
  function check() {
    var u = C.user();
    return C.api("POST", "rpc/my_profile", {}).catch(function () { return C.api("GET", "profiles?select=is_admin&id=eq." + u.id); }).then(function (r) {
      if (!r[0] || !r[0].is_admin) { $("#login").innerHTML = "<p>Ce compte n'est pas administrateur.</p>"; return; }
      $("#login").hidden = true; $("#main").hidden = false; render();
    });
  }
  function render() {
    $("#list").innerHTML = '<p class="muted">Chargement…</p>';
    var q = {
      spots: "community_spots?select=*,profiles(pseudo,trusted)&status=in.(pending,hidden)&order=created_at.asc&limit=50",
      photos: "spot_photos?select=id,path,spot_id,community_spots(titre)&status=eq.pending&order=created_at.asc&limit=30",
      reports: "reports?select=*&status=eq.open&order=created_at.asc&limit=80",
      ideas: "ideas?select=*&status=eq.pending&order=created_at.asc&limit=50"
    }[tab];
    C.api("GET", q).then(function (rows) {
      if (!rows.length) { $("#list").innerHTML = '<p class="muted">Rien à traiter.</p>'; return; }
      $("#list").innerHTML = rows.map(card).join("");
      if (tab === "photos") rows.forEach(function (p) {
        fetch(window.SYLVA_CONFIG.supabaseUrl.replace(/\/+$/, "") + "/storage/v1/object/sign/spot-photos/" + String(p.path).split("/").map(encodeURIComponent).join("/"), { method: "POST", headers: { apikey: window.SYLVA_CONFIG.supabaseKey, Authorization: "Bearer " + JSON.parse(localStorage.getItem("sylva_session")).access_token, "Content-Type": "application/json" }, body: JSON.stringify({ expiresIn: 600 }) })
          .then(function (r) { return r.json(); }).then(function (j) { var im = document.getElementById("im-" + p.id); if (im && j.signedURL) im.src = window.SYLVA_CONFIG.supabaseUrl.replace(/\/+$/, "") + "/storage/v1" + j.signedURL; });
      });
    }).catch(function (er) { $("#list").innerHTML = "<p>" + esc(er.message) + "</p>"; });
  }
  function card(r) {
    if (tab === "spots") return '<div class="card"><b>' + esc(r.titre) + '</b><span class="muted">' + esc(STATUTS[r.statut]) + " · " + esc(r.country) + " · par " + esc((r.profiles || {}).pseudo || "?") + (r.status === "hidden" ? " · MASQUÉ (" + r.reports + " signalements)" : "") + "</span>" +
      (r.description ? "<p>" + esc(r.description) + "</p>" : "") +
      '<p class="muted"><a target="_blank" rel="noopener" href="https://www.openstreetmap.org/?mlat=' + r.lat + "&mlon=" + r.lon + '#map=16/' + r.lat + "/" + r.lon + '">Voir sur la carte</a> : vérifier que ce n\'est ni une habitation ni une réserve.</p>' +
      '<div class="row"><button class="ok" data-act="spot" data-id="' + r.id + '" data-v="published">Publier</button><button class="ko" data-act="spot" data-id="' + r.id + '" data-v="rejected">Refuser</button></div></div>';
    if (tab === "photos") return '<div class="card"><b>' + esc((r.community_spots || {}).titre) + '</b><img id="im-' + r.id + '" alt=""><p class="muted">Refuser si : visage reconnaissable, plaque d\'immatriculation, nudité, violence, sans rapport.</p><div class="row"><button class="ok" data-act="photo" data-id="' + r.id + '" data-v="published">Publier</button><button class="ko" data-act="photo" data-id="' + r.id + '" data-v="rejected">Refuser</button></div></div>';
    if (tab === "reports") return '<div class="card"><b>' + esc(r.kind) + " · " + esc(r.target) + '</b><span class="muted">' + esc(r.motif || "") + " · " + new Date(r.created_at).toLocaleString("fr-BE") + " · v" + esc(r.app_version || "?") + "</span><p>" + esc(r.message) + '</p><div class="row"><button class="ok" data-act="report" data-id="' + r.id + '" data-v="done">Traité</button><button data-act="report" data-id="' + r.id + '" data-v="rejected">Sans suite</button></div></div>';
    return '<div class="card"><b>' + esc(r.titre) + "</b>" + (r.detail ? "<p>" + esc(r.detail) + "</p>" : "") + '<div class="row"><button class="ok" data-act="idea" data-id="' + r.id + '" data-v="open">Publier</button><button class="pri" data-act="idea" data-id="' + r.id + '" data-v="planned">Publier « prévu »</button><button class="ko" data-act="idea" data-id="' + r.id + '" data-v="rejected">Refuser</button></div></div>';
  }
  function act(kind, id, v) {
    var table = { spot: "community_spots", photo: "spot_photos", report: "reports", idea: "ideas" }[kind];
    C.api("PATCH", table + "?id=eq." + id, { status: v }, { prefer: "return=minimal" }).then(render).catch(function (er) { alert(er.message); });
  }
  login();
})();
