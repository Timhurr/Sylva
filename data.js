// Sylva – contenu V1 : Ardennes belges (vallée de l'Ourthe), novembre.
// Ce contenu est éducatif. Il ne remplace ni un guide de terrain ni un expert.

window.SYLVA_ZONE = {
  nom: "Vallée de l'Ourthe · Nisramont",
  centre: [50.1355, 5.7905],
  zoom: 13
};

window.SYLVA_ESPECES = [
  // ---------- PLANTES COMESTIBLES ----------
  {
    id: "chataignier", cat: "plante", nom: "Châtaignier", latin: "Castanea sativa",
    niveau: "caution", statut: "Comestible cuit", saison: "Sept. → nov.",
    resume: "Fruit nourrissant, riche en amidon. Son sosie, le marron d'Inde, est toxique.",
    identification: [
      "Bogue hérissée de piquants fins, longs et très serrés (comme un hérisson)",
      "2 à 3 fruits par bogue, aplatis sur une face, avec une petite pointe velue",
      "Feuilles simples, longues (15–25 cm), bordées de dents pointues"
    ],
    sosies: [
      { nom: "Marron d'Inde (Aesculus hippocastanum)", latin: "Aesculus hippocastanum", niveau: "danger",
        diff: "Bogue avec quelques pointes courtes et espacées, 1 seul fruit rond et lisse sans pointe, feuilles en éventail à 5–7 folioles." }
    ],
    usages: [
      "Grillée sur la braise (inciser l'écorce avant pour éviter qu'elle éclate) ou bouillie 20–30 min.",
      "Crue, elle est astringente et difficile à digérer."
    ]
  },
  {
    id: "hetre", cat: "plante", nom: "Faîne (hêtre)", latin: "Fagus sylvatica",
    niveau: "caution", statut: "Petite quantité, grillée", saison: "Sept. → nov.",
    resume: "Le hêtre domine les forêts ardennaises. Ses petites graines triangulaires se mangent avec modération.",
    identification: [
      "Écorce grise et lisse, tronc droit",
      "Feuilles ovales à bord ondulé, légèrement poilues au bord",
      "Cupule à 4 valves contenant 2 graines brillantes à 3 faces"
    ],
    sosies: [],
    usages: [
      "Décortiquer puis griller : la cuisson réduit la fagine, irritante en grande quantité.",
      "À consommer en petite quantité (une poignée)."
    ]
  },
  {
    id: "noisetier", cat: "plante", nom: "Noisetier", latin: "Corylus avellana",
    niveau: "ok", statut: "Comestible", saison: "Sept. → oct. (fin de saison)",
    resume: "Noisettes encore trouvables au sol début novembre, souvent déjà vidées par les animaux.",
    identification: [
      "Arbuste à plusieurs tiges, écorce brun clair luisante",
      "Feuilles arrondies, doublement dentées, rêches au toucher",
      "Fruit dans une enveloppe verte à franges"
    ],
    sosies: [],
    usages: [
      "Crue ou grillée. Une noisette percée d'un petit trou est vide (larve ou rongeur).",
      "Ramasser au sol de préférence loin des chemins (crottes d'animaux)."
    ]
  },
  {
    id: "eglantier", cat: "plante", nom: "Églantier (cynorrhodon)", latin: "Rosa canina",
    niveau: "caution", statut: "Comestible, préparation", saison: "Oct. → déc.",
    resume: "Le fruit du rosier sauvage. Meilleur après les premières gelées, quand il ramollit.",
    identification: [
      "Arbuste épineux aux tiges arquées, aiguillons crochus",
      "Fruit rouge orangé, ovale, lisse, 1,5–2 cm, avec les restes du calice au sommet",
      "Feuilles composées de 5 à 7 folioles dentées"
    ],
    sosies: [
      { nom: "Baies rouges toxiques (if, douce-amère, houx, chèvrefeuille)", niveau: "danger",
        diff: "Aucune n'a la forme ovale du cynorrhodon avec le calice séché au sommet ni les tiges à aiguillons. En cas de doute, ne pas consommer." }
    ],
    usages: [
      "Ouvrir le fruit et retirer graines et poils intérieurs : ils irritent la bouche et le tube digestif.",
      "Pulpe consommable crue quand elle est bien mûre, ou en infusion (filtrer soigneusement les poils)."
    ]
  },
  {
    id: "prunellier", cat: "plante", nom: "Prunellier", latin: "Prunus spinosa",
    niveau: "caution", statut: "Comestible, préparation", saison: "Oct. → déc.",
    resume: "Petites prunes bleu-noir très âpres, adoucies par le gel. Noyaux à ne pas croquer.",
    identification: [
      "Arbuste très épineux (épines longues et dures sur les rameaux)",
      "Fruits ronds bleu-noir de 1 cm, couverts d'une pellicule cireuse",
      "Pousse en haies et lisières"
    ],
    sosies: [
      { nom: "Troène (Ligustrum vulgare)", latin: "Ligustrum vulgare", niveau: "danger",
        diff: "Baies noires luisantes en grappes, sans pellicule bleutée, sur un arbuste sans épines." }
    ],
    usages: [
      "Cueillir après une gelée (ou passer au congélateur) : l'astringence diminue.",
      "Ne pas croquer ni avaler les noyaux en quantité (composés cyanogènes)."
    ]
  },
  {
    id: "aubepine", cat: "plante", nom: "Aubépine (cenelle)", latin: "Crataegus monogyna",
    niveau: "caution", statut: "Pulpe comestible", saison: "Sept. → nov.",
    resume: "Petites baies rouges farineuses, très courantes en lisière.",
    identification: [
      "Arbuste épineux, feuilles profondément découpées en 3 à 7 lobes",
      "Baies rouges ovales de 1 cm, en bouquets, 1 seul noyau dur"
    ],
    sosies: [
      { nom: "Baies rouges toxiques (if, douce-amère, houx)", niveau: "danger",
        diff: "Vérifier les feuilles lobées et les épines de l'aubépine. Pas de feuilles lobées = pas d'aubépine." }
    ],
    usages: [
      "Pulpe crue ou cuite, goût farineux légèrement sucré.",
      "Recracher le noyau."
    ]
  },
  {
    id: "sorbier", cat: "plante", nom: "Sorbier des oiseleurs", latin: "Sorbus aucuparia",
    niveau: "caution", statut: "Comestible cuit uniquement", saison: "Sept. → nov.",
    resume: "Grappes de baies orange vif. Crues, elles irritent l'estomac : toujours cuire.",
    identification: [
      "Petit arbre, feuilles composées de 11 à 15 folioles dentées",
      "Larges grappes de petites baies orange-rouge (environ 1 cm)"
    ],
    sosies: [],
    usages: [
      "Cuire (bouillir) avant consommation : la cuisson détruit l'acide parasorbique irritant.",
      "Goût amer : plutôt en compote ou mélangé."
    ]
  },
  {
    id: "gland", cat: "plante", nom: "Gland (chêne)", latin: "Quercus robur / petraea",
    niveau: "caution", statut: "Après lessivage", saison: "Sept. → nov.",
    resume: "Calorique et abondant, mais chargé de tanins : immangeable sans préparation longue.",
    identification: [
      "Feuilles à lobes arrondis",
      "Fruit brun lisse dans une cupule écailleuse"
    ],
    sosies: [],
    usages: [
      "Décortiquer, concasser, puis faire tremper et changer l'eau plusieurs fois (ou bouillir en renouvelant l'eau) jusqu'à disparition de l'amertume.",
      "Technique de survie longue : rarement utile sur un bivouac court."
    ]
  },
  {
    id: "ortie", cat: "plante", nom: "Ortie dioïque", latin: "Urtica dioica",
    niveau: "ok", statut: "Comestible cuite", saison: "Toute l'année (jeunes pousses)",
    resume: "Très nutritive. Les poils urticants disparaissent à la cuisson.",
    identification: [
      "Tige carrée couverte de poils urticants",
      "Feuilles opposées, en cœur allongé, bordées de grosses dents"
    ],
    sosies: [
      { nom: "Lamier blanc", latin: "Lamium album", niveau: "ok",
        diff: "Ressemble à l'ortie mais ne pique pas. Comestible aussi." }
    ],
    usages: [
      "Cueillir les feuilles du haut avec des gants ou en pinçant fermement.",
      "En soupe ou blanchie 1–2 min."
    ]
  },
  {
    id: "pissenlit", cat: "plante", nom: "Pissenlit", latin: "Taraxacum officinale",
    niveau: "ok", statut: "Comestible", saison: "Toute l'année",
    resume: "Rosette de feuilles dentées : feuilles et racines comestibles.",
    identification: [
      "Rosette au ras du sol, feuilles profondément dentées",
      "Latex blanc quand on casse la feuille ou la tige florale",
      "Une seule fleur jaune par tige creuse"
    ],
    sosies: [],
    usages: [
      "Jeunes feuilles en salade (amères en hiver), racine grillée.",
      "Laver soigneusement ce qui pousse au ras du sol (voir Renard)."
    ]
  },

  // ---------- PLANTES TOXIQUES ----------
  {
    id: "oenanthe", cat: "toxique", nom: "Œnanthe safranée", latin: "Oenanthe crocata",
    niveau: "danger", statut: "Mortelle", saison: "Toute l'année",
    resume: "L'une des plantes les plus toxiques d'Europe. Pousse au bord de l'eau : attention le long de l'Ourthe.",
    identification: [
      "Grande ombellifère des berges et fossés humides",
      "Racines en fuseaux charnus, sève qui jaunit à l'air",
      "Fleurs blanches en ombelles"
    ],
    sosies: [
      { nom: "Carotte sauvage, panais, céleri sauvage", latin: "Daucus carota", niveau: "danger",
        diff: "Règle simple : ne jamais consommer une ombellifère sauvage (fleurs en ombrelle) sans être expert. Plusieurs sont mortelles." }
    ],
    usages: ["Ne pas toucher à mains nues si possible, ne rien consommer."]
  },
  {
    id: "if", cat: "toxique", nom: "If", latin: "Taxus baccata",
    niveau: "danger", statut: "Mortel", saison: "Toute l'année",
    resume: "Conifère aux baies rouges en forme de coupelle. Graine et feuillage très toxiques.",
    identification: [
      "Aiguilles plates, vert sombre, sans odeur résineuse",
      "« Baie » rouge ouverte en forme de coupelle avec une graine sombre au centre"
    ],
    sosies: [],
    usages: ["Ne rien consommer. Ne pas utiliser son bois pour embrocher de la nourriture."]
  },
  {
    id: "digitale", cat: "toxique", nom: "Digitale pourpre", latin: "Digitalis purpurea",
    niveau: "danger", statut: "Très toxique", saison: "Rosettes en hiver",
    resume: "Fréquente dans les coupes forestières ardennaises. Toute la plante est toxique pour le cœur.",
    identification: [
      "En hiver : rosette de grandes feuilles ovales, douces et duveteuses, nervures marquées",
      "En été : hampe de fleurs pourpres en clochettes"
    ],
    sosies: [
      { nom: "Consoude, bouillon-blanc (rosettes)", niveau: "caution",
        diff: "Les rosettes se ressemblent : ne consommer aucune rosette duveteuse non identifiée avec certitude." }
    ],
    usages: ["Ne rien consommer."]
  },
  {
    id: "douceamere", cat: "toxique", nom: "Douce-amère", latin: "Solanum dulcamara",
    niveau: "danger", statut: "Toxique", saison: "Baies jusqu'en hiver",
    resume: "Liane des haies humides et berges aux baies rouges brillantes, attirantes et toxiques.",
    identification: [
      "Tige grimpante, souvent au bord de l'eau",
      "Baies ovales rouge vif, luisantes, en grappes pendantes"
    ],
    sosies: [],
    usages: ["Ne rien consommer."]
  },

  // ---------- CHAMPIGNONS ----------
  {
    id: "phalloide", cat: "champignon", nom: "Amanite phalloïde", latin: "Amanita phalloides",
    niveau: "danger", statut: "Mortelle", saison: "Juil. → nov.",
    resume: "Responsable de la majorité des intoxications mortelles. Les symptômes arrivent tard, quand le foie est déjà atteint.",
    identification: [
      "Chapeau vert-olive à jaunâtre, parfois blanc, lisse",
      "Lames blanches, anneau sur le pied",
      "Volve blanche en sac à la base (souvent enterrée : dégager le pied)"
    ],
    sosies: [
      { nom: "Rosé des prés, russules vertes, tricholomes", niveau: "danger",
        diff: "Ne JAMAIS consommer un champignon identifié par photo ou par appli. Le faire vérifier par un mycologue ou un cercle de mycologie." }
    ],
    usages: ["Ne rien consommer. Se laver les mains après manipulation."]
  },
  {
    id: "tuemouches", cat: "champignon", nom: "Amanite tue-mouches", latin: "Amanita muscaria",
    niveau: "danger", statut: "Toxique", saison: "Août → nov.",
    resume: "Le champignon rouge à points blancs des contes. Fréquent sous bouleaux et épicéas.",
    identification: [
      "Chapeau rouge vif à orange, couvert de flocons blancs (qui peuvent partir à la pluie)",
      "Lames et pied blancs, anneau, base bulbeuse"
    ],
    sosies: [
      { nom: "Amanite des Césars (absente en Belgique)", latin: "Amanita caesarea", niveau: "caution",
        diff: "Lames et pied jaunes. Ne pas tenter de distinguer soi-même." }
    ],
    usages: ["Ne rien consommer."]
  },
  {
    id: "galere", cat: "champignon", nom: "Galère marginée", latin: "Galerina marginata",
    niveau: "danger", statut: "Mortelle", saison: "Toute l'année, surtout en automne",
    resume: "Petit champignon brun sur bois mort, contient les mêmes toxines que l'amanite phalloïde.",
    identification: [
      "Petits chapeaux bruns à fauves, en touffes sur souches",
      "Petit anneau fragile sur le pied"
    ],
    sosies: [
      { nom: "Pholiote changeante (comestible)", latin: "Kuehneromyces mutabilis", niveau: "danger",
        diff: "Confusion classique et mortelle, même pour des cueilleurs expérimentés." }
    ],
    usages: ["Ne rien consommer."]
  },
  {
    id: "cepe", cat: "champignon", nom: "Cèpe de Bordeaux", latin: "Boletus edulis",
    niveau: "caution", statut: "Comestible · faire vérifier", saison: "Août → nov.",
    resume: "Le célèbre bolet. Comestible, mais seule la vérification par un expert autorise la consommation.",
    identification: [
      "Chapeau brun, comme un petit pain",
      "Dessous en éponge (tubes) blanc puis jaune-vert, ne bleuit pas",
      "Pied ventru avec un fin réseau blanc en relief en haut"
    ],
    sosies: [
      { nom: "Bolet amer (Tylopilus felleus)", latin: "Tylopilus felleus", niveau: "caution",
        diff: "Tubes qui deviennent roses, réseau sombre sur le pied, goût très amer." },
      { nom: "Bolets à pores rouges", niveau: "danger",
        diff: "Pores rouges ou orangés, chair qui bleuit : à écarter." }
    ],
    usages: ["Faire vérifier toute cueillette par un mycologue avant consommation."]
  },

  // ---------- FAUNE ----------
  {
    id: "sanglier", cat: "animal", nom: "Sanglier", latin: "Sus scrofa",
    niveau: "info", statut: "Prudence", saison: "Toute l'année · chasse en automne",
    resume: "Très présent dans les Ardennes. Évite l'humain, sauf laie avec marcassins ou animal blessé.",
    identification: [
      "Traces : sabots à 2 doigts avec 2 ergots marqués derrière",
      "Sol retourné (boutis), souilles boueuses, arbres frottés"
    ],
    sosies: [],
    usages: [
      "Ne pas laisser de nourriture accessible la nuit (suspendre ou ranger dans la tente fermée).",
      "En automne, battues de chasse fréquentes : respecter les panneaux « Chasse en cours » et les chemins."
    ]
  },
  {
    id: "cerf", cat: "animal", nom: "Cerf élaphe", latin: "Cervus elaphus",
    niveau: "info", statut: "Observation", saison: "Toute l'année",
    resume: "Le brame vient de se terminer. Observation à l'aube et au crépuscule en lisière.",
    identification: [
      "Traces : sabot fendu en cœur allongé, 6–9 cm",
      "Frottis sur les jeunes arbres, écorce arrachée"
    ],
    sosies: [],
    usages: ["Garder ses distances, ne jamais nourrir."]
  },
  {
    id: "renard", cat: "animal", nom: "Renard roux", latin: "Vulpes vulpes",
    niveau: "info", statut: "Risque sanitaire", saison: "Toute l'année",
    resume: "Peut transmettre un parasite grave (échinococcose) via ses excréments sur les végétaux bas.",
    identification: [
      "Traces : 4 doigts, empreinte ovale et étroite, en ligne droite",
      "Crottes torsadées, souvent posées en évidence sur une pierre"
    ],
    sosies: [],
    usages: ["Cuire ou laver soigneusement tout ce qui est cueilli au ras du sol (baies, feuilles, champignons)."]
  },
  {
    id: "tique", cat: "animal", nom: "Tique", latin: "Ixodes ricinus",
    niveau: "caution", statut: "Maladie de Lyme", saison: "Active au-dessus d'environ 7 °C",
    resume: "Moins active en novembre, mais un redoux suffit. Inspection obligatoire après la sortie.",
    identification: ["Petit acarien brun-noir, dans les herbes hautes et fougères"],
    sosies: [],
    usages: [
      "Pantalon dans les chaussettes, vêtements clairs.",
      "Retirer avec un tire-tique en tournant, désinfecter, noter la date. Consulter si une rougeur s'étend."
    ]
  },
  {
    id: "castor", cat: "animal", nom: "Castor d'Europe", latin: "Castor fiber",
    niveau: "info", statut: "Observation", saison: "Toute l'année",
    resume: "Revenu dans les vallées ardennaises. Discret, actif au crépuscule le long de l'eau.",
    identification: [
      "Arbres rongés en forme de crayon taillé au bord de l'eau",
      "Copeaux de bois, coulées vers la rivière"
    ],
    sosies: [],
    usages: ["Espèce protégée : observer sans déranger, ne pas toucher aux barrages."]
  }
];

