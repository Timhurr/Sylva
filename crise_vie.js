/* Sylva – Vivre une crise qui dure (v0.9.92) : hygiène, santé de base sans médecin, traitements, personnes fragiles,
   animaux, moral, électricité et congélateur. Rédigé pour Sylva d'après l'OMS (réhydratation orale), l'USDA (congélateur),
   les CDC (groupes électrogènes et monoxyde de carbone) et les guides officiels de préparation (UE, Belgique, Croix-Rouge).
   Ces fiches ne remplacent pas un médecin : dès qu'un signe d'alerte apparaît, appelle le 112. */
(function () {
  "use strict";
  var T = window.SYLVA_TECHNIQUES || [];
  var SRC = "Rédigé pour Sylva d'après les recommandations officielles (OMS, Croix-Rouge, protection civile, USDA, CDC). En cas de doute sur la santé de quelqu'un, appelle le 112.";
  function add(f) { if (!T.some(function (t) { return t.id === f.id; })) { f.cat = "Crises"; f.source = f.source || SRC; T.push(f); } }

  add({ id: "crise_toilettes", titre: "Toilettes et hygiène sans eau courante", illus: "kit", priorite: true,
    intro: "Quand l'eau ou les égouts ne fonctionnent plus, les mains sales et les excréments mal gérés rendent malade plus vite que la faim. Quelques règles simples évitent diarrhées et infections.",
    etapes: [
      "Toilettes sèches : un seau avec couvercle (ou la cuvette des toilettes vidée de son eau), un sac poubelle solide dedans, et un matériau qui couvre après chaque passage : sciure, cendre de bois froide, litière pour chat, terre sèche.",
      "Méthode à deux seaux si possible : un pour l'urine (beaucoup moins sale, on peut la diluer et la jeter sur un sol non cultivé, loin des puits), un pour les selles. Séparer réduit fortement les odeurs.",
      "Ferme le sac quand il est au tiers, double-le, et stocke-le dehors dans une poubelle fermée, à l'ombre, jusqu'à la reprise des collectes.",
      "Si les égouts débordent ou que les autorités le demandent, ne tire plus la chasse : l'eau sale pourrait remonter chez toi ou chez les voisins.",
      "Mains : lave-les après les toilettes et avant de manger ou de cuisiner, même avec très peu d'eau. Un bidon avec robinet ou une bouteille percée au-dessus d'une bassine, un peu de savon : 20 secondes de frottement. Le gel hydroalcoolique dépanne si les mains ne sont pas visiblement sales.",
      "Toilette du corps : un gant et une bassine d'eau tiède suffisent ; commence par le visage, finis par les pieds et les parties intimes. Change de sous-vêtements le plus souvent possible.",
      "Règles : prévois en réserve des protections jetables pour plusieurs cycles. Une coupe menstruelle ou des serviettes lavables évitent d'en manquer ; lave-les à l'eau froide puis bouillante si possible.",
      "Vaisselle : racle d'abord, puis lave dans une bassine d'eau chaude savonneuse et rince à l'eau désinfectée ou bouillie. Laisse sécher à l'air."
    ],
    attention: [
      "Diarrhée chez plusieurs personnes du foyer : renforce encore le lavage des mains et isole les toilettes du malade si possible.",
      "Ne jette jamais les déchets humains dans un cours d'eau ou près d'un puits."
    ] });

  add({ id: "crise_rehydratation", titre: "Diarrhée et déshydratation : la solution maison", illus: "eau_ebullition", priorite: true,
    intro: "En crise, l'eau douteuse et l'hygiène difficile font des diarrhées. Le vrai danger est la déshydratation, surtout chez les bébés, les enfants et les personnes âgées. Une solution de réhydratation se prépare avec de l'eau, du sucre et du sel.",
    etapes: [
      "La meilleure option : les sachets de réhydratation orale (SRO) de pharmacie. Mets-en dans ton kit, surtout si tu as de jeunes enfants.",
      "Sans sachet, la recette de l'OMS : 1 litre d'eau potable (bouillie puis refroidie), 6 cuillères à café rases de sucre et une demi-cuillère à café rase de sel. Mélange jusqu'à dissolution complète.",
      "Mesure avec soin : trop de sel est dangereux, surtout pour un enfant. Goûte : la solution ne doit pas être plus salée que des larmes.",
      "Fais boire par petites gorgées, souvent, même en cas de vomissements (une cuillère toutes les 1 à 2 minutes). Un adulte boit au moins un verre après chaque selle liquide.",
      "Continue à manger dès que possible des aliments simples (riz, pâtes, banane, pain). Un bébé allaité continue à téter.",
      "Prépare une nouvelle solution chaque jour et jette ce qui reste après 24 heures."
    ],
    alerte: [
      "Bébé de moins de 6 mois avec diarrhée ou vomissements.",
      "Plus de pipi depuis 6 à 8 heures, bouche très sèche, yeux creux, pleurs sans larmes, fontanelle creusée chez le bébé.",
      "Somnolence anormale, confusion, difficulté à réveiller la personne.",
      "Sang dans les selles, forte fièvre, vomissements qui empêchent de boire quoi que ce soit.",
      "Diarrhée qui dure plus de 2 à 3 jours chez un adulte, plus de 24 heures chez un jeune enfant."
    ],
    attention: ["Dans tous ces cas d'alerte : appelle le 112 ou un médecin. La solution maison aide à tenir, elle ne soigne pas la cause."] });

  add({ id: "crise_fievre", titre: "Fièvre et petits maux sans médecin", illus: "premiers_secours",
    intro: "Pendant une crise, les cabinets médicaux peuvent être fermés ou débordés. Savoir gérer une fièvre ou un mal courant, et surtout reconnaître ce qui ne peut pas attendre, évite d'encombrer les secours inutilement et d'attendre trop longtemps quand c'est grave.",
    etapes: [
      "Fièvre : à partir de 38 °C. Elle aide le corps à se défendre ; on la traite surtout pour le confort.",
      "Découvre la personne (pas de couvertures épaisses), garde la pièce tempérée, fais boire beaucoup et souvent.",
      "Médicament : le paracétamol est en général le premier choix. Respecte exactement la notice pour la dose, l'intervalle entre les prises et le maximum par jour ; pour un enfant, la dose dépend de son poids : suis le dosage indiqué sur la boîte ou la pipette.",
      "Ne donne jamais d'aspirine à un enfant ou un adolescent sans avis médical.",
      "Rhume, mal de gorge : repos, boissons chaudes, miel (pas avant un an), lavages du nez à l'eau salée. Ils passent seuls en une semaine environ.",
      "Petites plaies : nettoie à l'eau propre et au savon, désinfecte, couvre d'un pansement propre et change-le chaque jour. Surveille l'infection : rougeur qui s'étend, chaleur, pus, fièvre.",
      "Note sur un papier l'heure et la dose de chaque médicament donné : en crise, on oublie vite."
    ],
    alerte: [
      "Bébé de moins de 3 mois avec 38 °C ou plus.",
      "Taches violacées sur la peau qui ne s'effacent pas quand on appuie un verre dessus.",
      "Raideur de la nuque, mal de tête violent, confusion, convulsions.",
      "Difficulté à respirer, lèvres bleutées, douleur dans la poitrine.",
      "Fièvre au-delà de 3 jours, ou plus de 40 °C qui ne baisse pas avec le traitement."
    ],
    attention: ["Ces signes ne peuvent pas attendre : appelle le 112, même si les services sont saturés."] });

  add({ id: "crise_traitements", titre: "Traitements quotidiens : ne pas tomber à court", illus: "kit", priorite: true,
    intro: "Insuline, médicaments du cœur, de la tension, épilepsie, asthme, thyroïde, contraception… Une interruption brutale peut être plus dangereuse que la crise elle-même. Ça se prépare avant.",
    etapes: [
      "Fais la liste complète de tes traitements : nom, dosage, horaire, médecin prescripteur. Garde-la dans ton kit, sur papier, et dans « Mes infos d'urgence » (fenêtre SOS).",
      "Demande à ton médecin et à ton pharmacien comment garder une petite avance (une ou deux semaines). Ne stocke jamais sans leur avis.",
      "Fais tourner cette avance : utilise d'abord les boîtes les plus anciennes, surveille les dates de péremption (Prêt 72 h > Stock).",
      "Insuline et médicaments à garder au frais : les flacons non entamés vont au réfrigérateur ; celui en cours supporte en général la température ambiante pendant une durée indiquée sur la notice. En panne de courant, garde-les dans une glacière ou un sac isotherme, jamais au contact direct de la glace, jamais congelés.",
      "Lunettes de rechange, appareils auditifs et piles, matériel de mesure (lecteur de glycémie, tensiomètre) et leurs consommables font partie du traitement.",
      "Si tu dépends d'un appareil électrique (oxygène, respirateur, dialyse à domicile) : signale-toi à ton fournisseur d'électricité, à ton prestataire médical et à ta commune, et prévois avec eux ce qui se passe en cas de coupure."
    ],
    attention: [
      "Ne prends jamais le traitement de quelqu'un d'autre, et n'arrête pas un traitement de toi-même : certains (cortisone, anti-épileptiques, cœur) sont dangereux à interrompre brutalement.",
      "En cas d'oubli ou de manque, appelle un pharmacien : en crise, les pharmacies de garde restent la meilleure ressource."
    ] });

  add({ id: "crise_fragiles", titre: "Enfants, personnes âgées et dépendantes", illus: "kit",
    intro: "Une crise pèse beaucoup plus sur les plus jeunes et les plus fragiles. Ils ont besoin d'un kit adapté, et surtout de quelqu'un qui pense à eux.",
    etapes: [
      "Bébés : lait infantile pour plusieurs jours et eau en bouteille pour le préparer, biberons, couches, lingettes, crème, vêtements de rechange, thermomètre, sachets de réhydratation, paracétamol adapté au poids.",
      "Enfants : leur doudou, un jeu ou un livre, des encas qu'ils aiment, une photo de la famille avec ton numéro écrit au dos dans leur poche.",
      "Explique la situation avec des mots simples et calmes, sans mentir ni dramatiser. Les enfants imitent le calme des adultes.",
      "Garde des repères : heures des repas, coucher, petits rituels. Donne-leur un rôle (surveiller la lampe, compter les bouteilles) : se sentir utile rassure.",
      "Personnes âgées : traitements, lunettes, appareils auditifs, aide à la marche, protections, un plaid. Elles ressentent moins la soif et se déshydratent vite : fais-les boire régulièrement.",
      "Elles supportent mal la chaleur comme le froid : en canicule, un endroit frais et de l'eau ; en hiver, plusieurs couches et une pièce chauffée.",
      "Personnes isolées dans ton immeuble ou ta rue : passe frapper. Beaucoup de victimes des canicules et des grands froids vivaient seules."
    ],
    attention: ["Ajoute les besoins de chacun dans Prêt 72 h > Kit (nombre de bébés, d'enfants, d'adultes) : la liste s'adapte."] });

  add({ id: "crise_animaux", titre: "Les animaux de compagnie en crise", illus: "traces",
    intro: "Les animaux font partie du foyer. Ne pas les avoir prévus pousse des gens à rester dans une maison dangereuse ou à y retourner. Mieux vaut organiser leur kit à l'avance.",
    etapes: [
      "Nourriture pour au moins 3 jours, idéalement une semaine, dans une boîte étanche, et leurs gamelles.",
      "Eau : compte environ 50 à 60 ml par kilo et par jour pour un chien ou un chat, en plus de l'eau du foyer.",
      "Laisse, collier ou harnais, caisse de transport pour les chats et les petits animaux, litière et sacs.",
      "Leurs médicaments, leur carnet de vaccination, et une photo récente de toi avec l'animal (pour prouver qu'il est à toi s'il se perd).",
      "Vérifie que sa puce électronique est enregistrée avec ton numéro de téléphone actuel.",
      "Renseigne-toi à l'avance : tous les centres d'accueil d'urgence n'acceptent pas les animaux. Repère un proche, une pension ou un vétérinaire qui pourrait le garder.",
      "Si tu dois évacuer, emmène-le si possible. S'il faut vraiment le laisser, ne l'attache pas : il doit pouvoir fuir l'eau ou le feu. Laisse beaucoup d'eau et de nourriture, et un mot sur la porte."
    ],
    attention: ["Un animal stressé peut mordre ou s'enfuir : garde-le en laisse ou en caisse pendant une évacuation, même s'il est habituellement calme."] });

  add({ id: "crise_moral", titre: "Garder le moral quand ça dure", illus: "priorites",
    intro: "Peur, colère, fatigue, insomnie, difficulté à se concentrer : ce sont des réactions normales à une situation anormale. Elles passent en général avec le temps, mais quelques gestes aident à tenir et à aider les autres.",
    etapes: [
      "Respire : inspire par le nez en comptant jusqu'à 4, expire lentement par la bouche en comptant jusqu'à 6. Répète une à deux minutes : le cœur ralentit et les idées s'éclaircissent.",
      "Garde une routine : heures de lever, repas, petites tâches, coucher. Elle donne une prise sur une situation qu'on ne contrôle pas.",
      "Agis sur ce que tu peux : une liste de trois choses utiles pour la journée, et coche-les. Agir fait reculer l'angoisse.",
      "Dors autant que possible, même par petits morceaux. Un esprit épuisé prend de mauvaises décisions.",
      "Informe-toi aux sources officielles deux ou trois fois par jour, puis coupe. Les rumeurs et le flot d'images d'horreur épuisent.",
      "Reste en lien : parle avec tes proches et tes voisins, propose ton aide. Aider les autres est l'un des meilleurs remèdes contre l'impuissance.",
      "Évite l'alcool et les somnifères pris sans avis médical : ils aggravent l'anxiété et le sommeil.",
      "Seul longtemps : parle à voix haute, écris un journal (le journal de bord de Sylva sert aussi à ça), fixe-toi de petits objectifs."
    ],
    alerte: [
      "Idées de mourir ou de se faire du mal.",
      "Ne plus pouvoir manger, dormir ou s'occuper de soi pendant plusieurs jours.",
      "Cauchemars, sursauts et angoisses qui ne diminuent pas après quelques semaines."
    ],
    attention: ["Dans ces cas, parle-en : à un proche, à un médecin, ou à une ligne d'écoute (en Belgique : Télé-Accueil au 107 ; en France : le 3114). En danger immédiat : 112."] });

  add({ id: "crise_electricite", titre: "Panne longue : électricité et congélateur", illus: "urgence",
    intro: "Une panne de plusieurs jours pose deux questions : comment recharger l'essentiel (téléphone, lampes, radio) et que faire de la nourriture du frigo et du congélateur. Avec, en prime, un danger mortel : le monoxyde de carbone.",
    etapes: [
      "Recharger : batteries externes chargées à l'avance, petit panneau solaire avec batterie, lampes et radio à dynamo. Garde le téléphone en mode économie d'énergie et coupe ce qui ne sert pas.",
      "La voiture peut recharger un téléphone, moteur tournant, uniquement dehors, jamais dans un garage même porte ouverte.",
      "Groupe électrogène : uniquement en plein air, à au moins 6 mètres de la maison, échappement dirigé loin des portes et fenêtres. Jamais dans un garage, une cave, un abri de jardin ou sous un auvent.",
      "Ne branche jamais un groupe électrogène directement sur une prise de la maison : il peut renvoyer du courant sur le réseau et tuer un technicien. Utilise des rallonges adaptées, ou fais installer un inverseur par un électricien.",
      "Frigo et congélateur : garde les portes fermées. Un congélateur plein garde le froid environ 48 heures, à moitié plein environ 24 heures. Un frigo fermé tient environ 4 heures.",
      "Après la panne : un aliment du congélateur qui contient encore des cristaux de glace, ou qui est resté à 4 °C ou moins, peut être recongelé ou cuisiné. Le reste du frigo (viande, poisson, lait, plats cuisinés) qui est resté plus de 2 heures au-dessus de 4 °C se jette.",
      "Astuce : un thermomètre dans le frigo et le congélateur, et des bouteilles d'eau congelées qui remplissent l'espace et servent de pains de glace (puis d'eau potable)."
    ],
    attention: [
      "Le monoxyde de carbone est invisible et sans odeur. Maux de tête, nausées, vertiges, somnolence chez plusieurs personnes à la fois : sors immédiatement à l'air libre et appelle le 112.",
      "Jamais de barbecue, de brasero ou de chauffage d'appoint à combustion dans une pièce fermée, une tente ou un garage.",
      "En cas de doute sur un aliment, jette-le : une intoxication alimentaire en pleine crise est un vrai danger."
    ],
    source: "Rédigé pour Sylva d'après les recommandations de l'USDA (sécurité des aliments en cas de coupure de courant) et des CDC (groupes électrogènes et monoxyde de carbone)." });

  var G = window.SYLVA_GUIDE || [];
  var ch = G.filter(function (c) { return c.id === "crises"; })[0];
  if (ch) ["crise_toilettes", "crise_rehydratation", "crise_fievre", "crise_traitements", "crise_fragiles", "crise_animaux", "crise_moral", "crise_electricite"].forEach(function (id) { if (ch.fiches.indexOf(id) === -1) ch.fiches.push(id); });
})();
