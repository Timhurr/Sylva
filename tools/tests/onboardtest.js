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
}).listen(8777);
const stub = `(function(){function mk(){var f=function(){return p};var p=new Proxy(f,{get:function(t,k){if(k==='getCenter')return function(){return{lat:50.1,lng:5.7}};if(k==='getBounds')return function(){return{getSouth:()=>50,getWest:()=>5,getNorth:()=>50.2,getEast:()=>5.8,contains:()=>true}};if(k==='getZoom')return function(){return 12};if(k==='then')return undefined;if(k==='distance')return function(a,b){a=a.lat!=null?[a.lat,a.lng]:a;b=b.lat!=null?[b.lat,b.lng]:b;var R=6371e3,r=Math.PI/180,dl=(b[0]-a[0])*r,dn=(b[1]-a[1])*r,h=Math.sin(dl/2)**2+Math.cos(a[0]*r)*Math.cos(b[0]*r)*Math.sin(dn/2)**2;return 2*R*Math.asin(Math.sqrt(h))};if(k==='on')return function(ev,fn){(window.__mh=window.__mh||{})[ev]=fn;return p};if(k==='divIcon')return function(o){(window.__icons=window.__icons||[]).push(o.html);return p};return p},apply:function(){return p}});return p}window.L=mk();})();`;
(async () => {
  let fails = 0; const ok = (n, c, d) => { console.log((c ? 'OK   ' : 'FAIL ') + n + (c ? '' : ' — ' + JSON.stringify(d || ''))); if (!c) fails++; };
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...devices['iPhone 13'], serviceWorkers: 'block', permissions: ['geolocation'], geolocation: { latitude: 50.1, longitude: 5.7 } });
  const pg = await ctx.newPage(); const errs = [];
  pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/\/vendor\/(leaflet|maplibre)\/.*\.js/, r => r.fulfill({ body: stub, contentType: 'text/javascript' }));
  await pg.route(/^https?:\/\/(?!localhost)/, r => r.abort());
  await pg.goto('http://localhost:8777/index.html'); await pg.waitForTimeout(1200);
  ok('Accueil visible au premier lancement', await pg.isVisible('#onboard'));
  await pg.screenshot({ path: path.join(__dirname, 'shots/ob1.png') });
  await pg.click('#obNext'); await pg.waitForTimeout(200);
  ok('Étape 2 : trois choses', (await pg.textContent('#obBody')).includes('Le bouton du milieu'));
  await pg.screenshot({ path: path.join(__dirname, 'shots/ob2.png') });
  await pg.click('#obNext'); await pg.waitForTimeout(200);
  await pg.click('[data-ob-pays="FR"]'); await pg.waitForTimeout(200);
  ok('Pays FR choisi', await pg.evaluate(() => JSON.parse(localStorage.getItem('sylva_country'))) === 'FR');
  await pg.screenshot({ path: path.join(__dirname, 'shots/ob3.png') });
  await pg.click('#obNext'); await pg.waitForTimeout(200);
  ok('Dernière étape : Commencer', (await pg.textContent('#obNext')).trim() === 'Commencer');
  await pg.click('#obGeo'); await pg.waitForTimeout(600);
  ok('Position autorisée', (await pg.textContent('#obGeo')).includes('autorisée'));
  await pg.screenshot({ path: path.join(__dirname, 'shots/ob4.png') });
  await pg.click('#obNext'); await pg.waitForTimeout(300);
  ok('Accueil fermé', !(await pg.isVisible('#onboard')));
  ok('Mémorisé', await pg.evaluate(() => localStorage.getItem('sylva_onboard')) === '1');
  await pg.reload(); await pg.waitForTimeout(800);
  ok('Pas réaffiché', !(await pg.isVisible('#onboard')));
  // Utilisateur existant (données sans drapeau) : pas d'accueil
  const ctx2 = await b.newContext({ ...devices['iPhone 13'], serviceWorkers: 'block' });
  const p2 = await ctx2.newPage(); await p2.addInitScript(() => { if (!sessionStorage.getItem('x')) { sessionStorage.setItem('x', 1); localStorage.setItem('sylva_spots', '[]'); } });
  await p2.route(/\/vendor\/(leaflet|maplibre)\/.*\.js/, r => r.fulfill({ body: stub, contentType: 'text/javascript' }));
  await p2.route(/^https?:\/\/(?!localhost)/, r => r.abort());
  await p2.goto('http://localhost:8777/index.html'); await p2.waitForTimeout(800);
  ok('Utilisateur existant : pas d\'accueil', !(await p2.isVisible('#onboard')));
  // Revoir depuis les Réglages
  await pg.click('#btnSettings'); await pg.waitForTimeout(200); await pg.click('#btnOnboard'); await pg.waitForTimeout(200);
  ok('Revoir la présentation', await pg.isVisible('#onboard'));
  await pg.click('#obSkip'); await pg.waitForTimeout(200);
  ok('Passer ferme', !(await pg.isVisible('#onboard')));
  ok('Aucune erreur JS', !errs.length, errs);
  await b.close(); srv.close(); process.exit(fails ? 1 : 0);
})();
