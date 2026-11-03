// Sylva – Guide de survie complet (contenu original rédigé pour Sylva).
// Références : manuels de l'armée américaine FM 21-76 / FM 3-05.70 et FM 4-25.11 (domaine public),
// Centre Antipoisons belge, consignes de premiers secours grand public, réglementations nationales.
// Format d'une section : { titre, p: [paragraphes], liste: [puces], etapes: [étapes numérotées],
//                          encadre: { type: "retenir" | "astuce" | "danger", titre, texte } }
window.SYLVA_GUIDE = [];
(function () {
  var G = window.SYLVA_GUIDE;

  // =====================================================================
  G.push({
    id: "mental", num: 1, titre: "Le mental et les priorités", illus: "stop",
    resume: "Garder la tête froide, savoir quoi faire en premier, décider de rester ou de partir.",
    sections: [
      { titre: "La survie commence dans la tête",
        p: ["Dans la plupart des situations de survie, ce n'est ni le froid ni la faim qui fait basculer les choses, mais la panique : on se précipite, on se disperse, on prend une mauvaise direction, on oublie de manger ou de s'abriter.",
            "Le premier réflexe à acquérir est donc de ralentir. Une situation qui paraît catastrophique devient souvent gérable dès qu'on la découpe en petits problèmes simples, traités dans le bon ordre."] },
      { titre: "La méthode STOP",
        etapes: ["S'arrêter : ne plus bouger, s'asseoir, boire une gorgée d'eau, respirer lentement.",
                 "Penser : qu'est-ce qui s'est passé ? Qu'est-ce qui est vraiment urgent ? Qui sait où je suis ?",
                 "Observer : l'environnement (abri, eau, bois, dangers), la météo, l'heure du coucher du soleil, son matériel, son état physique.",
                 "Planifier : décider des 2 ou 3 prochaines actions seulement, puis agir calmement."],
        encadre: { type: "retenir", titre: "À retenir", texte: "S'arrêter cinq minutes ne fait jamais perdre de temps. Partir dans la mauvaise direction, si." } },
      { titre: "L'ordre des priorités",
        p: ["La règle des 3 donne l'ordre logique : on meurt en 3 minutes sans air, en 3 heures sans protection par temps froid et humide, en 3 jours sans eau et en 3 semaines sans nourriture. Concrètement, sous nos climats :"],
        etapes: ["Les urgences vitales : saignement, blessure grave, personne inconsciente (voir Premiers secours).",
                 "Se protéger du froid et de l'humidité : vêtements secs, abri, isolation du sol.",
                 "Se signaler et prévenir les secours si c'est nécessaire.",
                 "L'eau : en trouver et la rendre potable.",
                 "Le feu : chaleur, moral, eau bouillie, signal.",
                 "La nourriture, en dernier : elle n'est presque jamais l'urgence."] },
      { titre: "Rester ou partir ?",
        p: ["Si quelqu'un connaît ton itinéraire et ton heure de retour, rester sur place est presque toujours la meilleure décision : les secours cherchent d'abord autour du trajet prévu, et une personne immobile et visible se retrouve beaucoup plus vite.",
            "Partir se justifie si l'endroit est dangereux (crue, chute de pierres, froid extrême sans abri possible), si personne ne te cherchera, ou si tu sais exactement où aller et que tu peux y arriver avant la nuit."],
        encadre: { type: "astuce", titre: "Astuce", texte: "Si tu pars, laisse un message bien visible (branches en flèche, mot sous une pierre) indiquant ta direction et l'heure." } },
      { titre: "Garder le moral",
        liste: ["Se fixer de petits objectifs atteignables : ramasser le bois, puis monter l'abri, puis faire bouillir l'eau.",
                "Garder une routine : manger à heure fixe, ranger son camp, entretenir le feu.",
                "Parler (à voix haute s'il le faut), chanter, écrire ce qu'on fait : ça occupe l'esprit et aide à raisonner.",
                "Prendre soin de soi : un visage lavé, des pieds secs, une boisson chaude changent tout.",
                "En groupe : répartir les rôles, prendre les décisions ensemble, surveiller les plus fragiles."] }
    ],
    fiches: ["priorites", "urgence"], especes: []
  });

  // =====================================================================
  G.push({
    id: "preparer", num: 2, titre: "Préparer sa sortie", illus: "kit",
    resume: "Itinéraire, personne à prévenir, kit de survie de poche, vêtements : 90 % de la sécurité se joue avant de partir.",
    sections: [
      { titre: "Prévenir quelqu'un",
        p: ["C'est la règle la plus importante de tout ce guide. Avant chaque sortie, donne à un proche : l'itinéraire prévu, l'endroit où tu dors, l'heure de retour, et l'heure à partir de laquelle il doit appeler les secours si tu n'as pas donné de nouvelles."],
        encadre: { type: "retenir", titre: "À retenir", texte: "Une personne qui sait où tu es vaut mieux que tout le matériel du monde." } },
      { titre: "Préparer l'itinéraire",
        liste: ["Vérifier les règles du lieu : bivouac autorisé, feu, zones protégées (voir chapitre Loi et éthique).",
                "Repérer les points d'eau, les sorties de secours (routes, villages) et les zones sans réseau.",
                "Consulter la météo de la veille et du jour même, et l'heure du coucher du soleil (onglet Bivouac).",
                "Prévoir large : on avance moins vite qu'on ne pense avec un sac chargé, en forêt ou de nuit.",
                "Garder la carte en cache dans Sylva et emporter une carte papier."] },
      { titre: "Le kit de survie de poche",
        p: ["Un petit étui étanche qui ne quitte jamais la poche ou la ceinture, même pour une courte balade. S'il est dans le sac et que le sac est perdu, il ne sert à rien."],
        liste: ["Briquet + pierre à feu (ferrocérium) + quelques allume-feu",
                "Couverture de survie",
                "Sifflet",
                "Petite lampe ou frontale",
                "Couteau ou multi-outil",
                "5 m de cordelette solide",
                "Pastilles de purification d'eau",
                "Quelques pansements, compresses et un tire-tique",
                "Une barre énergétique",
                "Un crayon et un papier imperméable"] },
      { titre: "S'habiller en couches",
        p: ["Le corps se refroidit vite quand il est mouillé, par la pluie ou par la transpiration. Plutôt qu'un seul gros vêtement, on superpose des couches qu'on enlève et remet selon l'effort et la météo."],
        etapes: ["Sous-couche près du corps : laine mérinos ou synthétique, jamais de coton (il garde l'humidité et refroidit).",
                 "Couche chaude : polaire ou doudoune.",
                 "Coque : veste et pantalon imperméables et coupe-vent."],
        encadre: { type: "astuce", titre: "Astuce", texte: "Enlever une couche AVANT de transpirer en montée, la remettre DÈS l'arrêt. Garder une tenue sèche dans un sac étanche, uniquement pour la nuit." } },
      { titre: "Le sac de bivouac",
        p: ["La checklist complète, modifiable et avec tes photos, se trouve dans l'onglet Bivouac. Les essentiels : abri (tente ou bâche), couchage adapté à la température de la nuit, matelas isolant, réchaud, eau, frontale, trousse de secours, téléphone chargé et batterie externe."] }
    ],
    fiches: ["ferro", "signaux"], especes: []
  });

  // =====================================================================
  G.push({
    id: "campement", num: 3, titre: "Le campement", illus: "camp",
    resume: "Choisir l'emplacement, organiser son camp, bien dormir au chaud et au sec.",
    sections: [
      { titre: "Arriver tôt",
        p: ["Monter un camp de nuit, sous la pluie et fatigué, c'est la meilleure façon de mal dormir et de se mettre en danger. Prévois d'arriver au moins 1 h 30 avant le coucher du soleil (affiché dans l'onglet Bivouac). En hiver, la nuit tombe parfois avant 17 h."] },
      { titre: "Choisir l'emplacement",
        liste: ["Légal : aire de bivouac, terrain privé avec accord, ou zone où le bivouac est toléré.",
                "Au-dessus de toi : aucune branche morte ni arbre mort ou penché. Ces branches tombent sans prévenir, surtout par vent.",
                "Sous toi : sol plat, sans racines ni cailloux, légèrement bombé pour que l'eau s'écoule. Pas dans une cuvette.",
                "Autour : pas au fond d'une vallée (l'air froid y descend la nuit) ni au bord immédiat d'une rivière (humidité, montée des eaux).",
                "Abrité du vent dominant par un relief, un bosquet ou un rocher.",
                "Pas sur un sentier de faune, près d'un terrier ou d'un nid de guêpes ou de chenilles processionnaires.",
                "À plus de 50 m de l'eau, pour la protéger et pour ne pas gêner les animaux qui viennent boire."] },
      { titre: "Organiser son camp",
        p: ["Un camp bien organisé, c'est moins de matériel perdu et moins d'accidents. On place les zones les unes par rapport aux autres en tenant compte du vent :"],
        liste: ["Zone de couchage : en amont du vent, loin de la fumée.",
                "Zone feu et cuisine (si autorisée) : sous le vent, à 3 m au moins de la tente.",
                "Réserve de bois : à portée du feu mais pas trop près, à l'abri de la pluie.",
                "Zone eau : gourdes et eau bouillie séparées de l'eau brute, pour ne jamais les confondre.",
                "Toilettes : à plus de 50 m du camp et de l'eau, sous le vent.",
                "Nourriture : fermée, suspendue ou rangée hors de la tente la nuit (sangliers, renards, rongeurs)."],
        encadre: { type: "astuce", titre: "Astuce", texte: "Toujours ranger frontale, couteau et gourde au même endroit dans la tente : on les retrouve dans le noir." } },
      { titre: "Bien dormir au chaud",
        etapes: ["Isoler du sol : le sol froid aspire ta chaleur bien plus vite que l'air. Matelas isolant, et à défaut 20 à 30 cm de feuilles mortes, fougères ou aiguilles sèches.",
                 "Manger un repas gras et sucré avant de dormir : le corps produit de la chaleur en digérant.",
                 "Boire chaud, puis aller aux toilettes avant de se coucher : garder une vessie pleine refroidit.",
                 "Dormir avec un bonnet, des chaussettes sèches et la tenue sèche réservée à la nuit.",
                 "Glisser dans le sac de couchage une gourde d'eau chaude bien fermée (bouillotte).",
                 "Ne jamais dormir avec des vêtements humides de la journée."] },
      { titre: "Gérer l'humidité",
        p: ["L'humidité est l'ennemie numéro un en bivouac sous nos climats. La condensation se forme à l'intérieur de la tente quand l'air chaud et humide de la respiration touche la toile froide."],
        liste: ["Garder une aération ouverte, même par froid.",
                "Ne pas cuisiner ni faire sécher de vêtements dans la tente.",
                "Essuyer la condensation le matin avec un petit chiffon.",
                "Laisser sécher le duvet au soleil ou à l'air dès que possible."] },
      { titre: "Lever le camp",
        p: ["Le matin, on démonte dans l'ordre inverse, on vérifie que le feu est totalement éteint, on remporte tout, et on remet l'emplacement dans l'état où on l'a trouvé : herbes redressées, feuilles éparpillées. Le meilleur bivouac est celui dont personne ne peut deviner l'existence."] }
    ],
    fiches: ["abri", "froid", "bache", "tendeur", "traces"], especes: ["sanglier", "renard", "processionnaire"]
  });

  // =====================================================================
  G.push({
    id: "abris", num: 4, titre: "Les abris", illus: "abri_debris",
    resume: "Tente, bâche, abris naturels et abris d'urgence : se protéger du vent, de la pluie et du froid.",
    sections: [
      { titre: "À quoi sert un abri",
        p: ["Un abri ne sert pas seulement contre la pluie. Il coupe le vent (qui peut diviser par deux la température ressentie), conserve la chaleur du corps et isole du sol. Un bon abri est donc petit, étanche, à l'abri du vent et bien isolé par-dessous."],
        encadre: { type: "retenir", titre: "À retenir", texte: "Plus un abri est petit, plus il est chaud. On construit pour son corps, pas pour le confort." } },
      { titre: "Avec une bâche",
        p: ["Une bâche de 3 × 3 m et 15 m de cordelette permettent de nombreuses configurations. Les plus utiles :"],
        liste: ["L'abri en A : corde tendue entre deux arbres, bâche à cheval, bords piquetés. Protège de tous les côtés sauf les extrémités.",
                "L'appentis : la bâche tendue en pente d'un seul côté, ouvert face au feu (là où il est autorisé). Bonne vue, mais exposé au vent.",
                "L'appentis fermé : comme l'appentis, avec un côté rabattu au sol face au vent dominant.",
                "Le toit simple : bâche tendue à plat, en pente légère, pour se protéger en journée ou au-dessus d'un hamac."],
        encadre: { type: "astuce", titre: "Astuce", texte: "Tendre la ligne de faîtière avec un nœud de camionneur, régler les haubans avec des nœuds tendeurs : la bâche ne battra pas au vent." } },
      { titre: "Les abris naturels",
        p: ["Sans matériel, la forêt fournit tout. Ces abris demandent du temps (1 à 3 heures) et de l'énergie : commence-les bien avant la nuit. À réserver aux vraies situations d'urgence ou aux terrains où c'est autorisé, avec du bois mort uniquement."],
        liste: ["La hutte de débris : une poutre appuyée sur une souche, des côtes de chaque côté, et une couche épaisse de feuilles mortes. L'abri sans matériel le plus chaud.",
                "L'appentis en branchages : une perche entre deux arbres, des perches appuyées, couvertes de branchages comme des tuiles.",
                "Les abris existants : surplomb rocheux, gros arbre tombé. Vérifier qu'ils sont stables et qu'aucun animal ne les occupe."] },
      { titre: "Abris d'urgence en 5 minutes",
        liste: ["La couverture de survie : s'y enrouler serré en couvrant aussi la tête. Le sens doré ou argenté compte peu : l'essentiel est d'être bien emballé, à l'abri du vent et isolé du sol.",
                "Le grand sac poubelle : on y perce un trou pour la tête, et il devient un poncho qui coupe le vent et la pluie.",
                "Le sac à dos vidé sous les jambes et les pieds, pour isoler du sol.",
                "Le creux au pied d'un gros conifère : les branches basses forment un toit naturel."],
        encadre: { type: "danger", titre: "Attention", texte: "Une couverture de survie sans isolation du sol ne suffit pas : on perd beaucoup de chaleur par contact avec le sol froid et mouillé." } },
      { titre: "Isoler le sol, toujours",
        p: ["Quel que soit l'abri, la couche sous le corps compte autant que le toit. Feuilles mortes sèches, fougères, aiguilles de pin ou branchages fins : il en faut 20 à 30 cm, car elles se tassent sous le poids. Une couche qui paraît énorme le soir fait souvent 5 cm le matin."] }
    ],
    fiches: ["bache", "appentis", "debris", "abri", "camionneur", "tendeur", "tourmort"], especes: []
  });

  // =====================================================================
  G.push({
    id: "feu", num: 5, titre: "Le feu", illus: "feu_tipi",
    resume: "Comprendre le feu, l'allumer même mouillé, l'entretenir, cuisiner et l'éteindre. Toujours là où c'est permis.",
    sections: [
      { titre: "D'abord : a-t-on le droit ?",
        p: ["Le feu en forêt est interdit ou très encadré presque partout en Europe : en Wallonie, uniquement aux emplacements prévus ; en France, interdit dans les bois et à moins de 200 m pour qui n'en est pas propriétaire, avec des interdictions totales en été dans de nombreux départements. Un réchaud reste la solution normale pour cuisiner en bivouac.",
            "En situation de détresse réelle (hypothermie, nuit imprévue), faire un feu prudent et contrôlé peut sauver une vie : c'est alors un outil de survie, pas une activité de loisir."],
        encadre: { type: "danger", titre: "Attention", texte: "Jamais de feu par sécheresse, par vent fort, sous des branches basses, sur de la tourbe, près de la tente ou à l'intérieur d'un abri fermé." } },
      { titre: "Le triangle du feu",
        p: ["Un feu a besoin de trois choses : du combustible, de la chaleur et de l'oxygène. Si une seule manque, il s'éteint. La plupart des échecs viennent d'un combustible trop gros ou trop humide (pas assez de chaleur pour l'enflammer) ou d'un feu tassé (pas assez d'air)."] },
      { titre: "Les trois matériaux",
        liste: ["L'amadou : ce qui s'enflamme avec une étincelle ou une flamme. Écorce de bouleau (brûle même humide grâce à ses huiles), herbes sèches, duvet de chardon ou de massette, copeaux très fins, coton imbibé de vaseline (à préparer à la maison).",
                "Le petit bois : des brindilles de l'épaisseur d'une allumette à celle d'un crayon. Les brindilles mortes encore sur l'arbre, en bas des épicéas, sont les plus sèches.",
                "Le bois de chauffe : de l'épaisseur d'un pouce à celle d'un poignet, puis plus gros. Uniquement du bois mort ; le bois qui casse net avec un bruit sec est sec, celui qui plie est humide."],
        encadre: { type: "retenir", titre: "À retenir", texte: "Prépare deux fois plus de chaque matériau que nécessaire AVANT d'allumer. Courir chercher du bois pendant que la flamme meurt, c'est recommencer." } },
      { titre: "Les moyens d'allumage",
        liste: ["Le briquet : le plus simple. À garder au chaud dans une poche intérieure (le gaz fonctionne mal au froid).",
                "Les allumettes tempête : brûlent même sous la pluie, à garder dans une boîte étanche.",
                "La pierre à feu (ferrocérium) : fonctionne mouillée et des milliers de fois. Il faut un amadou très fin.",
                "La loupe ou le fond d'une canette poli : uniquement par grand soleil.",
                "La friction (archet, foret) : très difficile, demande du bois parfaitement sec et beaucoup d'entraînement. À apprendre à la maison, pas le jour où on en a besoin."] },
      { titre: "Monter le feu",
        p: ["Le tipi est la structure de départ idéale : la flamme monte au centre et attrape le bois disposé en cône. Quand le feu est bien pris, on peut passer à une cabane de rondins croisés qui donnera des braises durables pour cuisiner, ou à un feu en étoile (de grosses bûches dont on pousse les bouts vers le centre) pour tenir toute la nuit avec peu de bois."],
        etapes: ["Dégager le sol jusqu'à la terre nue, ou construire une plateforme de bâtons sur sol mouillé.",
                 "Placer l'amadou au centre, le petit bois le plus fin en cône autour, ouvert côté vent.",
                 "Allumer au ras du sol, protéger la flamme du vent avec son corps.",
                 "Ajouter progressivement du bois plus gros sans écraser la structure, souffler doucement à la base.",
                 "Ne jamais laisser un feu sans surveillance."] },
      { titre: "Par temps humide",
        liste: ["Chercher le sec : brindilles mortes sous les conifères, écorce de bouleau, intérieur des souches mortes.",
                "Fendre le bois mort : le cœur est sec même quand l'extérieur est trempé.",
                "Faire des bâtons plumes : tailler de longs copeaux fins sans les détacher du bâton (voir chapitre Couteau).",
                "Allumer sur une plateforme de bâtons et non sur la terre mouillée.",
                "Faire sécher le bois suivant autour du feu, sans le mettre dedans."] },
      { titre: "Utiliser le feu",
        liste: ["Se chauffer : un mur de bûches, une paroi de rochers ou une bâche derrière le feu renvoie la chaleur vers soi (feu réflecteur).",
                "Bouillir l'eau : la seule méthode improvisée vraiment sûre.",
                "Cuisiner : sur les braises, pas sur les flammes (voir chapitre Cuisine).",
                "Sécher vêtements et chaussettes, à distance raisonnable : le synthétique fond vite.",
                "Se signaler : de la fumée blanche le jour (ajouter des feuilles vertes), une flamme vive la nuit."] },
      { titre: "Éteindre complètement",
        etapes: ["Arrêter d'ajouter du bois une heure avant de partir ou de dormir.",
                 "Noyer les braises avec beaucoup d'eau.",
                 "Remuer avec un bâton et noyer encore.",
                 "Poser le dos de la main au-dessus : aucune chaleur ne doit se faire sentir.",
                 "Disperser les cendres froides et effacer les traces."],
        encadre: { type: "danger", titre: "Attention", texte: "Un feu « éteint » couvert de terre peut couver des heures sous le sol et repartir. Toujours noyer et remuer." } }
    ],
    fiches: ["feu", "tipi", "cabane", "ferro", "feupluie"], especes: ["hetre", "pin"]
  });
})();

