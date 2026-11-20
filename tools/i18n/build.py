#!/usr/bin/env python3
"""Construit i18n/en_ui.js depuis tools/i18n/ui_keep.json (textes français) et tools/i18n/tr/*.json (index → anglais).
Les clés contenant des nombres sont aussi enregistrées en modèle (« # »), et les mois / jours en « % »."""
import json, glob, re, os
R = os.path.dirname(os.path.abspath(__file__))
keep = json.load(open(os.path.join(R, 'ui_keep.json')))
tr = {}
for f in sorted(glob.glob(os.path.join(R, 'tr', '*.json'))):
    tr.update({int(k): v for k, v in json.load(open(f)).items()})
extra = {}
ef = os.path.join(R, 'extra.json')
if os.path.exists(ef): extra = json.load(open(ef))
NUM = re.compile(r'\d+(?:[.,]\d+)?')
FRW = "janvier février mars avril mai juin juillet août septembre octobre novembre décembre lundi mardi mercredi jeudi vendredi samedi dimanche".split()
ENW = "January February March April May June July August September October November December Monday Tuesday Wednesday Thursday Friday Saturday Sunday".split()
WFR = re.compile(r'\b(' + '|'.join(FRW) + r')\b', re.I)
WEN = re.compile(r'\b(' + '|'.join(ENW) + r')\b', re.I)
def norm(s): return re.sub(r'\s+', ' ', s).strip()
D = {}
def put(fr, en):
    fr, en = norm(fr), norm(en)
    if not fr or not en: return
    if '#' in en or '%' in en:
        D[WFR.sub('%', NUM.sub('#', fr))] = en; return
    D[fr] = en
    nf, ne = NUM.findall(fr), NUM.findall(en)
    wf, we = WFR.findall(fr), WEN.findall(en)
    if (nf or wf) and len(nf) == len(ne) and [x.replace(',', '.') for x in nf] == [x.replace(',', '.') for x in ne] and len(wf) == len(we):
        D[WFR.sub('%', NUM.sub('#', fr))] = WEN.sub('%', NUM.sub('#', en))
for i, en in tr.items():
    if 0 <= i < len(keep) and en: put(keep[i], en)
for fr, en in extra.items(): put(fr, en)
out = os.path.join(R, '..', '..', 'i18n', 'en_ui.js')
with open(out, 'w') as f:
    f.write('/* Bivaska – interface en anglais : texte français exact → anglais ; « # » = nombre, « % » = mois ou jour.\n   Généré par tools/i18n/build.py (ne pas modifier à la main : corriger tools/i18n/tr/*.json ou extra.json). */\n')
    f.write('window.SYLVA_EN = window.SYLVA_EN || { ui: {}, content: {} };\nwindow.SYLVA_EN.ui = ')
    json.dump(D, f, ensure_ascii=False, indent=0, sort_keys=True)
    f.write(';\n')
print(len(D), 'entrées', os.path.getsize(out) // 1024, 'Ko')
