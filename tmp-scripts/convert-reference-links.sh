#!/bin/bash
# Convert internal links to removed reference docs (btcli reference, SDK
# reference, chain API, Sphinx HTML bundles) into absolute URLs on the old
# docs.learnbittensor.org domain, which currently 301s to bittensor.com/docs.
# Run from developer-docs/ root.
set -euo pipefail

OLD="https://docs.learnbittensor.org"

FILES=$(find docs -type f \( -name "*.md" -o -name "*.mdx" \) ! -path "docs/lb-scrape/*")

for f in $FILES; do
  sed -i '' \
    -e "s|pathname:///python-api/|${OLD}/python-api/|g" \
    -e "s|pathname:///btwallet-api/|${OLD}/btwallet-api/|g" \
    -e "s|pathname:///legacy-python-api/|${OLD}/legacy-python-api/|g" \
    -e "s|](../btcli/btcli.md#|](${OLD}/btcli/btcli#|g" \
    -e "s|](../btcli/btcli.md)|](${OLD}/btcli/btcli)|g" \
    -e "s|](./btcli.md)|](${OLD}/btcli/btcli)|g" \
    -e "s|](./bt-api-ref.md)|](${OLD}/sdk/bt-api-ref)|g" \
    -e "s|](./bt-api-ref)|](${OLD}/sdk/bt-api-ref)|g" \
    -e "s|](../sdk/bt-api-ref.md)|](${OLD}/sdk/bt-api-ref)|g" \
    -e "s|](../sdk/subtensor-api.md)|](${OLD}/sdk/subtensor-api)|g" \
    "$f"
  sed -i '' -E \
    -e "s|\]\(\.\./subtensor-api/([a-z]+)(\.md)?\)|](${OLD}/subtensor-api/\1)|g" \
    "$f"
done

# Landing page reference cards
sed -i '' \
  -e "s|link='btcli'|link='${OLD}/btcli/btcli'|" \
  -e "s|link='/sdk/bt-api-ref'|link='${OLD}/sdk/bt-api-ref'|" \
  docs/index.md

echo "done"
