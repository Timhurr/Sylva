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
  function src(jeu, editeur) {
    return "Recette originale Sylva, inspirée de " + jeu + ". Non officiel : Sylva n'est ni affiliée ni approuvée par " + editeur;
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

  R.forEach(function (r) {
    if (T.some(function (t) { return t.id === r.id; })) return;
    T.push({ id: r.id, cat: CAT, titre: r.titre, illus: r.illus, intro: r.intro + " Inspiration : " + r.jeu + ".",
      etapes: r.etapes, attention: r.attention, source: src(r.jeu, r.ed) });
  });

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