// ---------- TECHNIQUES ----------
// Sources principales : manuel de survie de l'armée américaine FM 21-76 / FM 3-05.70
// (domaine public), recommandations OMS sur l'ébullition, revue medRxiv 2025 sur
// l'approvisionnement en eau improvisé, réglementation forestière wallonne.
var SRC_FM = "Manuel de survie de l'armée américaine FM 21-76 / FM 3-05.70 (domaine public)";
var SRC_EAU = "OMS ; revue « Improvised Water Procurement in Wilderness Medicine » (medRxiv, 2025)";

window.SYLVA_CATEGORIES = ["Priorités", "Eau", "Feu", "Abri", "Nœuds", "Orientation", "Secours", "Nourriture", "Éthique"];

window.SYLVA_TECHNIQUES = [
  // ===== PRIORITÉS =====
  {
    id: "priorites", cat: "Priorités", titre: "La règle des 3", illus: "priorites",
    intro: "Un repère simple pour savoir quoi faire en premier quand ça tourne mal.",
    etapes: [
      "3 minutes sans air : dégager les voies respiratoires, arrêter une hémorragie, c'est la priorité absolue.",
      "3 heures sans abri par froid humide ou forte chaleur : se protéger avant de chercher à manger.",
      "3 jours sans eau : trouver et rendre l'eau potable vient ensuite.",
      "3 semaines sans nourriture : sur un bivouac de quelques jours, la nourriture n'est jamais l'urgence.",
      "Garder la tête froide : s'arrêter, réfléchir, observer, planifier (le « STOP » des manuels de survie)."
    ],
    attention: ["Ces durées sont des ordres de grandeur, pas des limites à tester."],
    source: SRC_FM
  },

  // ===== EAU =====
  {
    id: "eau", cat: "Eau", titre: "Rendre l'eau potable", illus: "eau_ebullition", priorite: true,
    intro: "Même claire, l'eau de l'Ourthe peut contenir bactéries et parasites (élevages et villages en amont). L'ébullition est la seule méthode improvisée vraiment sûre.",
    etapes: [
      "Préfiltrer à travers un tissu propre pour retirer les particules.",
      "Porter à gros bouillons pendant 1 minute (3 minutes au-dessus de 2 000 m).",
      "Laisser refroidir à couvert, dans un récipient propre.",
      "À défaut de feu : filtre de randonnée certifié ou pastilles de purification, en respectant le temps d'attente indiqué.",
      "Puiser en amont du campement, loin des pâtures et des eaux stagnantes."
    ],
    attention: ["L'ébullition ne retire pas les polluants chimiques : éviter l'eau près des champs traités, routes ou sites industriels."],
    source: SRC_EAU
  },
  {
    id: "filtre", cat: "Eau", titre: "Filtre improvisé (sable et charbon)", illus: "eau_filtre",
    intro: "Clarifie une eau trouble avant de la faire bouillir. Ne la rend PAS potable à lui seul.",
    etapes: [
      "Couper le fond d'une bouteille plastique et la retourner, bouchon légèrement dévissé ou percé.",
      "Empiler de bas en haut : charbon de bois écrasé (du feu de la veille, sans cendres), sable fin, gravier, puis tissu ou herbes.",
      "Verser l'eau lentement par le haut et jeter les premiers passages, souvent encore troubles.",
      "Faire bouillir l'eau filtrée 1 minute avant de la boire."
    ],
    attention: ["Aucune étude ne montre qu'un filtre artisanal élimine les microbes : toujours bouillir après."],
    source: SRC_EAU
  },
  {
    id: "pluie", cat: "Eau", titre: "Récupérer l'eau de pluie", illus: "eau_pluie",
    intro: "La meilleure source improvisée : quelques litres par averse pour très peu d'effort.",
    etapes: [
      "Tendre une bâche, un poncho ou une couverture de survie en pente vers un point bas.",
      "Placer un récipient propre sous ce point bas (gourde, casserole, sac étanche).",
      "Laisser la première pluie rincer la bâche avant de récolter.",
      "Stocker à l'abri et faire bouillir si l'eau a stagné ou touché des feuilles."
    ],
    attention: [],
    source: SRC_EAU
  },
  {
    id: "transpiration", cat: "Eau", titre: "Sac de transpiration", illus: "eau_transpiration",
    intro: "Un sac plastique transparent sur une branche feuillue récupère l'eau que la plante évapore. Utile au soleil, faible en novembre.",
    etapes: [
      "Choisir une branche feuillue d'un arbre ou arbuste NON toxique, bien exposée au soleil.",
      "Enfiler un sac plastique transparent dessus et le fermer hermétiquement autour de la branche.",
      "Laisser pendre un coin du sac vers le bas, avec un petit caillou dedans pour créer un point bas.",
      "Récolter en fin de journée en perçant le coin ou en ouvrant le sac, puis changer de branche."
    ],
    attention: ["Rendement de quelques décilitres à 1 litre par jour, et seulement par beau temps.", "Jamais sur if, digitale, douce-amère ou une plante non identifiée."],
    source: SRC_FM + " ; " + SRC_EAU
  },
  {
    id: "rosee", cat: "Eau", titre: "Collecter la rosée", illus: "eau_rosee",
    intro: "Un complément d'appoint, au petit matin, quand l'herbe est trempée.",
    etapes: [
      "Juste avant le lever du soleil, nouer un tissu absorbant (t-shirt, chiffon) autour des chevilles ou le tenir à la main.",
      "Marcher ou le traîner dans les herbes hautes mouillées.",
      "Essorer régulièrement dans un récipient.",
      "Faire bouillir avant de boire."
    ],
    attention: ["Rendement très faible (de l'ordre d'un verre) : ne jamais compter dessus comme source principale."],
    source: SRC_EAU
  },

  // ===== FEU =====
  {
    id: "feu", cat: "Feu", titre: "Préparer son feu", illus: "feu_preparation",
    intro: "90 % des feux ratés le sont par manque de préparation. En Wallonie, feu interdit en forêt sauf aux emplacements prévus : vérifier les règles de l'aire.",
    etapes: [
      "Choisir un emplacement autorisé, à l'abri du vent, dégagé de feuilles et loin des racines et branches basses.",
      "Ramasser une grosse poignée d'amadou : écorce de bouleau (brûle même humide), herbes sèches, aiguilles mortes, copeaux fins.",
      "Préparer le petit bois en dégradé, de l'épaisseur d'une allumette à celle d'un pouce.",
      "Prévoir le bois de chauffe (épaisseur d'un poignet), uniquement du bois mort ramassé au sol.",
      "Rassembler deux fois plus de chaque catégorie que ce qui semble nécessaire, AVANT d'allumer."
    ],
    attention: ["Ne jamais couper de branches vivantes : elles ne brûlent pas et c'est interdit."],
    source: SRC_FM
  },
  {
    id: "tipi", cat: "Feu", titre: "Feu en tipi", illus: "feu_tipi",
    intro: "La structure la plus simple pour démarrer : la flamme monte et attrape le bois du dessus.",
    etapes: [
      "Déposer l'amadou en boule au centre.",
      "Dresser le petit bois le plus fin en cône autour, en laissant une ouverture côté vent.",
      "Allumer l'amadou par l'ouverture, au ras du sol.",
      "Souffler doucement à la base quand les flammes prennent.",
      "Ajouter du bois de plus en plus gros sans écraser la structure."
    ],
    attention: [],
    source: SRC_FM
  },
  {
    id: "cabane", cat: "Feu", titre: "Feu en cabane (rondins croisés)", illus: "feu_cabane",
    intro: "Brûle longtemps et donne un beau lit de braises, idéal pour cuisiner.",
    etapes: [
      "Démarrer un petit tipi au centre.",
      "Poser deux bûches parallèles de chaque côté, puis deux autres en travers par-dessus, comme une cabane en rondins.",
      "Monter 3 à 5 étages en réduisant légèrement la taille vers le haut.",
      "Laisser le feu s'effondrer en braises avant de poser la casserole."
    ],
    attention: [],
    source: SRC_FM
  },
  {
    id: "ferro", cat: "Feu", titre: "Allumer au ferrocérium", illus: "feu_ferro",
    intro: "La pierre à feu fonctionne mouillée, par grand froid et des milliers de fois. À mettre dans tout sac de bivouac.",
    etapes: [
      "Préparer un nid d'amadou très fin et sec (écorce de bouleau râpée, coton, copeaux).",
      "Poser la pointe de la tige DANS l'amadou, le racleur appuyé à environ 45°.",
      "Tirer la tige vers soi plutôt que de pousser le racleur : on ne disperse pas le nid.",
      "Répéter fermement jusqu'à ce que les étincelles prennent, puis souffler doucement."
    ],
    attention: ["Les étincelles dépassent 3 000 °C : garder doigts et vêtements synthétiques à distance."],
    source: SRC_FM
  },
  {
    id: "feupluie", cat: "Feu", titre: "Faire du feu sous la pluie", illus: "feu_pluie",
    intro: "En Ardenne en novembre, tout est mouillé. Il faut chercher le sec là où il se cache.",
    etapes: [
      "Récolter les brindilles mortes encore sur pied, en bas des épicéas : elles restent sèches sous la ramure.",
      "Prélever l'écorce de bouleau sur des arbres morts ou au sol.",
      "Fendre les morceaux de bois mort : le cœur reste sec même quand l'extérieur est trempé.",
      "Monter une plateforme de bâtons sur le sol mouillé et allumer dessus.",
      "Abriter le départ de feu avec son corps ou une bâche haute, jamais à ras des flammes."
    ],
    attention: ["Ne jamais faire de feu sous une tente ou une bâche fermée : risque d'incendie et de monoxyde de carbone."],
    source: SRC_FM
  },

  // ===== ABRI =====
  {
    id: "froid", cat: "Abri", titre: "Prévenir l'hypothermie", illus: "froid", priorite: true,
    intro: "Novembre en Ardenne : nuits proches de 0 °C et humidité. Le froid humide est le vrai danger du bivouac.",
    etapes: [
      "Rester au sec : se changer avant d'avoir froid, garder une tenue sèche réservée à la nuit.",
      "Système en couches : base respirante (pas de coton), couche chaude, coque imperméable.",
      "Isoler du sol : au repos, on y perd une grande partie de sa chaleur. Un bon matelas compte autant que le sac de couchage.",
      "Manger et boire chaud avant de dormir.",
      "Signes d'alerte : frissons incontrôlables, gestes maladroits, confusion. Réchauffer la personne et appeler le 112 si ça s'aggrave."
    ],
    attention: ["Une personne qui arrête de frissonner alors qu'elle a toujours froid est en danger : appeler les secours."],
    source: SRC_FM
  },
  {
    id: "abri", cat: "Abri", titre: "Choisir son emplacement", illus: "abri_emplacement",
    intro: "Un bon emplacement fait la moitié d'une bonne nuit.",
    etapes: [
      "Uniquement sur une aire de bivouac autorisée ou un terrain privé avec accord (voir onglet Carte).",
      "Lever les yeux : aucune branche morte ni arbre mort au-dessus.",
      "Éviter le fond de vallée et le bord immédiat de la rivière : air froid, humidité, montée des eaux possible.",
      "Chercher un replat sec, légèrement surélevé, proche du bois mort et de l'eau.",
      "Orienter l'entrée de l'abri dos au vent dominant."
    ],
    attention: [],
    source: SRC_FM
  },
  {
    id: "bache", cat: "Abri", titre: "Abri en A avec une bâche", illus: "abri_bache",
    intro: "Le plus rapide avec du matériel : une bâche de 3 × 3 m et 10 m de cordelette.",
    etapes: [
      "Tendre une corde entre deux arbres, à hauteur de hanche à épaule selon la météo (plus bas = plus chaud).",
      "Poser la bâche à cheval sur la corde.",
      "Piqueter les quatre coins au sol, côtés bien tendus pour que la pluie ruisselle.",
      "Garnir le sol de feuilles sèches ou d'aiguilles sous le matelas."
    ],
    attention: ["Nouer un petit bout de ficelle sur la corde de chaque côté : l'eau y goutte au lieu de couler dans l'abri."],
    source: SRC_FM
  },
  {
    id: "appentis", cat: "Abri", titre: "Appentis en branchages", illus: "abri_appentis",
    intro: "Un toit incliné ouvert d'un côté, efficace avec un feu réfléchi devant (là où le feu est autorisé).",
    etapes: [
      "Caler une perche faîtière solide entre deux arbres, à hauteur de poitrine.",
      "Appuyer des perches dessus, côté vent, à environ 45°, espacées de 30 cm.",
      "Entrelacer des branches souples en travers pour former une grille.",
      "Couvrir de branchages feuillus, fougères ou feuilles, du bas vers le haut comme des tuiles.",
      "Isoler le sol avec une épaisse couche de feuilles sèches."
    ],
    attention: ["Uniquement avec du bois mort et sur un terrain où c'est permis."],
    source: SRC_FM
  },
  {
    id: "debris", cat: "Abri", titre: "Hutte de débris", illus: "abri_debris",
    intro: "L'abri de survie sans matériel le plus chaud : un sac de couchage géant en feuilles mortes.",
    etapes: [
      "Trouver une perche faîtière d'environ 1,5 fois ta taille.",
      "Poser une extrémité sur une souche ou un trépied à hauteur de genou, l'autre au sol.",
      "Allonger des branches le long des deux côtés, serrées, pour former des côtes.",
      "Couvrir de petits branchages puis d'une couche de feuilles mortes de 60 cm à 1 m d'épaisseur (la longueur d'un bras).",
      "Remplir l'intérieur de feuilles sèches, entrer pieds devant et boucher l'entrée avec un tas de feuilles."
    ],
    attention: ["L'intérieur doit être juste assez grand pour toi : plus c'est petit, plus c'est chaud."],
    source: SRC_FM
  },

  // ===== ORIENTATION =====
  {
    id: "orientation", cat: "Orientation", titre: "S'orienter sans réseau", illus: "orient_montre",
    intro: "La vallée de l'Ourthe est sinueuse et le réseau mobile y est irrégulier.",
    etapes: [
      "Avant de partir : repérer l'itinéraire et l'afficher dans l'onglet Carte pour le garder en cache.",
      "Suivre la rivière vers l'aval mène tôt ou tard à un village (La Roche-en-Ardenne vers le nord-ouest depuis Nisramont).",
      "En novembre, le soleil est plein sud vers 12 h 30 (heure belge).",
      "Avec une montre à aiguilles : pointer la petite aiguille vers le soleil. Le sud est à mi-chemin entre elle et le 12 (le 1 en heure d'été)."
    ],
    attention: [],
    source: SRC_FM
  },
  {
    id: "baton", cat: "Orientation", titre: "Méthode du bâton et de l'ombre", illus: "orient_baton",
    intro: "Trouver l'est et l'ouest avec un simple bâton, dès qu'il y a un peu de soleil.",
    etapes: [
      "Planter un bâton bien droit sur un sol plat.",
      "Marquer l'extrémité de son ombre avec un caillou : c'est l'OUEST.",
      "Attendre 15 minutes et marquer la nouvelle extrémité de l'ombre : c'est l'EST.",
      "La ligne entre les deux repères va d'ouest en est. Une perpendiculaire donne le nord et le sud."
    ],
    attention: [],
    source: SRC_FM
  },
  {
    id: "polaire", cat: "Orientation", titre: "Trouver le nord la nuit", illus: "orient_polaire",
    intro: "L'étoile polaire indique le nord à environ 1° près, toute l'année dans l'hémisphère nord.",
    etapes: [
      "Repérer la Grande Ourse, la « casserole » de 7 étoiles brillantes.",
      "Prendre les deux étoiles du bord de la casserole, à l'opposé du manche.",
      "Prolonger leur alignement d'environ 5 fois leur écartement.",
      "L'étoile assez brillante et isolée qui s'y trouve est la Polaire : elle indique le nord."
    ],
    attention: [],
    source: SRC_FM
  },

  // ===== SECOURS =====
  {
    id: "urgence", cat: "Secours", titre: "Urgence et secours", illus: "urgence",
    intro: "Le 112 passe par n'importe quel réseau mobile disponible, même si ce n'est pas celui de votre opérateur.",
    etapes: [
      "Appeler le 112 et donner vos coordonnées GPS (bouton SOS en haut de l'appli).",
      "Si l'appel ne passe pas, envoyer un SMS à un proche avec la position, puis monter sur une hauteur pour chercher du réseau.",
      "Rester sur place si quelqu'un sait où vous êtes : on retrouve plus vite une personne immobile.",
      "Toujours prévenir quelqu'un de son itinéraire et de son heure de retour avant de partir."
    ],
    attention: [],
    source: SRC_FM
  },
  {
    id: "signaux", cat: "Secours", titre: "Signaux de détresse", illus: "secours_signaux",
    intro: "Tout ce qui se répète par trois signifie « détresse », partout dans le monde.",
    etapes: [
      "Sifflet : 3 coups longs, une pause, et recommencer. Il porte bien plus loin que la voix et fatigue moins.",
      "Lampe : 3 éclats répétés, ou SOS (3 courts, 3 longs, 3 courts).",
      "Feux : 3 feux en triangle espacés d'une trentaine de mètres, dans une clairière visible du ciel (si la situation l'exige).",
      "Au sol, symboles de 3 m de haut en branches ou pierres : V = besoin d'aide, X = besoin d'assistance médicale.",
      "Porter une couleur vive et l'étendre dans un endroit dégagé."
    ],
    attention: ["En montagne, le signal alpin de détresse est de 6 signaux par minute, puis une minute de pause."],
    source: SRC_FM
  },

  // ===== NOURRITURE =====
  {
    id: "piege", cat: "Nourriture", titre: "Pièges de survie : ce qu'il faut savoir", illus: "piege_4",
    intro: "Les manuels militaires décrivent collets et assommoirs (comme le piège en « 4 »). En Belgique comme en France, les poser est du braconnage, sauf en cas de détresse vitale réelle.",
    etapes: [
      "Sur un bivouac de quelques jours, la nourriture n'est jamais la priorité : emporter ses vivres.",
      "En vraie situation de détresse, privilégier ce qui demande peu d'énergie : cueillette identifiée avec certitude (onglet Espèces).",
      "Les pièges ne fonctionnent qu'en multipliant les postes sur des coulées actives (passages, traces, crottes) et en les relevant souvent.",
      "Un piège oublié continue de tuer : en situation réelle, les démonter tous avant de partir."
    ],
    attention: ["Interdit hors détresse vitale : amende et poursuites pour braconnage.", "La pêche demande un permis de pêche en Wallonie."],
    source: SRC_FM
  },

  // ===== ÉTHIQUE =====
  {
    id: "traces", cat: "Éthique", titre: "Ne laisser aucune trace", illus: "traces",
    intro: "C'est ce qui permet aux aires de bivouac de rester ouvertes.",
    etapes: [
      "Remporter tous ses déchets, y compris organiques et papier toilette.",
      "Besoins : à plus de 50 m de l'eau, dans un trou de 15 cm rebouché.",
      "Pas de savon dans la rivière, même biodégradable.",
      "Arriver tard, partir tôt, rester discret, laisser le lieu plus propre qu'à l'arrivée."
    ],
    attention: [],
    source: "Principes « Leave No Trace »"
  }
];

