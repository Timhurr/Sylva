#!/usr/bin/env python3
"""Injecte tools/esp_desc.py dans l'atelier (var ESP_DESC) : python3 tools/esp_inject.py"""
import json, re, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from esp_desc import D
p = os.path.join(os.path.dirname(__file__), "..", "docs", "atelier-images.html")
h = open(p, encoding="utf-8").read()
block = "var ESP_DESC = " + json.dumps(D, ensure_ascii=False, indent=0) + ";\n"
if "var ESP_DESC =" in h:
    h = re.sub(r"var ESP_DESC = \{.*?\};\n", lambda m: block, h, flags=re.S)
else:
    h = h.replace("var ESP_FRAME = {", block + "var ESP_FRAME = {", 1)
open(p, "w", encoding="utf-8").write(h)
print(len(D), "descriptions")
