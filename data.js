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
      { nom: "Marron d'Inde (Aesculus hippocastanum)", niveau: "danger",
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
      { nom: "Troène (Ligustrum vulgare)", niveau: "danger",
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
      { nom: "Lamier blanc", niveau: "ok",
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
      { nom: "Carotte sauvage, panais, céleri sauvage", niveau: "danger",
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
      { nom: "Amanite des Césars (absente en Belgique)", niveau: "caution",
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
      { nom: "Pholiote changeante (comestible)", niveau: "danger",
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
      { nom: "Bolet amer (Tylopilus felleus)", niveau: "caution",
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

window.SYLVA_TECHNIQUES = [
  {
    id: "eau", titre: "Rendre l'eau potable", icone: "eau", priorite: true,
    intro: "Même claire, l'eau de l'Ourthe peut contenir bactéries et parasites (élevages et villages en amont).",
    etapes: [
      "Préfiltrer à travers un tissu propre pour retirer les particules.",
      "Porter à gros bouillons pendant 1 minute (3 minutes au-dessus de 2 000 m).",
      "Laisser refroidir à couvert. À défaut : filtre de randonnée ou pastilles de purification en respectant le temps d'attente indiqué.",
      "Puiser en amont du campement et loin des pâtures."
    ]
  },
  {
    id: "froid", titre: "Prévenir l'hypothermie", icone: "froid", priorite: true,
    intro: "Novembre en Ardenne : nuits proches de 0 °C et humidité. Le froid humide est le vrai danger du bivouac.",
    etapes: [
      "Rester au sec : se changer avant d'avoir froid, garder une tenue sèche réservée à la nuit.",
      "Système en couches : base respirante, couche chaude, coque imperméable.",
      "Isoler du sol : un bon matelas compte autant que le sac de couchage.",
      "Manger et boire chaud avant de dormir.",
      "Signes d'alerte : frissons incontrôlables, gestes maladroits, confusion. Réchauffer la personne et appeler le 112 si ça s'aggrave."
    ]
  },
  {
    id: "abri", titre: "Choisir son emplacement", icone: "abri",
    intro: "Un bon emplacement fait la moitié d'une bonne nuit.",
    etapes: [
      "Uniquement sur une aire de bivouac autorisée ou un terrain privé avec accord (voir onglet Carte).",
      "Lever les yeux : aucune branche morte ni arbre mort au-dessus de la tente.",
      "Éviter les fonds de vallée et le bord immédiat de la rivière : air froid, humidité, crue possible.",
      "Sol plat, légèrement surélevé, entrée de la tente dos au vent."
    ]
  },
  {
    id: "feu", titre: "Faire du feu (là où c'est permis)", icone: "feu",
    intro: "En Wallonie, le feu est interdit en forêt sauf aux emplacements prévus. Vérifier les règles de l'aire sur place.",
    etapes: [
      "Préparer trois tas avant d'allumer : amadou (herbes sèches, écorce de bouleau), petit bois (allumettes de branche), bois plus gros.",
      "Ramasser uniquement du bois mort au sol, jamais sur un arbre vivant.",
      "Monter un tipi de petit bois autour de l'amadou, allumer côté vent, souffler doucement à la base.",
      "Éteindre complètement à l'eau, remuer, vérifier qu'aucune braise ne chauffe au toucher du dos de la main."
    ]
  },
  {
    id: "orientation", titre: "S'orienter sans réseau", icone: "orientation",
    intro: "La vallée de l'Ourthe est sinueuse et le réseau mobile y est irrégulier.",
    etapes: [
      "Avant de partir : repérer l'itinéraire et l'afficher dans l'onglet Carte pour le garder en cache.",
      "Suivre la rivière vers l'aval mène tôt ou tard à un village (La Roche-en-Ardenne vers le nord-ouest).",
      "En novembre, le soleil est plein sud vers 12 h 30 (heure belge).",
      "La nuit, l'étoile polaire indique le nord : prolonger 5 fois l'écart entre les deux étoiles du bord de la « casserole » de la Grande Ourse."
    ]
  },
  {
    id: "urgence", titre: "Urgence & secours", icone: "sos",
    intro: "Le 112 passe par n'importe quel réseau mobile disponible, même si ce n'est pas celui de votre opérateur.",
    etapes: [
      "Appeler le 112 et donner vos coordonnées GPS (bouton SOS en haut de l'appli).",
      "Si l'appel ne passe pas, envoyer un SMS à un proche avec la position, puis monter sur une hauteur pour chercher du réseau.",
      "Rester visible : vêtement de couleur vive, lampe, 3 signaux répétés = détresse.",
      "Toujours prévenir quelqu'un de son itinéraire et de son heure de retour avant de partir."
    ]
  },
  {
    id: "traces", titre: "Ne laisser aucune trace", icone: "feuille",
    intro: "C'est ce qui permet aux aires de bivouac de rester ouvertes.",
    etapes: [
      "Remporter tous ses déchets, y compris organiques.",
      "Besoins : à plus de 50 m de l'eau, dans un trou de 15 cm rebouché, papier remporté.",
      "Pas de savon dans la rivière, même biodégradable.",
      "Arriver tard, partir tôt, rester discret."
    ]
  }
];
