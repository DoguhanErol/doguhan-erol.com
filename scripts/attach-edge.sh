#!/usr/bin/env bash
# Qrivo'nun çalışan Caddy'sine doguhan-erol.com kurallarını ekler.
# qrivo.online bloklarına dokunmaz. Kural zaten varsa yalnız ağı bağlar.
set -euo pipefail

cd "$(dirname "$0")/.."

SNIPPET="deploy/caddy-site.caddy"
MARKER="doguhan-erol.com"

if [[ ! -f "$SNIPPET" ]]; then
  echo "HATA: $SNIPPET yok" >&2
  exit 1
fi

if ! docker network inspect web-edge >/dev/null 2>&1; then
  echo "HATA: web-edge ağı yok. Önce bash scripts/vps.sh" >&2
  exit 1
fi

matches=()
while IFS= read -r name; do
  [[ -z "$name" ]] && continue
  src=$(docker inspect "$name" --format '{{range .Mounts}}{{if eq .Destination "/etc/caddy/Caddyfile"}}{{.Source}}{{end}}{{end}}')
  [[ -z "$src" || ! -f "$src" ]] && continue
  if grep -q "caddy-ask" "$src"; then
    matches+=("$name|$src")
  fi
done < <(docker ps --format '{{.Names}} {{.Image}}' | awk '$2 ~ /caddy/ {print $1}')

if [[ ${#matches[@]} -ne 1 ]]; then
  echo "HATA: qrivo Caddy dosyası tek konteynerde bulunamadı (${#matches[@]} aday)." >&2
  echo "      deploy/caddy-site.caddy bloklarını elle ekle, sonra: docker exec <caddy> caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile" >&2
  exit 2
fi

name="${matches[0]%%|*}"
src="${matches[0]#*|}"

if ! docker inspect "$name" --format '{{json .NetworkSettings.Networks}}' | grep -q '"web-edge"'; then
  echo "→ $name web-edge ağına bağlanıyor"
  docker network connect web-edge "$name"
fi

if grep -q "$MARKER" "$src"; then
  echo "→ $MARKER kuralı zaten var: $src"
else
  echo "→ Kural ekleniyor: $src"
  cp "$src" "$src.bak.portfolio"
  printf '\n' >> "$src"
  cat "$SNIPPET" >> "$src"
fi

if docker exec "$name" caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile; then
  echo "✓ Caddy yeniden yüklendi ($name)"
  exit 0
fi

echo "HATA: Caddy reload olmadı. Yedek geri alınıyor." >&2
if [[ -f "$src.bak.portfolio" ]]; then
  cp "$src.bak.portfolio" "$src"
  docker exec "$name" caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile || true
fi
exit 1
