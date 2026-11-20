// Récolte les textes français de l'interface (écran réel + textes du code), hors contenu (fiches, espèces, guide).
// node tools/i18n/harvest.js → tools/i18n/ui_fr.json
const { chromium, devices } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.resolve(__dirname, '../..');
// 1. Textes du contenu (à exclure) : chargés depuis les fichiers de données
const win = { SYLVA_ZONE: {} }; const ctxv = vm.createContext({ window: win, console, navigator: { language: 'fr' }, document: { documentElement: {} } });
for (const f of ['data.js','especes_plus.js','especes_champignons.js','especes_regions.js','techniques_plus.js','guide.js','secours_isole.js','noeuds_plus.js','classiques.js','abris_plus.js','poissons.js','astuces.js','cuisine_jeux.js','rvalue.js','pret72.js','crise_plus.js','crise_vie.js','fabriquer.js']) {
  try { vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctxv); } catch (e) { console.error(f, e.message); }
}
const content = new Set();
const addAll = (v) => { if (typeof v === 'string') content.add(v.replace(/\s+/g, ' ').trim()); else if (Array.isArray(v)) v.forEach(addAll); else if (v && typeof v === 'object') Object.values(v).forEach(addAll); };
(win.SYLVA_TECHNIQUES || []).forEach(t => { const c = Object.assign({}, t); delete c.cat; addAll(c); });
(win.SYLVA_ESPECES || []).forEach(t => { const c = Object.assign({}, t); delete c.cat; delete c.niveau; addAll(c); });
(win.SYLVA_GUIDE || []).forEach(addAll);
const norm = s => s.replace(/\s+/g, ' ').trim();
const isText = s => /[A-Za-zÀ-ÿ]{2}/.test(s) && !/^[\w.-]+\.(js|css|webp|png|html)$/.test(s) && !/^https?:/.test(s);
const out = new Map(); // texte → origine
const add = (s, o) => { s = norm(s); if (!s || !isText(s) || s.length > 400) return; if (content.has(s)) return; if (!out.has(s)) out.set(s, o); };
// 2. Textes du code : littéraux découpés aux balises HTML
for (const f of ['app.js', 'cloud.js', 'pret72.js', 'risques.js', 'materiel.js', 'rvalue.js']) {
  const src = fs.readFileSync(path.join(root, f), 'utf8');
  const re = /"((?:[^"\\\n]|\\.)*)"|'((?:[^'\\\n]|\\.)*)'/g; let m;
  while ((m = re.exec(src))) {
    let s = (m[1] != null ? m[1] : m[2]).replace(/\\(["'\\])/g, '$1').replace(/\\n/g, ' ');
    if (!/[a-zà-ÿ]{3}/i.test(s) || /^[a-z0-9_#.\-\[\]=:"' ]+$/.test(s) && !/ /.test(s)) continue;
    s.split(/<[^>]*>/).forEach(x => { x = x.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&'); if (/[ ]/.test(x.trim()) || /[À-ÿ]/.test(x) || /^[A-ZÀ-Ý][a-zà-ÿ]{2,}$/.test(x.trim())) add(x, 'code:' + f); });
  }
}
// 3. Écran réel : toutes les vues
const srv = http.createServer((q, r) => { let u = decodeURIComponent(q.url.split('?')[0]); let f = path.join(root, u); if (u.endsWith('/')) f += 'index.html';
  fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html' }[path.extname(f)] || 'application/octet-stream' }); r.end(d); }); }).listen(8781);
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ ...devices['iPhone 13'], serviceWorkers: 'block', locale: 'fr-BE' });
  const pg = await ctx.newPage(); await pg.addInitScript(() => { localStorage.setItem('sylva_onboard', '1'); localStorage.setItem('sylva_lang', '"fr"'); });
  await pg.route(/^https?:\/\/(?!localhost)/, r => r.abort());
  await pg.goto('http://localhost:8781/index.html'); await pg.waitForTimeout(1500);
  const grab = async (o) => { const t = await pg.evaluate(() => { const r = []; const w = document.createTreeWalker(document.body, 5); let n;
      while ((n = w.nextNode())) { if (n.nodeType === 3) { if (!/SCRIPT|STYLE/.test(n.parentNode.nodeName)) r.push(n.nodeValue); } else ['placeholder', 'aria-label', 'title', 'alt'].forEach(a => { const v = n.getAttribute(a); if (v) r.push(v); }); }
      r.push(document.title); return r; }); t.forEach(s => add(s, o)); };
  await grab('html');
  for (const v of ['accueil', 'carte', 'apprendre', 'bivouac', 'crise']) { await pg.click('.tab[data-view="' + v + '"]').catch(() => {}); await pg.waitForTimeout(500); await grab('vue:' + v);
    const subs = await pg.$$('#view-' + v + ' [role="tab"], #view-' + v + ' .seg button, #view-' + v + ' [data-tab]');
    for (const s of subs) { await s.click({ timeout: 800 }).catch(() => {}); await pg.waitForTimeout(250); await grab('vue:' + v); }
  }
  for (const id of ['#btnSettings']) { await pg.click(id).catch(() => {}); await pg.waitForTimeout(300); await grab('reglages'); }
  await b.close(); srv.close();
  const arr = [...out.entries()].map(([s, o]) => ({ s, o }));
  fs.writeFileSync(path.join(__dirname, 'ui_fr.json'), JSON.stringify(arr, null, 1));
  console.log('textes:', arr.length, 'caractères:', arr.reduce((a, x) => a + x.s.length, 0), 'contenu exclu:', content.size);
})();
