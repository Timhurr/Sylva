/* Sylva – nœuds supplémentaires (v0.9.3).
   Étapes rédigées pour Sylva à partir des méthodes de nouage usuelles (savoir commun, non protégé).
   Aucun texte ni aucune image d'ouvrage protégé n'est repris. Photos : Wikimedia Commons via Wikipédia. */
(function () {
  "use strict";
  var T = window.SYLVA_TECHNIQUES || [];
  var SRC = "Méthodes de nouage usuelles, rédigées pour Sylva. Photo : Wikimedia Commons";
  var K = [
    { id: "simple", titre: "Nœud simple", wiki: "Overhand knot",
      intro: "Le nœud de base, à la source de presque tous les autres. Sert d'arrêt rapide au bout d'une corde ou d'un fil.",
      etapes: [
        "Faire une boucle en croisant le brin libre par-dessus la partie dormante.",
        "Passer le brin libre dans la boucle, en entrant par en dessous.",
        "Serrer en tirant les deux brins."
      ],
      attention: ["Il se coince sous forte charge et affaiblit la corde. Pour un arrêt solide, préfère le nœud de huit."] },
    { id: "arret_double", titre: "Nœud d'arrêt double", wiki: "Double overhand knot",
      intro: "Un arrêt plus gros que le nœud simple : il ne passe pas dans un œillet et sert de base au double nœud de pêcheur.",
      etapes: [
        "Commencer comme un nœud simple, sans serrer.",
        "Passer le brin libre une seconde fois dans la boucle, dans le même sens.",
        "Serrer doucement en guidant les deux spires pour qu'elles s'enroulent côte à côte."
      ],
      attention: ["Très difficile à défaire après une forte charge."] },
    { id: "plat_ganse", titre: "Nœud plat gansé", wiki: "Reef knot",
      intro: "Le nœud plat qui se défait d'un seul geste, comme un lacet. Pratique pour fermer un sac, rouler une bâche ou attacher un paquetage.",
      etapes: [
        "Faire la première moitié d'un nœud plat : croiser le bout gauche sur le droit et le passer dessous.",
        "Pour la seconde moitié, plier un des bouts en ganse (une boucle en U).",
        "Croiser cette fois le bout droit sur le gauche et nouer avec la ganse.",
        "Serrer. Pour défaire, il suffit de tirer le bout libre de la ganse."
      ],
      attention: ["Comme le nœud plat, il ne sert qu'à ligaturer quelque chose : jamais pour abouter deux cordes qui vont porter une charge."] },
    { id: "chirurgien", titre: "Nœud de chirurgien", wiki: "Surgeon's knot",
      intro: "Un nœud plat amélioré : le premier croisement est doublé et ne glisse pas pendant que tu fais le second. Idéal pour serrer un bandage, un fagot ou un fil de pêche.",
      etapes: [
        "Croiser les deux bouts et les enrouler deux fois l'un autour de l'autre.",
        "Tirer pour serrer ce double croisement : il tient tout seul.",
        "Croiser à nouveau, dans l'autre sens, une seule fois.",
        "Serrer les quatre brins de façon égale."
      ] },
    { id: "huit_boucle", titre: "Boucle de huit (huit en double)", wiki: "Figure-eight loop",
      intro: "Une boucle fixe très solide et facile à vérifier d'un coup d'œil. Pour suspendre une charge, s'accrocher à une corde ou tendre une ligne.",
      etapes: [
        "Plier la corde pour former une ganse d'environ 30 cm.",
        "Avec ce double, faire une boucle en le croisant par-dessus les deux brins.",
        "Faire passer la ganse derrière les deux brins.",
        "La ramener par-devant dans la boucle.",
        "Serrer en tirant la boucle d'un côté et les deux brins de l'autre. Les brins doivent rester parallèles, sans se croiser."
      ],
      attention: ["Se défait difficilement après une grosse charge. Si les brins se croisent dans le nœud, recommence."] },
    { id: "huit_rengaine", titre: "Huit rengainé", wiki: "Figure-eight loop",
      intro: "La même boucle de huit, mais nouée autour d'un arbre, d'un anneau ou d'un harnais qu'on ne peut pas enfiler dans une boucle déjà faite.",
      etapes: [
        "Faire un nœud de huit simple, sans le serrer, à environ 1 m du bout.",
        "Passer le brin libre autour de l'arbre ou dans l'anneau.",
        "Le faire rentrer dans le huit par l'endroit où sort le brin libre du premier huit.",
        "Suivre exactement le chemin du premier brin, à l'envers, en restant toujours du même côté de lui.",
        "Ressortir parallèle à la partie dormante, serrer, et laisser au moins 10 cm de queue."
      ] },
    { id: "papillon", titre: "Nœud de papillon", wiki: "Alpine butterfly knot",
      intro: "Une boucle fixe au milieu d'une corde, qui supporte une traction dans les trois directions. Pour accrocher du matériel sur une ligne tendue, ou isoler une portion de corde abîmée.",
      etapes: [
        "Au milieu de la corde, faire une ganse.",
        "Tordre cette ganse deux fois sur elle-même, dans le même sens : elle forme un huit, avec une petite ouverture en bas.",
        "Replier le sommet de la ganse vers le bas, par-devant les torsions.",
        "Le faire passer dans l'ouverture du bas, puis le tirer vers le haut.",
        "Serrer en tirant la boucle d'un côté et les deux brins dans des directions opposées."
      ],
      attention: ["Vérifie la forme : une boucle qui sort sur le côté, et les deux brins qui ressortent chacun de leur côté du nœud. Sinon, recommence."] },
    { id: "chaise_double", titre: "Nœud de chaise sur le double", wiki: "Bowline on a bight",
      intro: "Deux boucles fixes qui ne coulissent pas, faites au milieu d'une corde. Elles peuvent servir de siège de fortune pour hisser ou descendre quelqu'un.",
      etapes: [
        "Plier la corde en deux pour former une longue ganse.",
        "Avec ce double, faire une petite boucle comme pour un nœud de chaise.",
        "Passer la ganse dans la petite boucle, par en dessous.",
        "Ouvrir la ganse et la faire passer par-dessus les deux grandes boucles, jusqu'à ce qu'elle entoure le nœud par l'arrière.",
        "Serrer en tirant les deux grandes boucles d'un côté et la partie dormante de l'autre."
      ],
      attention: ["Pour porter une personne, teste d'abord le nœud avec ton propre poids, près du sol."] },
    { id: "vache", titre: "Tête d'alouette (nœud de vache)", wiki: "Cow hitch",
      intro: "Le moyen le plus rapide de fixer un anneau de corde ou une sangle autour d'une branche, d'un poteau ou d'une poignée.",
      etapes: [
        "Plier la corde en deux pour former une ganse.",
        "Passer la ganse autour de la branche ou dans l'anneau.",
        "Passer les deux brins dans la ganse.",
        "Tirer les deux brins pour serrer."
      ],
      attention: ["Il ne tient bien que si les deux brins tirent ensemble. Avec un seul brin chargé, il peut glisser."] },
    { id: "demi_cabestan", titre: "Demi-cabestan", wiki: "Munter hitch",
      intro: "Un frein de corde avec un simple mousqueton : pour descendre une charge en douceur ou retenir quelqu'un qui grimpe.",
      etapes: [
        "Faire deux boucles identiques, côte à côte, dans la corde.",
        "Les replier l'une contre l'autre comme on ferme un livre, et non l'une derrière l'autre comme pour un cabestan.",
        "Clipper le mousqueton dans les deux boucles et fermer le verrou.",
        "Tenir en permanence le brin libre : c'est ta main qui freine. Plus le brin libre est ramené vers le brin chargé, moins ça freine."
      ],
      attention: ["Uniquement avec un mousqueton à verrou, de préférence en forme de poire.", "Il vrille la corde. Une descente en rappel sans formation est très dangereuse : ce nœud sert surtout à descendre du matériel ou à assurer quelqu'un."] },
    { id: "machard", titre: "Nœud de Machard (Klemheist)", wiki: "Klemheist knot",
      intro: "Un nœud autobloquant : il coulisse à la main et se bloque dès qu'on tire vers le bas. Pour remonter une corde, tendre une ligne ou faire une poignée.",
      etapes: [
        "Prendre un anneau de cordelette plus fine que la corde principale.",
        "L'enrouler 4 ou 5 fois autour de la corde en montant, en spires serrées qui ne se chevauchent pas.",
        "Passer l'extrémité du bas dans la boucle du haut.",
        "Tirer cette extrémité vers le bas : le nœud se bloque. Pour le déplacer, pousser les spires à la main."
      ],
      attention: ["Il ne bloque que dans un sens, vers le bas. Pour un blocage dans les deux sens, utilise le nœud de Prusik."] },
    { id: "largage", titre: "Nœud à largage rapide", wiki: "Highwayman's hitch",
      intro: "Il tient une charge et se défait d'un seul coup en tirant le bout libre, même à distance. Pratique pour un hamac, un sac suspendu ou un animal.",
      etapes: [
        "Passer une ganse du brin libre derrière la branche.",
        "Former une ganse dans la partie qui va porter la charge et la passer, par-devant, dans la première ganse.",
        "Tirer le brin libre pour serrer la première ganse sur la seconde.",
        "Former une ganse avec le brin libre et la passer dans la deuxième ganse.",
        "Tirer la partie qui porte la charge pour bloquer le tout. Pour libérer, tirer le bout libre."
      ],
      attention: ["Jamais pour porter une personne : il peut se défaire sous des à-coups."] },
    { id: "jambe_chien", titre: "Jambe de chien", wiki: "Sheepshank",
      intro: "Raccourcir une corde sans la couper, ou mettre de côté une portion abîmée en attendant mieux.",
      etapes: [
        "Plier la corde en S pour former trois brins parallèles, de la longueur à supprimer. La partie abîmée doit être dans le brin du milieu.",
        "À un bout, faire une boucle dans le brin simple et la passer sur la ganse de ce côté.",
        "Faire la même chose à l'autre bout.",
        "Mettre la corde en tension : le nœud tient tant qu'il est chargé."
      ],
      attention: ["Il se défait si la corde se détend. Pour plus de sûreté, bloque chaque ganse avec un bâtonnet ou une ligature."] },
    { id: "ruban", titre: "Nœud de sangle", wiki: "Water knot",
      intro: "Le seul nœud fiable pour relier deux sangles plates, ou fermer une sangle en anneau.",
      etapes: [
        "Faire un nœud simple lâche au bout d'une sangle, bien à plat, sans torsion.",
        "Faire entrer le bout de l'autre sangle par où sort le premier bout.",
        "Suivre exactement le chemin du nœud, à l'envers, en restant à plat contre la première sangle.",
        "Serrer très fort en tirant chaque brin, et laisser des queues d'au moins 7 cm."
      ],
      attention: ["Il peut glisser petit à petit avec l'usage : vérifie la longueur des queues avant chaque utilisation."] },
    { id: "ancre", titre: "Nœud d'ancre", wiki: "Anchor bend",
      intro: "Fixer solidement une corde sur un anneau, une ancre de fortune ou une pierre percée. Il résiste bien aux secousses et à l'eau.",
      etapes: [
        "Faire deux tours morts autour de l'anneau ou de la branche.",
        "Passer le brin libre autour de la partie dormante.",
        "Le glisser sous les deux tours morts.",
        "Finir par une demi-clé sur la partie dormante et serrer."
      ] },
    { id: "brelage_diagonal", titre: "Brêlage diagonal", wiki: "Diagonal lashing",
      intro: "Assembler deux perches qui se croisent en biais, ou qui ont tendance à s'écarter : pour rigidifier un cadre d'abri ou un trépied.",
      etapes: [
        "Faire un nœud de bois autour des deux perches, en diagonale, au point de croisement.",
        "Faire 3 ou 4 tours serrés dans la même diagonale.",
        "Faire 3 ou 4 tours dans l'autre diagonale.",
        "Faire 2 ou 3 tours de serrage entre les deux perches, autour des tours précédents.",
        "Finir par un nœud de cabestan sur l'une des perches."
      ],
      attention: ["Uniquement avec du bois mort, et tout démonter avant de partir."] },
    { id: "palomar", titre: "Nœud Palomar", wiki: "Palomar knot",
      intro: "Le nœud d'hameçon le plus simple et l'un des plus solides : utile pour une ligne de pêche de survie.",
      etapes: [
        "Plier environ 15 cm de fil en double et passer la boucle dans l'œillet de l'hameçon.",
        "Faire un nœud simple lâche avec le double, l'hameçon pendant en dessous.",
        "Passer l'hameçon entier dans la boucle.",
        "Mouiller le nœud, serrer en tirant les deux brins, puis couper la queue."
      ],
      attention: ["La pêche est réglementée : un permis est en général obligatoire, et les règles changent selon le pays et le cours d'eau."] },
    { id: "clinch", titre: "Nœud clinch amélioré", wiki: "Improved clinch knot",
      intro: "L'autre grand nœud d'hameçon ou de leurre, quand l'œillet est trop petit pour passer un fil en double.",
      etapes: [
        "Passer le bout du fil dans l'œillet.",
        "Enrouler le bout 5 à 7 fois autour du fil principal.",
        "Passer le bout dans la petite boucle qui s'est formée près de l'œillet.",
        "Le repasser ensuite dans la grande boucle qui vient de se former.",
        "Mouiller et serrer doucement, puis couper la queue."
      ] },
    { id: "surliure", titre: "Surliure", wiki: "Whipping knot",
      intro: "Empêcher le bout d'une corde de s'effilocher, avec du fil fin : ficelle, fil dentaire ou fil de couture épais.",
      etapes: [
        "Plier le fil en ganse et la poser le long de la corde, boucle vers le bout de la corde.",
        "Enrouler le fil serré autour de la corde et de la ganse, en allant vers le bout, sur une longueur d'environ 1,5 fois le diamètre de la corde. Laisser la boucle dépasser.",
        "Passer le bout du fil dans la boucle.",
        "Tirer l'autre extrémité du fil, celle du départ, pour faire rentrer la boucle sous les tours, jusqu'au milieu.",
        "Couper les deux bouts au ras."
      ],
      attention: ["Une corde synthétique peut aussi se fondre au briquet, mais une surliure tient mieux et ne coupe pas les mains."] }
  ];
  K.forEach(function (k) {
    if (T.some(function (t) { return t.id === k.id; })) return;
    k.cat = "Nœuds"; k.source = SRC;
    T.push(k);
  });
})();
