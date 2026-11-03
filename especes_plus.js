// Sylva – extension de la base d'espèces (Belgique, toutes saisons).
// Contenu rédigé pour Sylva. Références : Centre Antipoisons belge (champignons),
// Province de Liège (vipère), Service public de Wallonie (loup), connaissances botaniques usuelles.
(function () {
  var TOUTE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  // Mois de présence des espèces déjà en base
  var MOIS = {
    chataignier: [9, 10, 11], hetre: [9, 10, 11], noisetier: [8, 9, 10], eglantier: [10, 11, 12], prunellier: [10, 11, 12],
    aubepine: [9, 10, 11], sorbier: [9, 10, 11], gland: [9, 10, 11], ortie: [3, 4, 5, 6, 7, 8, 9, 10], pissenlit: TOUTE,
    oenanthe: TOUTE, if: TOUTE, digitale: TOUTE, douceamere: [7, 8, 9, 10, 11, 12], phalloide: [7, 8, 9, 10, 11],
    tuemouches: [8, 9, 10, 11], galere: [9, 10, 11, 12, 1, 2, 3], cepe: [8, 9, 10, 11],
    sanglier: TOUTE, cerf: TOUTE, renard: TOUTE, tique: [3, 4, 5, 6, 7, 8, 9, 10, 11], castor: TOUTE
  };
  window.SYLVA_ESPECES.forEach(function (s) { if (MOIS[s.id]) s.mois = MOIS[s.id]; });

  function E(cat, id, nom, latin, niveau, statut, saison, mois, resume, identification, sosies, usages) {
    return { cat: cat, id: id, nom: nom, latin: latin, niveau: niveau, statut: statut, saison: saison, mois: mois,
      resume: resume, identification: identification, sosies: sosies || [], usages: usages || [] };
  }
  var S = function (nom, latin, niveau, diff) { return { nom: nom, latin: latin, niveau: niveau, diff: diff }; };
  var NE_RIEN = ["Ne rien consommer."];

  var plus = [
    // ================= PLANTES COMESTIBLES =================
    E("plante", "aildesours", "Ail des ours", "Allium ursinum", "caution", "Comestible · sosies mortels", "Mars → mai", [3, 4, 5],
      "Tapis de feuilles au parfum d'ail dans les sous-bois humides au printemps. Ses sosies sont parmi les plantes les plus toxiques de nos forêts.",
      ["Feuilles larges, molles et brillantes, chacune sur sa propre tige fine, partant directement du sol",
       "Dessous de la feuille mat, dessus brillant",
       "Fleurs blanches en étoile groupées en boule (avril-mai)",
       "Forte odeur d'ail au froissement — mais l'odeur reste sur les doigts : sentir chaque feuille séparément ne suffit pas"],
      [S("Muguet (Convallaria majalis)", "Convallaria majalis", "danger", "Deux ou trois feuilles qui s'emboîtent sur une même tige, sans odeur d'ail. Mortel."),
       S("Colchique (Colchicum autumnale)", "Colchicum autumnale", "danger", "Feuilles en touffe serrée qui sortent d'un même point, plus raides, sans odeur. Mortel."),
       S("Arum tacheté (Arum maculatum)", "Arum maculatum", "danger", "Feuilles en fer de flèche avec des nervures en réseau, parfois tachées de noir.")],
      ["Cueillir feuille par feuille, jamais par poignées.", "Crue en pesto ou en salade, ou cuite comme des épinards.", "En cas de doute sur une seule feuille : tout jeter."]),

    E("plante", "mure", "Mûre (ronce)", "Rubus fruticosus", "ok", "Comestible", "Juil. → sept.", [7, 8, 9],
      "Le fruit sauvage le plus facile : aucun sosie dangereux en Belgique.",
      ["Ronce épineuse aux longues tiges arquées", "Feuilles à 3 ou 5 folioles dentées", "Fruits noirs brillants formés de petites boules"],
      [], ["Crue. Cueillir en hauteur plutôt qu'au ras du sol (voir Renard).", "Éviter les bords de routes."]),

    E("plante", "framboise", "Framboisier sauvage", "Rubus idaeus", "ok", "Comestible", "Juil. → août", [7, 8],
      "Fréquent dans les coupes forestières et les clairières.",
      ["Tiges dressées à petits aiguillons fins", "Dessous des feuilles blanchâtre", "Fruit rouge creux, qui se détache de son support"],
      [], ["Crue, à laver si cueillie bas."]),

    E("plante", "myrtille", "Myrtille", "Vaccinium myrtillus", "ok", "Comestible", "Juil. → août", [7, 8],
      "Couvre le sol des forêts acides et des landes. Les myrtilles sauvages colorent la bouche en bleu.",
      ["Petit arbrisseau de 20 à 50 cm aux tiges vertes anguleuses", "Petites feuilles ovales finement dentées", "Baies bleu-noir avec une petite couronne au sommet, chair violette"],
      [S("Airelle des marais (Vaccinium uliginosum)", "Vaccinium uliginosum", "caution", "Tiges brunes rondes, feuilles bleutées non dentées, chair blanche. À éviter en quantité.")],
      ["Crue. Laver ou cuire si cueillie au ras du sol (échinococcose, voir Renard)."]),

    E("plante", "fraise", "Fraisier des bois", "Fragaria vesca", "ok", "Comestible", "Mai → juil.", [5, 6, 7],
      "Minuscules fraises très parfumées en lisière et talus.",
      ["Feuilles à 3 folioles dentées", "Fleurs blanches à 5 pétales", "Petit fruit rouge conique, graines en surface"],
      [S("Potentille faux-fraisier", "Potentilla sterilis", "ok", "Même allure mais fruit sec, non charnu : sans danger, juste décevant.")],
      ["Crue, à laver (pousse au ras du sol)."]),

    E("plante", "sureau", "Sureau noir", "Sambucus nigra", "caution", "Fleurs crues · baies cuites", "Fleurs mai-juin, baies août-sept.", [5, 6, 8, 9],
      "Arbuste des haies. Fleurs parfumées et baies riches, mais les baies crues et les feuilles sont toxiques.",
      ["Arbuste à écorce grise liégeuse, moelle blanche dans les rameaux", "Larges ombelles plates de fleurs crème en mai-juin", "Grappes pendantes de baies noires en fin d'été"],
      [S("Sureau hièble (Sambucus ebulus)", "Sambucus ebulus", "danger", "Plante herbacée qui repousse chaque année (pas de bois), grappes de baies DRESSÉES, odeur désagréable. Toxique."),
       S("Sureau rouge (Sambucus racemosa)", "Sambucus racemosa", "caution", "Baies rouges en grappes ovales. Graines toxiques : éviter.")],
      ["Fleurs : en beignets ou infusées dans l'eau (sirop).", "Baies : toujours cuites, sans tiges vertes (en confiture, en sirop).", "Jamais les feuilles ni l'écorce."]),

    E("plante", "oseille", "Oseille sauvage", "Rumex acetosa", "caution", "Comestible avec modération", "Avril → sept.", [4, 5, 6, 7, 8, 9],
      "Goût acidulé de citron. Riche en acide oxalique : à petite dose.",
      ["Feuilles en fer de flèche, oreillettes pointant vers le bas", "Goût franchement acide", "Prairies et bords de chemins"],
      [S("Arum tacheté (jeunes feuilles)", "Arum maculatum", "danger", "Feuilles plus épaisses, nervures en réseau, sans goût acide, brûle la bouche. Toxique.")],
      ["Quelques feuilles en salade ou en soupe.", "Déconseillée en quantité (calculs rénaux, goutte)."]),

    E("plante", "plantain", "Plantain lancéolé", "Plantago lanceolata", "ok", "Comestible", "Avril → oct.", [4, 5, 6, 7, 8, 9, 10],
      "Partout dans les prairies et chemins. Usage traditionnel en écrasant une feuille sur une piqûre d'ortie ou d'insecte.",
      ["Rosette de feuilles étroites et longues avec 3 à 5 nervures parallèles très marquées", "Épis bruns serrés sur de longues tiges nues"],
      [], ["Jeunes feuilles en salade ou cuites.", "Épis jeunes : goût de champignon une fois poêlés."]),

    E("plante", "cresson", "Cresson de fontaine", "Nasturtium officinale", "caution", "Toujours cuit", "Toute l'année", TOUTE,
      "Pousse dans les ruisseaux clairs. Cru, il peut transmettre la grande douve du foie (parasite) près des pâtures.",
      ["Tiges creuses flottantes ou rampantes dans l'eau courante", "Feuilles composées de folioles arrondies, goût piquant", "Petites fleurs blanches à 4 pétales"],
      [S("Berle et ache nodiflore (ombellifères)", "Helosciadium nodiflorum", "danger", "Feuilles dentées, fleurs en ombelles. La famille des ombellifères compte des espèces mortelles au bord de l'eau.")],
      ["Uniquement cuit (soupe), jamais cru s'il vient d'un ruisseau sauvage."]),

    E("plante", "tilleul", "Tilleul", "Tilia cordata / platyphyllos", "ok", "Comestible", "Feuilles avril-mai, fleurs juin-juil.", [4, 5, 6, 7],
      "Jeunes feuilles tendres et fleurs à infuser.",
      ["Grand arbre aux feuilles en cœur asymétrique, dentées", "Fleurs crème parfumées pendant sous une bractée en languette"],
      [], ["Jeunes feuilles en salade.", "Fleurs séchées en infusion."]),

    E("plante", "pin", "Pin sylvestre", "Pinus sylvestris", "caution", "Infusion · attention à l'if", "Toute l'année", TOUTE,
      "Les aiguilles fraîches donnent une infusion riche en vitamine C. Le seul vrai danger : le confondre avec l'if.",
      ["Aiguilles par DEUX, réunies à la base dans une petite gaine", "Écorce orangée en haut du tronc", "Petits cônes (pommes de pin)"],
      [S("If (Taxus baccata)", "Taxus baccata", "danger", "Aiguilles plates, isolées une par une, vert foncé, sans odeur de résine. Mortel."),
       S("Épicéa (Picea abies)", "Picea abies", "ok", "Aiguilles isolées mais piquantes, à section carrée. Jeunes pousses de mai comestibles.")],
      ["Infuser une poignée d'aiguilles hachées 10 minutes dans l'eau chaude (pas bouillante).", "À éviter pendant la grossesse."]),

    E("plante", "bardane", "Bardane", "Arctium lappa", "caution", "Racine cuite", "Racine sept. → mars", [9, 10, 11, 12, 1, 2, 3],
      "Ses fruits accrocheurs ont inspiré le velcro. La racine de la première année se mange cuite.",
      ["Très grandes feuilles en cœur, dessous blanc cotonneux", "Fruits ronds couverts de crochets qui s'accrochent aux vêtements", "Longue racine pivotante"],
      [S("Digitale pourpre (rosette)", "Digitalis purpurea", "danger", "Feuilles plus petites, duveteuses dessus, sans dessous blanc. Mortelle."),
       S("Rhubarbe (feuilles)", "Rheum rhabarbarum", "danger", "Feuilles toxiques, tige rouge. Ne pas confondre au jardin.")],
      ["Racine épluchée, coupée et cuite à l'eau ou sautée.", "Prélever avec l'accord du propriétaire."]),

    E("plante", "pomme", "Pommier sauvage", "Malus sylvestris", "ok", "Comestible", "Sept. → nov.", [9, 10, 11],
      "Petites pommes très acides, meilleures cuites.",
      ["Petit arbre parfois épineux", "Petites pommes de 2 à 4 cm, vertes à jaunes"],
      [], ["Cuites en compote ou au feu.", "Pépins à ne pas croquer en quantité."]),

    E("plante", "merisier", "Merisier (cerisier sauvage)", "Prunus avium", "ok", "Comestible", "Juin → juil.", [6, 7],
      "Petites cerises sucrées en lisière, souvent pillées par les oiseaux.",
      ["Grand arbre à écorce lisse brun-rouge qui se détache en bandes horizontales", "Cerises rouges à noires sur longues queues"],
      [S("Laurier-cerise (Prunus laurocerasus)", "Prunus laurocerasus", "danger", "Arbuste de haie à feuilles persistantes, épaisses et luisantes, fruits en grappes dressées. Toxique.")],
      ["Crues. Ne pas croquer les noyaux."]),

    E("plante", "chenopode", "Chénopode blanc", "Chenopodium album", "ok", "Comestible cuit", "Mai → sept.", [5, 6, 7, 8, 9],
      "Mauvaise herbe des terres retournées, cousine sauvage de l'épinard.",
      ["Feuilles en losange, dentées, couvertes d'une poudre blanche farineuse (surtout au revers et en haut)", "Petites fleurs vertes en grappes"],
      [], ["Cuit comme des épinards.", "Éviter les cultures traitées et les bords de champs."]),

    E("plante", "mauve", "Mauve sylvestre", "Malva sylvestris", "ok", "Comestible", "Mai → sept.", [5, 6, 7, 8, 9],
      "Feuilles et fleurs douces, légèrement mucilagineuses.",
      ["Feuilles arrondies à 5 à 7 lobes peu profonds", "Grandes fleurs rose-mauve striées de veines sombres"],
      [], ["Fleurs crues en salade, feuilles cuites en soupe."]),

    E("plante", "lierreterrestre", "Lierre terrestre", "Glechoma hederacea", "ok", "Aromatique", "Mars → juin", [3, 4, 5, 6],
      "Petite plante rampante très parfumée, à utiliser comme une herbe aromatique.",
      ["Tiges carrées rampantes", "Feuilles rondes en rein, crénelées, opposées", "Fleurs violettes en tube au printemps"],
      [S("Lierre grimpant (Hedera helix)", "Hedera helix", "danger", "Plante ligneuse grimpante aux feuilles coriaces et luisantes. Toxique.")],
      ["En petite quantité pour parfumer une salade ou une omelette."]),

    // ================= PLANTES TOXIQUES =================
    E("toxique", "muguet", "Muguet", "Convallaria majalis", "danger", "Mortel", "Avril → juin", [4, 5, 6],
      "Sosie mortel de l'ail des ours, qui pousse dans les mêmes sous-bois.",
      ["2 à 3 feuilles qui s'enroulent l'une dans l'autre à la base d'une même tige", "Clochettes blanches parfumées en grappe d'un seul côté", "Baies rouges en été"],
      [], NE_RIEN),

    E("toxique", "colchique", "Colchique d'automne", "Colchicum autumnale", "danger", "Mortel", "Feuilles mars-mai, fleurs sept-oct.", [3, 4, 5, 9, 10],
      "Ses feuilles printanières se confondent avec l'ail des ours. Fleurs mauves en automne, sans feuilles.",
      ["Au printemps : grosses feuilles en touffe serrée sortant d'un même point, avec une capsule au centre", "En automne : fleurs mauves en tulipe posées sur le sol"],
      [], NE_RIEN),

    E("toxique", "arum", "Arum tacheté", "Arum maculatum", "danger", "Toxique", "Toute l'année", TOUTE,
      "Fréquent en sous-bois humide. Brûle la bouche et la gorge, baies rouges attirantes pour les enfants.",
      ["Feuilles en fer de flèche, nervures en réseau, parfois tachées de noir", "Fleur en cornet vert pâle entourant un doigt violet", "Épi de baies rouge vif en été"],
      [], NE_RIEN),

    E("toxique", "belladone", "Belladone", "Atropa belladonna", "danger", "Mortelle", "Baies juil. → sept.", [6, 7, 8, 9],
      "Coupes forestières et lisières calcaires. Quelques baies peuvent tuer un enfant.",
      ["Plante buissonnante jusqu'à 1,5 m", "Fleurs en cloche brun-violet", "Baie noire luisante comme une cerise, posée sur une étoile verte à 5 pointes"],
      [S("Myrtille", "Vaccinium myrtillus", "ok", "Petit arbrisseau au ras du sol, baies bleu mat avec une couronne. La belladone est une grande plante.")],
      NE_RIEN),

    E("toxique", "cigue", "Grande ciguë", "Conium maculatum", "danger", "Mortelle", "Toute l'année", TOUTE,
      "L'ombellifère la plus célèbre. Friches, bords de chemins et fossés.",
      ["Grande tige lisse tachée de pourpre, sans poils", "Feuilles très découpées comme du persil", "Odeur désagréable de souris au froissement"],
      [S("Carotte sauvage, cerfeuil des bois", "Anthriscus sylvestris", "danger", "Règle absolue : aucune ombellifère sauvage ne se mange sans expert.")],
      ["Ne rien consommer. Se laver les mains après contact."]),

    E("toxique", "berce", "Berce du Caucase", "Heracleum mantegazzianum", "danger", "Brûlures graves", "Mai → sept.", [5, 6, 7, 8, 9],
      "Plante invasive géante en bord de cours d'eau. Sa sève + le soleil provoquent des brûlures graves et des cicatrices durables.",
      ["Géante de 2 à 4 m, tige épaisse tachée de pourpre", "Feuilles énormes très découpées", "Ombelles blanches de 50 cm"],
      [], ["Ne pas toucher. En cas de contact : laver à l'eau et au savon, couvrir la peau et la protéger du soleil 48 h, consulter si cloques."]),

    E("toxique", "aconit", "Aconit napel", "Aconitum napellus", "danger", "Mortel", "Toute l'année", TOUTE,
      "Une des plantes les plus toxiques d'Europe, même au toucher prolongé. Prairies humides et bords de ruisseaux.",
      ["Feuilles profondément découpées en lanières", "Fleurs bleu-violet en forme de casque (juin-août)"],
      [], ["Ne pas cueillir, ne pas manipuler à mains nues."]),

    E("toxique", "houx", "Houx", "Ilex aquifolium", "danger", "Baies toxiques", "Baies oct. → fév.", [10, 11, 12, 1, 2],
      "Ses baies rouges d'hiver provoquent vomissements et diarrhées.",
      ["Arbuste à feuilles persistantes, luisantes et piquantes", "Baies rouges vif en hiver"],
      [], NE_RIEN),

    E("toxique", "fusain", "Fusain d'Europe", "Euonymus europaeus", "danger", "Toxique", "Fruits sept. → nov.", [9, 10, 11],
      "Fruits rose vif en « bonnet d'évêque », très décoratifs et toxiques.",
      ["Rameaux verts à 4 angles liégeux", "Capsules roses à 4 lobes s'ouvrant sur des graines orange"],
      [], NE_RIEN),

    E("toxique", "bryone", "Bryone dioïque", "Bryonia dioica", "danger", "Toxique", "Baies août → oct.", [8, 9, 10],
      "Liane des haies aux baies rouges et à la grosse racine (« navet du diable »).",
      ["Liane grimpant avec des vrilles en ressort", "Feuilles à 5 lobes, rêches", "Petites baies rouges en grappes"],
      [], NE_RIEN),

    E("toxique", "laurier", "Laurier-cerise", "Prunus laurocerasus", "danger", "Toxique", "Toute l'année", TOUTE,
      "Haie très courante, échappée en forêt. Feuilles et graines libèrent du cyanure quand on les écrase.",
      ["Feuilles persistantes, épaisses, luisantes, odeur d'amande amère au froissement", "Fruits noirs en grappes dressées"],
      [], ["Ne rien consommer. Ne pas utiliser ses branches pour cuire des aliments."]),

    // ================= CHAMPIGNONS =================
    E("champignon", "girolle", "Girolle", "Cantharellus cibarius", "caution", "Comestible · faire vérifier", "Juin → oct.", [6, 7, 8, 9, 10],
      "Champignon jaune d'œuf très recherché, souvent en groupes sous hêtres et chênes.",
      ["Jaune d'œuf uniforme, chapeau en entonnoir irrégulier", "Dessous à PLIS épais et fourchus qui descendent sur le pied (pas de vraies lames)", "Chair blanche ferme, odeur d'abricot"],
      [S("Fausse girolle (Hygrophoropsis aurantiaca)", "Hygrophoropsis aurantiaca", "caution", "Orange plus vif, vraies lames fines et serrées, chair molle. Indigeste."),
       S("Omphalote de l'olivier (Omphalotus olearius)", "Omphalotus olearius", "danger", "Orange, en touffes sur bois ou souches, vraies lames. Troubles digestifs graves.")],
      ["Faire vérifier toute récolte par un mycologue ou un cercle de mycologie avant consommation."]),

    E("champignon", "piedmouton", "Pied-de-mouton", "Hydnum repandum", "caution", "Comestible · faire vérifier", "Août → nov.", [8, 9, 10, 11],
      "Reconnaissable à son dessous couvert d'aiguillons, sans aucun sosie toxique connu chez nous.",
      ["Chapeau crème à orangé pâle, irrégulier", "Dessous couvert de petits AIGUILLONS fragiles au lieu de lames", "Chair blanche cassante"],
      [], ["Faire vérifier avant consommation."]),

    E("champignon", "coulemelle", "Coulemelle", "Macrolepiota procera", "caution", "Comestible · faire vérifier", "Juil. → oct.", [7, 8, 9, 10],
      "Grand champignon en ombrelle des prés et lisières. Ses petites cousines, les lépiotes, sont mortelles.",
      ["Chapeau de 15 à 30 cm couvert d'écailles brunes, mamelon au centre", "Pied haut, chiné de brun, avec un anneau double qui coulisse", "Lames blanches libres"],
      [S("Petites lépiotes (Lepiota brunneoincarnata…)", "Lepiota brunneoincarnata", "danger", "Chapeau de MOINS de 10 cm, aux écailles roses à brunes. Mortelles : jamais de petite lépiote."),
       S("Amanite panthère (Amanita pantherina)", "Amanita pantherina", "danger", "Chapeau brun lisse à flocons blancs, volve en bourrelet à la base. Toxique.")],
      ["Ne consommer que des chapeaux de plus de 15 cm, et après vérification par un expert."]),

    E("champignon", "trompette", "Trompette de la mort", "Craterellus cornucopioides", "caution", "Comestible · faire vérifier", "Août → nov.", [8, 9, 10, 11],
      "Malgré son nom, un excellent comestible. Noire, en trompette, sous les hêtres.",
      ["Entonnoir creux gris-noir jusqu'au pied", "Extérieur lisse ou ridé, sans lames", "Pousse en troupes dans les feuilles mortes"],
      [], ["Faire vérifier avant consommation."]),

    E("champignon", "pleurote", "Pleurote en huître", "Pleurotus ostreatus", "caution", "Comestible · faire vérifier", "Oct. → mars", [10, 11, 12, 1, 2, 3],
      "Pousse en étages sur le bois mort de feuillus, même en hiver.",
      ["Chapeaux gris-bleu à brun en forme d'huître, sans pied ou presque", "Lames blanches qui descendent sur le pied", "En grappes superposées sur troncs et souches"],
      [S("Hypholome en touffe (Hypholoma fasciculare)", "Hypholoma fasciculare", "danger", "Chapeaux jaune soufre en touffes sur souches, lames verdâtres, goût amer. Toxique.")],
      ["Faire vérifier avant consommation."]),

    E("champignon", "vesse", "Vesse-de-loup géante", "Calvatia gigantea", "caution", "Comestible jeune · faire vérifier", "Juin → oct.", [6, 7, 8, 9, 10],
      "Une boule blanche qui peut atteindre la taille d'un ballon. La règle : toujours la couper en deux.",
      ["Grosse boule blanche lisse, sans pied visible", "Chair blanche homogène, comme de la mozzarella, quand elle est jeune"],
      [S("Jeune amanite « en œuf »", "Amanita phalloides", "danger", "Coupée en deux, elle montre la silhouette d'un champignon (chapeau, lames, pied) à l'intérieur. Mortelle.")],
      ["Couper chaque exemplaire en deux : la chair doit être blanche et uniforme.", "Faire vérifier avant consommation."]),

    E("champignon", "morille", "Morille", "Morchella esculenta", "caution", "Comestible cuite · faire vérifier", "Mars → mai", [3, 4, 5],
      "Champignon de printemps au chapeau alvéolé comme une éponge. Toxique crue.",
      ["Chapeau en nid d'abeille, soudé au pied", "Entièrement creuse quand on la coupe en deux"],
      [S("Gyromitre (Gyromitra esculenta)", "Gyromitra esculenta", "danger", "Chapeau en cervelle (plis), intérieur cloisonné, pas creux. Mortel.")],
      ["Toujours bien cuite, jamais crue.", "Faire vérifier avant consommation."]),

    E("champignon", "boletbai", "Bolet bai", "Imleria badia", "caution", "Comestible · faire vérifier", "Août → nov.", [8, 9, 10, 11],
      "Très commun sous les épicéas et les pins.",
      ["Chapeau brun-marron, collant par temps humide", "Pores jaunes qui bleuissent au toucher", "Pied brun clair sans réseau"],
      [S("Bolet amer (Tylopilus felleus)", "Tylopilus felleus", "caution", "Pores qui rosissent, réseau sombre sur le pied, goût très amer.")],
      ["Faire vérifier avant consommation."]),

    E("champignon", "panthere", "Amanite panthère", "Amanita pantherina", "danger", "Toxique grave", "Juil. → oct.", [7, 8, 9, 10],
      "Provoque agitation, confusion et coma. Se confond avec des comestibles.",
      ["Chapeau brun lisse parsemé de flocons blancs", "Lames blanches, anneau lisse", "Bulbe à la base avec un bourrelet net"],
      [], NE_RIEN),

    E("champignon", "vireuse", "Amanite vireuse", "Amanita virosa", "danger", "Mortelle", "Juil. → oct.", [7, 8, 9, 10],
      "L'« ange de la mort » : entièrement blanc, aussi mortel que l'amanite phalloïde.",
      ["Tout blanc, chapeau souvent conique", "Pied pelucheux, anneau fragile", "Volve blanche en sac à la base"],
      [S("Rosé des prés, agarics blancs", "Agaricus campestris", "danger", "Blanc ne veut rien dire : un champignon blanc n'est pas forcément comestible.")],
      NE_RIEN),

    E("champignon", "cortinaire", "Cortinaire couleur de rocou", "Cortinarius orellanus", "danger", "Mortel (reins)", "Août → oct.", [8, 9, 10],
      "Détruit les reins. Les symptômes peuvent n'apparaître qu'après plusieurs jours.",
      ["Champignon fauve-orangé, chapeau soyeux", "Lames rouille", "Restes de voile filamenteux (cortine) chez les jeunes"],
      [], NE_RIEN),

    E("champignon", "entolome", "Entolome livide", "Entoloma sinuatum", "danger", "Toxique grave", "Août → oct.", [8, 9, 10],
      "Grand champignon gris pâle, souvent cueilli par erreur.",
      ["Chapeau gris-crème, bord ondulé", "Lames jaunâtres puis rose saumon", "Odeur de farine"],
      [], NE_RIEN),

    E("champignon", "hypholome", "Hypholome en touffe", "Hypholoma fasciculare", "danger", "Toxique", "Toute l'année", TOUTE,
      "Le champignon jaune soufre le plus courant sur les souches.",
      ["Chapeaux jaune soufre, centre plus orangé, en grosses touffes", "Lames jaune-verdâtre puis noirâtres", "Goût très amer"],
      [], NE_RIEN),

    // ================= FAUNE =================
    E("animal", "vipere", "Vipère péliade", "Vipera berus", "caution", "Rare · morsure", "Mars → oct.", [3, 4, 5, 6, 7, 8, 9, 10],
      "Très rare en Wallonie : seulement dans le sud de la province de Namur (vers Givet) et une zone de réintroduction dans les Fagnes. Pas connue dans la vallée de l'Ourthe.",
      ["Serpent trapu de 50 à 65 cm", "Zigzag sombre continu sur le dos", "Pupille verticale en fente"],
      [S("Couleuvre à collier (Natrix helvetica)", "Natrix helvetica", "ok", "Plus longue et fine, collier jaune et noir derrière la tête, pupille ronde. Inoffensive.")],
      ["En cas de morsure : rester calme, s'allonger, immobiliser le membre, retirer bagues et montre, désinfecter.",
       "Ne pas sucer, inciser ni poser de garrot. Appeler le 112."]),

    E("animal", "loup", "Loup gris", "Canis lupus", "info", "Rare · discret", "Toute l'année", TOUTE,
      "Revenu naturellement en Wallonie, avec plusieurs zones de présence permanente. Il évite l'humain.",
      ["Plus grand qu'un berger allemand, pelage gris-beige, dos sombre", "Traces : 4 doigts, empreinte ovale de 10 cm, en ligne droite"],
      [], ["Ne jamais nourrir ni approcher. Garder son chien en laisse.", "Signaler une observation aux services nature de sa région (voir la note pays)."]),

    E("animal", "chevreuil", "Chevreuil", "Capreolus capreolus", "info", "Observation", "Toute l'année", TOUTE,
      "Le cervidé le plus courant. Aboie quand il est dérangé.",
      ["Petit cervidé roux en été, gris-brun en hiver", "Tache blanche aux fesses (le « miroir »)", "Traces : petit sabot fendu de 4 à 5 cm"],
      [], ["Un faon seul n'est pas abandonné : ne jamais le toucher."]),

    E("animal", "blaireau", "Blaireau", "Meles meles", "info", "Observation", "Toute l'année", TOUTE,
      "Nocturne, vit en clan dans de grands terriers.",
      ["Tête rayée noir et blanc", "Traces : 5 doigts alignés avec de longues griffes", "Latrines : petits trous où il dépose ses crottes"],
      [], ["Ne pas camper près d'un terrier actif."]),

    E("animal", "salamandre", "Salamandre tachetée", "Salamandra salamandra", "info", "Ne pas toucher", "Mars → oct.", [3, 4, 5, 6, 7, 8, 9, 10],
      "Noire et jaune, sort les nuits de pluie dans les forêts humides. Espèce protégée et menacée par un champignon mortel transporté sur les mains et les bottes.",
      ["Amphibien noir à grandes taches jaunes", "Lent, se déplace la nuit par temps humide"],
      [], ["Ne pas la manipuler : sa peau sécrète une substance irritante et on peut lui transmettre une maladie.", "Nettoyer et sécher ses bottes entre deux sites."]),

    E("animal", "processionnaire", "Chenille processionnaire du chêne", "Thaumetopoea processionea", "caution", "Poils urticants", "Mai → août", [5, 6, 7, 8],
      "Ses poils microscopiques provoquent démangeaisons, irritations des yeux et parfois des difficultés respiratoires, même sans contact direct.",
      ["Chenilles grises poilues en files ou en amas sur les troncs de chênes", "Nids soyeux blanchâtres sur l'écorce"],
      [], ["Ne pas approcher les nids, ne pas camper sous un chêne colonisé.", "En cas de contact : ne pas frotter, rincer à l'eau, changer de vêtements."]),

    E("animal", "frelon", "Guêpes et frelons", "Vespa crabro", "caution", "Piqûres", "Mai → oct.", [5, 6, 7, 8, 9, 10],
      "Les piqûres sont douloureuses, et dangereuses en cas d'allergie ou de piqûres multiples.",
      ["Frelon : grand (3 cm), roux et jaune", "Guêpe : jaune et noir, taille fine"],
      [], ["Ne pas laisser de nourriture sucrée ouverte.", "En cas de gonflement du visage, de gêne respiratoire ou de malaise après une piqûre : appeler le 112."])
  ];

  plus.forEach(function (s) { window.SYLVA_ESPECES.push(s); });
})();
