#!/usr/bin/env bash
# Start static server for a generated site and print desktop + phone URLs.
# Usage: ./scripts/serve.sh /path/to/site [port]
set -euo pipefail
SITE="${1:?Usage: $0 /path/to/site [port]}"
PORT="${2:-8766}"
SITE="$(cd "$SITE" && pwd)"
cd "$SITE"

if ! [[ "$PORT" =~ ^[0-9]+$ ]]; then
  echo "Invalid port: $PORT" >&2
  exit 1
fi

echo "Serving: $SITE"
echo "Desktop: http://127.0.0.1:${PORT}/"
echo "Phone (same Wi-Fi), try:"
if command -v ipconfig >/dev/null 2>&1; then
  ipconfig getifaddr en0 2>/dev/null | while read -r ip; do echo "  http://${ip}:${PORT}/"; done || true
  ipconfig getifaddr en1 2>/dev/null | while read -r ip; do echo "  http://${ip}:${PORT}/"; done || true
fi
if command -v hostname >/dev/null 2>&1; then
  hostname -I 2>/dev/null | tr ' ' '\n' | while read -r ip; do
    [[ -n "$ip" ]] && echo "  http://${ip}:${PORT}/"
  done || true
fi
echo "(If no LAN IP printed, check Wi-Fi settings on this machine.)"
echo "Agent: give the user the Desktop URL above — do not stop at the folder path only."
exec python3 -m http.server "$PORT" --bind 0.0.0.0
