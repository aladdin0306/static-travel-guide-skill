#!/usr/bin/env bash
# One-command setup to deploy the collaborative sharing backend to the user's OWN free Cloudflare account.
# Saves the resulting Worker URL to ~/.config/static-travel-guide/api for automatic use by publish-site.sh.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CFG_DIR="${XDG_CONFIG_HOME:-$HOME/.config}/static-travel-guide"
WORK_DIR="$CFG_DIR/worker-deploy"
API_FILE="$CFG_DIR/api"
REGISTRY="${npm_config_registry:-https://registry.npmjs.org}"

if ! command -v npx >/dev/null 2>&1; then
  echo "Node.js / npx is required. Install Node.js >= 18 first." >&2
  exit 1
fi

wrangler() {
  npm_config_registry="$REGISTRY" npx --yes wrangler "$@"
}

echo "Checking Cloudflare login..."
if ! wrangler whoami >/dev/null 2>&1; then
  echo "Opening browser for Cloudflare login..."
  wrangler login
fi

mkdir -p "$WORK_DIR"
rm -rf "$WORK_DIR/template" "$WORK_DIR/worker"
cp -R "$ROOT/template" "$WORK_DIR/template"
cp -R "$ROOT/worker" "$WORK_DIR/worker"
cp "$ROOT/wrangler.toml.example" "$WORK_DIR/wrangler.toml"

cd "$WORK_DIR"

echo "Finding or creating D1 database 'static-travel-guide'..."
DB_ID="$(wrangler d1 list --json 2>/dev/null | python3 -c '
import json, sys
try:
    rows = json.load(sys.stdin)
    for r in rows:
        if r.get("name") == "static-travel-guide":
            print(r.get("uuid") or r.get("id") or "")
            break
except Exception:
    pass
')"

if [[ -z "$DB_ID" ]]; then
  CREATE_OUT="$(wrangler d1 create static-travel-guide)"
  echo "$CREATE_OUT"
  DB_ID="$(printf '%s' "$CREATE_OUT" | grep -Eo '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}' | head -n 1 || true)"
fi

if [[ -z "$DB_ID" ]]; then
  echo "Could not determine D1 database_id." >&2
  exit 1
fi

python3 - "$WORK_DIR/wrangler.toml" "$DB_ID" <<'PY'
import sys
from pathlib import Path
p = Path(sys.argv[1])
db_id = sys.argv[2]
text = p.read_text(encoding="utf-8")
text = text.replace("把 wrangler d1 create 返回的 database_id 填在这里", db_id)
p.write_text(text, encoding="utf-8")
PY

echo "Initializing D1 schema..."
wrangler d1 execute static-travel-guide --remote --file=worker/schema.sql

echo "Setting random RATE_LIMIT_SALT secret..."
SALT="$(python3 -c 'import secrets; print(secrets.token_hex(24))')"
printf '%s\n' "$SALT" | wrangler secret put RATE_LIMIT_SALT >/dev/null

echo "Deploying Worker to your Cloudflare account..."
DEPLOY_OUT="$(wrangler deploy)"
echo "$DEPLOY_OUT"

WORKER_URL="$(printf '%s' "$DEPLOY_OUT" | grep -Eo 'https://[A-Za-z0-9._-]+\.workers\.dev' | head -n 1 || true)"
if [[ -z "$WORKER_URL" ]]; then
  echo "Deployed, but could not parse workers.dev URL from output above." >&2
  exit 1
fi

mkdir -p "$CFG_DIR"
printf '%s\n' "$WORKER_URL" > "$API_FILE"
echo ""
echo "Saved your private Worker URL to: $API_FILE"
echo "Worker URL: $WORKER_URL"
echo "From now on, scripts/publish-site.sh will publish to your own Cloudflare Worker automatically."