(function () {
  var G = window.SYLVA_GUIDE;

  // =====================================================================
  G.push({
    id: "eau_guide", num: 6, titre: "L'eau", illus: "eau_ebullition",
    resume: "Combien boire, reconnaître la déshydratation, trouver de l'eau et la rendre potable.",
    sections: [
      { titre: "Combien boire",
        p: ["Au repos et par temps doux, un adulte a besoin d'environ 2 à 3 litres d'eau par jour. L'effort, la chaleur, le froid sec et l'altitude augmentent fortement ces besoins. Mieux vaut boire souvent de petites quantités qu'un litre d'un coup."],
        encadre: { type: "astuce", titre: "Astuce", texte: "En survie, on ne rationne pas l'eau qu'on a : on rationne la transpiration. Se mettre à l'ombre, ralentir, garder sa tête couverte." } },
      { titre: "Reconnaître la déshydratation",
        liste: ["Soif, bouche sèche, urines foncées et peu abondantes : boire sans attendre.",
                "Maux de tête, fatigue, crampes, irritabilité : déshydratation installée.",
                "Confusion, vertiges, absence d'urine : urgence, appeler les secours."] },
      { titre: "Trouver de l'eau",
        liste: ["Sources, ruisseaux et rivières : privilégier l'eau qui coule, en amont des villages, pâtures et campements.",
                "Les fonds de vallée, la végétation plus verte et dense, les vols d'insectes et d'oiseaux le matin et le soir indiquent souvent de l'eau.",
                "L'eau de pluie, récoltée avec une bâche : la source improvisée la plus généreuse.",
                "La rosée du matin, récoltée avec un tissu : un appoint très limité.",
                "Les points d'eau potable référencés : affichés sur la carte de Sylva (couche « Eau potable »)."],
        encadre: { type: "danger", titre: "Attention", texte: "Éviter l'eau stagnante, l'eau près des champs cultivés (pesticides), des routes ou des sites industriels, et l'eau de mer (qui aggrave la déshydratation)." } },
      { titre: "Rendre l'eau potable",
        p: ["Même la plus claire des eaux sauvages peut contenir des bactéries, des virus ou des parasites (comme Giardia) qui provoquent des diarrhées graves, et qui aggravent alors la déshydratation."],
        liste: ["L'ébullition : 1 minute à gros bouillons (3 minutes au-dessus de 2 000 m). La seule méthode improvisée totalement sûre contre les microbes.",
                "Le filtre de randonnée : efficace contre bactéries et parasites, pas toujours contre les virus selon le modèle.",
                "Les pastilles (chlore, dioxyde de chlore) : respecter le temps d'attente indiqué, plus long si l'eau est froide.",
                "Le préfiltrage (tissu, filtre sable-charbon) : clarifie l'eau trouble mais ne la désinfecte pas. Toujours bouillir après."],
        encadre: { type: "retenir", titre: "À retenir", texte: "Aucune méthode improvisée ne retire les polluants chimiques. Dans le doute sur l'origine d'une eau, chercher une autre source." } },
      { titre: "Les méthodes de récupération",
        p: ["Quand il n'y a pas d'eau courante, on peut en récupérer un peu. Selon une revue scientifique de 2025, voici ce qu'on peut en attendre :"],
        liste: ["Eau de pluie : environ 5 à 10 litres par averse avec une bâche. De loin la plus rentable.",
                "Sac de transpiration sur une branche : de quelques décilitres à 1 litre par jour, au soleil.",
                "Alambic solaire (trou + plastique) : 0,3 à 0,6 litre par jour, en dépensant beaucoup d'énergie à creuser. Rarement rentable sous nos climats.",
                "Rosée : de l'ordre d'un verre. Un simple complément."] }
    ],
    fiches: ["eau", "filtre", "pluie", "transpiration", "rosee"], especes: ["cresson"]
  });

  // =====================================================================
  G.push({
    id: "nourriture", num: 7, titre: "Se nourrir", illus: "cueillette",
    resume: "Pourquoi la nourriture passe après tout le reste, cueillir sans s'empoisonner, et ce que dit la loi.",
    sections: [
      { titre: "Une priorité faible… mais pas nulle",
        p: ["Un adulte en bonne santé peut tenir plusieurs semaines sans manger. Sur un bivouac de quelques jours, la faim est surtout un problème de confort et de moral. En revanche, manger aide à lutter contre le froid : par temps froid, le corps a besoin de bien plus d'énergie pour maintenir sa température.",
            "La vraie règle de survie est donc d'emporter ses vivres : des aliments denses en énergie (fruits secs, noix, chocolat, fromage dur, pâtes, flocons d'avoine), et une réserve de secours qui n'est jamais entamée."] },
      { titre: "La règle d'or de la cueillette",
        etapes: ["Ne manger que ce qu'on identifie avec une certitude absolue, en vérifiant plusieurs critères (feuilles, tige, fleur, odeur, milieu), jamais un seul.",
                 "Connaître les sosies dangereux de chaque espèce : c'est l'objet de chaque fiche de Sylva.",
                 "Ne jamais se fier à une seule photo ni à une appli d'identification.",
                 "Éviter tout le groupe des ombellifères (fleurs en ombrelle) : plusieurs sont mortelles et se ressemblent toutes.",
                 "Commencer par une petite quantité d'une espèce nouvelle pour soi, même comestible (allergies, intolérances).",
                 "Laver ou cuire ce qui pousse au ras du sol (parasites transmis par les renards), et éviter les bords de routes et de champs traités."] },
      { titre: "Pourquoi pas le « test universel de comestibilité »",
        p: ["Certains manuels militaires décrivent un test qui consiste à frotter une plante sur la peau, puis la lèvre, puis à en mâcher un peu en attendant plusieurs heures. En Europe, ce test est dangereux : la grande ciguë, l'œnanthe ou l'if peuvent tuer à petites doses, avant même que les symptômes du test n'apparaissent. Et il ne s'applique pas du tout aux champignons."],
        encadre: { type: "danger", titre: "Attention", texte: "Ne jamais goûter une plante ou un champignon inconnu « pour voir ». Pas de certitude, pas de cueillette." } },
      { titre: "Les meilleures ressources sauvages",
        liste: ["Fruits faciles et sans sosie dangereux : mûres, framboises, myrtilles, fraises des bois, noisettes, châtaignes (en vérifiant le marron d'Inde).",
                "Feuilles abondantes et sûres : ortie (cuite), pissenlit, plantain, ail des ours (avec une extrême prudence face au muguet et au colchique).",
                "Fruits d'automne et d'hiver : cynorrhodons, prunelles après les gelées, faînes grillées.",
                "Champignons : uniquement si un mycologue a vérifié la récolte. En vraie situation de survie, l'énergie qu'ils apportent ne vaut pas le risque."] },
      { titre: "Les insectes",
        p: ["Riches en protéines, ils sont la ressource animale la plus accessible et la plus sûre en vraie situation de détresse. Les sauterelles, criquets, grillons et larves de bois se mangent toujours cuits (grillés), en retirant pattes et ailes. On écarte les insectes aux couleurs vives, poilus, piqueurs ou qui sentent fort, ainsi que les chenilles."] },
      { titre: "Pêche, chasse et pièges : la loi",
        p: ["En Belgique comme en France, en Suisse ou en Allemagne, pêcher demande un permis ou une carte de pêche, et chasser ou poser des pièges sans autorisation relève du braconnage. Les collets et assommoirs décrits dans les manuels de survie ne sont donc à envisager qu'en cas de détresse vitale réelle, et à démonter avant de partir."] }
    ],
    fiches: ["piege", "ps_intox"], especes: ["ortie", "pissenlit", "mure", "chataignier", "aildesours", "noisetier", "eglantier", "cigue", "oenanthe"]
  });

  // =====================================================================
  G.push({
    id: "cuisine", num: 8, titre: "La cuisine de bivouac", illus: "feu_cabane",
    resume: "Cuisiner au réchaud ou sur les braises, sans ustensiles, et quelques recettes avec la cueillette.",
    sections: [
      { titre: "Réchaud ou feu ?",
        p: ["Le réchaud (gaz, alcool, bois) est rapide, propre et autorisé là où le feu ne l'est pas. Il reste l'outil principal du bivouac. Le feu de bois est réservé aux emplacements prévus ou aux situations d'urgence.",
            "Avec un réchaud : toujours cuisiner dehors ou sous un auvent bien aéré, jamais dans la tente (incendie et monoxyde de carbone), sur un sol plat et stable, protégé du vent par un pare-vent."] },
      { titre: "Cuire sur le feu",
        liste: ["On cuisine sur les braises, pas sur les flammes : elles chauffent de façon régulière et ne noircissent pas tout.",
                "Pour la casserole : la poser sur deux grosses bûches parallèles ou deux pierres sèches, ou la suspendre à un trépied.",
                "Ne jamais utiliser de pierres de rivière près du feu : l'eau qu'elles contiennent peut les faire éclater.",
                "Ne jamais embrocher la nourriture avec du bois d'if, de laurier-rose ou de laurier-cerise (toxiques)."] },
      { titre: "Cuire sans casserole",
        liste: ["En papillote : envelopper les aliments dans du papier aluminium (ou de grandes feuilles comestibles, comme le tilleul), et les poser dans les braises.",
                "Sur pierre plate : une pierre sèche et plate, chauffée au bord du feu, sert de plancha.",
                "À la broche : sur une branche de noisetier fraîche, au-dessus des braises.",
                "Dans la cendre : les châtaignes incisées, les pommes de terre et les pommes cuisent directement dans les braises."] },
      { titre: "Recettes avec la cueillette",
        liste: ["Soupe d'ortie : jeunes feuilles cueillies avec des gants, bouillies 10 minutes avec un bouillon cube et quelques flocons de purée.",
                "Châtaignes à la braise : inciser chaque châtaigne en croix, 15 à 20 minutes dans les braises en les retournant.",
                "Tisane de pin : une poignée d'aiguilles de pin hachées infusées 10 minutes (attention à l'if).",
                "Infusion de cynorrhodons : fruits ouverts et vidés de leurs poils, bouillis puis filtrés soigneusement dans un tissu.",
                "Pesto d'ail des ours : feuilles identifiées une par une, écrasées avec huile, sel et noisettes."],
        encadre: { type: "retenir", titre: "À retenir", texte: "Chaque ingrédient sauvage doit avoir été identifié avec certitude. En cas de doute sur une seule feuille, tout jeter." } },
      { titre: "Hygiène en cuisine",
        liste: ["Se laver les mains avant de cuisiner (gel hydroalcoolique ou eau savonneuse loin de la rivière).",
                "Faire bouillir l'eau de cuisson et de vaisselle.",
                "Laver la vaisselle à plus de 50 m de l'eau, et filtrer l'eau de vaisselle avant de la disperser.",
                "Remporter tous les restes : ils attirent les animaux."] }
    ],
    fiches: ["cabane", "feu"], especes: ["ortie", "chataignier", "pin", "eglantier", "aildesours", "if", "laurier"]
  });

  // =====================================================================
  G.push({
    id: "orientation_guide", num: 9, titre: "S'orienter", illus: "boussole",
    resume: "Carte et boussole, méthodes naturelles, et que faire quand on est perdu.",
    sections: [
      { titre: "Les bases de la carte",
        liste: ["Le nord est en haut de la carte.",
                "L'échelle : sur une carte au 1:25 000, 1 cm représente 250 m. C'est l'échelle idéale pour la randonnée.",
                "Les courbes de niveau relient les points de même altitude : serrées, la pente est raide ; espacées, le terrain est plat.",
                "Orienter la carte : la tourner pour que ce qu'on voit devant soi soit devant soi sur la carte."] },
      { titre: "Utiliser une boussole",
        etapes: ["Poser la boussole sur la carte, le bord reliant ta position à ta destination.",
                 "Tourner le cadran jusqu'à ce que les lignes nord-sud du cadran soient parallèles aux lignes nord-sud de la carte, flèche vers le nord.",
                 "Prendre la boussole en main, à plat devant soi, et tourner sur soi-même jusqu'à ce que l'aiguille rouge soit dans la flèche du cadran.",
                 "La flèche de direction indique maintenant le chemin. Viser un repère lointain dans cette direction (arbre, rocher), y aller, et recommencer."],
        encadre: { type: "astuce", titre: "Astuce", texte: "En Europe de l'Ouest, l'écart entre le nord magnétique et le nord géographique est aujourd'hui très faible : on peut l'ignorer en randonnée." } },
      { titre: "Les méthodes naturelles",
        liste: ["Le soleil se lève à l'est, est plein sud vers le milieu de la journée et se couche à l'ouest.",
                "La méthode du bâton et de l'ombre donne l'axe est-ouest en 15 minutes.",
                "La montre à aiguilles donne le sud par beau temps.",
                "L'étoile polaire donne le nord la nuit.",
                "La mousse « au nord » des arbres n'est PAS fiable : elle pousse surtout du côté humide, qui varie selon le relief."] },
      { titre: "Quand on est perdu",
        etapes: ["S'arrêter (méthode STOP) : continuer à marcher au hasard aggrave presque toujours la situation.",
                 "Regarder la position GPS dans Sylva : elle fonctionne sans réseau, et la carte reste visible si la zone a été affichée avant.",
                 "Revenir au dernier endroit connu avec certitude, si c'est possible et proche.",
                 "Sinon, chercher une ligne de repère : un chemin, une rivière à suivre vers l'aval, une ligne électrique, une crête.",
                 "Si la nuit approche, s'arrêter, faire un abri et se signaler : on repartira de jour."],
        encadre: { type: "retenir", titre: "À retenir", texte: "Si quelqu'un sait où tu es, rester sur place est presque toujours plus sûr que d'errer." } }
    ],
    fiches: ["orientation", "baton", "polaire"], especes: []
  });

  // =====================================================================
  G.push({
    id: "meteo_dangers", num: 10, titre: "Météo et dangers naturels", illus: "orage",
    resume: "Orage, froid, chaleur, brouillard, crue et vent : anticiper et réagir.",
    sections: [
      { titre: "L'orage",
        p: ["La foudre est l'un des grands dangers de la montagne et des grands espaces ouverts. Compter les secondes entre l'éclair et le tonnerre : moins de 30 secondes, l'orage est à moins de 10 km et on doit déjà être à l'abri. On attend ensuite 30 minutes après le dernier coup de tonnerre avant de repartir."],
        liste: ["Quitter les sommets, crêtes, arbres isolés, lignes de câbles et l'eau (lac, rivière).",
                "En forêt : se placer au milieu d'arbres de même hauteur, dans un creux, loin des plus grands arbres.",
                "S'éloigner des objets métalliques (bâtons, pylônes, clôtures).",
                "Si on est surpris à découvert : s'accroupir, pieds joints, sur son sac ou son matelas, tête rentrée, sans s'allonger.",
                "En groupe : s'espacer de plusieurs mètres pour qu'un seul impact ne touche pas tout le monde."],
        encadre: { type: "danger", titre: "Attention", texte: "Une tente ou une grotte peu profonde ne protègent pas de la foudre. Une voiture fermée, oui." } },
      { titre: "Le froid et l'hypothermie",
        p: ["On peut faire une hypothermie à +10 °C, sous la pluie et dans le vent. Les signes progressent : frissons, gestes maladroits, puis confusion et somnolence. Une personne qui arrête de frissonner alors qu'elle a toujours froid est en grand danger."],
        liste: ["Abriter la victime du vent et de la pluie, l'isoler du sol.",
                "Remplacer les vêtements mouillés par des secs, couvrir la tête.",
                "Donner des boissons chaudes et sucrées si elle est consciente.",
                "Réchauffer doucement : contact corps à corps dans le duvet, bouillottes enveloppées sur le tronc (pas sur les membres).",
                "Appeler le 112 dès qu'il y a confusion ou somnolence."] },
      { titre: "La chaleur",
        liste: ["Partir tôt, faire la pause aux heures chaudes, à l'ombre.",
                "Boire régulièrement avant d'avoir soif, et manger salé.",
                "Signes du coup de chaleur : peau chaude, maux de tête, nausées, confusion. Mettre à l'ombre, rafraîchir avec de l'eau sur la peau et en éventant, appeler le 112 en cas de confusion."] },
      { titre: "Brouillard et nuit",
        liste: ["Le brouillard fait perdre les repères en quelques minutes : s'arrêter, suivre un chemin connu ou la boussole, rester groupés.",
                "De nuit, on avance lentement, frontale allumée, et on ne quitte pas les chemins. Mieux vaut bivouaquer que marcher dans le noir en terrain inconnu."] },
      { titre: "Crues et vent",
        liste: ["Ne jamais camper dans le lit d'une rivière, sur un banc de gravier ou au ras de l'eau : le niveau peut monter très vite après un orage en amont.",
                "Ne jamais traverser une rivière en crue ou dont l'eau dépasse les genoux.",
                "Par vent fort (rafales au-delà de 60 km/h, alertes de l'onglet Bivouac) : éviter la forêt et ne jamais dormir sous les arbres."] }
    ],
    fiches: ["froid", "signaux", "urgence"], especes: []
  });
})();

