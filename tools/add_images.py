#!/usr/bin/env python3
"""Ajoute des images à Sylva puis régénère images.js.

Usage : python3 tools/add_images.py <image_source> <id_cible> [<image_source> <id_cible> ...]
Exemple : python3 tools/add_images.py ~/Downloads/a.png rj_pemmican ~/Downloads/b.png ps_tique_2

Chaque image est réduite (840 px max), convertie en WebP qualité 58 et écrite dans img/<id_cible>.webp.
Sans argument, régénère seulement images.js à partir du dossier img/.
"""
import json, os, re, sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, "img")
args = sys.argv[1:]
if len(args) % 2:
    sys.exit("Donne des paires : <image_source> <id_cible>")
for src, dst in zip(args[0::2], args[1::2]):
    im = Image.open(src).convert("RGB")
    im.thumbnail((840, 840))
    im.save(os.path.join(IMG, dst + ".webp"), "WEBP", quality=58, method=6)
    print("ok", dst, im.size)
names = sorted(f[:-5] for f in os.listdir(IMG) if f.endswith(".webp"))
p = os.path.join(ROOT, "images.js")
s = open(p, encoding="utf-8").read()
s = re.sub(r"g\.SYLVA_IMAGES = \[[^\]]*\]", "g.SYLVA_IMAGES = " + json.dumps(names, ensure_ascii=False).replace('","', '", "'), s, count=1)
open(p, "w", encoding="utf-8").write(s)
print(len(names), "images dans images.js")
