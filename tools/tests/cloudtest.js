// Test du compte, de la synchronisation, des signalements, des idées et de la communauté avec un Supabase simulé.
// node tools/tests/cloudtest.js
const { chromium, devices } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..', '..');
const stub = `(function(){function mk(){var f=function(){return p};var p=new Proxy(f,{get:function(t,k){if(k==='getCenter')return function(){return{lat:50.1,lng:5.7}};if(k==='getBounds')return function(){return{getSouth:()=>50,getWest:()=>5,getNorth:()=>50.2,getEast:()=>5.8,contains:()=>true}};if(k==='getZoom')return function(){return 12};if(k==='then')return undefined;return p},apply:function(){return p}});return p}window.L=mk();})();`;
const SB = 'https://test.supabase.co';
const srv = http.createServer((q, r) => {
  let f = path.join(root, decodeURIComponent(q.url.split('?')[0])); if (f.endsWith('/')) f += 'index.html';
  if (f.endsWith('config.js')) { r.writeHead(200, { 'Content-Type': 'text/javascript' }); r.end('window.SYLVA_CONFIG={supabaseUrl:"' + SB + '",supabaseKey:"anon"};'); return; }
  fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'Content-Type': { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.webp': 'image/webp', '.png': 'image/png', '.woff': 'font/woff' }[path.extname(f)] || 'application/octet-stream' }); r.end(d); });
}).listen(8771);
const res = []; const ok = (n, c, d) => { res.push(c); console.log((c ? 'OK   ' : 'FAIL ') + n + (d ? ' — ' + d : '')); };
(async () => {
  const b = await chromium.launch(); const errs = [];
  const ctx = await b.newContext({ ...devices['iPhone 13'], serviceWorkers: 'block' });
  const pg = await ctx.newPage(); pg.on('pageerror', e => errs.push(e.message));
  const db = { user_data: [{ k: 'sylva_trip', v: { lieu: 'Depuis le serveur' }, updated_at: new Date(Date.now() + 60000).toISOString() }], reports: [], ideas: [], posted: [] };
  await pg.route(/unpkg|open-meteo|overpass|openstreetmap|fonts\.|wiki/, r => r.abort());
  await pg.route(/unpkg\.com.*\.js|\/vendor\/(leaflet|maplibre)\/.*\.js/, r => r.fulfill({ contentType: 'text/javascript', body: stub }));
  await pg.route(SB + '/**', async (route) => {
    const u = new URL(route.request().url()), m = route.request().method(), body = route.request().postData();
    const J = (o, s) => route.fulfill({ status: s || 200, contentType: 'application/json', body: JSON.stringify(o) });
    if (u.pathname === '/auth/v1/otp') return J({});
    if (u.pathname === '/auth/v1/verify') return JSON.parse(body).token === '123456' ? J({ access_token: 'tok', refresh_token: 'ref', expires_in: 3600, user: { id: 'u1', email: 'a@b.be' } }) : J({ msg: 'bad' }, 403);
    if (u.pathname === '/rest/v1/user_data' && m === 'GET') return J(db.user_data);
    if (u.pathname === '/rest/v1/user_data' && m === 'POST') { db.posted.push(...JSON.parse(body)); return route.fulfill({ status: 201, body: '' }); }
    if (u.pathname === '/rest/v1/reports') { db.reports.push(JSON.parse(body)); return route.fulfill({ status: 201, body: '' }); }
    if (u.pathname === '/rest/v1/idea_scores') return J([{ id: 'i1', titre: 'Mode hors ligne complet', detail: '', status: 'open', votes: 4 }]);
    if (u.pathname === '/rest/v1/idea_votes') return J([]);
    if (u.pathname === '/rest/v1/profiles') return J([{ id: 'u1', pseudo: 'Tim' }]);
    if (u.pathname === '/rest/v1/rpc/my_profile') return J([{ id: 'u1', pseudo: 'Tim', trusted: false, is_admin: false, banned: false }]);
    if (u.pathname === '/rest/v1/community_spots' && m === 'GET' && u.search.includes('id=eq.')) return J([{ id: 's1', lat: 50.06, lon: 5.68, titre: 'Aire du Hérou', statut: 'aire_officielle', country: 'BE', eau: true, description: 'Calme', profiles: { pseudo: 'Ana' } }]);
    if (u.pathname === '/rest/v1/community_spots' && m === 'GET') return J([{ id: 's1', lat: 50.06, lon: 5.68, titre: 'Aire du Hérou', statut: 'aire_officielle', country: 'BE' }]);
    if (u.pathname === '/rest/v1/community_spots' && m === 'POST') { db.shared = JSON.parse(body); return J([{ id: 's2', status: 'pending' }], 201); }
    if (u.pathname === '/rest/v1/spot_summary') return J([{ spot_id: 's1', note_moy: 4.5, n_avis: 2, dernier_passage: '2026-11-01', n_disparu: 0 }]);
    if (u.pathname === '/rest/v1/spot_reviews' && m === 'GET') return J([{ id: 'r1', note: 5, encore_ok: true, commentaire: 'Super', created_at: '2026-11-01', profiles: { pseudo: 'Ana' } }]);
    if (u.pathname === '/rest/v1/spot_photos') return J([]);
    return J([]);
  });
  await pg.addInitScript(() => { localStorage.setItem('sylva_spots', JSON.stringify([{ id: 'x1', lat: 50.1, lon: 5.7, type: 'bivouac', note: 'Mon coin', date: '2026-11-10' }])); });
  await pg.goto('http://localhost:8771/index.html'); await pg.waitForTimeout(1500);

  await pg.click('.tab[data-view="accueil"]'); await pg.click('#btnSettings'); await pg.waitForTimeout(200);
  ok('Réglages : section compte visible', await pg.isVisible('#accountBox #accEmail'));
  await pg.fill('#accEmail', 'a@b.be'); await pg.click('#accSend'); await pg.waitForTimeout(300);
  ok('Code demandé', await pg.isVisible('#accCode'));
  await pg.fill('#accCode', '123456'); await pg.click('#accVerify');
  await pg.waitForTimeout(2500);
  const trip = await pg.evaluate(() => JSON.parse(localStorage.getItem('sylva_trip') || 'null'));
  ok('Synchro : données du serveur restaurées', trip && trip.lieu === 'Depuis le serveur', JSON.stringify(trip));
  ok('Synchro : spots locaux envoyés', db.posted.some(x => x.k === 'sylva_spots'), db.posted.map(x => x.k).join(','));
  ok('Synchro : infos médicales jamais envoyées', !db.posted.some(x => /ice|garrot|mtkey|session/.test(x.k)));

  // signaler une erreur sur une fiche
  await pg.evaluate(() => document.querySelector('[data-open-tech="froid"]').click()); await pg.waitForTimeout(400);
  ok('Fiche : bouton Signaler une erreur', await pg.isVisible('[data-report="fiche"]'));
  await pg.click('[data-report="fiche"]'); await pg.fill('#repMsg', 'Il manque le signe X'); await pg.click('#formReport button[type="submit"]'); await pg.waitForTimeout(400);
  ok('Signalement envoyé', db.reports.length === 1 && db.reports[0].target === 'froid', JSON.stringify(db.reports[0] || {}));
  await pg.click('#sheetClose').catch(() => {});

  // idées
  await pg.evaluate(() => window.SylvaCloud.openIdeas()); await pg.waitForTimeout(400);
  ok('Idées : liste avec votes', /Mode hors ligne complet/.test(await pg.textContent('#ideasList')));
  await pg.evaluate(() => document.querySelector('#modalIdeas').hidden = true);

  // communauté
  await pg.click('.tab[data-view="carte"]'); await pg.waitForTimeout(400);
  const chipOk = await pg.isVisible('.map-chips [data-layer="communaute"]');
  ok('Carte : couche Communauté', chipOk);
  await pg.evaluate(() => window.SylvaCloud && document.querySelector('.map-chips [data-layer="communaute"]').click()); await pg.waitForTimeout(300);
  await pg.evaluate(() => window.SylvaCloud.openSpot('s1')); await pg.waitForTimeout(500);
  const com = await pg.textContent('#comBody');
  ok('Spot communautaire : fiche, statut et avis', /Aire du Hérou/.test(com) && /Aire de bivouac officielle/.test(com) && /Super/.test(com));
  await pg.evaluate(() => document.querySelector('#modalCommu').hidden = true);
  await pg.evaluate(() => window.SylvaCloud.openShare('x1')); await pg.waitForTimeout(200);
  await pg.click('#formShare button[type="submit"]'); await pg.waitForTimeout(200);
  ok('Partage refusé sans statut', !db.shared);
  await pg.selectOption('#shStatut', 'terrain_prive_accord'); await pg.fill('#shDesc', 'Appelle-moi au 0471 23 45 67'); await pg.check('#shCgu');
  await pg.click('#formShare button[type="submit"]'); await pg.waitForTimeout(200);
  ok('Partage refusé avec un numéro de téléphone', !db.shared);
  await pg.fill('#shDesc', 'Pré plat derrière la ferme, demander au propriétaire'); await pg.click('#formShare button[type="submit"]'); await pg.waitForTimeout(500);
  ok('Partage envoyé avec statut légal', db.shared && db.shared.statut === 'terrain_prive_accord', JSON.stringify(db.shared || {}).slice(0, 120));
  errs.length === 0 || console.log('erreurs :', errs);
  ok('Aucune erreur JavaScript', errs.length === 0, errs.join(' | '));
  await b.close(); srv.close();
  const f = res.filter(x => !x).length; console.log(f ? f + ' échec(s)' : 'no errors'); process.exit(f ? 1 : 0);
})();
