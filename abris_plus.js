/* Sylva – campement et abris approfondis (v0.9.19).
   Rédigé pour Sylva : savoir-faire usuel du bivouac à la bâche et au hamac, chapitre « Shelters »
   des manuels FM 21-76 / FM 3-05.70 (domaine public), réécrit et adapté à l'Europe. Bois mort uniquement. */
(function () {
  "use strict";
  var T = window.SYLVA_TECHNIQUES || [];
  var SRC = "Savoir-faire usuel du bivouac et manuels FM 21-76 / FM 3-05.70 (domaine public), rédigé pour Sylva";
  var BOIS = "Uniquement du bois mort tombé au sol : en Europe, couper des branches vivantes est interdit sans l'accord du propriétaire.";

  var F = [
    // ================= BÂCHE =================
    { id: "ligne_faitiere", cat: "Abri", titre: "Tendre une ligne faîtière", illus: "abri_bache",
      intro: "La corde tendue entre deux arbres, c'est la colonne vertébrale de presque tous les abris à la bâche. Bien tendue, la bâche ne bat pas et l'eau s'écoule.",
      etapes: [
        "Choisis deux arbres sains, espacés d'un peu plus que la longueur de la bâche (4 à 5 m pour une bâche de 3 m).",
        "Attache un bout au premier arbre avec un tour mort et deux demi-clés, à la hauteur voulue : environ 1 m pour un abri en A bas, 1,5 m pour un appentis.",
        "Va au second arbre, passe la corde autour et tends-la avec un nœud de camionneur. Elle doit sonner comme une corde de guitare.",
        "Bloque avec deux demi-clés gansées : tu les déferas d'un coup le matin.",
        "Pose la bâche sur la corde, ou accroche ses œillets avec deux nœuds de Prusik pour pouvoir la faire glisser et la tendre dans la longueur.",
        "Vérifie que la corde est bien horizontale, ou un peu plus basse côté pieds pour que l'eau s'écoule de ce côté."
      ],
      attention: ["Protège l'écorce avec un chiffon ou une sangle large si la corde est fine, et ne serre jamais un jeune arbre."] },
    { id: "goutte_eau", cat: "Abri", titre: "Empêcher l'eau de couler dans l'abri", illus: "eau_pluie",
      intro: "Sous la pluie, l'eau suit la corde faîtière et finit par goutter… sur ton duvet. Une simple ficelle règle le problème.",
      etapes: [
        "Coupe deux bouts de ficelle d'environ 20 cm.",
        "Noue-en un sur la corde faîtière de chaque côté, juste avant l'endroit où la corde entre sous la bâche.",
        "Laisse pendre les bouts vers le sol : l'eau qui glisse le long de la corde descend par la ficelle et goutte dehors.",
        "Fais la même chose sur les haubans des coins si l'eau y ruisselle.",
        "Creuse au besoin une petite rigole sous le bord de la bâche, du côté de la pente, pour évacuer l'eau qui tombe du toit."
      ] },
    { id: "appentis_bache", cat: "Abri", titre: "Appentis à la bâche", illus: "abri_appentis",
      intro: "Un toit en pente, ouvert d'un seul côté : l'abri le plus rapide, avec une belle vue et de la place pour s'organiser. Le dos tourné au vent.",
      etapes: [
        "Repère d'où vient le vent : le côté bas de l'abri doit lui faire face.",
        "Tends une ligne faîtière à environ 1,2 à 1,5 m de haut.",
        "Pose un bord de la bâche sur la corde et attache ses coins.",
        "Tire l'autre bord en pente vers le sol, côté vent, et plante-le au ras du sol avec des sardines ou des bâtons.",
        "Pour couper le vent latéral, rabats et plante un des coins avant, ou ferme le côté avec des branchages morts.",
        "Mets le couchage tout au fond, là où le toit est le plus bas : c'est la zone la plus abritée."
      ],
      attention: ["Peu protégé si le vent tourne : surveille la météo et sois prêt à baisser l'avant."] },
    { id: "soc_charrue", cat: "Abri", titre: "Bâche en soc de charrue", illus: "abri_bache",
      intro: "Une seule attache haute, trois coins au sol : un abri pour une personne, très résistant au vent, monté en quelques minutes.",
      etapes: [
        "Étale la bâche carrée en losange, une pointe vers l'arbre.",
        "Attache cette pointe à l'arbre (ou au sommet d'un bâton de marche) à environ 1,2 m de haut.",
        "Plante au sol la pointe opposée, bien tendue, du côté d'où vient le vent.",
        "Plante les deux pointes de côté au sol, en tirant pour que la toile soit tendue sans plis.",
        "L'ouverture se trouve côté arbre, dos au vent. Glisse-toi dedans tête vers l'arbre, là où c'est le plus haut."
      ],
      attention: ["Peu de place : idéal pour une nuit seul, pas pour ranger tout un sac."] },
    { id: "bache_tube", cat: "Abri", titre: "Abri en A avec plancher", illus: "abri_bache",
      intro: "Avec une grande bâche, on replie les bords sous soi : on obtient un toit et un sol d'un seul tenant. Très utile quand le sol est mouillé.",
      etapes: [
        "Il faut une bâche d'au moins 3 × 4 m.",
        "Tends une ligne faîtière basse, à 80 cm ou 1 m du sol.",
        "Pose la bâche à cheval sur la corde, dans le sens de la longueur.",
        "Au lieu de planter les bords, replie-les vers l'intérieur sous l'abri : ils se chevauchent et forment un plancher.",
        "Ton poids sur le plancher tend les deux pans du toit. Leste les bords repliés avec ton sac."
      ],
      attention: ["L'abri est ouvert aux deux bouts : oriente-le dans le sens du vent, jamais en travers."] },
    { id: "abri_poncho", cat: "Abri", titre: "Abri avec un poncho", illus: "abri_bache",
      intro: "Un poncho de pluie, c'est une petite bâche qu'on porte sur soi. En cas de nuit imprévue, il devient un toit.",
      etapes: [
        "Ferme bien la capuche : tire le cordon et noue-la sur elle-même pour qu'elle ne fasse pas entonnoir.",
        "Tends une cordelette entre deux arbres à environ 80 cm du sol.",
        "Passe le poncho par-dessus, en appentis ou en A selon la taille.",
        "Attache les coins aux piquets ou à des racines avec des nœuds tendeurs.",
        "Isole le sol avec ton sac vidé et une couche épaisse de feuilles mortes."
      ] },
    { id: "bache_tempete", cat: "Abri", titre: "Monter sa bâche sous la pluie et le vent", illus: "abri_bache",
      intro: "Par mauvais temps, l'ordre des gestes compte : on pose d'abord le toit, puis on s'installe dessous au sec.",
      etapes: [
        "Garde la bâche et la cordelette en haut du sac, accessibles sans tout déballer.",
        "Tends la ligne faîtière en premier, puis la bâche, avant de sortir quoi que ce soit d'autre.",
        "Abaisse l'abri : plus il est bas, moins le vent a de prise. Bords au ras du sol côté vent.",
        "Plante les sardines à 45°, pointe vers l'abri, et double les ancrages côté vent.",
        "Retends tous les haubans au bout d'une heure : la corde mouillée se détend.",
        "Une fois le toit en place, installe le couchage dessous et range ce qui doit rester sec dans des sacs étanches."
      ],
      attention: ["Par vent violent, éloigne-toi des arbres : les branches cassent et tombent (voir « Repérer les dangers du camp »)."] },
    { id: "ancrages", cat: "Abri", titre: "Sardines et ancrages de fortune", illus: "abri_bache",
      intro: "Sardine perdue, sol trop dur, sable ou neige : il existe toujours un moyen d'attacher un coin de bâche.",
      etapes: [
        "Piquet en bois : un bâton mort et sain, gros comme le pouce, taillé en pointe, avec une encoche en haut pour la corde. Plante-le à 45° vers l'extérieur.",
        "Sol caillouteux : attache la corde autour d'une grosse pierre, ou plante un piquet entre deux pierres et cale-le avec une troisième.",
        "Racines et souches : passe simplement la corde autour.",
        "Sable ou neige (ancre enterrée) : attache la corde au milieu d'un bâton, creuse un trou de 25 cm, couche le bâton au fond en travers de la traction, rebouche et tasse.",
        "Sol trop dur : pose une grosse pierre sur le coin de la bâche ou sur un bâton qui le retient."
      ] },
    { id: "hamac", cat: "Abri", titre: "Dormir en hamac", illus: "abri_bache",
      intro: "Le hamac règle le problème du sol mouillé, des pentes et des cailloux. Mais il est froid par en dessous et s'installe avec méthode.",
      etapes: [
        "Choisis deux arbres sains, gros comme une cuisse au moins, espacés de 4 à 5 m, sans branche morte au-dessus.",
        "Utilise des sangles larges (au moins 2,5 cm) : elles protègent l'écorce. Jamais de corde fine autour d'un tronc.",
        "Attache les sangles à hauteur des yeux environ, pour qu'elles forment un angle de 30° avec le sol une fois le hamac chargé.",
        "Règle le hamac pour qu'il soit à hauteur de chaise (45 cm) quand tu es assis dedans.",
        "Couche-toi en diagonale : le dos est presque à plat et tu ne te sens pas plié en deux.",
        "Isole par-dessous : sous le poids, le duvet s'écrase et ne tient plus chaud. Glisse un matelas dans le hamac, ou utilise une couette sous le hamac.",
        "Tends une bâche au-dessus, sur une ligne faîtière plus haute que les sangles, avec des ficelles anti-gouttes sur les sangles."
      ],
      attention: ["Sous 10 °C, un hamac sans isolation par-dessous est glacial, même avec un bon duvet.", "Vérifie que les arbres et les sangles sont autorisés sur le site."] },

    // ================= ABRIS NATURELS =================
    { id: "abri_conique", cat: "Abri", titre: "Abri conique en perches", illus: "abri_debris",
      intro: "Des perches dressées en cône et couvertes : un abri où l'on peut s'asseoir, qui tient bien la pluie s'il est assez pentu.",
      etapes: [
        "Ramasse trois perches mortes et solides d'environ 2,5 m.",
        "Lie-les ensemble près d'un bout avec un brêlage en trépied, puis écarte les pieds en triangle.",
        "Appuie d'autres perches tout autour, en laissant une ouverture étroite du côté opposé au vent.",
        "Couvre de bas en haut, comme des tuiles, avec de grandes écorces mortes, des branchages morts puis une épaisse couche de feuilles.",
        "Plus la pente est forte, mieux l'eau s'écoule : vise des côtés bien raides.",
        "Isole le sol à l'intérieur avec 20 à 30 cm de feuilles sèches."
      ],
      attention: [BOIS, "Demande 2 à 4 heures : commence bien avant la nuit, et démonte tout en partant."] },
    { id: "abri_chablis", cat: "Abri", titre: "S'abriter contre un arbre déraciné", illus: "abri_appentis",
      intro: "La motte de racines d'un arbre tombé forme un mur naturel contre le vent. On y adosse un appentis en quelques minutes.",
      etapes: [
        "Vérifie d'abord la stabilité : l'arbre doit être bien couché au sol, sans être retenu en l'air par d'autres arbres.",
        "Installe-toi du côté abrité du vent, contre la motte de racines ou le long du tronc.",
        "Appuie des perches mortes du tronc vers le sol pour former un toit en appentis.",
        "Couvre de branchages morts et de feuilles, ou tends ta bâche par-dessus.",
        "Isole le sol : le creux laissé par les racines est souvent humide, comble-le de feuilles sèches."
      ],
      attention: ["Ne coupe jamais une racine d'un arbre à moitié déraciné : la motte peut se redresser d'un coup et écraser ce qui se trouve dessous.", "Le trou des racines se remplit d'eau sous la pluie : ne dors pas au fond."] },
    { id: "abri_rocher", cat: "Abri", titre: "Dormir sous un surplomb rocheux", illus: "abri_emplacement",
      intro: "Un rocher en surplomb offre un toit tout fait. Mais il faut vérifier qu'il ne présente aucun danger.",
      etapes: [
        "Regarde au sol : des éclats de roche frais ou des pierres tombées récemment signalent des chutes de pierres. Passe ton chemin.",
        "Observe le plafond : pas de fissures ouvertes ni de blocs qui semblent détachés.",
        "Vérifie qu'aucune eau ne ruisselle ou ne goutte du rocher, et que le sol n'est pas un lit de ruisseau temporaire.",
        "Cherche des traces d'animaux (crottes, poils, os) : l'endroit est peut-être déjà occupé.",
        "Ferme l'avant avec ta bâche ou des branchages morts pour couper le vent, et isole bien le sol, souvent froid."
      ],
      attention: ["Ne fais jamais de feu juste sous la roche : la chaleur peut faire éclater la pierre et détacher des plaques.", "Les falaises calcaires de l'Ourthe sont souvent des sites protégés : vérifie que le bivouac y est autorisé."] },
    { id: "abri_neige", cat: "Abri", titre: "Abri dans la neige", illus: "froid",
      intro: "La neige isole étonnamment bien : un abri bien fait reste autour de 0 °C même quand il gèle fort dehors.",
      etapes: [
        "Au pied d'un gros épicéa, les branches basses forment souvent un creux sans neige : dégage-le encore à la main, et installe-toi dessous.",
        "Sur terrain plat, creuse une tranchée de la longueur de ton corps, large comme les épaules, profonde d'environ 1 m.",
        "Couvre-la de perches mortes ou de bâtons de marche, puis de ta bâche, puis d'une couche de neige.",
        "Garde une petite ouverture, de préférence plus basse que l'endroit où tu dors : l'air froid reste en bas.",
        "Isole-toi de la neige par-dessous : matelas, sac, branchages morts. C'est le plus important.",
        "Perce un trou d'aération dans le toit avec un bâton, et vérifie qu'il reste ouvert."
      ],
      attention: ["Jamais de réchaud ni de bougie dans un abri de neige mal aéré : risque d'intoxication au monoxyde de carbone.", "Au pied d'un arbre, la neige des branches peut tomber d'un bloc : ne t'y installe pas par redoux ou par vent."] },

    // ================= CAMPEMENT =================
    { id: "dangers_camp", cat: "Abri", titre: "Repérer les dangers du camp", illus: "abri_emplacement",
      intro: "Avant de poser le sac, prends deux minutes pour regarder en haut, autour et en bas. La plupart des accidents de bivouac viennent de là.",
      etapes: [
        "En haut : cherche les branches mortes et les arbres morts ou penchés. En forestier, on les appelle « faiseurs de veuves ». Ne dors jamais dessous, même par temps calme.",
        "Autour : évite les fourmilières, les nids de guêpes, les terriers et les passages d'animaux (sentiers étroits, herbe couchée, traces de sangliers qui retournent la terre).",
        "En bas : pas de lit de ruisseau à sec, de creux où l'eau stagne ni de berge basse. Une rivière peut monter d'un mètre dans la nuit après un orage en amont.",
        "Le froid : l'air froid coule et s'accumule au fond des vallées et des cuvettes. Installe-toi un peu au-dessus du fond, sur un replat.",
        "Le vent : évite les sommets et les crêtes. Une lisière ou un bosquet coupe le vent.",
        "L'orage : pas d'arbre isolé, de sommet, de pylône ni de clôture métallique. En forêt, mieux vaut un peuplement d'arbres de même taille."
      ] },
    { id: "plan_camp", cat: "Abri", titre: "Organiser son camp", illus: "camp",
      intro: "Un camp bien rangé, c'est moins de choses perdues dans le noir, moins de visites d'animaux et une nuit plus sûre.",
      etapes: [
        "Pose l'abri en premier, sur la meilleure place, dos au vent dominant.",
        "Coin cuisine : sous le vent de l'abri, à quelques mètres au moins, pour que la fumée, les étincelles et les odeurs s'éloignent du couchage.",
        "Eau : remplis tes gourdes avant la nuit. Lave la vaisselle loin du ruisseau (au moins 60 m) et disperse l'eau sale.",
        "Toilettes : à au moins 60 m de l'eau, du camp et des sentiers, dans un trou de 15 cm rebouché.",
        "Nourriture : jamais dans l'abri. Range-la à l'écart (voir « Protéger sa nourriture des animaux »).",
        "Garde à portée de main, la nuit : lampe frontale, eau, couteau, sifflet, téléphone, lunettes. Toujours au même endroit.",
        "Avant qu'il fasse noir, fais le tour du camp : tout ce qui doit rester sec est rangé, le bois est sous la bâche, les cordes sont visibles (un bout de tissu clair dessus évite de se prendre les pieds)."
      ] },
    { id: "nourriture_animaux", cat: "Abri", titre: "Protéger sa nourriture des animaux", illus: "piege_4",
      intro: "En Europe, pas d'ours, mais des renards, des sangliers, des fouines et surtout des rongeurs qui percent un sac en une nuit.",
      etapes: [
        "Range toute la nourriture et les déchets dans un sac fermé, si possible étanche aux odeurs (double sac congélation).",
        "Jamais de nourriture dans l'abri ou dans la tente : un sanglier ou un renard viendra la chercher jusque-là.",
        "Suspends le sac à une branche à au moins 2 m du sol et à 1 m du tronc, à une vingtaine de mètres du couchage.",
        "Pour suspendre : attache une pierre à une cordelette, lance-la par-dessus la branche, accroche le sac et hisse-le, puis attache l'autre bout à un arbre voisin.",
        "Mets aussi dans le sac le dentifrice, les crèmes et tout ce qui sent.",
        "Ne nourris jamais les animaux et ramasse tous les restes : un animal habitué devient un problème pour les campeurs suivants."
      ] },
    { id: "nuit_chaude", cat: "Abri", titre: "Bien dormir au chaud", illus: "froid",
      intro: "Le duvet ne produit pas de chaleur : il garde celle que tu fabriques. Quelques gestes font gagner plusieurs degrés.",
      etapes: [
        "Mange un repas gras et chaud le soir, et garde un en-cas près de toi pour la nuit : digérer réchauffe.",
        "Va aux toilettes avant de te coucher : ton corps ne dépensera pas d'énergie à garder ce liquide au chaud.",
        "Couche-toi au chaud, pas transi : marche ou fais quelques flexions avant de te glisser dans le duvet.",
        "Bouillotte : remplis une gourde métallique ou bien étanche d'eau chaude, enveloppe-la dans une chaussette et place-la entre les cuisses ou contre le ventre.",
        "Garde un bonnet et des chaussettes sèches réservées à la nuit. Jamais les chaussettes humides de la journée.",
        "Ne respire pas dans le duvet : l'humidité de ton souffle le mouille. Laisse le nez et la bouche dehors et ferme la capuche autour.",
        "Ajoute tes vêtements secs sur toi ou dans le duvet là où tu as froid, et ton sac à dos sous tes pieds pour isoler du sol."
      ],
      attention: ["Une bouillotte trop chaude contre la peau peut brûler pendant le sommeil : toujours enveloppée.", "Si tu frissonnes sans pouvoir t'arrêter ou deviens maladroit, c'est le début de l'hypothermie : voir la fiche dédiée."] },
    { id: "condensation", cat: "Abri", titre: "Gérer l'humidité et la condensation", illus: "camp",
      intro: "Le matin, l'intérieur de la bâche ruisselle et le duvet est humide ? C'est la condensation : ton souffle et l'air humide qui se transforment en eau sur la toile froide.",
      etapes: [
        "Évite les fonds de vallée, les prairies humides et le bord immédiat de l'eau : c'est là que l'air est le plus humide et la rosée la plus forte.",
        "Laisse l'abri bien ouvert et aéré : une bâche relevée de quelques centimètres sur un côté fait circuler l'air.",
        "Ne fais pas sécher de vêtements mouillés sous l'abri pendant la nuit.",
        "Si la toile ruisselle, essuie-la avec un chiffon avant qu'elle ne goutte.",
        "Le matin, retourne le duvet et laisse-le sécher au soleil ou à l'air pendant le petit-déjeuner.",
        "Range la bâche mouillée à part, dans un sac extérieur, et fais-la sécher à la première pause ensoleillée."
      ] },
    { id: "camp_pluie", cat: "Abri", titre: "Installer le camp sous la pluie", illus: "abri_bache",
      intro: "Arriver au bivouac sous l'averse, c'est le moment où tout peut se mouiller. Méthode pour garder l'essentiel au sec.",
      etapes: [
        "Range ton sac la veille dans l'ordre inverse de l'installation : la bâche et la cordelette en haut, le duvet tout au fond dans un sac étanche.",
        "Monte le toit en premier (voir « Monter sa bâche sous la pluie et le vent »).",
        "Sous le toit, pose le tapis de sol ou une couche de feuilles, puis seulement le matelas et le duvet.",
        "Change-toi immédiatement : enlève les vêtements mouillés et enfile la tenue sèche réservée à la nuit.",
        "Garde les vêtements mouillés pour le lendemain, roulés dans un sac : tu les remettras pour marcher, et la tenue sèche restera sèche.",
        "Bois chaud et mange : un corps qui a froid et faim se réchauffe mal."
      ] }
  ];
  F.forEach(function (f) {
    if (T.some(function (t) { return t.id === f.id; })) return;
    f.source = SRC; T.push(f);
  });

  // ================= CHAPITRES =================
  var G = window.SYLVA_GUIDE || [];
  function chap(id) { return G.filter(function (c) { return c.id === id; })[0]; }
  var ab = chap("abris");
  if (ab) {
    ab.resume = "Bâche, hamac, abris naturels et abris d'urgence : choisir l'abri qui convient à la météo, le monter vite et bien, et y dormir au chaud et au sec.";
    ab.sections.splice(1, 0,
      { titre: "Choisir son abri selon la météo",
        liste: ["Temps sec et doux : un simple toit ou un appentis ouvert suffit, et permet de voir le ciel.",
                "Pluie : un abri en A bas, bien tendu, avec des ficelles anti-gouttes. Toujours bien isoler le sol.",
                "Vent : soc de charrue ou abri en A très bas, petit côté face au vent. Jamais d'appentis ouvert face au vent.",
                "Froid : un abri petit et bas, que ta chaleur suffit à réchauffer, avec beaucoup d'isolation au sol. Un abri naturel couvert de feuilles est souvent plus chaud qu'une bâche.",
                "Neige : tranchée couverte ou creux au pied d'un épicéa, et une aération qui reste ouverte.",
                "Sol mouillé ou en pente : le hamac, avec une isolation par-dessous et une bâche au-dessus."] },
      { titre: "Le bon matériel d'abri",
        liste: ["Une bâche de 3 × 3 m : assez grande pour une personne et son sac, assez légère (400 à 900 g). En 3 × 4 m, on peut faire un plancher.",
                "Au moins 15 m de cordelette solide, en plusieurs morceaux : 5 m pour la ligne faîtière, le reste pour les coins.",
                "6 à 8 sardines légères. Tu peux aussi les tailler sur place dans du bois mort.",
                "Un tapis de sol ou un grand sac poubelle, pour protéger le matelas de l'humidité.",
                "Quelques bouts de ficelle pour les gouttes, et des sangles larges si tu dors en hamac."],
        encadre: { type: "astuce", titre: "Astuce", texte: "Entraîne-toi à monter ta bâche dans ton jardin ou dans un parc, de jour puis à la frontale. Le soir du bivouac, sous la pluie et dans le noir, les gestes doivent être automatiques." } }
    );
    ab.sections.push(
      { titre: "Les erreurs les plus fréquentes",
        liste: ["S'installer trop tard : un abri se monte de jour. Vise au moins une heure avant le coucher du soleil.",
                "Faire trop grand : un grand abri est froid et prend le vent. On construit pour son corps.",
                "Oublier le sol : on peut avoir un toit parfait et grelotter toute la nuit par le dessous.",
                "Mal regarder en l'air : une branche morte au-dessus de l'abri est le danger numéro un.",
                "Tendre la bâche à plat : l'eau s'accumule en poche et finit par passer à travers. Toujours une pente." ],
        encadre: { type: "retenir", titre: "À retenir", texte: "Un bon abri, c'est un bon emplacement, un toit en pente, un sol isolé et une taille réduite. Dans cet ordre." } }
    );
    ab.fiches = ["ligne_faitiere", "bache", "appentis_bache", "soc_charrue", "bache_tube", "abri_poncho", "bache_tempete", "goutte_eau", "ancrages", "hamac",
                 "appentis", "debris", "abri_conique", "abri_chablis", "abri_rocher", "abri_neige", "lit_camp", "nuit_sans_duvet", "chaleur", "tendeur", "camionneur", "tourmort"];
  }
  var cp = chap("campement");
  if (cp) {
    cp.sections.splice(2, 0,
      { titre: "Regarder en haut, autour et en bas",
        p: ["Avant de poser le sac, deux minutes d'observation évitent l'essentiel des accidents de bivouac : une branche morte au-dessus de l'abri, un ruisseau qui peut monter, un creux où l'air froid s'accumule, un passage de sangliers. La fiche « Repérer les dangers du camp » détaille chaque point."],
        encadre: { type: "danger", titre: "Attention", texte: "Une branche morte peut tomber sans un souffle de vent. Ne dors jamais sous du bois mort, même pour une seule nuit." } }
    );
    cp.sections.push(
      { titre: "Les animaux autour du camp",
        p: ["En Belgique et dans les pays voisins, les visiteurs nocturnes sont des renards, des sangliers, des fouines et surtout des souris. Ils viennent pour la nourriture et les odeurs. Tout ce qui se mange ou qui sent (dentifrice compris) se range dans un sac fermé, suspendu à l'écart du couchage. Un sanglier n'attaque pas un campeur, mais il retournera ton sac s'il y sent un repas."] },
      { titre: "Quand il pleut",
        p: ["Sous la pluie, on monte le toit en premier, on s'installe dessous, puis on se change aussitôt en tenue sèche. Les vêtements mouillés se remettent le lendemain pour marcher : la tenue de nuit doit rester sèche, coûte que coûte."] }
    );
    cp.fiches = ["dangers_camp", "abri", "plan_camp", "nourriture_animaux", "nuit_chaude", "condensation", "camp_pluie", "froid", "cold", "lit_camp", "bache", "hamac", "tendeur", "traces"];
  }
})();