// ---------- NŒUDS ----------
// Photos : article Wikipédia (anglais) du nœud, image sous licence libre.
var SRC_NOEUDS = "The Ashley Book of Knots ; manuels scouts ; " + SRC_FM;
[
  {
    id: "chaise", titre: "Nœud de chaise", wiki: "Bowline",
    intro: "LA boucle fixe : elle ne coulisse pas et se défait facilement après charge. Pour attacher une corde à un arbre ou faire une boucle de sauvetage autour de la taille.",
    etapes: [
      "Faire une petite boucle sur la partie dormante (le « terrier »), le brin libre passant par-dessus.",
      "Passer le brin libre dans la petite boucle par en dessous : « le lapin sort du terrier ».",
      "Le faire passer derrière la partie dormante : « il fait le tour de l'arbre ».",
      "Le redescendre dans la petite boucle : « il rentre dans le terrier ».",
      "Serrer en tenant le brin libre et la grande boucle, puis tirer la partie dormante. Laisser une queue d'au moins 10 cm."
    ],
    attention: ["Peut se desserrer s'il n'est pas chargé : bloquer la queue avec une demi-clé."]
  },
  {
    id: "tendeur", titre: "Nœud tendeur", wiki: "Taut-line hitch",
    intro: "Le nœud des haubans : il coulisse pour régler la tension et bloque sous charge. Idéal pour tendre une bâche ou une tente.",
    etapes: [
      "Passer la corde autour du piquet ou de l'arbre.",
      "Avec le brin libre, faire deux tours autour de la partie tendue, en allant vers le piquet (à l'intérieur de la boucle).",
      "Faire un troisième tour autour de la partie tendue, cette fois à l'extérieur des deux premiers.",
      "Serrer : faire glisser le nœud pour tendre ou détendre."
    ],
    attention: ["Sur cordelette très glissante (dyneema), ajouter un tour de plus à l'intérieur."]
  },
  {
    id: "cabestan", titre: "Nœud de cabestan", wiki: "Clove hitch",
    intro: "Rapide pour fixer une corde sur une perche ou un piquet, et point de départ de tous les brêlages.",
    etapes: [
      "Faire un tour complet autour de la perche.",
      "Croiser par-dessus la partie dormante et faire un second tour à côté du premier.",
      "Glisser le brin libre sous ce second tour, entre la perche et la corde.",
      "Serrer en tirant les deux brins en sens opposés."
    ],
    attention: ["Peut glisser si le support tourne : ajouter une demi-clé par sécurité."]
  },
  {
    id: "tourmort", titre: "Tour mort et deux demi-clés", wiki: "Round turn and two half-hitches",
    intro: "Amarre solide d'une corde sur un arbre, facile à défaire même après une forte charge. Parfait pour une ligne faîtière.",
    etapes: [
      "Faire deux tours complets autour de l'arbre (le « tour mort » absorbe l'effort).",
      "Faire une demi-clé autour de la partie tendue.",
      "Faire une seconde demi-clé dans le même sens que la première.",
      "Pousser les clés contre le tour mort et serrer."
    ],
    attention: []
  },
  {
    id: "camionneur", titre: "Nœud de camionneur", wiki: "Trucker's hitch",
    intro: "Une poulie improvisée qui double la force : pour tendre une ligne faîtière comme une corde de guitare.",
    etapes: [
      "Attacher une extrémité au premier arbre (tour mort et deux demi-clés).",
      "Vers le second arbre, former une boucle fixe dans la corde (huit en boucle ou boucle coulissante bloquée) : c'est la « poulie ».",
      "Passer le brin libre autour du second arbre, revenir et le passer dans la boucle.",
      "Tirer le brin libre vers l'arbre : la tension augmente fortement.",
      "Bloquer avec deux demi-clés juste sous la boucle."
    ],
    attention: ["Ne pas surtendre sur une branche fragile ou un arbre mort."]
  },
  {
    id: "huit", titre: "Nœud de huit", wiki: "Figure-eight knot",
    intro: "Le nœud d'arrêt de référence en bout de corde, et, fait sur une corde doublée, une boucle fixe très sûre (huit en boucle).",
    etapes: [
      "Faire une boucle avec le brin libre.",
      "Faire passer le brin libre autour de la partie dormante.",
      "Le glisser dans la boucle par le dessus : la corde dessine un « 8 ».",
      "Serrer. Pour une boucle : doubler la corde et faire exactement le même nœud avec le double."
    ],
    attention: []
  },
  {
    id: "plat", titre: "Nœud plat", wiki: "Reef knot",
    intro: "Pour nouer les deux bouts d'un bandage, d'un sac ou d'un fagot. Pas pour relier deux cordes qui portent une charge.",
    etapes: [
      "Croiser le bout gauche par-dessus le droit et le passer dessous (premier nœud simple).",
      "Croiser le bout droit par-dessus le gauche et le passer dessous (second nœud).",
      "Vérifier que chaque bout ressort du même côté que sa propre corde : le nœud est plat et symétrique.",
      "Serrer."
    ],
    attention: ["Si les bouts ressortent en biais, c'est un « nœud de vache » qui glisse : le refaire.", "Jamais pour l'escalade ou le sauvetage."]
  },
  {
    id: "ecoute", titre: "Nœud d'écoute", wiki: "Sheet bend",
    intro: "Relie deux cordes, même de diamètres différents. Pour rallonger une corde trop courte.",
    etapes: [
      "Former un U (une ganse) avec le bout de la corde la plus épaisse.",
      "Passer le bout de la corde fine dans le U, par en dessous.",
      "Lui faire faire le tour derrière les deux brins du U.",
      "Le repasser sous lui-même, sans traverser le U.",
      "Serrer : les deux bouts libres doivent ressortir du même côté."
    ],
    attention: ["Pour plus de sécurité, faire deux tours au lieu d'un : nœud d'écoute double."]
  },
  {
    id: "pecheur", titre: "Double nœud de pêcheur", wiki: "Double fisherman's knot",
    intro: "Relie solidement deux cordes, ou ferme une cordelette en anneau (pour un Prusik). Ne se défait pas tout seul.",
    etapes: [
      "Superposer les deux bouts côte à côte, en sens opposés.",
      "Avec le premier bout, faire deux tours autour des deux cordes en revenant vers soi, puis le passer dans ces deux tours.",
      "Faire la même chose avec le second bout, dans l'autre sens.",
      "Tirer sur les deux cordes : les deux nœuds glissent et se bloquent l'un contre l'autre."
    ],
    attention: ["Très difficile à défaire après une forte charge."]
  },
  {
    id: "prusik", titre: "Nœud de Prusik", wiki: "Prusik",
    intro: "Un anneau de cordelette qui coulisse à la main sur une corde et bloque sous charge. Pour tendre une bâche sur une faîtière ou remonter le long d'une corde.",
    etapes: [
      "Prendre une cordelette plus fine que la corde principale, fermée en anneau (double nœud de pêcheur).",
      "Passer l'anneau derrière la corde principale.",
      "Faire passer l'anneau dans lui-même autour de la corde, trois fois.",
      "Ranger les tours bien parallèles et serrer : pousser le nœud pour le déplacer, tirer l'anneau pour le bloquer."
    ],
    attention: ["Plus la cordelette est fine par rapport à la corde, plus il bloque fort."]
  },
  {
    id: "bois", titre: "Nœud de bois", wiki: "Timber hitch",
    intro: "Pour traîner un tronc ou porter un fagot de bois. Tient par la tension et se défait d'un geste.",
    etapes: [
      "Passer la corde autour du tronc ou du fagot.",
      "Faire une demi-clé autour de la partie dormante.",
      "Enrouler le brin libre trois fois autour de lui-même, le long de la boucle.",
      "Tirer pour serrer. Pour traîner un long tronc, ajouter une demi-clé plus loin vers le bout."
    ],
    attention: []
  },
  {
    id: "constricteur", titre: "Nœud constricteur", wiki: "Constrictor knot",
    intro: "Le nœud qui serre le plus : fermer un sac, ligoter un fagot, faire une ligature d'urgence sur une perche.",
    etapes: [
      "Faire un tour autour de l'objet.",
      "Croiser par-dessus et faire un second tour, comme un cabestan.",
      "Glisser le brin libre sous le croisement en X, pour qu'il ressorte entre les deux brins.",
      "Serrer fort en tirant les deux bouts."
    ],
    attention: ["Quasi impossible à défaire une fois serré : prévoir de le couper."]
  },
  {
    id: "brelagecarre", titre: "Brêlage carré", wiki: "Square lashing",
    intro: "Assembler deux perches en croix pour une structure d'abri, une table ou un séchoir.",
    etapes: [
      "Croiser les deux perches à angle droit.",
      "Faire un nœud de cabestan sur la perche verticale, juste sous la traverse.",
      "Faire 3 à 4 tours : par-dessus la traverse, derrière la verticale, par-dessus la traverse de l'autre côté, derrière la verticale.",
      "Faire 2 à 3 tours de serrage entre les deux perches, autour des tours précédents.",
      "Terminer par un nœud de cabestan sur la traverse."
    ],
    attention: ["Uniquement avec du bois mort, et démonter avant de partir."]
  },
  {
    id: "brelagetrepied", titre: "Brêlage en bigue ou trépied", wiki: "Shear lashing",
    intro: "Relier deux ou trois perches pour faire un trépied (suspendre une casserole, dresser une perche faîtière).",
    etapes: [
      "Poser les perches côte à côte, extrémités alignées.",
      "Faire un nœud de cabestan sur une perche extérieure.",
      "Faire 8 à 10 tours lâches autour de toutes les perches.",
      "Faire 2 tours de serrage entre chaque perche.",
      "Terminer par un cabestan, puis écarter les pieds : les tours se serrent tout seuls."
    ],
    attention: []
  }
].forEach(function (k) {
  k.cat = "Nœuds"; k.illus = "noeud"; k.source = SRC_NOEUDS;
  window.SYLVA_TECHNIQUES.push(k);
});

