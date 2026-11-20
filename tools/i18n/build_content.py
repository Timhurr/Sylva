#!/usr/bin/env python3
"""Construit i18n/en_content.js depuis tools/i18n/content_en/{guide,techs,especes}_*.json (par identifiant)."""
import json, glob, os
R = os.path.dirname(os.path.abspath(__file__))
C = {'guide': {}, 'techs': {}, 'especes': {}}
for kind in C:
    for f in sorted(glob.glob(os.path.join(R, 'content_en', kind + '_*.json'))):
        C[kind].update(json.load(open(f)))
fr = {k: json.load(open(os.path.join(R, 'content_fr', k + '.json'))) for k in C}
for k in C:
    missing = [i for i in fr[k] if i not in C[k]]
    unknown = [i for i in C[k] if i not in fr[k]]
    print(f'{k}: {len(C[k])}/{len(fr[k])} traduits' + (f', inconnus: {unknown}' if unknown else ''))
out = os.path.join(R, '..', '..', 'i18n', 'en_content.js')
with open(out, 'w') as f:
    f.write('/* Bivaska – contenu en anglais (fiches, espèces, guide), par identifiant.\n   Généré par tools/i18n/build_content.py depuis tools/i18n/content_en/ (ne pas modifier à la main). */\n')
    f.write('window.SYLVA_EN = window.SYLVA_EN || { ui: {}, content: {} };\nwindow.SYLVA_EN.content = ')
    json.dump(C, f, ensure_ascii=False, separators=(',', ':'))
    f.write(';\n')
print(os.path.getsize(out) // 1024, 'Ko')
