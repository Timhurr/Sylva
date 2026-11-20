/* Bivaska – langues (v0.9.103).
   L'appli est écrite en français. En anglais, on traduit :
   - le contenu (fiches, espèces, guide) au niveau des données : fichiers i18n/en_*.js (SYLVA_EN.content), fusionnés par i18n_apply.js juste avant app.js ;
   - l'interface au niveau de l'écran : chaque texte affiché est cherché dans le dictionnaire SYLVA_EN.ui (texte français exact → anglais).
     Les nombres sont remplacés par « # » pour retrouver les phrases qui en contiennent (« À 3 km de toi » → « À # km de toi »).
   Choix de la langue : Réglages > Langue (clé sylva_lang), sinon la langue du téléphone (français si fr-*, anglais sinon). */
(function () {
  "use strict";
  var lang = null;
  try { lang = JSON.parse(localStorage.getItem("sylva_lang") || "null"); } catch (e) {}
  if (lang !== "fr" && lang !== "en") lang = /^fr\b/i.test(navigator.language || "fr") ? "fr" : "en";
  window.SYLVA_LANG = lang;
  window.SYLVA_LOCALE = lang === "en" ? "en-GB" : "fr-BE";
  document.documentElement.lang = lang;
  window.SYLVA_EN = window.SYLVA_EN || { ui: {}, content: {} };
  if (lang === "fr") { window.T = function (s) { return s; }; return; }

  // Dictionnaires anglais : chargés seulement en anglais (bloquant, avant les données)
  ["i18n/en_ui.js", "i18n/en_content.js"].forEach(function (f) { document.write('<script src="' + f + '"><\/script>'); });

  var NUM = /\d+(?:[.,]\d+)?/g;
  // Mois et jours : « % » dans les modèles (« # espèces présentes en % » → « # species present in % »)
  var FR_W = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre","lundi","mardi","mercredi","jeudi","vendredi","samedi","dimanche"];
  var EN_W = ["January","February","March","April","May","June","July","August","September","October","November","December","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  var WRE = new RegExp("\\b(" + FR_W.join("|") + ")\\b", "gi");
  function wEn(w) { var i = FR_W.indexOf(w.toLowerCase()); if (i < 0) return w; var e = EN_W[i]; return w[0] === w[0].toUpperCase() ? e : e; }
  function norm(s) { return s.replace(/\s+/g, " ").trim(); }
  function lookup(s) {
    var D = window.SYLVA_EN.ui, k = norm(s);
    if (!k || !/[A-Za-zÀ-ÿ]/.test(k)) return null;
    if (Object.prototype.hasOwnProperty.call(D, k)) return D[k];
    var nums = k.match(NUM) || [], words = k.match(WRE) || [];
    if (nums.length || words.length) {
      var tpl = k.replace(NUM, "#").replace(WRE, "%");
      if (Object.prototype.hasOwnProperty.call(D, tpl)) {
        var i = 0, j = 0;
        return D[tpl].replace(/[#%]/g, function (c) { return c === "#" ? (nums[i++] || "#") : wEn(words[j++] || "%"); });
      }
      // Date seule (« Vendredi 20 novembre ») : mots traduits sur place
      if (words.length && /^[\s\d,.:h%#]*$/.test(tpl.replace(/%/g, ""))) return k.replace(WRE, wEn);
    }
    return null;
  }
  // T(texte) : pour les textes hors de l'écran (SMS, voix, boîtes de dialogue)
  window.T = function (s) { if (s == null) return s; var r = lookup(String(s)); return r == null ? s : r; };
  window.SYLVA_T_MISS = {};

  var ATTRS = ["placeholder", "aria-label", "title", "alt"];
  var SKIP = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, CODE: 1 };
  function trText(n) {
    var v = n.nodeValue; if (!v || !/[A-Za-zÀ-ÿ]/.test(v)) return;
    var r = lookup(v);
    if (r != null) { var lead = v.match(/^\s*/)[0], trail = v.match(/\s*$/)[0]; if (lead + r + trail !== v) n.nodeValue = lead + r + trail; }
    else if (/[àâçéèêëîïôûùœ]|\b(le|la|les|des|du|une|ton|tes|pour|avec)\b/i.test(v)) window.SYLVA_T_MISS[norm(v)] = 1;
  }
  function trEl(el) {
    if (el.closest && el.closest("[data-no-i18n]")) return;
    for (var i = 0; i < ATTRS.length; i++) {
      var a = el.getAttribute && el.getAttribute(ATTRS[i]);
      if (a) { var r = lookup(a); if (r != null && r !== a) el.setAttribute(ATTRS[i], r); }
    }
    if ((el.tagName === "INPUT" && (el.type === "button" || el.type === "submit")) && el.value) { var r2 = lookup(el.value); if (r2 != null) el.value = r2; }
  }
  function walk(root) {
    if (!root) return;
    if (root.nodeType === 3) { if (!(root.parentNode && SKIP[root.parentNode.nodeName]) && !(root.parentNode && root.parentNode.closest && root.parentNode.closest("[data-no-i18n]"))) trText(root); return; }
    if (root.nodeType !== 1 || SKIP[root.nodeName]) return;
    trEl(root);
    var tw = document.createTreeWalker(root, 5, null), n;
    while ((n = tw.nextNode())) {
      if (n.nodeType === 1) { if (SKIP[n.nodeName]) continue; trEl(n); }
      else if (!SKIP[n.parentNode.nodeName] && !(n.parentNode.closest && n.parentNode.closest("[data-no-i18n]"))) trText(n);
    }
  }
  window.SYLVA_TRANSLATE = walk;
  function start() {
    walk(document.body);
    document.title = window.T(document.title);
    new MutationObserver(function (ms) {
      for (var i = 0; i < ms.length; i++) {
        var m = ms[i];
        if (m.type === "childList") for (var j = 0; j < m.addedNodes.length; j++) walk(m.addedNodes[j]);
        else if (m.type === "characterData") trText(m.target);
        else if (m.type === "attributes") trEl(m.target);
      }
    }).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();

  // Boîtes de dialogue natives
  ["alert", "confirm", "prompt"].forEach(function (f) {
    var o = window[f]; if (!o) return;
    window[f] = function (msg, def) { return o.call(window, window.T(msg), def); };
  });
})();
