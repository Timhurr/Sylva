/* Sylva – premiers secours en situation isolée (secours injoignables).
   Rédigé pour Sylva à partir de faits issus du manuel FM 4-25.11 et du chapitre médical du FM 21-76 / FM 3-05.70
   (armée américaine, domaine public), recoupés avec les recommandations de premiers secours en milieu isolé
   (Wilderness Medical Society, ERC). Aucun texte protégé n'est repris. */
(function () {
  "use strict";
  var T = window.SYLVA_TECHNIQUES || [];
  var SRC = "Rédigé pour Sylva : manuels FM 4-25.11 et FM 21-76 (domaine public), recoupés avec les recommandations de secourisme en milieu isolé (WMS, ERC)";
  function get(id) { return T.filter(function (t) { return t.id === id; })[0]; }

  var ISOLE = {
    ps_saignement: {
      isole: [
        "Appuyer fort et sans relâcher pendant au moins 10 minutes, montre en main : c'est la pression continue qui arrête le saignement.",
        "Si ça reprend : appuyer à nouveau 20 minutes, avec les doigts pile sur l'endroit qui saigne, à travers un tissu propre.",
        "Une fois arrêté : faire un pansement compressif (tissu plié sur la plaie, bande ou foulard bien serré par-dessus) et vérifier que les doigts ou orteils restent roses et chauds.",
        "Membre qui saigne en jet ou qui ne s'arrête pas malgré la compression : poser un garrot (fiche Garrot de fortune).",
        "Quand le saignement est maîtrisé : nettoyer la plaie à grande eau potable (fiche Soigner une plaie) et la surveiller chaque jour.",
        "Faire boire, couvrir et garder au repos : une perte de sang affaiblit et refroidit."
      ],
      alerte: ["Le sang gicle ou imbibe tout en quelques minutes", "Plaie au cou, à la poitrine ou au ventre", "Pâleur, sueurs froides, pouls rapide : état de choc"]
    },
    ps_ampoule: {
      isole: [
        "S'arrêter dès qu'une zone chauffe et la protéger avant qu'elle ne s'ouvre.",
        "Ampoule très tendue qui empêche de marcher : la percer sur le bord avec une aiguille désinfectée (flamme puis alcool), presser doucement, garder la peau en place.",
        "Couvrir d'un pansement et rembourrer autour (mousse, tissu plié) pour que la chaussure n'appuie plus dessus.",
        "À chaque pause, sécher et aérer les pieds. La nuit, dormir avec des chaussettes sèches.",
        "Refaire le pansement chaque jour, en rinçant à l'eau potable."
      ],
      alerte: ["Rougeur qui s'étend ou traînée rouge sur la jambe", "Pus, chaleur, fièvre"]
    },
    ps_entorse: {
      isole: [
        "Refroidir 20 minutes dans l'eau froide d'un ruisseau ou avec un tissu mouillé, plusieurs fois par jour, et surélever la jambe au repos.",
        "Pour repartir : garder la chaussure, la lacer serré, ou faire un bandage en huit autour de la cheville avec une bande ou un foulard.",
        "Se faire une canne avec un bâton solide à hauteur de hanche, tenu du côté opposé à la cheville blessée.",
        "Alléger le sac, raccourcir les étapes et prendre le chemin le plus plat, même s'il est plus long.",
        "Impossible de poser le pied : immobiliser comme une fracture (fiche Attelle), s'installer à l'abri et se signaler plutôt que forcer."
      ],
      alerte: ["Impossible de faire 4 pas", "Déformation ou os très douloureux au toucher", "Pied froid, pâle ou qui ne sent plus rien"]
    },
    ps_brulure: {
      isole: [
        "Refroidir 20 minutes avec l'eau du ruisseau ou de la gourde. C'est encore utile si tu n'as pas pu le faire tout de suite.",
        "Refroidir la brûlure, pas la personne : garder le reste du corps couvert et au chaud.",
        "Ne pas percer les cloques. Couvrir d'un pansement propre et sec ou de film alimentaire.",
        "Refaire le pansement une fois par jour en rinçant doucement à l'eau potable.",
        "Faire boire beaucoup : une brûlure étendue fait perdre de l'eau."
      ],
      alerte: ["Brûlure plus grande que 10 paumes de main de la victime : risque de choc", "Visage, cou, voix rauque, toux, suie dans le nez : les voies respiratoires peuvent gonfler", "Brûlure blanche, cartonnée ou insensible : brûlure profonde"]
    },
    ps_intox: {
      isole: [
        "Arrêter de manger, garder tous les restes (même les épluchures) et noter l'heure du repas.",
        "Ne pas faire vomir.",
        "Si la personne est consciente et ne vomit pas : petites gorgées d'eau régulières pour compenser les pertes.",
        "Noter l'heure de chaque symptôme (nausées, diarrhée, troubles de la vue, sueurs, confusion).",
        "Inconscient qui respire : position latérale de sécurité, et la surveiller sans arrêt.",
        "Champignons et premiers symptômes 6 heures ou plus après le repas : sortir ou se faire repérer devient la priorité absolue, même si la personne semble aller mieux."
      ],
      alerte: ["Somnolence, confusion, convulsions", "Symptômes apparus 6 h ou plus après un repas de champignons", "Peau ou yeux qui jaunissent"]
    },
    ps_morsure: {
      isole: [
        "Rester calme, s'asseoir ou s'allonger : la plupart des morsures de vipère en Europe sont sans gravité, mais il faut limiter les efforts.",
        "Retirer tout de suite bagues, montre, bracelet, et la chaussure si c'est le pied, avant que ça gonfle.",
        "Immobiliser le membre avec une attelle (fiche Attelle), sans serrer.",
        "Toutes les heures, tracer au stylo le bord du gonflement avec l'heure : tu vois si ça progresse.",
        "Boire de l'eau, ne pas manger, ne pas boire d'alcool.",
        "Ne pas marcher si on peut l'éviter : se signaler. Si on doit partir seul, marcher lentement et faire des pauses."
      ],
      alerte: ["Le gonflement dépasse le genou ou le coude", "Vomissements, malaise, sueurs, gonflement du visage", "Saignement des gencives ou du nez"]
    },
    ps_piqure: {
      isole: [
        "Abeille : racler le dard avec un ongle ou une carte. Refroidir à l'eau froide.",
        "Surveiller la personne pendant au moins une heure.",
        "Gonflement local qui gratte : antihistaminique de la trousse si tu en as.",
        "Allergie connue avec stylo d'adrénaline : piquer dans le côté de la cuisse, même à travers le pantalon. Si ça ne s'améliore pas après 5 à 15 minutes et que tu as un second stylo, l'utiliser.",
        "Gêne pour respirer : la garder assise, penchée en avant. Malaise : allongée, jambes surélevées."
      ],
      alerte: ["Gonflement du visage, des lèvres ou de la gorge", "Respiration sifflante, voix qui change", "Plaques rouges sur tout le corps, malaise", "Piqûre dans la bouche"]
    },
    ps_tique: {
      isole: [
        "Inspecter tout le corps chaque soir et chaque matin : aisselles, aine, derrière les genoux, nombril, cuir chevelu.",
        "Retirer chaque tique au tire-tique, en tournant sans tirer. Sans tire-tique : une pince fine prise au ras de la peau, en tirant lentement et droit.",
        "Désinfecter et noter la date et l'endroit dans le carnet de l'appli.",
        "Au retour, surveiller la zone pendant un mois."
      ],
      alerte: ["Rougeur en anneau qui s'étend (à montrer à un médecin au retour)", "Fièvre, grande fatigue, douleurs articulaires dans les semaines qui suivent"]
    },
    ps_pls: {
      isole: [
        "Mettre la personne en PLS (étapes ci-dessous en mode Secours joignables) et rester près d'elle.",
        "Vérifier sa respiration toutes les 2 à 3 minutes au début, puis régulièrement.",
        "L'isoler du sol (sac, matelas, branchages) et la couvrir : une personne inconsciente se refroidit très vite.",
        "Toutes les 30 minutes, la tourner sur l'autre côté pour éviter les blessures de compression.",
        "Noter l'heure, sa respiration et ses réactions : ces notes aideront les secours.",
        "Si elle cesse de respirer : la mettre sur le dos et commencer le massage cardiaque (30 compressions au centre de la poitrine, 5 à 6 cm de profondeur, 100 à 120 par minute)."
      ],
      alerte: ["Respiration irrégulière, bruyante ou qui s'arrête", "Pas de réveil après plusieurs minutes", "Convulsions"],
      attentionIsole: ["Seul et sans secours, un massage cardiaque prolongé a très peu de chances de réussir, sauf après une noyade, la foudre ou une hypothermie. Continue au moins 30 minutes si tu le peux."]
    },
    ps_choc: {
      isole: [
        "Arrêter la cause si possible : compression du saignement, refroidissement d'une brûlure.",
        "Allonger sur le dos, isoler du sol et couvrir. Surélever les jambes d'environ 30 cm si elles ne sont pas blessées.",
        "Monter un abri contre le vent et la pluie au-dessus de la victime.",
        "Toutes les 15 minutes : compter le pouls et la respiration et les noter (fiche Surveiller un blessé).",
        "Si elle est bien réveillée, sans blessure au ventre et sans vomissements : petites gorgées d'eau. Sinon, rien par la bouche.",
        "Ne pas la laisser seule si vous êtes plusieurs."
      ],
      alerte: ["Le choc est à lui seul un signe d'alerte : tout faire pour sortir ou se faire repérer"]
    },
    ps_attelle: {
      isole: [
        "Immobiliser dans la position trouvée, en bloquant l'articulation au-dessus et en dessous (étapes du mode Secours joignables).",
        "Jambe sans bâtons à portée : l'attacher à l'autre jambe, avec du rembourrage entre les deux.",
        "Bras ou poignet : attelle, puis écharpe et bandage qui plaque le bras contre le corps. On peut souvent encore marcher.",
        "Contrôler chaque heure les doigts ou orteils : chauds, roses, sensibles. Desserrer les liens si ça gonfle.",
        "Os visible : rincer abondamment la plaie à l'eau potable, couvrir d'un tissu propre, ne pas toucher l'os. Le risque d'infection en fait une priorité de sortie.",
        "Membre très tordu avec la main ou le pied froid, pâle et insensible, et aucun secours avant des heures : tirer doucement et lentement dans l'axe pour le redresser, puis immobiliser. Arrêter si la douleur augmente fortement ou si ça bloque."
      ],
      alerte: ["Main ou pied froid, pâle ou insensible", "Fracture de la cuisse ou du bassin : risque de grosse perte de sang", "Os visible"]
    },
    ps_brancard: {
      isole: [
        "Seul avec un blessé : ne le transporter que sur une courte distance, pour le mettre à l'abri ou hors de danger.",
        "Traîner la victime allongée sur une bâche, un sac de couchage ou une veste, en tirant par les épaules, tête vers toi.",
        "Sur une plus longue distance : fabriquer un travois (deux perches en V reliées par des traverses et une bâche) que tu tires par la pointe.",
        "Faire des pauses fréquentes, vérifier la respiration et garder la victime couverte."
      ],
      alerte: ["Suspicion de blessure au dos ou à la nuque : ne déplacer qu'en cas de danger immédiat"]
    },
    ps_laisser: {
      isole: [
        "Rester avec la victime et se signaler si elle ne peut pas être laissée seule (inconsciente, état de choc), si la nuit ou le mauvais temps arrive, ou si tu ne connais pas le chemin.",
        "Partir chercher de l'aide si personne ne viendra vous chercher, que la victime est stable et à l'abri, et que tu connais la route vers un endroit où appeler.",
        "Avant de partir : la victime au chaud, isolée du sol, avec eau, nourriture, lampe et sifflet à portée de main.",
        "Noter sa position (bouton SOS de l'appli), laisser un mot avec l'heure de départ et la direction prise, et baliser le chemin."
      ],
      alerte: ["Victime inconsciente ou en état de choc : ne la laisser seule qu'en tout dernier recours"]
    }
  };
  Object.keys(ISOLE).forEach(function (id) {
    var t = get(id); if (!t) return;
    t.isole = ISOLE[id].isole; t.alerte = ISOLE[id].alerte;
    if (ISOLE[id].attentionIsole) t.attentionIsole = ISOLE[id].attentionIsole;
  });

  var NEW = [
    { id: "ps_garrot", cat: "Premiers secours", titre: "Garrot de fortune", illus: "premiers_secours", source: SRC,
      intro: "Le geste qui sauve quand un membre saigne abondamment et que la compression ne suffit pas, ou quand tu dois libérer tes mains.",
      isole: [
        "Prendre une bande large de 4 à 5 cm : foulard plié, ceinture en tissu, sangle. Jamais une ficelle ou un fil fin.",
        "La placer 5 à 7 cm au-dessus de la plaie, entre la plaie et le cœur, sans la mettre sur une articulation.",
        "Faire un nœud, poser un bâton solide dessus, refaire un nœud par-dessus le bâton.",
        "Tourner le bâton jusqu'à ce que le saignement s'arrête complètement.",
        "Bloquer le bâton (le glisser sous un lien) pour qu'il ne se déroule pas.",
        "Écrire l'heure de pose bien en vue, sur le garrot ou sur la peau.",
        "Ne pas le desserrer pour « faire respirer » le membre : il reste en place jusqu'à une prise en charge médicale."
      ],
      alerte: ["Un garrot posé, c'est une évacuation urgente : tout faire pour sortir ou se faire repérer"],
      attention: ["Un garrot fait très mal : c'est normal. Pas assez serré, il aggrave le saignement : serrer jusqu'à l'arrêt complet.", "Jamais de garrot sur le cou, la poitrine ou le ventre : là, uniquement la compression."]
    },
    { id: "ps_plaie_soin", cat: "Premiers secours", titre: "Soigner une plaie sur plusieurs jours", illus: "premiers_secours", source: SRC,
      intro: "Loin de tout, le danger d'une plaie, c'est l'infection. Un nettoyage abondant est le geste le plus efficace.",
      isole: [
        "Une fois le saignement arrêté, rincer la plaie avec au moins 1 litre d'eau potable (bouillie puis refroidie, ou filtrée), en jet : gourde à bouchon percé ou sac plastique troué que tu presses.",
        "Retirer les saletés restantes avec une pince désinfectée.",
        "Plaie nette, propre et de moins de 6 heures : rapprocher les bords avec des strips (sutures adhésives), sans serrer.",
        "Plaie sale, morsure d'animal ou plaie plus ancienne : ne pas la refermer. La laisser ouverte sous un pansement propre pour qu'elle puisse s'écouler.",
        "Changer le pansement chaque jour, ou dès qu'il est mouillé ou sale, en rinçant à nouveau.",
        "Garder la zone au repos et surélevée si possible."
      ],
      alerte: ["Rougeur, chaleur et gonflement qui s'étendent", "Pus, mauvaise odeur", "Traînée rouge qui remonte vers le cœur", "Fièvre, frissons"],
      attention: ["Avant de partir, vérifie que ton vaccin contre le tétanos est à jour (rappel tous les 10 ans)."]
    },
    { id: "ps_surveiller", cat: "Premiers secours", titre: "Surveiller un blessé dans la durée", illus: "premiers_secours", source: SRC,
      intro: "Sans secours, l'évolution de l'état du blessé décide de tout : rester, partir ou tout faire pour se signaler. Noter, c'est voir venir.",
      isole: [
        "Au début toutes les 15 minutes, puis toutes les heures, noter dans le carnet : l'heure, la conscience, la respiration, le pouls, la peau, la douleur.",
        "Conscience : bien réveillé et cohérent ? Réagit seulement à la voix ? Seulement si on le pince ? Ne réagit pas ?",
        "Respiration : compter les mouvements du ventre pendant 30 secondes et multiplier par 2. Normal au repos : 12 à 20 par minute.",
        "Pouls au poignet (côté pouce) ou au cou : compter 30 secondes et multiplier par 2. Normal au repos : 60 à 100.",
        "Peau : couleur, température, sueurs. Pâle, froide et moite : alerte.",
        "S'il est conscient et n'a pas de blessure au ventre, le faire boire régulièrement. Des urines claires montrent qu'il boit assez.",
        "Le garder au sec, isolé du sol, à l'abri du vent, et changer sa position s'il ne peut pas bouger seul."
      ],
      alerte: ["La conscience baisse d'une prise de notes à l'autre", "Respiration de plus de 30 ou de moins de 10 par minute", "Pouls de plus de 120 au repos", "Plus d'urine depuis 12 heures"]
    }
  ];
  NEW.forEach(function (n) { if (!get(n.id)) T.push(n); });

  // Chapitre du guide, repensé pour l'isolement
  var G = window.SYLVA_GUIDE || [];
  var chap = G.filter(function (c) { return c.id === "secourisme"; })[0];
  if (chap) {
    chap.titre = "Premiers secours, seul et loin de tout";
    chap.resume = "Quand les secours ne viendront pas vite, ou pas du tout : stabiliser, protéger du froid, surveiller, puis décider de rester ou de partir.";
    chap.sections = [
      { titre: "Changer de logique",
        p: ["En ville, les premiers secours servent à tenir quelques minutes. Loin de tout, sans réseau, tu peux devoir t'occuper d'un blessé, ou de toi-même, pendant des heures ou des jours. Le but n'est plus d'attendre l'ambulance : c'est de stabiliser, d'empêcher que ça s'aggrave, et de choisir le bon moment pour sortir.",
             "Même sans réseau, essaie quand même d'alerter : monte sur un point haut, envoie un SMS à un proche avec ta position, prépare des signaux de détresse (fiche Signaux)."] },
      { titre: "Les priorités, dans l'ordre",
        etapes: ["Danger : écarter ce qui menace encore (chute de pierres, eau, feu), sans te mettre en danger toi-même.",
                 "Saignement abondant : l'arrêter tout de suite (compression, garrot si besoin).",
                 "Respiration : libérer les voies aériennes, PLS si la personne est inconsciente et respire.",
                 "Froid : isoler du sol, couvrir, abriter. Un blessé immobile se refroidit très vite, même en été.",
                 "Le reste ensuite : fractures, plaies, douleur, boisson."] },
      { titre: "Rester ou partir ?",
        liste: ["Rester et se signaler si : le blessé ne peut pas marcher ou ne peut pas être laissé seul, la nuit ou le mauvais temps arrive, le chemin est inconnu, ou quelqu'un sait où vous êtes et vous attend.",
                "Partir si : personne ne vous cherchera, le blessé peut marcher sans danger ou être laissé stable et à l'abri, et tu connais la route vers un endroit où appeler.",
                "Un blessé qui marche encore doit avancer lentement, sac allégé, par le chemin le plus sûr, pas le plus court."] },
      { titre: "Les signes qui obligent à sortir vite",
        liste: ["La conscience baisse ou la personne devient confuse.",
                "Elle a du mal à respirer.",
                "Un saignement ne s'arrête pas, ou un garrot a été posé.",
                "Pâleur, sueurs froides, pouls rapide : état de choc.",
                "Douleur au ventre qui augmente, vomissements répétés.",
                "Une plaie s'infecte (rougeur qui s'étend, fièvre).",
                "Hypothermie : frissons qui s'arrêtent, gestes maladroits, propos incohérents."],
        encadre: { type: "danger", titre: "Un seul de ces signes suffit", texte: "Dès qu'un de ces signes apparaît, l'attente devient plus dangereuse que l'effort : tout faire pour évacuer ou se faire repérer." } },
      { titre: "Noter pour décider",
        p: ["Toutes les heures, note l'état du blessé : conscience, respiration, pouls, peau, douleur. Une évolution se voit sur les notes bien avant de se voir à l'œil. La fiche Surveiller un blessé explique comment faire."] },
      { titre: "La trousse qui change tout",
        liste: ["Un garrot et des compresses, une bande de contention", "Des strips (sutures adhésives) et des pansements", "Une pince fine et un tire-tique", "De quoi rincer une plaie (seringue ou gourde à bouchon percé)", "Une couverture de survie et des gants", "Antidouleur et antihistaminique, ton stylo d'adrénaline si tu es allergique", "Un carnet et un crayon"],
        encadre: { type: "retenir", titre: "À retenir", texte: "Une formation aux premiers secours, et si possible un module « milieu isolé », vaut plus que la meilleure des trousses." } }
    ];
    chap.fiches = ["ps_surveiller", "ps_saignement", "ps_garrot", "ps_plaie_soin", "ps_pls", "ps_choc", "ps_attelle", "ps_brancard", "ps_laisser", "froid", "ps_ampoule", "ps_entorse", "ps_brulure", "ps_intox", "ps_morsure", "ps_piqure", "ps_tique"];
  }
})();
