/* Bivaska – applique la traduction du contenu (fiches, espèces, guide) avant app.js. Rien en français. */
(function () {
  if (!window.SYLVA_LANG || window.SYLVA_LANG === "fr") return;
  var C = (window.SYLVA_EN && window.SYLVA_EN.content) || {};
  function merge(list, tr) {
    if (!list || !tr) return;
    list.forEach(function (o) { var t = tr[o.id]; if (!t) return; for (var k in t) if (Object.prototype.hasOwnProperty.call(t, k)) o[k] = t[k]; o._en = true; });
  }
  merge(window.SYLVA_TECHNIQUES, C.techs);
  merge(window.SYLVA_ESPECES, C.especes);
  merge(window.SYLVA_GUIDE, C.guide);
})();
