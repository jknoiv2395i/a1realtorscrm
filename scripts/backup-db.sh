#!/usr/bin/env bash
# =============================================================================
# A1 Real Estate CRM — Automated Database Backup Script
# =============================================================================
# Usage:
#   ./scripts/backup-db.sh                         # Backs up using .env.local DATABASE_URL
#   DATABASE_URL="postgresql://..." ./scripts/backup-db.sh   # Explicit URL override
#
# Output:
#   backups/a1_crm_backup_YYYYMMDD_HHMMSS.sql.gz
#
# Cron (daily at 02:00 AM IST):
#   0 20 * * * cd /path/to/a1-crm && ./scripts/backup-db.sh >> logs/backup.log 2>&1
# =============================================================================

set -euo pipefail

# ── Colours ───────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="$PROJECT_ROOT/backups"
LOG_DIR="$PROJECT_ROOT/logs"
RETENTION_DAYS=14

# ── Load DATABASE_URL from .env.local if not already set ──────────────────────
if [[ -z "${DATABASE_URL:-}" ]]; then
  ENV_FILE="$PROJECT_ROOT/.env.local"
  if [[ -f "$ENV_FILE" ]]; then
    export DATABASE_URL=$(grep -E "^DATABASE_URL=" "$ENV_FILE" | cut -d '=' -f2- | tr -d '"')
  fi
fi

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo -e "${RED}[ERROR]${RESET} DATABASE_URL is not set. Provide it via .env.local or environment."
  exit 1
fi

# ── Parse connection components from DATABASE_URL ─────────────────────────────
# Format: postgresql://USER:PASSWORD@HOST:PORT/DBNAME?params
DB_USER=$(echo "$DATABASE_URL" | sed -n 's|.*://\([^:]*\):.*|\1|p')
DB_HOST=$(echo "$DATABASE_URL" | sed -n 's|.*@\([^:]*\):.*|\1|p')
DB_PORT=$(echo "$DATABASE_URL" | sed -n 's|.*:\([0-9]*\)/.*|\1|p')
DB_NAME=$(echo "$DATABASE_URL" | sed -n 's|.*/\([^?]*\).*|\1|p')
DB_PASS=$(echo "$DATABASE_URL" | sed -n 's|.*://[^:]*:\([^@]*\)@.*|\1|p')

# ── Prepare directories ───────────────────────────────────────────────────────
mkdir -p "$BACKUP_DIR"
mkdir -p "$LOG_DIR"

# ── Generate timestamped filename ─────────────────────────────────────────────
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILENAME="a1_crm_backup_${TIMESTAMP}.sql.gz"
BACKUP_PATH="$BACKUP_DIR/$BACKUP_FILENAME"
CHECKSUM_PATH="$BACKUP_DIR/${BACKUP_FILENAME}.sha256"

# ── Begin backup ──────────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}${CYAN}════════════════════════════════════════════════════════${RESET}"
echo -e "${BOLD}${CYAN}  A1 CRM — Automated Database Backup${RESET}"
echo -e "${BOLD}${CYAN}════════════════════════════════════════════════════════${RESET}"
echo -e "  ${BOLD}Timestamp:${RESET}   $(date '+%Y-%m-%d %H:%M:%S %Z')"
echo -e "  ${BOLD}Database:${RESET}    $DB_NAME @ $DB_HOST:$DB_PORT"
echo -e "  ${BOLD}Output:${RESET}      $BACKUP_PATH"
echo ""

START_TIME=$(date +%s)

echo -e "${YELLOW}[1/4]${RESET} Running pg_dump and compressing snapshot..."

# Run pg_dump piped directly into gzip for memory-efficient streaming compression
PGPASSWORD="$DB_PASS" pg_dump \
  --host="$DB_HOST" \
  --port="$DB_PORT" \
  --username="$DB_USER" \
  --dbname="$DB_NAME" \
  --format=plain \
  --no-password \
  --verbose \
  --schema=public \
  2>>"$LOG_DIR/backup_verbose_${TIMESTAMP}.log" \
