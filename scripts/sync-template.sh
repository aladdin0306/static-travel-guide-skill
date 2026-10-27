#!/usr/bin/env bash
# Sync template/ (+ demo/ app shell) from the official travel-guides repo.
# Usage:
#   ./scripts/sync-template.sh
#   ./scripts/sync-template.sh /path/to/local/travel-guides
#   TRAVEL_GUIDES_REF=v1.0.0 ./scripts/sync-template.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="${1:-}"
REF="${TRAVEL_GUIDES_REF:-main}"
TMP=""

cleanup() {
  if [[ -n "$TMP" && -d "$TMP" ]]; then rm -rf "$TMP"; fi
}
trap cleanup EXIT

if [[ -z "$SRC" ]]; then
  # Prefer sibling checkout used in development
  if [[ -d "$ROOT/../travel-guides/.git" ]]; then
    SRC="$(cd "$ROOT/../travel-guides" && pwd)"
    echo "Using sibling travel-guides: $SRC"
  else
    TMP="$(mktemp -d)"
    echo "Cloning aladdin0306/travel-guides@$REF …"
    git clone --depth 1 --branch "$REF" https://github.com/aladdin0306/travel-guides.git "$TMP/travel-guides"
    SRC="$TMP/travel-guides"
  fi
fi

for f in index.html app.js styles.css LICENSE; do
  if [[ ! -f "$SRC/$f" ]]; then
    echo "Missing $SRC/$f" >&2
    exit 1
  fi
done

mkdir -p "$ROOT/template/photos" "$ROOT/demo/photos"
cp "$SRC/index.html" "$SRC/app.js" "$SRC/styles.css" "$SRC/LICENSE" "$ROOT/template/"
cp "$SRC/index.html" "$SRC/app.js" "$SRC/styles.css" "$SRC/LICENSE" "$ROOT/demo/"

# Keep skill disclaimer note in rail if present in patched copies — re-apply patch marker
python3 - <<'PY' "$ROOT"
from pathlib import Path
import sys
root = Path(sys.argv[1])
note = "票价、汇率、班期多为估算，请出行前再核对官网。改动只存在这台浏览器里；换设备用右上角导出。"
old = "改动只存在这台浏览器里。换电脑或发给别人，用右上角的导出。"
for name in ("template", "demo"):
    p = root / name / "index.html"
    text = p.read_text()
    if note not in text:
        text = text.replace(
            f'<p class="rail-note">{old}</p>',
            f'<p class="rail-note">{note}</p>',
        )
        p.write_text(text)
print("Synced app shell into template/ and demo/; data.js & photos unchanged.")
PY

# Record sync source
{
  echo "source=$SRC"
  echo "ref=${TRAVEL_GUIDES_REF:-local-or-main}"
  echo "synced_at=$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "upstream=https://github.com/aladdin0306/travel-guides"
} > "$ROOT/template/SYNC.txt"
cp "$ROOT/template/SYNC.txt" "$ROOT/demo/SYNC.txt"
echo "Wrote template/SYNC.txt"
echo "Note: re-seed demo/data.js separately if you need Australia sample after major schema changes."
