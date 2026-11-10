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
  const ok = (n, c, i='') => console.log((c?'OK   ':'FAIL ')+n+(i?' — '+i:''));
  await pg.evaluate(() => { const b=[...document.querySelectorAll('.tab,[data-view]')].find(x=>/bivouac/i.test(x.dataset.view||x.textContent)); b&&b.click(); });
  await pg.waitForTimeout(300);
  ok('section visible', await pg.isVisible('#btnAddGear'));
  await pg.click('#btnAddGear');
  await pg.fill('#gSearch', 'xlite nxt');
  ok('suggestion', (await pg.textContent('#gSugg')).includes('NeoAir XLite NXT'));
  ok('chercher en ligne', !!(await pg.$('#gSugg a[href*="google"]')));
  await pg.click('#gSugg [data-gpick]');
  ok('auto R', await pg.inputValue('#gR') === '4,5', await pg.inputValue('#gR'));
  ok('auto poids', await pg.inputValue('#gPoids') === '369');
  await pg.click('#formGear button[type=submit]');
  await pg.click('#btnAddGear'); await pg.fill('#gSearch', 'mt500 synthetique');
  await pg.click('#gSugg [data-gpick]');
  ok('bag fields', await pg.isVisible('#gComf') && await pg.inputValue('#gLim') === '-5');
  await pg.click('#formGear button[type=submit]');
  await pg.click('#btnAddGear'); await pg.fill('#gSearch', 'Mon couteau perso');
  await pg.click('#gSugg [data-gmanual]');
  await pg.selectOption('#gCat','autre'); await pg.fill('#gPoids','120,5');
  await pg.click('#formGear button[type=submit]');
  const st = await pg.textContent('#gearStats'); ok('stats', st.includes('1,71 kg') && st.includes('3 / 3'), st);
  ok('checklist group', (await pg.textContent('#checklist')).includes('Mon matériel') && (await pg.textContent('#checklist')).includes('couteau'));
  await pg.click('[data-gtake] >> nth=2'); 
  ok('untake', (await pg.textContent('#gearStats')).includes('2 / 3'));
  // check night
  const nc = await pg.evaluate(() => { localStorage.setItem('sylva_meteo_trip', JSON.stringify({data:{daily:{temperature_2m_min:[-1]}}})); return true; });
  // run prep's gear step indirectly via rvalue panel
  await pg.evaluate(() => { const b=document.querySelector('[data-tool="rvalue"],[data-panel="panelRv"],#toolRv'); });
  const pad = await pg.evaluate(() => { try { return document.querySelector('#modalGear').hidden; } catch(e){return e.message;} });
  ok('modal closed', pad === true);
  await pg.screenshot({ path: process.env.S + '/gear.png', fullPage: false });
  const el = await pg.$('#gearList'); await el.scrollIntoViewIfNeeded(); await pg.screenshot({ path: process.env.S + '/gear.png' });
  await pg.evaluate(() => { document.querySelector('#gearList [data-gtake]:not(:checked)') && document.querySelector('#gearList [data-gtake]:not(:checked)').click(); });
  // open R calc
  await pg.evaluate(() => { const b=[...document.querySelectorAll('[data-tool],[data-learn],button')].find(x=>x.dataset && (x.dataset.learnX==='rvalue')); b && b.click(); });
  await pg.waitForTimeout(300);
  const rv = await pg.evaluate(() => { const s=document.querySelector('#rvBox select[data-rv-k]'); return s ? [...s.options].map(o=>o.textContent).slice(0,2).join('|') : 'none'; });
  ok('rv mes matelas', rv.includes('★'), rv);
  await pg.evaluate(() => { const s=document.querySelector('#rvBox select[data-rv-k]'); s.value=s.options[0].value; s.dispatchEvent(new Event('change',{bubbles:true})); const b=document.querySelector('#rvBag'); if(b){b.value=b.options[1].value; b.dispatchEvent(new Event('change',{bubbles:true}));} });
  const rr = await pg.evaluate(() => [document.querySelector('#rvComf') && document.querySelector('#rvComf').value, document.querySelector('#rvBox').textContent.slice(0,0)+ (document.querySelector('#rvRes')||document.querySelector('#rvBox .rv-res')||{}).textContent]);
  ok('rv bag fill', rr[0] === '0', JSON.stringify(rr).slice(0,200));
  const gn = await pg.evaluate(() => { localStorage.setItem('sylva_meteo_trip', JSON.stringify({data:{daily:{temperature_2m_min:[-8]}}})); return 1; });
  console.log(errs.join('\n') || 'no errors');
  await b.close(); srv.close();
})();
