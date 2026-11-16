/* Sylva – Crise et résilience, suite (v0.9.76) : rester chez soi, troc et rationnement, radio, s'orienter sans GPS, réanimation.
   Rédigé pour Sylva d'après les recommandations officielles (Union européenne, Centre de crise belge, protection civile,
   Conseil européen de réanimation ERC 2021, FEMA pour l'eau du logement et le rationnement). En cas de crise, les consignes des autorités passent avant. */
(function () {
  "use strict";
  var T = window.SYLVA_TECHNIQUES || [];
  var SRC = "Rédigé pour Sylva d'après les recommandations des services de protection civile et de crise (UE, Belgique, France, FEMA). En cas de crise, suis les consignes des autorités.";
  function add(f) { if (!T.some(function (t) { return t.id === f.id; })) { f.source = f.source || SRC; T.push(f); } }

  // ===== Rester chez soi =====
  add({ id: "crise_eau_logement", cat: "Crises", titre: "L'eau cachée dans ton logement", illus: "eau_ebullition", priorite: true,
    intro: "Si l'eau du robinet est coupée ou déclarée non potable, ta maison contient souvent des dizaines de litres d'eau récupérable. Encore faut-il savoir où, et lesquels éviter.",
    etapes: [
      "Ballon d'eau chaude (souvent 100 à 200 litres) : coupe d'abord son électricité ou son gaz, ferme l'arrivée d'eau froide, ouvre un robinet d'eau chaude dans la maison pour laisser entrer l'air, puis vidange par le robinet du bas dans un récipient propre. Laisse refroidir : risque de brûlure.",
      "Canalisations : ferme la vanne principale, ouvre le robinet le plus haut de la maison, puis récupère l'eau au robinet le plus bas.",
      "Réservoir de la chasse d'eau (pas la cuvette), s'il n'y a pas de pastille ou de produit dedans : à rendre potable avant de la boire.",
      "Glaçons du congélateur, liquide des conserves de légumes et de fruits : buvables.",
      "Rends potable toute eau dont tu n'es pas sûr : ébullition d'au moins une minute, ou désinfection (voir « Rendre l'eau potable »).",
      "Ne rationne pas l'eau : bois ce dont tu as besoin aujourd'hui et cherche-en demain. Garde l'eau de la piscine ou de la baignoire pour l'hygiène et les toilettes."
    ],
    attention: [
      "Jamais l'eau des radiateurs ni du chauffage central : elle contient des produits chimiques (antigel, anticorrosion).",
      "Ne rallume pas un ballon d'eau chaude vide : la résistance grille. Remplis-le avant de rétablir le courant.",
      "Eau de piscine, de lit à eau ou d'aquarium : jamais à boire, même filtrée."
    ] });

  add({ id: "crise_couper", cat: "Crises", titre: "Couper le gaz, l'eau et l'électricité", illus: "urgence",
    intro: "Lors d'une inondation, d'une évacuation, d'un tremblement de terre ou d'une odeur de gaz, savoir couper les arrivées de la maison évite incendies, électrocutions et dégâts. Repère-les maintenant, pas le jour J.",
    etapes: [
      "Électricité : abaisse l'interrupteur général du tableau électrique (souvent près du compteur). Les pieds au sec, jamais si de l'eau touche le tableau.",
      "Eau : ferme la vanne principale, généralement près du compteur d'eau, à la cave, au garage ou sous l'évier.",
      "Gaz : ferme la vanne au compteur, souvent un quart de tour. Poignée perpendiculaire au tuyau = fermé.",
      "Après un gaz coupé, ne le rouvre pas toi-même : fais appel au gestionnaire du réseau ou à un professionnel, qui vérifie l'installation.",
      "Fais le tour une fois avec tout le foyer, colle une étiquette sur chaque vanne et note leur emplacement dans ton plan familial (Prêt 72 h > Plan)."
    ],
    alerte: ["Odeur de gaz : n'allume rien et n'éteins rien (ni lampe, ni interrupteur, ni sonnette), n'utilise pas ton téléphone à l'intérieur, ouvre les fenêtres, sors, et appelle depuis l'extérieur le numéro du gestionnaire de gaz ou le 112."],
    attention: ["Ne coupe le gaz que s'il y a une fuite, une consigne des autorités ou une évacuation : le remettre en service demande un professionnel."] });

  add({ id: "crise_calfeutrer", cat: "Crises", titre: "Calfeutrer une pièce", illus: "urgence",
    intro: "Lors d'un nuage toxique, de fumées d'incendie ou de retombées radioactives, les autorités peuvent demander de rester à l'intérieur. Une pièce bien fermée réduit fortement ce que tu respires.",
    etapes: [
      "Choisis une pièce intérieure avec le moins de fenêtres possible, assez grande pour tout le foyer.",
      "Produit chimique : préfère l'étage, car beaucoup de gaz toxiques sont plus lourds que l'air. Radioactivité : préfère le centre du bâtiment ou la cave.",
      "Ferme portes et fenêtres, arrête la ventilation, la climatisation, la hotte et le chauffage à air pulsé.",
      "Colle du ruban adhésif autour des fenêtres et des portes, et du plastique sur les bouches d'aération. Glisse un linge humide sous la porte.",
      "Prends avec toi : eau, radio à piles, lampe, téléphone et chargeur, médicaments, de quoi t'asseoir.",
      "Écoute la radio et attends la fin de l'alerte annoncée par les autorités pour rouvrir et aérer."
    ],
    attention: ["Une pièce calfeutrée n'est faite que pour quelques heures : suis les consignes des autorités pour la durée.", "N'utilise pas de bougie, de réchaud ou de chauffage à combustion dans une pièce fermée."] });

  // ===== Troc et rationnement =====
  add({ id: "crise_troc", cat: "Crises", titre: "Troc, rationnement et discrétion", illus: "kit",
    intro: "Si les paiements et les magasins s'arrêtent plusieurs jours, ce que tu as et ce que tu sais faire deviennent ta monnaie. Rationner trop fort ou attirer l'attention sont les deux erreurs à éviter.",
    etapes: [
      "Ne rationne jamais l'eau. Pour la nourriture, un adulte en bonne santé peut tenir longtemps avec environ la moitié de sa ration habituelle, s'il boit assez.",
      "Les enfants, les femmes enceintes ou qui allaitent, les malades et les personnes âgées gardent leur ration complète.",
      "Mange d'abord ce qui se périme : frigo, puis congélateur, puis réserves.",
      "Ce qui s'échange bien : eau et pastilles de purification, piles, briquets et allumettes, médicaments courants et pansements, café, sucre, sel, savon, papier toilette, outils et savoir-faire (réparer, soigner, cuisiner).",
      "Tes compétences valent souvent plus que tes objets : propose un service plutôt que de montrer ton stock.",
      "Discrétion : ne parle pas de tes réserves sur les réseaux, ne montre pas tout ce que tu as, garde un éclairage discret la nuit.",
      "Entraide : organise-toi avec quelques voisins de confiance (garde des enfants, cuisine en commun, tours pour aller aux nouvelles)."
    ],
    attention: ["Les médicaments sur ordonnance ne s'échangent pas : un traitement pris sans avis médical peut être dangereux.", "Signale aux autorités les personnes isolées ou dépendantes que tu connais."] });

  // ===== Radio =====
  add({ id: "crise_radio", cat: "Crises", titre: "Radio : s'informer et communiquer sans réseau", illus: "urgence",
    intro: "Quand internet et le réseau mobile tombent, la radio reste le canal prévu par les autorités pour informer. Les talkies-walkies permettent de garder le contact sur quelques kilomètres.",
    etapes: [
      "S'informer : écoute la radio publique de ton pays sur une radio à piles ou à manivelle (Belgique : RTBF, VRT ; France : franceinfo et les radios locales ici ; Luxembourg, Pays-Bas, Suisse : la radio publique nationale). Repère dès aujourd'hui leurs fréquences FM chez toi.",
      "Talkies-walkies PMR446 : 16 canaux sans licence en Europe (446,00625 à 446,19375 MHz), 0,5 W. Portée réelle : quelques centaines de mètres en ville, 1 à 3 km en campagne, bien plus d'un sommet à un autre.",
      "Convenez à l'avance d'un canal et d'un sous-code dans le foyer et le voisinage, et d'heures d'écoute (par exemple 5 minutes à chaque heure pile) pour économiser les piles.",
      "CB (27 MHz, sans licence) : le canal 9 est souvent utilisé comme canal d'appel d'urgence et le 19 par les routiers, sans garantie que quelqu'un écoute.",
      "Parle court : qui tu es, où tu es, ce dont tu as besoin. Répète deux fois les informations importantes.",
      "Calcule la portée maximale entre deux points avec l'outil « Portée radio » (Apprendre > Outils de terrain)."
    ],
    attention: [
      "Aucun canal PMR ou CB n'est surveillé par les secours : en urgence, essaie toujours le 112 d'abord.",
      "La VHF marine (canal 16, 156,800 MHz) est réservée aux bateaux et demande une licence, sauf pour un vrai appel de détresse.",
      "La plupart des grandes ondes (RTBF, France Inter) n'émettent plus : utilise la FM ou la radio numérique (DAB+)."
    ] });

  // ===== S'orienter sans GPS =====
  add({ id: "crise_nord_soleil", cat: "Orientation", titre: "Trouver le nord avec le soleil et l'heure", illus: "boussole",
    intro: "Sans boussole ni GPS, le soleil donne le nord à quelques degrés près, à condition de connaître l'heure. L'outil « Trouver le nord » de Sylva fait le calcul pour toi, même sans réseau.",
    etapes: [
      "Ouvre Apprendre > Outils de terrain > Trouver le nord : Sylva calcule où se trouve le soleil maintenant, pour ta région et l'heure du téléphone.",
      "Tourne-toi face au soleil : l'outil t'indique de combien tourner pour faire face au nord.",
      "Sans téléphone, en Belgique et en France : le soleil est plein sud entre 12 h 30 et 13 h 30 en hiver, entre 13 h 30 et 14 h 30 en été (plus tard quand on va vers l'ouest). À ce moment, ton ombre pointe vers le nord.",
      "Le soleil se lève à l'est et se couche à l'ouest seulement aux équinoxes : en hiver, il se lève au sud-est ; en été, au nord-est.",
      "Vérifie avec une deuxième méthode quand tu peux : bâton et ombre, étoile polaire la nuit."
    ],
    attention: ["Ne regarde jamais le soleil en face, même brièvement."] });

  // ===== Réanimation =====
  add({ id: "ps_rcp", cat: "Premiers secours", titre: "Réanimation cardio-pulmonaire (massage cardiaque)", illus: "premiers_secours", priorite: true,
    intro: "Une personne qui ne répond pas et ne respire pas normalement est en arrêt cardiaque. Chaque minute sans massage fait perdre environ 10 % de chances de survie : n'attends pas d'être sûr, commence.",
    etapes: [
      "Vérifie qu'il n'y a pas de danger pour toi. Secoue doucement les épaules et parle fort : elle répond ?",
      "Si elle ne répond pas : bascule doucement la tête en arrière, soulève le menton, et regarde si elle respire normalement pendant 10 secondes au plus. Des respirations rares et bruyantes (gasps) ne comptent pas.",
      "Ne respire pas normalement : appelle le 112 (haut-parleur), demande qu'on cherche un défibrillateur (DEA).",
      "Mains l'une sur l'autre au centre de la poitrine, bras tendus : enfonce de 5 à 6 cm, au rythme de 100 à 120 par minute, en laissant la poitrine remonter.",
      "Si tu es formé : 30 compressions puis 2 insufflations. Sinon, compressions seules sans t'arrêter.",
      "Dès qu'un défibrillateur arrive, allume-le et suis sa voix. Continue jusqu'à ce que les secours prennent le relais, que la personne se réveille, ou que tu sois à bout de forces."
    ],
    isole: [
      "Seul, sans secours joignables : la réanimation seule sauve rarement sans défibrillateur. Masse quand même tant que tu peux, en alternant avec une autre personne toutes les 2 minutes si vous êtes plusieurs.",
      "Si la personne reprend une respiration normale : position latérale de sécurité et surveillance continue."
    ],
    attention: ["Une formation de quelques heures (Croix-Rouge, protection civile) change tout : sur le terrain, on n'apprend pas ces gestes dans une appli."] });

  // Relier au chapitre des crises
  var G = window.SYLVA_GUIDE || [];
  var ch = G.filter(function (c) { return c.id === "crises"; })[0];
  if (ch) ["crise_eau_logement", "crise_couper", "crise_calfeutrer", "crise_troc", "crise_radio"].forEach(function (id) { if (ch.fiches.indexOf(id) === -1) ch.fiches.push(id); });
})();
