#!/usr/bin/env bash
# Bundle a generated trip site into a single self-contained offline HTML file.
# Usage: ./scripts/bundle-single.sh /path/to/OUTPUT_SITE [/path/to/output.html]
set -euo pipefail

SITE="${1:?Usage: $0 /path/to/OUTPUT_SITE [output.html]}"
if [[ ! -d "$SITE" || ! -f "$SITE/index.html" || ! -f "$SITE/data.js" ]]; then
  echo "Invalid site directory (missing index.html or data.js): $SITE" >&2
  exit 1
fi
SITE="$(cd "$SITE" && pwd)"

SLUG="$(basename "$SITE" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9._-]+/-/g; s/^-+//; s/-+$//')"
OUT="${2:-$SITE/${SLUG:-trip}-offline.html}"

python3 - "$SITE" "$OUT" <<'PY'
import base64
import json
import re
import sys
from pathlib import Path

site = Path(sys.argv[1])
out = Path(sys.argv[2])

html = (site / "index.html").read_text(encoding="utf-8")
css = (site / "styles.css").read_text(encoding="utf-8")
data_js = (site / "data.js").read_text(encoding="utf-8")
app_js = (site / "app.js").read_text(encoding="utf-8")

# Inline local photos/ references as base64 data URIs so offline HTML carries its images
photo_map = {}
for p_dir in [site / "photos"]:
    if p_dir.is_dir():
        for img in sorted(p_dir.iterdir()):
            if img.is_file() and img.suffix.lower() in (".jpg", ".jpeg", ".png", ".webp"):
                mime = "image/png" if img.suffix.lower() == ".png" else "image/webp" if img.suffix.lower() == ".webp" else "image/jpeg"
                b64 = base64.b64encode(img.read_bytes()).decode("ascii")
                photo_map[f"photos/{img.name}"] = f"data:{mime};base64,{b64}"

def safe_inline(text: str, tag: str) -> str:
    return text.replace(f"</{tag}", f"<\\/{tag}")

offline_shim = f"""
window.__OFFLINE_PHOTOS = {json.dumps(photo_map)};
"""

# Patch app.js photo() / safePhoto lookup gently via a wrapper after load or rewrite data.js local photo paths
for rel, data_uri in photo_map.items():
    data_js = data_js.replace(f'"{rel}"', json.dumps(data_uri))
    data_js = data_js.replace(f"'{rel}'", json.dumps(data_uri))

# If data.js uses photo(id) helper returning `photos/${id}.jpg`, override normalize/safePhoto via offline hook
app_js = app_js.replace(
    "let src = normalizePhotoUrl(pic.src);",
    "let src = normalizePhotoUrl((window.__OFFLINE_PHOTOS && window.__OFFLINE_PHOTOS[pic.src]) || pic.src);"
)

offline_css = css + "\n#share-btn, #fork-btn, #sandbox-notice { display: none !important; }\n"

# Replace stylesheet and script tags
html = re.sub(
    r'<link\s+rel="stylesheet"\s+href="styles\.css[^"]*"\s*/?>',
    lambda _: f"<style>\n{safe_inline(offline_css, 'style')}\n</style>",
    html,
    count=1,
)
html = re.sub(
    r'<script\s+src="data\.js[^"]*"\s*></script>',
    lambda _: f"<script>\n{safe_inline(offline_shim + data_js, 'script')}\n</script>",
    html,
    count=1,
)
html = re.sub(
    r'<script\s+src="app\.js[^"]*"\s*></script>',
    lambda _: f"<script>\n{safe_inline(app_js, 'script')}\n</script>",
    html,
    count=1,
)
html = re.sub(
    r'<script\s+src="share\.js[^"]*"\s*></script>\s*',
    "",
    html,
)

out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(html, encoding="utf-8")
print(f"Offline bundle: {out}")
print(f"Size: {out.stat().st_size // 1024} KB ({len(photo_map)} embedded photos)")
PY
