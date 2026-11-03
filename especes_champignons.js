// Sylva – champignons courants d'Europe de l'Ouest : les plus cueillis et les plus dangereux.
// Liste des espèces dangereuses alignée sur la brochure « Champignons » du Centre Antipoisons belge.
(function () {
  function C(id, nom, latin, niveau, statut, saison, mois, zones, resume, identification, sosies, usages) {
    return { cat: "champignon", id: id, nom: nom, latin: latin, niveau: niveau, statut: statut, saison: saison, mois: mois,
      zones: zones || ["temperee", "montagne"], resume: resume, identification: identification, sosies: sosies || [], usages: usages || [] };
  }
  var S = function (nom, latin, niveau, diff) { return { nom: nom, latin: latin, niveau: niveau, diff: diff }; };
  var VERIF = ["Faire vérifier toute récolte par un mycologue ou un cercle de mycologie avant consommation."];
  var NE_RIEN = ["Ne rien consommer. Se laver les mains après manipulation."];
  var AUT = [8, 9, 10, 11], AUT2 = [9, 10, 11];
  var PL = ["temperee", "montagne", "mediterranee"];

  var liste = [
    // ===== Comestibles courants (toujours à faire vérifier) =====
    C("rosedespres", "Rosé des prés", "Agaricus campestris", "caution", "Comestible · faire vérifier", "Juil. → oct.", [7, 8, 9, 10], ["temperee", "montagne", "littoral"],
      "Le champignon des pâtures, cousin sauvage du champignon de Paris. Ses confusions avec les amanites blanches sont parmi les plus graves.",
      ["Chapeau blanc soyeux", "Lames ROSES chez le jeune, puis brun chocolat (jamais blanches)", "Anneau simple, PAS de volve à la base", "Dans les prés pâturés, pas en forêt"],
      [S("Amanite vireuse / phalloïde", "Amanita virosa", "danger", "Lames BLANCHES qui le restent, volve en sac à la base (dégager le pied). Mortelles."),
       S("Agaric jaunissant", "Agaricus xanthodermus", "danger", "Jaunit vivement quand on gratte la base du pied, odeur d'encre ou de produit chimique. Toxique.")], VERIF),

    C("coprin", "Coprin chevelu", "Coprinus comatus", "caution", "Comestible très jeune · faire vérifier", "Mai → nov.", [5, 6, 7, 8, 9, 10, 11], ["temperee", "montagne", "littoral"],
      "Haut chapeau blanc écailleux en forme d'obus, sur les talus et pelouses. Il se liquéfie en encre noire en quelques heures.",
      ["Chapeau blanc cylindrique couvert d'écailles laineuses", "Lames blanches qui virent au rose puis au noir liquide", "Anneau mobile sur le pied"],
      [S("Coprin noir d'encre", "Coprinopsis atramentaria", "danger", "Chapeau gris lisse en cloche. Toxique avec l'alcool jusqu'à 72 h après le repas.")],
      ["Uniquement très jeune, lames encore blanches, consommé le jour même.", "Faire vérifier avant consommation."]),

    C("piedbleu", "Pied bleu", "Lepista nuda", "caution", "Comestible cuit · faire vérifier", "Oct. → déc.", [10, 11, 12], PL,
      "Champignon violet d'arrière-saison dans les feuilles mortes et les haies.",
      ["Chapeau lilas à brun-violacé, lisse", "Lames lilas, serrées", "Pied violet, sans anneau ni voile", "Odeur fruitée"],
      [S("Cortinaires violets", "Cortinarius traganus", "danger", "Restes de voile filamenteux (cortine) sous le chapeau, lames qui deviennent rouille. Certains cortinaires détruisent les reins.")],
      ["Toujours bien cuit.", "Faire vérifier avant consommation."]),

    C("mousseron", "Mousseron de la Saint-Georges", "Calocybe gambosa", "caution", "Comestible · faire vérifier", "Avril → juin", [4, 5, 6], ["temperee", "montagne"],
      "Champignon blanc de printemps, souvent en ronds dans l'herbe, à forte odeur de farine.",
      ["Chapeau crème épais et charnu", "Lames blanches très serrées", "Forte odeur de farine fraîche", "Pousse au printemps, en cercles ou en lignes"],
      [S("Inocybe de Patouillard", "Inocybe erubescens", "danger", "Chapeau conique fibrilleux qui rougit, odeur fruitée. Toxique grave (muscarine)."),
       S("Entolome livide", "Entoloma sinuatum", "danger", "Lames jaunâtres puis rose saumon. Toxique grave.")], VERIF),

    C("fauxmousseron", "Faux mousseron (marasme)", "Marasmius oreades", "caution", "Comestible · faire vérifier", "Mai → nov.", [5, 6, 7, 8, 9, 10, 11], ["temperee", "montagne", "littoral"],
      "Petit champignon beige des pelouses, en « ronds de sorcière ».",
      ["Petit chapeau beige avec un mamelon", "Lames espacées, crème", "Pied fin, coriace : il se tord sans casser", "En cercles dans les pelouses"],
      [S("Clitocybes blancs", "Clitocybe rivulosa", "danger", "Mêmes pelouses, chapeau blanc poudré, lames serrées qui descendent sur le pied. Toxiques (muscarine).")], VERIF),

    C("armillaire", "Armillaire couleur de miel", "Armillaria mellea", "caution", "Experts · bien cuit", "Sept. → nov.", AUT2, PL,
      "Énormes touffes jaune miel sur souches et arbres. Mal toléré par beaucoup de gens, même cuit.",
      ["Touffes serrées sur bois ou au pied des arbres", "Chapeaux miel parsemés de petites mèches sombres", "Anneau cotonneux sur le pied"],
      [S("Galère marginée", "Galerina marginata", "danger", "Plus petite, en petites touffes, sans mèches sombres. Mortelle."),
       S("Hypholome en touffe", "Hypholoma fasciculare", "danger", "Jaune soufre, lames verdâtres, sans anneau, très amer. Toxique.")],
      ["Réservé aux connaisseurs : jamais cru, toujours bien cuit, en petite quantité.", "Faire vérifier avant consommation."]),

    C("collybie", "Collybie à pied velouté", "Flammulina velutipes", "caution", "Comestible · faire vérifier", "Nov. → mars", [11, 12, 1, 2, 3], PL,
      "Un des rares champignons de plein hiver, sur le bois mort, même après le gel.",
      ["Petits chapeaux orangés, gluants et brillants", "Pied VELOUTÉ brun-noir vers la base", "En touffes sur bois de feuillus, en hiver"],
      [S("Galère marginée", "Galerina marginata", "danger", "Petit anneau sur le pied, pied non velouté, chapeau mat. Mortelle : confusion classique en hiver.")], VERIF),

    C("oreillejudas", "Oreille de Judas", "Auricularia auricula-judae", "caution", "Comestible cuit · faire vérifier", "Toute l'année", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], PL,
      "Champignon gélatineux brun en forme d'oreille, surtout sur le sureau.",
      ["Texture gélatineuse et élastique", "Forme d'oreille brune, veloutée dessus", "Sur branches de sureau mortes ou vivantes"],
      [], ["Toujours cuit.", "Faire vérifier avant consommation."]),

    C("polypore", "Polypore soufré", "Laetiporus sulphureus", "caution", "Experts · bien cuit", "Mai → sept.", [5, 6, 7, 8, 9], PL,
      "Grandes consoles orange et jaune vif sur les troncs. Le « poulet des bois ».",
      ["Consoles superposées orange vif bordées de jaune", "Dessous jaune soufre percé de pores", "Chair tendre quand il est jeune"],
      [], ["Uniquement jeune et bien cuit, en petite quantité (intolérances fréquentes).", "Jamais s'il pousse sur un if, un robinier ou un conifère.", "Faire vérifier avant consommation."]),

    C("languedeboeuf", "Langue de bœuf", "Fistulina hepatica", "caution", "Comestible · faire vérifier", "Août → oct.", [8, 9, 10], ["temperee", "mediterranee"],
      "Étonnante console rouge sang sur les vieux chênes et châtaigniers.",
      ["Console rouge comme une langue ou un foie, humide", "Chair rouge marbrée, qui rend un jus rouge", "Dessous crème à petits tubes séparés"],
      [], VERIF),

    C("chanterelletube", "Chanterelle en tube", "Craterellus tubaeformis", "caution", "Comestible · faire vérifier", "Sept. → déc.", [9, 10, 11, 12], ["temperee", "montagne"],
      "Petite chanterelle brune à pied jaune, en troupes dans les mousses des forêts de conifères.",
      ["Chapeau brun en entonnoir, souvent percé au centre", "Dessous à plis gris-jaune (pas de vraies lames)", "Pied creux jaune"],
      [], VERIF),

    C("russulecharbon", "Russule charbonnière", "Russula cyanoxantha", "caution", "Comestible · faire vérifier", "Juil. → oct.", [7, 8, 9, 10], PL,
      "Une des russules les plus courantes sous les feuillus.",
      ["Chapeau violet à verdâtre, multicolore", "Lames blanches souples, grasses au toucher (elles ne cassent pas)", "Chair blanche cassante comme de la craie"],
      [S("Russules âcres et amanites", "Russula emetica", "danger", "Plusieurs russules sont toxiques, et une amanite phalloïde verte peut s'y mêler. Faire vérifier chaque exemplaire.")], VERIF),

    C("rougissante", "Amanite rougissante", "Amanita rubescens", "caution", "Experts uniquement", "Juin → oct.", [6, 7, 8, 9, 10], PL,
      "Comestible bien cuite, mais c'est une amanite : la confusion avec l'amanite panthère est trop facile.",
      ["Chapeau brun rosé à flocons gris-beige", "Chair qui ROUGIT lentement aux blessures et aux morsures de limaces", "Anneau strié"],
      [S("Amanite panthère", "Amanita pantherina", "danger", "Flocons blancs purs, chair qui ne rougit pas, anneau lisse. Toxique grave.")],
      ["Déconseillée à tous sauf aux mycologues confirmés.", "Toxique crue."]),

    // ===== Dangereux (liste du Centre Antipoisons) =====
    C("printaniere", "Amanite printanière", "Amanita verna", "danger", "Mortelle", "Avril → juin", [4, 5, 6], ["temperee", "mediterranee"],
      "Une amanite mortelle entièrement blanche… au printemps, quand on ne s'y attend pas.",
      ["Tout blanc, chapeau lisse", "Lames blanches, anneau, volve en sac à la base"],
      [S("Mousseron de la Saint-Georges", "Calocybe gambosa", "caution", "Pas d'anneau ni de volve, odeur de farine. Toujours dégager la base du pied.")], NE_RIEN),

    C("lepiote", "Lépiote brun-incarnat", "Lepiota brunneoincarnata", "danger", "Mortelle", "Juil. → oct.", [7, 8, 9, 10], PL,
      "Petite lépiote des parcs et lisières, avec les mêmes toxines que l'amanite phalloïde.",
      ["Petit chapeau de 2 à 5 cm, écailles brun-rose concentriques", "Lames blanches libres", "Pied ceinturé de zones rosées"],
      [S("Coulemelle", "Macrolepiota procera", "caution", "Chapeau de plus de 15 cm, anneau double coulissant. Règle : aucune lépiote de moins de 10 cm.")], NE_RIEN),

    C("gyromitre", "Gyromitre", "Gyromitra esculenta", "danger", "Mortel", "Mars → mai", [3, 4, 5], ["temperee", "montagne"],
      "Le « faux morillon » des bois de conifères. Ses toxines s'évaporent aussi à la cuisson.",
      ["Chapeau brun-rouge plissé en cervelle", "Intérieur cloisonné, pas creux"],
      [S("Morille", "Morchella esculenta", "caution", "Chapeau en alvéoles régulières, entièrement creuse quand on la coupe.")], NE_RIEN),

    C("omphalote", "Omphalote de l'olivier", "Omphalotus olearius", "danger", "Toxique grave", "Juil. → nov.", [7, 8, 9, 10, 11], ["temperee", "mediterranee"],
      "Grosses touffes orange vif au pied des chênes et des oliviers, confondues avec la girolle.",
      ["Touffes orange vif sur bois ou souches enterrées", "Vraies lames serrées qui descendent sur le pied"],
      [S("Girolle", "Cantharellus cibarius", "caution", "Plis épais et fourchus (pas de lames), pousse isolée au sol, jamais en grosse touffe sur bois.")], NE_RIEN),

    C("paxille", "Paxille enroulé", "Paxillus involutus", "danger", "Mortel (consommation répétée)", "Juil. → nov.", [7, 8, 9, 10, 11], PL,
      "Longtemps mangé, il peut provoquer une réaction immunitaire mortelle après plusieurs repas.",
      ["Chapeau brun à bord ENROULÉ vers l'intérieur", "Lames jaunâtres qui brunissent au toucher et se détachent facilement", "Très commun sous les bouleaux"],
      [], NE_RIEN),

    C("equestre", "Tricholome équestre", "Tricholoma equestre", "danger", "Toxique grave", "Sept. → nov.", AUT2, ["temperee", "montagne", "mediterranee", "littoral"],
      "Le « bidaou » ou « chevalier », jadis apprécié : des repas répétés détruisent les muscles.",
      ["Chapeau jaune verdâtre, centre plus brun", "Lames jaune soufre", "Sous les pins, sur sol sableux"],
      [], NE_RIEN),

    C("tigre", "Tricholome tigré", "Tricholoma pardinum", "danger", "Toxique grave", "Août → oct.", [8, 9, 10], ["montagne", "temperee"],
      "Gros champignon gris, cause d'intoxications digestives sévères.",
      ["Chapeau gris couvert d'écailles sombres en motif tigré", "Lames blanc-crème, odeur de farine"],
      [], NE_RIEN),

    C("clitoblanc", "Clitocybe blanchi", "Clitocybe rivulosa", "danger", "Toxique (muscarine)", "Juil. → nov.", [7, 8, 9, 10, 11], ["temperee", "montagne", "littoral"],
      "Petit champignon blanc des pelouses, au milieu des faux mousserons.",
      ["Chapeau blanc à crème, comme poudré de givre", "Lames serrées qui descendent sur le pied"],
      [], ["Ne rien consommer. Symptômes : sueurs, larmes, salivation dans l'heure : appeler le centre antipoison."]),

    C("noirdencre", "Coprin noir d'encre", "Coprinopsis atramentaria", "danger", "Toxique avec l'alcool", "Avril → nov.", [4, 5, 6, 7, 8, 9, 10, 11], ["temperee", "montagne"],
      "Mangé avec de l'alcool (ou jusqu'à 72 h avant ou après), il provoque bouffées de chaleur, palpitations et malaise.",
      ["Chapeau gris en cloche, plissé, en touffes", "Lames qui se liquéfient en encre noire"],
      [], NE_RIEN),

    C("emetique", "Russule émétique", "Russula emetica", "danger", "Toxique", "Juil. → nov.", [7, 8, 9, 10, 11], ["temperee", "montagne"],
      "Russule rouge vif des forêts humides, très âcre, provoque vomissements et diarrhées.",
      ["Chapeau rouge vif, lisse et brillant", "Lames et pied blanc pur", "Chair cassante très piquante"],
      [], NE_RIEN),

    C("satan", "Bolet Satan", "Rubroboletus satanas", "danger", "Toxique", "Juil. → sept.", [7, 8, 9], ["temperee", "mediterranee"],
      "Gros bolet trapu des sols calcaires, à pores rouges et chapeau blanchâtre.",
      ["Chapeau blanc grisâtre", "Pores rouge sang", "Pied ventru rouge avec un réseau", "Chair qui bleuit, odeur désagréable quand il vieillit"],
      [], ["Règle simple : écarter tous les bolets à pores rouges."]),

    C("psilocybe", "Psilocybe lancéolé", "Psilocybe semilanceata", "danger", "Hallucinogène · illégal", "Sept. → nov.", AUT2, ["temperee", "montagne"],
      "Petit champignon des prairies, hallucinogène. Sa détention est illégale et les intoxications envoient régulièrement aux urgences.",
      ["Petit chapeau conique pointu, beige à brun", "Pied très fin et ondulé", "Dans les prairies pâturées humides"],
      [], NE_RIEN)
  ];
  liste.forEach(function (s) { window.SYLVA_ESPECES.push(s); });
})();
