/* Sylva – astuces de terrain (v0.9.22) : montages de bâche, sac à dos, filtre à mèche, nasse et ligne à ressort,
   écharpe, empreintes d'Europe, heure avant le coucher du soleil. Rédigé pour Sylva (savoir usuel), sans reprise d'images ni de textes tiers. */
(function () {
  "use strict";
  var T = window.SYLVA_TECHNIQUES || [];
  var C = window.SYLVA_CATEGORIES || [];
  if (C.indexOf("Faune et traces") === -1) C.splice(C.indexOf("Éthique"), 0, "Faune et traces");
  var SRC = "Savoir-faire usuel du bivouac et de la survie, rédigé pour Sylva";
  var LOI_PECHE = "Méthode interdite aux pêcheurs amateurs en Wallonie, en France et dans la plupart des pays d'Europe. À réserver à une vraie situation de détresse.";

  var F = [
    { id: "bache_montages", cat: "Abri", titre: "Dix façons de monter une bâche", illus: "abri_bache",
      intro: "Avec une bâche carrée de 3 × 3 m, une ligne faîtière et quelques sardines, on peut monter une dizaine d'abris différents. Le bon dépend du vent, de la pluie et du nombre de personnes.",
      etapes: [
        "Abri en A : la bâche à cheval sur une corde basse, les deux bords plantés au sol. Le classique contre la pluie (fiche dédiée).",
        "A fermé avec plancher : la même chose, avec les bords repliés sous soi pour faire un sol. Quand le sol est mouillé (fiche dédiée).",
        "Appentis : un bord sur la corde, l'autre planté au sol côté vent. Vue dégagée, idéal par temps calme (fiche dédiée).",
        "Enveloppe : un appentis dont le bas de la bâche est replié vers l'intérieur pour former un sol. Ouvert d'un seul côté.",
        "Coin coupe-vent : un appentis très incliné, dont un côté est rabattu jusqu'au sol face au vent. Fermé au vent sur deux faces.",
        "Soc de charrue : un seul coin attaché haut à un arbre, les trois autres au sol. Très bon au vent pour une personne (fiche dédiée).",
        "Pointe de flèche : un coin attaché haut, la bâche tendue en A le long d'une corde qui descend jusqu'au sol derrière. Haut à l'entrée, bas aux pieds, très stable.",
        "Tente de forêt : un coin relevé par un bâton à l'avant, les deux coins de côté plantés au sol et le dernier tiré derrière. Une petite tente pyramidale fermée.",
        "Toit plat : les quatre coins attachés en hauteur à des arbres ou des bâtons, un coin plus bas pour que l'eau s'écoule. Pour cuisiner ou se reposer à l'abri de la pluie.",
        "Bâtons de marche : deux bâtons réglés à 1,1 m tiennent l'avant de la corde, l'arrière est planté au sol. Pour camper là où il n'y a pas d'arbres."
      ],
      attention: ["Toujours une pente sur le toit : une bâche tendue à plat fait une poche d'eau qui finit par passer à travers.", "Entraîne-toi chez toi : on ne découvre pas un montage sous la pluie et dans le noir."] },
    { id: "sac_charger", cat: "Équipement", titre: "Charger son sac à dos", illus: "kit",
      intro: "Un sac bien chargé pèse le même poids, mais paraît bien plus léger : le centre de gravité reste près du dos et le sac ne tire plus en arrière.",
      etapes: [
        "Tout au fond : le sac de couchage, dans un sac étanche. On n'en a besoin qu'au camp, et il fait un coussin pour le reste.",
        "Au centre, collé au dos, entre les omoplates : le plus lourd (eau, nourriture, réchaud, popote).",
        "Autour du lourd : les affaires de poids moyen (vêtements de rechange, tente ou bâche), pour caler le tout.",
        "En haut et vers l'extérieur : le léger et ce qui sert dans la journée (veste de pluie, polaire, trousse de secours).",
        "Dans le rabat et les poches de ceinture : carte, boussole, lampe frontale, couteau, en-cas, téléphone, sifflet. Tout ce qui doit sortir sans ouvrir le sac.",
        "Équilibre la gauche et la droite, puis serre les sangles de compression pour que rien ne bouge.",
        "Réglage : le poids repose sur les hanches. La ceinture se serre sur les os du bassin, puis les bretelles, puis les rappels de charge."
      ],
      attention: ["Doublure étanche obligatoire : un grand sac poubelle à l'intérieur du sac garde tout au sec, même sous un orage."] },
    { id: "filtre_meche", cat: "Eau", titre: "Filtre à mèche (eau qui monte dans un tissu)", illus: "eau_filtre",
      intro: "Une bande de tissu trempée dans une eau trouble, l'autre bout pendant dans un récipient plus bas : l'eau remonte dans les fibres et goutte, beaucoup plus claire. Spectaculaire, mais attention à ce que ça fait vraiment.",
      etapes: [
        "Pose le récipient d'eau sale plus haut que le récipient propre (sur une pierre).",
        "Prends une bande de tissu propre en coton, ou une chaussette, bien mouillée.",
        "Plonge un bout au fond de l'eau sale, fais passer le tissu par-dessus le bord et laisse pendre l'autre bout dans le récipient propre, plus bas que l'eau sale.",
        "Attends : l'eau migre lentement dans les fibres et s'égoutte. Compte plusieurs heures pour un demi-litre.",
        "Fais ensuite bouillir l'eau obtenue au moins 1 minute (fiche « Rendre l'eau potable »)."
      ],
      attention: ["Ce filtre enlève la boue et les particules, mais PAS les bactéries, virus et parasites : une eau claire peut rendre très malade. Il faut toujours la faire bouillir après.", "Très lent : utile pour clarifier une eau boueuse avant de la faire bouillir, pas pour boire vite."] },
    { id: "nasse_bouteille", cat: "Pêche", titre: "Nasse en bouteille", illus: "cordelette",
      intro: "Une bouteille en plastique coupée et retournée devient un piège à petits poissons et écrevisses : ils entrent par le goulot et ne trouvent plus la sortie.",
      etapes: [
        "Coupe une grande bouteille au tiers, juste sous l'épaule.",
        "Retire le bouchon, retourne la partie haute et emboîte-la dans le corps, goulot vers l'intérieur.",
        "Fixe les deux parties avec de la ficelle passée dans de petits trous, ou des épines.",
        "Perce quelques petits trous pour que l'eau passe et que la bouteille coule.",
        "Mets un appât à l'intérieur (vers, miettes, restes de poisson) et une petite pierre pour la lester.",
        "Pose-la au fond, goulot face au courant, attachée par une ficelle à la berge. Relève-la toutes les heures ou deux."
      ],
      attention: [LOI_PECHE, "Relâche aussitôt les espèces protégées. Les écrevisses américaines ne se transportent jamais vivantes."] },
    { id: "ligne_ressort", cat: "Pêche", titre: "Ligne à ressort (auto-ferrage)", illus: "cordelette",
      intro: "Une branche souple pliée sert de ressort : quand un poisson tire sur l'appât, il libère un petit déclencheur et la branche se redresse en le ferrant.",
      etapes: [
        "Choisis une branche morte souple ou un jeune rejet déjà plié au bord de l'eau. Ne coupe rien de vivant si tu peux l'éviter.",
        "Taille deux piquets avec une encoche chacun : l'un est planté dans la berge, l'autre (le déclencheur) s'accroche dessous, encoche contre encoche.",
        "Attache la ligne au bout de la branche, plie la branche vers le bas et accroche-la au déclencheur.",
        "Fixe la ligne avec l'hameçon et l'appât au déclencheur : quand le poisson tire, les encoches se libèrent et la branche se relève.",
        "Règle la profondeur de l'appât, puis éloigne-toi et surveille de loin."
      ],
      attention: [LOI_PECHE, "Une branche qui se détend peut fouetter le visage : ne te penche jamais au-dessus pendant le réglage.", "Ne laisse jamais une ligne armée sans surveillance, et démonte-la en partant."] },
    { id: "ps_echarpe", cat: "Premiers secours", titre: "Faire une écharpe de bras", illus: "attelle",
      intro: "Pour une blessure à la main, au poignet, au bras ou à l'épaule : l'écharpe soutient le bras, calme la douleur et permet souvent de continuer à marcher.",
      etapes: [
        "Prends un tissu carré d'au moins 1 m de côté (foulard, t-shirt découpé, bâche fine) et plie-le en triangle.",
        "Glisse le triangle entre le torse et le bras blessé, la pointe vers le coude du côté blessé et un bout passant par-dessus l'épaule valide.",
        "Plie doucement le bras blessé à angle droit sur la poitrine, le poignet un peu plus haut que le coude.",
        "Remonte l'autre bout du triangle par-dessus l'avant-bras jusqu'à l'épaule du côté blessé.",
        "Noue les deux bouts sur le côté du cou, pas sur la nuque, avec un peu de rembourrage sous le nœud.",
        "Ferme la pointe au coude avec une épingle ou un nœud, pour que le bras ne glisse pas.",
        "Pour immobiliser davantage, ajoute une bande large autour du torse, par-dessus le bras."
      ],
      isole: [
        "Sans tissu : relève le bas de ta veste par-dessus l'avant-bras et attache-le avec une épingle, ou passe la main dans la veste fermée.",
        "Une sangle de sac ou une ceinture passée autour du cou et du poignet fait une écharpe simple.",
        "Vérifie toutes les heures que les doigts restent chauds, roses et sensibles, et desserre si ça gonfle.",
        "Avec une écharpe bien faite, on peut souvent continuer à marcher lentement : allège le sac et fais-le porter de l'autre côté."
      ],
      alerte: ["Doigts froids, pâles, bleutés ou insensibles", "Déformation importante ou os visible", "Douleur qui augmente fortement malgré l'immobilisation"] },
    { id: "empreintes", cat: "Faune et traces", titre: "Reconnaître les empreintes d'Europe", illus: "piege_4",
      intro: "Dans la boue d'un chemin ou au bord d'un ruisseau, les empreintes racontent qui passe la nuit près de ton camp. Voici celles de nos forêts, pas celles des forêts américaines.",
      etapes: [
        "Sanglier : deux grands doigts en sabot, et deux petites marques (les gardes) bien visibles derrière. Souvent avec la terre retournée tout autour.",
        "Chevreuil : deux doigts fins et pointus en forme de cœur, 4 à 5 cm. Les gardes ne marquent presque jamais.",
        "Cerf : comme le chevreuil mais plus grand et plus arrondi, 7 à 9 cm.",
        "Renard : quatre doigts et une pelote, en ovale étroit, avec les griffes. Les doigts de devant sont détachés : on peut tracer une croix entre les pelotes. La piste file en ligne droite.",
        "Chien : comme le renard mais plus rond, doigts plus écartés. La piste zigzague.",
        "Loup : comme un grand chien (plus de 10 cm), plus allongé, en ligne droite sur de longues distances.",
        "Blaireau : cinq doigts alignés devant une large pelote, avec de longues griffes. Comme une petite patte d'ours.",
        "Martre et fouine : cinq petits doigts autour d'une pelote, empreintes souvent groupées par deux (déplacement par bonds).",
        "Lièvre : les deux grandes pattes arrière se posent devant les deux petites pattes avant : la piste forme un Y.",
        "Castor et loutre, au bord de l'eau : cinq doigts palmés. Grande patte arrière de 15 cm pour le castor, empreinte ronde de 6 cm pour la loutre."
      ],
      attention: ["Loup : il évite l'humain. Range bien ta nourriture, et signale une observation au Réseau Loup en Wallonie.", "Sanglier : ne te place jamais entre une laie et ses marcassins."] },
    { id: "doigts_soleil", cat: "Orientation", titre: "Estimer le temps avant le coucher du soleil", illus: "orient_baton",
      intro: "Sans montre, tes doigts suffisent pour savoir combien de temps il reste avant la nuit, et donc s'il faut monter le camp maintenant.",
      etapes: [
        "Tends le bras devant toi, la main à plat et horizontale, les doigts serrés, le petit doigt posé sur la ligne de l'horizon.",
        "Compte combien de doigts tiennent entre l'horizon et le bas du soleil. Empile l'autre main au-dessus si besoin.",
        "Compte environ 15 minutes par doigt, soit à peu près une heure par main.",
        "En Belgique et plus au nord, le soleil descend en biais : compte plutôt 10 à 15 minutes par doigt, surtout en automne et en hiver.",
        "Garde de la marge : il fait sombre en forêt bien avant le coucher officiel. Monte ton abri avec au moins une heure de jour."
      ],
      attention: ["Ne regarde jamais le soleil en face : vise juste en dessous, ou à travers les arbres."] }
  ];
  F.forEach(function (f) { if (!T.some(function (t) { return t.id === f.id; })) { f.source = f.source || SRC; T.push(f); } });

  // Hameçon en languette de canette dans la pêche de survie
  var ps = T.filter(function (t) { return t.id === "peche_survie"; })[0];
  if (ps && !ps.etapes.some(function (e) { return e.indexOf("canette") !== -1; })) {
    ps.etapes.splice(1, 0, "Hameçon en canette : coupe la languette d'ouverture d'une canette d'un côté de l'anneau, plie la partie coupée en crochet et aiguise la pointe sur une pierre. L'autre anneau sert à attacher la ligne.");
  }

  // Liens dans les chapitres
  var G = window.SYLVA_GUIDE || [];
  function add(chapId, ids) {
    var c = G.filter(function (x) { return x.id === chapId; })[0]; if (!c) return;
    c.fiches = c.fiches || [];
    ids.forEach(function (id) { if (c.fiches.indexOf(id) === -1) c.fiches.push(id); });
  }
  add("abris", ["bache_montages"]);
  add("preparer", ["sac_charger"]);
  add("eau_guide", ["filtre_meche"]);
  add("poissons", ["nasse_bouteille", "ligne_ressort"]);
  add("secourisme", ["ps_echarpe"]);
  add("orientation_guide", ["doigts_soleil"]);
  add("campement", ["empreintes"]);
})();
