#!/usr/bin/env bash
# Publish a generated trip to the shared Cloudflare service.
# Usage: ./scripts/publish-site.sh /path/to/site [https://your-worker.example] [trip-id]
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SITE="${1:?Usage: $0 /path/to/site [API_BASE] [trip-id]}"
DEFAULT_API="https://static-travel-guide.huqimeng0306.workers.dev"
API_BASE="${2:-${TRAVEL_GUIDE_API:-$DEFAULT_API}}"
TRIP_ID="${3:-}"

node "$ROOT/scripts/publish-site.mjs" "$SITE" "$API_BASE" "$TRIP_ID"
