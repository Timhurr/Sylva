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
      attention: ["Une corde synthétique peut aussi se fondre au briquet, mais une surliure tient mieux et ne coupe pas les mains."] },
    { id: "simple_ganse", titre: "Nœud simple gansé", wiki: "Overhand knot",
      intro: "Un arrêt ou une attache provisoire qui se défait d'un coup en tirant le bout.",
      etapes: [
        "Faire une boucle comme pour un nœud simple.",
        "Au lieu de passer le bout, passer une ganse du brin libre dans la boucle.",
        "Serrer. Pour défaire, tirer le bout de la ganse."
      ] },
    { id: "huit_ganse", titre: "Nœud de huit gansé", wiki: "Figure-eight knot",
      intro: "Un arrêt en huit qui se défait instantanément : pour bloquer une corde provisoirement dans un œillet ou une poulie.",
      etapes: [
        "Faire une boucle, puis passer le brin libre derrière la partie dormante, comme pour un nœud de huit.",
        "Pour le dernier passage dans la boucle, passer une ganse du brin libre au lieu du bout.",
        "Serrer. Pour défaire, tirer le bout de la ganse."
      ] },
    { id: "stevedore", titre: "Nœud d'arrêt de docker", wiki: "Stevedore knot",
      intro: "Un huit avec un tour de plus : un arrêt plus gros, qui ne passe pas dans un trou large et se défait encore facilement.",
      etapes: [
        "Faire une boucle en croisant le brin libre par-dessus la partie dormante.",
        "Enrouler le brin libre deux fois autour de la partie dormante, au lieu d'une seule fois pour le huit.",
        "Passer le brin libre dans la boucle de départ.",
        "Serrer en tirant les deux brins."
      ] },
    { id: "pomme", titre: "Pomme de touline", wiki: "Monkey's fist",
      intro: "Une boule de corde au bout d'une cordelette, qui donne du poids pour la lancer loin : par-dessus une branche pour suspendre un sac de nourriture, ou vers quelqu'un.",
      etapes: [
        "Enrouler la corde 3 fois autour de deux doigts, en laissant pendre la partie dormante.",
        "Faire 3 tours autour des premiers, à angle droit, en les serrant au milieu.",
        "Passer le bout à l'intérieur du premier groupe de tours, puis faire 3 tours autour du deuxième groupe, en passant chaque fois à l'intérieur du premier.",
        "Retirer les doigts. Resserrer petit à petit en suivant la corde dans l'ordre, jusqu'à obtenir une boule ferme.",
        "Attacher le bout à la partie dormante avec deux demi-clés."
      ],
      attention: ["Ne mets pas de pierre au centre si elle risque d'être lancée vers une personne : la boule devient dangereuse."] },
    { id: "ecoute_double", titre: "Nœud d'écoute double", wiki: "Sheet bend",
      intro: "Relier deux cordes de grosseurs très différentes, ou mouillées et glissantes. Plus sûr que l'écoute simple.",
      etapes: [
        "Faire une ganse avec la corde la plus grosse.",
        "Passer le bout de la corde fine dans la ganse, par en dessous.",
        "Le faire passer derrière les deux brins de la ganse, puis le glisser sous lui-même.",
        "Faire un deuxième tour au même endroit, à côté du premier, et le glisser aussi sous lui-même.",
        "Serrer en tirant les deux cordes."
      ] },
    { id: "carrick", titre: "Nœud de carrick", wiki: "Carrick bend",
      intro: "Relier deux grosses cordes qui vont porter une lourde charge. Il reste facile à défaire, même après avoir été mouillé.",
      etapes: [
        "Avec la première corde, faire une boucle dont le bout passe par-dessus la partie dormante.",
        "Poser le bout de la seconde corde sous cette boucle.",
        "Faire avancer la seconde corde en alternant à chaque croisement : par-dessus la partie dormante de la première, sous son bout, par-dessus la boucle.",
        "Continuer l'alternance : sous sa propre partie, puis par-dessus la boucle. Les deux bouts sortent en diagonale, de part et d'autre.",
        "Tirer les deux cordes : le nœud se renverse et se tasse. C'est normal."
      ],
      attention: ["Vérifie qu'à chaque croisement la corde passe une fois dessus, une fois dessous. Une seule erreur et le nœud lâche."] },
    { id: "pecheur_simple", titre: "Nœud de pêcheur", wiki: "Fisherman's knot",
      intro: "Relier deux cordelettes ou deux fils de même grosseur, simplement et solidement.",
      etapes: [
        "Poser les deux bouts côte à côte, en sens opposés.",
        "Avec le premier bout, faire un nœud simple autour de l'autre corde.",
        "Avec le second bout, faire un nœud simple autour de la première corde.",
        "Tirer les deux cordes : les deux nœuds glissent l'un vers l'autre et se bloquent."
      ],
      attention: ["Pour porter une personne, préfère le double nœud de pêcheur."] },
    { id: "sang", titre: "Nœud de sang", wiki: "Blood knot",
      intro: "Le nœud de pêche pour raccorder deux fils de nylon fins sans qu'ils glissent.",
      etapes: [
        "Croiser les deux fils sur une dizaine de centimètres.",
        "Enrouler le premier bout 5 fois autour de l'autre fil, puis le ramener entre les deux fils, au point de croisement.",
        "Enrouler le second bout 5 fois autour du premier fil, dans l'autre sens.",
        "Passer ce second bout dans le même espace central, mais dans la direction opposée au premier.",
        "Mouiller, tirer lentement les deux fils, puis couper les bouts."
      ] },
    { id: "roulant", titre: "Nœud roulant", wiki: "Rolling hitch",
      intro: "Il agrippe une perche ou une autre corde et ne glisse pas quand on tire dans l'axe. Pour tirer un tronc, soulager une corde sous tension ou tendre une bâche.",
      etapes: [
        "Passer le bout autour de la perche en croisant la partie dormante, du côté vers lequel tu vas tirer.",
        "Faire un deuxième tour à côté du premier, en croisant de nouveau la partie dormante, toujours du côté de la traction.",
        "Passer le bout autour de la perche de l'autre côté de la partie dormante et le glisser sous lui-même.",
        "Serrer, puis tirer dans l'axe, du côté des deux tours."
      ] },
    { id: "hune", titre: "Nœud de hune", wiki: "Buntline hitch",
      intro: "Fixer une corde à un œillet ou un anneau qui bouge sans arrêt, comme une bâche qui bat au vent : il se resserre au lieu de se desserrer.",
      etapes: [
        "Passer le bout dans l'œillet ou l'anneau.",
        "Avec le bout, faire un tour autour de la partie dormante.",
        "Faire un second tour autour de la partie dormante, entre le premier tour et l'anneau.",
        "Glisser le bout sous ce second tour : c'est un nœud de cabestan fait autour de la partie dormante.",
        "Serrer en tirant la partie dormante."
      ],
      attention: ["Très difficile à défaire après une forte charge."] },
    { id: "levier", titre: "Nœud de levier", wiki: "Marlinspike hitch",
      intro: "Glisser un bâton dans une corde pour en faire une poignée : pour tirer fort, serrer une ligature ou faire les barreaux d'une échelle de corde.",
      etapes: [
        "Faire une boucle dans la corde.",
        "La rabattre par-dessus la partie dormante.",
        "Glisser le bâton par-dessus les côtés de la boucle et sous la partie dormante.",
        "Tirer : la corde se bloque sur le bâton. Pour libérer, retirer le bâton."
      ] },
    { id: "bachmann", titre: "Nœud de Bachmann", wiki: "Bachmann hitch",
      intro: "Un autobloquant avec mousqueton : le mousqueton sert de poignée pour le faire glisser. Pratique avec des gants ou des mains froides.",
      etapes: [
        "Clipper un anneau de cordelette dans un mousqueton.",
        "Plaquer le mousqueton contre la corde principale, ouverture vers l'extérieur.",
        "Enrouler la cordelette 3 ou 4 fois autour de la corde et du dos du mousqueton, en montant, en passant chaque fois dans le mousqueton.",
        "Charger la boucle de cordelette vers le bas : le nœud bloque. Pousser le mousqueton pour le déplacer."
      ],
      attention: ["Ne bloque que si l'on tire vers le bas. Ne jamais saisir les spires pendant une chute : le nœud ne bloquerait plus."] },
    { id: "chaise_tours", titre: "Nœud de chaise à double tour", wiki: "Bowline",
      intro: "Un nœud de chaise plus sûr : la double boucle centrale serre mieux la corde, surtout si elle est glissante ou rigide.",
      etapes: [
        "Faire deux petites boucles superposées au lieu d'une, le brin libre passant par-dessus.",
        "Passer le brin libre dans les deux boucles, par en dessous.",
        "Le faire passer derrière la partie dormante.",
        "Le redescendre dans les deux boucles.",
        "Serrer et laisser une queue d'au moins 10 cm."
      ] },
    { id: "boucle_simple", titre: "Boucle simple", wiki: "Overhand loop",
      intro: "La boucle la plus rapide à faire, pour une charge légère : accrocher un sac, une gourde ou une ficelle de séchage.",
      etapes: [
        "Plier le bout de la corde en ganse.",
        "Faire un nœud simple avec ce double.",
        "Serrer en tirant la boucle et les deux brins."
      ],
      attention: ["Elle se coince et affaiblit la corde : pour une vraie charge, préfère la boucle de huit."] },
    { id: "chainette", titre: "Chaînette", wiki: "Chain sinnet",
      intro: "Raccourcir et ranger une longue corde sans qu'elle s'emmêle, et la dérouler d'un seul geste.",
      etapes: [
        "Faire une boucle près du bout de la corde.",
        "Passer une ganse de la partie dormante dans cette boucle.",
        "Passer une nouvelle ganse dans la précédente, et continuer ainsi sur toute la longueur.",
        "Pour bloquer, passer le bout dans la dernière ganse. Pour défaire, retirer le bout et tirer : tout se déroule."
      ] },
    { id: "tresse", titre: "Tresse à trois brins", wiki: "Braid",
      intro: "Faire une corde plus solide avec des brins fins : fibres d'ortie, écorce de tilleul, herbes, ficelle.",
      etapes: [
        "Attacher ensemble les trois brins à un bout, ou les coincer sous une pierre.",
        "Passer le brin de droite par-dessus celui du milieu : il devient le brin du milieu.",
        "Passer le brin de gauche par-dessus le nouveau brin du milieu.",
        "Recommencer en alternant droite et gauche, en serrant de façon régulière.",
        "Ajouter un nouveau brin en le superposant sur quelques centimètres quand l'un d'eux devient court. Finir par un nœud simple."
      ] },
    { id: "filet", titre: "Filet de fortune",
      intro: "Avec de la cordelette, un filet sert de hamac, de sac de transport ou de séchoir.",
      etapes: [
        "Tendre une corde de tête entre deux arbres.",
        "Y fixer des longueurs égales de cordelette, à intervalles réguliers, par des têtes d'alouette.",
        "Nouer chaque brin avec son voisin par un nœud simple, tous à la même hauteur : c'est la première rangée de mailles.",
        "Rangée suivante : décaler d'une demi-maille et nouer chaque brin avec l'autre voisin.",
        "Continuer rangée après rangée en gardant des mailles de taille égale, puis nouer le bas sur une seconde corde."
      ],
      attention: ["Pêcher ou chasser au filet est interdit dans la plupart des pays européens."] },
    { id: "epissure_oeil", titre: "Épissure en œil", wiki: "Eye splice",
      intro: "Une boucle permanente au bout d'une corde à trois torons, plus solide que n'importe quel nœud.",
      etapes: [
        "Défaire les trois torons sur environ 15 cm et faire une petite surliure au bout de chacun.",
        "Plier la corde pour former l'œil de la taille voulue.",
        "Glisser le toron du milieu sous un toron de la partie dormante, contre le sens de la torsion.",
        "Glisser le toron de gauche sous le toron suivant de la partie dormante, à gauche du premier.",
        "Retourner l'épissure et glisser le dernier toron sous le toron de la partie dormante qui reste libre.",
        "Continuer : chaque toron passe par-dessus un toron et sous le suivant. Faire au moins 5 passages, puis couper les bouts."
      ],
      attention: ["Uniquement pour une corde toronnée (torons visibles), pas pour une corde tressée d'escalade."] },
    { id: "epissure_arriere", titre: "Épissure arrière", wiki: "Back splice",
      intro: "Terminer proprement le bout d'une corde à trois torons pour qu'il ne s'effiloche jamais.",
      etapes: [
        "Défaire les torons sur une dizaine de centimètres.",
        "Faire une tête : plier chaque toron par-dessus son voisin, dans le même sens, et passer le dernier dans la boucle du premier. Serrer.",
        "Glisser chaque toron vers la corde, par-dessus un toron et sous le suivant, contre le sens de la torsion.",
        "Faire 3 passages pour chaque toron.",
        "Rouler l'épissure sous le pied pour la tasser, puis couper les bouts."
      ] },
    { id: "epissure_courte", titre: "Épissure courte", wiki: "Short splice",
      intro: "Réparer une corde à trois torons coupée, ou en relier deux, sans nœud : le raccord reste solide.",
      etapes: [
        "Défaire les torons des deux bouts sur environ 15 cm et faire une surliure au bout de chaque toron.",
        "Emboîter les deux bouts : chaque toron d'une corde vient se placer entre deux torons de l'autre.",
        "Ligaturer provisoirement le centre avec une ficelle pour que ça tienne.",
        "D'un côté, glisser chaque toron par-dessus un toron et sous le suivant, contre le sens de la torsion. Faire 3 passages.",
        "Retirer la ligature et faire la même chose de l'autre côté.",
        "Rouler l'épissure sous le pied pour la tasser, puis couper les bouts."
      ],
      attention: ["L'épissure épaissit la corde : elle ne passe plus dans une petite poulie."] },
    { id: "surliure_francaise", titre: "Surliure à demi-clés", wiki: "Whipping knot",
      intro: "Une autre façon d'arrêter le bout d'une corde, ou de faire une poignée antidérapante sur un manche, avec une série de demi-clés.",
      etapes: [
        "Attacher le fil fin sur la corde avec un nœud simple.",
        "Faire une demi-clé autour de la corde et la serrer contre le nœud.",
        "Faire la suivante juste à côté, toujours dans le même sens : les nœuds forment une petite arête en spirale.",
        "Continuer sur une longueur égale à 1,5 fois le diamètre, ou sur toute la longueur du manche.",
        "Finir par deux demi-clés serrées et couper le fil."
      ] },
    { id: "noeuds_eviter", titre: "Deux nœuds à ne pas confondre",
      intro: "Le nœud plat a deux faux jumeaux qui lâchent sous la charge : le nœud de vache et le nœud de voleur. Savoir les reconnaître évite une mauvaise surprise.",
      etapes: [
        "Nœud plat correct : gauche sur droite, puis droite sur gauche. Les deux bouts sortent du même côté et le nœud est bien symétrique.",
        "Nœud de vache : deux fois gauche sur droite. Les bouts sortent en biais, le nœud est tordu et il glisse.",
        "Nœud de voleur : il ressemble au nœud plat, mais les deux bouts sortent en diagonale, de part et d'autre. Il lâche très facilement.",
        "En cas de doute, défaire et refaire en disant à voix haute : « gauche sur droite, droite sur gauche »."
      ] }
  ];
  K.forEach(function (k) {
    if (T.some(function (t) { return t.id === k.id; })) return;
    k.cat = "Nœuds"; k.source = SRC;
    T.push(k);
  });
})();
