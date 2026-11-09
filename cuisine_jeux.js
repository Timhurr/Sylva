/* Sylva – recettes du feu inspirées de jeux vidéo (v0.9.30).
   Recettes originales écrites pour Sylva. Les noms de jeux sont cités comme inspiration :
   Sylva n'est ni affiliée ni approuvée par leurs éditeurs. Aucun texte ni visuel des jeux n'est repris. */
(function () {
  "use strict";
  var T = window.SYLVA_TECHNIQUES || [];
  var C = window.SYLVA_CATEGORIES || [];
  var CAT = "Recettes du feu";
  if (C.indexOf(CAT) === -1) {
    var i = C.indexOf("Pêche"); C.splice(i === -1 ? C.length : i + 1, 0, CAT);
  }
  var VIANDE = "Volaille et porc se mangent bien cuits à cœur : coupe le plus gros morceau, la chair ne doit plus être rose et le jus doit être clair.";
  var CHAMPI = "Champignons du commerce uniquement. Ne jamais cuisiner un champignon sauvage sans certitude absolue : certains sont mortels.";

  var R = [
    { id: "rj_brochette_champi", titre: "Brochette de champignons", jeu: "The Legend of Zelda: Breath of the Wild", ed: "Nintendo", illus: "feu_cabane",
      intro: "Le tout premier plat qu'on cuisine en partant à l'aventure : des champignons enfilés sur une branche et dorés au-dessus des braises. Effet : +moral.",
      etapes: [
        "Butin à prévoir : 250 g de champignons de Paris ou de pleurotes, une noix de beurre ou un filet d'huile, sel, poivre, thym.",
        "Coupe une branche verte de noisetier, sans écorce au bout, et taille une pointe. Le bois vert ne brûle pas.",
        "Enfile les champignons entiers par le pied, bien serrés pour qu'ils ne tournent pas.",
        "Badigeonne d'huile ou de beurre, sale et ajoute le thym.",
        "Tiens la brochette à 10 cm au-dessus des braises, pas dans les flammes, en tournant souvent : 6 à 8 minutes.",
        "C'est prêt quand ils sont dorés et qu'ils rendent un peu de jus."
      ],
      attention: [CHAMPI] },
    { id: "rj_brochette_viande", titre: "Brochette de viande aux herbes", jeu: "The Legend of Zelda: Breath of the Wild", ed: "Nintendo", illus: "feu_cabane",
      intro: "Des morceaux de viande et de légumes saisis sur une branche. Le repas qui remet sur pied après une longue marche. Effet : +vigueur.",
      etapes: [
        "Butin à prévoir : 300 g de bœuf ou de poulet en cubes de 3 cm, 1 poivron, 1 oignon, huile, sel, herbes de Provence.",
        "Chez toi : mets la viande à mariner avec l'huile et les herbes dans une boîte étanche, au frais.",
        "Au camp : enfile en alternant viande, poivron et oignon sur une branche verte taillée en pointe.",
        "Cuis au-dessus de braises bien rouges, à 10 cm, en tournant d'un quart de tour toutes les 2 minutes.",
        "Bœuf : 8 à 10 minutes. Poulet : 12 à 15 minutes, jusqu'à ce qu'il soit cuit à cœur.",
        "Sale à la fin, pas avant, pour que la viande reste tendre."
      ],
      attention: [VIANDE, "La viande crue ne tient pas plus d'une demi-journée hors du frigo : cuisine-la le premier soir."] },
    { id: "rj_pomme_miel", titre: "Pomme cuite au miel", jeu: "The Legend of Zelda: Breath of the Wild", ed: "Nintendo", illus: "feu_cabane",
      intro: "Une pomme fondante qui caramélise doucement dans la braise. Le dessert le plus simple du bivouac. Effet : +chaleur.",
      etapes: [
        "Butin à prévoir : 1 pomme par personne, 1 cuillère de miel, un peu de cannelle, une noix de beurre, du papier aluminium.",
        "Retire le cœur de la pomme avec la pointe du couteau, sans percer le fond.",
        "Remplis le trou de miel, de cannelle et de beurre.",
        "Emballe la pomme dans deux couches d'alu, le haut bien fermé.",
        "Pose-la au bord des braises, pas dessus, 20 à 25 minutes, en la tournant à mi-cuisson.",
        "Elle est prête quand la pointe du couteau entre sans résistance. Ouvre avec précaution : le miel est brûlant."
      ],
      attention: ["Rapporte l'aluminium avec toi : il ne brûle pas et ne se dégrade pas."] },
    { id: "rj_ragout_champi", titre: "Ragoût de champignons", jeu: "Minecraft", ed: "Mojang Studios et Microsoft", illus: "feu_cabane",
      intro: "Une soupe épaisse servie dans la gamelle, qui réchauffe d'un coup. Effet : +satiété.",
      etapes: [
        "Butin à prévoir : 250 g de champignons du commerce, 1 oignon, 1 cube de bouillon, 2 cuillères de flocons de pomme de terre, 1 gousse d'ail, beurre.",
        "Émince l'oignon et les champignons sur une planche ou le couvercle de la gamelle.",
        "Fais fondre le beurre dans la gamelle sur la flamme, puis fais revenir l'oignon 3 minutes.",
        "Ajoute les champignons et l'ail, et cuis 5 minutes jusqu'à ce qu'ils rendent leur eau.",
        "Verse 40 cl d'eau et le cube de bouillon. Laisse frémir 10 minutes.",
        "Hors du feu, ajoute les flocons de pomme de terre pour épaissir et mélange."
      ],
      attention: [CHAMPI] },
    { id: "rj_patate_braise", titre: "Pomme de terre cuite dans la braise", jeu: "Minecraft", ed: "Mojang Studios et Microsoft", illus: "feu_cabane",
      intro: "Une patate posée dans le feu, qu'on ouvre fumante avec un peu de beurre. Effet : +satiété.",
      etapes: [
        "Butin à prévoir : 1 grosse pomme de terre par personne, du beurre, du sel, du papier aluminium. Du fromage si tu en as.",
        "Lave la pomme de terre et pique-la plusieurs fois avec le couteau.",
        "Emballe-la dans deux couches d'alu.",
        "Creuse une place dans les braises, pose-la et recouvre-la de braises.",
        "Laisse 40 à 50 minutes, en la retournant une fois.",
        "Teste avec la pointe du couteau : elle doit entrer jusqu'au centre sans forcer. Ouvre en croix, ajoute le beurre, le sel et le fromage."
      ],
      attention: ["Prends-la avec un bâton ou une pince : l'alu reste brûlant longtemps."] },
    { id: "rj_ragout_lapin", titre: "Ragoût de lapin", jeu: "Minecraft", ed: "Mojang Studios et Microsoft", illus: "feu_cabane",
      intro: "Le grand plat qui mijote pendant que tu montes le camp. Effet : +satiété longue durée.",
      etapes: [
        "Butin à prévoir : 2 cuisses de lapin du commerce (ou de poulet), 2 carottes, 2 pommes de terre, 1 oignon, 1 cube de bouillon, thym, laurier, huile.",
        "Fais dorer les cuisses dans l'huile au fond de la marmite, 5 minutes de chaque côté.",
        "Ajoute l'oignon émincé, puis les carottes et les pommes de terre en morceaux.",
        "Couvre d'eau, ajoute le cube, le thym et le laurier.",
        "Suspends la marmite à la crémaillère au-dessus de petites flammes, et laisse mijoter 45 minutes à 1 heure, couvercle posé.",
        "La viande doit se détacher de l'os toute seule."
      ],
      attention: [VIANDE, "Ne chasse pas : le lapin s'achète. La chasse demande un permis et elle est très encadrée."] },
    { id: "rj_poisson_baton", titre: "Poisson grillé sur bâton", jeu: "Minecraft", ed: "Mojang Studios et Microsoft", illus: "feu_cabane",
      intro: "Une truite entière plantée devant le feu, la peau croustillante. Effet : +santé.",
      etapes: [
        "Butin à prévoir : 1 truite vidée par personne (du commerce, ou pêchée avec permis), sel, citron, une branche de thym.",
        "Sale l'intérieur et glisse le thym et une tranche de citron dans le ventre.",
        "Enfile le poisson sur une branche verte, de la bouche jusqu'à la queue, en passant le long de l'arête.",
        "Plante la branche dans le sol, penchée vers les braises, le poisson à 20 cm de la chaleur.",
        "Retourne-le au bout de 8 à 10 minutes. Compte 15 à 20 minutes en tout.",
        "C'est cuit quand la chair est blanche et opaque et se détache de l'arête."
      ],
      attention: ["Voir la fiche « Préparer et cuire un poisson » pour le vider proprement."] },
    { id: "rj_steak_broche", titre: "Gros steak à la broche", jeu: "Monster Hunter", ed: "Capcom", illus: "feu_cabane",
      intro: "Un gros morceau de viande qu'on fait tourner sur une broche au-dessus du feu. Tout l'art est d'arrêter au bon moment. Effet : +endurance.",
      etapes: [
        "Butin à prévoir : un morceau de bœuf épais (bavette ou faux-filet de 3 à 4 cm), huile, gros sel, poivre.",
        "Plante deux bâtons en Y de chaque côté du feu, à 30 cm des braises.",
        "Traverse la viande dans la longueur avec une branche verte, bien droite, et pose-la sur les deux Y.",
        "Badigeonne d'huile. Fais tourner d'un quart de tour toutes les 2 minutes.",
        "Saignant : 12 à 15 minutes. À point : 18 à 20 minutes. Appuie au centre : souple, c'est saignant ; ferme, c'est bien cuit.",
        "Laisse reposer 5 minutes sur une pierre propre avant de couper, puis sale."
      ],
      attention: ["Braises, pas flammes : une flamme vive brûle l'extérieur et laisse le cœur cru."] },
    { id: "rj_ragout_camp", titre: "Ragoût du campement", jeu: "Red Dead Redemption 2", ed: "Rockstar Games", illus: "feu_cabane",
      intro: "La grande marmite du camp, dans laquelle chacun ajoute ce qu'il a. Viande, légumes, et on remet de l'eau tant qu'il y a du monde. Effet : +moral du groupe.",
      etapes: [
        "Butin à prévoir : 400 g de viande à mijoter en cubes (bœuf, ou chevreuil du commerce), 3 pommes de terre, 2 carottes, 1 oignon, 1 boîte de haricots, 1 cube de bouillon, paprika, thym.",
        "Fais saisir la viande dans un peu de graisse, au fond de la marmite, sur une flamme vive.",
        "Ajoute l'oignon, puis les légumes en gros morceaux et le paprika.",
        "Couvre d'eau, ajoute le cube et le thym, et laisse mijoter à la crémaillère 1 h 30, à petit feu.",
        "Ajoute les haricots égouttés 10 minutes avant la fin.",
        "Goûte, rectifie le sel, et sers avec du pain de trappeur."
      ],
      attention: [VIANDE] },
    { id: "rj_viande_herbes", titre: "Viande grillée au thym et à l'origan", jeu: "Red Dead Redemption 2", ed: "Rockstar Games", illus: "feu_cabane",
      intro: "Une tranche de viande grillée sur une pierre chaude, relevée d'herbes. Effet : +vigueur.",
      etapes: [
        "Butin à prévoir : côtes de porc ou tranches de bœuf, sel, poivre, thym et origan séchés (ou du serpolet frais, si tu le reconnais avec certitude).",
        "Chauffe une pierre plate et sèche au bord du feu pendant 20 minutes. Prends-la hors du lit de la rivière, voir l'avertissement.",
        "Frotte la viande avec les herbes, le sel et le poivre.",
        "Pose-la sur la pierre brûlante : elle doit grésiller tout de suite.",
        "Retourne au bout de 4 à 5 minutes, et compte autant de l'autre côté. Plus longtemps pour le porc, qui doit être cuit à cœur.",
        "Laisse reposer 2 minutes avant de manger."
      ],
      attention: ["Jamais de pierre prise dans l'eau ou très humide : l'eau piégée dedans peut la faire éclater dans le feu.", VIANDE] },
    { id: "rj_pommes_chou", titre: "Ragoût pommes et chou", jeu: "The Elder Scrolls V: Skyrim", ed: "Bethesda Softworks", illus: "feu_cabane",
      intro: "Un ragoût d'hiver aigre-doux, très nordique, qui nourrit et réchauffe. Effet : +chaleur.",
      etapes: [
        "Butin à prévoir : ¼ de chou blanc, 2 pommes, 1 oignon, 2 saucisses fumées, 1 cube de bouillon, beurre, sel, poivre.",
        "Fais fondre le beurre dans la marmite et dore l'oignon émincé.",
        "Ajoute le chou en lanières fines et remue 5 minutes, jusqu'à ce qu'il réduise.",
        "Ajoute les pommes en quartiers et les saucisses en rondelles.",
        "Verse 30 cl d'eau avec le cube, couvre, et laisse mijoter 25 minutes à petit feu.",
        "Le chou doit être fondant et les pommes à moitié défaites."
      ],
      attention: [] },
    { id: "rj_roule_cannelle", titre: "Roulé à la cannelle sur bâton", jeu: "The Elder Scrolls V: Skyrim", ed: "Bethesda Softworks", illus: "feu_cabane",
      intro: "Une pâte roulée en spirale autour d'un bâton, dorée au feu puis passée dans le sucre à la cannelle. La douceur du soir. Effet : +moral.",
      etapes: [
        "Butin à prévoir (préparé chez toi dans un sac) : 200 g de farine, 1 sachet de levure chimique, 1 pincée de sel, 2 cuillères de sucre. À part : sucre et cannelle mélangés, et un peu de sucre glace.",
        "Au camp, ajoute petit à petit environ 12 cl d'eau, ou de lait, et pétris jusqu'à obtenir une pâte souple qui ne colle plus.",
        "Roule des boudins de la taille d'un doigt, longs de 30 cm.",
        "Enroule chaque boudin en spirale autour d'une branche verte épluchée et épaisse comme le pouce.",
        "Cuis au-dessus des braises en tournant sans arrêt, 10 à 12 minutes, jusqu'à ce que ce soit doré et que ça sonne creux.",
        "Retire du bâton, roule dans le sucre à la cannelle, puis saupoudre de sucre glace mélangé à quelques gouttes d'eau pour faire un glaçage."
      ],
      attention: ["Voir aussi la fiche « Pain de trappeur (bannock) » : même pâte, version salée."] },
    { id: "rj_soupe_carotte", titre: "Soupe de carottes", jeu: "Valheim", ed: "Iron Gate Studio et Coffee Stain", illus: "feu_cabane",
      intro: "Une soupe orange et douce, facile, qui tient au corps. Effet : +santé.",
      etapes: [
        "Butin à prévoir : 4 carottes, 1 pomme de terre, 1 oignon, 1 cube de bouillon, 1 noix de beurre, 1 pincée de cumin.",
        "Coupe tout en petits dés pour que ça cuise vite.",
        "Fais revenir l'oignon dans le beurre, puis ajoute carottes, pomme de terre et cumin.",
        "Couvre d'eau à hauteur avec le cube, et laisse bouillir doucement 20 à 25 minutes.",
        "Écrase les légumes à la fourchette ou avec le fond d'une tasse, directement dans la gamelle.",
        "Ajoute de l'eau si c'est trop épais."
      ],
      attention: [] },
    { id: "rj_saucisses", titre: "Saucisses au feu de bois", jeu: "Valheim", ed: "Iron Gate Studio et Coffee Stain", illus: "feu_cabane",
      intro: "Les saucisses grillées au bout d'un bâton : le classique absolu du feu de camp. Effet : +moral.",
      etapes: [
        "Butin à prévoir : saucisses fraîches ou fumées, pain, moutarde.",
        "Taille une branche verte en pointe par personne.",
        "Pique la saucisse dans la longueur.",
        "Tiens-la au-dessus des braises, pas dans les flammes, et tourne souvent pour une cuisson égale.",
        "Saucisse fumée : 5 minutes. Saucisse fraîche : 12 à 15 minutes, elle doit être cuite à cœur.",
        "Glisse-la dans le pain avec la moutarde."
      ],
      attention: ["Ne pique pas trop la peau : le gras qui coule enflamme les braises et noircit la saucisse.", VIANDE] },
    { id: "rj_iguane_baton", titre: "Brochette « iguane » au poulet", jeu: "Fallout: New Vegas", ed: "Bethesda Softworks", illus: "feu_cabane",
      intro: "Le casse-croûte du désert, version Ardennes : de longues lanières de poulet épicé grillées sur un bâton. Pas d'iguane, promis. Effet : +endurance.",
      etapes: [
        "Butin à prévoir : 2 blancs de poulet, 1 cuillère de paprika fumé, ½ cuillère de cumin, sel, huile, 1 citron vert.",
        "Coupe le poulet en longues lanières fines, dans la longueur.",
        "Frotte avec l'huile, le paprika, le cumin et le sel.",
        "Enfile chaque lanière en accordéon, en zigzag, sur une branche verte.",
        "Grille au-dessus des braises 8 à 10 minutes en tournant, jusqu'à ce que ce soit doré et cuit à cœur.",
        "Arrose de citron vert avant de manger."
      ],
      attention: [VIANDE] },
    { id: "rj_potion_soin", titre: "Potion de soin : tisane d'ortie et miel", jeu: "les jeux de rôle (potions de soin)", ed: "aucun éditeur en particulier", illus: "feu_cabane",
      intro: "La potion rouge des jeux, version forêt : une tisane chaude d'ortie, de miel et de citron. Elle ne soigne pas les blessures, mais elle réchauffe et remonte le moral. Effet : +chaleur, +moral.",
      etapes: [
        "Butin : une poignée de jeunes feuilles d'ortie (le haut des tiges), du miel, du citron. Voir la fiche espèce de l'ortie.",
        "Cueille avec un gant ou une feuille de bardane pliée, loin des chemins, des champs traités et des endroits où passent les chiens.",
        "Rince les feuilles à l'eau potable.",
        "Fais bouillir 50 cl d'eau, retire du feu et ajoute les orties.",
        "Laisse infuser 8 minutes, couvercle posé, puis filtre.",
        "Ajoute le miel et le jus de citron. La tisane perd son piquant en infusant."
      ],
      attention: ["Ne bois que des plantes identifiées avec certitude : plusieurs plantes toxiques poussent au même endroit.", "Ce n'est pas un médicament : une vraie blessure se soigne avec les fiches « Premiers secours »."] }
  ];

  // Recettes proposées par Tim (adaptées : sécurité alimentaire, cueillette)
  var CAN = "Ne chauffe jamais une boîte fermée : elle explose. Une boîte ouverte se chauffe au bord des braises, mais son vernis intérieur n'aime pas le feu vif : le mieux reste de verser le contenu dans la popote.";
  var PIERRE = "Jamais de pierre prise dans l'eau ou très humide : l'eau piégée dedans peut la faire éclater dans le feu.";
  var R2 = [
    { id: "rj_papillote_vigor", titre: "La papillote Vigor", jeu: "The Legend of Zelda: Breath of the Wild", cuisson: "Dans les braises (papillote)", interet: "Protéines, sel pour l'effort, lipides du beurre.",
      ingredients: ["1 steak de bœuf (ou lard épais) en gros dés", "4 champignons de Paris coupés en deux", "1 noisette de beurre (ou filet d'huile)", "Gros sel, poivre noir", "1 gousse d'ail écrasée"],
      etapes: ["Le bouclier : étale une grande feuille d'aluminium, doublée si elle est fine.",
        "L'assemblage : dépose la viande et les champignons au centre. Ajoute l'ail, le sel, le poivre, et le beurre par-dessus.",
        "Le scellé : replie l'aluminium hermétiquement en chausson étanche, le jus ne doit pas fuir.",
        "Le feu : dégage un lit de braises chaudes sans flammes, et pose la papillote directement dessus.",
        "Le chrono : 15 à 20 minutes, en retournant une fois à mi-cuisson avec deux bâtons. Ouvre délicatement : la vapeur brûle."],
      attention: [CHAMPI, "Avec du lard, il doit être bien cuit et grillé, pas seulement tiède."] },
    { id: "rj_ragout_taverne", titre: "Le ragoût de la taverne", jeu: "World of Warcraft et Skyrim", cuisson: "Sur pierre chaude, dans la boîte ou la popote", interet: "Glucides lents, fibres et protéines : de l'énergie durable contre le froid de la nuit.",
      ingredients: ["1 boîte de haricots à la sauce tomate (type baked beans)", "1 saucisse fumée (Montbéliard ou kielbasa)", "50 g de fromage à pâte dure (comté, beaufort) en dés"],
      etapes: ["L'ouverture : ouvre entièrement la boîte de haricots.",
        "La découpe : tranche la saucisse fumée en rondelles épaisses, ajoute-la aux haricots et mélange.",
        "La chauffe : pose la popote (ou la boîte ouverte) sur une pierre plate au bord des braises, et laisse mijoter jusqu'à frémissement.",
        "La fusion : retire du feu avec des gants ou une pince de fortune, et jette les dés de fromage dedans.",
        "Le service : laisse fondre 1 minute. À la cuillère, quand le fromage file."],
      attention: [CAN, PIERRE] },
    { id: "rj_grilled_cheese", titre: "Le grilled cheese de l'abri", jeu: "Fallout", cuisson: "Pressé sous pierre chaude", interet: "Très calorique : du gras pour relancer la chaudière corporelle par temps froid.",
      ingredients: ["2 grosses tranches de pain de campagne", "3 tranches épaisses de fromage fondant (raclette, cheddar ou reblochon)", "2 tranches de bacon ou de jambon cru"],
      etapes: ["Le sandwich : place le fromage et le bacon entre les deux tranches de pain.",
        "L'emballage : enveloppe fermement le sandwich dans de l'aluminium.",
        "La presse : chauffe une pierre plate, propre et sèche, au bord du feu. Elle doit être très chaude.",
        "La cuisson : pose le sandwich sur un lit de braises bien plat, puis la pierre chaude par-dessus, comme une presse à panini.",
        "Le résultat : 3 à 5 minutes de chaque côté. Le pain doit être croustillant et le fromage complètement fondu."],
      attention: [PIERRE, "Manipule la pierre avec deux bâtons ou des gants épais."] },
    { id: "rj_chaudron_ermite", titre: "Le chaudron de l'ermite", jeu: "Genshin Impact", cuisson: "À la popote (suspendue ou sur trépied)", interet: "Hydratation, minéraux et réconfort immédiat.",
      ingredients: ["1 poignée de champignons du commerce (frais, ou séchés réhydratés)", "1 cube de bouillon (volaille ou légumes)", "2 portions de fromage à tartiner (type Kiri ou Vache qui rit)", "1 filet d'huile"],
      etapes: ["Le saisi : dans la popote, fais sauter les champignons dans l'huile au-dessus de petites flammes jusqu'à ce qu'ils dorent.",
        "Le bouillon : émiette le cube dessus et verse un grand verre d'eau (250 ml).",
        "La réduction : laisse bouillir 5 minutes au-dessus des braises.",
        "Le liant : hors du feu, ajoute le fromage et remue fort jusqu'à obtenir une sauce crémeuse.",
        "L'astuce : à napper sur une pomme de terre cuite dans la braise, ou à manger comme une soupe épaisse avec du pain."],
      attention: [CHAMPI] },
    { id: "rj_pain_elmoth", titre: "Le pain de voyage d'Elmoth", jeu: "Le Seigneur des anneaux et la fantasy", cuisson: "Sur pierre plate (cuisson sèche)", interet: "Glucides compacts : se garde dans le sac et se mange en marchant le lendemain.",
      ingredients: ["100 g de farine de blé (pesée chez toi dans un sac étanche)", "1 pincée de sel", "1 cuillère à café de sucre ou de miel", "Eau tiède, au jugé"],
      etapes: ["Le pétrissage : dans la popote ou dans le sac de farine, ajoute le sel, le sucre, et l'eau petit à petit. Mélange à la main jusqu'à une pâte ferme qui ne colle plus.",
        "La forme : divise la pâte et aplatis-la en galettes fines, 1 cm au maximum pour qu'elles cuisent à cœur.",
        "Le four naturel : brosse les cendres d'une pierre plate chauffée au bord du foyer. Elle doit être brûlante.",
        "La cuisson : pose les galettes directement sur la pierre, sans matière grasse.",
        "Le timing : 5 à 8 minutes de chaque côté. La galette doit sonner creux. Mange chaud, ou enveloppe dans un tissu pour la route."],
      attention: [PIERRE] },
    { id: "rj_cafe_cowboy", titre: "Le café du cow-boy", jeu: "Red Dead Redemption", cuisson: "Décantation à la popote", interet: "Caféine contre la fatigue, sucre et magnésium du chocolat.",
      ingredients: ["2 cuillères à soupe de café moulu (pas de soluble)", "300 ml d'eau potable", "1 carré de chocolat noir (ou un peu de sucre)"],
      etapes: ["L'ébullition : porte l'eau à ébullition complète dans la popote.",
        "L'infusion : retire du feu, jette le café moulu dans l'eau et remue une fois.",
        "La décantation : laisse reposer 3 à 4 minutes sans toucher, à l'abri du vent. La mouture tombe et se tasse au fond.",
        "Le secret : mets le carré de chocolat au fond de ton quart.",
        "Le service : verse très doucement, sans secouer la popote, pour laisser le marc au fond. Remue pour fondre le chocolat."],
      attention: ["Une goutte d'eau froide versée sur le café aide la mouture à tomber. Ne bois pas le fond."] },
    { id: "rj_onigiri", titre: "Les rations du samouraï (onigiri)", jeu: "Ghost of Tsushima et Sekiro", cuisson: "À la popote (riz compact)", interet: "Glucides lents : la jauge d'endurance pleine avant une longue marche.",
      ingredients: ["100 g de riz rond (riz à sushi), lavé chez toi", "150 ml d'eau", "1 pincée de sel", "1 petite boîte de thon au naturel (ou du lard cuit haché)", "1 feuille d'algue nori (optionnel)"],
      etapes: ["Le feu doux : riz et eau dans la popote, couvercle fermé et une pierre dessus. Porte à ébullition au-dessus des braises, puis recule la popote et laisse 15 minutes à feu très doux, sans jamais ouvrir.",
        "Le repos : hors du feu, laisse étuver 10 minutes, toujours couvert.",
        "Le façonnage : laisse tiédir, mouille tes mains à l'eau salée. Prends une poignée de riz, creuse un trou et glisse une cuillère de thon émietté.",
        "Le triangle : presse fort entre tes mains pour former un triangle compact. Entoure la base d'algue pour le tenir sans te coller les doigts."],
      attention: ["Riz cuit et thon ouvert ne se gardent pas : mange les onigiris dans la journée, et pas après une journée chaude dans le sac."] },
    { id: "rj_soupe_monstre", titre: "La soupe de monstre du Séraphin", jeu: "Monster Hunter et Dragon Quest", cuisson: "Bouillon long, au coin du feu", interet: "Réhydratation, collagène et minéraux : le meilleur bonus de défense contre le gel.",
      ingredients: ["200 g de viande à braiser (bœuf, gibier du commerce ou jarret de porc)", "1 gros oignon en quartiers", "1 carotte en grosses rondelles", "1 cube de bouillon de bœuf", "Eau"],
      etapes: ["Le saisissement : fais dorer la viande au fond de la popote bien chaude, avec un peu de gras.",
        "Le déluge : couvre d'eau à hauteur, et ajoute l'oignon, la carotte et le cube émietté.",
        "La cuisson longue : pose la popote sur un trépied ou deux pierres stables, au-dessus de braises moyennes. Laisse mijoter 1 h à 1 h 30 pendant que tu montes l'abri. Plus c'est doux et long, plus la viande est tendre.",
        "La dégustation : sers brûlant dans le quart. Rajoute de l'eau si ça réduit trop."],
      attention: ["Oignon du commerce : l'ail des ours et les « oignons sauvages » ont des sosies mortels (muguet, colchique). Voir les fiches espèces.", VIANDE] },
    { id: "rj_galette_stalker", titre: "La galette de la Zone (blini de survie)", jeu: "S.T.A.L.K.E.R. et Metro 2033", cuisson: "À la poêle de bivouac ou au couvercle de popote", interet: "Énergie compacte, ingrédients de fond de sac qui se gardent longtemps.",
      ingredients: ["1 sachet de purée en flocons", "1 cuillère à soupe de farine", "Eau tiède", "1 cuillère à soupe d'huile ou de saindoux", "Sel, poivre"],
      etapes: ["Le mélange : dans la popote, mélange flocons et farine, puis ajoute l'eau tiède petit à petit jusqu'à une pâte épaisse, comme de la pâte à modeler. Sale, poivre.",
        "Les galettes : forme des boules, puis aplatis-les en galettes épaisses de la taille de ta paume.",
        "Le test du feu : chauffe l'huile dans la poêle ou le couvercle de la popote, sur les braises.",
        "La friture : 3 à 4 minutes de chaque côté, jusqu'à une croûte dorée et croustillante.",
        "Le service : chaud, idéalement avec un morceau de corned-beef, pour un vrai repas de survivant des tunnels."],
      attention: ["Huile chaude au-dessus du feu : poêle bien stable, et jamais d'eau dedans."] },
    { id: "rj_porridge", titre: "Le porridge du pionnier", jeu: "The Long Dark", cuisson: "À la popote (petit-déjeuner de tempête)", interet: "Index glycémique bas : de l'énergie en continu pendant des heures de marche dans le froid.",
      ingredients: ["50 g de flocons d'avoine fins", "200 ml d'eau (ou de neige fondue, bouillie)", "1 poignée de fruits secs (raisins, cranberries, amandes)", "1 cuillère à café de miel ou de sucre roux"],
      etapes: ["L'immersion : dans la popote froide, mélange flocons, fruits secs et eau.",
        "Le bouillonnement : au-dessus de braises moyennes, porte doucement à ébullition en remuant sans arrêt pour que le fond n'attache pas.",
        "L'épaississement : dès que ça bout et épaissit (3 à 5 minutes), retire du feu.",
        "Le liant : ajoute le miel, couvre 2 minutes pour que les fruits secs gonflent. Ça réchauffe dès le réveil."],
      attention: [] },
    { id: "rj_lembas", titre: "Le lembas des coureurs des bois", jeu: "Le Seigneur des anneaux et Green Hell", cuisson: "Sur branche de bois vert (feu direct)", interet: "Glucides denses : le pain des trappeurs par excellence.", tags: ["Zéro vaisselle", "Artisanat", "Marche"],
      ingredients: ["100 g de farine avec une pincée de levure chimique", "1 cuillère à soupe de lait en poudre", "1 pincée de sel", "Eau, au jugé"],
      etapes: ["La pâte de ration : dans un sac congélation ou la popote, mélange farine, lait en poudre et sel. Ajoute un filet d'eau et malaxe jusqu'à une boule souple et élastique.",
        "Le support : taille une branche de bois vert (noisetier ou bouleau) de la taille d'un manche à balai, et retire l'écorce sur les 20 derniers centimètres.",
        "L'enroulement : étire la pâte en long boudin fin et enroule-la en spirale sur la partie écorcée, en pressant bien les extrémités.",
        "La cuisson : au-dessus des braises, pas dans les flammes, en tournant régulièrement.",
        "Le rendu : en 10 à 15 minutes, le pain gonfle, dore et se détache tout seul. Remplis le trou d'un carré de chocolat ou de fromage."],
      attention: ["Pas de branche d'if, de laurier-cerise ou de bois inconnu : ils sont toxiques. Noisetier, bouleau ou saule."] },
    { id: "rj_ragout_goule", titre: "Le ragoût de goule de l'outback", jeu: "Fallout et Project Zomboid", cuisson: "À la popote (ration d'urgence)", interet: "Sel contre les crampes, protéines qui se gardent longtemps.", tags: ["Boîte de ration", "Rustique", "Anti-froid"],
      ingredients: ["1 boîte de corned-beef de 200 g", "1 petit paquet de crackers salés", "½ oignon (séché ou frais)", "1 tasse d'eau", "Un peu d'huile ou de gras"],
      etapes: ["La base : fais revenir l'oignon en dés dans un peu de gras au fond de la popote, jusqu'à ce qu'il soit translucide.",
        "La viande : ajoute le bloc de corned-beef et écrase-le à la cuillère.",
        "Le bouillonnement : verse l'eau et laisse mijoter 5 minutes au-dessus des braises.",
        "L'épaississant : émiette 3 ou 4 crackers dedans. Ils boivent le jus et donnent une purée rustique épaisse.",
        "La consommation : brûlant. +50 % de jauge d'énergie."],
      attention: [] },
    { id: "rj_jerky", titre: "Le séchage du chasseur (jerky au feu de bois)", jeu: "The Long Dark et ARK: Survival Evolved", cuisson: "Séchage et fumage au-dessus des braises", interet: "Protéines pures, presque sans gras : un en-cas qui tient dans le sac.", tags: ["Conservation", "Artisanat", "Feu de bois"],
      ingredients: ["200 g de bœuf maigre (tende de tranche) en lanières de 5 mm", "Gros sel, poivre noir", "Poudre d'ail ou piment (optionnel)"],
      etapes: ["Le salage : sale et épice les lanières sur toutes les faces, et laisse reposer 30 minutes sur une surface propre.",
        "La saisie de sécurité : plonge les lanières 1 minute dans l'eau bouillante, ou saisis-les rapidement sur la grille. La viande doit être chauffée à cœur avant de sécher.",
        "Le séchoir : monte un petit trépied en bois vert, ou tends des cordelettes à 60 cm au-dessus de braises qui faiblissent.",
        "La suspension : enfile les lanières sur des piques de bois vert et suspends-les dans la chaleur.",
        "Le fumage : pas de flammes, juste de la chaleur douce et de la fumée de bois dur (chêne, hêtre), pendant 3 à 4 heures.",
        "Le résultat : la viande devient sombre, sèche, mais reste souple. Range-la dans un sac propre et fermé."],
      attention: ["Un séchage au feu de camp n'est pas une conserve industrielle : mange ce jerky dans les 2 à 3 jours, et jette-le s'il sent mauvais ou devient humide.", "Bœuf du commerce uniquement : le gibier sauvage peut porter des parasites qu'un séchage ne tue pas."] },
    { id: "rj_crispy_boite", titre: "Le crispy de la boîte cachée", jeu: "DayZ et Escape from Tarkov", cuisson: "Dans la boîte ou la popote, sur les braises", interet: "Sucres rapides et potassium : le moral et l'énergie mentale remontent tout de suite.", tags: ["Boîte de ration", "Zéro vaisselle", "Dessert"],
      ingredients: ["1 boîte de fruits au sirop (ananas, pêches ou abricots)", "2 ou 3 biscuits secs (spéculoos, petit-beurre)", "1 pincée de cannelle (optionnel)"],
      etapes: ["La ventilation : ouvre la boîte et vide la moitié du sirop (bois-le, c'est un shot d'énergie).",
        "Le crumble : émiette les biscuits par-dessus les fruits, ajoute la cannelle.",
        "Le brasier : pose la boîte ouverte (ou la popote) bien stable sur un nid de petites braises.",
        "La caramélisation : laisse bouillir doucement 10 minutes. Le sirop réduit et le biscuit fait une croûte.",
        "Le service : retire avec un outil ou un tissu épais, et laisse tiédir 2 minutes avant de manger à la cuillère."],
      attention: [CAN] },
    { id: "rj_elixir_mana", titre: "L'élixir de mana (thé des bois)", jeu: "Don't Starve et Skyrim", cuisson: "Infusion à la popote (cueillette)", interet: "Vitamine C et chaleur : un vrai réconfort quand il fait froid.", tags: ["Cueillette", "Hydratation", "Zéro calorie"],
      ingredients: ["1 poignée de jeunes aiguilles de pin ou de sapin, identifiées avec certitude", "1 morceau de gingembre (emporté), ou de jeunes pousses de ronce", "1 cuillère à soupe de miel", "500 ml d'eau"],
      etapes: ["La récolte : rince les aiguilles et hache-les grossièrement au couteau pour libérer les arômes.",
        "La chauffe : porte l'eau à ébullition complète.",
        "L'infusion : retire du feu, ajoute les aiguilles et le gingembre, et couvre.",
        "Le repos : 10 à 12 minutes à l'abri du vent. Le liquide prend une couleur dorée.",
        "Le filtre : verse dans le quart en retenant les aiguilles, puis ajoute le miel."],
      attention: ["L'if est mortel et ressemble à un sapin : aiguilles plates, molles, vert foncé dessus, sans odeur d'agrume, et baies rouges. Voir sa fiche espèce. Évite aussi le thuya et les conifères d'ornement.", "Déconseillé aux femmes enceintes : certaines aiguilles de pin sont déconseillées pendant la grossesse."] },
    { id: "rj_fondue_pelerin", titre: "La fondue du pèlerin", jeu: "Steep et Horizon", cuisson: "À la popote (chaleur partagée)", interet: "Gras et protéines en masse : le plat parfait pour une nuit sous zéro.", tags: ["Très calorique", "Rustique", "Réconfort"],
      ingredients: ["150 g de fromage à pâte pressée (comté, abondance ou emmental) râpé ou en dés", "50 ml de vin blanc sec (dans une petite fiole), ou de jus de pomme acide", "1 gousse d'ail", "Croûtons de pain rassis ou crackers"],
      etapes: ["Le parfum : frotte le fond et les parois de la popote avec la gousse d'ail coupée en deux, et laisse-la au fond.",
        "L'amorce : verse le vin (ou le jus de pomme) et porte à frémissement sur des braises douces.",
        "La cascade : ajoute le fromage en trois fois, en remuant sans arrêt en formant des 8.",
        "L'onctuosité : garde une chaleur très douce. Le fromage doit fondre sans brûler ni rendre son gras. Recule la popote si ça chauffe trop.",
        "L'action : pique le pain au bout d'une brochette en bois et trempe-le dans la popote, au centre du groupe."],
      attention: ["Le vin cuit garde un peu d'alcool : prends la version au jus de pomme pour les enfants."] }
  ];
  // Doublons fusionnés : ses versions du poisson sur bâton et de la pomme au miel enrichissent les miennes
  var MERGE = { rj_poisson_baton: "Minecraft, Far Cry et Red Dead Redemption 2", rj_pomme_miel: "The Legend of Zelda: Breath of the Wild et les potions de soin des RPG", rj_potion_soin: "les potions de soin des jeux de rôle" };
  R.forEach(function (r) {
    if (MERGE[r.id]) r.jeu = MERGE[r.id];
    if (r.id === "rj_poisson_baton") r.etapes[3] = "Plante la branche dans le sol, penchée vers les braises, à 20 à 30 cm de la chaleur : le poisson cuit au rayonnement, jamais dans les flammes.";
    if (r.id === "rj_pomme_miel") r.etapes[4] = "Pose-la dans un creux de cendres chaudes au bord du feu, pas sur les braises rouges vives, et recouvre de cendres : 20 à 25 minutes. Elle confit dans son jus.";
  });

  var NOTE = "Non officiel : Sylva n'est affiliée à aucun éditeur des jeux cités, ni approuvée par eux";
  function splitButin(e) {
    var t = e.replace(/^Butin[^:]*:\s*/, "").replace(/\.\s*$/, "");
    var out = [], depth = 0, cur = "";
    for (var i = 0; i < t.length; i++) {
      var ch = t[i];
      if (ch === "(") depth++; if (ch === ")") depth--;
      if ((ch === "," || ch === ".") && depth === 0) { if (cur.trim()) out.push(cur.trim()); cur = ""; continue; }
      cur += ch;
    }
    if (cur.trim()) out.push(cur.trim());
    return out.map(function (x) { x = x.replace(/^et\s+/i, ""); return x.charAt(0).toUpperCase() + x.slice(1); });
  }
  R.forEach(function (r) {
    var ing = [];
    var et = r.etapes.slice();
    if (/^Butin/.test(et[0])) ing = splitButin(et.shift());
    var effet = (r.intro.match(/Effet : (.+?)\.?$/) || [])[1];
    r.recette = { jeu: r.jeu, ingredients: ing, effet: effet || "" };
    r.intro = r.intro.replace(/\s*Effet : .+$/, "");
    r.etapes = et;
  });
  R2.forEach(function (r) {
    r.illus = "feu_cabane";
    r.intro = r.interet;
    r.recette = { jeu: r.jeu, cuisson: r.cuisson, tags: r.tags || [], ingredients: r.ingredients };
  });
  R.concat(R2).forEach(function (r) {
    if (T.some(function (t) { return t.id === r.id; })) return;
    T.push({ id: r.id, cat: CAT, titre: r.titre, illus: r.illus, intro: r.intro, recette: r.recette,
      etapes: r.etapes, attention: r.attention || [], source: "Recette originale Sylva, inspirée de " + r.jeu + ". " + NOTE });
  });
  R = R.concat(R2);

  // Chapitre « cuisine » : nouvelle section et liens vers les recettes
  var G = window.SYLVA_GUIDE || [];
  var ch = G.filter(function (x) { return x.id === "cuisine"; })[0];
  if (ch) {
    ch.sections = ch.sections || [];
    if (!ch.sections.some(function (s) { return s.titre === "Recettes du feu, inspirées des jeux vidéo"; })) {
      ch.sections.push({
        titre: "Recettes du feu, inspirées des jeux vidéo",
        p: ["Brochettes, ragoûts, pommes au miel : beaucoup de jeux d'aventure font cuisiner leurs héros sur un feu de camp. Ces recettes en sont des versions réelles, faisables au bivouac avec une gamelle, une branche verte et de bonnes braises. Chaque fiche liste le « butin » à prévoir, la cuisson et un petit effet en clin d'œil."],
        encadre: { type: "retenir", titre: "Non officiel", texte: "Recettes originales écrites pour Sylva. Les jeux cités sont des inspirations : Sylva n'est ni affiliée ni approuvée par leurs éditeurs." }
      });
    }
    ch.fiches = ch.fiches || [];
    R.forEach(function (r) { if (ch.fiches.indexOf(r.id) === -1) ch.fiches.push(r.id); });
  }
})();
