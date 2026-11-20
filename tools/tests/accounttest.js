// Compte par e-mail et mot de passe : création (code de confirmation), mot de passe oublié, connexion par code, accord pour les nouvelles
const { chromium, devices } = require('playwright'); const http = require('http'), fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '../..'); const SB = 'https://zzlewwrakyowuilgqpoj.supabase.co';
const srv = http.createServer((q, r) => { let u = decodeURIComponent(q.url.split('?')[0]); let f = path.join(root, u); if (u.endsWith('/')) f += 'index.html';
  fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html' }[path.extname(f)] || 'application/octet-stream' }); r.end(d); }); }).listen(8779);
const stub = `(function(){function mk(){var f=function(){return p};var p=new Proxy(f,{get:function(t,k){if(k==='getCenter')return function(){return{lat:50.1,lng:5.7}};if(k==='getBounds')return function(){return{getSouth:()=>50,getWest:()=>5,getNorth:()=>50.2,getEast:()=>5.8,contains:()=>true}};if(k==='getZoom')return function(){return 12};if(k==='then')return undefined;return p},apply:function(){return p}});return p}window.L=mk();})();`;
(async () => {
  let fails = 0; const ok = (n, c, d) => { console.log((c ? 'OK   ' : 'FAIL ') + n + (c ? '' : ' — ' + JSON.stringify(d || ''))); if (!c) fails++; };
  const b = await chromium.launch(); const errs = [];
  const ctx = await b.newContext({ ...devices['iPhone 13'], serviceWorkers: 'block', locale: 'fr-BE' });
  const pg = await ctx.newPage(); pg.on('pageerror', e => errs.push(e.message));
  await pg.addInitScript(() => { localStorage.setItem('sylva_onboard', '1'); localStorage.setItem('sylva_cgu', JSON.stringify({ v: '2026-11-20b' })); localStorage.setItem('sylva_lang', '"fr"'); });
  await pg.route(/\/vendor\/(leaflet|maplibre)\/.*\.js/, r => r.fulfill({ contentType: 'text/javascript', body: stub }));
  const calls = []; let profile = { id: 'u1', pseudo: null, news_optin: false };
  const SESS = { access_token: 'tok', refresh_token: 'ref', expires_in: 3600, user: { id: 'u1', email: 'new@b.be' } };
  await pg.route(/^https?:\/\/(?!localhost)/, async (route) => {
    const url = route.request().url(); if (!url.startsWith(SB)) return route.abort();
    const u = new URL(url), m = route.request().method(), body = route.request().postData(); const J = (o, s) => route.fulfill({ status: s || 200, contentType: 'application/json', body: JSON.stringify(o) });
    const bd = body ? JSON.parse(body) : {}; calls.push(m + ' ' + u.pathname + u.search + ' ' + (body || ''));
    if (u.pathname === '/auth/v1/signup') return bd.email === 'deja@b.be' ? J({ id: 'fake', email: bd.email, identities: [] }) : J({ id: 'u1', email: bd.email });
    if (u.pathname === '/auth/v1/verify') return bd.token === '123456' ? J(SESS) : J({ msg: 'Token has expired or is invalid' }, 403);
    if (u.pathname === '/auth/v1/resend' || u.pathname === '/auth/v1/recover' || u.pathname === '/auth/v1/otp') return J({});
    if (u.pathname === '/auth/v1/user' && m === 'PUT') return J({ id: 'u1' });
    if (u.pathname === '/auth/v1/token') return J({ msg: 'Email not confirmed' }, 400);
    if (u.pathname === '/rest/v1/rpc/my_profile') return J([profile]);
    if (u.pathname === '/rest/v1/profiles' && m === 'PATCH') { Object.assign(profile, bd); return route.fulfill({ status: 204, body: '' }); }
    return J([]);
  });
  await pg.goto('http://localhost:8779/index.html'); await pg.waitForTimeout(1200);
  await pg.click('#btnSettings'); await pg.waitForTimeout(200);
  ok('Écran de connexion : e-mail + mot de passe', await pg.isVisible('#accEmail') && await pg.isVisible('#accPw') && await pg.isVisible('#accLogin'));
  // Afficher le mot de passe
  await pg.fill('#accPw', 'secret12'); await pg.click('[data-pw-eye="accPw"]');
  ok('Afficher le mot de passe', (await pg.getAttribute('#accPw', 'type')) === 'text');
  // Création de compte
  await pg.click('[data-acc="signup"]'); await pg.waitForTimeout(100);
  ok('Case nouvelles non cochée par défaut', !(await pg.isChecked('#accNewsNew')));
  await pg.fill('#accEmail', 'deja@b.be'); await pg.fill('#accPw', 'motdepasse1'); await pg.click('#accSignup'); await pg.waitForTimeout(300);
  ok('Compte existant : message clair', (await pg.textContent('body')).includes('Un compte existe déjà'));
  await pg.fill('#accEmail', 'new@b.be'); await pg.fill('#accPw', 'court'); await pg.click('#accSignup'); await pg.waitForTimeout(200);
  ok('Mot de passe trop court refusé sans appel', !calls.some(c => c.includes('"password":"court"')));
  await pg.fill('#accPw', 'motdepasse1'); await pg.check('#accNewsNew'); await pg.click('#accSignup'); await pg.waitForTimeout(300);
  ok('Accord envoyé à la création', calls.some(c => c.includes('/auth/v1/signup') && c.includes('"news_optin":true')));
  ok('Code de confirmation demandé', await pg.isVisible('#accCode') && await pg.isVisible('#accConfirm'));
  await pg.fill('#accCode', '000000'); await pg.click('#accConfirm'); await pg.waitForTimeout(300);
  ok('Mauvais code refusé', (await pg.textContent('body')).includes('Code incorrect ou expiré'));
  await pg.fill('#accCode', '123456'); await pg.click('#accConfirm'); await pg.waitForTimeout(1200);
  ok('Connecté après confirmation', (await pg.textContent('#accountBox')).includes('new@b.be'));
  ok('Accord enregistré dans le profil', profile.news_optin === true);
  ok('Case nouvelles cochée dans le compte', await pg.isChecked('#accNews'));
  await pg.uncheck('#accNews'); await pg.waitForTimeout(300);
  ok('Désinscription', profile.news_optin === false);
  // Changer de mot de passe
  await pg.click('[data-acc="newpw"]'); await pg.fill('#accPw', 'nouveau123'); await pg.click('#accPwSave'); await pg.waitForTimeout(300);
  ok('Nouveau mot de passe envoyé', calls.some(c => c.startsWith('PUT /auth/v1/user') && c.includes('nouveau123')));
  // Déconnexion puis mot de passe oublié
  await pg.click('#accOut'); await pg.waitForTimeout(300);
  await pg.click('[data-acc="forgot"]'); await pg.fill('#accEmail', 'new@b.be'); await pg.click('#accForgot'); await pg.waitForTimeout(300);
  ok('Code de récupération demandé', calls.some(c => c.includes('/auth/v1/recover')) && await pg.isVisible('#accCode'));
  await pg.fill('#accCode', '123456'); await pg.fill('#accPw', 'encore1234'); await pg.click('#accReset'); await pg.waitForTimeout(800);
  ok('Récupération : vérif recovery + nouveau mot de passe', calls.some(c => c.includes('"type":"recovery"')) && calls.some(c => c.includes('encore1234')));
  ok('Récupération : connecté', (await pg.textContent('#accountBox')).includes('new@b.be'));
  // Adresse pas confirmée à la connexion → écran de code
  await pg.click('#accOut'); await pg.waitForTimeout(300);
  await pg.fill('#accEmail', 'new@b.be'); await pg.fill('#accPw', 'encore1234'); await pg.click('#accLogin'); await pg.waitForTimeout(400);
  ok('Adresse non confirmée : code renvoyé', calls.some(c => c.includes('/auth/v1/resend')) && await pg.isVisible('#accConfirm'));
  // Connexion par code toujours possible
  await pg.click('[data-acc="login"]'); await pg.click('[data-acc="otp"]'); await pg.fill('#accEmail', 'new@b.be'); await pg.click('#accSend'); await pg.waitForTimeout(300);
  ok('Connexion par code', calls.some(c => c.includes('/auth/v1/otp')) && await pg.isVisible('#accVerify'));
  ok('Aucune erreur JS', !errs.length, errs);
  await b.close(); srv.close(); process.exit(fails ? 1 : 0);
})();
