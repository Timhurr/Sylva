/* Sylva – isolation du sol et valeur R (v0.9.51). Rédigé pour Sylva. */
(function () {
  "use strict";
  var T = window.SYLVA_TECHNIQUES || [];
  if (T.some(function (t) { return t.id === "isolation_sol"; })) return;
  T.push({ id: "isolation_sol", cat: "Équipement", titre: "Isolation du sol : comprendre la valeur R", illus: "kit", priorite: true,
    source: "Norme ASTM F3340 (mesure de la résistance thermique des matelas) et normes EN/ISO 23537 (sacs de couchage). Rédigé pour Sylva.",
    intro: "La nuit, c'est le sol qui te vole le plus de chaleur, pas l'air : ton poids écrase le duvet du sac sous toi, qui n'isole plus. C'est le matelas qui t'isole du sol, et sa valeur R dit à quel point.",
    etapes: [
      "La valeur R mesure la résistance du matelas au passage de la chaleur. Plus elle est haute, plus tu es isolé du sol froid.",
      "Depuis 2020, les grandes marques mesurent la valeur R avec la même méthode (norme ASTM F3340). Ces valeurs sont comparables entre elles. Les anciennes valeurs « maison » ne le sont pas.",
      "Les valeurs R s'additionnent : une mousse R 2 sous un gonflable R 4, ça fait R 6. Mets la mousse dessous : elle protège le gonflable des épines et t'isole encore s'il crève.",
      "Repères pour la température de la nuit : au-dessus de 10 °C, R 2 suffit ; de 5 à 10 °C, vise R 3 ; de 0 à 5 °C, R 3,5 à 4 ; de −5 à 0 °C, R 4,5 ; de −10 à −5 °C, R 5,5 ; en dessous, R 6 et plus.",
      "Ajoute environ 1 si tu es frileux, et encore 1 sur sol mouillé ou sur la neige.",
      "Le sac de couchage complète : sa température « confort » est celle où une personne frileuse dort bien, sa température « limite » celle où une personne qui a chaud dort recroquevillée sans avoir froid. En dessous de la limite, c'est le risque d'hypothermie.",
      "Sans matelas suffisant : un lit épais de feuilles mortes ou de fougères bien sèches (30 cm avant de le tasser), des branches de résineux, ton sac à dos vide et ta corde sous les jambes. C'est moins efficace qu'un vrai matelas, mais bien mieux que rien.",
      "Utilise le calculateur de Sylva (Apprendre > Outils de terrain > Valeur R) : il additionne ton matériel et le compare à la nuit prévue sur ton lieu de bivouac."
    ],
    attention: [
      "Un matelas gonflable sans isolation intérieure (R 1 environ) est glacial dès que la nuit passe sous 10 °C, même avec un bon sac.",
      "La couverture de survie posée au sol n'isole presque pas du froid du sol : elle coupe l'humidité, pas la conduction.",
      "Un sac de couchage mouillé perd une grande partie de sa chaleur, surtout en duvet : garde-le au sec dans un sac étanche."
    ] });
  var G = window.SYLVA_GUIDE || [];
  ["preparer", "campement", "abris"].forEach(function (id) {
    var c = G.filter(function (x) { return x.id === id; })[0];
    if (c) { c.fiches = c.fiches || []; if (c.fiches.indexOf("isolation_sol") === -1) c.fiches.push("isolation_sol"); }
  });
})();
