#!/usr/bin/env bash
#
# WAHEED.in — database backup
# ---------------------------------------------------------------------------
# Dumps the full `waheed` MySQL database to a gzipped, timestamped file under
# backend/storage/backups/ (gitignored). Credentials are read from backend/.env
# and passed via a temporary 0600 defaults-file so the password never appears
# in `ps`. Backups older than RETENTION_DAYS are pruned.
#
# Run manually:
#   bash backend/scripts/backup-db.sh
#
# Schedule nightly (crontab -e), 3:15am, logging to storage/logs:
#   15 3 * * * /usr/bin/bash /var/www/waheed.in/backend/scripts/backup-db.sh >> /var/www/waheed.in/backend/storage/logs/backup.log 2>&1
#
# Restore a backup (DESTRUCTIVE — overwrites current data):
#   gunzip -c backend/storage/backups/waheed-YYYYMMDD-HHMMSS.sql.gz \
#     | mysql --defaults-extra-file=<creds> waheed
#   (or use the same env creds: mysql -u USER -p waheed < dump.sql)
# ---------------------------------------------------------------------------
set -euo pipefail

RETENTION_DAYS=14

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$BACKEND_DIR/.env"
BACKUP_DIR="$BACKEND_DIR/storage/backups"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "error: $ENV_FILE not found" >&2
  exit 1
fi

# Read a KEY from .env, stripping surrounding quotes and inline comments.
env_get() {
  local key="$1"
  local line
  line="$(grep -E "^${key}=" "$ENV_FILE" | tail -1 || true)"
  line="${line#*=}"
  line="${line%$'\r'}"
  # strip matching single/double quotes
  if [[ "$line" == \"*\" ]]; then line="${line%\"}"; line="${line#\"}"; fi
  if [[ "$line" == \'*\' ]]; then line="${line%\'}"; line="${line#\'}"; fi
  printf '%s' "$line"
}

DB_HOST="$(env_get DB_HOST)";     DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PORT="$(env_get DB_PORT)";     DB_PORT="${DB_PORT:-3306}"
DB_NAME="$(env_get DB_DATABASE)"
DB_USER="$(env_get DB_USERNAME)"
DB_PASS="$(env_get DB_PASSWORD)"

if [[ -z "$DB_NAME" || -z "$DB_USER" ]]; then
  echo "error: DB_DATABASE / DB_USERNAME missing from .env" >&2
  exit 1
fi

mkdir -p "$BACKUP_DIR"
chmod 700 "$BACKUP_DIR" 2>/dev/null || true

# Temp defaults-file keeps the password out of the process list.
CRED_FILE="$(mktemp)"
chmod 600 "$CRED_FILE"
trap 'rm -f "$CRED_FILE"' EXIT
cat > "$CRED_FILE" <<EOF
[client]
host=$DB_HOST
port=$DB_PORT
user=$DB_USER
password=$DB_PASS
EOF

STAMP="$(date +%Y%m%d-%H%M%S)"
OUT="$BACKUP_DIR/waheed-$STAMP.sql.gz"

mysqldump --defaults-extra-file="$CRED_FILE" \
  --single-transaction --quick --no-tablespaces \
  --routines --triggers \
  "$DB_NAME" | gzip -c > "$OUT"
chmod 600 "$OUT"

echo "backup written: $OUT ($(du -h "$OUT" | cut -f1))"

# Prune old backups.
find "$BACKUP_DIR" -name 'waheed-*.sql.gz' -type f -mtime "+$RETENTION_DAYS" -print -delete \
  | sed 's/^/pruned: /' || true
