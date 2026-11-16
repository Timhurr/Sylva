/* Sylva – Fabriquer soi-même (v0.9.91) : charbon de bois, colle de résine, eau de cendres, savon, saponaire, bougie de suif.
   Rédigé pour Sylva à partir de savoir-faire traditionnels, avec les mises en garde actuelles (soude caustique, charbon « dentifrice »,
   charbon médical). Rien n'est copié d'un livre. */
(function () {
  "use strict";
  var T = window.SYLVA_TECHNIQUES || [];
  var C = window.SYLVA_CATEGORIES || [];
  if (C.indexOf("Fabriquer") === -1) C.splice(C.indexOf("Éthique"), 0, "Fabriquer");
  var SRC = "Rédigé pour Sylva d'après des savoir-faire traditionnels, vérifiés avec les connaissances actuelles de sécurité.";
  function add(f) { if (!T.some(function (t) { return t.id === f.id; })) { f.cat = "Fabriquer"; f.source = f.source || SRC; T.push(f); } }

  add({ id: "fab_charbon", titre: "Fabriquer du charbon de bois", illus: "feu_preparation",
    intro: "Le charbon de bois, c'est du bois chauffé à l'abri de l'air : il perd son eau et ses gaz et devient presque du carbone pur. Il brûle chaud, sans flamme ni fumée, et sert à bien d'autres choses qu'au feu.",
    etapes: [
      "Petite quantité (la méthode la plus simple) : remplis une boîte métallique avec couvercle (boîte à biscuits, gamelle) de morceaux de bois sec et sain, sans écorce, de la taille d'un doigt. Feuillus durs de préférence : hêtre, chêne, charme, frêne.",
      "Perce un seul petit trou de 2 à 3 mm dans le couvercle, ferme la boîte et pose-la au milieu de belles braises.",
      "De la fumée, puis parfois une petite flamme, sort par le trou : ce sont les gaz du bois. Laisse faire.",
      "Quand plus rien ne sort du trou (souvent 20 à 40 minutes), retire la boîte du feu avec un bâton et bouche le trou avec de la terre ou une petite pierre.",
      "Laisse refroidir COMPLÈTEMENT, couvercle fermé, au moins une heure. Si tu ouvres trop tôt, l'air rallume le charbon.",
      "Grande quantité : la meule ou la fosse des charbonniers (bois empilé, couvert de terre, quelques jours de surveillance). C'est un vrai métier : réserve-le à un terrain à toi, loin des arbres, avec autorisation.",
      "À quoi il sert : combustible de cuisine qui chauffe fort sans fumée ; tissu charbonné pour allumer un feu ; couche de charbon pilé dans un filtre à eau (il améliore le goût et l'odeur, mais ne rend pas l'eau potable : il faut toujours la faire bouillir) ; colle de résine (voir la fiche) ; dessin et marquage ; camouflage du visage.",
      "Dents : faute de dentifrice, frotter les dents avec un bâtonnet mâchouillé suffit. Le charbon en poudre ne fait pas mieux : il est abrasif et peut user l'émail, les dentistes déconseillent de s'en servir régulièrement."
    ],
    attention: [
      "Le charbon maison n'est PAS du charbon « activé » médical : il ne sert à rien contre une intoxication. En cas d'intoxication, appelle le 112 ou le centre antipoison (en Belgique : 070 245 245). Le charbon activé de pharmacie ne se prend que sur leur conseil.",
      "Un sac de charbon chaud peut se rallumer tout seul des heures plus tard : stocke-le seulement bien froid, dans un récipient métallique.",
      "Jamais de bois peint, traité, vernis ou aggloméré : il dégage des fumées toxiques.",
      "Un feu ou un brasero au charbon dégage beaucoup de monoxyde de carbone, sans odeur : jamais dans une tente, une voiture ou une pièce fermée."
    ] });

  add({ id: "fab_colle", titre: "Colle de résine (poix de pin)", illus: "feu_preparation",
    intro: "Avec de la résine de pin ou d'épicéa, un peu de charbon et de la cire, on obtient une colle dure et étanche qui se réchauffe pour s'utiliser : réparer un manche, coller une pointe, boucher une fente, étanchéifier une couture.",
    etapes: [
      "Récolte la résine qui a déjà coulé et durci sur les blessures des troncs de pins ou d'épicéas. Ne blesse pas un arbre vivant pour en obtenir.",
      "Fais-la fondre doucement dans une vieille boîte de conserve, posée au bord des braises, pas dans les flammes : la résine est très inflammable.",
      "Retire les morceaux d'écorce et les débris avec un bâton (ou filtre-la à travers un tissu).",
      "Ajoute du charbon de bois réduit en poudre fine : environ une part de charbon pour trois à quatre parts de résine. Il rend la colle plus solide et moins cassante.",
      "Pour qu'elle casse moins au froid, ajoute un peu de cire d'abeille ou de graisse (environ une part pour dix).",
      "Mélange bien, puis enroule la colle chaude au bout d'un bâtonnet : tu as un « bâton de colle ».",
      "Pour coller : réchauffe le bâtonnet près des braises, étale la colle sur les deux pièces, assemble et tiens quelques secondes. Ligaturer par-dessus rend l'assemblage beaucoup plus solide."
    ],
    attention: [
      "La résine chaude colle à la peau et brûle comme de la cire : manipule-la avec un bâton, jamais avec les doigts.",
      "Si elle prend feu, étouffe-la avec un couvercle ou de la terre, jamais avec de l'eau.",
      "Pour nettoyer les mains : un peu d'huile ou de graisse, puis du savon."
    ] });

  add({ id: "fab_cendres", titre: "Eau de cendres : laver sans savon", illus: "eau_ebullition",
    intro: "La cendre de bois mélangée à de l'eau donne une « lessive » : une eau basique qui dégraisse. Nos grands-parents lavaient ainsi le linge, la vaisselle grasse et les sols. C'est aussi la base pour fabriquer du savon.",
    etapes: [
      "Prends de la cendre blanche ou grise de bois de feuillus (hêtre, chêne, frêne), bien froide et tamisée. Jamais de cendre de charbon de barbecue avec allume-feu, de bois peint ou traité, de papier imprimé ou de plastique.",
      "Mets environ un volume de cendre pour cinq à dix volumes d'eau dans un seau (pas en aluminium : la lessive l'attaque).",
      "Fais bouillir ou laisse tremper une journée en remuant de temps en temps, puis laisse reposer : la cendre tombe au fond.",
      "Récupère doucement l'eau claire du dessus, filtrée à travers un tissu. Elle est un peu glissante entre les doigts : c'est normal.",
      "Pour le linge : fais-le tremper dans cette eau tiède, frotte, puis rince à l'eau claire. Pour la vaisselle grasse : frotte avec un peu de cendre humide et rince bien."
    ],
    attention: [
      "Cette eau est caustique : elle irrite la peau et peut abîmer gravement les yeux. Porte des gants si tu en as, et rince tout de suite à grande eau en cas de projection. Dans l'œil : rince 15 minutes et demande un avis médical.",
      "Ne la bois jamais et range-la hors de portée des enfants, dans un récipient bien étiqueté.",
      "Elle abîme la laine et la soie : réserve-la au coton et au lin."
    ] });

  add({ id: "fab_savon", titre: "Savon à la cendre et à la graisse", illus: "eau_ebullition",
    intro: "Le savon naît d'une réaction entre une graisse et une base. Avec une eau de cendres très concentrée et de la graisse animale ou de l'huile, on obtient un savon mou, brun, rustique, mais qui lave. C'est une fabrication lente et un peu dangereuse : à faire au calme, pas en urgence.",
    etapes: [
      "Prépare une eau de cendres très concentrée (voir la fiche « Eau de cendres ») : repasse plusieurs fois la même eau sur de la cendre fraîche, ou fais-la réduire en la faisant bouillir longtemps.",
      "Test traditionnel de concentration : un œuf frais doit flotter à la surface en ne montrant qu'une petite partie de sa coquille. S'il coule, la lessive est trop faible.",
      "Prépare la graisse : suif de bœuf ou de mouton, saindoux, ou huile végétale. Fais-la fondre, filtre-la pour enlever les morceaux.",
      "Dans une grande marmite en fonte ou en inox (jamais en aluminium), verse doucement la lessive dans la graisse chaude, environ deux volumes de lessive pour un volume de graisse, en remuant sans arrêt avec un long bâton.",
      "Fais cuire à petit feu en remuant pendant une à plusieurs heures, jusqu'à ce que le mélange épaississe comme une crème et ne se sépare plus en couches.",
      "Verse dans un moule (boîte en bois tapissée de tissu) et laisse durcir au moins plusieurs semaines à l'air : le savon s'adoucit en vieillissant.",
      "Avant de l'utiliser sur la peau, fais un essai sur une petite zone du bras : s'il pique ou rougit, il contient encore trop de base. Garde-le alors pour le linge."
    ],
    attention: [
      "La lessive concentrée est très caustique : gants, manches longues et protection des yeux (lunettes) indispensables, enfants et animaux à distance.",
      "Ne te penche jamais au-dessus de la marmite : les éclaboussures brûlent la peau et les yeux. Dans l'œil : rince 15 minutes à l'eau claire et appelle le 112.",
      "Un savon maison est imprévisible : sans balance ni soude pure, on ne peut pas garantir qu'il soit doux pour la peau. N'en mets pas sur une plaie ni sur un bébé."
    ] });

  add({ id: "fab_saponaire", titre: "Se laver avec une plante : la saponaire", illus: "cueillette",
    intro: "La saponaire officinale (Saponaria officinalis) contient des saponines, des substances qui moussent dans l'eau et nettoient en douceur. C'est le savon le plus simple de la nature, sans rien de dangereux à manipuler.",
    etapes: [
      "Reconnaître : plante de 30 à 80 cm, des bords de chemins, talus et rives. Tiges dressées, feuilles opposées en ovale allongé avec 3 nervures bien visibles. En été, bouquets de fleurs roses pâles à 5 pétales, parfumées le soir.",
      "Cueille une poignée de feuilles et de tiges (la racine est encore plus riche, mais laisse la plante en place).",
      "Écrase-les ou coupe-les, puis froisse-les vigoureusement dans un peu d'eau entre tes mains : une mousse légère apparaît.",
      "Pour plus de mousse : fais bouillir une poignée de plante hachée dans un litre d'eau pendant 15 à 20 minutes, laisse refroidir et filtre. Ce liquide lave les mains, le corps et le linge délicat.",
      "Rince à l'eau claire, loin des cours d'eau."
    ],
    attention: [
      "Ne la bois pas et ne la mange pas : les saponines irritent le tube digestif.",
      "Évite les yeux : ça pique.",
      "Si tu n'es pas sûr de l'identification, ne l'utilise pas : en cas de doute, la cendre ou l'eau seule restent plus sûres.",
      "Même « naturelle », une mousse pollue un ruisseau : lave-toi à au moins 60 mètres de l'eau."
    ] });

  add({ id: "fab_bougie", titre: "Bougie de suif ou de graisse", illus: "feu_preparation",
    intro: "Avant la paraffine, on s'éclairait au suif, la graisse fondue des animaux. Avec la graisse d'une cuisson et un bout de coton, tu peux faire une bougie ou un lumignon qui éclaire plusieurs heures.",
    etapes: [
      "Récupère de la graisse : suif de bœuf ou de mouton (le plus dur), saindoux, ou graisse de cuisson refroidie. Fais-la fondre doucement et filtre-la à travers un tissu pour enlever les morceaux de viande.",
      "Mèche : un brin de coton pur (ficelle, lacet, bande de tee-shirt en coton torsadée). Trempe-la d'abord dans la graisse fondue et laisse-la durcir : elle tiendra droite.",
      "Bougie : fixe la mèche au fond d'un petit pot en métal ou en verre épais (une boîte de conserve propre, un bocal), garde-la droite avec deux brindilles posées sur le bord, puis verse la graisse fondue.",
      "Laisse figer au frais plusieurs heures avant d'allumer. Recoupe la mèche à environ 1 cm.",
      "Lumignon express : une coquille ou un petit récipient rempli de graisse, une mèche couchée dont le bout dépasse du bord."
    ],
    attention: [
      "Le suif fume un peu et sent la cuisine : aère la pièce.",
      "Ne la laisse jamais allumée sans surveillance, ni en dormant, et pose-la sur une surface qui ne brûle pas.",
      "Une bougie ne chauffe pas une pièce : elle éclaire. Pour se chauffer, couvre-toi, pas de feu improvisé dans une pièce fermée.",
      "Les odeurs de graisse attirent les animaux : en bivouac, range les restes loin de la tente."
    ] });

  // Rangement dans le chapitre « Couteau, outils et nœuds » s'il existe
  var G = window.SYLVA_GUIDE || [];
  var ch = G.filter(function (c) { return c.id === "couteau"; })[0];
  if (ch) ["fab_charbon", "fab_colle", "fab_cendres", "fab_savon", "fab_saponaire", "fab_bougie"].forEach(function (id) { if (ch.fiches.indexOf(id) === -1) ch.fiches.push(id); });
})();
