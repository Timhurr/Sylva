// Sylva – illustrations originales des techniques (SVG, utilisables hors-ligne).
(function () {
  var C = {
    sol: "#3A4A3F", sol2: "#2C3D33", bois: "#B98A5A", boisF: "#8A6440", feuille: "#6F8F4E", feuille2: "#8CCB7E",
    feu: "#E9A23B", feu2: "#F07A5A", eau: "#6FB7D0", eauF: "#2D5A6B", clair: "#EEE9DD", muted: "#A9B3A6",
    bache: "#5E8C9A", ciel: "#17231C", nuit: "#0E1612", danger: "#FFB4A1"
  };
  function svg(inner) {
    return '<svg viewBox="0 0 320 180" role="img" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block">' +
      '<rect width="320" height="180" rx="14" fill="' + C.ciel + '"/>' + inner + "</svg>";
  }
  function t(x, y, s, anchor, color) {
    return '<text x="' + x + '" y="' + y + '" font-size="11" font-family="-apple-system,Inter,sans-serif" fill="' + (color || C.muted) +
      '" text-anchor="' + (anchor || "start") + '">' + s + "</text>";
  }
  function ground(y) { return '<rect x="0" y="' + y + '" width="320" height="' + (180 - y) + '" fill="' + C.sol + '"/>'; }
  function flame(x, y, s) {
    s = s || 1;
    return '<path d="M' + x + " " + y + " c" + (-10 * s) + " " + (-8 * s) + " " + (-8 * s) + " " + (-22 * s) + " 0 " + (-34 * s) +
      " c" + (2 * s) + " " + (10 * s) + " " + (10 * s) + " " + (12 * s) + " " + (8 * s) + " " + (22 * s) + " c" + (8 * s) + " " + (-4 * s) + " " + (6 * s) + " " + (-12 * s) + " " + (6 * s) + " " + (-16 * s) +
      " c" + (8 * s) + " " + (10 * s) + " " + (6 * s) + " " + (24 * s) + " " + (-6 * s) + " " + (28 * s) + 'z" fill="' + C.feu + '"/>' +
      '<path d="M' + (x + 1) + " " + (y - 2) + " c" + (-5 * s) + " " + (-4 * s) + " " + (-4 * s) + " " + (-11 * s) + " 0 " + (-16 * s) +
      " c" + (1 * s) + " " + (6 * s) + " " + (7 * s) + " " + (8 * s) + " " + (3 * s) + ' ' + (16 * s) + 'z" fill="' + C.feu2 + '"/>';
  }
  function tree(x, y, h) {
    return '<rect x="' + (x - 4) + '" y="' + (y - h) + '" width="8" height="' + h + '" fill="' + C.boisF + '"/>' +
      '<circle cx="' + x + '" cy="' + (y - h) + '" r="' + (h * 0.38) + '" fill="' + C.feuille + '"/>';
  }

  var I = {};

  I.priorites = svg(
    [["3 min", "sans air", C.clair], ["3 h", "sans abri*", C.feu], ["3 jours", "sans eau", C.eau], ["3 sem.", "sans nourriture", C.feuille2]].map(function (d, i) {
      var x = 44 + i * 77;
      return '<circle cx="' + x + '" cy="78" r="30" fill="none" stroke="' + d[2] + '" stroke-width="4"/>' +
        t(x, 83, d[0], "middle", d[2]) + t(x, 128, d[1], "middle");
    }).join("") + t(160, 160, "* par froid humide ou forte chaleur", "middle")
  );

  I.eau_ebullition = svg(
    ground(140) + '<path d="M120 140 l20 -18 M200 140 l-20 -18 M160 140 v-20" stroke="' + C.bois + '" stroke-width="6" stroke-linecap="round"/>' +
    flame(150, 138, 0.9) + flame(172, 138, 0.8) +
    '<path d="M110 70 h100 v38 a10 10 0 0 1 -10 10 h-80 a10 10 0 0 1 -10 -10z" fill="' + C.muted + '"/>' +
    '<rect x="116" y="76" width="88" height="20" fill="' + C.eau + '"/>' +
    '<circle cx="135" cy="70" r="5" fill="none" stroke="' + C.eau + '" stroke-width="2"/><circle cx="160" cy="62" r="6" fill="none" stroke="' + C.eau + '" stroke-width="2"/><circle cx="184" cy="68" r="4" fill="none" stroke="' + C.eau + '" stroke-width="2"/>' +
    '<circle cx="262" cy="70" r="26" fill="none" stroke="' + C.clair + '" stroke-width="3"/><path d="M262 70 v-16 M262 70 l10 6" stroke="' + C.clair + '" stroke-width="3" stroke-linecap="round"/>' +
    t(262, 112, "1 min à gros", "middle", C.clair) + t(262, 126, "bouillons", "middle", C.clair)
  );

  I.eau_filtre = svg(
    '<path d="M110 20 h100 l-8 120 h-84z" fill="' + C.sol2 + '" stroke="' + C.muted + '" stroke-width="2"/>' +
    '<rect x="113" y="40" width="94" height="20" fill="#CFC7B2"/>' + t(222, 54, "tissu / herbes", "start", C.clair) +
    '<rect x="114" y="60" width="92" height="22" fill="' + C.muted + '"/>' + t(222, 75, "gravier", "start", C.clair) +
    '<rect x="115" y="82" width="90" height="26" fill="#C9B07A"/>' + t(222, 99, "sable", "start", C.clair) +
    '<rect x="117" y="108" width="86" height="24" fill="#222"/>' + t(222, 124, "charbon de bois", "start", C.clair) +
    '<path d="M160 140 v12" stroke="' + C.eau + '" stroke-width="4" stroke-linecap="round" stroke-dasharray="4 5"/>' +
    '<path d="M138 152 h44 v18 h-44z" fill="' + C.eau + '"/>' +
    '<path d="M150 8 v10" stroke="' + C.eau + '" stroke-width="4" stroke-linecap="round"/>' +
    t(20, 60, "eau trouble", "start", C.eau) + t(20, 74, "en haut", "start", C.eau) +
    t(20, 150, "puis faire", "start", C.danger) + t(20, 164, "BOUILLIR", "start", C.danger)
  );

  I.eau_pluie = svg(
    '<path d="M40 30 L280 30" stroke="' + C.muted + '" stroke-width="2"/>' +
    [60, 90, 120, 150, 180, 210, 240, 270].map(function (x, i) { return '<path d="M' + x + " " + (14 + (i % 2) * 6) + ' l-4 10" stroke="' + C.eau + '" stroke-width="2" stroke-linecap="round"/>'; }).join("") +
    '<path d="M50 50 L270 50 L170 110 L150 110 Z" fill="' + C.bache + '"/>' + t(270, 66, "bâche inclinée", "end", C.clair) +
    '<path d="M50 50 l-10 100 M270 50 l10 100" stroke="' + C.bois + '" stroke-width="4"/>' +
    '<path d="M160 112 v18" stroke="' + C.eau + '" stroke-width="4" stroke-dasharray="4 5" stroke-linecap="round"/>' +
    '<path d="M138 132 h44 v30 a6 6 0 0 1 -6 6 h-32 a6 6 0 0 1 -6 -6z" fill="' + C.muted + '"/><rect x="142" y="144" width="36" height="20" fill="' + C.eau + '"/>' +
    ground(168)
  );

  I.eau_transpiration = svg(
    ground(150) + '<rect x="96" y="40" width="12" height="110" fill="' + C.boisF + '"/>' +
    '<path d="M108 70 C150 60 190 70 220 90" stroke="' + C.boisF + '" stroke-width="6" fill="none"/>' +
    '<path d="M150 58 C210 40 260 70 262 120 C262 140 240 146 228 140 C190 130 160 100 150 58z" fill="' + C.feuille + '" opacity=".85" stroke="' + C.clair + '" stroke-width="2" stroke-dasharray="5 4"/>' +
    '<path d="M232 134 q10 8 22 2 v-6 q-12 6 -22 -2z" fill="' + C.eau + '"/>' +
    t(150, 30, "sac plastique fermé", "start", C.clair) + t(250, 162, "l'eau s'accumule", "end", C.eau) + t(250, 175, "au point bas", "end", C.eau) +
    t(20, 30, "branche feuillue,", "start") + t(20, 44, "au soleil", "start") + t(20, 140, "(jamais une plante toxique)", "start", C.danger)
  );

  I.eau_rosee = svg(
    ground(120) + [20, 50, 80, 110, 140, 170, 200, 230, 260, 290].map(function (x) {
      return '<path d="M' + x + ' 120 q4 -22 2 -34 M' + (x + 8) + ' 120 q-2 -18 6 -28" stroke="' + C.feuille + '" stroke-width="3" fill="none"/>';
    }).join("") +
    '<path d="M70 108 h120 l-8 14 h-104z" fill="#CFC7B2"/>' + t(130, 70, "tissu absorbant traîné", "middle", C.clair) +
    '<path d="M230 60 q14 22 0 30 q-14 -8 0 -30z" fill="' + C.eau + '"/>' + t(258, 80, "essorer", "start", C.eau) +
    t(20, 30, "À l'aube, dans les herbes mouillées", "start", C.clair) + t(20, 160, "Rendement faible : complément uniquement", "start")
  );

  I.feu_preparation = svg(
    ground(140) +
    '<path d="M40 138 q20 -30 40 0z" fill="#CFC7B2"/><path d="M48 136 q12 -16 24 0" stroke="#E8DFC6" stroke-width="2" fill="none"/>' +
    t(60, 160, "amadou", "middle", C.clair) + t(60, 174, "poignée", "middle") +
    [0, 1, 2, 3, 4].map(function (i) { return '<path d="M' + (126 + i * 4) + " 136 l" + (40 - i * 3) + ' -14" stroke="' + C.bois + '" stroke-width="3" stroke-linecap="round"/>'; }).join("") +
    t(150, 160, "petit bois", "middle", C.clair) + t(150, 174, "allumette → pouce", "middle") +
    [0, 1, 2].map(function (i) { return '<rect x="' + (220 + i * 4) + '" y="' + (112 + i * 9) + '" width="70" height="10" rx="5" fill="' + C.boisF + '"/>'; }).join("") +
    t(255, 160, "bûches", "middle", C.clair) + t(255, 174, "poignet", "middle") +
    t(160, 30, "Tout préparer AVANT d'allumer", "middle", C.feu) + t(160, 46, "(prévoir 2× plus que nécessaire)", "middle")
  );

  I.feu_tipi = svg(
    ground(150) + '<ellipse cx="160" cy="150" rx="70" ry="8" fill="' + C.sol2 + '"/>' +
    flame(158, 146, 1.1) +
    [-50, -32, -14, 14, 32, 50].map(function (dx) { return '<path d="M' + (160 + dx) + ' 150 L160 52" stroke="' + C.bois + '" stroke-width="4" stroke-linecap="round"/>'; }).join("") +
    '<path d="M150 150 q10 -14 20 0z" fill="#CFC7B2"/>' +
    t(300, 70, "petit bois", "end", C.clair) + t(300, 84, "en cône", "end", C.clair) + t(60, 130, "amadou au", "end", C.clair) + t(60, 144, "centre", "end", C.clair) +
    t(160, 30, "Allumer côté vent, à la base", "middle", C.feu)
  );

  I.feu_cabane = svg(
    ground(150) + flame(160, 132, 1) +
    [0, 1, 2, 3, 4].map(function (i) {
      var y = 144 - i * 16, w = 150 - i * 18;
      return (i % 2 === 0
        ? '<rect x="' + (160 - w / 2) + '" y="' + (y - 6) + '" width="' + w + '" height="12" rx="6" fill="' + C.boisF + '"/>'
        : '<circle cx="' + (160 - w / 2 + 8) + '" cy="' + y + '" r="7" fill="' + C.bois + '" stroke="' + C.boisF + '" stroke-width="2"/><circle cx="' + (160 + w / 2 - 8) + '" cy="' + y + '" r="7" fill="' + C.bois + '" stroke="' + C.boisF + '" stroke-width="2"/>');
    }).join("") +
    t(160, 34, "Bûches croisées en carré, feu au centre", "middle", C.clair) + t(160, 50, "braises durables pour cuisiner", "middle")
  );

  I.feu_ferro = svg(
    ground(150) + '<path d="M120 150 q30 -36 60 0z" fill="#CFC7B2"/>' +
    '<rect x="152" y="40" width="10" height="100" rx="4" transform="rotate(20 157 90)" fill="' + C.muted + '"/>' +
    '<rect x="160" y="30" width="14" height="22" rx="4" transform="rotate(20 157 90)" fill="' + C.boisF + '"/>' +
    '<rect x="196" y="70" width="40" height="10" rx="3" transform="rotate(-25 216 75)" fill="' + C.clair + '"/>' +
    [[-20, 18], [-30, 10], [-12, 24], [-36, 22], [-24, 30]].map(function (d) { return '<circle cx="' + (150 + d[0]) + '" cy="' + (110 + d[1]) + '" r="2.5" fill="' + C.feu + '"/>'; }).join("") +
    t(250, 60, "racleur", "start", C.clair) + t(250, 120, "tirer la tige", "start", C.clair) + t(250, 134, "vers soi", "start", C.clair) +
    t(40, 40, "Pointe de la tige", "start", C.feu) + t(40, 54, "DANS l'amadou", "start", C.feu)
  );

  I.feu_pluie = svg(
    '<path d="M50 40 h220 v20 h-220z" fill="none"/>' +
    '<circle cx="90" cy="90" r="48" fill="' + C.boisF + '"/><circle cx="90" cy="90" r="34" fill="#C9A26E"/>' +
    '<path d="M90 42 v96" stroke="' + C.ciel + '" stroke-width="4"/>' +
    t(90, 160, "fendre : cœur sec", "middle", C.clair) +
    tree(230, 150, 70) + '<path d="M226 128 l-26 10 M226 118 l-30 4 M234 124 l26 10" stroke="#8A7A6A" stroke-width="2"/>' +
    t(230, 166, "brindilles mortes sur pied", "middle", C.clair) + t(230, 178, "(bas des épicéas)", "middle")
  );

  I.abri_emplacement = svg(
    ground(140) + tree(70, 140, 80) +
    '<path d="M70 68 L150 74" stroke="#8A7A6A" stroke-width="5" stroke-linecap="round"/>' +
    '<path d="M110 140 l20 -26 l20 26z" fill="' + C.bache + '"/>' +
    '<path d="M100 60 l60 76 M160 60 l-60 76" stroke="' + C.danger + '" stroke-width="5" stroke-linecap="round"/>' +
    t(130, 30, "branche morte au-dessus", "middle", C.danger) +
    '<path d="M196 140 q30 -40 60 -40 q30 0 60 40" fill="' + C.sol2 + '"/>' +
    '<path d="M240 140 l14 -18 l14 18z" fill="' + C.feuille2 + '"/>' + t(256, 160, "replat sec, hors du fond", "middle", C.feuille2) + t(256, 174, "de vallée et de la rive", "middle", C.feuille2)
  );

  I.abri_appentis = svg(
    ground(150) + '<rect x="44" y="20" width="12" height="130" fill="' + C.boisF + '"/><rect x="264" y="20" width="12" height="130" fill="' + C.boisF + '"/>' +
    '<path d="M50 80 H270" stroke="' + C.bois + '" stroke-width="7" stroke-linecap="round"/>' +
    [0, 1, 2, 3, 4, 5, 6].map(function (i) { var x = 70 + i * 30; return '<path d="M' + x + ' 80 L' + (x + 30) + ' 150" stroke="' + C.boisF + '" stroke-width="5" stroke-linecap="round"/>'; }).join("") +
    '<path d="M60 84 L270 84 L300 150 L90 150z" fill="' + C.feuille + '" opacity=".55"/>' +
    t(160, 70, "perche faîtière à hauteur de poitrine", "middle", C.clair) +
    t(80, 30, "vent →", "start", C.clair) +
    t(160, 172, "dos au vent · couverture épaisse de branchages", "middle")
  );

  I.abri_debris = svg(
    ground(150) +
    '<path d="M40 150 L270 96" stroke="' + C.bois + '" stroke-width="7" stroke-linecap="round"/>' +
    '<path d="M262 150 L276 92 M290 150 L268 92" stroke="' + C.boisF + '" stroke-width="6" stroke-linecap="round"/>' +
    '<path d="M40 150 Q150 70 282 92 Q300 120 290 150z" fill="' + C.feuille + '"/>' +
    '<path d="M50 150 Q150 96 272 100 Q284 124 278 150z" fill="' + C.boisF + '" opacity=".6"/>' +
    '<path d="M246 150 q16 -40 30 0z" fill="' + C.nuit + '"/>' +
    t(110, 60, "feuilles mortes : 60 cm à 1 m", "middle", C.clair) + t(266, 172, "entrée", "middle", C.clair) +
    t(20, 172, "poutre ≈ 1,5 × ta taille", "start")
  );

  I.abri_bache = svg(
    ground(150) + tree(40, 150, 100) + tree(280, 150, 100) +
    '<path d="M40 70 H280" stroke="' + C.clair + '" stroke-width="2"/>' +
    '<path d="M80 70 L50 150 H270 L240 70z" fill="' + C.bache + '"/>' +
    '<path d="M160 70 V150" stroke="#4A7480" stroke-width="2"/>' +
    '<path d="M50 150 l-14 10 M270 150 l14 10" stroke="' + C.bois + '" stroke-width="3"/>' +
    t(160, 56, "corde tendue entre 2 arbres", "middle", C.clair) + t(160, 172, "bâche en A, bords piquetés au sol", "middle")
  );

  I.orient_baton = svg(
    ground(40) + '<rect x="0" y="0" width="320" height="40" fill="' + C.ciel + '"/>' +
    '<circle cx="290" cy="20" r="10" fill="' + C.feu + '"/>' +
    '<rect x="157" y="60" width="6" height="60" fill="' + C.bois + '"/>' +
    '<path d="M160 120 L80 140" stroke="' + C.sol2 + '" stroke-width="5"/><path d="M160 120 L110 158" stroke="' + C.sol2 + '" stroke-width="5"/>' +
    '<circle cx="80" cy="140" r="6" fill="' + C.clair + '"/><circle cx="110" cy="158" r="6" fill="' + C.clair + '"/>' +
    '<path d="M60 125 L130 172" stroke="' + C.feu + '" stroke-width="3"/>' +
    t(60, 116, "1 = OUEST", "middle", C.clair) + t(140, 174, "2 = EST", "start", C.clair) +
    t(230, 120, "15 min entre", "middle", C.clair) + t(230, 134, "les deux repères", "middle", C.clair)
  );

  I.orient_montre = svg(
    '<circle cx="120" cy="96" r="62" fill="' + C.sol2 + '" stroke="' + C.clair + '" stroke-width="4"/>' +
    t(120, 46, "12", "middle", C.clair) + t(120, 154, "6", "middle", C.clair) +
    '<path d="M120 96 L176 72" stroke="' + C.feu + '" stroke-width="6" stroke-linecap="round"/>' +
    '<path d="M120 96 L120 40" stroke="' + C.clair + '" stroke-width="2" stroke-dasharray="4 4"/>' +
    '<path d="M120 96 L156 44" stroke="' + C.feuille2 + '" stroke-width="3"/>' +
    '<circle cx="270" cy="40" r="14" fill="' + C.feu + '"/>' + '<path d="M182 70 L254 46" stroke="' + C.feu + '" stroke-width="2" stroke-dasharray="4 4"/>' +
    t(230, 96, "petite aiguille", "middle", C.feu) + t(230, 110, "vers le soleil", "middle", C.feu) +
    t(230, 136, "bissectrice avec 12 h", "middle", C.feuille2) + t(230, 150, "= SUD", "middle", C.feuille2)
  );

  I.orient_polaire = svg(
    '<rect width="320" height="180" rx="14" fill="' + C.nuit + '"/>' +
    [[60, 120], [100, 116], [130, 124], [158, 136], [168, 108], [204, 104], [212, 134]].map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="4" fill="' + C.clair + '"/>'; }).join("") +
    '<path d="M60 120 L100 116 L130 124 L158 136 L212 134 L204 104 L168 108 L158 136" stroke="' + C.muted + '" stroke-width="1.5" fill="none"/>' +
    '<path d="M212 134 L204 104 L190 40" stroke="' + C.feu + '" stroke-width="2" stroke-dasharray="5 4" fill="none"/>' +
    '<circle cx="190" cy="34" r="6" fill="' + C.feu + '"/>' + t(178, 30, "Étoile polaire = NORD", "end", C.feu) +
    t(206, 70, "×5", "start", C.clair) + t(60, 150, "Grande Ourse (« casserole »)", "start")
  );

  I.secours_signaux = svg(
    ground(110) +
    [[90, 140], [160, 100], [230, 140]].map(function (p) { return flame(p[0], p[1], 0.7); }).join("") +
    '<path d="M90 140 L160 100 L230 140z" stroke="' + C.muted + '" stroke-width="1" stroke-dasharray="3 4" fill="none"/>' +
    t(160, 170, "3 feux en triangle (≈ 30 m d'écart)", "middle", C.clair) +
    '<circle cx="270" cy="40" r="16" fill="none" stroke="' + C.clair + '" stroke-width="3"/><path d="M262 40 h16" stroke="' + C.clair + '" stroke-width="3"/>' +
    t(270, 74, "sifflet : 3 coups", "middle", C.clair) +
    t(40, 40, "V = besoin d'aide", "start", C.feu) + t(40, 56, "X = besoin médical", "start", C.feu) + t(40, 72, "(au sol, au moins 4 × 6 m)", "start")
  );

  I.froid = svg(
    '<circle cx="110" cy="40" r="16" fill="' + C.muted + '"/>' +
    '<path d="M80 62 h60 l8 90 h-76z" fill="#CFC7B2"/><path d="M72 62 h76 l10 96 h-96z" fill="none" stroke="' + C.feu + '" stroke-width="6"/>' +
    '<path d="M64 60 h92 l12 104 h-116z" fill="none" stroke="' + C.bache + '" stroke-width="6"/>' +
    t(180, 70, "1. base respirante", "start", C.clair) + t(180, 96, "2. couche chaude", "start", C.feu) + t(180, 122, "3. coque imperméable", "start", C.bache) +
    t(180, 160, "Rester SEC avant tout", "start", C.danger)
  );

  I.urgence = svg(
    '<rect x="60" y="20" width="80" height="140" rx="14" fill="' + C.sol2 + '" stroke="' + C.clair + '" stroke-width="3"/>' +
    '<circle cx="100" cy="76" r="24" fill="#C2412A"/>' + t(100, 81, "112", "middle", "#fff") +
    t(100, 122, "50.135 N", "middle", C.clair) + t(100, 136, "5.790 E", "middle", C.clair) +
    t(170, 60, "1. Appeler le 112", "start", C.clair) + t(170, 84, "2. Donner la position", "start", C.clair) + t(170, 108, "3. Rester sur place,", "start", C.clair) + t(182, 122, "visible", "start", C.clair) +
    t(170, 150, "Bouton SOS en haut", "start", C.feu)
  );

  I.piege_4 = svg(
    ground(150) +
    '<path d="M60 150 L260 98 L268 120 L72 160z" fill="#8A8A80"/>' + t(304, 92, "pierre plate", "end", C.clair) +
    '<path d="M150 150 V96" stroke="' + C.bois + '" stroke-width="6" stroke-linecap="round"/>' +
    '<path d="M150 104 L196 124" stroke="' + C.boisF + '" stroke-width="5" stroke-linecap="round"/>' +
    '<path d="M118 140 L190 140" stroke="' + C.feu + '" stroke-width="4" stroke-linecap="round"/>' +
    t(40, 40, "Structure en « 4 » : 3 bâtons entaillés", "start", C.clair) +
    t(40, 60, "DÉTRESSE VITALE UNIQUEMENT", "start", C.danger) + t(40, 76, "(sinon : braconnage, interdit)", "start", C.danger)
  );

  I.traces = svg(
    ground(110) + '<path d="M120 110 q20 30 40 0z" fill="' + C.nuit + '"/>' +
    '<path d="M180 40 l-30 60" stroke="' + C.muted + '" stroke-width="6" stroke-linecap="round"/><path d="M142 92 l20 10 l-8 16 z" fill="' + C.muted + '"/>' +
    t(140, 150, "trou de 15 cm, rebouché", "middle", C.clair) +
    '<path d="M240 140 h70" stroke="' + C.eau + '" stroke-width="10" stroke-linecap="round"/>' + t(275, 124, "> 50 m", "middle", C.eau) + t(275, 166, "de l'eau", "middle", C.eau) +
    t(20, 40, "Tout remporter,", "start", C.clair) + t(20, 56, "même le papier", "start", C.clair)
  );

  I.noeud = svg(
    '<path d="M30 120 C80 120 90 60 140 60 C190 60 200 120 160 128 C120 136 110 90 150 84 C190 78 230 120 290 120" fill="none" stroke="' + C.bois + '" stroke-width="10" stroke-linecap="round"/>' +
    '<path d="M30 120 C80 120 90 60 140 60" fill="none" stroke="' + C.feu + '" stroke-width="3" stroke-dasharray="2 10" stroke-linecap="round"/>'
  );

  I.premiers_secours = svg(
    '<rect x="110" y="40" width="100" height="100" rx="18" fill="#C2412A"/>' +
    '<rect x="148" y="58" width="24" height="64" rx="4" fill="#fff"/><rect x="128" y="78" width="64" height="24" rx="4" fill="#fff"/>' +
    t(160, 166, "Urgence : 112, partout en Europe", "middle", C.clair)
  );

  I.stop = svg(
    [["S", "S'arrêter"], ["T", "Penser"], ["O", "Observer"], ["P", "Planifier"]].map(function (d, i) {
      var x = 44 + i * 77;
      return '<path d="M' + (x - 13) + ' 50 h26 l13 13 v26 l-13 13 h-26 l-13 -13 v-26z" fill="#C2412A"/>' +
        '<text x="' + x + '" y="85" font-size="28" font-weight="800" font-family="-apple-system,Inter,sans-serif" fill="#fff" text-anchor="middle">' + d[0] + "</text>" +
        t(x, 128, d[1], "middle", C.clair);
    }).join("") + t(160, 160, "5 minutes de calme valent mieux qu'une heure perdue", "middle")
  );

  I.kit = svg(
    '<rect x="40" y="40" width="240" height="110" rx="16" fill="' + C.sol2 + '" stroke="' + C.muted + '" stroke-width="2"/>' +
    '<rect x="60" y="58" width="16" height="34" rx="4" fill="' + C.feu + '"/>' + t(68, 110, "briquet", "middle", C.clair) +
    '<rect x="96" y="54" width="8" height="42" rx="3" fill="' + C.muted + '"/>' + t(100, 124, "pierre", "middle", C.clair) +
    '<rect x="120" y="58" width="40" height="34" rx="4" fill="#D8C27A"/>' + t(140, 110, "couverture", "middle", C.clair) +
    '<circle cx="186" cy="74" r="12" fill="none" stroke="' + C.clair + '" stroke-width="3"/>' + t(186, 110, "sifflet", "middle", C.clair) +
    '<rect x="214" y="62" width="10" height="28" rx="3" fill="' + C.boisF + '"/><path d="M219 62 l0 -16" stroke="' + C.muted + '" stroke-width="5" stroke-linecap="round"/>' + t(222, 124, "couteau", "middle", C.clair) +
    '<rect x="244" y="62" width="22" height="26" rx="4" fill="' + C.eau + '"/>' + t(255, 110, "pastilles", "middle", C.clair) +
    t(160, 142, "+ frontale · cordelette · pansements · barre", "middle") +
    t(160, 28, "Le kit qui ne quitte jamais la poche", "middle", C.feu)
  );

  I.camp = svg(
    ground(0) + '<rect x="0" y="0" width="320" height="180" rx="14" fill="' + C.sol + '"/>' +
    '<path d="M20 26 h60" stroke="' + C.clair + '" stroke-width="2"/><path d="M80 26 l-8 -5 v10z" fill="' + C.clair + '"/>' + t(20, 20, "vent", "start", C.clair) +
    '<path d="M40 110 l24 -32 l24 32z" fill="' + C.bache + '"/>' + t(64, 128, "couchage", "middle", C.clair) + t(64, 142, "(au vent)", "middle") +
    '<circle cx="170" cy="96" r="14" fill="' + C.sol2 + '"/>' + flame(170, 104, 0.5) + t(170, 128, "feu / cuisine", "middle", C.clair) + t(170, 142, "(sous le vent)", "middle") +
    '<rect x="196" y="70" width="34" height="8" rx="4" fill="' + C.boisF + '"/><rect x="198" y="80" width="30" height="8" rx="4" fill="' + C.boisF + '"/>' + t(213, 62, "bois", "middle", C.clair) +
    '<path d="M110 66 h6 v-6 h6 v6 h6" stroke="' + C.feuille2 + '" stroke-width="2" fill="none"/>' + t(120, 54, "nourriture fermée", "middle", C.feuille2) +
    '<rect x="262" y="140" width="36" height="20" rx="6" fill="' + C.eau + '"/>' + t(280, 132, "eau", "middle", C.eau) +
    '<path d="M275 40 q8 -10 16 0 q-8 8 -16 0z" fill="' + C.muted + '"/>' + t(283, 64, "toilettes", "middle", C.clair) + t(283, 76, "> 50 m", "middle") +
    '<path d="M100 96 h52" stroke="' + C.muted + '" stroke-dasharray="3 4"/>' + t(126, 90, "≥ 3 m", "middle")
  );

  I.cueillette = svg(
    ground(140) +
    '<path d="M50 140 q4 -40 -6 -70 M50 140 q10 -30 30 -50" stroke="' + C.feuille + '" stroke-width="4" fill="none"/>' +
    [[44, 70], [80, 90], [60, 100], [36, 96]].map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="6" fill="#3A2F5A"/>'; }).join("") +
    t(60, 160, "1 · identifier", "middle", C.clair) +
    '<rect x="128" y="62" width="64" height="64" rx="12" fill="none" stroke="' + C.feu + '" stroke-width="3"/><path d="M146 94 l10 10 l20 -24" stroke="' + C.feuille2 + '" stroke-width="5" fill="none" stroke-linecap="round"/>' +
    t(160, 160, "2 · tous les critères", "middle", C.clair) +
    '<circle cx="262" cy="94" r="30" fill="none" stroke="' + C.danger + '" stroke-width="4"/><path d="M241 115 l42 -42" stroke="' + C.danger + '" stroke-width="4"/>' +
    t(262, 160, "3 · un doute = non", "middle", C.danger) +
    t(160, 30, "Pas de certitude, pas de cueillette", "middle", C.feu)
  );

  I.boussole = svg(
    '<rect x="40" y="30" width="110" height="140" rx="12" fill="#CFE3EA" opacity=".9"/>' +
    '<circle cx="95" cy="110" r="40" fill="' + C.sol2 + '" stroke="' + C.clair + '" stroke-width="3"/>' +
    '<path d="M95 76 l9 34 h-18z" fill="#C2412A"/><path d="M95 144 l9 -34 h-18z" fill="' + C.clair + '"/>' +
    t(95, 66, "N", "middle", C.clair) + '<path d="M95 30 v-0" stroke="none"/>' +
    '<path d="M95 40 v20" stroke="' + C.feu + '" stroke-width="4" stroke-linecap="round"/><path d="M95 36 l-7 10 h14z" fill="' + C.feu + '"/>' +
    t(180, 70, "1. bord de la boussole :", "start", C.clair) + t(190, 84, "départ → arrivée", "start") +
    t(180, 108, "2. cadran aligné sur", "start", C.clair) + t(190, 122, "le nord de la carte", "start") +
    t(180, 146, "3. aiguille rouge dans", "start", C.clair) + t(190, 160, "la flèche : avancer", "start")
  );

  I.orage = svg(
    '<path d="M60 60 q0 -30 40 -30 q20 -20 50 0 q40 -6 46 30z" fill="' + C.muted + '"/>' +
    '<path d="M120 62 l-14 36 h16 l-12 34 l34 -48 h-16 l12 -22z" fill="' + C.feu + '"/>' +
    ground(150) +
    '<circle cx="250" cy="112" r="8" fill="' + C.clair + '"/><path d="M242 120 q8 18 16 0 l4 22 h-24z" fill="' + C.clair + '"/>' +
    '<rect x="232" y="142" width="36" height="6" rx="3" fill="' + C.bache + '"/>' +
    t(250, 163, "accroupi, pieds joints,", "middle", C.clair) + t(250, 175, "sur son sac", "middle", C.clair) +
    t(30, 130, "< 30 s entre éclair", "start", C.danger) + t(30, 144, "et tonnerre = abri !", "start", C.danger)
  );

  I.plume = svg(
    ground(150) + '<rect x="40" y="128" width="110" height="22" rx="8" fill="' + C.boisF + '"/>' +
    '<rect x="150" y="40" width="16" height="110" rx="4" transform="rotate(30 158 150)" fill="' + C.bois + '"/>' +
    [0, 1, 2, 3, 4, 5].map(function (i) { var y = 120 - i * 12; return '<path d="M' + (140 - i * 6) + " " + y + ' q-22 6 -26 22" stroke="#E8D3B0" stroke-width="3" fill="none" stroke-linecap="round"/>'; }).join("") +
    '<path d="M196 40 l-30 70" stroke="' + C.muted + '" stroke-width="6" stroke-linecap="round"/><rect x="192" y="22" width="12" height="26" rx="4" transform="rotate(23 198 35)" fill="' + C.boisF + '"/>' +
    t(312, 80, "copeaux fins,", "end", C.clair) + t(312, 94, "restent attachés", "end", C.clair) +
    t(312, 124, "lame vers le bas,", "end", C.feu) + t(312, 138, "loin du corps", "end", C.feu)
  );

  I.feu_appentis = svg(
    ground(150) + '<path d="M60 150 L230 70" stroke="' + C.boisF + '" stroke-width="7" stroke-linecap="round"/>' +
    '<path d="M110 150 q14 -18 30 0z" fill="#CFC7B2"/>' + flame(124, 146, 0.6) +
    [0, 1, 2, 3, 4].map(function (i) { var x = 100 + i * 20; return '<path d="M' + x + ' 150 L' + (x + 30) + ' ' + (126 - i * 9) + '" stroke="' + C.bois + '" stroke-width="3" stroke-linecap="round"/>'; }).join("") +
    t(36, 40, "vent →", "start", C.clair) + t(230, 60, "bâton vert à 30°,", "end", C.clair) + t(230, 74, "pointe face au vent", "end", C.clair) +
    t(120, 172, "amadou au fond, petit bois appuyé", "middle")
  );

  I.feu_croix = svg(
    ground(110) + '<path d="M110 140 h100 M160 115 v50" stroke="' + C.nuit + '" stroke-width="12" stroke-linecap="round"/>' +
    '<path d="M144 132 q16 -22 32 0z" fill="#CFC7B2"/>' + [-24, -12, 12, 24].map(function (dx) { return '<path d="M' + (160 + dx) + ' 134 L160 92" stroke="' + C.bois + '" stroke-width="3"/>'; }).join("") +
    '<path d="M60 150 q20 -6 40 -8" stroke="' + C.eau + '" stroke-width="2" stroke-dasharray="4 4" fill="none"/><path d="M260 150 q-20 -6 -40 -8" stroke="' + C.eau + '" stroke-width="2" stroke-dasharray="4 4" fill="none"/>' +
    t(160, 40, "Croix de 30 cm, 7 cm de profondeur", "middle", C.clair) + t(160, 56, "l'air passe sous l'amadou", "middle", C.eau)
  );

  I.feu_pyramide = svg(
    ground(150) +
    [0, 1, 2, 3, 4].map(function (i) {
      var w = 160 - i * 26, y = 140 - i * 14, n = Math.max(2, 6 - i), h = "";
      for (var k = 0; k < n; k++) h += '<rect x="' + (160 - w / 2 + k * (w / n)) + '" y="' + (y - 6) + '" width="' + (w / n - 3) + '" height="12" rx="5" fill="' + (i % 2 ? C.bois : C.boisF) + '"/>';
      return h;
    }).join("") + flame(160, 76, 0.7) +
    t(160, 34, "Le feu descend couche par couche", "middle", C.clair) + t(160, 172, "chaleur pendant des heures", "middle")
  );

  I.feu_dakota = svg(
    '<rect x="0" y="60" width="320" height="120" fill="' + C.sol + '"/>' +
    '<path d="M100 60 v80 a10 10 0 0 0 10 10 h40 a10 10 0 0 0 10 -10 v-80z" fill="' + C.nuit + '"/>' +
    '<path d="M240 60 v40 L160 140" stroke="' + C.nuit + '" stroke-width="22" fill="none"/>' +
    flame(130, 146, 0.8) + '<rect x="96" y="44" width="68" height="12" rx="4" fill="' + C.muted + '"/>' +
    '<path d="M250 30 h40" stroke="' + C.clair + '" stroke-width="2"/>' + t(296, 26, "← vent", "end", C.clair) +
    t(240, 54, "arrivée d'air", "middle", C.eau) + t(60, 100, "30 cm", "middle", C.clair) + t(130, 38, "casserole", "middle", C.clair)
  );

  I.reflecteur = svg(
    ground(150) + [0, 1, 2, 3, 4].map(function (i) { return '<rect x="210" y="' + (138 - i * 12) + '" width="80" height="11" rx="5" fill="' + C.boisF + '"/>'; }).join("") +
    '<path d="M206 150 v-80 M294 150 v-80" stroke="' + C.bois + '" stroke-width="4"/>' + flame(160, 146, 0.8) +
    '<path d="M60 120 l-14 30 h28z" fill="' + C.bache + '"/>' +
    '<path d="M200 100 q-40 -30 -110 0" stroke="' + C.feu + '" stroke-width="2" stroke-dasharray="4 4" fill="none"/><path d="M92 100 l10 -2 l-6 -8z" fill="' + C.feu + '"/>' +
    t(250, 60, "mur de bûches", "middle", C.clair) + t(60, 170, "abri", "middle", C.clair) + t(160, 40, "la chaleur revient vers toi", "middle", C.feu)
  );

  I.arc_feu = svg(
    ground(150) + '<rect x="70" y="138" width="170" height="12" rx="3" fill="#C9A26E"/>' +
    '<path d="M150 138 l6 0 l-3 12z" fill="' + C.nuit + '"/>' + '<ellipse cx="153" cy="156" rx="22" ry="4" fill="#CFC7B2"/>' +
    '<rect x="149" y="56" width="8" height="82" fill="' + C.bois + '"/>' + '<ellipse cx="153" cy="52" rx="16" ry="8" fill="' + C.muted + '"/>' +
    '<path d="M60 92 Q153 60 250 92" stroke="' + C.boisF + '" stroke-width="6" fill="none"/>' + '<path d="M60 92 L149 98 L157 100 L250 92" stroke="' + C.clair + '" stroke-width="2" fill="none"/>' +
    '<path d="M70 132 h40 v6 h-40z" fill="' + C.sol2 + '"/>' + t(80, 124, "pied", "middle", C.clair) +
    t(196, 46, "poignée", "start", C.clair) + t(256, 86, "arc ↔", "start", C.feu) + t(250, 134, "planchette + encoche en V", "end", C.clair) + t(200, 172, "braise recueillie sur l'écorce", "middle")
  );

  I.tissu_charbonne = svg(
    '<rect x="40" y="70" width="90" height="56" rx="8" fill="' + C.muted + '"/>' + '<circle cx="85" cy="70" r="3" fill="' + C.nuit + '"/>' +
    '<path d="M85 66 q-6 -14 4 -24 q6 -10 0 -20" stroke="' + C.muted + '" stroke-width="3" fill="none" opacity=".7"/>' +
    flame(70, 150, 0.6) + flame(98, 150, 0.5) +
    [0, 1, 2].map(function (i) { return '<rect x="' + (52 + i * 22) + '" y="84" width="18" height="18" rx="2" fill="#1A1A1A" stroke="#444"/>'; }).join("") +
    t(85, 168, "boîte trouée sur le feu", "middle", C.clair) +
    '<path d="M200 140 q10 -70 90 -60 q10 30 -10 60z" fill="#8A7A6A"/><path d="M206 132 q20 -50 76 -44" stroke="#B38B5A" stroke-width="6" fill="none"/>' +
    '<path d="M196 150 h104" stroke="' + C.boisF + '" stroke-width="10"/>' + t(250, 70, "amadouvier", "middle", C.clair) + t(250, 172, "couche feutrée = amadou", "middle", C.feu)
  );

  I.alambic = svg(
    '<rect x="0" y="60" width="320" height="120" fill="' + C.sol + '"/>' +
    '<path d="M70 60 q90 110 180 0z" fill="' + C.nuit + '"/>' +
    '<path d="M60 60 L160 118 L260 60" stroke="#CFE3EA" stroke-width="3" fill="none" opacity=".9"/>' +
    '<circle cx="160" cy="112" r="6" fill="' + C.muted + '"/>' +
    '<rect x="146" y="128" width="28" height="20" rx="3" fill="' + C.eau + '"/>' +
    [100, 120, 200, 220].map(function (x) { return '<path d="M' + x + ' 100 q4 -16 0 -24" stroke="' + C.feuille + '" stroke-width="4" fill="none"/>'; }).join("") +
    [130, 140, 180, 190].map(function (x, i) { return '<circle cx="' + x + '" cy="' + (90 + i * 3) + '" r="2.5" fill="' + C.eau + '"/>'; }).join("") +
    '<circle cx="280" cy="26" r="12" fill="' + C.feu + '"/>' +
    t(40, 40, "bâche plastique, caillou au centre", "start", C.clair) + t(160, 172, "≈ 0,3 à 0,6 L par jour", "middle", C.danger)
  );

  I.pierres_chaudes = svg(
    ground(150) + flame(80, 146, 0.9) +
    [[66, 138], [90, 140], [78, 128]].map(function (p) { return '<ellipse cx="' + p[0] + '" cy="' + p[1] + '" rx="10" ry="7" fill="#7A6A60"/>'; }).join("") +
    '<path d="M110 100 Q160 50 210 100" stroke="' + C.feu + '" stroke-width="2" stroke-dasharray="4 4" fill="none"/>' +
    '<path d="M200 110 h80 l-8 40 h-64z" fill="' + C.muted + '"/><rect x="206" y="116" width="68" height="24" fill="' + C.eau + '"/>' +
    '<ellipse cx="240" cy="128" rx="10" ry="7" fill="#7A6A60"/>' +
    [[226, 112], [244, 106], [258, 112]].map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="4" fill="none" stroke="' + C.eau + '" stroke-width="2"/>'; }).join("") +
    t(160, 34, "Pierres sèches, jamais de galets de rivière", "middle", C.danger) + t(240, 172, "récipient", "middle", C.clair)
  );

  I.cold = svg(
    [["C", "Propre", C.clair], ["O", "Sans sueur", C.feu], ["L", "En couches", C.feuille2], ["D", "Au sec", C.eau]].map(function (d, i) {
      var x = 44 + i * 77;
      return '<circle cx="' + x + '" cy="76" r="28" fill="none" stroke="' + d[2] + '" stroke-width="4"/>' +
        '<text x="' + x + '" y="86" font-size="28" font-weight="800" font-family="-apple-system,Inter,sans-serif" fill="' + d[2] + '" text-anchor="middle">' + d[0] + "</text>" +
        t(x, 128, d[1], "middle", C.clair);
    }).join("") + t(160, 160, "Les 4 règles pour rester au chaud", "middle")
  );

  I.traversee = svg(
    '<rect x="0" y="40" width="320" height="100" fill="' + C.eauF + '"/>' +
    [60, 90, 120].map(function (y) { return '<path d="M20 ' + y + ' q40 -8 80 0 t80 0 t80 0 t80 0" stroke="' + C.eau + '" stroke-width="2" fill="none" opacity=".6"/>'; }).join("") +
    t(24, 54, "amont", "start", C.clair) + t(296, 54, "courant →", "end", C.eau) +
    '<path d="M110 140 L210 40" stroke="' + C.feu + '" stroke-width="3" stroke-dasharray="6 5"/>' +
    '<circle cx="160" cy="88" r="9" fill="' + C.clair + '"/><path d="M152 84 l-18 -10" stroke="' + C.bois + '" stroke-width="4"/>' +
    t(80, 166, "en biais vers l'aval,", "start", C.clair) + t(80, 178, "bâton côté amont", "start", C.clair) +
    t(20, 30, "pas plus haut que les genoux si ça court", "start", C.danger)
  );

  I.pas = svg(
    ground(130) + '<path d="M30 120 H290" stroke="' + C.clair + '" stroke-width="2"/>' +
    '<path d="M30 112 v16 M290 112 v16" stroke="' + C.clair + '" stroke-width="2"/>' + t(160, 104, "100 m", "middle", C.clair) +
    [0, 1, 2, 3, 4, 5, 6].map(function (i) { return '<ellipse cx="' + (50 + i * 36) + '" cy="' + (i % 2 ? 146 : 154) + '" rx="7" ry="11" fill="' + (i % 2 ? C.muted : C.feu) + '"/>'; }).join("") +
    t(160, 40, "Compter le pied gauche : ≈ 60 à 70", "middle", C.feu) + t(160, 56, "doubles pas pour 100 m", "middle", C.feu)
  );

  I.recoupement = svg(
    '<rect x="20" y="20" width="280" height="140" rx="8" fill="#E8E2CF" opacity=".95"/>' +
    '<path d="M60 50 l14 -24 l14 24z" fill="#7A6A4A"/>' + t(74, 62, "sommet", "middle", C.nuit) +
    '<rect x="236" y="40" width="10" height="26" fill="#7A6A4A"/><path d="M232 40 l9 -12 l9 12z" fill="#7A6A4A"/>' + t(241, 78, "clocher", "middle", C.nuit) +
    '<path d="M74 42 L170 128 M241 52 L170 128" stroke="#C2412A" stroke-width="2.5"/>' +
    '<circle cx="170" cy="128" r="7" fill="none" stroke="#C2412A" stroke-width="3"/>' + t(184, 150, "tu es ici", "start", "#8A2A1A")
  );

  I.miroir = svg(
    '<circle cx="270" cy="34" r="12" fill="' + C.feu + '"/>' +
    '<path d="M150 30 l14 4 l-14 4z" fill="' + C.clair + '"/><path d="M118 34 h30" stroke="' + C.clair + '" stroke-width="3"/>' + t(140, 22, "hélico", "middle", C.clair) +
    '<path d="M90 120 l-10 -40 M90 120 l10 -40" stroke="#E8D3B0" stroke-width="8" stroke-linecap="round"/>' + '<rect x="78" y="118" width="24" height="34" rx="8" fill="#E8D3B0"/>' +
    '<rect x="200" y="110" width="40" height="30" rx="4" fill="#CFE3EA" transform="rotate(-20 220 125)"/>' +
    '<path d="M215 116 L90 78" stroke="' + C.feu + '" stroke-width="2" stroke-dasharray="5 4"/><path d="M90 78 L140 36" stroke="' + C.feu + '" stroke-width="2" stroke-dasharray="5 4"/>' +
    t(60, 170, "doigts en V vers l'appareil", "start", C.clair) + t(300, 170, "miroir", "end", C.clair)
  );

  I.sol_air = svg(
    [["V", "aide"], ["X", "médical"], ["N", "non"], ["Y", "oui"], ["→", "direction"]].map(function (d, i) {
      var x = 36 + i * 62;
      return '<rect x="' + (x - 26) + '" y="40" width="52" height="70" rx="6" fill="' + C.sol + '"/>' +
        '<text x="' + x + '" y="94" font-size="44" font-weight="800" font-family="-apple-system,Inter,sans-serif" fill="' + C.clair + '" text-anchor="middle">' + d[0] + "</text>" +
        t(x, 128, d[1], "middle", C.clair);
    }).join("") + t(160, 160, "au sol : au moins 4 × 6 m, traits de 1 m", "middle", C.feu)
  );

  I.cordelette = svg(
    [0, 1, 2, 3, 4, 5, 6, 7].map(function (i) {
      var x = 40 + i * 30;
      return '<path d="M' + x + ' 70 q15 20 30 0" stroke="' + C.feuille2 + '" stroke-width="7" fill="none"/>' +
             '<path d="M' + x + ' 90 q15 -20 30 0" stroke="#B9A16A" stroke-width="7" fill="none"/>';
    }).join("") +
    '<path d="M280 70 l20 -16 M280 90 l20 16" stroke="' + C.feuille2 + '" stroke-width="5"/>' +
    t(160, 40, "Torsion inversée : tordre vers soi, croiser en éloignant", "middle", C.clair) +
    t(160, 140, "fibres d'ortie ou d'écorce de tilleul", "middle")
  );

  I.pls = svg(
    ground(140) +
    '<circle cx="98" cy="112" r="14" fill="' + C.clair + '"/>' +
    '<path d="M112 108 h90 a12 12 0 0 1 0 24 h-90z" fill="' + C.bache + '"/>' +
    '<path d="M150 120 l-20 30" stroke="' + C.bache + '" stroke-width="12" stroke-linecap="round"/>' +
    '<path d="M196 130 l30 0 l10 10" stroke="#3D5E6A" stroke-width="12" stroke-linecap="round" fill="none"/><path d="M200 120 l40 -16" stroke="' + C.bache + '" stroke-width="12" stroke-linecap="round"/>' +
    '<path d="M110 116 q-8 4 -6 12" stroke="#E8D3B0" stroke-width="8" stroke-linecap="round" fill="none"/>' +
    '<path d="M86 126 l-6 10" stroke="' + C.eau + '" stroke-width="2" stroke-dasharray="3 3"/>' +
    t(80, 160, "bouche vers le sol", "middle", C.eau) + t(230, 160, "jambe du dessus à 90°", "middle", C.clair) +
    t(160, 40, "Inconscient qui respire : sur le côté", "middle", C.feu)
  );

  I.attelle = svg(
    '<path d="M60 96 h200" stroke="#E8D3B0" stroke-width="26" stroke-linecap="round"/>' +
    '<path d="M70 76 h180 M70 116 h180" stroke="' + C.boisF + '" stroke-width="8" stroke-linecap="round"/>' +
    [90, 130, 190, 230].map(function (x) { return '<rect x="' + (x - 6) + '" y="70" width="12" height="52" rx="3" fill="' + C.bache + '"/>'; }).join("") +
    '<path d="M154 84 l12 24 M166 84 l-12 24" stroke="' + C.danger + '" stroke-width="3"/>' +
    t(160, 50, "Bloquer l'articulation au-dessus ET en dessous", "middle", C.clair) + t(160, 150, "attaches de part et d'autre, jamais sur la blessure", "middle")
  );

  I.brancard = svg(
    ground(150) + '<path d="M30 110 h260 M30 136 h260" stroke="' + C.boisF + '" stroke-width="7" stroke-linecap="round"/>' +
    '<path d="M70 108 h180 v30 h-180z" fill="' + C.bache + '"/>' +
    '<path d="M110 108 v30 M160 108 v30 M210 108 v30" stroke="#3D5E6A" stroke-width="3"/>' +
    t(160, 70, "2 perches + vestes fermées", "middle", C.clair) + t(160, 86, "(manches retournées) ou bâche repliée", "middle", C.clair) +
    t(160, 172, "Tester avant d'y installer le blessé", "middle", C.feu)
  );

  I.ombre = svg(
    '<circle cx="280" cy="30" r="14" fill="' + C.feu + '"/>' + ground(150) +
    '<path d="M60 70 h200 M70 90 h180" stroke="' + C.bache + '" stroke-width="6"/>' +
    '<path d="M60 70 v80 M260 70 v80" stroke="' + C.bois + '" stroke-width="4"/>' +
    '<path d="M268 46 l-30 20 M276 50 l-24 18" stroke="' + C.feu + '" stroke-width="2" stroke-dasharray="4 4"/>' +
    '<path d="M110 136 h60 a6 6 0 0 1 0 12 h-60z" fill="' + C.clair + '"/>' +
    '<path d="M40 120 q40 -10 80 0 M200 118 q40 -10 80 0" stroke="' + C.eau + '" stroke-width="2" fill="none" stroke-dasharray="4 4"/>' +
    t(160, 60, "2 toiles espacées de 20 à 30 cm", "middle", C.clair) + t(160, 172, "à 50 cm du sol au moins : l'air circule", "middle")
  );

  I.contourner = svg(
    '<ellipse cx="160" cy="80" rx="60" ry="34" fill="' + C.eauF + '"/>' + t(160, 84, "marécage", "middle", C.clair) +
    '<path d="M160 170 V126 H250 V34 H160 V14" stroke="' + C.feu + '" stroke-width="3" fill="none" stroke-dasharray="6 5" stroke-linejoin="round"/>' +
    '<path d="M160 14 l-6 10 h12z" fill="' + C.feu + '"/>' +
    t(205, 146, "90° + N pas", "middle", C.clair) + t(205, 26, "90° + N pas", "middle", C.clair) + t(262, 84, "cap", "start", C.clair) +
    t(60, 172, "même nombre de pas à l'aller et au retour", "start")
  );

  window.SYLVA_ILLUS = I;
})();