(function () {
  var G = window.SYLVA_GUIDE;

  // =====================================================================
  G.push({
    id: "couteau", num: 11, titre: "Couteau, outils et nœuds", illus: "plume",
    resume: "Utiliser un couteau en sécurité, tailler un bâton plume, scier, et les nœuds indispensables.",
    sections: [
      { titre: "Choisir son couteau",
        p: ["Un bon couteau de bivouac a une lame fixe ou bien verrouillée de 8 à 10 cm, solide, facile à affûter. Un multi-outil avec une petite scie complète très bien. En Belgique comme ailleurs, un couteau se transporte rangé (dans le sac ou dans son étui) et seulement pour un usage justifié comme le bivouac."] },
      { titre: "Les règles de sécurité",
        liste: ["Toujours couper en éloignant la lame de soi.",
                "Le « cercle de sang » : avant de couper, tendre le bras avec le couteau fermé et tourner sur soi. Personne ne doit se trouver dans ce cercle.",
                "Travailler assis, coudes sur les genoux, la lame à l'extérieur des cuisses (l'artère fémorale passe à l'intérieur).",
                "Ne jamais couper vers sa main qui tient le bois.",
                "Refermer ou ranger le couteau dès qu'on ne s'en sert plus.",
                "Un couteau bien aiguisé est plus sûr qu'un couteau émoussé, qui glisse et oblige à forcer."] },
      { titre: "Le bâton plume",
        p: ["La technique reine pour allumer un feu par temps humide : on transforme un bâton mort en une touffe de copeaux secs qui s'enflamment facilement."],
        etapes: ["Choisir un bâton mort de l'épaisseur d'un pouce, et le fendre pour atteindre le bois sec du cœur.",
                 "Caler le bout du bâton sur une souche ou un rondin, incliné à environ 45°.",
                 "Poser la lame à plat contre le bois et la pousser vers le bas en longs copeaux très fins.",
                 "Arrêter chaque copeau juste avant la base pour qu'il reste attaché.",
                 "Faire 10 à 20 copeaux en tournant le bâton : on obtient une « plume » prête à prendre l'étincelle."] },
      { titre: "Scier et fendre",
        liste: ["La scie pliante est plus sûre et plus efficace que la hache pour du bois de bivouac.",
                "Pour fendre une bûche au couteau (le « batonnage ») : poser la lame sur le bout de la bûche verticale et frapper le dos de la lame avec un autre bâton. Seulement avec un couteau à lame fixe et solide.",
                "Ne jamais couper de bois vivant : il ne brûle pas et c'est interdit."] },
      { titre: "Les nœuds indispensables",
        p: ["Cinq nœuds couvrent presque tous les besoins du bivouac. Leurs fiches détaillées, avec photo, sont dans la catégorie Nœuds."],
        liste: ["Le nœud de chaise : une boucle fixe qui ne glisse pas.",
                "Le tour mort et deux demi-clés : amarrer une corde à un arbre.",
                "Le nœud de camionneur : tendre très fort une ligne de faîtière.",
                "Le nœud tendeur : régler la tension des haubans de la bâche.",
                "Le Prusik : un point d'attache qui coulisse sur une corde tendue."] }
    ],
    fiches: ["chaise", "tourmort", "camionneur", "tendeur", "prusik", "cabestan", "brelagecarre", "feupluie"], especes: []
  });

  // =====================================================================
  G.push({
    id: "hygiene", num: 12, titre: "Hygiène et santé", illus: "traces",
    resume: "Prendre soin de ses pieds, de ses mains et de sa santé pendant plusieurs jours dehors.",
    sections: [
      { titre: "Les pieds avant tout",
        p: ["Des pieds abîmés transforment une sortie en calvaire, et en situation de survie ils peuvent empêcher de rejoindre les secours."],
        liste: ["Garder les pieds secs : changer de chaussettes dès qu'elles sont mouillées, faire sécher la paire humide sur soi ou au soleil.",
                "Traiter les zones qui chauffent AVANT l'ampoule.",
                "Le soir, laver, sécher et aérer ses pieds, et vérifier qu'il n'y a ni ampoule ni tique.",
                "Couper ses ongles courts avant de partir."] },
      { titre: "Mains, dents et toilette",
        liste: ["Se laver les mains après les toilettes et avant de manger : la plupart des diarrhées de bivouac viennent des mains, pas de l'eau.",
                "Se brosser les dents avec de l'eau bouillie ou filtrée, cracher loin des points d'eau.",
                "Toilette au gant ou à la lingette biodégradable, savon loin de la rivière.",
                "Garder une tenue propre et sèche pour la nuit."] },
      { titre: "Les toilettes en pleine nature",
        etapes: ["S'éloigner à plus de 50 m de l'eau, du camp et des chemins.",
                 "Creuser un trou de 15 à 20 cm avec un petit transplantoir ou un bâton.",
                 "Reboucher soigneusement et remettre feuilles ou mousse par-dessus.",
                 "Remporter le papier toilette dans un sachet fermé : il met des mois à disparaître."] },
      { titre: "Les petits ennemis",
        liste: ["Tiques : vérification complète chaque soir (aisselles, aine, derrière les genoux, cuir chevelu), retrait au tire-tique.",
                "Moustiques et taons : vêtements longs au crépuscule, répulsif.",
                "Chenilles processionnaires : ne pas camper sous des arbres colonisés.",
                "Ortie, berce du Caucase : connaître les plantes qui piquent ou brûlent."] },
      { titre: "La trousse de secours",
        liste: ["Pansements de tailles variées, pansements spéciaux ampoules, compresses, bande, sparadrap",
                "Désinfectant, gel hydroalcoolique",
                "Tire-tique, pince à épiler, petits ciseaux",
                "Antidouleur, médicaments personnels",
                "Couverture de survie, gants jetables",
                "Les numéros d'urgence (dans Sylva : bouton SOS et fiche Intoxication)"] }
    ],
    fiches: ["ps_ampoule", "ps_tique", "traces"], especes: ["tique", "processionnaire", "berce"]
  });

  // =====================================================================
  G.push({
    id: "secours_guide", num: 13, titre: "Se signaler et être secouru", illus: "secours_signaux",
    resume: "Appeler les secours, donner sa position, se rendre visible et guider un hélicoptère.",
    sections: [
      { titre: "Appeler",
        etapes: ["Composer le 112 : il fonctionne dans toute l'Europe, et passe par n'importe quel réseau mobile disponible.",
                 "Dire qui on est, ce qui se passe, combien de personnes sont concernées et leur état.",
                 "Donner sa position GPS (bouton SOS de Sylva : coordonnées à lire ou à copier).",
                 "Ne pas raccrocher le premier, et garder le téléphone allumé ensuite."],
        encadre: { type: "astuce", titre: "Astuce", texte: "Si l'appel ne passe pas, un SMS passe parfois là où la voix échoue. Monter sur une hauteur améliore aussi le réseau." } },
      { titre: "Économiser la batterie",
        liste: ["Mode avion entre deux tentatives, luminosité au minimum.",
                "Batterie externe gardée au chaud dans une poche intérieure (le froid vide les batteries).",
                "Convenir d'un horaire d'allumage avec les secours si on est en contact."] },
      { titre: "Se rendre visible",
        liste: ["Tout ce qui va par trois signifie détresse : 3 coups de sifflet, 3 éclats de lampe, 3 feux en triangle.",
                "Au sol, dans une clairière : un grand V (besoin d'aide) ou X (besoin d'assistance médicale) de 3 m en branches, pierres ou vêtements.",
                "Un vêtement ou une couverture de survie de couleur vive, étalé dans un endroit dégagé.",
                "Un miroir ou l'écran du téléphone pour renvoyer le soleil vers un avion ou un hélicoptère.",
                "De jour, une fumée blanche (feuilles vertes sur le feu) ; de nuit, une flamme vive ou la frontale."] },
      { titre: "À l'arrivée d'un hélicoptère",
        liste: ["Se signaler bras en Y levés vers le ciel : « oui, besoin d'aide ». Un seul bras levé, l'autre baissé : « non, pas besoin ».",
                "Attacher ou ranger tout ce qui peut s'envoler (bâche, sacs, couverture de survie).",
                "Ne jamais s'approcher de l'appareil sans le signe de l'équipage, et toujours par l'avant, dans le champ de vision du pilote."] }
    ],
    fiches: ["urgence", "signaux"], especes: []
  });

  // =====================================================================
  G.push({
    id: "loi", num: 14, titre: "Loi et éthique, pays par pays", illus: "traces",
    resume: "Où a-t-on le droit de dormir, faire du feu, cueillir ? Les règles en Belgique, France, Suisse, Allemagne, Pays-Bas et Luxembourg.",
    sections: [
      { titre: "Les grands principes",
        p: ["Dans tous ces pays, la règle de base est la même : on ne peut pas camper n'importe où. Le bivouac (une seule nuit, du soir au matin, sans installation) est parfois toléré là où le camping est interdit. Les réserves naturelles, parcs nationaux et terrains privés ont toujours leurs propres règles. Ces informations sont un résumé : vérifie toujours les règles locales avant de partir."] },
      { titre: "Belgique",
        liste: ["Wallonie : camper en forêt est interdit, sauf dans les aires de bivouac délimitées (affichées sur la carte de Sylva quand elles sont référencées) ou sur un terrain privé avec l'accord du propriétaire.",
                "Flandre : uniquement dans les zones de bivouac prévues.",
                "Feu : interdit en forêt, sauf aux emplacements prévus.",
                "Cueillette : en général tolérée en petite quantité pour sa consommation personnelle, sauf interdiction locale ; interdite dans les réserves naturelles ; accord du propriétaire sur terrain privé."] },
      { titre: "France",
        liste: ["Le bivouac est autorisé là où il n'est pas interdit. Interdictions fréquentes : sites classés et protégés, bord de mer, abords des captages d'eau potable, voies publiques, terrains privés sans accord.",
                "Parcs nationaux : chacun a ses règles. Certains autorisent le bivouac à des horaires précis (souvent de 19 h à 9 h) ou près des refuges, d'autres l'interdisent totalement (Port-Cros, Calanques).",
                "Feu : interdit dans les bois et à moins de 200 m pour qui n'en est pas propriétaire, avec des interdictions renforcées en été."] },
      { titre: "Suisse",
        liste: ["Le camping sauvage n'est pas interdit par une loi fédérale, mais les cantons et les communes fixent les règles, souvent restrictives.",
                "Au-dessus de la limite des forêts, une nuit en petite tente, hors groupe, est généralement tolérée.",
                "Interdit dans les réserves naturelles, le Parc national suisse, les districts francs fédéraux et les zones de tranquillité de la faune."] },
      { titre: "Allemagne",
        liste: ["Pas de règle unique : chaque Land décide. Le camping en forêt demande presque partout l'accord du propriétaire ou de l'administration forestière.",
                "Dormir à la belle étoile une nuit, sans tente (« Biwak »), est souvent toléré hors zones protégées.",
                "Certaines régions proposent des emplacements de bivouac officiels (Trekkingplätze), à réserver."] },
      { titre: "Pays-Bas et Luxembourg",
        liste: ["Pays-Bas : le camping sauvage est interdit. On dort sur les « paalkampeerplaatsen », emplacements de bivouac gratuits et rustiques en forêt.",
                "Luxembourg : considéré comme généralement interdit hors campings ; sur terrain privé, l'accord du propriétaire est requis."] },
      { titre: "Ne laisser aucune trace",
        liste: ["Remporter tous ses déchets, y compris organiques.",
                "Rester discret : arriver tard, partir tôt, pas de musique, petits groupes.",
                "Respecter la faune : ne pas nourrir, ne pas approcher, chiens en laisse.",
                "Cueillir avec modération, jamais les espèces protégées.",
                "Laisser l'endroit plus propre qu'à l'arrivée."],
        encadre: { type: "retenir", titre: "À retenir", texte: "Chaque bivouac mal tenu fait fermer un lieu de plus. Le bivouac reste toléré tant qu'il reste invisible." } }
    ],
    fiches: ["traces", "piege"], especes: []
  });

  // =====================================================================
  G.push({
    id: "secourisme", num: 15, titre: "Premiers secours en pleine nature", illus: "premiers_secours",
    resume: "Les bons réflexes loin de tout, en attendant les secours.",
    sections: [
      { titre: "Protéger, alerter, secourir",
        etapes: ["Protéger : écarter le danger (chute de pierres, eau, feu) pour soi, la victime et le groupe, sans prendre de risque.",
                 "Alerter : appeler le 112 avec la position GPS (bouton SOS).",
                 "Secourir : faire les gestes adaptés en attendant les secours, et ne plus laisser la victime seule."] },
      { titre: "Isolé, tout prend plus de temps",
        p: ["En pleine nature, les secours peuvent mettre une ou plusieurs heures à arriver. Il faut donc aussi protéger la victime du froid (couverture de survie, isolation du sol, vêtements secs) même pour une blessure banale : une personne immobile se refroidit très vite."] },
      { titre: "Les situations fréquentes",
        p: ["Chaque situation a sa fiche détaillée dans la catégorie Premiers secours : plaie qui saigne, ampoules, entorse, brûlure, intoxication, morsure de serpent, piqûres et tiques."],
        encadre: { type: "retenir", titre: "À retenir", texte: "Rien ne remplace une formation aux premiers secours (Croix-Rouge, protection civile) : quelques heures qui peuvent sauver une vie." } }
    ],
    fiches: ["ps_saignement", "ps_ampoule", "ps_entorse", "ps_brulure", "ps_intox", "ps_morsure", "ps_piqure", "ps_tique", "froid"], especes: []
  });
})();
