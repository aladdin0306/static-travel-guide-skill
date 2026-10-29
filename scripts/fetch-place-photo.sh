#!/usr/bin/env bash
# Preferred entry: search Commons by place name, retry, placeholder fallback.
# Usage: ./scripts/fetch-place-photo.sh SITE_DIR PHOTO_ID "Fushimi Inari Kyoto" [optional exact file]
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
SITE="${1:?site dir}"
ID="${2:?photo id}"
QUERY="${3:?place search query}"
FILE="${4:-}"
ARGS=( "$SITE" "$ID" --query "$QUERY" )
if [[ -n "$FILE" ]]; then
  ARGS+=( --file "$FILE" )
fi
exec python3 "$ROOT/fetch_place_photo.py" "${ARGS[@]}"
