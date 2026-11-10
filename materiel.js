/* Sylva – catalogue de matériel courant (v0.9.57). Valeurs publiées par les fabricants ou relevées par des tests, avec leur source.
   r = valeur R (ASTM F3340 sauf mention), comf/lim = températures confort et limite du sac (ISO 23537), poids en grammes (taille regular, ou taille indiquée). */
window.SYLVA_GEAR_CAT = [
  // Matelas
  { cat: "matelas", nom: "Therm-a-Rest Z Lite SOL (regular)", r: 2.0, poids: 397, src: "https://www.halfwayanywhere.com/trails/pacific-crest-trail/therm-a-rest-neoair-xlite-nxt-review/" },
  { cat: "matelas", nom: "Therm-a-Rest NeoAir XLite NXT (regular)", r: 4.5, poids: 369, src: "https://www.halfwayanywhere.com/trails/pacific-crest-trail/therm-a-rest-neoair-xlite-nxt-review/" },
  { cat: "matelas", nom: "Therm-a-Rest NeoAir XTherm NXT (regular)", r: 7.3, poids: 425, src: "https://trailverdict-site.pages.dev/how-to-choose-sleeping-pad-r-value-comfort-guide" },
  { cat: "matelas", nom: "Therm-a-Rest NeoAir UberLite (regular)", r: 2.3, poids: 250, src: "https://www.halfwayanywhere.com/trails/pacific-crest-trail/therm-a-rest-neoair-xlite-nxt-review/" },
  { cat: "matelas", nom: "NEMO Tensor All-Season (regular)", r: 5.4, poids: 482, src: "https://trailverdict-site.pages.dev/how-to-choose-sleeping-pad-r-value-comfort-guide" },
  { cat: "matelas", nom: "NEMO Tensor Insulated (regular)", r: 4.2, poids: 411, src: "https://www.halfwayanywhere.com/trails/pacific-crest-trail/therm-a-rest-neoair-xlite-nxt-review/" },
  { cat: "matelas", nom: "NEMO Switchback (regular)", r: 2.0, poids: 415, src: "https://www.halfwayanywhere.com/trails/pacific-crest-trail/therm-a-rest-neoair-xlite-nxt-review/" },
  { cat: "matelas", nom: "Sea to Summit Ether Light XT Insulated (regular)", r: 3.2, poids: 490, src: "https://www.treelinereview.com/gearreviews/sea-to-summit-ether-light-xt-insulated-air-sleeping-pad-review" },
  { cat: "matelas", nom: "Sea to Summit Ether Light XT Extreme (regular)", r: 6.2, poids: 720, src: "https://www.treelinereview.com/gearreviews/sea-to-summit-ether-light-xt-insulated-air-sleeping-pad-review" },
  { cat: "matelas", nom: "Sea to Summit Ultralight Insulated (regular)", r: 3.1, poids: 480, src: "https://www.halfwayanywhere.com/trails/pacific-crest-trail/therm-a-rest-neoair-xlite-nxt-review/" },
  { cat: "matelas", nom: "Exped SynMat HL (M)", r: 3.3, poids: 349, src: "https://www.halfwayanywhere.com/trails/pacific-crest-trail/therm-a-rest-neoair-xlite-nxt-review/" },
  { cat: "matelas", nom: "Big Agnes Q-Core SLX (regular)", r: 4.5, poids: 539, src: "https://trailverdict-site.pages.dev/how-to-choose-sleeping-pad-r-value-comfort-guide" },
  { cat: "matelas", nom: "Klymit Static V Insulated", r: 4.4, poids: 709, src: "https://trailverdict-site.pages.dev/how-to-choose-sleeping-pad-r-value-comfort-guide" },
  { cat: "matelas", nom: "REI Co-op Flash Insulated (regular)", r: 4.7, poids: 425, src: "https://trailverdict-site.pages.dev/how-to-choose-sleeping-pad-r-value-comfort-guide" },
  { cat: "matelas", nom: "Decathlon Forclaz MT500 mousse isolante 195 × 55 cm", r: 2.2, poids: 480, src: "https://decathlon.qa/products/trekking-folding-foam-mattress-mt500-insulating-195-x-55-cm-1-person" },
  { cat: "matelas", nom: "Decathlon Forclaz MT500 Air (L)", r: 1.5, poids: 510, src: "https://decathlon.com/collections/backpacking-pads/products/forclaz-mt500-air-mattress-189392", note: "Valeur R annoncée sans précision de norme." },
  // Sacs de couchage
  { cat: "sac", nom: "Decathlon Forclaz MT500 0 °C synthétique (M)", comf: 0, lim: -5, poids: 1220, src: "https://decathlon.ch/en/p/sac-de-couchage-de-trekking-mt500-0-c-synthetique/_/R-p-346447" },
  { cat: "sac", nom: "Decathlon Forclaz MT500 5 °C (L)", comf: 5, lim: 0, poids: 1200, src: "https://decathlon.ch/en/p/sac-de-couchage-de-trekking-mt500-5-c-polyester/_/R-p-311218" },
  { cat: "sac", nom: "Decathlon Forclaz MT500 10 °C (L)", comf: 10, lim: 5, poids: 970, src: "https://decathlon.com.kh/en/sleeping-equipment/311236-52428-trekking-sleeping-bag-mt500-10c-polyester.html" },
  { cat: "sac", nom: "Decathlon Forclaz Trek 900 0 °C duvet (L)", comf: 0, lim: -5, poids: 950, src: "https://www.outzer.fr/avis/sac-de-couchage/forclaz/trek-900-0/0/11390.html" },
  // Abri
  { cat: "abri", nom: "DD Hammocks Tarp 3 × 3", poids: 790, src: "https://www.packstack.io/reviews/shelter/dd-hammocks-dd-tarp-3x3", note: "Sans sardines ni tendeurs." },
  // Réchauds
  { cat: "rechaud", nom: "BRS-3000T", poids: 26, src: "https://minimalist-hiking-gear.pages.dev/lightest-backpacking-stove" },
  { cat: "rechaud", nom: "MSR PocketRocket 2", poids: 73, src: "https://minimalist-hiking-gear.pages.dev/lightest-backpacking-stove" },
  { cat: "rechaud", nom: "Soto WindMaster", poids: 67, src: "https://minimalist-hiking-gear.pages.dev/lightest-backpacking-stove" },
  { cat: "rechaud", nom: "Jetboil Stash", poids: 200, src: "https://minimalist-hiking-gear.pages.dev/lightest-backpacking-stove" },
  { cat: "rechaud", nom: "MSR WhisperLite", poids: 330, src: "https://minimalist-hiking-gear.pages.dev/lightest-backpacking-stove" }
];
