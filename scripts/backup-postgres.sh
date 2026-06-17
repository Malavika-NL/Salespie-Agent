#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

BACKUP_DIR="${BACKUP_DIR:-$ROOT_DIR/backups}"
BACKUP_PREFIX="${BACKUP_PREFIX:-salespie_postgres}"
DB_SERVICE="${DB_SERVICE:-db}"
DB_NAME="${DB_NAME:-salescrm}"
DB_USER="${DB_USER:-salespie}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-90}"
TIMESTAMP="$(date +"%Y-%m-%d_%H-%M-%S")"
OUTPUT_FILE="$BACKUP_DIR/${BACKUP_PREFIX}_${TIMESTAMP}.sql.gz"

mkdir -p "$BACKUP_DIR"

echo "Creating PostgreSQL backup at $OUTPUT_FILE"
docker compose exec -T "$DB_SERVICE" pg_dump -U "$DB_USER" -d "$DB_NAME" | gzip > "$OUTPUT_FILE"

echo "Backup complete"

if [[ "$RETENTION_DAYS" =~ ^[0-9]+$ ]] && [[ "$RETENTION_DAYS" -gt 0 ]]; then
  find "$BACKUP_DIR" -type f -name "${BACKUP_PREFIX}_*.sql.gz" -mtime +"$RETENTION_DAYS" -delete
  echo "Deleted backups older than $RETENTION_DAYS days"
fi
