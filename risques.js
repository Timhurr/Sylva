/* Bivaska – sites nucléaires en service près des pays couverts (v0.9.76). Positions approximatives (± 1 km), d'après les données publiques des exploitants.
   La zone de 20 km est un ordre de grandeur des zones de planification d'urgence (Belgique, France) : seuls les plans officiels font foi. */
window.SYLVA_RISQUES = [
  { nom: "Doel", pays: "BE", type: "Centrale nucléaire", lat: 51.3256, lon: 4.2594, r: 20 },
  { nom: "Tihange", pays: "BE", type: "Centrale nucléaire", lat: 50.5347, lon: 5.2739, r: 20 },
  { nom: "Mol-Dessel (SCK CEN, Belgoprocess)", pays: "BE", type: "Site nucléaire de recherche", lat: 51.2180, lon: 5.0930, r: 10 },
  { nom: "Fleurus (IRE)", pays: "BE", type: "Production de radio-isotopes", lat: 50.4570, lon: 4.5360, r: 10 },
  { nom: "Borssele", pays: "NL", type: "Centrale nucléaire", lat: 51.4308, lon: 3.7180, r: 20 },
  { nom: "Gravelines", pays: "FR", type: "Centrale nucléaire", lat: 51.0150, lon: 2.1360, r: 20 },
  { nom: "Chooz", pays: "FR", type: "Centrale nucléaire", lat: 50.0900, lon: 4.7890, r: 20 },
  { nom: "Cattenom", pays: "FR", type: "Centrale nucléaire", lat: 49.4160, lon: 6.2180, r: 20 },
  { nom: "Penly", pays: "FR", type: "Centrale nucléaire", lat: 49.9770, lon: 1.2120, r: 20 },
  { nom: "Paluel", pays: "FR", type: "Centrale nucléaire", lat: 49.8580, lon: 0.6360, r: 20 },
  { nom: "Flamanville", pays: "FR", type: "Centrale nucléaire", lat: 49.5370, lon: -1.8820, r: 20 },
  { nom: "Nogent-sur-Seine", pays: "FR", type: "Centrale nucléaire", lat: 48.5150, lon: 3.5180, r: 20 },
  { nom: "Dampierre-en-Burly", pays: "FR", type: "Centrale nucléaire", lat: 47.7330, lon: 2.5170, r: 20 },
  { nom: "Belleville-sur-Loire", pays: "FR", type: "Centrale nucléaire", lat: 47.5100, lon: 2.8750, r: 20 },
  { nom: "Saint-Laurent-des-Eaux", pays: "FR", type: "Centrale nucléaire", lat: 47.7200, lon: 1.5780, r: 20 },
  { nom: "Chinon", pays: "FR", type: "Centrale nucléaire", lat: 47.2300, lon: 0.1700, r: 20 },
  { nom: "Civaux", pays: "FR", type: "Centrale nucléaire", lat: 46.4570, lon: 0.6530, r: 20 },
  { nom: "Le Blayais", pays: "FR", type: "Centrale nucléaire", lat: 45.2560, lon: -0.6930, r: 20 },
  { nom: "Golfech", pays: "FR", type: "Centrale nucléaire", lat: 44.1070, lon: 0.8450, r: 20 },
  { nom: "Bugey", pays: "FR", type: "Centrale nucléaire", lat: 45.7980, lon: 5.2710, r: 20 },
  { nom: "Saint-Alban", pays: "FR", type: "Centrale nucléaire", lat: 45.4040, lon: 4.7550, r: 20 },
  { nom: "Cruas-Meysse", pays: "FR", type: "Centrale nucléaire", lat: 44.6330, lon: 4.7570, r: 20 },
  { nom: "Tricastin", pays: "FR", type: "Centrale nucléaire", lat: 44.3300, lon: 4.7320, r: 20 },
  { nom: "La Hague (Orano)", pays: "FR", type: "Usine de retraitement", lat: 49.6780, lon: -1.8800, r: 20 },
  { nom: "Beznau", pays: "CH", type: "Centrale nucléaire", lat: 47.5523, lon: 8.2280, r: 20 },
  { nom: "Gösgen", pays: "CH", type: "Centrale nucléaire", lat: 47.3656, lon: 7.9667, r: 20 },
  { nom: "Leibstadt", pays: "CH", type: "Centrale nucléaire", lat: 47.6011, lon: 8.1828, r: 20 }
];
window.SYLVA_SEVESO = {
  BE: ["Wallonie : géoportail (sites Seveso)", "https://geoportail.wallonie.be"],
  FR: ["Géorisques : risques près de chez toi", "https://www.georisques.gouv.fr"],
  LU: ["Infocrise : risques", "https://infocrise.public.lu"],
  NL: ["Risicokaart.nl", "https://www.risicokaart.nl"],
  DE: ["BBK : Gefahren", "https://www.bbk.bund.de"],
  CH: ["Alertswiss : dangers", "https://www.alertswiss.ch"]
};