// ---------- PREMIERS SECOURS ----------
// Rédigé d'après les consignes grand public actuelles (Croix-Rouge, ULB, Centre Antipoisons)
// et recoupé avec le manuel FM 4-25.11 (domaine public). Ne remplace pas une formation.
window.SYLVA_CATEGORIES.splice(window.SYLVA_CATEGORIES.indexOf("Secours") + 1, 0, "Premiers secours");
var SRC_PS = "Consignes grand public de premiers secours (Croix-Rouge, ULB) ; Centre Antipoisons belge ; manuel FM 4-25.11 (domaine public)";
[
  {
    id: "ps_saignement", titre: "Plaie qui saigne",
    intro: "Une hémorragie se contrôle presque toujours par une forte pression directe.",
    etapes: [
      "Se protéger les mains si possible (gants, sac plastique).",
      "Appuyer fort et sans relâcher directement sur la plaie avec un tissu propre, pendant au moins 10 minutes.",
      "Si le tissu se remplit de sang, ne pas l'enlever : en ajouter un par-dessus et continuer d'appuyer.",
      "Allonger la victime, la couvrir, appeler le 112 si le saignement ne s'arrête pas ou est abondant.",
      "Petite plaie : rincer à l'eau potable, désinfecter, couvrir d'un pansement."
    ],
    attention: ["Le garrot ne s'utilise qu'en dernier recours, sur un membre, quand la pression directe ne suffit pas, et en notant l'heure de pose."]
  },
  {
    id: "ps_ampoule", titre: "Ampoules aux pieds",
    intro: "Le premier ennemi du randonneur. Mieux vaut traiter la zone qui chauffe avant l'ampoule.",
    etapes: [
      "Dès qu'une zone chauffe, s'arrêter et la protéger (pansement seconde peau, sparadrap).",
      "Ampoule fermée : ne pas la percer, la protéger avec un pansement spécial ou un anneau de mousse autour.",
      "Ampoule ouverte : nettoyer, ne pas arracher la peau, couvrir d'un pansement propre.",
      "Changer de chaussettes mouillées : l'humidité favorise les ampoules."
    ],
    attention: ["Rougeur qui s'étend, pus ou fièvre : signe d'infection, consulter."]
  },
  {
    id: "ps_entorse", titre: "Entorse de la cheville",
    intro: "Un faux pas sur un sentier humide arrive vite. L'enjeu : savoir si on peut encore marcher.",
    etapes: [
      "S'arrêter et mettre la cheville au repos.",
      "Refroidir 20 minutes avec de l'eau froide ou une poche de froid enveloppée dans un tissu (jamais directement sur la peau).",
      "Surélever la jambe.",
      "Si on ne peut pas faire 4 pas, ou si la douleur est vive sur l'os : ne pas forcer, appeler les secours."
    ],
    attention: ["Ne pas retirer la chaussure si le pied gonfle beaucoup et qu'il faut encore marcher jusqu'à un accès."]
  },
  {
    id: "ps_brulure", titre: "Brûlure",
    intro: "Réflexe vital : refroidir longtemps à l'eau tempérée.",
    etapes: [
      "Refroidir immédiatement sous l'eau tempérée pendant 15 à 20 minutes (30 minutes pour un produit chimique).",
      "Retirer bagues et vêtements qui ne collent pas à la peau.",
      "Ne pas percer les cloques, ne rien appliquer (ni beurre, ni dentifrice, ni glace).",
      "Couvrir d'un tissu propre ou d'un film alimentaire.",
      "Appeler le 112 si la brûlure est plus grande que la paume de la victime, ou touche le visage, les mains, les articulations ou les parties génitales."
    ],
    attention: ["Vêtements en feu : empêcher la victime de courir, la faire rouler au sol ou l'étouffer avec une couverture."]
  },
  {
    id: "ps_intox", titre: "Intoxication (plante, champignon)",
    intro: "En Belgique, le Centre Antipoisons répond 24 h/24 au 070 245 245 (gratuit).",
    etapes: [
      "Appeler le Centre Antipoisons au 070 245 245, ou le 112 si la personne a du mal à respirer, perd connaissance ou convulse.",
      "Garder les restes : la plante, les champignons crus ou cuits, même les épluchures, pour l'identification.",
      "Noter l'heure du repas, la quantité et l'heure des premiers symptômes.",
      "Ne pas faire vomir et ne rien donner à boire sans avis médical."
    ],
    attention: ["Champignons : des symptômes qui apparaissent 6 heures ou plus après le repas annoncent souvent une intoxication grave (foie, reins), même si la personne se sent mieux ensuite."]
  },
  {
    id: "ps_morsure", titre: "Morsure de serpent",
    intro: "Les morsures de vipère sont très rares en Belgique, mais les bons gestes sont simples.",
    etapes: [
      "Rester calme et s'allonger : l'agitation accélère la diffusion du venin.",
      "Immobiliser le membre mordu, retirer bagues, montre et bracelets.",
      "Désinfecter la morsure.",
      "Appeler le 112."
    ],
    attention: ["Ne jamais sucer, aspirer, inciser ni poser de garrot."]
  },
  {
    id: "ps_piqure", titre: "Piqûre de guêpe, d'abeille ou de frelon",
    intro: "Douloureuse mais bénigne… sauf allergie ou piqûre dans la bouche.",
    etapes: [
      "Abeille : retirer le dard en le raclant avec un ongle ou une carte, sans pincer la poche à venin.",
      "Refroidir avec de l'eau froide pour limiter le gonflement.",
      "Surveiller la victime pendant 30 minutes.",
      "Appeler le 112 en cas de gonflement du visage ou de la gorge, de gêne respiratoire, de malaise ou de piqûres multiples. Si la personne a un stylo d'adrénaline, l'aider à l'utiliser."
    ],
    attention: ["Piqûre dans la bouche : sucer de la glace ou de l'eau froide et appeler le 112 si ça gonfle."]
  },
  {
    id: "ps_tique", titre: "Morsure de tique",
    intro: "À vérifier chaque soir de bivouac : aisselles, aine, derrière les genoux, cuir chevelu.",
    etapes: [
      "Retirer la tique le plus tôt possible avec un tire-tique, en tournant sans tirer.",
      "Ne rien mettre dessus avant (ni éther, ni alcool, ni huile).",
      "Désinfecter et noter la date et l'endroit de la morsure.",
      "Surveiller la zone pendant un mois : une rougeur qui s'étend en anneau ou de la fièvre nécessitent de consulter un médecin."
    ],
    attention: []
  }
].forEach(function (t) {
  t.cat = "Premiers secours"; t.illus = "premiers_secours"; t.source = SRC_PS;
  window.SYLVA_TECHNIQUES.push(t);
});
