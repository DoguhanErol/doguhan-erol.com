#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
# shellcheck source=compose.sh
source scripts/compose.sh

COMPOSE_FILES="-f docker-compose.yml -f docker-compose.prod.yml"
# Qrivo ile aynı makinede ayrı volume ve ağ adı.
export COMPOSE_PROJECT_NAME=doguhan-portfolio

if [[ ! -f .env ]]; then
  cp .env.production.example .env
  echo "→ .env oluşturuldu — domain ve secret değerlerini düzenleyip tekrar çalıştırın:"
  echo "  nano .env"
  exit 1
fi

# shellcheck disable=SC1091
source .env

if [[ "${AUTH_SECRET:-}" == *"change-me"* ]] || [[ ${#AUTH_SECRET} -lt 32 ]]; then
  echo "HATA: .env içinde AUTH_SECRET en az 32 karakter olmalı (change-me olmamalı)"
  exit 1
fi

if [[ "${NEXT_PUBLIC_ROOT_DOMAIN:-}" == *"localhost"* ]] || [[ -z "${NEXT_PUBLIC_ROOT_DOMAIN:-}" ]]; then
  echo "HATA: NEXT_PUBLIC_ROOT_DOMAIN gerçek domain olmalı (ör. doguhan-erol.com)"
  exit 1
fi

if [[ "${NEXTAUTH_URL:-}" != https://* ]]; then
  echo "HATA: NEXTAUTH_URL https:// ile başlamalı"
  exit 1
fi

if [[ "${POSTGRES_PASSWORD:-}" == *"change-me"* ]] || [[ ${#POSTGRES_PASSWORD} -lt 12 ]]; then
  echo "HATA: POSTGRES_PASSWORD en az 12 karakter olmalı (change-me olmamalı)"
  exit 1
fi

if [[ "${MINIO_SECRET_KEY:-}" == *"change-me"* ]] || [[ ${#MINIO_SECRET_KEY} -lt 12 ]]; then
  echo "HATA: MINIO_SECRET_KEY en az 12 karakter olmalı (change-me olmamalı)"
  exit 1
fi

if [[ "${SEED_ADMIN_PASSWORD:-}" == *"change-me"* ]] || [[ ${#SEED_ADMIN_PASSWORD} -lt 8 ]]; then
  echo "HATA: SEED_ADMIN_PASSWORD en az 8 karakter olmalı ve change-me içermemeli"
  echo "      Bu değer yalnızca ilk hesap oluşturmada kullanılır."
  exit 1
fi

if [[ "$COMPOSE" == podman* ]]; then
  podman network exists web-edge || podman network create web-edge
else
  docker network inspect web-edge >/dev/null 2>&1 || docker network create web-edge
fi

echo "→ VPS deploy başlıyor (${NEXT_PUBLIC_ROOT_DOMAIN}, $COMPOSE)..."
# Önce DB, sonra şema; app yeni kolonları SELECT etmeden önce db push bitsin.
# shellcheck disable=SC2086
compose $COMPOSE_FILES up -d db minio

echo "→ Veritabanı hazırlanıyor..."
# shellcheck disable=SC2086
compose $COMPOSE_FILES --profile init run --rm --build init-db

echo "→ Uygulama yeniden derleniyor..."
# shellcheck disable=SC2086
compose $COMPOSE_FILES up -d --build

echo "→ MinIO bucket hazırlanıyor..."
# shellcheck disable=SC2086
compose $COMPOSE_FILES --profile init run --rm minio-init

echo "→ Qrivo Caddy'sine domain bağlanıyor..."
if bash scripts/attach-edge.sh; then
  echo "✓ https://${NEXT_PUBLIC_ROOT_DOMAIN} Caddy tarafında açık"
else
  echo "Uygulama ayakta, domain henüz Caddy'ye yazılmadı."
  echo "DNS bu sunucuyu gösterince tekrar: bash scripts/attach-edge.sh"
fi
echo "  Admin:  https://${NEXT_PUBLIC_ROOT_DOMAIN}/admin"
echo "  Giriş:  ${SEED_ADMIN_USERNAME:-doguhan} veya ${SEED_ADMIN_EMAIL:-e-posta}"
