#!/usr/bin/env bash
# Copy the 行程库 template into a new folder for the user's trip site.
# Usage: ./scripts/new-site.sh /path/to/my-trip-site
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="${1:?Usage: $0 /path/to/output-site}"
if [[ -e "$DEST" ]]; then
  echo "Destination already exists: $DEST" >&2
  exit 1
fi
mkdir -p "$(dirname "$DEST")"
cp -R "$ROOT/template" "$DEST"
# leave photos; agent will replace data.js
echo "Created $DEST"
echo "Next: overwrite $DEST/data.js with the user's SEED_TRIPS, then:"
echo "  cd $DEST && python3 -m http.server 8766 --bind 0.0.0.0"
