/* Sylva – Prêt 72 h : kit d'urgence du foyer, pays et fiches « Crises » (v0.9.72).
   Contenu rédigé pour Sylva d'après les recommandations officielles : lignes directrices de la Commission européenne
   sur la préparation de la population (3 novembre 2026, autonomie de 72 h), guide du Centre de crise belge
   (« Prepared together », octobre 2026), listes des gouvernements néerlandais (3 L d'eau par personne et par jour)
   et luxembourgeois (infocrise.public.lu). Sylva n'est pas un service officiel : en cas de crise, suis les consignes des autorités. */
(function () {
  "use strict";
  var C = window.SYLVA_CATEGORIES || [];
  if (C.indexOf("Crises") === -1) C.splice(1, 0, "Crises");

  // f = foyer : { ad: adultes, en: enfants, bb: bébés, an: animaux, med: traitement, mob: mobilité réduite ou appareil médical }
  function pers(f) { return (f.ad || 0) + (f.en || 0) + (f.bb || 0); }
  window.SYLVA_KIT72 = [
    // ===== Rester chez soi : 72 h d'autonomie =====
    { id: "eau", grp: "maison", nom: "Eau en bouteilles", qte: function (f) { return 9 * pers(f) + " L (3 L par personne et par jour)"; }, info: "Pour boire et cuisiner. Prévois plus pour l'hygiène si tu peux. Change-la selon la date sur les bouteilles." },
    { id: "nourriture", grp: "maison", nom: "Nourriture qui se garde et se mange sans cuisson", qte: function (f) { return "3 jours pour " + pers(f) + " personne" + (pers(f) > 1 ? "s" : ""); }, info: "Conserves, pain longue conservation, fruits secs, beurre de cacahuète, barres. Choisis ce que vous mangez déjà, et fais tourner." },
    { id: "ouvreboite", grp: "maison", nom: "Ouvre-boîte manuel", info: "Indispensable si tes conserves n'ont pas d'ouverture facile." },
    { id: "radio", grp: "maison", nom: "Radio à piles ou à manivelle", info: "Si le réseau mobile et internet tombent, c'est par la radio que les autorités informent." },
    { id: "lampe", grp: "maison", nom: "Lampes de poche et piles de rechange", qte: function (f) { return Math.max(1, f.ad || 1) + " lampe" + ((f.ad || 1) > 1 ? "s" : ""); }, info: "Préfère les lampes aux bougies : moins de risque d'incendie." },
    { id: "powerbank", grp: "maison", nom: "Batteries externes chargées", info: "Recharge-les tous les 3 mois." },
    { id: "bougies", grp: "maison", nom: "Bougies, allumettes ou briquet", info: "Jamais sans surveillance, loin des rideaux, hors de portée des enfants." },
    { id: "secours", grp: "maison", nom: "Trousse de premiers secours", info: "Pansements, compresses, désinfectant, bande, ciseaux, gants, antidouleur." },
    { id: "medic", grp: "maison", nom: "Traitements en cours", qte: function () { return "au moins 7 jours d'avance si possible"; }, cond: function (f) { return f.med; }, info: "Demande à ton médecin ou ton pharmacien comment garder une petite réserve. Garde aussi une copie des ordonnances." },
    { id: "cash", grp: "maison", nom: "Argent liquide en petites coupures et pièces", info: "Sans électricité ni réseau, les cartes et les distributeurs ne marchent plus." },
    { id: "papiers", grp: "maison", nom: "Copies des papiers importants", info: "Pièces d'identité, assurances, ordonnances, dans une pochette étanche." },
    { id: "numeros", grp: "maison", nom: "Liste papier des numéros importants", info: "Famille, voisins, médecin, école, assurance : ton téléphone peut être vide." },
    { id: "couvertures", grp: "maison", nom: "Couvertures ou sacs de couchage", qte: function (f) { return pers(f) + " (un par personne)"; }, info: "Pour garder la chaleur si le chauffage s'arrête." },
    { id: "hygiene", grp: "maison", nom: "Hygiène", info: "Papier toilette, lingettes, savon ou gel, protections hygiéniques, sacs poubelle solides." },
    { id: "outils", grp: "maison", nom: "Outils de base", info: "Couteau multifonction, ruban adhésif, pince, gants de travail." },
    { id: "cles", grp: "maison", nom: "Double des clés de la maison et de la voiture" },
    { id: "rechaud", grp: "maison", nom: "Réchaud de camping et cartouches", info: "À n'utiliser que dehors : à l'intérieur, risque d'intoxication au monoxyde de carbone (gaz mortel et sans odeur)." },
    { id: "sifflet", grp: "maison", nom: "Sifflet", info: "Pour te signaler aux secours sans t'épuiser à crier." },
    { id: "bebe", grp: "maison", nom: "Pour le bébé", qte: function (f) { return "lait infantile, biberons, " + (24 * (f.bb || 0)) + " couches environ"; }, cond: function (f) { return f.bb > 0; }, info: "Prévois aussi de l'eau en bouteille adaptée pour les biberons." },
    { id: "enfants", grp: "maison", nom: "Jeux, livres, doudou", cond: function (f) { return f.en > 0 || f.bb > 0; }, info: "Occuper et rassurer les enfants compte autant que le reste." },
    { id: "animaux", grp: "maison", nom: "Pour les animaux", qte: function (f) { return "3 jours de nourriture et d'eau pour " + f.an; }, cond: function (f) { return f.an > 0; }, info: "Avec laisse, caisse de transport, carnet de vaccination." },
    { id: "appareils", grp: "maison", nom: "Énergie de secours pour les appareils médicaux", cond: function (f) { return f.mob; }, info: "Batteries de rechange, plan avec ton prestataire si l'électricité est coupée longtemps, lunettes ou aides de rechange." },
    { id: "hiver", grp: "maison", nom: "Pour l'hiver : vêtements chauds et bonnets", qte: function (f) { return "une tenue chaude par personne"; }, cond: function () { var m = new Date().getMonth(); return m >= 9 || m <= 2; }, info: "Si le chauffage s'arrête, on perd la chaleur en quelques heures : couches de laine, bonnet, chaussettes épaisses." },
    { id: "ete", grp: "maison", nom: "Pour l'été : de quoi se rafraîchir", cond: function () { var m = new Date().getMonth(); return m >= 5 && m <= 7; }, info: "Brumisateur, ventilateur à piles, chapeau, crème solaire. Prévois plus d'eau en cas de canicule." },
    { id: "iode", grp: "maison", nom: "Comprimés d'iode (si ton pays en distribue)", info: "À prendre uniquement quand les autorités le demandent. Voir la fiche « Accident nucléaire ou chimique »." },
    // ===== Sac d'évacuation : si tu dois partir vite =====
    { id: "s_papiers", grp: "sac", nom: "Papiers, copies et argent liquide", info: "Pièces d'identité, cartes, copies des documents, cash." },
    { id: "s_medic", grp: "sac", nom: "Médicaments et ordonnances", info: "Le traitement en cours de chacun, pour plusieurs jours." },
    { id: "s_eau", grp: "sac", nom: "Eau et en-cas faciles à transporter", qte: function (f) { return "pour " + pers(f) + " personne" + (pers(f) > 1 ? "s" : "") + " sur la route"; } },
    { id: "s_tel", grp: "sac", nom: "Téléphone, chargeur et batterie externe" },
    { id: "s_lampe", grp: "sac", nom: "Lampe de poche ou frontale" },
    { id: "s_vetements", grp: "sac", nom: "Vêtements de rechange et imperméable", qte: function (f) { return "un change par personne"; } },
    { id: "s_couverture", grp: "sac", nom: "Couverture de survie" },
    { id: "s_trousse", grp: "sac", nom: "Petite trousse de secours" },
    { id: "s_cles", grp: "sac", nom: "Clés" },
    { id: "s_hygiene", grp: "sac", nom: "Hygiène de base", info: "Brosse à dents, gel, mouchoirs, protections." },
    { id: "s_plan", grp: "sac", nom: "Ton plan familial et la liste des contacts, sur papier" },
    { id: "s_enfant", grp: "sac", nom: "Doudou, jeu, de quoi occuper les enfants", cond: function (f) { return f.en > 0 || f.bb > 0; } },
    { id: "s_animaux", grp: "sac", nom: "Laisse, caisse et nourriture des animaux", cond: function (f) { return f.an > 0; } }
  ];

  // Systèmes d'alerte et sources officielles par pays (112 fonctionne dans toute l'Union européenne)
  window.SYLVA_PAYS72 = {
    BE: { nom: "Belgique", alerte: "BE-Alert : inscris-toi gratuitement pour recevoir les alertes par SMS, e-mail ou appel.", liens: [["be-alert.be", "https://www.be-alert.be"], ["centredecrise.be", "https://centredecrise.be"], ["risquenucleaire.be (comprimés d'iode)", "https://www.risquenucleaire.be"]], num: "112 (secours), 101 (police)" },
    FR: { nom: "France", alerte: "FR-Alert : les alertes arrivent seules sur les téléphones de la zone, sans inscription.", liens: [["georisques.gouv.fr (risques près de chez toi)", "https://www.georisques.gouv.fr"]], num: "112, 15 (SAMU), 18 (pompiers), 17 (police)" },
    LU: { nom: "Luxembourg", alerte: "LU-Alert : les alertes arrivent sur les téléphones de la zone.", liens: [["infocrise.public.lu", "https://infocrise.public.lu"]], num: "112, 113 (police)" },
    NL: { nom: "Pays-Bas", alerte: "NL-Alert : les alertes arrivent sur les téléphones de la zone, sans inscription.", liens: [["crisis.nl", "https://www.crisis.nl"]], num: "112" },
    DE: { nom: "Allemagne", alerte: "NINA : installe l'application d'alerte officielle. Les alertes arrivent aussi sur les téléphones de la zone (Cell Broadcast).", liens: [["bbk.bund.de", "https://www.bbk.bund.de"]], num: "112 (secours, pompiers), 110 (police)" },
    CH: { nom: "Suisse", alerte: "Alertswiss : installe l'application officielle pour recevoir les alertes.", liens: [["alertswiss.ch", "https://www.alertswiss.ch"]], num: "112, 117 (police), 118 (feu), 144 (ambulance)" },
    XX: { nom: "Autre pays", alerte: "Renseigne-toi sur le système d'alerte officiel de ton pays et inscris-toi s'il le faut.", liens: [], num: "112 dans toute l'Union européenne" }
  };

  var SRC = "Rédigé pour Sylva d'après les recommandations de la Commission européenne (autonomie de 72 h, 2026), du Centre de crise belge et des services de protection civile. En cas de crise, les consignes des autorités passent avant cette fiche.";
  var T = window.SYLVA_TECHNIQUES || [];
  function add(f) { if (!T.some(function (t) { return t.id === f.id; })) { f.cat = "Crises"; f.source = f.source || SRC; T.push(f); } }

  add({ id: "crise_72h", titre: "Être prêt pour 72 heures", illus: "urgence", priorite: true,
    intro: "Lors d'une grosse crise (panne générale, inondation, tempête, accident), les secours ne peuvent pas aider tout le monde tout de suite. L'Union européenne demande à chaque foyer de pouvoir tenir seul au moins 72 heures.",
    etapes: [
      "Informe-toi : inscris-toi au système d'alerte de ton pays et repère les sources officielles (Sylva > Prêt 72 h > Pays).",
      "Fais un plan avec ton foyer : qui appeler, où se retrouver si on est séparés, que faire des enfants à l'école et des personnes fragiles.",
      "Prépare un stock pour rester chez toi 72 heures : eau (3 L par personne et par jour), nourriture qui se mange sans cuisson, lumière, radio, médicaments, argent liquide.",
      "Prépare à part un sac d'évacuation léger, prêt à prendre si on te demande de partir : papiers, médicaments, eau, chargeur, vêtements.",
      "Construis ton stock petit à petit, à chaque course : pas besoin de tout acheter d'un coup ni de matériel cher.",
      "Fais tourner : consomme ce qui arrive à date et remplace-le. Sylva te prévient des dates dans l'onglet Stock.",
      "Pense aux voisins âgés, malades ou seuls : en crise, l'entraide sauve des vies."
    ],
    attention: ["Garde le stock dans un endroit facile d'accès, connu de tout le foyer.", "Un kit oublié au fond de la cave ne sert à rien : vérifie-le deux fois par an, par exemple au changement d'heure."] });

  add({ id: "crise_panne", titre: "Panne d'électricité générale", illus: "urgence",
    intro: "Une panne qui dure coupe le chauffage, le frigo, parfois l'eau, le réseau mobile et les paiements. Le plus grand danger vient souvent des solutions de fortune.",
    etapes: [
      "Débranche les appareils sensibles (ordinateur, télé) pour éviter les dégâts au retour du courant. Laisse une lampe allumée pour savoir quand il revient.",
      "Garde le frigo et le congélateur fermés : un congélateur plein garde le froid environ 48 heures, à moitié plein environ 24 heures.",
      "Écoute la radio à piles pour les consignes. Économise ton téléphone : mode économie d'énergie, luminosité basse, mode avion quand tu n'en as pas besoin.",
      "Si le froid s'installe : regroupe-toi dans une seule pièce, ferme les portes, superpose les couches, couvertures et bonnet.",
      "Si on annonce une coupure d'eau, remplis des bouteilles et la baignoire (pour les toilettes et l'hygiène, pas pour boire).",
      "Prends des nouvelles des voisins fragiles et des personnes qui dépendent d'un appareil médical."
    ],
    attention: [
      "Jamais de barbecue, de réchaud, de brasero ou de groupe électrogène à l'intérieur ni dans un garage : le monoxyde de carbone tue sans odeur. Maux de tête, nausées, somnolence de plusieurs personnes à la fois : sors à l'air et appelle le 112.",
      "Bougies : jamais sans surveillance. Préfère les lampes."
    ] });

  add({ id: "crise_inondation", titre: "Inondation", illus: "urgence",
    intro: "L'eau monte parfois très vite, et le courant emporte plus que ce qu'on croit. La règle d'or : ne jamais entrer dans l'eau en mouvement.",
    etapes: [
      "Dès l'alerte : monte en hauteur les objets précieux, papiers et médicaments ; mets ton sac d'évacuation à portée de main.",
      "Si l'eau menace la maison et que c'est sans danger, coupe l'électricité et le gaz.",
      "Si on te demande d'évacuer, pars tout de suite par l'itinéraire indiqué. Préviens tes proches.",
      "Si tu es bloqué, monte à l'étage (pas dans un grenier sans issue) et signale-toi : lampe, drap à la fenêtre, sifflet, 112.",
      "Après : ne rentre que quand les autorités le permettent, ne rebranche rien avant contrôle, jette la nourriture qui a touché l'eau, et suis les consignes sur l'eau du robinet.",
      "Prends des photos des dégâts pour l'assurance avant de nettoyer."
    ],
    attention: [
      "15 cm d'eau qui court suffisent à faire tomber un adulte, 30 cm à emporter une voiture. Ne marche pas et ne roule pas dans une zone inondée.",
      "Ne descends jamais dans une cave ou un parking souterrain pendant une inondation."
    ] });

  add({ id: "crise_tempete", titre: "Tempête et vents violents", illus: "orage",
    intro: "Pendant une tempête, la plupart des blessés le sont par des chutes d'arbres, de branches et d'objets emportés par le vent.",
    etapes: [
      "Avant : rentre ou attache ce qui peut s'envoler (mobilier de jardin, poubelles, trampoline), ferme volets et fenêtres.",
      "Reste à l'intérieur, loin des fenêtres. Reporte les trajets.",
      "Ne va pas en forêt ni sous les arbres, et ne bivouaque pas : c'est là que le danger est le plus grand, même après le pic du vent.",
      "Après : ne touche jamais un câble électrique tombé, éloigne-toi et appelle le 112.",
      "Signale les arbres tombés sur la route et aide les voisins si c'est sans danger."
    ],
    attention: ["Après une tempête, des branches cassées peuvent rester suspendues dans les arbres et tomber plusieurs jours plus tard."] });

  add({ id: "crise_canicule", titre: "Canicule", illus: "urgence",
    intro: "La chaleur tue chaque été en Europe, surtout les personnes âgées, les bébés, les malades et ceux qui travaillent dehors.",
    etapes: [
      "Bois régulièrement sans attendre d'avoir soif. Évite l'alcool.",
      "Ferme volets et fenêtres le jour, aère la nuit quand il fait plus frais.",
      "Rafraîchis-toi : douches, linge humide, pièce la plus fraîche, lieux climatisés.",
      "Évite les efforts aux heures chaudes. Prends des nouvelles des personnes seules ou âgées au moins une fois par jour."
    ],
    alerte: ["Peau chaude et sèche, confusion, malaise, température très élevée : c'est un coup de chaleur, urgence vitale. Appelle le 112 et refroidis la personne en attendant."],
    attention: ["Ne laisse jamais un enfant, une personne fragile ou un animal dans une voiture, même quelques minutes."] });

  add({ id: "crise_abri", titre: "Accident nucléaire ou chimique : se mettre à l'abri", illus: "urgence",
    intro: "Lors d'un nuage toxique ou radioactif, le plus sûr est presque toujours de rester dans un bâtiment fermé. Les autorités te disent quoi faire par alerte, radio et télé.",
    etapes: [
      "Entre dans le bâtiment le plus proche et restes-y.",
      "Ferme portes et fenêtres, arrête la ventilation et la climatisation.",
      "Écoute la radio ou les messages d'alerte, et suis exactement les consignes.",
      "Ne va pas chercher les enfants à l'école : l'école les met à l'abri.",
      "Évite de téléphoner pour laisser le réseau aux secours : envoie plutôt un SMS à tes proches.",
      "Comprimés d'iode : uniquement quand les autorités le demandent. Ils protègent seulement la thyroïde contre l'iode radioactif, surtout chez les enfants, les jeunes et les femmes enceintes ou qui allaitent. En Belgique, ils sont disponibles en pharmacie (infos sur risquenucleaire.be)."
    ],
    attention: ["Ne sors pas « pour voir » : reste à l'abri jusqu'à la fin de l'alerte annoncée par les autorités."] });

  add({ id: "crise_evacuer", titre: "Évacuer : partir vite et bien", illus: "urgence",
    intro: "Si les autorités demandent d'évacuer, chaque minute compte. Avoir son sac prêt et un point de rendez-vous fait toute la différence.",
    etapes: [
      "Prends ton sac d'évacuation, tes médicaments, tes papiers et tes animaux.",
      "Si on te le demande et si c'est sans danger : coupe le gaz, l'eau et l'électricité, et ferme la maison à clé.",
      "Suis l'itinéraire indiqué par les autorités, même s'il te semble plus long.",
      "Préviens tes proches de l'endroit où tu vas, et signale-toi au centre d'accueil si on t'y envoie.",
      "Si le foyer est séparé, rejoins le point de rendez-vous prévu dans ton plan familial."
    ],
    attention: ["Ne reviens pas chercher des affaires tant que l'accès n'est pas autorisé."] });

  add({ id: "crise_sansreseau", titre: "Sans réseau ni paiement par carte", illus: "urgence",
    intro: "Une panne ou une cyberattaque peut couper en même temps le téléphone, internet et les paiements. Ce qui est sur papier et dans ta poche devient précieux.",
    etapes: [
      "Garde de l'argent liquide en petites coupures et des pièces.",
      "Garde sur papier : les numéros importants, ton plan familial et l'adresse du point de rendez-vous.",
      "Écoute la radio à piles : c'est le canal prévu quand tout le reste tombe.",
      "Les SMS passent souvent quand les appels ne passent plus. Fais des messages courts.",
      "Le 112 reste prioritaire sur les réseaux : en urgence, essaie quand même, même sans crédit ni carte SIM.",
      "Sylva marche sans réseau : carte enregistrée, fiches, SOS, ton plan et ton stock."
    ],
    attention: ["Recharge tes batteries externes et ton téléphone dès que le courant revient, en prévision d'une nouvelle coupure."] });

  // Relier les fiches au guide, dans un chapitre dédié
  var G = window.SYLVA_GUIDE || [];
  if (!G.some(function (c) { return c.id === "crises"; })) {
    G.splice(1, 0, { id: "crises", titre: "Crises : tenir 72 heures", sections: [
      { titre: "Pourquoi 72 heures", p: ["Lors d'une catastrophe, les secours vont d'abord aux situations les plus graves. Pendant les premiers jours, chaque foyer doit pouvoir se débrouiller : c'est la recommandation de l'Union européenne depuis 2025, confirmée en novembre 2026."] },
      { titre: "Les trois étapes", etapes: ["S'informer : système d'alerte de ton pays, radio, sources officielles.", "Faire un plan : contacts, point de rendez-vous, rôle de chacun.", "Préparer le stock maison et le sac d'évacuation, petit à petit."],
        encadre: { type: "astuce", titre: "Dans Sylva", texte: "Aujourd'hui > Prêt 72 h : ton foyer, ton kit calculé, ton stock avec les dates et ton plan familial, tout fonctionne hors ligne." } }
    ], fiches: ["crise_72h", "crise_panne", "crise_inondation", "crise_tempete", "crise_canicule", "crise_abri", "crise_evacuer", "crise_sansreseau"] });
  }
})();
