#!/usr/bin/env bash
# Download a Wikimedia Commons File: into photos/{id}.jpg and print credit line for PHOTOS.
# Usage: ./scripts/fetch-commons-photo.sh SITE_DIR PHOTO_ID "Exact_File_Name_On_Commons.jpg"
# Example: ./scripts/fetch-commons-photo.sh ./my-site au-d1-opera "Sydney_Australia._(21339175489).jpg"
set -euo pipefail
SITE="${1:?site dir}"
ID="${2:?photo id}"
FILE="${3:?commons file name}"
SITE="$(cd "$SITE" && pwd)"
mkdir -p "$SITE/photos"
ENC="$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))" "$FILE")"
API="https://commons.wikimedia.org/w/api.php?action=query&titles=File:${ENC}&prop=imageinfo&iiprop=url|extmetadata&format=json"
META="$(curl -fsSL -A "static-travel-guide-skill/1.0 (personal itinerary; contact via github.com/aladdin0306)" "$API")"
URL="$(python3 -c "import json,sys; d=json.load(sys.stdin); p=next(iter(d['query']['pages'].values())); print(p['imageinfo'][0]['url'])" <<<"$META")"
CREDIT="$(python3 -c "
import json,sys
d=json.load(sys.stdin)
p=next(iter(d['query']['pages'].values()))
m=p['imageinfo'][0].get('extmetadata') or {}
artist=(m.get('Artist') or {}).get('value') or 'Unknown'
lic=(m.get('LicenseShortName') or {}).get('value') or (m.get('UsageTerms') or {}).get('value') or 'see Commons'
import re
artist=re.sub('<[^>]+>','',artist)
print(f'{artist} · {lic}')
" <<<"$META")"
TMP="$(mktemp)"
curl -fsSL -A "static-travel-guide-skill/1.0" -o "$TMP" "$URL"
# Prefer sips (macOS) or convert; else copy
OUT="$SITE/photos/${ID}.jpg"
if command -v sips >/dev/null 2>&1; then
  sips -s format jpeg -Z 1600 "$TMP" --out "$OUT" >/dev/null
elif command -v magick >/dev/null 2>&1; then
  magick "$TMP" -resize '1600x1600>' -quality 82 "$OUT"
elif command -v convert >/dev/null 2>&1; then
  convert "$TMP" -resize '1600x1600>' -quality 82 "$OUT"
else
  cp "$TMP" "$OUT"
fi
rm -f "$TMP"
echo "Saved $OUT"
echo "PHOTOS entry:"
echo "  \"$ID\": [$(python3 -c "import json,sys; print(json.dumps(sys.argv[1]))" "$CREDIT"), $(python3 -c "import json,sys; print(json.dumps(sys.argv[1]))" "$FILE")],"
