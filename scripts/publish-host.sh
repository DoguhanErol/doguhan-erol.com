#!/usr/bin/env bash
# 443'ü dinleyen Caddy'ye yalnız bu sitenin alan adını ekler.
# O konteyneri durdurmaz, eski ağından koparmaz, 80/443'ü üzerine almaz.
set -euo pipefail

cd "$(dirname "$0")/.."

if [[ ! -f .env ]]; then
  echo "HATA: .env yok. Önce bash scripts/vps.sh" >&2
  exit 1
fi

# shellcheck disable=SC1091
set -a
source .env
set +a

DOMAIN="${NEXT_PUBLIC_ROOT_DOMAIN:-}"
if [[ ! "$DOMAIN" =~ ^[a-z0-9]([a-z0-9.-]*[a-z0-9])?$ ]]; then
  echo "HATA: NEXT_PUBLIC_ROOT_DOMAIN yalnız harf, rakam, nokta ve tire olabilir." >&2
  exit 1
fi

if ! command -v python3 >/dev/null 2>&1; then
  echo "HATA: python3 yok." >&2
  exit 1
fi

for container in doguhan-portfolio-app doguhan-portfolio-minio; do
  if ! docker inspect "$container" >/dev/null 2>&1; then
    echo "HATA: $container yok. Önce bash scripts/vps.sh" >&2
    exit 1
  fi
done

if ! docker network inspect web-edge >/dev/null 2>&1; then
  docker network create web-edge >/dev/null
fi

# Compose servis adı "app" / "minio" bu ağa düşmesin. Kısa ad Qrivo'ya aittir.
attach_by_container_name() {
  local container="$1"
  docker network disconnect web-edge "$container" >/dev/null 2>&1 || true
  docker network connect web-edge "$container"
}

attach_by_container_name doguhan-portfolio-app
attach_by_container_name doguhan-portfolio-minio

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
  echo "HATA: 443'teki Caddy tek başına bulunamadı (${#matches[@]} aday)." >&2
  echo "      Qrivo konteynerleri durdurulmadı." >&2
  exit 2
fi

name="${matches[0]%%|*}"
src="${matches[0]#*|}"

before_nets=$(docker inspect "$name" --format '{{range $k, $v := .NetworkSettings.Networks}}{{$k}} {{end}}')
if ! docker inspect "$name" --format '{{json .NetworkSettings.Networks}}' | grep -q '"web-edge"'; then
  echo "→ $name web-edge ağına bağlanıyor"
  docker network connect web-edge "$name"
fi
after_nets=$(docker inspect "$name" --format '{{range $k, $v := .NetworkSettings.Networks}}{{$k}} {{end}}')
for net in $before_nets; do
  if [[ " $after_nets " != *" $net "* ]]; then
    echo "HATA: $name eski ağı $net kaybetti. Qrivo tarafına başka işlem yapılmadı." >&2
    exit 1
  fi
done

backup="/tmp/caddyfile.portfolio.bak"
cp "$src" "$backup"

set +e
result=$(python3 - "$src" "$DOMAIN" <<'PY'
import pathlib, re, sys
path, domain = sys.argv[1:]
if not re.fullmatch(r"[a-z0-9]([a-z0-9.-]*[a-z0-9])?", domain):
    raise SystemExit("alan adı geçersiz")
text = pathlib.Path(path).read_text()
begin = "# BEGIN doguhan-erol"
end = "# END doguhan-erol"
block = (
    f"{begin}\n"
    f"www.{domain} {{\n"
    f"\tredir https://{domain}{{uri}} permanent\n"
    "}\n\n"
    f"files.{domain} {{\n"
    "\treverse_proxy doguhan-portfolio-minio:9000\n"
    "}\n\n"
    f"{domain} {{\n"
    "\treverse_proxy doguhan-portfolio-app:3000\n"
    "}\n"
    f"{end}\n"
)

hosts = {f"www.{domain}", f"files.{domain}", domain}

def strip_block(value: str) -> str:
    start = value.find(begin)
    if start == -1:
        return value
    stop = value.find(end, start)
    if stop == -1:
        raise SystemExit("BEGIN var, END yok; dosyaya yazılmadı")
    stop = value.find("\n", stop)
    stop = len(value) if stop == -1 else stop + 1
    return value[:start] + value[stop:]

def bare_host(address: str) -> str:
    address = address.strip().replace("https://", "").replace("http://", "")
    return address.split("/", 1)[0].split(":", 1)[0]

def remove_our_sites(value: str) -> str:
    lines = value.splitlines(keepends=True)
    out = []
    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()
        if stripped.endswith("{") and stripped != "{" and not line.startswith((" ", "\t")):
            addrs = [bare_host(part) for part in stripped[:-1].split(",")]
            if any(addr in hosts for addr in addrs) and not all(addr in hosts for addr in addrs):
                raise SystemExit("alan adı Qrivo kuralıyla aynı satırda; dosyaya yazılmadı")
            if addrs and all(addr in hosts for addr in addrs):
                depth = line.count("{") - line.count("}")
                i += 1
                while i < len(lines) and depth > 0:
                    depth += lines[i].count("{") - lines[i].count("}")
                    i += 1
                continue
        out.append(line)
        i += 1
    return "".join(out)

base = remove_our_sites(strip_block(text))
if "caddy-ask" not in base:
    raise SystemExit("caddy-ask kayboldu; dosyaya yazılmadı")
new = base.rstrip() + "\n\n" + block
if remove_our_sites(strip_block(new)).rstrip() != base.rstrip():
    raise SystemExit("mevcut kurallar değişti; dosyaya yazılmadı")
for host in sorted(hosts):
    count = len(re.findall(rf"(?m)^{re.escape(host)} \{{$", new))
    if count != 1:
        raise SystemExit(f"{host} {count} kez; dosyaya yazılmadı")
if new == text:
    print("unchanged")
else:
    pathlib.Path(path).write_text(new)
    print("updated")
PY
)
status=$?
set -e

if [[ $status -ne 0 ]]; then
  cp "$backup" "$src"
  echo "HATA: Caddy dosyası aynı bırakıldı. Qrivo kuralları duruyor." >&2
  exit 1
fi

if [[ "$result" == "unchanged" ]]; then
  echo "→ $DOMAIN kuralı zaten duruyor ($name)"
  exit 0
fi

if [[ "$result" != "updated" ]]; then
  cp "$backup" "$src"
  echo "HATA: Caddy dosyası güncellenmedi ($result). Qrivo kuralları duruyor." >&2
  exit 1
fi

echo "→ $DOMAIN kuralı yazılıyor: $src"
if docker exec "$name" caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile; then
  echo "✓ Caddy yeniden yüklendi ($name). Eski siteler aynı dosyada duruyor."
  exit 0
fi

echo "HATA: Caddy reload olmadı. Dosya yedekten geri konuyor." >&2
cp "$backup" "$src"
docker exec "$name" caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile || true
exit 1
