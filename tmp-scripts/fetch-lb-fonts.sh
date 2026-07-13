#!/bin/bash
# Download the Poppins/Montserrat TTFs served by learnbittensor.org
# (both are OFL-licensed Google Fonts) into static/fonts/ so the guides
# site matches its typography exactly. Run from developer-docs/ root.
set -euo pipefail

BASE="https://learnbittensor.org/_nuxt"
DEST="static/fonts"

PAIRS="
Poppins-Regular.ttf:Poppins-Regular.CTKNfV9P.ttf
Poppins-Italic.ttf:Poppins-Italic.PjgN8SAi.ttf
Poppins-Medium.ttf:Poppins-Medium.Cxde2ZoM.ttf
Poppins-SemiBold.ttf:Poppins-SemiBold.B_fPDAUb.ttf
Poppins-Bold.ttf:Poppins-Bold.qTAUjFF7.ttf
Montserrat-Regular.ttf:Montserrat-Regular.BQsUpcHj.ttf
Montserrat-Medium.ttf:Montserrat-Medium.DZ4qtIu-.ttf
Montserrat-SemiBold.ttf:Montserrat-SemiBold.B-lLb63I.ttf
Montserrat-Bold.ttf:Montserrat-Bold.DEcR8bPr.ttf
"

for pair in $PAIRS; do
  name="${pair%%:*}"
  remote="${pair##*:}"
  curl -sf -m 30 "${BASE}/${remote}" -o "${DEST}/${name}"
  # sanity: a real ttf starts with 0x00010000
  head -c 4 "${DEST}/${name}" | xxd -p | grep -q "^00010000" || { echo "BAD FILE: ${name}"; exit 1; }
  echo "ok ${name} ($(wc -c < "${DEST}/${name}") bytes)"
done
