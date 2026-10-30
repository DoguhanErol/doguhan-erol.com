#!/usr/bin/env bash
# Detect available compose command (docker compose plugin, docker-compose v1, podman compose)

detect_compose() {
  if docker compose version &>/dev/null 2>&1; then
    echo "docker compose"
  elif command -v docker-compose &>/dev/null && docker-compose version &>/dev/null 2>&1; then
    echo "docker-compose"
  elif command -v podman &>/dev/null && podman compose version &>/dev/null 2>&1; then
    echo "podman compose"
  else
    echo ""
  fi
}

COMPOSE=$(detect_compose)

check_docker_access() {
  if [[ "$COMPOSE" == podman* ]]; then
    podman info &>/dev/null && return 0
  elif [[ -S /var/run/docker.sock ]]; then
    docker info &>/dev/null && return 0
  fi
  return 1
}

if [[ -z "$COMPOSE" ]]; then
  echo "HATA: Docker Compose bulunamadı." >&2
  echo "" >&2
  echo "Fedora/RHEL:" >&2
  echo "  sudo dnf install docker-compose-plugin" >&2
  echo "  sudo systemctl enable --now docker" >&2
  echo "" >&2
  echo "Alternatif:" >&2
  echo "  sudo dnf install docker-compose" >&2
  exit 1
fi

if ! check_docker_access; then
  echo "HATA: Docker'a erişim yok (permission denied)." >&2
  echo "" >&2
  echo "Kullanıcıyı docker grubuna ekle:" >&2
  echo "  sudo usermod -aG docker \$USER" >&2
  echo "  newgrp docker    # veya oturumu kapat/aç" >&2
  echo "" >&2
  echo "Docker servisi çalışıyor mu kontrol et:" >&2
  echo "  sudo systemctl enable --now docker" >&2
  exit 1
fi

compose() {
  # shellcheck disable=SC2086
  $COMPOSE "$@"
}
