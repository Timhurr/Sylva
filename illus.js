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
    t(40, 40, "V = besoin d'aide", "start", C.feu) + t(40, 56, "X = besoin médical", "start", C.feu) + t(40, 72, "(au sol, 3 m de haut)", "start")
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

  window.SYLVA_ILLUS = I;
})();
