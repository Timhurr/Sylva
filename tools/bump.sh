#!/bin/sh
# Passe Sylva à une nouvelle version : sh tools/bump.sh 0.9.54
# Met à jour VERSION dans app.js et le nom de cache dans sw.js (obligatoire pour que les téléphones prennent la mise à jour).
set -e
cd "$(dirname "$0")/.."
[ -n "$1" ] || { echo "Usage : sh tools/bump.sh 0.9.54"; exit 1; }
sed -i.bak -E "s/var VERSION = \"[0-9.]+\"/var VERSION = \"$1\"/" app.js
sed -i.bak -E "s/sylva-v[0-9.]+/sylva-v$1/" sw.js
rm -f app.js.bak sw.js.bak
grep -n 'var VERSION' app.js; grep -n 'sylva-v' sw.js | head -1
