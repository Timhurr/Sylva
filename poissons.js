/* Sylva – poissons et vie aquatique (v0.9.21).
   Rédigé pour Sylva à partir des règles publiques de la pêche en Wallonie (SPW, Maison wallonne de la Pêche),
   des avis de l'INBO sur les polluants dans les poissons d'eau douce, et de connaissances naturalistes usuelles.
   Les règles (périodes, tailles, quotas) changent : toujours vérifier le règlement en vigueur. */
(function () {
  "use strict";
  var E_ = window.SYLVA_ESPECES || [];
  var T = window.SYLVA_TECHNIQUES || [];
  var EAU = ["temperee", "montagne"];
  var TOUTE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  var MER = ["littoral"];
  var MED = ["mediterranee", "littoral"];
  var BE_LOI = "En Wallonie, un permis de pêche est obligatoire dans les rivières, canaux et lacs publics. Périodes d'ouverture, tailles minimales et quotas dépendent de l'espèce : vérifie le règlement de la Maison wallonne de la Pêche.";

  function P(id, nom, latin, niveau, statut, saison, zones, resume, identification, sosies, usages, extra) {
    var o = { cat: "poisson", id: id, nom: nom, latin: latin, niveau: niveau, statut: statut, saison: saison, mois: TOUTE, zones: zones,
      resume: resume, identification: identification, sosies: sosies || [], usages: usages || [], notes: { BE: BE_LOI } };
    if (extra) for (var k in extra) o[k] = extra[k];
    return o;
  }
  var S = function (nom, latin, niveau, diff) { return { nom: nom, latin: latin, niveau: niveau, diff: diff }; };

  var L = [
    // ---------- Bons à manger, avec les règles ----------
    P("truite", "Truite fario", "Salmo trutta", "ok", "Comestible cuite · réglementée", "Ouverture début mars (Wallonie)", EAU,
      "La truite sauvage des ruisseaux et rivières fraîches comme l'Ourthe. Excellente cuite, mais très encadrée par les règles de pêche.",
      ["Corps fuselé, dos brun-vert", "Points noirs et points rouges cerclés de clair sur les flancs", "Petite nageoire adipeuse (sans rayons) entre la dorsale et la queue", "Vit dans l'eau claire, fraîche et bien oxygénée"],
      [S("Saumon atlantique (jeune, tacon)", "Salmo salar", "danger", "Queue plus échancrée, taches sombres en rang sur les flancs (marques de tacon), pas de points rouges cerclés. Protégé : à relâcher."),
       S("Truite arc-en-ciel", "Oncorhynchus mykiss", "ok", "Bande rose violacé le long du flanc, petits points noirs jusque sur la queue. Poisson d'élevage relâché, comestible.")],
      ["Hameçon sans ardillon exigé dans de nombreux secteurs de Wallonie : vérifie avant de pêcher.", "Cuire à cœur : la chair devient opaque et se détache.", "Une truite se garde quelques heures au frais : vidée, à l'ombre, enveloppée dans de l'herbe humide."]),
    P("perche", "Perche", "Perca fluviatilis", "ok", "Comestible cuite · épines", "Toute l'année (selon règlement)", EAU,
      "Un des meilleurs poissons d'eau douce, fréquent dans les eaux calmes et les rivières lentes. Attention aux épines de la nageoire du dos.",
      ["Rayures verticales sombres sur un corps verdâtre", "Grande nageoire du dos épineuse avec une tache noire à l'arrière", "Nageoires du ventre orange-rouge"],
      [S("Grémille", "Gymnocephalus cernua", "ok", "Plus petite, sans rayures nettes, couverte de petits points. Comestible aussi.")],
      ["Saisir la perche en rabattant la nageoire du dos vers l'arrière avec la main, pour ne pas se piquer.", "Peut porter un ver parasite (bothriocéphale) : jamais crue, toujours bien cuite.", "Facile à écailler juste après la capture."]),
    P("brochet", "Brochet", "Esox lucius", "caution", "Comestible cuit · dents et arêtes", "Selon règlement (fermé au printemps)", EAU,
      "Le grand carnassier des eaux calmes. Sa chair est bonne, mais il a des dents acérées et beaucoup d'arêtes en Y.",
      ["Corps très allongé, tête en bec de canard", "Flancs verts marbrés de taches claires", "Nageoires du dos et de l'anus repoussées tout à l'arrière", "Gueule pleine de dents pointues"],
      [S("Sandre", "Sander lucioperca", "ok", "Deux nageoires sur le dos dont une épineuse, gros yeux vitreux, flancs gris rayés.")],
      ["Ne jamais mettre les doigts dans la gueule : utiliser une pince ou un bâton pour décrocher.", "Peut porter le ver solitaire du poisson (bothriocéphale) : toujours bien cuit, jamais en tartare ou mariné cru.", "Les gros sujets accumulent davantage de polluants : préférer les poissons de taille moyenne.", "En Wallonie, le prélèvement du brochet est restreint dans certaines zones : vérifie le règlement."]),
    P("sandre", "Sandre", "Sander lucioperca", "ok", "Comestible cuit · épines", "Selon règlement (fermé au printemps)", ["temperee"],
      "Carnassier des rivières lentes, des canaux et des lacs troubles. Chair blanche et ferme très appréciée.",
      ["Corps allongé gris-vert avec des bandes sombres floues", "Deux nageoires dorsales, la première épineuse", "Gros yeux vitreux et quelques grandes dents (crocs)"],
      [S("Perche", "Perca fluviatilis", "ok", "Plus trapue, rayures nettes, nageoires du ventre orange.")],
      ["Attention aux épines dorsales et aux crocs.", "Bien cuire, comme tous les poissons d'eau douce."]),
    P("gardon", "Gardon", "Rutilus rutilus", "ok", "Comestible cuit · arêtes", "Toute l'année (selon règlement)", EAU,
      "Le « poisson blanc » le plus commun. Facile à prendre, comestible, mais rempli de petites arêtes.",
      ["Petit poisson argenté au dos bleu-vert", "Œil à iris rouge", "Nageoires ventrales et anale rougeâtres"],
      [S("Rotengle", "Scardinius erythrophthalmus", "ok", "Nageoires d'un rouge plus vif, bouche tournée vers le haut. Comestible aussi.")],
      ["Les petites arêtes se ramollissent en friture très chaude ou en cuisson longue.", "Comme tous les poissons blancs : jamais cru, certains portent des parasites du foie."]),
    P("chevesne", "Chevesne", "Squalius cephalus", "ok", "Comestible cuit · arêtes", "Toute l'année (selon règlement)", EAU,
      "Gros poisson blanc trapu, très fréquent dans l'Ourthe et les rivières ardennaises. Peu prisé à cause de ses arêtes.",
      ["Corps épais, grosse tête large", "Grandes écailles bordées de noir, en filet", "Nageoire anale bombée, rouge-orangé"],
      [S("Vandoise", "Leuciscus leuciscus", "ok", "Plus fine, tête petite, nageoire anale concave (creusée).")],
      ["Lever les filets et les inciser finement tous les 3 mm avant de cuire : les arêtes deviennent imperceptibles.", "Bien cuire."]),
    P("carpe", "Carpe", "Cyprinus carpio", "caution", "Comestible · polluants si grosse", "Toute l'année (selon règlement)", ["temperee"],
      "Gros poisson des eaux calmes et vaseuses. Les vieux spécimens fouillent la vase et y concentrent les polluants.",
      ["Grand corps doré à bronze", "Quatre barbillons autour de la bouche", "Grandes écailles (ou peu d'écailles chez la carpe miroir)"],
      [S("Carassin", "Carassius carassius", "ok", "Plus petit, sans barbillons.")],
      ["Préférer les petites carpes : les grosses (plus de 5 kg) accumulent davantage de polluants.", "Enlever la peau, la graisse du ventre et la ligne brune le long du flanc, où se concentrent le goût de vase et les polluants.", "La pêche de nuit de la carpe demande un permis spécifique en Wallonie."]),
    P("barbeau", "Barbeau", "Barbus barbus", "caution", "Chair comestible · œufs toxiques", "Selon règlement", ["temperee"],
      "Poisson de fond des rivières à courant, comme l'Ourthe. Sa chair se mange, mais ses œufs sont toxiques.",
      ["Corps allongé, ventre plat", "Bouche sous la tête avec quatre barbillons", "Dos brun-vert, nageoires rougeâtres"],
      [S("Goujon", "Gobio gobio", "ok", "Tout petit (moins de 15 cm), deux barbillons seulement, taches sombres sur les flancs.")],
      ["Ne JAMAIS manger les œufs (rogue) du barbeau, surtout au printemps : ils provoquent vomissements et diarrhée.", "Bien vider et retirer toute la poche à œufs.", "Beaucoup d'arêtes : plutôt en filets incisés ou en soupe."]),
    P("silure", "Silure glane", "Silurus glanis", "caution", "Comestible · gros sujets pollués", "Selon règlement", ["temperee"],
      "Le géant de nos rivières, de plus en plus fréquent dans la Meuse et ses affluents. Jeune, il est bon ; vieux, il concentre les polluants.",
      ["Très long corps sans écailles, visqueux", "Large gueule avec six barbillons, dont deux très longs", "Minuscule nageoire sur le dos, très longue nageoire anale"],
      [S("Poisson-chat", "Ameiurus melas", "caution", "Beaucoup plus petit (moins de 35 cm), huit barbillons, épines dures aux nageoires.")],
      ["Préférer les sujets de moins de 1 m.", "Retirer la peau et la graisse.", "Attention : un gros silure est très puissant, ne jamais s'enrouler la ligne autour de la main."]),
    P("poissonchat", "Poisson-chat", "Ameiurus melas", "caution", "Comestible · épines piquantes", "Toute l'année (espèce invasive)", ["temperee"],
      "Petit poisson nord-américain introduit, envahissant dans les eaux calmes. Comestible, mais ses épines piquent fort.",
      ["Corps sans écailles, brun-noir, tête large", "Huit barbillons", "Une épine dure à l'avant de la nageoire du dos et de chaque nageoire de poitrine"],
      [S("Silure glane (jeune)", "Silurus glanis", "caution", "Six barbillons, pas d'épine sur le dos, nageoire anale très longue.")],
      ["Le saisir derrière les épines de poitrine, ou avec un chiffon épais.", "Une piqûre est très douloureuse et s'infecte facilement : voir la fiche « Blessures d'épines et de dents ».", "Espèce invasive : ne jamais le relâcher vivant ailleurs ni le transporter vivant."]),

    // ---------- Protégés ou à relâcher ----------
    P("anguille", "Anguille européenne", "Anguilla anguilla", "danger", "À relâcher · très polluée", "Remise à l'eau obligatoire (Wallonie)", ["temperee", "littoral"],
      "Espèce en danger critique d'extinction. En Wallonie, toute anguille pêchée doit être remise à l'eau. Elle est aussi l'un des poissons les plus chargés en polluants (PCB, dioxines).",
      ["Corps de serpent, sans nageoires ventrales", "Nageoires dorsale, caudale et anale soudées en une seule bordure", "Peau gluante, petite tête avec de petits yeux"],
      [S("Lamproie de Planer", "Lampetra planeri", "danger", "Pas de mâchoire mais une bouche en ventouse, sept trous ronds derrière l'œil. Protégée.")],
      ["La décrocher dans l'eau et la relâcher immédiatement.", "Son sang cru est irritant pour les yeux et les plaies : se rincer les mains après l'avoir touchée.", "Même ailleurs, ne pas la manger : les anguilles de nos rivières dépassent souvent les normes de polluants."]),
    P("saumon", "Saumon atlantique", "Salmo salar", "danger", "Protégé · à relâcher", "Interdit de capture (Belgique)", ["temperee", "littoral"],
      "Disparu de la Meuse au XXe siècle, il est en cours de réintroduction. Chaque individu compte : il doit être relâché sans délai.",
      ["Jeune (tacon) : taches sombres en rang sur les flancs, queue nettement fourchue", "Adulte : corps argenté, petites taches noires en croix au-dessus de la ligne latérale", "Petite nageoire adipeuse sur le dos"],
      [S("Truite fario", "Salmo trutta", "ok", "Points rouges cerclés de clair, queue moins échancrée.")],
      ["Relâcher en le tenant dans l'eau, face au courant, jusqu'à ce qu'il reparte seul.", "Signaler une capture à la Maison wallonne de la Pêche aide le suivi de la réintroduction."]),
    P("ombre", "Ombre commun", "Thymallus thymallus", "danger", "Très protégé · à relâcher", "Pêche très restreinte", EAU,
      "Le « poisson à la grande voile », indicateur d'une eau très pure. Ses populations sont fragiles : relâche-le.",
      ["Très grande nageoire dorsale colorée, en forme de voile", "Corps gris argenté avec quelques points noirs à l'avant", "Petite nageoire adipeuse"],
      [S("Truite fario", "Salmo trutta", "ok", "Nageoire dorsale petite, points rouges.")],
      ["Les règles de l'ombre sont très strictes et changent d'un secteur à l'autre : en cas de doute, relâcher."]),
    P("chabot", "Chabot", "Cottus gobio", "danger", "Protégé · à relâcher", "Protégé toute l'année", EAU,
      "Petit poisson de fond à grosse tête, caché sous les pierres des ruisseaux propres. Protégé en Europe.",
      ["Moins de 15 cm, très grosse tête aplatie", "Grandes nageoires de poitrine en éventail", "Corps brun marbré, sans écailles, vit sous les galets"],
      [S("Loche franche", "Barbatula barbatula", "info", "Corps allongé et fin, six barbillons, tête petite.")],
      ["Ne pas retourner les pierres des ruisseaux pour le chercher : c'est son abri et celui de nombreuses larves."]),
    P("ecrevisse_rouge", "Écrevisse à pattes rouges", "Astacus astacus", "danger", "Protégée · à relâcher", "Protégée toute l'année", ["temperee"],
      "L'écrevisse indigène, devenue très rare à cause des maladies apportées par les écrevisses américaines. Strictement protégée.",
      ["Grande écrevisse brun foncé", "Dessous des pinces rouge vif", "Pinces larges et granuleuses"],
      [S("Écrevisse signal", "Pacifastacus leniusculus", "ok", "Tache blanche ou turquoise à l'articulation des pinces, pinces lisses. Invasive.")],
      ["La relâcher sur place immédiatement.", "Après avoir touché des écrevisses américaines, sécher bottes et matériel avant d'aller dans un autre cours d'eau : tu pourrais transporter la peste de l'écrevisse."]),

    // ---------- Invasives comestibles ----------
    P("ecrevisse_signal", "Écrevisse signal", "Pacifastacus leniusculus", "ok", "Comestible cuite · invasive", "Toute l'année (règles locales)", ["temperee"],
      "Écrevisse américaine introduite, envahissante, porteuse d'une maladie mortelle pour l'écrevisse indigène. Comestible et excellente cuite.",
      ["Grande écrevisse brun-bleuté", "Tache blanche ou turquoise sur l'articulation des pinces", "Dessous des pinces rouge"],
      [S("Écrevisse à pattes rouges", "Astacus astacus", "danger", "Pas de tache claire aux pinces, pinces granuleuses. Protégée : à relâcher."),
       S("Écrevisse américaine", "Faxonius limosus", "ok", "Plus petite, taches rousses sur les côtés de l'abdomen, pinces à bouts orange.")],
      ["Toujours bien cuite (5 à 10 minutes dans l'eau bouillante) : elle peut porter des parasites.", "Retirer le boyau noir de la queue avant de manger.", "Interdit de la transporter vivante : espèce invasive au niveau européen.", "La capture d'écrevisses est réglementée : vérifie les règles locales."]),

    // ---------- Venimeux (mer) ----------
    P("vive", "Petite vive", "Echiichthys vipera", "danger", "Venimeuse · piqûre très douloureuse", "Surtout en été, sur les plages", MER,
      "Petit poisson caché dans le sable des plages de la mer du Nord et de l'Atlantique. Ses épines venimeuses piquent les pieds nus.",
      ["Petit poisson (10 à 15 cm) jaunâtre, enfoui dans le sable", "Yeux et bouche tournés vers le haut", "Nageoire du dos noire, avec des épines venimeuses, et une épine sur chaque opercule"],
      [S("Grande vive", "Trachinus draco", "danger", "Plus grande (jusqu'à 40 cm), rayures obliques sombres. Venimeuse aussi.")],
      ["Porter des sandales d'eau sur les plages sableuses à marée basse.", "Piqûre : voir la fiche « Piqûre de vive ou de rascasse » (eau très chaude).", "Si tu en pêches une : ne la touche pas à mains nues, coupe la ligne."]),
    P("grandevive", "Grande vive", "Trachinus draco", "danger", "Venimeuse", "Toute l'année", ["littoral", "mediterranee"],
      "Cousine plus grande de la petite vive, prise parfois à la ligne depuis les plages ou en bateau. Ses épines restent venimeuses même après la mort du poisson.",
      ["Jusqu'à 40 cm, corps allongé jaune-brun", "Fines rayures obliques sombres sur les flancs", "Première nageoire dorsale courte, noire, épineuse"],
      [S("Petite vive", "Echiichthys vipera", "danger", "Plus petite et trapue, vit enfouie près du bord.")],
      ["Les épines restent dangereuses sur un poisson mort ou sur l'étal : manipuler avec un chiffon épais.", "Comestible une fois les épines retirées par quelqu'un d'expérimenté."]),
    P("rascasse", "Rascasse", "Scorpaena porcus", "danger", "Épines venimeuses", "Toute l'année", ["mediterranee"],
      "Poisson de roche de Méditerranée, maître du camouflage. Très bon à manger (bouillabaisse), mais ses épines sont venimeuses.",
      ["Corps trapu, rouge-brun marbré, couvert d'excroissances de peau", "Grosse tête épineuse, gros yeux", "Nageoire du dos hérissée d'épines"],
      [S("Grande vive", "Trachinus draco", "danger", "Corps allongé et lisse, vit sur le sable.")],
      ["Ne jamais saisir à mains nues : gants épais ou chiffon.", "Piqûre : eau très chaude, comme pour la vive."]),

    // ---------- Poissons-appâts / à connaître ----------
    P("vairon", "Vairon", "Phoxinus phoxinus", "info", "Petit poisson à respecter", "Toute l'année", EAU,
      "Minuscule poisson des ruisseaux clairs, en bancs. Indicateur d'une bonne qualité d'eau, nourriture des truites.",
      ["Moins de 10 cm, en bancs serrés", "Flancs marbrés de taches sombres, ventre parfois rouge au printemps", "Très petites écailles"],
      [S("Gardon (jeune)", "Rutilus rutilus", "ok", "Argenté, œil rouge, grandes écailles.")],
      ["Ne pas l'utiliser comme vif si l'espèce n'est pas sur la liste des vifs autorisés : vérifie le règlement.", "Trop petit pour valoir la peine d'être mangé, sauf en vraie détresse, frit entier et bien cuit."])
  ];
  L.forEach(function (p) { if (!E_.some(function (s) { return s.id === p.id; })) E_.push(p); });

  // ================= FICHES =================
  var C = window.SYLVA_CATEGORIES || [];
  if (C.indexOf("Pêche") === -1) C.splice(C.indexOf("Nourriture") + 1, 0, "Pêche");
  var SRC = "Règles de pêche publiques de Wallonie (SPW, Maison wallonne de la Pêche), avis de l'INBO sur les polluants des poissons d'eau douce, savoir naturaliste usuel ; rédigé pour Sylva";
  var F = [
    { id: "peche_regles", cat: "Pêche", titre: "Pêcher : ce que dit la loi", illus: "camp",
      intro: "Pêcher sans permis dans une rivière publique est une infraction. Avant de lancer une ligne, quelques vérifications s'imposent.",
      etapes: [
        "Wallonie : un permis de pêche est obligatoire dans les rivières, canaux et lacs publics. Il s'achète uniquement en ligne (permisdepeche.be) et vaut jusqu'au 31 décembre. Un permis « touristique » de 14 jours existe pour les visiteurs.",
        "Certains secteurs demandent en plus une carte de club ou l'accord du propriétaire de la rive.",
        "Chaque espèce a ses périodes d'ouverture, sa taille minimale et parfois un quota par jour : vérifie le règlement de la Maison wallonne de la Pêche (maisondelapeche.be).",
        "Espèces à relâcher en Wallonie : anguille, saumon, et toutes les espèces protégées (chabot, écrevisse à pattes rouges…).",
        "Interdit : pêcher dans les zones de frayères balisées, utiliser des animaux entiers (grenouilles, poussins, souris) comme appât, ou des vifs qui ne sont pas sur la liste autorisée.",
        "France : il faut une carte de pêche d'une association agréée (AAPPMA), achetée en ligne ou chez un dépositaire. Les autres pays ont des règles comparables.",
        "Nasses, filets, lignes de fond ou pêche à la main sont interdits pour les pêcheurs amateurs dans la plupart des cas."
      ],
      attention: ["En vraie détresse (perdu plusieurs jours, sans nourriture), survivre passe avant le règlement. Mais une personne en bonne santé tient des semaines sans manger : l'eau, la chaleur et se signaler restent prioritaires."] },
    { id: "poisson_pollution", cat: "Pêche", titre: "Peut-on manger le poisson de rivière ?", illus: "eau_ebullition",
      intro: "Beaucoup de rivières d'Europe de l'Ouest contiennent encore des polluants qui s'accumulent dans les poissons : PCB, dioxines, mercure, PFAS. La cuisson ne les détruit pas.",
      etapes: [
        "Les plus chargés : l'anguille (à ne jamais manger), les gros poissons de fond (carpe, silure, barbeau) et les gros carnassiers âgés (brochet, sandre).",
        "Les moins chargés : les poissons jeunes, petits et maigres, et les truites des ruisseaux d'amont, loin des villes et des industries.",
        "Évite de pêcher pour manger en aval des grandes villes, des zones industrielles, des stations d'épuration ou dans les eaux à l'odeur ou à la couleur anormale.",
        "Les polluants se logent surtout dans la graisse : retire la peau, la graisse du ventre et la ligne brune des flancs, et ne mange pas le foie ni les œufs.",
        "Cuis sur une grille ou au four pour que la graisse s'écoule, plutôt qu'en sauce ou en soupe.",
        "Limite-toi à un repas de poisson sauvage de temps en temps. Les femmes enceintes et les enfants devraient éviter le poisson de rivière.",
        "Ne mange jamais un poisson trouvé mort, ni un poisson pris dans une zone où une interdiction de prélèvement est affichée."
      ],
      attention: ["Une étude flamande (INBO) conclut qu'une grande partie des poissons d'eau douce de Flandre dépasse encore les normes de consommation, et que des pêcheurs qui mangent leurs prises ont des taux élevés de polluants dans le sang."] },
    { id: "poisson_frais", cat: "Pêche", titre: "Reconnaître un poisson sain et frais", illus: "eau_ebullition",
      intro: "Sans réfrigérateur, un poisson s'abîme en quelques heures, encore plus vite par temps chaud. Quelques signes ne trompent pas.",
      etapes: [
        "Yeux bombés, brillants et clairs. Des yeux creux, ternes ou laiteux : poisson trop vieux.",
        "Branchies rouge vif et humides. Brunes, grises ou gluantes : à jeter.",
        "Chair ferme : le doigt ne laisse pas de trace. Une chair molle qui garde l'empreinte n'est plus bonne.",
        "Odeur légère d'eau ou d'algue. Une odeur forte, aigre ou d'ammoniaque : à jeter.",
        "Méfiance devant un poisson malade : plaies, boursouflures, nageoires rongées, nage anormale, couleur étrange.",
        "Une fois pêché, tue-le aussitôt, vide-le, et mange-le dans les heures qui suivent, ou fais-le sécher ou fumer (fiche « Préparer et cuire un poisson »)."
      ] },
    { id: "poisson_preparer", cat: "Pêche", titre: "Préparer et cuire un poisson", illus: "cuire_sans",
      intro: "Bien tué, vidé tout de suite et cuit à cœur : c'est ce qui rend un poisson de rivière sûr et bon.",
      etapes: [
        "Tuer rapidement : un coup sec sur le dessus de la tête avec un bâton, juste derrière les yeux. C'est plus respectueux, et la chair se garde mieux.",
        "Saigner : couper les branchies d'un côté et laisser égoutter quelques minutes.",
        "Écailler : racler du dos de la lame, de la queue vers la tête. Inutile pour la truite.",
        "Vider : inciser le ventre de l'anus jusqu'à la tête, retirer tous les viscères et racler le filet sombre le long de l'arête (le rein). Ne jamais garder les œufs du barbeau.",
        "Faire cela loin de l'eau et du camp, et enterrer les restes : ils attirent les animaux.",
        "Cuire à cœur : la chair doit devenir opaque et se détacher facilement de l'arête. Sur une broche, en papillote de feuilles ou sur une pierre chaude (fiche « Cuire sans ustensiles »).",
        "Pour garder plus longtemps : couper en fines lanières et les faire sécher et fumer plusieurs heures au-dessus d'un feu doux et enfumé."
      ],
      attention: ["Jamais de poisson d'eau douce cru, mariné ou à peine cuit : il peut transmettre des vers parasites (ver solitaire du poisson, douve du foie). Seule une cuisson complète, ou une congélation longue à -20 °C, les détruit."] },
    { id: "peche_survie", cat: "Pêche", titre: "Pêcher en situation de survie", illus: "cordelette",
      intro: "En vraie détresse, une ligne de fortune peut apporter de quoi manger. Mais la pêche demande du temps et de la patience : ce n'est jamais la priorité numéro un.",
      etapes: [
        "Hameçon : une épingle à nourrice repliée, une épine d'aubépine ou de prunellier liée sur un bâtonnet, ou un « hameçon à gorge » : un petit bâton pointu aux deux bouts, attaché en son milieu, que le poisson avale en long.",
        "Ligne : de la cordelette fine, du fil dentaire, des fibres d'ortie tressées ou les fils intérieurs d'une cordelette de parachute.",
        "Appât : vers de terre (sous les pierres, les bûches, dans la terre humide), larves d'insectes sous l'écorce morte ou les pierres de la rivière, sauterelles. Sur place, l'estomac d'un premier poisson donne l'appât idéal.",
        "Où : dans les remous derrière les rochers, sous les berges creusées, au bord des herbiers, près du bois immergé, à la sortie des rapides.",
        "Quand : à l'aube et au crépuscule, quand les poissons se nourrissent. Par temps couvert, ils mordent aussi en journée.",
        "Reste discret : approche lentement, sans ombre sur l'eau, sans vibration sur la berge.",
        "Vérifie souvent la ligne et ne laisse jamais une ligne abandonnée dans l'eau : elle tue poissons et oiseaux."
      ],
      attention: ["Hors situation de détresse, ces méthodes sont interdites : voir « Pêcher : ce que dit la loi ».", "La pêche coûte souvent plus d'énergie qu'elle n'en rapporte. L'eau, l'abri, le feu et se signaler passent avant."] },
    { id: "piqure_vive", cat: "Premiers secours", titre: "Piqûre de vive ou de rascasse", illus: "premiers_secours",
      intro: "Une douleur immédiate et violente au pied après avoir marché dans le sable à marée basse : c'est presque toujours une vive. Le venin est détruit par la chaleur.",
      etapes: [
        "Sortir de l'eau et s'asseoir au calme.",
        "Plonger la zone piquée dans de l'eau très chaude, autour de 45 °C, pendant au moins 15 à 30 minutes, ou jusqu'à ce que la douleur baisse. Rajouter de l'eau chaude au fur et à mesure.",
        "Tester la température avec la main saine ou celle d'un proche : la zone piquée est engourdie et pourrait se brûler sans que tu le sentes.",
        "Sans eau chaude : un sèche-cheveux ou une compresse chaude, à bonne distance de la peau.",
        "Retirer avec une pince les éventuels morceaux d'épine visibles, puis nettoyer et désinfecter.",
        "La douleur diminue en général en quelques heures et disparaît en un à deux jours."
      ],
      attention: ["Ne pas inciser, sucer, uriner dessus ni poser de garrot.", "Malaise, vertiges importants, nausées, gêne pour respirer ou gonflement qui s'étend : consulter un médecin ou appeler le 112."] },
    { id: "blessure_poisson", cat: "Premiers secours", titre: "Blessures d'épines et de dents de poisson", illus: "premiers_secours",
      intro: "Épines de perche, de sandre ou de poisson-chat, dents de brochet : les petites plaies faites par un poisson s'infectent facilement, car elles sont profondes et sales.",
      etapes: [
        "Laisser saigner un peu la plaie pour l'aider à se nettoyer.",
        "Rincer longuement à l'eau potable, puis savonner si possible.",
        "Retirer avec une pince tout morceau d'épine ou de dent visible.",
        "Désinfecter et couvrir d'un pansement propre.",
        "Piqûre de poisson-chat très douloureuse : l'eau très chaude soulage aussi (comme pour la vive).",
        "Surveiller la plaie pendant plusieurs jours (fiche « Soigner une plaie sur plusieurs jours »)."
      ],
      attention: ["Rougeur qui s'étend, chaleur, gonflement, traînée rouge vers le bras ou fièvre : infection, consulter rapidement.", "Vérifie que ton vaccin contre le tétanos est à jour."] }
  ];
  F.forEach(function (f) { if (!T.some(function (t) { return t.id === f.id; })) { f.source = f.source || SRC; T.push(f); } });

  // ================= CHAPITRE =================
  var G = window.SYLVA_GUIDE || [];
  if (!G.some(function (c) { return c.id === "poissons"; })) {
    var idx = 0; G.forEach(function (c, i) { if (c.id === "nourriture") idx = i + 1; });
    G.splice(idx, 0, {
      id: "poissons", titre: "Poissons et pêche", illus: "eau_ebullition",
      resume: "Ce qu'on a le droit de pêcher, ce qu'on peut manger, ce qu'il faut relâcher, et les vrais dangers : pollution, parasites, épines et venins.",
      sections: [
        { titre: "D'abord, la loi",
          p: ["En Wallonie comme en France, pêcher demande un permis, et chaque espèce a ses périodes, ses tailles minimales et parfois des quotas. Certaines espèces doivent toujours être relâchées : l'anguille, le saumon, et les espèces protégées comme le chabot ou l'écrevisse à pattes rouges. La fiche « Pêcher : ce que dit la loi » résume les règles."],
          encadre: { type: "retenir", titre: "À retenir", texte: "Dans le doute sur une espèce ou une règle : relâcher. Un poisson remis à l'eau ne te coûte rien, une espèce protégée prélevée peut coûter cher." } },
        { titre: "Manger ou relâcher : les trois familles",
          liste: ["Bons à manger, avec les règles : truite, perche, sandre, gardon, chevesne, brochet (attention aux arêtes et aux dents).",
                  "À manger avec prudence : les gros poissons de fond et les vieux carnassiers (carpe, silure, barbeau, gros brochet), qui concentrent les polluants. Le barbeau a des œufs toxiques.",
                  "À relâcher toujours : anguille, saumon, ombre, chabot, écrevisse à pattes rouges.",
                  "Les invasives (écrevisse signal, poisson-chat) se mangent, mais ne se transportent jamais vivantes."] },
        { titre: "La pollution, un danger invisible",
          p: ["Les PCB, dioxines, mercure et PFAS ne se voient pas, ne se sentent pas et ne disparaissent pas à la cuisson. Ils s'accumulent dans la graisse des poissons au fil des années. Règle simple : petit, jeune, maigre et pêché en amont, loin des villes. Jamais d'anguille. Retirer peau et graisse."],
          encadre: { type: "danger", titre: "Attention", texte: "Ne mange jamais un poisson trouvé mort ni un poisson pris dans une zone où une interdiction de prélèvement est affichée." } },
        { titre: "Parasites : toujours cuire",
          p: ["Certains poissons d'eau douce (brochet, perche, poissons blancs) peuvent porter des vers parasites transmissibles à l'humain, comme le ver solitaire du poisson. Une cuisson complète les détruit : la chair doit être opaque et se détacher de l'arête. Pas de tartare, pas de ceviche, pas de poisson de rivière à peine saisi."] },
        { titre: "Épines, dents et venins",
          liste: ["Perche et sandre : épines dorsales. Rabattre la nageoire avant de saisir le poisson.",
                  "Brochet : dents très acérées. Jamais les doigts dans la gueule.",
                  "Poisson-chat : épines dures et piqûre très douloureuse.",
                  "En mer du Nord et en Atlantique, la vive cachée dans le sable ; en Méditerranée, la rascasse : épines venimeuses. Le venin se soigne à l'eau très chaude."] },
        { titre: "En vraie survie",
          p: ["Une ligne de fortune (épingle, épine, hameçon à gorge) et un appât trouvé sous les pierres peuvent nourrir. Mais la pêche est lente et incertaine : un adulte en bonne santé tient des semaines sans manger, quelques jours seulement sans eau, et quelques heures seulement s'il a très froid. Les priorités restent l'abri, l'eau, le feu et se signaler."] }
      ],
      fiches: ["peche_regles", "poisson_pollution", "poisson_frais", "poisson_preparer", "peche_survie", "piqure_vive", "blessure_poisson", "cuire_sans"],
      especes: ["truite", "perche", "brochet", "sandre", "gardon", "chevesne", "carpe", "barbeau", "silure", "anguille", "saumon", "ombre", "ecrevisse_signal", "ecrevisse_rouge", "vive"]
    });
  }
})();
