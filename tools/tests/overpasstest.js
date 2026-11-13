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
  const ok = (n, c, i='') => console.log((c?'OK   ':'FAIL ')+n+(i?' — '+i:''));
  const hits = [];
  await pg.unroute(/(fonts\.|openstreetmap|overpass|open-meteo|wikipedia|wikimedia|nominatim)/);
  await pg.route(/(fonts\.|open-meteo|wikipedia|wikimedia|nominatim|tile\.openstreetmap)/, r => r.abort());
  await pg.route(/overpass/, r => { const u = r.request().url(); hits.push(u.split('/')[2]); if (u.includes('overpass-api.de')) return r.fulfill({ status: 429, body: 'busy' }); return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ elements: [{ lat: 50.1, lon: 5.7, tags: { amenity: 'parking', fee: 'no' } }] }) }); });
  await pg.evaluate(() => { [...document.querySelectorAll('[data-view]')].find(x=>x.dataset.view==='carte').click(); });
  await pg.waitForTimeout(300); hits.length = 0;
  await pg.$eval('#btnReloadOsm', e => e.click());
  await pg.waitForTimeout(1500);
  ok('fallback used', hits.includes('overpass.private.coffee'), hits.join(','));
  ok('poi saved', JSON.parse(await pg.evaluate(() => localStorage.getItem('sylva_poi') || '{}')).elements?.length === 1);
  console.log(errs.join('\n') || 'no errors');
  await b.close(); srv.close();
})();
