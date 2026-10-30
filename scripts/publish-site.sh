#!/usr/bin/env bash
# Publish a generated trip to the shared Cloudflare service.
# Usage: ./scripts/publish-site.sh /path/to/site [https://your-worker.example] [trip-id]
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SITE="${1:?Usage: $0 /path/to/site [API_BASE] [trip-id]}"
API_BASE="${2:-${TRAVEL_GUIDE_API:-}}"
TRIP_ID="${3:-}"

if [[ -z "$API_BASE" ]]; then
  echo "Missing API base. Pass it as the second argument or set TRAVEL_GUIDE_API." >&2
  exit 1
fi

node "$ROOT/scripts/publish-site.mjs" "$SITE" "$API_BASE" "$TRIP_ID"
