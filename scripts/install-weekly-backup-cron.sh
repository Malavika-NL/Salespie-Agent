#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKUP_SCRIPT="$ROOT_DIR/scripts/backup-postgres.sh"
LOG_FILE="${BACKUP_LOG_FILE:-$ROOT_DIR/backups/backup-cron.log}"
CRON_SCHEDULE="${CRON_SCHEDULE:-0 2 * * 0}"

mkdir -p "$(dirname "$LOG_FILE")"
touch "$LOG_FILE"
chmod +x "$BACKUP_SCRIPT"

CRON_ENTRY="$CRON_SCHEDULE cd $ROOT_DIR && $BACKUP_SCRIPT >> $LOG_FILE 2>&1"

TMP_CRON="$(mktemp)"
crontab -l 2>/dev/null | grep -v "$BACKUP_SCRIPT" > "$TMP_CRON" || true
echo "$CRON_ENTRY" >> "$TMP_CRON"
crontab "$TMP_CRON"
rm -f "$TMP_CRON"

echo "Installed cron job:"
echo "$CRON_ENTRY"
