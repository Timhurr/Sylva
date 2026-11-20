/* Bivaska – textes légaux (conditions, confidentialité, mentions légales), en français et en anglais.
   Source unique : affichés dans l'appli (Réglages > Informations légales, et à accepter au premier lancement)
   et dans les pages docs/conditions.html et docs/confidentialite.html.
   Changer « version » quand le fond des conditions ou de la confidentialité change : l'appli redemande alors l'accord. */
(function () {
  "use strict";
  var MAIL = '<a href="mailto:contact@bivaska.eu">contact@bivaska.eu</a>';
  // Identité de l'éditeur : à compléter (nom, adresse, numéro d'entreprise) avant la sortie publique.
  var EDITEUR = { fr: "Bivaska", en: "Bivaska" };

  window.SYLVA_LEGAL = {
    version: "2026-11-20",
    date: { fr: "20 novembre 2026", en: "20 November 2026" },
    fr: {
      cgu: { titre: "Conditions d'utilisation", html:
        "<p>En utilisant Bivaska, tu acceptes ces conditions. Si tu ne les acceptes pas, n'utilise pas l'appli.</p>" +
        "<h3>1. Un outil d'aide, pas les secours</h3>" +
        "<p>Bivaska fournit des informations éducatives sur la nature, le bivouac, les premiers secours et la préparation aux crises. Elle ne remplace <b>ni les services de secours, ni un médecin, ni une formation aux premiers secours, ni les consignes des autorités</b>. En cas d'urgence, appelle le 112.</p>" +
        "<p>Ne mange jamais une plante, un champignon ou un animal sur la seule base de l'appli : les confusions peuvent être mortelles. Les mesures faites avec le téléphone (pouls, pente, distance, morse, clarté de l'eau…) sont des repères, pas des mesures fiables.</p>" +
        "<h3>2. Respect des lois</h3>" +
        "<p>Tu es seul responsable du respect des lois du lieu où tu te trouves : bivouac, feu, cueillette, pêche, chasse, accès aux propriétés et aux réserves naturelles, circulation. Les règles et informations affichées (chasses, aires de bivouac, réglementation de pêche…) sont des repères et peuvent être incomplètes ou dépassées : seules les sources officielles et l'affichage sur le terrain font foi.</p>" +
        "<h3>3. Compte (facultatif)</h3>" +
        "<p>L'appli s'utilise sans compte. Le compte sert à sauvegarder tes données et à participer à la communauté. Il est réservé aux personnes de 13 ans et plus. Tu es responsable de l'accès à ton adresse e-mail, qui sert à te connecter.</p>" +
        "<h3>4. Règles de partage (communauté)</h3>" +
        "<ul>" +
        "<li>Ne partage que des lieux où dormir est <b>autorisé</b> : aire de bivouac officielle, terrain privé avec l'accord du propriétaire, camping, ou zone où la loi le permet ou le tolère.</li>" +
        "<li>Pas d'habitation, de propriété privée sans accord, de réserve naturelle intégrale ni de lieu dangereux.</li>" +
        "<li>Pas de photo où une personne ou une plaque d'immatriculation est reconnaissable, ni de contenu violent, sexuel ou haineux.</li>" +
        "<li>Pas de coordonnées personnelles (téléphone, adresse, e-mail), de publicité ni de lien.</li>" +
        "<li>Pas de conseil médical ou de consommation de plantes et champignons présenté comme sûr.</li>" +
        "<li>Reste respectueux : critique un lieu, pas une personne.</li>" +
        "</ul>" +
        "<p>Les premières contributions de chaque membre sont relues avant publication. Tout contenu peut être signalé avec le bouton « Signaler » ; il est vérifié et retiré s'il enfreint ces règles ou la loi. Un compte qui enfreint les règles de manière répétée peut être suspendu.</p>" +
        "<h3>5. Contenu des membres</h3>" +
        "<p>Les spots, avis et photos sont publiés sous la responsabilité de leur auteur. En les partageant, tu accordes à Bivaska le droit gratuit de les afficher dans l'appli, et tu garantis en avoir le droit (photo prise par toi).</p>" +
        "<h3>6. Propriété intellectuelle</h3>" +
        "<p>Les textes, gravures et schémas de Bivaska sont protégés. Les données de tiers (OpenStreetMap, Wikimedia, services publics…) restent sous leur propre licence, indiquée dans Réglages > Sources et crédits.</p>" +
        "<h3>7. Responsabilité</h3>" +
        "<p>Bivaska est fournie « en l'état », sans garantie de disponibilité ni d'exactitude. Malgré le soin apporté, des erreurs sont possibles : signale-les. Dans les limites permises par la loi, l'éditeur ne peut être tenu responsable d'un dommage résultant d'une mauvaise utilisation des informations, d'un lieu partagé par un membre, d'une donnée de tiers erronée ou d'une panne de l'appli, du téléphone ou du réseau.</p>" +
        "<h3>8. Gratuité et abonnement</h3>" +
        "<p>Les fonctions de sécurité (mode crise, premiers secours, plantes toxiques, Prêt 72 h) restent gratuites et sans compte. Les conditions d'un éventuel abonnement seront précisées à son lancement et devront être acceptées séparément.</p>" +
        "<h3>9. Modifications et droit applicable</h3>" +
        "<p>Ces conditions peuvent évoluer : en cas de changement important, l'appli te demandera de les accepter à nouveau. Elles sont soumises au droit belge. Contact : " + MAIL + ".</p>" },
      conf: { titre: "Politique de confidentialité", html:
        "<p>Bivaska est conçue pour fonctionner sans compte et sans réseau. Par défaut, <b>toutes tes données restent sur ton téléphone</b> : l'éditeur n'y a pas accès. Il n'y a ni publicité, ni cookie publicitaire, ni outil de mesure d'audience.</p>" +
        "<h3>Sans compte</h3>" +
        "<p>Spots, journal, sortie, sac, kit 72 h, stock, progrès, photos et « Mes infos d'urgence » sont enregistrés uniquement dans ton appareil (stockage local du navigateur). Ta position GPS est utilisée sur le téléphone et n'est jamais envoyée à Bivaska.</p>" +
        "<p>Pour fonctionner, l'appli interroge des services tiers sans t'identifier : cartes (IGN Belgique, OpenFreeMap, MapTiler si tu ajoutes ta clé), météo et altitude (Open-Meteo), lieux (OpenStreetMap / Overpass, Nominatim), itinéraires (OSRM), chasse (Service public de Wallonie), photos d'espèces (Wikimedia). Ces services reçoivent ton adresse IP et la zone consultée, comme pour n'importe quel site.</p>" +
        "<h3>Avec un compte (facultatif)</h3>" +
        "<ul>" +
        "<li><b>Ce qui est stocké</b> : ton adresse e-mail (pour te connecter), un pseudo public si tu participes, une copie de sauvegarde de tes données Bivaska (spots, sortie, sac, kit, stock, journal sans photos, progrès).</li>" +
        "<li><b>Ce qui n'est jamais envoyé</b> : « Mes infos d'urgence » (santé, groupe sanguin, traitements), le minuteur de garrot, tes clés d'API, ta position en direct.</li>" +
        "<li><b>Où</b> : serveurs Supabase situés dans l'Union européenne (Francfort), données chiffrées en transit et au repos. Les codes de connexion sont envoyés par e-mail via Brevo (France).</li>" +
        "<li><b>Pourquoi</b> : uniquement pour sauvegarder et synchroniser tes données et faire fonctionner la communauté (base légale : l'exécution du service que tu demandes). Aucune revente, aucun profilage.</li>" +
        "<li><b>Combien de temps</b> : tant que ton compte existe. Tout est effacé quand tu le supprimes.</li>" +
        "</ul>" +
        "<h3>Communauté</h3>" +
        "<p>Ce que tu partages volontairement (spot, avis, photo, idée) est public avec ton pseudo. Les signalements d'erreur peuvent être envoyés sans compte ; ils ne contiennent que ton message, l'élément concerné et la version de l'appli.</p>" +
        "<h3>Tes droits</h3>" +
        "<p>Tu peux à tout moment te déconnecter, ou <b>supprimer ton compte depuis Réglages</b> : ta sauvegarde, tes spots partagés, tes avis, tes photos et tes votes sont alors effacés définitivement. Tu disposes aussi des droits d'accès, de rectification, d'effacement, d'opposition et de portabilité (RGPD) : écris à " + MAIL + ". Tu peux introduire une réclamation auprès de l'Autorité de protection des données (autoriteprotectiondonnees.be).</p>" },
      mentions: { titre: "Mentions légales", html:
        "<p><b>Éditeur</b> : " + EDITEUR.fr + ", " + MAIL + ".</p>" +
        "<p><b>Hébergement de l'appli</b> : GitHub Pages (GitHub, Inc., San Francisco, États-Unis).</p>" +
        "<p><b>Comptes et communauté</b> : Supabase (serveurs dans l'Union européenne, Francfort). E-mails : Brevo (France).</p>" +
        "<p><b>Contenus de tiers</b> : cartes et lieux © contributeurs OpenStreetMap (ODbL), IGN Belgique, OpenFreeMap ; photos Wikimedia Commons (auteur et licence sous chaque photo) ; météo Open-Meteo (CC BY 4.0). Détail dans Réglages > Sources et crédits.</p>" +
        "<p>Bivaska est un outil éducatif. En cas d'urgence : 112.</p>" },
      accept: "J'ai lu et j'accepte les <a href=\"#\" data-legal=\"cgu\">conditions d'utilisation</a> et la <a href=\"#\" data-legal=\"conf\">politique de confidentialité</a>.",
      maj: "Dernière mise à jour : "
    },
    en: {
      cgu: { titre: "Terms of use", html:
        "<p>By using Bivaska, you accept these terms. If you don't accept them, don't use the app.</p>" +
        "<h3>1. A helping tool, not the emergency services</h3>" +
        "<p>Bivaska provides educational information about nature, bivouacking, first aid and crisis preparedness. It does <b>not replace the emergency services, a doctor, first-aid training or the instructions of the authorities</b>. In an emergency, call 112.</p>" +
        "<p>Never eat a plant, mushroom or animal based on the app alone: mix-ups can be deadly. Measurements made with the phone (pulse, slope, distance, Morse, water clarity…) are rough guides, not reliable measurements.</p>" +
        "<h3>2. Obeying the law</h3>" +
        "<p>You alone are responsible for obeying the laws of the place where you are: bivouacking, fires, foraging, fishing, hunting, access to private land and nature reserves, traffic. The rules and information shown (hunts, bivouac areas, fishing rules…) are guides and may be incomplete or out of date: only official sources and signs on site are authoritative.</p>" +
        "<h3>3. Account (optional)</h3>" +
        "<p>The app works without an account. An account is used to back up your data and take part in the community. It is for people aged 13 and over. You are responsible for access to your e-mail address, which is used to sign in.</p>" +
        "<h3>4. Sharing rules (community)</h3>" +
        "<ul>" +
        "<li>Only share places where sleeping is <b>allowed</b>: official bivouac area, private land with the owner's permission, campsite, or an area where the law allows or tolerates it.</li>" +
        "<li>No homes, private property without permission, strict nature reserves or dangerous places.</li>" +
        "<li>No photo in which a person or a number plate can be recognised, and no violent, sexual or hateful content.</li>" +
        "<li>No personal contact details (phone, address, e-mail), advertising or links.</li>" +
        "<li>No medical advice, and no eating of plants or mushrooms presented as safe.</li>" +
        "<li>Be respectful: criticise a place, not a person.</li>" +
        "</ul>" +
        "<p>Each member's first contributions are reviewed before publication. Any content can be reported with the “Report” button; it is checked and removed if it breaks these rules or the law. An account that repeatedly breaks the rules may be suspended.</p>" +
        "<h3>5. Members' content</h3>" +
        "<p>Spots, reviews and photos are published under their author's responsibility. By sharing them, you give Bivaska the free right to display them in the app, and you confirm that you have the right to do so (a photo you took yourself).</p>" +
        "<h3>6. Intellectual property</h3>" +
        "<p>Bivaska's texts, engravings and diagrams are protected. Third-party data (OpenStreetMap, Wikimedia, public services…) stays under its own licence, shown in Settings > Sources and credits.</p>" +
        "<h3>7. Liability</h3>" +
        "<p>Bivaska is provided “as is”, with no guarantee of availability or accuracy. Despite the care taken, errors are possible: please report them. To the extent permitted by law, the publisher cannot be held liable for damage resulting from misuse of the information, a place shared by a member, wrong third-party data, or a failure of the app, the phone or the network.</p>" +
        "<h3>8. Free features and subscription</h3>" +
        "<p>The safety features (crisis mode, first aid, poisonous plants, 72-hour readiness) stay free and need no account. The terms of any future subscription will be set out when it launches and will have to be accepted separately.</p>" +
        "<h3>9. Changes and governing law</h3>" +
        "<p>These terms may change: if there is a significant change, the app will ask you to accept them again. They are governed by Belgian law. Contact: " + MAIL + ".</p>" },
      conf: { titre: "Privacy policy", html:
        "<p>Bivaska is designed to work without an account and without a network. By default, <b>all your data stays on your phone</b>: the publisher has no access to it. There is no advertising, no advertising cookie and no audience tracking.</p>" +
        "<h3>Without an account</h3>" +
        "<p>Spots, journal, trip, pack, 72-hour kit, stock, progress, photos and “My emergency info” are stored only on your device (the browser's local storage). Your GPS position is used on the phone and is never sent to Bivaska.</p>" +
        "<p>To work, the app queries third-party services without identifying you: maps (IGN Belgium, OpenFreeMap, MapTiler if you add your key), weather and altitude (Open-Meteo), places (OpenStreetMap / Overpass, Nominatim), routes (OSRM), hunting (Public Service of Wallonia), species photos (Wikimedia). These services receive your IP address and the area you look at, as with any website.</p>" +
        "<h3>With an account (optional)</h3>" +
        "<ul>" +
        "<li><b>What is stored</b>: your e-mail address (to sign in), a public username if you take part, a backup copy of your Bivaska data (spots, trip, pack, kit, stock, journal without photos, progress).</li>" +
        "<li><b>What is never sent</b>: “My emergency info” (health, blood group, medication), the tourniquet timer, your API keys, your live position.</li>" +
        "<li><b>Where</b>: Supabase servers in the European Union (Frankfurt), data encrypted in transit and at rest. Sign-in codes are sent by e-mail through Brevo (France).</li>" +
        "<li><b>Why</b>: only to back up and sync your data and run the community (legal basis: providing the service you ask for). No selling, no profiling.</li>" +
        "<li><b>How long</b>: as long as your account exists. Everything is erased when you delete it.</li>" +
        "</ul>" +
        "<h3>Community</h3>" +
        "<p>What you choose to share (spot, review, photo, idea) is public with your username. Error reports can be sent without an account; they contain only your message, the item concerned and the app version.</p>" +
        "<h3>Your rights</h3>" +
        "<p>You can sign out at any time, or <b>delete your account from Settings</b>: your backup, shared spots, reviews, photos and votes are then permanently erased. You also have the rights of access, rectification, erasure, objection and portability (GDPR): write to " + MAIL + ". You can lodge a complaint with the Belgian Data Protection Authority (dataprotectionauthority.be).</p>" },
      mentions: { titre: "Legal notice", html:
        "<p><b>Publisher</b>: " + EDITEUR.en + ", " + MAIL + ".</p>" +
        "<p><b>App hosting</b>: GitHub Pages (GitHub, Inc., San Francisco, United States).</p>" +
        "<p><b>Accounts and community</b>: Supabase (servers in the European Union, Frankfurt). E-mails: Brevo (France).</p>" +
        "<p><b>Third-party content</b>: maps and places © OpenStreetMap contributors (ODbL), IGN Belgium, OpenFreeMap; photos from Wikimedia Commons (author and licence under each photo); weather by Open-Meteo (CC BY 4.0). Details in Settings > Sources and credits.</p>" +
        "<p>Bivaska is an educational tool. In an emergency: 112.</p>" },
      accept: "I have read and accept the <a href=\"#\" data-legal=\"cgu\">terms of use</a> and the <a href=\"#\" data-legal=\"conf\">privacy policy</a>.",
      maj: "Last updated: "
    }
  };
  window.SYLVA_LEGAL.get = function (lang) { return window.SYLVA_LEGAL[lang] || window.SYLVA_LEGAL.fr; };
})();
