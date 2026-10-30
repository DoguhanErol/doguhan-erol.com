#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
# shellcheck source=compose.sh
source scripts/compose.sh

COMPOSE_FILES="-f docker-compose.yml -f docker-compose.local.yml"
# Yalnız bu bilgisayar. Canlıdaki klasör kendi hacim adını kullanır.
export COMPOSE_PROJECT_NAME=doguhan-portfolio

if [[ ! -f .env ]]; then
  cp .env.example .env
  echo "→ .env oluşturuldu (.env.example kopyalandı)"
fi

echo "→ Docker servisleri başlatılıyor ($COMPOSE)..."
# shellcheck disable=SC2086
compose $COMPOSE_FILES up -d db minio

echo "→ Veritabanı hazırlanıyor (Docker ağı: db:5432)..."
# shellcheck disable=SC2086
compose $COMPOSE_FILES --profile init run --rm --build init-db

echo "→ Uygulama derleniyor..."
# shellcheck disable=SC2086
compose $COMPOSE_FILES up -d --build

echo "→ MinIO bucket hazırlanıyor..."
# shellcheck disable=SC2086
compose $COMPOSE_FILES --profile init run --rm minio-init

echo ""
echo "✓ Lokal ortam hazır"
echo "  Site:   http://localhost:3010"
echo "  Admin:  http://localhost:3010/admin"
echo "  Giriş:  doguhan / admin123"
echo "  MinIO:  http://localhost:9011 (minioadmin / minioadmin)"
