const { chromium, devices } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '../..');
fs.mkdirSync(path.join(__dirname, 'shots'), { recursive: true });
let served = 0;
const srv = http.createServer((q, r) => {
  let u = decodeURIComponent(q.url.split('?')[0]); let f = path.join(root, u); if (u.endsWith('/')) f += 'index.html';
  fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); return; } served++;
    const ext = path.extname(f); r.writeHead(200, {'Content-Type': {'.js':'text/javascript','.css':'text/css','.html':'text/html','.webp':'image/webp','.png':'image/png','.webmanifest':'application/manifest+json'}[ext]||'application/octet-stream'}); r.end(d); });
}).listen(8767);
const stub = `(function(){function mk(){var f=function(){return p};var p=new Proxy(f,{get:function(t,k){if(k==='getCenter')return function(){return{lat:50.1,lng:5.7}};if(k==='getBounds')return function(){return{getSouth:()=>50,getWest:()=>5,getNorth:()=>50.2,getEast:()=>5.8,contains:()=>true}};if(k==='getZoom')return function(){return 12};if(k==='then')return undefined;return p},apply:function(){return p}});return p}window.L=mk();})();`;
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...devices['iPhone 13'] });
  await ctx.route(/unpkg\.com.*\.js/, r => r.fulfill({ body: stub, contentType: 'text/javascript', headers: {'access-control-allow-origin':'*'} }));
  await ctx.route(/unpkg\.com/, r => r.fulfill({ body: '', contentType: 'text/css', headers: {'access-control-allow-origin':'*'} }));
  await ctx.route(/(fonts\.|openstreetmap|overpass|open-meteo|wikipedia|wikimedia|nominatim)/, r => r.abort());
  const pg = await ctx.newPage(); const errs = [];
  pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('http://localhost:8767/index.html');
  await pg.waitForFunction(() => navigator.serviceWorker && navigator.serviceWorker.controller, null, { timeout: 30000 }).catch(() => {});
  const ctrl = await pg.evaluate(() => !!navigator.serviceWorker.controller);
  if (!ctrl) { await pg.reload(); await pg.waitForTimeout(2000); }
  // laisser le prechargement des images se faire (lance 3 s apres le demarrage)
  await pg.waitForTimeout(12000);
  const cached = await pg.evaluate(async () => { const n = {}; for (const k of await caches.keys()) { n[k] = (await (await caches.open(k)).keys()).length; } return n; });
  console.log('caches', JSON.stringify(cached));
  // MODE AVION
  await ctx.setOffline(true);
  const before = served;
  await pg.reload({ waitUntil: 'load' }).catch(e => console.log('reload err', e.message));
  await pg.waitForTimeout(2500);
  const r = await pg.evaluate(async () => {
    const out = { title: document.title, view: !!document.querySelector('#view-accueil.active') };
    document.querySelector('.tab[data-view="apprendre"]').click();
    const lr = document.querySelector('#learnResults'); lr.hidden = false;
    lr.innerHTML = '<button class="item" data-tech="ps_pls">x</button>'; lr.querySelector('button').click();
    await new Promise(r => setTimeout(r, 1500));
    const img = document.querySelector('#sheetBody img');
    out.ficheImg = img ? img.complete && img.naturalWidth > 0 : 'pas d\'image';
    document.querySelector('#sheet').hidden = true;
    // toutes les images de l'appli
    let okN = 0, ko = [];
    for (const k of window.SYLVA_IMAGES) {
      const ok = await new Promise(res => { const i = new Image(); i.onload = () => res(true); i.onerror = () => res(false); i.src = 'img/' + k + '.webp'; });
      ok ? okN++ : ko.push(k);
    }
    out.imgs = okN + '/' + window.SYLVA_IMAGES.length; out.ko = ko.slice(0, 10);
    out.guide = window.SYLVA_GUIDE.length; out.fiches = window.SYLVA_TECHNIQUES.length;
    return out;
  });
  console.log('HORS-LIGNE', JSON.stringify(r), 'requêtes serveur pendant le mode avion:', served - before, 'erreurs:', errs.slice(0,3));
  await pg.screenshot({ path: path.join(__dirname, 'shots/offline.png') });
  await b.close(); srv.close();
})();
