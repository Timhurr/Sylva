// Sylva – pays, milieux et espèces de montagne, Méditerranée et littoral.
(function () {
  // ---------- Pays et milieux ----------
  window.SYLVA_MILIEUX = {
    temperee: "Plaines, collines et forêts",
    montagne: "Montagne",
    mediterranee: "Méditerranée",
    littoral: "Littoral et dunes"
  };
  window.SYLVA_PAYS = {
    BE: { nom: "Belgique", milieux: ["temperee", "littoral"] },
    FR: { nom: "France", milieux: ["temperee", "montagne", "mediterranee", "littoral"] },
    LU: { nom: "Luxembourg", milieux: ["temperee"] },
    NL: { nom: "Pays-Bas", milieux: ["temperee", "littoral"] },
    DE: { nom: "Allemagne", milieux: ["temperee", "montagne", "littoral"] },
    CH: { nom: "Suisse", milieux: ["temperee", "montagne"] }
  };

  var TOUTE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  var PARTOUT = ["temperee", "montagne", "mediterranee", "littoral"];

  // ---------- Milieux des espèces déjà en base (par défaut : plaines et montagne) ----------
  var ZONES = {
    chataignier: ["temperee", "mediterranee"], noisetier: ["temperee", "montagne", "mediterranee"],
    eglantier: PARTOUT, prunellier: ["temperee", "montagne", "mediterranee", "littoral"],
    aubepine: ["temperee", "montagne", "mediterranee"], gland: ["temperee", "montagne", "mediterranee"],
    ortie: PARTOUT, pissenlit: PARTOUT, plantain: PARTOUT, mauve: PARTOUT, chenopode: PARTOUT, mure: PARTOUT,
    sureau: ["temperee", "montagne", "mediterranee"], cresson: ["temperee", "montagne", "mediterranee"],
    pin: ["temperee", "montagne", "mediterranee"], pomme: ["temperee", "montagne"], merisier: ["temperee", "montagne"],
    oenanthe: ["temperee", "littoral"], cigue: PARTOUT, douceamere: ["temperee", "montagne", "littoral"],
    houx: ["temperee", "montagne", "mediterranee", "littoral"], laurier: ["temperee", "littoral"],
    belladone: ["temperee", "montagne", "mediterranee"], if: ["temperee", "montagne", "mediterranee"],
    phalloide: ["temperee", "montagne", "mediterranee"], vireuse: ["temperee", "montagne"],
    pleurote: ["temperee", "montagne", "mediterranee"], hypholome: ["temperee", "montagne", "mediterranee"],
    sanglier: PARTOUT, renard: PARTOUT, frelon: PARTOUT, tique: ["temperee", "montagne", "mediterranee"],
    loup: ["temperee", "montagne", "mediterranee"], salamandre: ["temperee", "montagne", "mediterranee"],
    castor: ["temperee"], processionnaire: ["temperee", "mediterranee"], vipere: ["temperee", "montagne"]
  };
  // Notes propres à un pays
  var NOTES = {
    vipere: { BE: "En Wallonie, uniquement dans le sud de la province de Namur (vers Givet) et une zone de réintroduction en province de Liège. Pas connue dans la vallée de l'Ourthe.",
              FR: "Présente surtout dans la moitié nord, le Massif central, le Jura et les Alpes. Ne pas confondre avec la vipère aspic, plus au sud." },
    loup: { BE: "Revenu naturellement en Wallonie, avec plusieurs zones de présence permanente. Signaler une observation au Réseau Loup (Service public de Wallonie).",
            FR: "Bien installé dans les Alpes, le Jura, le Massif central et en progression ailleurs.",
            CH: "Plusieurs meutes dans les Alpes et le Jura." }
  };
  window.SYLVA_ESPECES.forEach(function (s) {
    s.zones = ZONES[s.id] || s.zones || ["temperee", "montagne"];
    if (NOTES[s.id]) s.notes = NOTES[s.id];
  });
  // Textes rendus généraux pour tous les pays
  window.SYLVA_ESPECES.forEach(function (s) {
    if (s.id === "vipere") s.resume = "Seule vipère du nord de l'Europe. Discrète et rare, elle ne mord que si on la manipule ou qu'on marche dessus.";
    if (s.id === "loup") s.resume = "De retour dans une grande partie de l'Europe de l'Ouest. Il évite l'humain.";
  });

  function E(cat, id, nom, latin, niveau, statut, saison, mois, zones, resume, identification, sosies, usages, extra) {
    var o = { cat: cat, id: id, nom: nom, latin: latin, niveau: niveau, statut: statut, saison: saison, mois: mois, zones: zones,
      resume: resume, identification: identification, sosies: sosies || [], usages: usages || [] };
    if (extra) for (var k in extra) o[k] = extra[k];
    return o;
  }
  var S = function (nom, latin, niveau, diff) { return { nom: nom, latin: latin, niveau: niveau, diff: diff }; };
  var NE_RIEN = ["Ne rien consommer."];

  var plus = [
    // ================= MÉDITERRANÉE =================
    E("plante", "arbousier", "Arbousier", "Arbutus unedo", "caution", "Comestible avec modération", "Oct. → déc.", [10, 11, 12], ["mediterranee", "littoral"],
      "Les « fraises des arbres » du maquis. Bien mûres, elles sont sucrées et farineuses.",
      ["Arbuste à feuilles persistantes luisantes, finement dentées", "Fruits ronds rugueux, jaunes puis rouge vif", "Fleurs blanches en clochettes en même temps que les fruits"],
      [], ["Uniquement les fruits bien rouges et tendres.", "En petite quantité : trop mûrs, ils fermentent légèrement."]),

    E("plante", "figuebarbarie", "Figuier de Barbarie", "Opuntia ficus-indica", "caution", "Comestible · épines invisibles", "Août → oct.", [8, 9, 10], ["mediterranee"],
      "Cactus aux « raquettes » plates. Ses fruits sont délicieux mais couverts de minuscules épines qui se plantent partout.",
      ["Tiges en raquettes ovales charnues", "Fruits ovales verts à rouges sur le bord des raquettes", "Touffes de minuscules épines (glochides) sur les fruits"],
      [], ["Ne jamais toucher à mains nues : utiliser une pince ou un tissu épais.", "Rouler les fruits sur le sol avec une branche, puis les éplucher avec un couteau."]),

    E("plante", "pinparasol", "Pin parasol (pignons)", "Pinus pinea", "ok", "Comestible", "Toute l'année", TOUTE, ["mediterranee", "littoral"],
      "Ses grosses pommes de pin libèrent les pignons, très nourrissants.",
      ["Couronne en parasol caractéristique", "Aiguilles par deux, longues", "Grosses pommes de pin lourdes contenant des graines à coque dure"],
      [], ["Chauffer la pomme de pin près du feu pour qu'elle s'ouvre, puis casser la coque des pignons."]),

    E("plante", "thym", "Thym", "Thymus vulgaris", "ok", "Aromatique", "Toute l'année", TOUTE, ["mediterranee"],
      "Petit arbrisseau très parfumé des garrigues.",
      ["Sous-arbrisseau de 10 à 30 cm, tiges ligneuses", "Minuscules feuilles grises enroulées", "Odeur forte caractéristique au froissement"],
      [], ["En infusion ou pour parfumer un plat.", "Cueillir quelques brins, sans arracher la plante."]),

    E("plante", "romarin", "Romarin", "Salvia rosmarinus", "ok", "Aromatique", "Toute l'année", TOUTE, ["mediterranee", "littoral"],
      "Arbuste aromatique des garrigues et des côtes.",
      ["Arbuste aux feuilles en aiguilles, vert foncé dessus, blanches dessous, bords enroulés", "Fleurs bleu pâle", "Odeur camphrée"],
      [S("If (Taxus baccata)", "Taxus baccata", "danger", "Aiguilles plates, vert franc des deux côtés, sans odeur. Mortel.")],
      ["En infusion ou pour parfumer une viande grillée."]),

    E("plante", "asperge", "Asperge sauvage", "Asparagus acutifolius", "caution", "Comestible · sosie toxique", "Mars → mai", [3, 4, 5], ["mediterranee"],
      "Fines pousses amères très recherchées au printemps dans le maquis.",
      ["Buisson épineux aux « feuilles » en aiguilles piquantes", "Au printemps, fines pousses vertes à tête serrée qui sortent du pied"],
      [S("Tamier commun (Dioscorea communis)", "Dioscorea communis", "danger", "Pousses grimpantes sans buisson épineux autour, tête qui s'enroule. Toxique, très irritant.")],
      ["Cuire les pousses comme des asperges (omelette)."]),

    E("toxique", "laurierrose", "Laurier-rose", "Nerium oleander", "danger", "Mortel", "Toute l'année", TOUTE, ["mediterranee"],
      "Arbuste ornemental omniprésent dans le Midi, mortel pour le cœur. Même la fumée de son bois est dangereuse.",
      ["Feuilles étroites, coriaces, groupées par trois", "Grandes fleurs roses, blanches ou rouges en bouquets"],
      [], ["Ne rien consommer. Ne jamais l'utiliser pour embrocher des aliments ni le brûler."]),

    E("toxique", "datura", "Datura stramoine", "Datura stramonium", "danger", "Mortel", "Juin → oct.", [6, 7, 8, 9, 10], ["temperee", "mediterranee"],
      "Mauvaise herbe des champs et friches, en expansion. Ses graines ont déjà contaminé des récoltes.",
      ["Grandes fleurs blanches en trompette", "Fruit en capsule épineuse grosse comme une noix", "Odeur désagréable"],
      [], NE_RIEN),

    E("toxique", "ricin", "Ricin", "Ricinus communis", "danger", "Mortel", "Toute l'année", TOUTE, ["mediterranee"],
      "Ses graines marbrées contiennent l'une des toxines végétales les plus puissantes.",
      ["Grandes feuilles palmées à 5-11 lobes, souvent rougeâtres", "Fruits en capsules épineuses contenant des graines marbrées brillantes"],
      [], NE_RIEN),

    E("champignon", "lactaire", "Lactaire délicieux", "Lactarius deliciosus", "caution", "Comestible · faire vérifier", "Sept. → déc.", [9, 10, 11, 12], ["mediterranee", "montagne"],
      "Le « safran » des pinèdes : il laisse couler un lait orange.",
      ["Chapeau orange zoné de cercles concentriques", "Lait ORANGE carotte à la cassure, qui verdit", "Sous les pins"],
      [S("Lactaire à toison (Lactarius torminosus)", "Lactarius torminosus", "danger", "Bord du chapeau poilu, lait BLANC très âcre. Toxique.")],
      ["Faire vérifier toute récolte par un mycologue avant consommation."]),

    E("animal", "aspic", "Vipère aspic", "Vipera aspis", "caution", "Morsure", "Mars → oct.", [3, 4, 5, 6, 7, 8, 9, 10], ["temperee", "montagne", "mediterranee"],
      "La vipère la plus fréquente en France. Elle aime les pierriers, murets et lisières ensoleillés.",
      ["Serpent trapu de 60 à 75 cm, museau légèrement retroussé", "Taches dorsales en barres ou en zigzag interrompu", "Pupille verticale"],
      [S("Couleuvres", "Natrix helvetica", "ok", "Plus fines, pupille ronde, grandes écailles sur la tête. Inoffensives.")],
      ["En cas de morsure : rester calme, s'allonger, immobiliser le membre, retirer bagues et montre.", "Ne pas sucer, inciser ni poser de garrot. Appeler le 112."],
      { pays: ["FR", "CH", "DE"] }),

    E("animal", "processionpin", "Chenille processionnaire du pin", "Thaumetopoea pityocampa", "caution", "Poils urticants", "Janv. → avril", [1, 2, 3, 4], ["mediterranee", "temperee", "littoral"],
      "Se déplace en longues files au sol en fin d'hiver. Dangereuse pour les chiens et les enfants.",
      ["Chenilles brun-orangé poilues qui se suivent en file indienne", "Nids blancs soyeux en boule au bout des branches de pins"],
      [], ["Ne pas toucher les chenilles ni les nids, tenir les chiens en laisse.", "En cas de contact : ne pas frotter, rincer à l'eau, changer de vêtements, consulter si les yeux ou la bouche sont touchés."],
      { pays: ["FR", "CH"] }),

    // ================= MONTAGNE =================
    E("toxique", "veratre", "Vératre blanc", "Veratrum album", "danger", "Mortel", "Avril → sept.", [4, 5, 6, 7, 8, 9], ["montagne"],
      "Pousse dans les mêmes alpages que la gentiane jaune. La confusion est mortelle et arrive chaque année.",
      ["Grandes feuilles plissées en accordéon, ALTERNES (une par une, en spirale) le long de la tige", "Dessous des feuilles duveteux", "Grappes de fleurs blanc-vert en été"],
      [S("Gentiane jaune (Gentiana lutea)", "Gentiana lutea", "caution", "Feuilles OPPOSÉES deux à deux, lisses dessous, fleurs jaunes. Protégée dans de nombreuses régions : ne pas cueillir.")],
      NE_RIEN),

    E("plante", "airelle", "Airelle rouge", "Vaccinium vitis-idaea", "ok", "Comestible", "Août → oct.", [8, 9, 10], ["montagne", "temperee"],
      "Petites baies rouges acidulées des landes et forêts d'altitude.",
      ["Petit arbrisseau aux feuilles persistantes, coriaces, luisantes, avec des points noirs dessous", "Baies rouges brillantes en grappes"],
      [S("Busserole (Arctostaphylos uva-ursi)", "Arctostaphylos uva-ursi", "caution", "Feuilles sans points noirs dessous, baies farineuses et fades. À éviter.")],
      ["Crues (acides) ou cuites en compote."]),

    E("plante", "epilobe", "Épilobe en épi", "Chamaenerion angustifolium", "ok", "Comestible", "Avril → juin (pousses)", [4, 5, 6], ["montagne", "temperee"],
      "Grandes hampes roses dans les coupes forestières et clairières d'altitude.",
      ["Tiges dressées jusqu'à 1,5 m", "Feuilles étroites en lance, nervures qui se rejoignent en boucle au bord", "Grappes de fleurs rose vif en été"],
      [], ["Jeunes pousses cuites comme des asperges.", "Feuilles séchées en infusion."]),

    E("animal", "chamois", "Chamois", "Rupicapra rupicapra", "info", "Observation", "Toute l'année", TOUTE, ["montagne"],
      "Agile sur les pentes raides, il siffle quand il est inquiet.",
      ["Pelage brun en été, presque noir en hiver", "Masque facial blanc et noir", "Petites cornes noires recourbées en crochet"],
      [], ["Observer de loin, sans le pousser à fuir dans les pentes, surtout en hiver où chaque effort l'épuise."]),

    E("animal", "marmotte", "Marmotte", "Marmota marmota", "info", "Observation", "Avril → oct.", [4, 5, 6, 7, 8, 9, 10], ["montagne"],
      "Siffle pour prévenir ses congénères. Hiberne d'octobre à avril.",
      ["Gros rongeur brun-gris assis près de son terrier", "Sifflement aigu d'alerte"],
      [], ["Ne pas nourrir : la nourriture humaine les rend malades."]),

    E("animal", "patou", "Chiens de protection (patous)", "Canis familiaris", "caution", "Comportement à adopter", "Mai → oct.", [5, 6, 7, 8, 9, 10], ["montagne"],
      "Grands chiens blancs qui gardent les troupeaux en alpage. Ils protègent les moutons, pas les randonneurs.",
      ["Grand chien blanc ou crème, souvent seul au milieu ou près d'un troupeau", "Aboie et vient au-devant des promeneurs"],
      [], ["Contourner le troupeau largement. Descendre du vélo et marcher.", "S'arrêter calmement s'il approche, ne pas crier, ne pas le menacer avec un bâton, ne pas le regarder fixement.", "Le laisser vous identifier, puis repartir doucement sans tourner le dos brusquement.", "Garder son propre chien en laisse, au plus près de soi."],
      { pays: ["FR", "CH"] }),

    // ================= LITTORAL =================
    E("plante", "salicorne", "Salicorne", "Salicornia europaea", "ok", "Comestible", "Juin → août", [6, 7, 8], ["littoral"],
      "Plante croquante et naturellement salée des prés salés.",
      ["Petite plante charnue sans feuilles visibles, tiges articulées en segments", "Pousse dans la vase des prés salés, inondés à marée haute"],
      [], ["Crue ou blanchie, sans ajouter de sel.", "Cueillette souvent réglementée ou interdite dans les réserves naturelles : se renseigner."]),

    E("plante", "argousier", "Argousier", "Hippophae rhamnoides", "ok", "Comestible", "Sept. → déc.", [9, 10, 11, 12], ["littoral", "montagne"],
      "Buisson épineux des dunes aux baies orange très riches en vitamine C.",
      ["Buisson très épineux, feuilles étroites argentées", "Baies orange vif serrées le long des rameaux"],
      [], ["Baies très acides : en jus ou cuites.", "Couper un rameau abîme le buisson : cueillir à la main, avec des gants."]),

    E("animal", "vive", "Vive (poisson venimeux)", "Echiichthys vipera", "caution", "Piqûre très douloureuse", "Juin → sept.", [6, 7, 8, 9], ["littoral"],
      "Petit poisson enfoui dans le sable des plages, à marée basse. Ses épines dorsales injectent un venin très douloureux.",
      ["Petit poisson brun-jaune de 10 à 15 cm, enfoui dans le sable", "Nageoire dorsale noire piquante"],
      [], ["Porter des chaussures d'eau dans le sable à marée basse.", "En cas de piqûre : plonger le pied dans l'eau la plus chaude supportable (sans se brûler) 30 minutes, car le venin est détruit par la chaleur. Consulter si malaise ou gonflement important."]),

    E("animal", "meduse", "Méduses", "Cyanea capillata / Chrysaora hysoscella", "caution", "Brûlures", "Juin → sept.", [6, 7, 8, 9], ["littoral", "mediterranee"],
      "Certaines provoquent des brûlures vives, même échouées sur la plage.",
      ["Corps gélatineux en ombrelle, longs filaments", "Ne jamais toucher une méduse échouée"],
      [], ["Sortir de l'eau, rincer à l'eau de mer (pas d'eau douce, qui fait éclater les cellules urticantes).", "Retirer les filaments avec une carte ou une pince, sans frotter.", "Appeler le 112 en cas de gêne respiratoire ou de malaise."])
  ];
  plus.forEach(function (s) { window.SYLVA_ESPECES.push(s); });
})();
