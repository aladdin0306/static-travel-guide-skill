#!/usr/bin/env bash
# Download by exact Commons file name; if missing/503, falls back to search using the name as query.
# Usage: ./scripts/fetch-commons-photo.sh SITE_DIR PHOTO_ID "Exact_File_Name.jpg"
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
SITE="${1:?site dir}"
ID="${2:?photo id}"
FILE="${3:?commons file name}"
# Use file stem / underscores→spaces as search query fallback
QUERY="$(python3 -c "import sys; s=sys.argv[1].rsplit('.',1)[0].replace('_',' '); print(s)" "$FILE")"
exec python3 "$ROOT/fetch_place_photo.py" "$SITE" "$ID" --file "$FILE" --query "$QUERY"
