#!/bin/bash
# Swap old font families for Poppins across the stylesheet and CSS modules.
# Headings are switched to Montserrat by hand afterwards; FiraCode stays on
# the two code-block rules only. Run from developer-docs/ root.
set -euo pipefail

FILES="src/css/style.css src/theme/MDXComponents/Cards/styles.module.css src/theme/TOC/styles.module.css src/theme/DocItem/Content/styles.module.css"

for f in $FILES; do
  sed -i '' \
    -e 's|font-family: "Haffer";|font-family: "Poppins", sans-serif;|g' \
    -e 's|font-family: Haffer !important;|font-family: "Poppins", sans-serif !important;|g' \
    -e 's|font-family: Haffer;|font-family: "Poppins", sans-serif;|g' \
    -e "s|font-family: \"DM Mono\", monospace;|font-family: \"Poppins\", sans-serif;|g" \
    -e "s|font-family: 'DM Mono', monospace;|font-family: \"Poppins\", sans-serif;|g" \
    -e 's|font-family: TTCommonsPro !important;|font-family: "Poppins", sans-serif !important;|g' \
    -e 's|font-family: "FiraCode";|font-family: "Poppins", sans-serif;|g' \
    "$f"
done

echo "remaining old families:"
grep -n "Haffer\|DM Mono\|TTCommonsPro\|FiraCode" $FILES || echo "(none besides code blocks)"
