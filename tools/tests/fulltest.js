const { chromium, devices } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '../..');
fs.mkdirSync(path.join(__dirname, 'shots'), { recursive: true });
const srv = http.createServer((q, r) => {
  let u = decodeURIComponent(q.url.split('?')[0]);
  let f = path.join(root, u);
  if (u.endsWith('/')) f += 'index.html';
  fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); return; }
    const ext = path.extname(f); r.writeHead(200, {'Content-Type': {'.js':'text/javascript','.css':'text/css','.html':'text/html','.json':'application/json','.webp':'image/webp','.png':'image/png','.webmanifest':'application/manifest+json'}[ext]||'application/octet-stream'}); r.end(d); });
}).listen(8766);
const stub = `(function(){function mk(){var f=function(){return p};var p=new Proxy(f,{get:function(t,k){if(k==='getCenter')return function(){return{lat:50.1,lng:5.7}};if(k==='getBounds')return function(){return{getSouth:()=>50,getWest:()=>5,getNorth:()=>50.2,getEast:()=>5.8,contains:()=>true}};if(k==='getZoom')return function(){return 12};if(k==='then')return undefined;return p},apply:function(){return p}});return p}window.L=mk();})();`;
const METEO = {current:{temperature_2m:6.1,weather_code:3},daily:{time:['2026-11-06','2026-11-07','2026-11-08'],weather_code:[3,61,2],temperature_2m_max:[9,8,10],temperature_2m_min:[-1,2,3],precipitation_sum:[0,12,0],precipitation_probability_max:[10,80,20],wind_gusts_10m_max:[20,65,25],sunrise:['2026-11-06T07:55','2026-11-07T07:57','2026-11-08T07:59'],sunset:['2026-11-06T16:58','2026-11-07T16:56','2026-11-08T16:55']}};
const PLANTNET = {results:[{score:0.91,species:{scientificNameWithoutAuthor:'Urtica dioica',commonNames:['Ortie'],family:{scientificNameWithoutAuthor:'Urticaceae'}}},{score:0.05,species:{scientificNameWithoutAuthor:'Lamium album',commonNames:['Lamier blanc'],family:{scientificNameWithoutAuthor:'Lamiaceae'}}}]};
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...devices['iPhone 13'], serviceWorkers: 'block' });
  const pg = await ctx.newPage();
  const errs = [], missing = new Set();
  pg.on('pageerror', e => errs.push('PAGEERR ' + e.message));
  pg.on('console', m => { if (m.type() === 'error' && !/ERR_FAILED|Failed to load resource/.test(m.text())) errs.push('CONSOLE ' + m.text()); });
  pg.on('response', r => { if (r.url().includes('localhost') && r.status() >= 400) missing.add(r.url()); });
  await pg.route(/unpkg\.com.*\.js/, r => r.fulfill({ body: stub, contentType: 'text/javascript' }));
  await pg.route(/unpkg\.com.*\.css/, r => r.fulfill({ body: '', contentType: 'text/css' }));
  await pg.route(/plantnet/, r => r.fulfill({ contentType: 'application/json', body: JSON.stringify(PLANTNET) }));
  await pg.route(/(fonts\.|openstreetmap|overpass|open-meteo|wikipedia|wikimedia|nominatim)/, r => {
    if (r.request().url().includes('open-meteo')) return r.fulfill({ contentType:'application/json', body: JSON.stringify(METEO)});
    return r.abort();
  });
  await pg.addInitScript(() => { localStorage.setItem('sylva_key', JSON.stringify('TESTKEY')); });
  await pg.goto('http://localhost:8766/index.html');
  await pg.waitForTimeout(1000);
  const report = [];
  const ok = (name, cond, info='') => report.push((cond?'OK   ':'FAIL ') + name + (info?' — '+info:''));

  // ---- toutes les fiches, chapitres, especes
  const counts = await pg.evaluate(async () => {
    const res = {tech:0, techErr:[], chap:0, chapErr:[], esp:0, espErr:[], noImg:[], stepImgs:0};
    const T = window.SYLVA_TECHNIQUES, G = window.SYLVA_GUIDE, E = window.SYLVA_ESPECES;
    const IM = new Set(window.SYLVA_IMAGES);
    const click = sel => { const el = document.querySelector(sel); if (el) el.click(); return !!el; };
    // utilise les fonctions via des boutons de recherche globale
    for (const t of T) {
      try {
        const input = document.querySelector('#searchAll');
        // ouvrir directement via un faux bouton dans learnResults
        const r = document.querySelector('#learnResults'); r.hidden = false;
        r.innerHTML = '<button class="item" data-tech="' + t.id + '">x</button>';
        r.querySelector('button').click();
        const body = document.querySelector('#sheetBody');
        if (!body.textContent.includes(t.titre)) res.techErr.push(t.id);
        res.stepImgs += body.querySelectorAll('.step-img').length;
        if (!IM.has(t.id) && !body.querySelector('.step-img') && !body.querySelector('.engr') && t.cat !== 'Nœuds') res.noImg.push(t.id);
        document.querySelector('#sheet').hidden = true; res.tech++;
      } catch (e) { res.techErr.push(t.id + ':' + e.message); }
    }
    for (const c of G) {
      try {
        const r = document.querySelector('#learnResults');
        r.innerHTML = '<button class="item" data-chap="' + c.id + '">x</button>'; r.querySelector('button').click();
        if (!document.querySelector('#sheetBody').textContent.includes(c.titre)) res.chapErr.push(c.id);
        if (!document.querySelector('#sheetBody .engr')) res.noImg.push('chap_' + c.id);
        document.querySelector('#sheet').hidden = true; res.chap++;
      } catch (e) { res.chapErr.push(c.id + ':' + e.message); }
    }
    for (const s of E) {
      try {
        const r = document.querySelector('#learnResults');
        r.innerHTML = '<button class="item" data-esp="' + s.id + '">x</button>'; r.querySelector('button').click();
        if (!document.querySelector('#sheetBody').textContent.includes(s.nom)) res.espErr.push(s.id);
        document.querySelector('#sheet').hidden = true; res.esp++;
      } catch (e) { res.espErr.push(s.id + ':' + e.message); }
    }
    document.querySelector('#learnResults').hidden = true;
    return res;
  });
  await pg.waitForTimeout(1500);
  ok('Fiches pratiques ouvertes : ' + counts.tech, counts.techErr.length === 0, counts.techErr.join(','));
  ok('Chapitres ouverts : ' + counts.chap, counts.chapErr.length === 0, counts.chapErr.join(','));
  ok('Espèces ouvertes : ' + counts.esp, counts.espErr.length === 0, counts.espErr.join(','));
  ok('Fiches (hors nœuds) sans illustration gravée', counts.noImg.length === 0, counts.noImg.join(', '));
  ok('Images d\'étapes affichées', counts.stepImgs > 0, String(counts.stepImgs));

  // ---- pas a pas : navigation et mode isolé
  const pas = await pg.evaluate(() => {
    const r = document.querySelector('#learnResults'); r.innerHTML = '<button class="item" data-tech="ps_saignement">x</button>'; r.querySelector('button').click();
    const box = document.querySelector('.steps:not([hidden])'); const n = +box.dataset.n;
    for (let i = 0; i < n + 1; i++) box.querySelector('[data-step="1"]').click();
    const allMode = box.classList.contains('all');
    document.querySelector('[data-ps-mode="secours"]').click();
    const secVisible = !document.querySelector('.steps[data-mode="secours"]').hidden && document.querySelector('.steps[data-mode="isole"]').hidden;
    const red = !!document.querySelector('.red-flags');
    document.querySelector('#sheetClose').click();
    return { allMode, secVisible, red, closed: document.querySelector('#sheet').hidden };
  });
  ok('Pas à pas : suivant jusqu\'au bout', pas.allMode);
  ok('Bascule « Seul / Secours joignables »', pas.secVisible);
  ok('Encadré rouge des signes d\'alerte', pas.red);
  ok('Fermeture de fiche', pas.closed);

  // ---- ecrans
  await pg.click('.tab[data-view="accueil"]'); await pg.waitForTimeout(300);
  const acc = await pg.evaluate(() => ({ temp: document.querySelector('#heroTemp').textContent, alerts: document.querySelectorAll('#homeAlerts .notice').length, season: document.querySelectorAll('#homeSeason .season-card').length, guide: document.querySelector('#homeGuide').textContent.length }));
  ok('Accueil : météo', acc.temp === '6°', acc.temp);
  ok('Accueil : alertes (gel, vent, pluie)', acc.alerts >= 2, acc.alerts + ' alertes');
  ok('Accueil : espèces de saison', acc.season > 0, acc.season + ' cartes');
  ok('Accueil : reprise du guide', acc.guide > 10);
  await pg.click('#tripCard'); await pg.waitForTimeout(300);
  await pg.click('#btnTrip'); await pg.fill('#tripLieu', "Vallée de l'Ourthe"); await pg.fill('#tripDate', '2026-11-12'); await pg.click('#formTrip button[type="submit"]'); await pg.waitForTimeout(200);
  const trip = await pg.evaluate(() => [document.querySelector('#tripName').textContent, document.querySelector('#tripWhen').textContent]);
  ok('Bivouac : enregistrer la sortie', trip[0] === "Vallée de l'Ourthe" && /jours|Demain/.test(trip[1]), trip.join(' / '));
  const met = await pg.evaluate(() => document.querySelectorAll('#meteo .day').length);
  ok('Bivouac : météo 3 jours', met === 3, String(met));
  // checklist
  const chk = await pg.evaluate(() => { const c = document.querySelector('#checklist input[type="checkbox"]'); c.click(); return document.querySelector('#checkPct').textContent; });
  ok('Checklist : cocher et pourcentage', /%/.test(chk) && chk !== '0 %', chk);
  await pg.click('#btnEditCheck'); await pg.waitForTimeout(200);
  const ed = await pg.evaluate(() => document.querySelectorAll('#checklist .edit-input').length);
  await pg.click('#btnEditCheck');
  ok('Checklist : mode modification', ed > 5, ed + ' champs');
  // carte
  await pg.click('.tab[data-view="carte"]'); await pg.waitForTimeout(300);
  ok('Carte : écran affiché', await pg.isVisible('#formPlace'));
  await pg.click('#btnAddSpot'); await pg.waitForTimeout(200);
  const spotModal = await pg.isVisible('#modalSpot');
  if (spotModal) { await pg.fill('#spotNote', 'test'); await pg.click('#formSpot button[type="submit"]'); }
  ok('Carte : ajouter un spot', spotModal);
  // scan
  await pg.click('.tab[data-view="scan"]'); await pg.waitForTimeout(200);
  const png = fs.readFileSync(path.join(root, 'icons/icon-192.png'));
  await pg.setInputFiles('#galleryInput', { name: 'p.png', mimeType: 'image/png', buffer: png });
  await pg.waitForTimeout(2500);
  const scan = await pg.evaluate(() => ({ top: (document.querySelector('.res-top') || {}).textContent || '', st: document.querySelector('#scanStatus').textContent }));
  ok('Scanner : résultat (Pl@ntNet simulé)', /Ortie/.test(scan.top), scan.top.slice(0, 60) || scan.st.slice(0, 80));
  await pg.screenshot({ path: path.join(__dirname, 'shots/ft-scan.png') });
  // apprendre
  await pg.click('.tab[data-view="apprendre"]'); await pg.waitForTimeout(200);
  await pg.fill('#searchAll', 'chaise'); await pg.waitForTimeout(200);
  const srch = await pg.evaluate(() => document.querySelectorAll('#learnResults .item').length);
  ok('Recherche globale', srch > 0, srch + ' résultats');
  await pg.fill('#searchAll', '');
  await pg.click('[data-learn-cat="champignon"]'); await pg.waitForTimeout(200);
  const ch = await pg.evaluate(() => document.querySelectorAll('#listEspeces .item').length);
  ok('Espèces : catégorie champignons', ch > 5, ch + ' espèces');
  await pg.click('#btnRegion'); await pg.click('[data-pays="FR"]'); await pg.click('#btnRegionOk'); await pg.waitForTimeout(200);
  ok('Changement de région', await pg.evaluate(() => document.querySelector('#regionPays').textContent === 'France'));
  await pg.click('#btnRegion'); await pg.click('[data-pays="BE"]'); await pg.click('#btnRegionOk');
  // SOS
  await pg.click('#btnSos'); await pg.waitForTimeout(200);
  ok('SOS : fenêtre et appel 112', await pg.isVisible('#modalSos') && await pg.evaluate(() => !!document.querySelector('#modalSos a[href="tel:112"]')));
  await pg.click('#modalSos [data-close]');
  // reglages + nuit
  await pg.click('.tab[data-view="accueil"]'); await pg.click('#btnSettings'); await pg.click('[data-theme-opt="nuit"]');
  ok('Mode nuit manuel', await pg.evaluate(() => document.documentElement.dataset.theme === 'nuit'));
  await pg.screenshot({ path: path.join(__dirname, 'shots/ft-nuit.png') });
  await pg.click('[data-theme-opt="auto"]'); await pg.click('#modalSettings [data-close]');
  // images manquantes
  ok('Aucun fichier de l\'appli introuvable (404)', missing.size === 0, [...missing].slice(0, 8).join(' '));
  ok('Aucune erreur JavaScript', errs.length === 0, errs.slice(0, 5).join(' | '));
  console.log(report.join('\n'));
  await b.close(); srv.close();
})();
