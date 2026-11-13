#!/usr/bin/env bash
# Publish a generated trip to the user's configured Cloudflare Worker (or the public demo sandbox).
# Usage: ./scripts/publish-site.sh /path/to/site [https://your-worker.example] [trip-id]
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SITE="${1:?Usage: $0 /path/to/site [API_BASE] [trip-id]}"
DEFAULT_API="https://static-travel-guide.huqimeng0306.workers.dev"
CONFIG_API_FILE="${XDG_CONFIG_HOME:-$HOME/.config}/static-travel-guide/api"

SAVED_API=""
if [[ -f "$CONFIG_API_FILE" ]]; then
  SAVED_API="$(tr -d '[:space:]' < "$CONFIG_API_FILE")"
fi

API_BASE="${2:-${TRAVEL_GUIDE_API:-${SAVED_API:-$DEFAULT_API}}}"
TRIP_ID="${3:-}"

if [[ "$API_BASE" == "$DEFAULT_API" ]]; then
  echo "Target: public demo sandbox ($API_BASE)"
  echo "Tip: for permanent private hosting, run publish-gh-pages.sh or setup-cloud.sh."
else
  echo "Target: self-hosted Worker ($API_BASE)"
fi

node "$ROOT/scripts/publish-site.mjs" "$SITE" "$API_BASE" "$TRIP_ID"
