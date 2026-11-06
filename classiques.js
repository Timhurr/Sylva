/* Sylva – savoir-faire des classiques du bushcraft (v0.9.14).
   Techniques tirées de trois ouvrages du domaine public, réécrites et adaptées à l'Europe d'aujourd'hui :
   G. W. Sears « Nessmuk », Woodcraft (1884) ; H. Kephart, The Book of Camping and Woodcraft (1906) ;
   D. C. Beard, The Book of Camp-Lore and Woodcraft (1920). Pratiques interdites ou dépassées retirées. */
(function () {
  "use strict";
  var T = window.SYLVA_TECHNIQUES || [];
  var C = window.SYLVA_CATEGORIES || [];
  if (C.indexOf("Équipement") === -1) C.splice(C.indexOf("Feu"), 0, "Équipement");
  var SRC = "Inspiré de Nessmuk (1884), Kephart (1906) et Beard (1920), ouvrages du domaine public, réécrit et adapté pour Sylva";
  var LOI_BOIS = "En Europe, on ne coupe pas d'arbres ni de branches vivantes sans l'accord du propriétaire : utilise du bois mort tombé au sol.";

  var F = [
    // ---------- Équipement ----------
    { id: "partir_leger", cat: "Équipement", titre: "Partir léger", illus: "kit",
      intro: "Le vieux principe des coureurs des bois : chaque objet doit mériter son poids. Un sac léger fatigue moins, et tu restes plus lucide.",
      etapes: [
        "Étale tout ton matériel par terre avant de partir et pèse le sac.",
        "Pour chaque objet, demande-toi : « Je m'en suis servi la dernière fois ? Est-ce qu'un autre objet fait déjà la même chose ? »",
        "Garde en priorité ce qui est difficile à fabriquer dehors : outil de coupe, abri, moyen de faire du feu, récipient pour l'eau, cordelette.",
        "Choisis des objets qui servent à plusieurs choses (la casserole sert aussi de bol, la bâche d'abri et de récupérateur de pluie).",
        "Répartis le matériel commun entre les membres du groupe, pour que personne ne porte tout.",
        "Pèse le sac au retour et note ce qui n'a pas servi : c'est la liste de ce que tu laisseras la prochaine fois."
      ],
      attention: ["Léger, mais jamais sans le minimum de sécurité : de quoi te réchauffer, te signaler et te soigner."] },
    { id: "habits_couches", cat: "Équipement", titre: "S'habiller pour le bivouac", illus: "cold",
      intro: "Deux vêtements fins gardent mieux la chaleur qu'un seul épais : l'air emprisonné entre eux isole.",
      etapes: [
        "Contre la peau : laine ou synthétique. Jamais de coton, qui reste mouillé et froid quand tu transpires.",
        "Par-dessus : une ou deux couches chaudes et fines (polaire, laine), faciles à enlever.",
        "À l'extérieur : une veste coupe-vent et pluie, assez ample pour passer par-dessus le reste.",
        "Un col qui se relève, un bonnet et des gants : on perd beaucoup de confort par le cou et les extrémités.",
        "Garde une tenue sèche uniquement pour la nuit, rangée dans un sac étanche.",
        "Enlève une couche avant de transpirer, en montée, et remets-la dès l'arrêt."
      ] },
    { id: "secher", cat: "Équipement", titre: "Sécher chaussures et vêtements", illus: "camp",
      intro: "Des affaires humides, c'est une nuit froide et des ampoules le lendemain. Mais trop près du feu, le cuir craque et le synthétique fond.",
      etapes: [
        "Bourre les chaussures mouillées d'herbe sèche, de feuilles ou de papier, et change-les toutes les heures : ça absorbe l'eau de l'intérieur.",
        "Fais sécher à l'air qui circule, sur une branche à bonne distance du feu : tu dois pouvoir tenir la main au même endroit sans gêne.",
        "Ne pose jamais des chaussures ou des vêtements synthétiques contre les pierres chaudes ou au-dessus des flammes.",
        "Chaussettes et gants humides : glisse-les sous ta veste ou dans le duvet, contre toi. Ta chaleur les sèche pendant la nuit.",
        "Le matin, secoue le duvet et aère-le : il garde l'humidité de ton corps."
      ] },
    { id: "affuter", cat: "Équipement", titre: "Entretenir couteau et hachette", illus: "kit",
      intro: "Un outil qui coupe bien est un outil plus sûr : il glisse moins et demande moins de force.",
      etapes: [
        "Emporte une petite pierre ou une plaquette d'affûtage, une face grossière et une face fine.",
        "Mouille la pierre, pose la lame à plat puis relève le dos d'environ 20° (l'épaisseur de deux pièces de monnaie sous le dos).",
        "Fais glisser la lame comme pour couper une fine tranche de la pierre, du talon à la pointe, autant de fois de chaque côté.",
        "Finis sur la face fine, puis sur une ceinture en cuir ou ton pantalon, dos de lame en avant.",
        "Enroule un peu de ficelle cirée ou de ruban adhésif sur le manche de la hachette : la prise reste sûre avec des mains mouillées.",
        "Essuie et sèche la lame chaque soir, une goutte d'huile alimentaire suffit contre la rouille."
      ],
      attention: ["Coupe toujours vers l'extérieur, jamais vers ta jambe ou ta main. À genoux pour la hachette : si elle rebondit, elle tape le sol et non ton tibia."] },
    { id: "ustensiles", cat: "Équipement", titre: "Ustensiles de fortune", illus: "kit",
      intro: "Avec un couteau et du bois mort, on fabrique en quelques minutes ce qui manque autour du feu.",
      etapes: [
        "Tisonnier : un bâton sec d'environ 1 m, gros comme deux doigts, aplati au bout, avec une encoche pour soulever l'anse d'une casserole.",
        "Pince à braises : un bâton souple d'un doigt d'épaisseur, aminci au milieu, chauffé doucement près des braises puis plié en deux. Taille les deux bouts pour qu'ils se rejoignent.",
        "Fourchette : une petite branche fourchue, écorcée et taillée en pointe.",
        "Spatule et cuillère : une planchette fendue dans du bois mort sain, creusée à la pointe du couteau.",
        "Balai de camp : des rameaux tombés liés autour d'un bâton, pour nettoyer la zone de feu et le sol de l'abri."
      ] },

    // ---------- Feu ----------
    { id: "silex", cat: "Feu", titre: "Feu au silex et à l'acier", illus: "feu_ferro",
      intro: "La méthode des anciens : un caillou dur et un morceau d'acier font jaillir des étincelles qui prennent sur un amadou préparé.",
      etapes: [
        "Trouve une pierre dure à arête vive : silex, quartz, chaille. Les pierres tendres (calcaire, ardoise) ne marchent pas.",
        "Prends un morceau d'acier au carbone : un briquet à silex, une vieille lime, ou le dos d'un couteau en acier non inoxydable.",
        "Pose un morceau de tissu charbonné ou d'amadou sur la pierre, tenu par le pouce, à 1 mm sous l'arête.",
        "Frappe l'arête de la pierre avec l'acier, d'un coup sec qui racle vers le bas, à environ 45°.",
        "Quand une étincelle prend sur l'amadou (un petit point rouge), souffle doucement dessus.",
        "Glisse-le dans un nid de fibres sèches et souffle jusqu'à la flamme."
      ],
      attention: ["Les étincelles d'acier sont froides : elles ne prennent que sur un amadou très sec et charbonné (fiche Tissu charbonné)."] },
    { id: "amadou_naturel", cat: "Feu", titre: "Trouver de l'amadou naturel", illus: "feu_preparation",
      intro: "L'amadou, c'est ce qui transforme une étincelle en flamme. La forêt en offre partout, à condition de le garder au sec.",
      etapes: [
        "Écorce de bouleau : les fines pellicules blanches de l'extérieur, même humides, brûlent grâce à leur huile. Prends-les sur un arbre mort ou au sol.",
        "Herbes sèches et fibres : herbe morte, barbe de clématite, duvet de massette (quenouille), fibres d'écorce intérieure de bois mort, frottées entre les mains.",
        "Vesse-de-loup sèche : la poudre brune d'une vesse-de-loup vieille et sèche prend les étincelles.",
        "Copeaux de bois résineux : gratte au couteau l'intérieur d'une souche de pin morte, très riche en résine.",
        "Range tout dans une boîte ou un sachet étanche, et ramasse de l'amadou pendant la marche quand tu en croises."
      ],
      attention: ["Ne prends pas d'écorce sur un arbre vivant : tu le blesses. Et n'emporte pas les nids d'oiseaux ou de rongeurs."] },
    { id: "feu_neige", cat: "Feu", titre: "Faire du feu sur la neige", illus: "feu_pluie",
      intro: "Un feu posé sur la neige s'enfonce et s'éteint dans sa propre eau. Il lui faut un plancher.",
      etapes: [
        "Tasse la neige avec les pieds sur un cercle d'un mètre.",
        "Pose un plancher de bois mort sec : une couche de bâtons serrés côte à côte, puis une seconde couche croisée.",
        "Construis le feu sur ce plancher, avec beaucoup de petit bois préparé à l'avance.",
        "Protège-le du vent avec une bâche, un rocher ou une rangée de bûches.",
        "Ajoute régulièrement des bûches au plancher quand il se consume."
      ],
      attention: ["Ne fais jamais de feu sous un arbre chargé de neige : la chaleur la fait tomber d'un bloc sur le feu."] },
    { id: "feu_trois_buches", cat: "Feu", titre: "Feu à trois bûches (feu en étoile)", illus: "feu_croix",
      intro: "Un feu économe qui dure : trois grosses bûches se rejoignent au centre, et tu les pousses au fur et à mesure qu'elles brûlent.",
      etapes: [
        "Allume un petit feu bien vif.",
        "Dispose trois bûches de bois mort autour, comme les rayons d'une étoile, leurs bouts dans les braises.",
        "Pour plus de chaleur, pousse les bûches vers le centre. Pour moins de chaleur, écarte-les.",
        "La nuit, rapproche-les juste avant de dormir : le feu couve jusqu'au matin."
      ] },
    { id: "feu_pierre", cat: "Feu", titre: "Feu sur rocher : attention aux pierres", illus: "feu_preparation",
      intro: "Une pierre humide ou poreuse peut éclater quand elle chauffe et projeter des éclats.",
      etapes: [
        "Évite les galets de rivière et les pierres qui ont trempé dans l'eau.",
        "Sur une dalle, étale d'abord une couche de terre ou de sable de quelques centimètres.",
        "Pour un cercle de pierres, choisis des pierres sèches, prises loin de l'eau.",
        "Ne t'assieds pas dos à une paroi rocheuse chauffée par le feu."
      ] },

    // ---------- Cuisine ----------
    { id: "feu_cuisine", cat: "Nourriture", titre: "Préparer un feu de cuisine", illus: "camp",
      intro: "On cuisine sur des braises, pas sur des flammes : les flammes noircissent les casseroles, brûlent l'extérieur et laissent l'intérieur cru.",
      etapes: [
        "Allume ton feu 30 à 45 minutes avant de cuisiner, avec du bois dur si possible (chêne, hêtre, frêne).",
        "Pose deux bûches parallèles, à la largeur de ta casserole : elles la soutiennent et gardent les braises au milieu.",
        "Laisse le bois se transformer en un lit de braises rouges.",
        "Garde un petit feu à côté pour produire de nouvelles braises, et ramène-les sous la casserole avec un bâton.",
        "Pour l'eau du thé ou du café, place la casserole sur les braises, pas dans la fumée : elle gardera un goût de fumée."
      ] },
    { id: "cremaillere", cat: "Nourriture", titre: "Crémaillère et support de casserole", illus: "camp",
      intro: "Pour suspendre une casserole au-dessus du feu et régler la hauteur, sans rien poser dans les braises.",
      etapes: [
        "Plante deux bâtons fourchus de chaque côté du feu, à environ 70 cm l'un de l'autre.",
        "Pose une traverse dans les deux fourches, au-dessus du feu.",
        "Crochet simple : une petite branche fourchue retournée, accrochée à la traverse, avec une encoche en bas pour l'anse.",
        "Crochet réglable : un bâton avec plusieurs encoches taillées à différentes hauteurs. Change d'encoche pour monter ou descendre la casserole.",
        "Variante en un seul bâton : plante un long bâton en biais dans le sol, son bout au-dessus du feu, et bloque son pied avec une grosse pierre."
      ],
      attention: ["Utilise du bois mort assez gros pour ne pas prendre feu : vérifie-le régulièrement."] },
    { id: "cuire_sans", cat: "Nourriture", titre: "Cuire sans ustensiles", illus: "pierres_chaudes",
      intro: "Une poêle n'est pas indispensable : braises, bâtons et cendres suffisent pour cuire poisson, viande ou pain.",
      etapes: [
        "Brochette : pique la nourriture sur une baguette de bois mort sain, et tiens-la au-dessus des braises, pas dans la flamme. Tourne souvent.",
        "Poisson à plat : ouvre-le en deux, coince-le entre deux baguettes fendues, et plante le tout en biais face aux braises.",
        "Pain de cendre : forme une galette épaisse (farine, eau, sel), pose-la sur une pierre plate très chaude ou enroule-la autour d'un bâton au-dessus des braises.",
        "Cuisson sous la cendre : enveloppe pommes de terre, poisson ou légumes dans de l'aluminium ou de grandes feuilles mouillées, enfouis-les sous les braises.",
        "Rôti suspendu : suspends un morceau de viande devant le feu avec une ficelle mouillée. En séchant, la ficelle tourne seule et fait tourner la viande."
      ],
      attention: ["N'utilise jamais de bois d'if, de laurier-cerise ou de houx pour les brochettes : ils sont toxiques."] },
    { id: "trou_braises", cat: "Nourriture", titre: "Four en trou de braises", illus: "feu_dakota",
      intro: "La cuisson lente des anciens : une marmite enterrée dans les braises cuit seule pendant que tu dors ou que tu marches.",
      etapes: [
        "Creuse un trou un peu plus grand que ta marmite à couvercle (idéalement en fonte).",
        "Allume un bon feu dedans et laisse-le brûler une heure pour chauffer les parois.",
        "Retire une partie des braises, pose la marmite fermée au fond, remets les braises autour et dessus.",
        "Recouvre de terre pour garder la chaleur.",
        "Laisse cuire 4 à 8 heures (haricots, ragoût), puis dégage la terre avec précaution."
      ],
      attention: ["Uniquement là où le feu est autorisé, loin des racines, et rebouche le trou avant de partir."] },
    { id: "bannock", cat: "Nourriture", titre: "Pain de trappeur (bannock)", illus: "camp",
      intro: "Le pain des voyageurs du Grand Nord : quelques ingrédients secs, de l'eau, et une poêle ou un bâton.",
      etapes: [
        "À la maison, mélange dans un sachet : 2 verres de farine, 1 cuillère à café de levure chimique, 1 pincée de sel, et si tu veux du lait en poudre ou du sucre.",
        "Au camp, ajoute de l'eau petit à petit jusqu'à obtenir une pâte souple qui ne colle pas aux doigts.",
        "À la poêle : aplatis la pâte sur 2 cm, cuis à feu doux sur des braises, 8 à 10 minutes de chaque côté.",
        "Au bâton : roule la pâte en un long boudin, enroule-le en spirale autour d'un bâton sec et tiens-le au-dessus des braises en tournant.",
        "Le pain est cuit quand il sonne creux quand on le tapote."
      ] },

    // ---------- Abri ----------
    { id: "lit_camp", cat: "Abri", titre: "Faire un lit de camp isolant", illus: "abri_debris",
      intro: "Le froid qui gâche une nuit vient presque toujours du sol, pas de l'air. Un bon lit isole par en dessous.",
      etapes: [
        "Ne dors jamais directement sur la terre nue, même avec un duvet : le sol aspire ta chaleur.",
        "Choisis un sol plat et légèrement surélevé, débarrassé des cailloux et des branches.",
        "Avec un matelas : ajoute dessous une couche de feuilles mortes sèches pour doubler l'isolation.",
        "Sans matelas : entasse au moins 20 à 30 cm de feuilles mortes sèches, d'herbes sèches ou de fougère morte. Une fois tassé, il doit en rester une épaisseur de main.",
        "Délimite le lit avec deux bûches mortes, une à la tête et une aux pieds, pour que la couche ne s'étale pas.",
        "Allonge-toi un moment puis remets du rembourrage là où ça s'est tassé."
      ],
      attention: [LOI_BOIS + " Les anciens coupaient des branches de sapin vivantes : c'est aujourd'hui interdit et inutile, les feuilles mortes isolent très bien."] },

    // ---------- Orientation ----------
    { id: "azimut_retour", cat: "Orientation", titre: "Revenir sur ses pas à la boussole", illus: "boussole",
      intro: "Si tu as noté ta direction en partant, tu peux toujours revenir : il suffit de suivre la direction inverse.",
      etapes: [
        "En quittant le camp ou le sentier, vise ta direction avec la boussole et note l'angle (par exemple 60°).",
        "Pour revenir, ajoute 180° si l'angle est inférieur à 180°, ou retire 180° sinon (60° + 180° = 240°).",
        "Règle la boussole sur ce nouvel angle et marche en visant des repères successifs : un arbre, un rocher, puis le suivant.",
        "Vérifie la boussole toutes les quelques minutes : on dévie presque toujours du même côté sans s'en rendre compte.",
        "Si le soleil ou une ombre se trouve d'un coup du « mauvais » côté, c'est que tu as tourné : arrête-toi et recale-toi."
      ] },
    { id: "perdu_calme", cat: "Orientation", titre: "Se croire perdu : les bons réflexes", illus: "stop",
      intro: "La plupart des accidents de personnes perdues viennent de la panique, pas du terrain. Ton premier outil, c'est le calme.",
      etapes: [
        "Arrête-toi, assieds-toi, bois un peu d'eau. Ne repars pas au hasard.",
        "Rappelle-toi le dernier endroit sûr que tu reconnais, et depuis combien de temps tu marches.",
        "Regarde la carte, la boussole, l'appli (position GPS sans réseau), le soleil.",
        "Si tu ne sais vraiment pas où tu es : marque l'endroit (branche, tissu de couleur) et explore en étoile, 100 pas maximum dans chaque direction, en revenant à chaque fois au point de départ.",
        "Une rivière ou un chemin mènent presque toujours vers des habitations : suis-les vers l'aval.",
        "Si la nuit tombe ou le temps se gâte : installe-toi pour la nuit et prépare des signaux plutôt que de continuer."
      ] }
  ];
  F.forEach(function (f) {
    if (T.some(function (t) { return t.id === f.id; })) return;
    f.source = SRC; T.push(f);
  });
})();
