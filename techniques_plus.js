// Sylva – fiches techniques détaillées (v0.7).
// Rédigées pour Sylva d'après le manuel de survie de l'armée américaine FM 3-05.70 (2002, domaine public),
// complété par les bonnes pratiques actuelles de sécurité et la réglementation européenne.
(function () {
  var SRC = "Manuel de survie de l'armée américaine FM 3-05.70 (domaine public), réécrit et adapté pour Sylva";
  var CATS = window.SYLVA_CATEGORIES;
  if (CATS.indexOf("Déplacement") === -1) CATS.splice(CATS.indexOf("Orientation") + 1, 0, "Déplacement");

  [
    // ================= FEU =================
    { id: "feu_appentis", cat: "Feu", titre: "Feu en appentis", illus: "feu_appentis",
      intro: "Idéal par vent ou pluie fine : un bâton incliné protège l'amadou et guide la flamme.",
      etapes: [
        "Planter un bâton vert dans le sol, incliné à environ 30°, la pointe tournée vers le vent.",
        "Glisser une bonne poignée d'amadou tout au fond, sous le bâton.",
        "Appuyer du petit bois contre le bâton, des deux côtés, en laissant de l'air.",
        "Allumer l'amadou côté vent, puis ajouter du petit bois au fur et à mesure qu'il prend."],
      attention: [] },
    { id: "feu_croix", cat: "Feu", titre: "Feu sur tranchée en croix", illus: "feu_croix",
      intro: "Une petite tranchée en croix sous l'amadou fait un appel d'air : utile quand il n'y a pas de vent.",
      etapes: [
        "Tracer une croix d'environ 30 cm dans le sol et la creuser sur 7 à 8 cm de profondeur.",
        "Poser une grosse boule d'amadou au centre de la croix.",
        "Monter une petite pyramide de petit bois au-dessus.",
        "Allumer : l'air circule par les tranchées et nourrit la flamme par-dessous."],
      attention: ["Reboucher les tranchées en partant, une fois les cendres froides."] },
    { id: "feu_pyramide", cat: "Feu", titre: "Feu pyramide (toute la nuit)", illus: "feu_pyramide",
      intro: "Un feu qui brûle de haut en bas, lentement, sans qu'on ait à s'en occuper pendant la nuit.",
      etapes: [
        "Poser deux bûches parallèles sur le sol.",
        "Couvrir d'une couche serrée de bûches posées en travers.",
        "Ajouter 3 ou 4 couches, chacune plus fine que la précédente et croisée à angle droit.",
        "Allumer un petit feu de départ (tipi) tout en haut de la pyramide.",
        "Le feu descend couche après couche et donne de la chaleur pendant des heures."],
      attention: ["Même un feu « autonome » ne doit jamais rester sans surveillance près d'un abri ou en forêt sèche."] },
    { id: "feu_dakota", cat: "Feu", titre: "Trou de feu dakota", illus: "feu_dakota",
      intro: "Un feu enterré, discret et peu sensible au vent, qui consomme peu de bois et chauffe bien une casserole.",
      etapes: [
        "Creuser un trou d'environ 30 cm de profondeur et 20 cm de large, en gardant la motte d'herbe de côté.",
        "Côté vent, creuser un second trou à 20-30 cm, relié au premier par un tunnel en biais : c'est l'arrivée d'air.",
        "Allumer le feu au fond du trou principal avec de l'amadou et du petit bois.",
        "Poser la casserole directement sur l'ouverture, sur deux bâtons verts si besoin.",
        "En partant : noyer, laisser refroidir, reboucher les trous et replacer la motte d'herbe."],
      attention: ["À ne pas faire au milieu de racines (elles peuvent couver) ni sur sol tourbeux.", "Même enterré, le feu reste soumis aux règles du lieu."] },
    { id: "reflecteur", cat: "Feu", titre: "Mur réflecteur", illus: "reflecteur",
      intro: "Un mur derrière le feu renvoie la chaleur vers toi ou vers l'abri, et coupe le vent.",
      etapes: [
        "Planter deux paires de piquets à 1 m environ derrière le feu.",
        "Empiler des bûches entre les piquets pour former un mur de 50 à 80 cm de haut.",
        "Se placer entre le feu et l'abri : la chaleur arrive des deux côtés.",
        "À défaut de bûches : un gros rocher sec ou une bâche tendue à bonne distance."],
      attention: ["Jamais de pierres mouillées ou poreuses autour du feu : l'eau qu'elles contiennent peut les faire éclater."] },
    { id: "arc_feu", cat: "Feu", titre: "Arc à feu (archet et foret)", illus: "arc_feu",
      intro: "La méthode par friction la plus fiable, mais elle demande de l'entraînement et du bois parfaitement sec. À apprendre chez soi, pas le jour où on en a besoin.",
      etapes: [
        "Préparer les quatre pièces : une planchette de bois tendre et sec (tilleul, saule, peuplier) d'environ 2,5 cm d'épaisseur ; un foret bien droit et sec d'environ 2 cm × 25 cm, rond en haut et plat en bas ; une poignée (pierre creusée ou bois dur) pour tenir le haut du foret ; un arc en bois souple de la longueur du bras, avec une cordelette bien tendue.",
        "Creuser un petit creux dans la planchette à 2 cm du bord, puis tailler une encoche en V du bord jusqu'au centre du creux.",
        "Poser la planchette sur un morceau d'écorce sèche (qui recueillera la braise), le pied sur la planchette.",
        "Enrouler une fois la corde de l'arc autour du foret, poser le foret dans le creux, la poignée par-dessus, poignet calé contre la jambe.",
        "Commencer par de longs mouvements lents, puis accélérer en appuyant de plus en plus : une poussière noire remplit l'encoche et la fumée devient épaisse.",
        "Continuer quelques secondes après l'apparition de la fumée, puis retirer le foret : la poussière doit fumer toute seule, c'est la braise.",
        "La faire glisser dans un nid d'amadou très fin, refermer le nid et souffler doucement jusqu'à la flamme."],
      attention: ["Bois mort sec ramassé debout, jamais au sol (trop humide).", "Les ampoules aux mains arrivent vite : protéger la paume avec un gant ou un tissu."] },
    { id: "tissu_charbonne", cat: "Feu", titre: "Tissu charbonné et amadouvier", illus: "tissu_charbonne",
      intro: "Deux matériaux qui attrapent une simple étincelle et gardent la braise longtemps. Le tissu se prépare à la maison, l'amadouvier pousse dans nos forêts.",
      etapes: [
        "Tissu charbonné : découper des carrés de tissu 100 % coton (vieux t-shirt, jean) de quelques centimètres.",
        "Les ranger à plat dans une petite boîte en métal fermée, percée d'un petit trou au couvercle.",
        "Poser la boîte sur un feu ou un réchaud : de la fumée sort par le trou. Attendre qu'elle s'arrête (5 à 10 minutes).",
        "Retirer et laisser refroidir sans ouvrir. Les carrés doivent être noirs, souples, sans brûler. Les garder au sec.",
        "Amadouvier : ce champignon dur en forme de sabot de cheval pousse sur les hêtres et bouleaux morts. Sous la croûte se trouve une couche feutrée brune.",
        "Prélever cette couche feutrée, la faire bien sécher puis la battre pour l'assouplir : elle retient l'étincelle d'une pierre à feu et garde une braise pendant de longues minutes."],
      attention: ["Prélever l'amadouvier sur du bois mort uniquement, en petite quantité."] },

    // ================= EAU =================
    { id: "alambic", cat: "Eau", titre: "Alambic solaire", illus: "alambic",
      intro: "Le soleil fait évaporer l'humidité du sol et des plantes, qui se condense sous un plastique et coule dans un récipient. Rendement faible : à réserver aux régions sèches et ensoleillées.",
      etapes: [
        "Creuser un trou d'environ 90 cm de large et 60 cm de profondeur, dans un endroit ensoleillé et humide (fond de vallée, sol mouillé).",
        "Poser un récipient au centre du trou, et garnir le tour de plantes vertes non toxiques coupées.",
        "Couvrir le trou d'une bâche plastique transparente, bords enterrés pour que ce soit étanche.",
        "Poser un petit caillou au centre de la bâche, juste au-dessus du récipient, pour former un cône.",
        "Attendre : les gouttes coulent vers la pointe du cône et tombent dans le récipient. Relever le soir sans soulever la bâche si possible (un tuyau aide)."],
      attention: ["Rendement de 0,3 à 0,6 litre par jour, pour beaucoup d'effort : en zone tempérée, la pluie est presque toujours une meilleure option.", "Jamais de plantes toxiques dans le trou."] },
    { id: "pierres_chaudes", cat: "Eau", titre: "Faire bouillir sans casserole", illus: "pierres_chaudes",
      intro: "Des pierres chauffées dans le feu, plongées dans l'eau, peuvent la faire bouillir dans n'importe quel récipient qui ne va pas au feu.",
      etapes: [
        "Ramasser des pierres sèches de la taille d'un œuf ou d'un poing, loin de l'eau (jamais de galets de rivière).",
        "Les chauffer au cœur du feu pendant au moins 30 minutes.",
        "Préparer le récipient : bouteille ou gamelle plastique, bol en bois, ou un trou dans le sol tapissé d'une bâche.",
        "Prendre une pierre avec deux bâtons en pince, la secouer pour enlever les cendres, la plonger dans l'eau.",
        "Ajouter les pierres une à une jusqu'à obtenir de gros bouillons, et les maintenir 1 minute."],
      attention: ["Les pierres humides ou poreuses peuvent éclater : se tenir à distance du feu et se protéger les yeux.", "Filtrer ensuite l'eau dans un tissu pour retirer les cendres."] },

    // ================= ABRI =================
    { id: "cold", cat: "Abri", titre: "La règle COLD pour rester au chaud", illus: "cold",
      intro: "Quatre principes des manuels militaires de grand froid, valables dès qu'il fait frais et humide.",
      etapes: [
        "C comme Clean (propre) : des vêtements sales et gras isolent mal, car la saleté écrase les poches d'air qui retiennent la chaleur.",
        "O comme Overheating (éviter de trop chauffer) : ouvrir la veste, enlever une couche, retirer bonnet ou gants dès que l'effort fait transpirer. La sueur mouille les vêtements et refroidit en séchant.",
        "L comme Loose and Layered (amples et en couches) : des vêtements trop serrés coupent la circulation. Plusieurs couches fines valent mieux qu'une épaisse, grâce à l'air emprisonné entre elles.",
        "D comme Dry (au sec) : protéger ses vêtements de la pluie et de la neige, les faire sécher dès que possible. Les chaussettes humides sèchent contre le corps ou sur le sac pendant la marche."],
      attention: ["Ne jamais faire sécher ses chaussures en cuir trop près du feu : elles durcissent et se fendent."] },

    // ================= DÉPLACEMENT =================
    { id: "riviere", cat: "Déplacement", titre: "Traverser un cours d'eau", illus: "traversee",
      intro: "Les traversées de rivière font partie des accidents les plus graves en randonnée. La meilleure décision est souvent de ne pas traverser.",
      etapes: [
        "Ne pas traverser si l'eau est rapide au-dessus des genoux, très froide, trouble (on ne voit pas le fond) ou en crue.",
        "Chercher le bon endroit depuis un point haut : là où la rivière est large et se divise en plusieurs bras, peu profonde, sans rochers glissants, en amont d'un banc de sable ou de gravier.",
        "Éviter les rapides, les seuils rocheux, les abords d'une chute et les remous derrière les gros obstacles.",
        "Garder ses chaussures, détacher la ceinture et la sangle de poitrine du sac pour pouvoir s'en débarrasser.",
        "Traverser face au courant, appuyé sur un bâton solide placé en amont (trois points d'appui), en avançant en biais vers l'aval.",
        "À plusieurs : se tenir épaule contre épaule en ligne dans le sens du courant, le plus solide en amont.",
        "Sécher et réchauffer immédiatement les pieds et les jambes de l'autre côté."],
      attention: ["Si on est emporté : sur le dos, pieds en avant à la surface pour amortir les rochers, et nager en biais vers la rive. Ne jamais essayer de se mettre debout dans un courant fort (risque de coincer un pied)."] },
    { id: "pas", cat: "Déplacement", titre: "Mesurer une distance en comptant ses pas", illus: "pas",
      intro: "Sans GPS, savoir combien de mètres on a parcourus permet de se situer sur la carte.",
      etapes: [
        "S'étalonner avant de partir : marcher 100 m mesurés en comptant un pas à chaque fois que le pied gauche touche le sol (un « double pas »).",
        "La plupart des adultes font 60 à 70 doubles pas pour 100 m sur terrain plat. Noter son chiffre.",
        "En marche, faire un nœud sur une cordelette ou passer un caillou d'une poche à l'autre tous les 100 m.",
        "Corriger selon le terrain : on fait plus de pas en montée, en descente raide, dans la végétation, la neige ou de nuit."],
      attention: [] },
    { id: "recoupement", cat: "Déplacement", titre: "Se situer par recoupement", illus: "recoupement",
      intro: "Avec une carte, une boussole et deux repères visibles, on retrouve sa position exacte.",
      etapes: [
        "Repérer deux éléments bien visibles et faciles à trouver sur la carte (sommet, pylône, clocher, bout de lac), idéalement à 60-90° l'un de l'autre.",
        "Viser le premier avec la boussole et lire son angle (azimut).",
        "Calculer l'angle inverse : ajouter 180° s'il est inférieur à 180°, sinon retirer 180°.",
        "Sur la carte, tracer depuis ce repère une ligne dans la direction de l'angle inverse.",
        "Faire de même avec le second repère : tu te trouves au croisement des deux lignes.",
        "Plus simple : si tu es sur un chemin ou une rivière connue, une seule visée suffit, car tu es au croisement de la ligne et du chemin."],
      attention: [] },
    { id: "navigation", cat: "Déplacement", titre: "Les astuces de navigation", illus: "boussole",
      intro: "Quatre techniques simples pour ne pas rater sa destination.",
      etapes: [
        "La main courante : suivre un élément linéaire (chemin, rivière, lisière, ligne électrique) qui mène près du but, plutôt que de couper à travers bois.",
        "La visée décalée : pour rejoindre un pont sur une rivière, viser volontairement un peu à gauche. En arrivant à la rivière, tu sais qu'il faut tourner à droite.",
        "Le point d'attaque : partir d'un repère évident et proche (carrefour, bout de lac) pour trouver un but discret (une source, une aire de bivouac).",
        "La limite d'arrêt : repérer sur la carte un élément situé juste après le but (ruisseau, route). Si tu l'atteins, tu es allé trop loin."],
      attention: [] },

    // ================= SECOURS =================
    { id: "miroir", cat: "Secours", titre: "Miroir de signalisation", illus: "miroir",
      intro: "Par soleil, un miroir est le meilleur moyen d'être vu de loin : un reflet peut être aperçu à des dizaines de kilomètres.",
      etapes: [
        "À défaut de miroir : l'écran du téléphone, un CD, une couverture de survie, le fond poli d'une gamelle.",
        "Tendre le bras libre devant soi, doigts en V, et placer l'avion ou l'hélicoptère entre les deux doigts.",
        "Avec l'autre main, orienter le miroir pour que la tache de soleil tombe sur la main tendue.",
        "Basculer doucement et en rythme le miroir pour faire passer le reflet de la main vers la cible, puis revenir.",
        "Monter sur un point haut si possible, et viser la direction du bruit si on ne voit pas l'appareil."],
      attention: ["Ne pas faire clignoter très vite, et ne pas garder le reflet sur le cockpit plus de quelques secondes : on éblouirait le pilote."] },
    { id: "solair", cat: "Secours", titre: "Codes sol-air internationaux", illus: "sol_air",
      intro: "Cinq symboles compris par tous les secours aériens, à tracer au sol dans un endroit dégagé.",
      etapes: [
        "V : besoin d'aide.",
        "X : besoin d'assistance médicale.",
        "N : non.",
        "Y : oui.",
        "Flèche : je pars dans cette direction.",
        "Taille : au moins 4 m de large sur 6 m de long (rapport 2:3), avec des traits d'environ 1 m de large.",
        "Matériaux : branches, pierres, vêtements, couverture de survie, herbe piétinée ou neige tassée. Le symbole doit contraster avec le sol : les lignes droites et les angles nets n'existent pas dans la nature et se remarquent."],
      attention: [] },

    // ================= NŒUDS (cordes) =================
    { id: "cordelette", cat: "Nœuds", titre: "Fabriquer une cordelette en ortie", illus: "cordelette",
      intro: "Les longues tiges d'ortie et l'écorce intérieure du tilleul donnent des fibres solides. La technique de la « torsion inversée » permet d'en faire une cordelette.",
      etapes: [
        "Couper de grandes tiges d'ortie en fin d'été ou en automne (avec des gants), et retirer les feuilles.",
        "Écraser chaque tige à plat sur toute sa longueur, l'ouvrir et retirer le cœur ligneux : il reste une bande de fibres.",
        "Laisser sécher un peu les fibres, puis les assouplir entre les doigts.",
        "Plier un faisceau de fibres en deux, pas tout à fait au milieu. Tenir la pliure de la main gauche.",
        "Tordre le brin du haut vers soi, puis le croiser par-dessus l'autre en l'éloignant. Recommencer avec le nouveau brin du haut.",
        "Ajouter de nouvelles fibres avant la fin de chaque brin, en décalé, pour allonger la cordelette.",
        "Tester la solidité en tirant fort et en faisant un nœud : s'il ne casse pas, la cordelette est utilisable."],
      attention: ["Couper uniquement ce dont on a besoin, et jamais d'écorce sur un arbre vivant."] }
  ].forEach(function (t) { t.source = SRC; window.SYLVA_TECHNIQUES.push(t); });

  // Correction : taille officielle des signaux au sol
  window.SYLVA_TECHNIQUES.forEach(function (t) {
    if (t.id === "signaux") t.etapes = t.etapes.map(function (e) {
      return e.indexOf("Au sol, symboles de 3 m") === 0
        ? "Au sol, symboles d'au moins 4 × 6 m en branches ou pierres : V = besoin d'aide, X = besoin d'assistance médicale (voir la fiche Codes sol-air)."
        : e;
    });
  });
})();

