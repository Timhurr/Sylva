#!/usr/bin/env python3
"""Construit i18n/<langue>_ui.js depuis tools/i18n/ui_keep.json (textes français) et les traductions par index :
anglais : tools/i18n/tr/*.json + extra.json ; néerlandais : tools/i18n/tr_nl/*.json + extra_nl.json.
Usage : python3 tools/i18n/build.py [en|nl]   (sans argument : toutes les langues)
Les clés contenant des nombres sont aussi enregistrées en modèle (« # »), et les mois / jours en « % »."""
import json, glob, re, os, sys
R = os.path.dirname(os.path.abspath(__file__))
keep = json.load(open(os.path.join(R, 'ui_keep.json')))
LANGS = sys.argv[1:] or ['en', 'nl']
def build(LANG):
    tr = {}
    for f in sorted(glob.glob(os.path.join(R, 'tr' if LANG == 'en' else 'tr_' + LANG, '*.json'))):
        tr.update({int(k): v for k, v in json.load(open(f)).items()})
    extra = {}
    ef = os.path.join(R, 'extra.json' if LANG == 'en' else 'extra_' + LANG + '.json')
    if os.path.exists(ef): extra = json.load(open(ef))
    NUM = re.compile(r'\d+(?:[.,]\d+)?')
    FRW = "janvier février mars avril mai juin juillet août septembre octobre novembre décembre lundi mardi mercredi jeudi vendredi samedi dimanche".split()
    ENW = ("januari februari maart april mei juni juli augustus september oktober november december maandag dinsdag woensdag donderdag vrijdag zaterdag zondag" if LANG == 'nl' else "January February March April May June July August September October November December Monday Tuesday Wednesday Thursday Friday Saturday Sunday").split()
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
    out = os.path.join(R, '..', '..', 'i18n', LANG + '_ui.js')
    with open(out, 'w') as f:
        f.write('/* Bivaska – interface ' + LANG + ' : texte français exact → traduction ; « # » = nombre, « % » = mois ou jour.\n   Généré par tools/i18n/build.py (ne pas modifier à la main : corriger tools/i18n/tr/*.json ou extra.json). */\n')
        f.write('window.SYLVA_EN = window.SYLVA_EN || { ui: {}, content: {} };\nwindow.SYLVA_EN.ui = ')
        json.dump(D, f, ensure_ascii=False, indent=0, sort_keys=True)
        f.write(';\n')
    print(LANG, len(D), 'entrées', os.path.getsize(out) // 1024, 'Ko')

for L in LANGS:
    if os.path.isdir(os.path.join(R, 'tr' if L == 'en' else 'tr_' + L)): build(L)
