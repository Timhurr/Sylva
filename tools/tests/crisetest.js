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
const stub = `(function(){function mk(){var f=function(){return p};var p=new Proxy(f,{get:function(t,k){if(k==='getCenter')return function(){return{lat:50.1,lng:5.7}};if(k==='getBounds')return function(){return{getSouth:()=>50,getWest:()=>5,getNorth:()=>50.2,getEast:()=>5.8,contains:()=>true}};if(k==='getZoom')return function(){return 12};if(k==='then')return undefined;if(k==='distance')return function(a,b){a=a.lat!=null?[a.lat,a.lng]:a;b=b.lat!=null?[b.lat,b.lng]:b;var R=6371e3,r=Math.PI/180,dl=(b[0]-a[0])*r,dn=(b[1]-a[1])*r,h=Math.sin(dl/2)**2+Math.cos(a[0]*r)*Math.cos(b[0]*r)*Math.sin(dn/2)**2;return 2*R*Math.asin(Math.sqrt(h))};if(k==='on')return function(ev,fn){(window.__mh=window.__mh||{})[ev]=fn;return p};if(k==='divIcon')return function(o){(window.__icons=window.__icons||[]).push(o.html);return p};return p},apply:function(){return p}});return p}window.L=mk();})();`;
const METEO = {current:{temperature_2m:6.1,weather_code:3},daily:{time:['2026-11-06','2026-11-07','2026-11-08'],weather_code:[3,61,2],temperature_2m_max:[9,8,10],temperature_2m_min:[-1,2,3],precipitation_sum:[0,12,0],precipitation_probability_max:[10,80,20],wind_gusts_10m_max:[20,65,25],sunrise:['2026-11-06T07:55','2026-11-07T07:57','2026-11-08T07:59'],sunset:['2026-11-06T16:58','2026-11-07T16:56','2026-11-08T16:55']}};
const PLANTNET = {results:[{score:0.91,species:{scientificNameWithoutAuthor:'Urtica dioica',commonNames:['Ortie'],family:{scientificNameWithoutAuthor:'Urticaceae'}}},{score:0.05,species:{scientificNameWithoutAuthor:'Lamium album',commonNames:['Lamier blanc'],family:{scientificNameWithoutAuthor:'Lamiaceae'}}}]};
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...devices['iPhone 13'], serviceWorkers: 'block' });
  const pg = await ctx.newPage(); await pg.addInitScript(() => { try { localStorage.setItem('sylva_onboard', '1'); if (!localStorage.getItem('sylva_cgu')) localStorage.setItem('sylva_cgu', JSON.stringify({ v: '2026-11-20' })); if (!localStorage.getItem('sylva_lang')) localStorage.setItem('sylva_lang', '"fr"'); } catch (e) {} });
  const errs = [], missing = new Set();
  pg.on('pageerror', e => errs.push('PAGEERR ' + e.message));
  pg.on('console', m => { if (m.type() === 'error' && !/ERR_FAILED|Failed to load resource/.test(m.text())) errs.push('CONSOLE ' + m.text()); });
  pg.on('response', r => { if (r.url().includes('localhost') && r.status() >= 400) missing.add(r.url()); });
  await pg.route(/unpkg\.com.*\.js|\/vendor\/(leaflet|maplibre)\/.*\.js/, r => r.fulfill({ body: stub, contentType: 'text/javascript' }));
  await pg.route(/unpkg\.com.*\.css|\/vendor\/(leaflet|maplibre)\/.*\.css/, r => r.fulfill({ body: '', contentType: 'text/css' }));
  await pg.route(/plantnet/, r => r.fulfill({ contentType: 'application/json', body: JSON.stringify(PLANTNET) }));
  await pg.route(/(fonts\.|openstreetmap|overpass|open-meteo|wikipedia|wikimedia|nominatim)/, r => {
    if (r.request().url().includes('open-meteo')) return r.fulfill({ contentType:'application/json', body: JSON.stringify(METEO)});
    return r.abort();
  });
  await pg.addInitScript(() => { localStorage.setItem('sylva_key', JSON.stringify('TESTKEY')); });
  await pg.goto('http://localhost:8766/index.html');
  await pg.waitForTimeout(1000);
  const ok = (n, c, i='') => console.log((c?'OK   ':'FAIL ')+n+(i?' — '+i:''));
  const S = process.env.S || '/tmp';
  const ev = (f, a) => pg.evaluate(f, a);
  ok('drill card', (await pg.textContent('#drillCard')).includes('Exercice du jour'));
  await pg.click('[data-drill-done]'); ok('drill done', (await pg.textContent('#drillCard')).includes('1 jour'));
  // Autonomie
  await pg.click('#pretCard'); await pg.waitForTimeout(200);
  await pg.fill('[data-res=eau]', '12'); await pg.dispatchEvent('[data-res=eau]', 'change');
  await pg.fill('[data-res=repas]', '18'); await pg.dispatchEvent('[data-res=repas]', 'change');
  const au = await pg.textContent('.auto-big'); ok('autonomie 4 j (1 adulte, eau 12 L)', au.trim() === '4 j', au);
  await pg.screenshot({ path: S + '/cr_auto.png' });
  await pg.click('[data-ptab=plan]'); await pg.click('#btnPlanQr'); await pg.waitForTimeout(200);
  ok('qr plan', !!(await pg.$('#qrImg svg')));
  await ev(() => document.querySelectorAll('.modal').forEach(m => m.hidden = true));
  await pg.click('[data-ptab=crises]'); const nc = (await pg.$$('#pretBody [data-tech]')).length; ok('Fiches crises (au moins 13)', nc >= 13, String(nc));
  // Blessé
  await ev(() => document.querySelector('[data-goto=accueil]').click());
  await ev(() => document.querySelector('#crSignal').click());
  await pg.waitForTimeout(200);
  await ev(() => document.querySelector('#btnBlesse').click()); await pg.waitForTimeout(200);
  ok('blesse open', await pg.isVisible('#modalBlesse'));
  const go = async (sel) => { const r = await ev((s) => { const e = document.querySelector(s); if (!e) return document.querySelector('#blBody').innerHTML.slice(0, 300); e.click(); return ''; }, sel); if (r) console.log('MISSING', sel, r); await pg.waitForTimeout(80); };
  await go('[data-blgo=hemo]'); await go('[data-blgo=hemo_ou]'); await go('[data-blgo=garrot]');
  ok('garrot step', (await pg.textContent('#blBody')).includes('5 à 7 cm'));
  await go('[data-gstart]'); ok('garrot timer', (await pg.textContent('#blGarrot')).includes('Garrot posé'));
  await go('[data-blgo=conscience]'); await go('[data-blgo=respire]'); await go('[data-blgo=rcp]');
  ok('rcp', (await pg.textContent('#blBody')).includes('100 à 120'));
  await pg.screenshot({ path: S + '/cr_blesse.png' });
  await ev(() => document.querySelectorAll('.modal').forEach(m => m.hidden = true));
  // Outils
  await ev(() => { [...document.querySelectorAll('[data-view]')].find(x=>x.dataset.view==='apprendre').click(); });
  await pg.waitForTimeout(200);
  for (const t of ['nord', 'radio', 'morse']) { await ev((w) => document.querySelector('[data-learn-x="' + w + '"]').click(), t); await pg.waitForTimeout(200); }
  await ev(() => document.querySelector('[data-learn-x="nord"]').click()); await pg.waitForTimeout(200);
  const nt = await pg.textContent('#nordBox'); ok('nord', /nord est|Soleil couché/.test(nt), nt.slice(0, 80));
  await pg.screenshot({ path: S + '/cr_nord.png' });
  await ev(() => document.querySelector('[data-learn-x="radio"]').click()); await pg.waitForTimeout(200);
  ok('radio 10 km (1,5 m + 1,5 m)', (await pg.textContent('#rdOut')).includes('10'), await pg.textContent('#rdOut'));
  await ev(() => document.querySelector('[data-learn-x="morse"]').click()); await pg.waitForTimeout(200);
  ok('morse ui', !!(await pg.$('#msStart')));
  // Estime : 20 pas vers l'est
  await ev(() => document.querySelector('[data-learn-x="estime"]').click()); await pg.waitForTimeout(200);
  await ev(() => document.querySelector('#estGo').click()); await pg.waitForTimeout(100);
  await ev(async () => {
    window.dispatchEvent(new DeviceOrientationEvent('deviceorientationabsolute', { alpha: 270, beta: 0, gamma: 0, absolute: true }));
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    for (let i = 0; i < 20; i++) {
      window.dispatchEvent(new DeviceMotionEvent('devicemotion', { accelerationIncludingGravity: { x: 0, y: 0, z: 13 } })); await sleep(40);
      for (let j = 0; j < 8; j++) { window.dispatchEvent(new DeviceMotionEvent('devicemotion', { accelerationIncludingGravity: { x: 0, y: 0, z: 9.6 } })); await sleep(40); }
    }
  });
  const et = await pg.textContent('#estBox'); ok('estime 20 pas, retour ouest', et.includes('20 pas') && et.includes('ouest') && et.includes('15 m'), et.slice(200, 330));
  // Risques
  await ev(() => { [...document.querySelectorAll('[data-view]')].find(x=>x.dataset.view==='carte').click(); });
  await pg.waitForTimeout(200);
  await pg.waitForTimeout(800); await ev(() => document.querySelector('[data-layer=risques]').click());
  const rs = await ev(() => [localStorage.getItem('sylva_layer_risques'), document.querySelector('[data-layer=risques]').className].join('|')); ok('risques chip toggles', /^(true|false)/.test(rs), rs);
  const ov = await ev(() => document.documentElement.scrollWidth > innerWidth); ok('no overflow', !ov);
  console.log(errs.join('\n') || 'no errors');
  await b.close(); srv.close();
})();