// ---------- v0.8 : premiers secours avancés, nuit sans duvet, chaleur, bois, navigation ----------
(function () {
  var SRC_PS = "Consignes grand public de premiers secours (Croix-Rouge, ERC) recoupées avec le manuel FM 4-25.11 (domaine public)";
  var SRC_FM = "Manuel de survie de l'armée américaine FM 3-05.70 (domaine public), réécrit pour Sylva";
  [
    // ===== PREMIERS SECOURS =====
    { id: "ps_pls", cat: "Premiers secours", titre: "Position latérale de sécurité (PLS)", illus: "pls", source: SRC_PS,
      intro: "Pour une personne inconsciente qui respire : sur le côté, sa langue ne bloque plus sa gorge et elle ne s'étouffe pas si elle vomit.",
      etapes: [
        "Vérifier qu'elle ne répond pas mais respire normalement (regarder le ventre se soulever, écouter, sentir le souffle pendant 10 secondes).",
        "Si elle ne respire pas ou respire mal : appeler le 112 et commencer le massage cardiaque si tu es formé.",
        "Mettre le bras le plus proche de toi à angle droit, paume vers le haut.",
        "Placer le dos de son autre main contre sa joue, de ton côté, et la maintenir.",
        "Relever son genou le plus éloigné, pied au sol, et tirer sur ce genou pour la faire rouler vers toi sur le côté.",
        "Ajuster la jambe du dessus à angle droit et basculer légèrement la tête en arrière, bouche vers le sol.",
        "Appeler le 112, couvrir la personne et vérifier sa respiration régulièrement jusqu'à l'arrivée des secours."],
      attention: ["En cas de chute importante avec suspicion de blessure à la nuque, ne la bouger que si elle risque de s'étouffer ou si l'endroit est dangereux."] },
    { id: "ps_choc", cat: "Premiers secours", titre: "État de choc", illus: "premiers_secours", source: SRC_PS,
      intro: "Après une hémorragie, une brûlure étendue, une fracture ou une forte réaction allergique, le corps peut ne plus irriguer correctement les organes. C'est une urgence vitale.",
      etapes: [
        "Reconnaître les signes : peau pâle, froide et moite, pouls rapide et faible, respiration rapide, soif, angoisse, faiblesse, puis confusion.",
        "Traiter la cause si possible (arrêter un saignement par compression).",
        "Allonger la victime sur le dos, l'isoler du sol, la couvrir.",
        "Si aucune blessure des jambes, du bassin ou du dos : lui surélever les jambes d'environ 30 cm.",
        "Ne rien lui donner à boire ni à manger, lui parler, la rassurer.",
        "Appeler le 112 et surveiller sa respiration en continu."],
      attention: ["Une victime en état de choc peut s'aggraver très vite : ne jamais la laisser seule si c'est possible."] },
    { id: "ps_attelle", cat: "Premiers secours", titre: "Immobiliser un membre (attelle de fortune)", illus: "attelle", source: SRC_PS,
      intro: "En cas de fracture ou d'entorse grave, immobiliser le membre limite la douleur et les lésions pendant l'attente ou le transport.",
      etapes: [
        "Ne pas chercher à remettre un os ou une articulation en place : immobiliser dans la position trouvée.",
        "Préparer deux attelles rigides (bâtons, bâtons de marche, matelas mousse roulé, carton) assez longues pour bloquer l'articulation au-dessus ET en dessous de la blessure.",
        "Rembourrer avec des vêtements, surtout aux os qui dépassent (chevilles, genoux, poignets).",
        "Attacher avec des bandes, foulards ou cordelette, au-dessus et en dessous de la blessure, jamais directement dessus.",
        "Bras : après l'attelle, soutenir l'avant-bras plié en écharpe (veste, foulard) contre le corps.",
        "Vérifier toutes les 15 minutes que les doigts ou orteils restent chauds, roses et sensibles : sinon, desserrer."],
      attention: ["Fracture ouverte (os visible) : couvrir la plaie d'un tissu propre sans appuyer sur l'os, et appeler le 112."] },
    { id: "ps_brancard", cat: "Premiers secours", titre: "Brancard de fortune", illus: "brancard", source: SRC_PS,
      intro: "Transporter un blessé est épuisant et risqué : à faire seulement si les secours ne peuvent pas venir ou si l'endroit est dangereux.",
      etapes: [
        "Trouver deux perches solides de 2 m environ (bois mort sain, bâtons de randonnée assemblés).",
        "Méthode des vestes : fermer 2 ou 3 vestes, retourner les manches à l'intérieur et enfiler les perches dans les manches.",
        "Méthode de la bâche : poser une perche au tiers de la bâche, replier, poser la seconde perche, replier le reste par-dessus : le poids du blessé bloque le tissu.",
        "Tester le brancard avec une personne valide avant d'y installer le blessé.",
        "Porter à 4 si possible (2 suffisent sur terrain facile), en marchant en décalé, et faire des pauses fréquentes.",
        "En pente, garder la tête du blessé vers le haut. Le couvrir et vérifier sa respiration à chaque pause."],
      attention: ["Ne pas déplacer une victime qui a pu se blesser à la colonne vertébrale, sauf danger immédiat."] },
    { id: "ps_laisser", cat: "Premiers secours", titre: "Laisser une victime pour chercher les secours", illus: "urgence", source: SRC_PS,
      intro: "Si personne ne peut appeler et que tu es seul avec un blessé, il faudra peut-être partir chercher de l'aide. Bien préparer ce départ peut lui sauver la vie.",
      etapes: [
        "D'abord, tout essayer pour appeler : 112, SMS, monter sur un point haut, attendre un passage sur le sentier.",
        "Installer la victime : à l'abri, isolée du sol, couverte (couverture de survie, vêtements secs), en PLS si elle est inconsciente.",
        "Laisser à portée de main : eau, nourriture, lampe, sifflet, un vêtement chaud supplémentaire.",
        "Noter sa position exacte (coordonnées GPS dans le bouton SOS, ou repères précis) et l'écrire.",
        "Laisser un mot visible : heure de départ, état de la victime, direction prise.",
        "Baliser le chemin (branches, rubalise) pour guider les secours au retour, et partir vers l'endroit le plus proche où appeler."],
      attention: ["Si le groupe compte au moins trois personnes : une reste avec la victime, les deux autres partent ensemble."] },

    // ===== ABRI =====
    { id: "nuit_sans_duvet", cat: "Abri", titre: "Passer la nuit sans sac de couchage", illus: "abri_debris", source: SRC_FM,
      intro: "Une nuit imprévue dehors, sans duvet : l'objectif est de ne pas perdre sa chaleur, ni par le sol, ni par le vent, ni par l'humidité.",
      etapes: [
        "S'arrêter avant la nuit et avant d'être épuisé, pour avoir le temps de préparer.",
        "Isoler du sol en priorité : une couche épaisse (20 à 30 cm tassés) de feuilles mortes, fougères ou branchages fins, ou le sac à dos vidé.",
        "Se mettre à l'abri du vent : creux de terrain, gros tronc, rocher, abri de bâche ou de branchages.",
        "Enfiler tous ses vêtements secs. Bourrer de feuilles sèches l'espace entre deux couches de vêtements : elles emprisonnent l'air comme un duvet.",
        "S'envelopper dans la couverture de survie ou un grand sac poubelle, la tête couverte.",
        "Manger et boire avant de dormir, et bouger (contracter les muscles) dès que le froid réveille.",
        "Se serrer les uns contre les autres si on est plusieurs."],
      attention: ["Si un feu est possible et autorisé : un feu le long du corps avec un mur réflecteur derrière soi, à bonne distance de l'abri."] },
    { id: "chaleur", cat: "Abri", titre: "Se protéger de la chaleur", illus: "ombre", source: SRC_FM,
      intro: "En été, la chaleur et le soleil épuisent plus vite que le froid. L'ombre et le calme sont les meilleurs alliés.",
      etapes: [
        "Marcher tôt le matin et en fin de journée, s'arrêter à l'ombre pendant les heures chaudes.",
        "Couvrir la tête et la nuque, porter des vêtements amples et clairs, garder les manches longues contre le soleil.",
        "Faire une ombre efficace : tendre une bâche à au moins 50 cm du sol pour laisser circuler l'air. Avec deux toiles superposées et espacées de 20 à 30 cm, l'ombre est nettement plus fraîche.",
        "Ne pas s'allonger à même le sol brûlant : s'isoler avec le sac ou des branchages.",
        "Boire régulièrement avant d'avoir soif, et manger salé.",
        "Mouiller un foulard ou un t-shirt : l'évaporation rafraîchit."],
      attention: ["Peau chaude et sèche, maux de tête violents, confusion : coup de chaleur, urgence vitale. Ombre, eau sur la peau, ventiler, 112."] },

    // ===== FEU =====
    { id: "essences_bois", cat: "Feu", titre: "Choisir son bois de chauffe", illus: "feu_preparation", source: SRC_FM,
      intro: "Toutes les essences ne brûlent pas pareil. Savoir lesquelles choisir économise du bois et de l'énergie.",
      etapes: [
        "Pour démarrer : bouleau (son écorce brûle même humide), brindilles d'épicéa et de pin (résineuses, elles prennent vite), noisetier fin.",
        "Pour durer et faire de la braise : hêtre, chêne, charme et frêne, des bois durs qui brûlent longtemps et donnent une chaleur régulière.",
        "À éviter en bûches : les résineux (pin, épicéa), qui crépitent, projettent des étincelles et noircissent les casseroles ; le peuplier, le saule et l'aulne, qui brûlent trop vite.",
        "Reconnaître le bois sec : il est léger, sonne clair quand on cogne deux morceaux, casse net, et l'écorce se détache facilement.",
        "Ne jamais brûler d'if, de laurier-rose, de laurier-cerise ni de bois traité ou peint : leurs fumées sont toxiques."],
      attention: ["Toujours du bois mort ramassé au sol ou sec sur pied, jamais d'arbre vivant."] },

    // ===== DÉPLACEMENT =====
    { id: "contourner", cat: "Déplacement", titre: "Contourner un obstacle sans perdre le cap", illus: "contourner", source: "Manuels de lecture de carte et navigation de l'armée américaine (domaine public), réécrits pour Sylva",
      intro: "Un marécage ou un ravin sur ta route ? Avec la boussole et tes pas, tu peux le contourner et retrouver exactement ta direction.",
      etapes: [
        "Arrivé à l'obstacle, tourner de 90° (à droite par exemple) et marcher en comptant ses pas jusqu'à avoir dépassé l'obstacle.",
        "Reprendre ta direction d'origine et marcher jusqu'à dépasser l'obstacle de l'autre côté.",
        "Tourner de 90° dans l'autre sens (à gauche) et marcher le MÊME nombre de pas qu'à l'aller.",
        "Reprendre ta direction d'origine : tu es de nouveau sur ta ligne de marche.",
        "Plus simple quand on voit loin : repérer un arbre ou un rocher de l'autre côté de l'obstacle, sur la ligne, en faire le tour et viser à nouveau depuis ce repère."],
      attention: [] }
  ].forEach(function (t) { window.SYLVA_TECHNIQUES.push(t); });
})();
