// Exporte le contenu français à traduire : node tools/i18n/dump_content.js → tools/i18n/content_fr/{guide,techs,especes}.json
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.resolve(__dirname, '../..');
const win = { SYLVA_ZONE: {} }; const c = vm.createContext({ window: win, console, navigator: { language: 'fr' }, document: { documentElement: {} } });
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const files = [...html.matchAll(/<script src="([^"]+\.js)"><\/script>/g)].map(m => m[1]).filter(f => !/vendor|i18n|config|cloud|app\.js|images|illus/.test(f));
files.forEach(f => { try { vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), c); } catch (e) { console.error(f, e.message); } });
const out = path.join(__dirname, 'content_fr'); fs.mkdirSync(out, { recursive: true });
const pick = (o, ks) => { const r = {}; ks.forEach(k => { if (o[k] != null && o[k] !== '' && !(Array.isArray(o[k]) && !o[k].length)) r[k] = o[k]; }); return r; };
const T = {}; (win.SYLVA_TECHNIQUES || []).forEach(t => { T[t.id] = pick(t, ['titre', 'intro', 'etapes', 'attention', 'isole', 'alerte', 'attentionIsole', 'recette', 'source']); });
const E = {}; (win.SYLVA_ESPECES || []).forEach(t => { E[t.id] = pick(t, ['nom', 'statut', 'saison', 'zones', 'resume', 'identification', 'sosies', 'usages', 'notes', 'conseil', 'peche']); });
const G = {}; (win.SYLVA_GUIDE || []).forEach(t => { G[t.id] = pick(t, ['titre', 'resume', 'intro', 'sections']); });
fs.writeFileSync(path.join(out, 'techs.json'), JSON.stringify(T)); fs.writeFileSync(path.join(out, 'especes.json'), JSON.stringify(E)); fs.writeFileSync(path.join(out, 'guide.json'), JSON.stringify(G));
const sz = o => JSON.stringify(o).length; console.log('fiches', Object.keys(T).length, sz(T), 'espèces', Object.keys(E).length, sz(E), 'guide', Object.keys(G).length, sz(G));
console.log('champs fiche', [...new Set(Object.values(win.SYLVA_TECHNIQUES).flatMap(Object.keys))].join(' '));
console.log('champs espèce', [...new Set(Object.values(win.SYLVA_ESPECES).flatMap(Object.keys))].join(' '));
console.log('champs guide', [...new Set(Object.values(win.SYLVA_GUIDE).flatMap(Object.keys))].join(' '));