| gzip -9 > "$BACKUP_PATH"

if [[ ! -f "$BACKUP_PATH" ]] || [[ ! -s "$BACKUP_PATH" ]]; then
  echo -e "${RED}[ERROR]${RESET} Backup file is empty or missing. Aborting."
  exit 1
fi

echo -e "${GREEN}[✅ 1/4]${RESET} pg_dump completed and compressed."

# ── Generate SHA-256 checksum ─────────────────────────────────────────────────
echo -e "${YELLOW}[2/4]${RESET} Generating SHA-256 integrity checksum..."
shasum -a 256 "$BACKUP_PATH" > "$CHECKSUM_PATH"
echo -e "${GREEN}[✅ 2/4]${RESET} Checksum written: $(cat "$CHECKSUM_PATH" | awk '{print $1}')"

# ── Cleanup old backups > RETENTION_DAYS ─────────────────────────────────────
echo -e "${YELLOW}[3/4]${RESET} Cleaning backups older than ${RETENTION_DAYS} days..."
DELETED_COUNT=0
while IFS= read -r old_file; do
  rm -f "$old_file" "${old_file}.sha256"
  echo -e "  ${RED}[DELETED]${RESET} $(basename "$old_file")"
  ((DELETED_COUNT++))
done < <(find "$BACKUP_DIR" -name "a1_crm_backup_*.sql.gz" -mtime +${RETENTION_DAYS} 2>/dev/null)

if [[ $DELETED_COUNT -eq 0 ]]; then
  echo -e "  ${GREEN}No expired backups found.${RESET}"
else
  echo -e "  ${GREEN}Removed ${DELETED_COUNT} expired backup(s).${RESET}"
fi
echo -e "${GREEN}[✅ 3/4]${RESET} Cleanup complete."

# ── Summary Report ────────────────────────────────────────────────────────────
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
FILESIZE=$(du -sh "$BACKUP_PATH" | cut -f1)
BACKUP_COUNT=$(find "$BACKUP_DIR" -name "a1_crm_backup_*.sql.gz" | wc -l | tr -d ' ')

echo -e "${YELLOW}[4/4]${RESET} Writing backup manifest..."
MANIFEST="$BACKUP_DIR/backup_manifest.log"
echo "[$(date '+%Y-%m-%d %H:%M:%S')] BACKUP OK | file=${BACKUP_FILENAME} | size=${FILESIZE} | duration=${DURATION}s | host=${DB_HOST} | db=${DB_NAME}" >> "$MANIFEST"
echo -e "${GREEN}[✅ 4/4]${RESET} Manifest updated."

echo ""
echo -e "${BOLD}${GREEN}════════════════════════════════════════════════════════${RESET}"
echo -e "${BOLD}${GREEN}  ✅ BACKUP SUCCESSFUL${RESET}"
echo -e "${BOLD}${GREEN}════════════════════════════════════════════════════════${RESET}"
echo -e "  ${BOLD}File:${RESET}         $BACKUP_FILENAME"
echo -e "  ${BOLD}Size:${RESET}         $FILESIZE (gzip -9 compressed)"
echo -e "  ${BOLD}Duration:${RESET}     ${DURATION}s"
echo -e "  ${BOLD}Total Backups:${RESET} ${BACKUP_COUNT} stored (${RETENTION_DAYS}-day retention)"
echo -e "  ${BOLD}Checksum:${RESET}     $(cat "$CHECKSUM_PATH" | awk '{print $1}')"
echo ""
echo -e "  To restore this backup, run:"
echo -e "  ${CYAN}./scripts/restore-db.sh backups/$BACKUP_FILENAME${RESET}"
echo -e "${BOLD}${GREEN}════════════════════════════════════════════════════════${RESET}"
echo ""
