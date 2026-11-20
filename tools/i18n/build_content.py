#!/usr/bin/env python3
"""Construit i18n/<langue>_content.js depuis tools/i18n/content_<langue>/{guide,techs,especes}_*.json (par identifiant).
Usage : python3 tools/i18n/build_content.py [en|nl]   (sans argument : toutes les langues)"""
import json, glob, os, sys
R = os.path.dirname(os.path.abspath(__file__))
def build(LANG):
    C = {'guide': {}, 'techs': {}, 'especes': {}}
    for kind in C:
        for f in sorted(glob.glob(os.path.join(R, 'content_' + LANG, kind + '_*.json'))):
            C[kind].update(json.load(open(f)))
    fr = {k: json.load(open(os.path.join(R, 'content_fr', k + '.json'))) for k in C}
    if LANG == 'nl':
        # Sources des fiches : traduites automatiquement depuis l'anglais (phrases récurrentes, voir nl_sources.py)
        sys.path.insert(0, R); from nl_sources import source_nl
        en = {}
        for f in glob.glob(os.path.join(R, 'content_en', 'techs_*.json')): en.update(json.load(open(f)))
        nosrc = []
        for i, t in C['techs'].items():
            if 'source' not in t and en.get(i, {}).get('source'):
                s = source_nl(en[i]['source'])
                if s: t['source'] = s
                else: nosrc.append(i)
        if nosrc: print('sources non traduites :', nosrc)
    for k in C:
        missing = [i for i in fr[k] if i not in C[k]]
        unknown = [i for i in C[k] if i not in fr[k]]
        print(f'{LANG} {k}: {len(C[k])}/{len(fr[k])} traduits' + (f', inconnus: {unknown}' if unknown else ''))
    out = os.path.join(R, '..', '..', 'i18n', LANG + '_content.js')
    with open(out, 'w') as f:
        f.write('/* Bivaska – contenu ' + LANG + ' (fiches, espèces, guide), par identifiant.\n   Généré par tools/i18n/build_content.py depuis tools/i18n/content_en/ (ne pas modifier à la main). */\n')
        f.write('window.SYLVA_EN = window.SYLVA_EN || { ui: {}, content: {} };\nwindow.SYLVA_EN.content = ')
        json.dump(C, f, ensure_ascii=False, separators=(',', ':'))
        f.write(';\n')
    print(os.path.getsize(out) // 1024, 'Ko')

for L in (sys.argv[1:] or ['en', 'nl']):
    if os.path.isdir(os.path.join(R, 'content_' + L)): build(L)
