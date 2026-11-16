// Génère des gravures avec l'API OpenAI à partir des prompts de l'atelier.
// Usage (GitHub Actions, secret OPENAI_API_KEY) :
//   node tools/gen_images.js --groupe "Espèces : plantes toxiques" --limite 20 --qualite medium
//   node tools/gen_images.js --ids esp_ortie,esp_ail_ours
// Les images vont dans gravures/<id>.png (branche « gravures »), jamais directement dans l'appli :
// elles sont vérifiées avant d'être intégrées avec tools/add_images.py.
const fs = require("fs"), path = require("path"), vm = require("vm");
const root = path.resolve(__dirname, "..");
const arg = (k, d) => { const i = process.argv.indexOf("--" + k); return i > 0 && process.argv[i + 1] !== undefined ? process.argv[i + 1] : d; };
const KEY = process.env.OPENAI_API_KEY;
if (!KEY) { console.error("Secret OPENAI_API_KEY absent : ajoute-le dans Settings > Secrets and variables > Actions."); process.exit(1); }

// Charge ITEMS et promptOf depuis l'atelier (partie données du script, avant l'interface)
const html = fs.readFileSync(path.join(root, "docs/atelier-images.html"), "utf8");
const js = html.slice(html.indexOf("var STYLE ="), html.indexOf("\nfunction esc("));
const ctx = {}; vm.createContext(ctx); vm.runInContext(js + "\nthis.ITEMS = ITEMS; this.promptOf = promptOf;", ctx);
const ITEMS = ctx.ITEMS;

const outDir = path.join(root, "gravures"); fs.mkdirSync(outDir, { recursive: true });
const have = (id) => fs.existsSync(path.join(root, "img", id + ".webp")) || fs.existsSync(path.join(outDir, id + ".png"));
const ids = arg("ids", "").split(",").map((s) => s.trim()).filter(Boolean);
const groupe = arg("groupe", "");
const limite = Math.max(1, Math.min(150, +arg("limite", 20) || 20));
const qualite = arg("qualite", "medium"), modele = arg("modele", "gpt-image-2");
const style = path.join(root, arg("style", "img/ps_pls.webp"));

let todo = ITEMS.filter((it) => ids.length ? ids.includes(it[0]) : (groupe === "Prioritaires" ? it[4] : groupe === "Toutes" || it[1] === groupe));
if (!ids.length) todo = todo.filter((it) => !have(it[0]));
todo = todo.slice(0, limite);
if (!todo.length) { console.log("Rien à générer pour « " + (ids.join(",") || groupe) + " » (déjà faites ou groupe inconnu)."); process.exit(0); }
console.log(todo.length + " image(s) à générer, modèle " + modele + ", qualité " + qualite);

const styleBlob = new Blob([fs.readFileSync(style)], { type: style.endsWith(".png") ? "image/png" : "image/webp" });
async function one(it, essai = 1) {
  const fd = new FormData();
  fd.append("model", modele);
  fd.append("image[]", styleBlob, path.basename(style));
  fd.append("prompt", ctx.promptOf(it));
  fd.append("size", modele.startsWith("gpt-image-2") ? "1536x1152" : "1536x1024");
  fd.append("quality", qualite);
  fd.append("n", "1");
  const r = await fetch("https://api.openai.com/v1/images/edits", { method: "POST", headers: { Authorization: "Bearer " + KEY }, body: fd });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j.data || !j.data[0] || !j.data[0].b64_json) {
    const msg = (j.error && j.error.message) || ("HTTP " + r.status);
    if (essai < 3 && (r.status === 429 || r.status >= 500)) { await new Promise((s) => setTimeout(s, 20000 * essai)); return one(it, essai + 1); }
    throw new Error(msg);
  }
  fs.writeFileSync(path.join(outDir, it[0] + ".png"), Buffer.from(j.data[0].b64_json, "base64"));
  return j.usage;
}
(async () => {
  const ok = [], ko = []; let i = 0;
  async function worker() { while (i < todo.length) { const it = todo[i++]; try { await one(it); ok.push(it[0]); console.log("OK  " + it[0] + "  " + it[2]); } catch (e) { ko.push(it[0]); console.log("ERR " + it[0] + "  " + e.message); if (/billing|quota|credit|invalid_api_key|Incorrect API key/i.test(e.message)) i = todo.length; } } }
  await Promise.all([worker(), worker(), worker()]);
  // Planche de vérification
  const files = fs.readdirSync(outDir).filter((f) => f.endsWith(".png")).sort();
  const byId = Object.fromEntries(ITEMS.map((it) => [it[0], it]));
  fs.writeFileSync(path.join(outDir, "README.md"), "# Gravures à vérifier\n\nGénérées par l'API, pas encore dans l'appli.\n\n" +
    files.map((f) => { const it = byId[f.slice(0, -4)]; return "### " + (it ? it[2] : f) + " (`" + f + "`)\n\n![](" + f + ")\n"; }).join("\n"));
  console.log("\nFaites : " + ok.length + " · En erreur : " + ko.length + (ko.length ? " (" + ko.join(", ") + ")" : ""));
  if (!ok.length && ko.length) process.exit(1);
})();
