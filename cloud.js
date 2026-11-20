/* Bivaska – compte, sauvegarde, signalements, idées et carte communautaire (v0.9.96).
   Client Supabase minimal sans dépendance (fetch). L'appli reste 100 % utilisable sans compte ni réseau.
   - Connexion par e-mail et mot de passe (v0.9.108). Les codes reçus par e-mail ne servent plus qu'à confirmer l'adresse,
     à retrouver un mot de passe oublié, ou à se connecter sans mot de passe. Jamais de lien : sur iPhone il s'ouvrirait dans Safari.
   - Nouvelles par e-mail : seulement avec accord explicite (profiles.news_optin, case non cochée par défaut).
   - Synchronisation : clés listées dans SYNC_KEYS, la plus récente gagne. Les infos médicales (sylva_ice),
     le garrot, les clés d'API et les caches ne quittent jamais le téléphone.
   - Communauté : spots avec statut légal obligatoire, avis, photos relues, signalements. */
(function () {
  "use strict";
  var CFG = window.SYLVA_CONFIG || {};
  var URL_ = (CFG.supabaseUrl || "").replace(/\/+$/, ""), KEY = CFG.supabaseKey || "";
  var enabled = !!(URL_ && KEY);
  var C = window.SylvaCloud = { enabled: enabled };
  if (!enabled) return;

  // ---------------- Cœur : session et requêtes ----------------
  var SKEY = "sylva_session";
  function getSess() { try { return JSON.parse(localStorage.getItem(SKEY) || "null"); } catch (e) { return null; } }
  function setSess(s) { try { if (s) localStorage.setItem(SKEY, JSON.stringify(s)); else localStorage.removeItem(SKEY); } catch (e) {} }
  function fromToken(j) {
    return { access_token: j.access_token, refresh_token: j.refresh_token, expires_at: Math.floor(Date.now() / 1000) + (j.expires_in || 3600) - 60,
      user: j.user ? { id: j.user.id, email: j.user.email } : null };
  }
  function http(method, path, body, opt) {
    opt = opt || {};
    var h = { apikey: KEY, "Content-Type": "application/json" };
    var tok = opt.anon ? null : (getSess() || {}).access_token;
    // Nouvelles clés « sb_publishable_… » : ce ne sont pas des JWT, elles vont seulement dans apikey.
    if (tok) h.Authorization = "Bearer " + tok;
    else if (/^eyJ/.test(KEY)) h.Authorization = "Bearer " + KEY;
    if (opt.prefer) h.Prefer = opt.prefer;
    if (opt.headers) Object.keys(opt.headers).forEach(function (k) { h[k] = opt.headers[k]; });
    return fetch(URL_ + path, { method: method, headers: h, body: body == null ? undefined : (opt.raw ? body : JSON.stringify(body)) }).then(function (r) {
      return r.text().then(function (t) {
        var j = null; try { j = t ? JSON.parse(t) : null; } catch (e) {}
        if (!r.ok) { var err = new Error((j && (j.msg || j.message || j.error_description || j.error)) || ("HTTP " + r.status)); err.status = r.status; throw err; }
        return j;
      });
    });
  }
  function fresh() {
    var s = getSess(); if (!s) return Promise.resolve(null);
    if (s.expires_at > Date.now() / 1000) return Promise.resolve(s);
    if (!navigator.onLine) return Promise.resolve(s);
    return http("POST", "/auth/v1/token?grant_type=refresh_token", { refresh_token: s.refresh_token }, { anon: true }).then(function (j) {
      var n = fromToken(j); if (!n.user) n.user = s.user; setSess(n); return n;
    }).catch(function (e) { if (e.status === 400 || e.status === 401) setSess(null); return null; });
  }
  function api(method, path, body, opt) { return fresh().then(function () { return http(method, "/rest/v1/" + path, body, opt); }); }
  C.user = function () { var s = getSess(); return s && s.user; };
  C.sendCode = function (email) { return http("POST", "/auth/v1/otp", { email: email, create_user: true }, { anon: true }); };
  C.verifyCode = function (email, code) {
    return http("POST", "/auth/v1/verify", { type: "email", email: email, token: code }, { anon: true }).then(function (j) { setSess(fromToken(j)); return j; });
  };
  // Mot de passe (v0.9.108) : connexion, création de compte (confirmée par un code), mot de passe oublié (code + nouveau mot de passe)
  C.login = function (email, pw) {
    return http("POST", "/auth/v1/token?grant_type=password", { email: email, password: pw }, { anon: true }).then(function (j) { setSess(fromToken(j)); return j; });
  };
  C.signup = function (email, pw, news) {
    return http("POST", "/auth/v1/signup", { email: email, password: pw, data: { news_optin: !!news } }, { anon: true }).then(function (j) {
      if (j && j.access_token) setSess(fromToken(j)); // confirmation désactivée côté Supabase : déjà connecté
      // Adresse déjà inscrite : Supabase répond « OK » avec un faux compte sans identité et n'envoie aucun e-mail
      var u = j && (j.user || j);
      if (u && Array.isArray(u.identities) && !u.identities.length) throw new Error("User already registered");
      return j;
    });
  };
  C.verifySignup = function (email, code) {
    return http("POST", "/auth/v1/verify", { type: "signup", email: email, token: code }, { anon: true }).then(function (j) { setSess(fromToken(j)); return j; });
  };
  C.resendSignup = function (email) { return http("POST", "/auth/v1/resend", { type: "signup", email: email }, { anon: true }); };
  C.recover = function (email) { return http("POST", "/auth/v1/recover", { email: email }, { anon: true }); };
  C.verifyRecovery = function (email, code) {
    return http("POST", "/auth/v1/verify", { type: "recovery", email: email, token: code }, { anon: true }).then(function (j) { setSess(fromToken(j)); return j; });
  };
  C.setPassword = function (pw) { return fresh().then(function () { return http("PUT", "/auth/v1/user", { password: pw }); }); };
  C.logout = function () { var p = getSess() ? http("POST", "/auth/v1/logout", {}).catch(function () {}) : Promise.resolve(); return p.then(function () { setSess(null); }); };
  // Supprime d'abord mes photos par l'API de stockage (Supabase interdit l'effacement direct en SQL), puis le compte
  C.deleteAccount = function () {
    var u = C.user(), ss = getSess();
    var photos = !u ? Promise.resolve() : fresh().then(function (s2) {
      var h = { apikey: KEY, Authorization: "Bearer " + ((s2 || ss).access_token), "Content-Type": "application/json" };
      return fetch(URL_ + "/storage/v1/object/list/spot-photos", { method: "POST", headers: h, body: JSON.stringify({ prefix: u.id, limit: 1000 }) })
        .then(function (r) { return r.ok ? r.json() : []; })
        .then(function (list) {
          var names = (list || []).map(function (o) { return u.id + "/" + o.name; });
          if (!names.length) return;
          return fetch(URL_ + "/storage/v1/object/spot-photos", { method: "DELETE", headers: h, body: JSON.stringify({ prefixes: names }) });
        });
    }).catch(function () {});
    return photos.then(function () { return api("POST", "rpc/delete_my_account", {}); }).then(function () { setSess(null); });
  };
  C.api = api;

  // Filtre des textes publics : pas de téléphone, e-mail, lien ni insulte courante
  var BAD = /\b(con+ard|connasse|encul|salope|pute|pd|nique|fdp|ntm|batard|bâtard)\b/i;
  function textOk(t) {
    if (!t) return true;
    if (/[\w.+-]+@[\w-]+\.[\w.]+/.test(t)) return "Pas d'adresse e-mail dans un texte public.";
    if (/(\+?\d[\s.-]?){8,}/.test(t)) return "Pas de numéro de téléphone dans un texte public.";
    if (/https?:\/\/|www\./i.test(t)) return "Pas de lien dans un texte public.";
    if (BAD.test(t)) return "Merci de rester correct.";
    return true;
  }
  C.textOk = textOk;

  // La carte peut se créer pendant le chargement d'app.js : on garde la référence et on branche la couche une fois l'interface prête.
  var mapRef = null, uiReady = false;
  (window.SYLVA_MAP_HOOKS = window.SYLVA_MAP_HOOKS || []).push(function (map, layers) { mapRef = { map: map, layers: layers }; if (uiReady) setupMap(); });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initUI); else setTimeout(initUI, 0);
  var A, $, esc, ic, toast;
  function tr(x) { return window.T ? window.T(x) : x; }
  function initUI() {
  if (!window.SYLVA_APP) return;   // page de modération : seulement le cœur
  A = window.SYLVA_APP; $ = A.$; esc = A.esc; ic = A.ic; toast = A.toast;

  // ---------------- Synchronisation ----------------
  var SYNC_KEYS = ["sylva_spots", "sylva_trip", "sylva_plan", "sylva_checklist", "sylva_check", "sylva_hist", "sylva_journal", "sylva_pret", "sylva_gear",
    "sylva_defis", "sylva_badges", "sylva_quiz", "sylva_lus", "sylva_read", "sylva_drill", "sylva_famdrill", "sylva_country", "sylva_region",
    "sylva_theme", "sylva_rvalue", "sylva_car", "sylva_prep", "sylva_estime"];
  var META = "sylva_syncmeta";
  function meta() { try { return JSON.parse(localStorage.getItem(META) || "{}"); } catch (e) { return {}; } }
  function setMeta(m) { try { localStorage.setItem(META, JSON.stringify(m)); } catch (e) {} }
  var origSet = Storage.prototype.setItem, pushTimer = null, applying = false;
  Storage.prototype.setItem = function (k, v) {
    origSet.call(this, k, v);
    if (this === window.localStorage && !applying && SYNC_KEYS.indexOf(k) !== -1) {
      var m = meta(); m.t = m.t || {}; m.t[k] = Date.now(); m.dirty = m.dirty || {}; m.dirty[k] = 1; setMeta(m);
      if (C.user()) { clearTimeout(pushTimer); pushTimer = setTimeout(C.sync, 8000); }
    }
  };
  var syncing = null;
  C.sync = function (opts) {
    if (!C.user() || !navigator.onLine) return Promise.resolve(false);
    if (syncing) return syncing;
    var uidv = C.user().id, changed = false;
    syncing = api("GET", "user_data?select=k,v,updated_at").then(function (rows) {
      var m = meta(); m.t = m.t || {}; m.dirty = m.dirty || {};
      var server = {}; (rows || []).forEach(function (r) { server[r.k] = r; });
      var up = [];
      SYNC_KEYS.forEach(function (k) {
        var sv = server[k], st = sv ? Date.parse(sv.updated_at) : 0, lt = m.t[k] || 0, local = localStorage.getItem(k);
        if (sv && (st > lt || (local == null && !m.dirty[k]))) {
          applying = true; try { localStorage.setItem(k, JSON.stringify(sv.v)); } catch (e) {} applying = false;
          m.t[k] = st; delete m.dirty[k]; changed = true;
        } else if (local != null && (m.dirty[k] || !sv || lt > st)) {
          var val; try { val = JSON.parse(local); } catch (e) { return; }
          up.push({ user_id: uidv, k: k, v: val, updated_at: new Date(lt || Date.now()).toISOString() });
        }
      });
      var p = up.length ? api("POST", "user_data?on_conflict=user_id,k", up, { prefer: "resolution=merge-duplicates,return=minimal" }) : Promise.resolve();
      return p.then(function () { up.forEach(function (u) { delete m.dirty[u.k]; }); m.last = Date.now(); setMeta(m); renderAccount(); return changed; });
    }).catch(function (e) { if (opts && opts.verbose) toast("Synchronisation impossible : " + e.message); return false; })
      .then(function (ch) { syncing = null; if (ch && opts && opts.reloadOnChange) { toast("Tes données ont été restaurées"); setTimeout(function () { location.reload(); }, 900); } return ch; });
    return syncing;
  };
  window.addEventListener("online", function () { if (C.user()) C.sync(); });
  document.addEventListener("visibilitychange", function () { if (!document.hidden && C.user()) C.sync(); });

  // ---------------- Réglages > Mon compte ----------------
  // Écrans : login (e-mail + mot de passe), signup, code (confirmation de l'adresse), forgot (code + nouveau mot de passe), otp (connexion par code)
  var acc = { mode: "login", email: "", news: false };
  var PW_MIN = 8;
  function pwField(id, ph, ac) {
    return '<div class="pw-row"><input type="password" id="' + id + '" autocomplete="' + ac + '" placeholder="' + ph + '" minlength="' + PW_MIN + '">' +
      '<button type="button" class="link-btn pw-eye" data-pw-eye="' + id + '" aria-pressed="false">Afficher</button></div>';
  }
  function emailField(v) { return '<input type="email" id="accEmail" autocomplete="email" autocapitalize="off" spellcheck="false" placeholder="ton@adresse.be" value="' + esc(v || "") + '">'; }
  function errMsg(er) {
    var m = String((er && er.message) || "");
    if (/invalid login credentials/i.test(m)) return "E-mail ou mot de passe incorrect";
    if (/already registered|already exists/i.test(m)) return "Un compte existe déjà avec cette adresse : connecte-toi, ou utilise « Mot de passe oublié »";
    if (/email not confirmed/i.test(m)) return "Adresse pas encore confirmée : entre le code reçu par e-mail";
    if (/password.*(at least|short|characters)|weak/i.test(m)) return "Mot de passe trop court ou trop simple (8 caractères minimum)";
    if (/rate limit|too many|security purposes/i.test(m)) return "Trop d'essais : attends une minute et réessaie";
    if (/expired|invalid.*(otp|token)|token.*(invalid|expired)/i.test(m)) return "Code incorrect ou expiré";
    return m || "Erreur";
  }
  function renderAccount() {
    var box = $("#accountBox"); if (!box) return;
    var u = C.user(), m = meta(), h = "";
    if (u) {
      h = '<p class="acc-who">' + ic("rentre", "ic-in") + " " + esc(tr("Connecté :")) + " <b>" + esc(u.email || "") + "</b></p>" +
        '<p class="tiny muted">' + esc(tr("Dernière sauvegarde :")) + " " + esc(m.last ? new Date(m.last).toLocaleString((window.SYLVA_LOCALE || "fr-BE")) : tr("jamais")) + ". " + esc(tr("Tes infos médicales restent uniquement sur ce téléphone.")) + "</p>" +
        '<div class="row"><button type="button" class="btn" id="accSync">Synchroniser</button><button type="button" class="btn" id="accOut">Se déconnecter</button></div>' +
        '<label class="check-row"><input type="checkbox" id="accNews"' + (profile && profile.news_optin ? " checked" : "") + '> <span>Recevoir les nouvelles de Bivaska par e-mail (quelques fois par an, désinscription en un clic)</span></label>' +
        (acc.mode === "newpw" ? pwField("accPw", "Nouveau mot de passe", "new-password") + '<div class="row"><button type="button" class="btn btn-primary" id="accPwSave">Enregistrer le mot de passe</button><button type="button" class="link-btn" data-acc="login">Annuler</button></div>'
          : '<button type="button" class="link-btn" data-acc="newpw">Changer de mot de passe</button>') +
        '<button type="button" class="link-btn danger-link" id="accDel">Supprimer mon compte</button>';
      box.innerHTML = h; return;
    }
    var intro = '<p class="tiny muted">Facultatif : sauvegarde tes spots, ton journal, ton kit et tes progrès, et retrouve-les sur un autre téléphone. Bivaska marche aussi sans compte.</p>';
    var codeIn = '<input type="text" id="accCode" inputmode="numeric" autocomplete="one-time-code" maxlength="10" placeholder="Code à 6 chiffres">';
    var sent = '<p class="tiny muted">' + esc(tr("Code envoyé à")) + " <b>" + esc(acc.email) + "</b>. " + esc(tr("Regarde aussi les courriers indésirables.")) + "</p>";
    if (acc.mode === "signup") {
      h = intro + '<div class="acc-form">' + emailField(acc.email) + pwField("accPw", "Mot de passe (8 caractères minimum)", "new-password") +
        '<label class="check-row"><input type="checkbox" id="accNewsNew"' + (acc.news ? " checked" : "") + '> <span>Recevoir les nouvelles de Bivaska par e-mail (facultatif, désinscription en un clic)</span></label>' +
        '<button type="button" class="btn btn-primary" id="accSignup">Créer mon compte</button></div>' +
        '<p class="tiny muted">Un code de confirmation sera envoyé à ton adresse.</p>' +
        '<button type="button" class="link-btn" data-acc="login">J\'ai déjà un compte</button>';
    } else if (acc.mode === "code") {
      h = sent + '<div class="acc-form">' + codeIn + '<button type="button" class="btn btn-primary" id="accConfirm">Confirmer</button></div>' +
        '<button type="button" class="link-btn" id="accResend">Renvoyer le code</button> <button type="button" class="link-btn" data-acc="login">Changer d\'adresse</button>';
    } else if (acc.mode === "forgot") {
      h = acc.sentForgot
        ? sent + '<div class="acc-form">' + codeIn + pwField("accPw", "Nouveau mot de passe", "new-password") + '<button type="button" class="btn btn-primary" id="accReset">Changer le mot de passe</button></div>' +
          '<button type="button" class="link-btn" data-acc="login">Annuler</button>'
        : '<p class="tiny muted">Entre ton adresse : tu recevras un code pour choisir un nouveau mot de passe.</p><div class="acc-form">' + emailField(acc.email) +
          '<button type="button" class="btn btn-primary" id="accForgot">Recevoir un code</button></div><button type="button" class="link-btn" data-acc="login">Annuler</button>';
    } else if (acc.mode === "otp") {
      h = acc.sentOtp
        ? sent + '<div class="acc-form">' + codeIn + '<button type="button" class="btn btn-primary" id="accVerify">Valider</button></div><button type="button" class="link-btn" data-acc="login">Annuler</button>'
        : '<p class="tiny muted">Sans mot de passe : un code à usage unique est envoyé à chaque connexion.</p><div class="acc-form">' + emailField(acc.email) +
          '<button type="button" class="btn btn-primary" id="accSend">Recevoir un code</button></div><button type="button" class="link-btn" data-acc="login">Annuler</button>';
    } else {
      h = intro + '<div class="acc-form">' + emailField(acc.email) + pwField("accPw", "Mot de passe", "current-password") +
        '<button type="button" class="btn btn-primary" id="accLogin">Se connecter</button></div>' +
        '<div class="acc-links"><button type="button" class="link-btn" data-acc="signup">Créer un compte</button>' +
        '<button type="button" class="link-btn" data-acc="forgot">Mot de passe oublié ?</button>' +
        '<button type="button" class="link-btn" data-acc="otp">Recevoir un code à la place</button></div>';
    }
    box.innerHTML = h;
  }
  function readEmail() {
    var el = $("#accEmail"), em = ((el && el.value) || acc.email || "").trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) { toast("Adresse e-mail invalide"); return null; }
    if (!navigator.onLine) { toast("Il faut du réseau pour se connecter"); return null; }
    acc.email = em; return em;
  }
  function readPw() { var pw = ($("#accPw") || {}).value || ""; if (pw.length < PW_MIN) { toast("Mot de passe trop court ou trop simple (8 caractères minimum)"); return null; } return pw; }
  function readCode() { var c = (($("#accCode") || {}).value || "").replace(/\s/g, ""); if (c.length < 6) { toast("Entre le code reçu par e-mail"); return null; } return c; }
  function loggedIn(msg) {
    acc = { mode: "login", email: "", news: false }; profile = null;
    toast(msg || "Connecté");
    ensureProfile().then(function (p) {
      // Accord donné à la création du compte : enregistré dans le profil (avec la date, par la base)
      var u = getSess() || {}; var want = u.newsAtSignup;
      if (p && want && !p.news_optin) return setNews(true);
    }).then(renderAccount);
    renderAccount(); C.sync({ reloadOnChange: true, verbose: true });
  }
  function setNews(on) {
    return ensureProfile().then(function (p) {
      if (!p) throw new Error("profil");
      return api("PATCH", "profiles?id=eq." + p.id, { news_optin: !!on }, { prefer: "return=minimal" }).then(function () { p.news_optin = !!on; });
    });
  }
  function busy(t, p) { t.disabled = true; return p.catch(function (er) { toast(errMsg(er)); }).then(function () { if (document.body.contains(t)) t.disabled = false; }); }
  document.addEventListener("click", function (e) {
    var eye = e.target.closest("[data-pw-eye]");
    if (eye) { var f = document.getElementById(eye.dataset.pwEye); if (f) { var show = f.type === "password"; f.type = show ? "text" : "password"; eye.textContent = tr(show ? "Masquer" : "Afficher"); eye.setAttribute("aria-pressed", String(show)); } return; }
    var go = e.target.closest("[data-acc]");
    if (go && go.closest("#accountBox")) { var em0 = $("#accEmail"); if (em0 && em0.value) acc.email = em0.value.trim().toLowerCase(); acc.mode = go.dataset.acc; acc.sentForgot = acc.sentOtp = false; renderAccount(); return; }
    var t = e.target.closest("button"); if (!t) return;
    var em, pw, code;
    if (t.id === "accLogin") {
      if (!(em = readEmail()) || !(pw = readPw())) return;
      busy(t, C.login(em, pw).then(function () { loggedIn(); }).catch(function (er) {
        if (/email not confirmed/i.test(er.message)) { acc.mode = "code"; C.resendSignup(em).catch(function () {}); renderAccount(); }
        throw er;
      }));
    } else if (t.id === "accSignup") {
      if (!(em = readEmail()) || !(pw = readPw())) return;
      acc.news = !!($("#accNewsNew") || {}).checked;
      busy(t, C.signup(em, pw, acc.news).then(function (j) {
        if (C.user()) { var s1 = getSess(); s1.newsAtSignup = acc.news; setSess(s1); loggedIn("Compte créé"); return; }
        acc.mode = "code"; renderAccount();
      }));
    } else if (t.id === "accConfirm") {
      if (!(code = readCode())) return;
      busy(t, C.verifySignup(acc.email, code).then(function () { var s2 = getSess(); s2.newsAtSignup = acc.news; setSess(s2); loggedIn("Compte confirmé"); }));
    } else if (t.id === "accResend") {
      busy(t, C.resendSignup(acc.email).then(function () { toast("Code renvoyé"); }));
    } else if (t.id === "accForgot") {
      if (!(em = readEmail())) return;
      busy(t, C.recover(em).then(function () { acc.sentForgot = true; renderAccount(); }));
    } else if (t.id === "accReset") {
      if (!(code = readCode()) || !(pw = readPw())) return;
      busy(t, C.verifyRecovery(acc.email, code).then(function () { return C.setPassword(pw); }).then(function () { loggedIn("Mot de passe changé"); }));
    } else if (t.id === "accSend") {
      if (!(em = readEmail())) return;
      busy(t, C.sendCode(em).then(function () { acc.sentOtp = true; renderAccount(); }));
    } else if (t.id === "accVerify") {
      if (!(code = readCode())) return;
      busy(t, C.verifyCode(acc.email, code).then(function () { loggedIn(); }));
    } else if (t.id === "accPwSave") {
      if (!(pw = readPw())) return;
      busy(t, C.setPassword(pw).then(function () { acc.mode = "login"; toast("Mot de passe enregistré"); renderAccount(); }));
    }
    else if (t.id === "accSync") { C.sync({ verbose: true, reloadOnChange: true }).then(function () { toast("Synchronisé"); }); }
    else if (t.id === "accOut") { C.logout().then(function () { profile = null; toast("Déconnecté. Tes données restent sur ce téléphone."); renderAccount(); }); }
    else if (t.id === "accDel") {
      if (!t.dataset.sure) { t.dataset.sure = "1"; t.textContent = tr("Confirmer : tout supprimer en ligne (spots partagés, avis, sauvegarde)"); return; }
      C.deleteAccount().then(function () { profile = null; toast("Compte supprimé. Les données de ce téléphone sont conservées."); renderAccount(); }).catch(function (er) { toast("Suppression impossible : " + er.message); });
    }
  });
  document.addEventListener("change", function (e) {
    if (e.target.id !== "accNews") return;
    var on = e.target.checked;
    setNews(on).then(function () { toast(on ? "Inscrit aux nouvelles par e-mail" : "Désinscrit des nouvelles par e-mail"); })
      .catch(function () { e.target.checked = !on; toast("Impossible pour l'instant : réessaie avec du réseau"); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Enter" || !e.target.closest || !e.target.closest("#accountBox")) return;
    var b = $("#accountBox .btn-primary"); if (b) { e.preventDefault(); b.click(); }
  });

  // Pseudo public (obligatoire pour partager)
  var profile = null;
  function ensureProfile() {
    var u = C.user(); if (!u) return Promise.resolve(null);
    if (profile && profile.id === u.id) return Promise.resolve(profile);
    // rpc/my_profile (securite.sql) ; ancienne lecture directe en secours tant que le SQL n'est pas passé
    return api("POST", "rpc/my_profile", {}).catch(function () { return api("GET", "profiles?select=id,pseudo,trusted,is_admin,banned,news_optin&id=eq." + u.id); })
      .then(function (r) { profile = (r && r[0]) || { id: u.id }; return profile; }).catch(function () { return null; });
  }
  function askPseudo() {
    return ensureProfile().then(function (p) {
      if (p && p.pseudo) return p;
      var ps = (window.prompt("Choisis un pseudo public (2 à 30 caractères, pas ton nom complet) :") || "").trim();
      if (ps.length < 2 || ps.length > 30 || textOk(ps) !== true) { toast("Pseudo refusé"); throw new Error("pseudo"); }
      if (!p) throw new Error("profil");
      return api("PATCH", "profiles?id=eq." + p.id, { pseudo: ps }, { prefer: "return=minimal" }).then(function () { p.pseudo = ps; return p; })
        .catch(function (er) { toast(/duplicate|unique/i.test(er.message) ? "Ce pseudo est déjà pris" : "Pseudo refusé (lettres, chiffres, espaces ; pas de nom réservé)"); throw er; });
    });
  }
  function needLogin(msg) {
    if (C.user()) return false;
    toast(msg || "Crée un compte gratuit (Réglages) pour participer");
    A.openModal("#modalSettings"); renderAccount(); return true;
  }

  // ---------------- Signaler une erreur ----------------
  C.openReport = function (kind, id, title) {
    $("#repKind").value = kind; $("#repTarget").value = id; $("#repTitle").textContent = title || id;
    $("#repMsg").value = ""; $("#repMotif").value = "securite"; A.openModal("#modalReport");
  };
  $("#formReport").addEventListener("submit", function (e) {
    e.preventDefault();
    var msg = $("#repMsg").value.trim();
    if (msg.length < 5) { toast("Décris l'erreur en quelques mots"); return; }
    if (!navigator.onLine) { toast("Pas de réseau : réessaie plus tard"); return; }
    var u = C.user();
    api("POST", "reports", { user_id: u ? u.id : null, kind: $("#repKind").value, target: $("#repTarget").value, motif: $("#repMotif").value, message: msg, app_version: A.version }, { prefer: "return=minimal" })
      .then(function () { A.closeModal($("#modalReport")); toast("Merci ! Ton signalement sera vérifié."); })
      .catch(function (er) { toast("Envoi impossible : " + er.message); });
  });

  // ---------------- Idées ----------------
  var myVotes = {};
  function renderIdeas() {
    $("#ideasList").innerHTML = '<p class="tiny muted">Chargement…</p>';
    var u = C.user();
    Promise.all([api("GET", "idea_scores?select=id,titre,detail,status,votes&order=votes.desc,created_at.desc&limit=60"),
      u ? api("GET", "idea_votes?select=idea_id&user_id=eq." + u.id) : Promise.resolve([])]).then(function (r) {
      myVotes = {}; (r[1] || []).forEach(function (v) { myVotes[v.idea_id] = 1; });
      var ST = { open: "", planned: "Prévu", done: "Fait", pending: "En relecture" };
      $("#ideasList").innerHTML = (r[0] || []).length ? r[0].map(function (i) {
        return '<div class="idea"><button type="button" class="idea-vote' + (myVotes[i.id] ? " on" : "") + '" data-vote="' + i.id + '" aria-label="Voter">▲<b>' + i.votes + '</b></button><div><b>' + esc(i.titre) + "</b>" +
          (ST[i.status] ? '<span class="idea-st">' + ST[i.status] + "</span>" : "") + (i.detail ? "<p>" + esc(i.detail) + "</p>" : "") + "</div></div>";
      }).join("") : '<p class="tiny muted">Aucune idée pour l\'instant : sois le premier !</p>';
    }).catch(function () { $("#ideasList").innerHTML = '<p class="tiny muted">Idées indisponibles hors ligne.</p>'; });
  }
  C.openIdeas = function () { A.closeModal($("#modalSettings")); A.openModal("#modalIdeas"); renderIdeas(); };
  $("#ideasList").addEventListener("click", function (e) {
    var b = e.target.closest("[data-vote]"); if (!b || needLogin("Crée un compte gratuit pour voter")) return;
    var id = b.dataset.vote, u = C.user();
    (myVotes[id] ? api("DELETE", "idea_votes?idea_id=eq." + id + "&user_id=eq." + u.id) : api("POST", "idea_votes", { idea_id: id, user_id: u.id }, { prefer: "return=minimal" }))
      .then(renderIdeas).catch(function (er) { toast(er.message); });
  });
  $("#formIdea").addEventListener("submit", function (e) {
    e.preventDefault(); if (needLogin("Crée un compte gratuit pour proposer une idée")) return;
    var t = $("#ideaTitle").value.trim(), d = $("#ideaDetail").value.trim();
    if (t.length < 5) { toast("Titre trop court"); return; }
    var ok = textOk(t + " " + d); if (ok !== true) { toast(ok); return; }
    api("POST", "ideas", { user_id: C.user().id, titre: t, detail: d || null }, { prefer: "return=minimal" })
      .then(function () { $("#ideaTitle").value = ""; $("#ideaDetail").value = ""; toast("Merci ! Ton idée sera visible après relecture."); renderIdeas(); })
      .catch(function (er) { toast(er.message); });
  });

  // ---------------- Communauté : carte des spots partagés ----------------
  var STATUTS = { aire_officielle: "Aire de bivouac officielle", terrain_prive_accord: "Terrain privé, avec accord du propriétaire", camping: "Camping", zone_toleree: "Zone où le bivouac est autorisé ou toléré" };
  var RULES = {
    BE: "Belgique : bivouac interdit en forêt hors des aires prévues (Wallonie : aires de bivouac du DNF ; Flandre : « paalkampeerplaatsen »).",
    FR: "France : réglementation variable (souvent toléré une nuit, du coucher au lever du soleil, loin des routes ; interdit dans de nombreux parcs et réserves).",
    LU: "Luxembourg : camping sauvage interdit, utiliser les campings et aires prévues.",
    NL: "Pays-Bas : camping sauvage interdit, utiliser les « paalkampeerplaatsen » et campings.",
    DE: "Allemagne : camping sauvage en principe interdit, règles différentes selon les Länder.",
    CH: "Suisse : souvent toléré au-dessus de la limite des forêts, interdit dans les réserves et districts francs.",
    XX: "Renseigne-toi sur les règles locales avant de dormir quelque part."
  };
  var comLayer = null, lastBox = "";
  function comIcon() { return A.pinIcon("#6B4BA3", ic("pin")); }
  function loadCommunity(map) {
    if (!comLayer || !map.hasLayer(comLayer) || !navigator.onLine) return;
    var b = map.getBounds(), z = map.getZoom(); if (z < 7) return;
    var key = [b.getSouth(), b.getWest(), b.getNorth(), b.getEast()].map(function (x) { return x.toFixed(2); }).join(",");
    if (key === lastBox) return; lastBox = key;
    api("GET", "community_spots?select=id,lat,lon,titre,statut,country&status=eq.published&lat=gte." + b.getSouth() + "&lat=lte." + b.getNorth() + "&lon=gte." + b.getWest() + "&lon=lte." + b.getEast() + "&limit=300")
      .then(function (rows) {
        comLayer.clearLayers();
        (rows || []).forEach(function (s) {
          L.marker([s.lat, s.lon], { icon: comIcon() }).on("click", function () { openCommunitySpot(s.id); }).addTo(comLayer);
        });
      }).catch(function () { lastBox = ""; });
  }
  function setupMap() {
    var map = mapRef.map, layers = mapRef.layers;
    comLayer = layers.communaute = L.layerGroup();
    if (A.load("sylva_layer_communaute", false)) comLayer.addTo(map);
    var chip = document.querySelector('.map-chips [data-layer="communaute"]');
    if (chip) {
      chip.hidden = false; chip.classList.toggle("on", map.hasLayer(comLayer));
      chip.addEventListener("click", function () { setTimeout(function () { A.save("sylva_layer_communaute", map.hasLayer(comLayer)); lastBox = ""; loadCommunity(map); }, 0); });
    }
    map.on("moveend", function () { loadCommunity(map); });
    setTimeout(function () { loadCommunity(map); }, 500);
    map.on("popupopen", function (e) {
      var sb = e.popup.getElement().querySelector("[data-share-spot]");
      if (sb) sb.addEventListener("click", function () { openShare(sb.getAttribute("data-share-spot")); });
    });
    A.renderSpots();
  }

  function stars(n) { n = Math.round(n || 0); return "★★★★★".slice(0, n) + "☆☆☆☆☆".slice(0, 5 - n); }
  var curSpot = null;
  function openCommunitySpot(id) {
    A.openModal("#modalCommu"); $("#comBody").innerHTML = '<p class="tiny muted">Chargement…</p>';
    Promise.all([
      api("GET", "community_spots?select=*,profiles(pseudo)&id=eq." + id),
      api("GET", "spot_summary?spot_id=eq." + id),
      api("GET", "spot_reviews?select=id,note,calme,proprete,encore_ok,commentaire,visite,created_at,profiles(pseudo)&spot_id=eq." + id + "&order=created_at.desc&limit=30"),
      api("GET", "spot_photos?select=path&spot_id=eq." + id + "&status=eq.published&limit=6")
    ]).then(function (r) {
      var s = r[0] && r[0][0]; if (!s) { $("#comBody").innerHTML = "<p>Ce spot n'est plus disponible.</p>"; return; }
      curSpot = s; var sum = (r[1] && r[1][0]) || {};
      var feats = [[s.eau, "Eau à proximité"], [s.abri, "Abri"], [s.feu_autorise, "Feu autorisé"], [s.acces_voiture, "Accès voiture"]].filter(function (f) { return f[0]; }).map(function (f) { return '<span class="chip">' + f[1] + "</span>"; }).join("");
      var h = "<h2>" + esc(s.titre) + '</h2><p class="com-statut">' + ic("rentre", "ic-in") + " " + esc(STATUTS[s.statut] || s.statut) + "</p>" +
        (sum.n_avis ? '<p class="com-note"><span class="stars">' + stars(sum.note_moy) + "</span> " + sum.note_moy + " · " + sum.n_avis + " avis" + (sum.dernier_passage ? " · dernier passage " + new Date(sum.dernier_passage).toLocaleDateString((window.SYLVA_LOCALE || "fr-BE")) : "") + "</p>" : '<p class="tiny muted">Pas encore d\'avis.</p>') +
        (sum.n_disparu > 0 ? '<div class="alert alert-warn">' + sum.n_disparu + " personne(s) signalent que ce spot n'existe plus ou a changé.</div>" : "") +
        (feats ? '<div class="chips">' + feats + "</div>" : "") +
        (s.description ? "<p>" + esc(s.description) + "</p>" : "") +
        '<div class="com-photos" id="comPhotos"></div>' +
        '<p class="tiny muted">Partagé par ' + esc((s.profiles && s.profiles.pseudo) || "un membre") + " · " + esc(RULES[s.country] || RULES.XX) + "</p>" +
        '<div class="row"><button type="button" class="btn" id="comSave">Ajouter à mes spots</button><button type="button" class="btn btn-primary" id="comReview">Donner mon avis</button></div>' +
        '<h3>Avis</h3>' + ((r[2] || []).length ? r[2].map(function (v) {
          return '<div class="com-rev"><b>' + esc((v.profiles && v.profiles.pseudo) || "Membre") + '</b> <span class="stars">' + stars(v.note) + "</span>" + (v.encore_ok ? "" : ' <span class="idea-st">N\'existe plus</span>') +
            (v.commentaire ? "<p>" + esc(v.commentaire) + "</p>" : "") + '<small>' + (v.visite ? "Visité le " + new Date(v.visite).toLocaleDateString((window.SYLVA_LOCALE || "fr-BE")) : new Date(v.created_at).toLocaleDateString((window.SYLVA_LOCALE || "fr-BE"))) +
            ' · <button type="button" class="link-btn" data-rep-avis="' + v.id + '">Signaler</button></small></div>';
        }).join("") : '<p class="tiny muted">Aucun avis.</p>') +
        '<button type="button" class="link-btn danger-link" id="comReport">Signaler ce spot</button>';
      $("#comBody").innerHTML = h;
      (r[3] || []).forEach(function (p) {
        fresh().then(function () { return http("POST", "/storage/v1/object/sign/spot-photos/" + p.path.split("/").map(encodeURIComponent).join("/"), { expiresIn: 3600 }); }).then(function (j) {
          if (j && j.signedURL) { var im = document.createElement("img"); im.src = URL_ + "/storage/v1" + j.signedURL; im.alt = "Photo du spot"; im.loading = "lazy"; $("#comPhotos").appendChild(im); }
        }).catch(function () {});
      });
    }).catch(function () { $("#comBody").innerHTML = "<p>Impossible de charger ce spot (réseau ?).</p>"; });
  }
  $("#comBody").addEventListener("click", function (e) {
    var t = e.target.closest("button"); if (!t || !curSpot) return;
    if (t.id === "comSave") {
      var all = A.getSpots();
      all.push({ id: A.uid(), lat: curSpot.lat, lon: curSpot.lon, type: "bivouac", note: curSpot.titre, date: new Date().toISOString() });
      A.save("sylva_spots", all); A.renderSpots(); toast("Ajouté à tes spots (disponible hors ligne)");
    } else if (t.id === "comReview") {
      if (needLogin("Crée un compte gratuit pour donner ton avis")) return;
      $("#revNote").value = "4"; $("#revCalme").value = ""; $("#revProp").value = ""; $("#revOk").checked = true; $("#revTxt").value = ""; $("#revDate").value = new Date().toISOString().slice(0, 10);
      A.openModal("#modalReview");
    } else if (t.id === "comReport") { C.openReport("spot", curSpot.id, curSpot.titre); }
    else if (t.dataset.repAvis) { C.openReport("avis", t.dataset.repAvis, "Avis sur " + curSpot.titre); }
  });
  $("#formReview").addEventListener("submit", function (e) {
    e.preventDefault(); if (!curSpot || needLogin()) return;
    var txt = $("#revTxt").value.trim(), ok = textOk(txt); if (ok !== true) { toast(ok); return; }
    askPseudo().then(function () {
      return api("POST", "spot_reviews?on_conflict=spot_id,user_id", { spot_id: curSpot.id, user_id: C.user().id, note: +$("#revNote").value,
        calme: +$("#revCalme").value || null, proprete: +$("#revProp").value || null, encore_ok: $("#revOk").checked, commentaire: txt || null, visite: $("#revDate").value || null },
        { prefer: "resolution=merge-duplicates,return=minimal" });
    }).then(function () { A.closeModal($("#modalReview")); toast("Merci pour ton avis !"); openCommunitySpot(curSpot.id); })
      .catch(function (er) { if (er.message !== "pseudo") toast("Envoi impossible : " + er.message); });
  });

  // ---------------- Partager un de mes spots ----------------
  var shareId = null;
  function openShare(id) {
    if (needLogin("Crée un compte gratuit pour partager un spot")) return;
    var s = A.getSpots().filter(function (x) { return x.id === id; })[0]; if (!s) return;
    shareId = id; var map = A.getMap(); if (map) map.closePopup();
    $("#shTitre").value = (s.note || "").slice(0, 60); $("#shDesc").value = ""; $("#shStatut").value = "";
    ["shEau", "shAbri", "shFeu", "shVoit", "shCgu"].forEach(function (k) { $("#" + k).checked = false; });
    $("#shPhoto").checked = !!s.photo; $("#shPhotoRow").hidden = !s.photo;
    $("#shRule").textContent = RULES[A.getCountry()] || RULES.XX;
    A.openModal("#modalShare");
  }
  $("#formShare").addEventListener("submit", function (e) {
    e.preventDefault();
    var s = A.getSpots().filter(function (x) { return x.id === shareId; })[0]; if (!s) return;
    var titre = $("#shTitre").value.trim(), desc = $("#shDesc").value.trim(), statut = $("#shStatut").value;
    if (!statut) { toast("Choisis le statut du lieu"); return; }
    if (titre.length < 3) { toast("Donne un titre au spot"); return; }
    if (!$("#shCgu").checked) { toast("Accepte les règles de partage"); return; }
    var ok = textOk(titre + " " + desc); if (ok !== true) { toast(ok); return; }
    if (!navigator.onLine) { toast("Il faut du réseau pour partager"); return; }
    var sendPhoto = $("#shPhoto").checked && s.photo;
    askPseudo().then(function () {
      return api("POST", "community_spots", { user_id: C.user().id, lat: +s.lat.toFixed(5), lon: +s.lon.toFixed(5), country: A.getCountry(), statut: statut, titre: titre, description: desc || null,
        eau: $("#shEau").checked, abri: $("#shAbri").checked, feu_autorise: $("#shFeu").checked, acces_voiture: $("#shVoit").checked }, { prefer: "return=representation" });
    }).then(function (rows) {
      var row = rows && rows[0];
      if (!sendPhoto || !row) return row;
      return A.spotPhotoUrl(s.id).then(function (u) { return u ? fetch(u).then(function (r) { return r.blob(); }) : null; }).then(function (blob) {
        if (!blob) return row;
        var path = C.user().id + "/" + row.id + "-" + Date.now() + ".jpg";
        return fresh().then(function (ss) {
          return fetch(URL_ + "/storage/v1/object/spot-photos/" + path, { method: "POST", headers: { apikey: KEY, Authorization: "Bearer " + ss.access_token, "Content-Type": "image/jpeg" }, body: blob });
        }).then(function () { return api("POST", "spot_photos", { spot_id: row.id, user_id: C.user().id, path: path }, { prefer: "return=minimal" }); }).then(function () { return row; });
      });
    }).then(function (row) {
      A.closeModal($("#modalShare"));
      toast(row && row.status === "published" ? "Spot publié, merci !" : "Merci ! Ton spot sera visible après une rapide vérification.");
    }).catch(function (er) { if (er.message !== "pseudo") toast("Partage impossible : " + er.message); });
  });

  C.openSpot = openCommunitySpot; C.openShare = openShare;
  // ---------------- Démarrage ----------------
  var btnAcc = document.getElementById("btnSettings");
  if (btnAcc) btnAcc.addEventListener("click", function () { setTimeout(renderAccount, 0); });
  var acc = document.getElementById("accountSection"); if (acc) acc.hidden = false;
  var soon = document.getElementById("accountSoon"); if (soon) soon.hidden = true;
  var bi = document.getElementById("btnIdeas"); if (bi) { bi.hidden = false; bi.addEventListener("click", C.openIdeas); }
  renderAccount();
  if (C.user()) setTimeout(function () { C.sync(); }, 3000);
  uiReady = true; if (mapRef) setupMap();
  }
})();
