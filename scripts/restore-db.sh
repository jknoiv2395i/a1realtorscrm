#!/usr/bin/env bash
# =============================================================================
# A1 Real Estate CRM — Automated Database Restore Script
# =============================================================================
# Usage:
#   ./scripts/restore-db.sh backups/a1_crm_backup_20260825_023000.sql.gz
#
# Safety:
#   - Verifies SHA-256 checksum before restoring (if .sha256 file exists)
#   - Creates a pre-restore safety snapshot of the current live DB
#   - Prompts for explicit confirmation before destructive operations
#   - Logs all restore activity to logs/restore_TIMESTAMP.log
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
LOG_DIR="$PROJECT_ROOT/logs"
BACKUP_DIR="$PROJECT_ROOT/backups"

# ── Validate argument ─────────────────────────────────────────────────────────
if [[ $# -lt 1 ]]; then
  echo -e "${RED}[ERROR]${RESET} No backup file specified."
  echo -e "  Usage: ./scripts/restore-db.sh <path-to-backup.sql.gz>"
  echo ""
  echo -e "  Available backups:"
  find "$BACKUP_DIR" -name "a1_crm_backup_*.sql.gz" -exec basename {} \; 2>/dev/null | sort -r | head -10 | while read f; do
    echo -e "    ${CYAN}backups/$f${RESET}"
  done
  exit 1
fi

BACKUP_FILE="$1"

# Support both relative and absolute paths
if [[ ! "$BACKUP_FILE" = /* ]]; then
  BACKUP_FILE="$PROJECT_ROOT/$BACKUP_FILE"
fi

if [[ ! -f "$BACKUP_FILE" ]]; then
  echo -e "${RED}[ERROR]${RESET} Backup file not found: $BACKUP_FILE"
  exit 1
fi

# ── Load DATABASE_URL ─────────────────────────────────────────────────────────
if [[ -z "${DATABASE_URL:-}" ]]; then
  ENV_FILE="$PROJECT_ROOT/.env.local"
  if [[ -f "$ENV_FILE" ]]; then
    export DATABASE_URL=$(grep -E "^DATABASE_URL=" "$ENV_FILE" | cut -d '=' -f2- | tr -d '"')
  fi
fi

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo -e "${RED}[ERROR]${RESET} DATABASE_URL is not set."
  exit 1
fi

# ── Parse connection components ───────────────────────────────────────────────
DB_USER=$(echo "$DATABASE_URL" | sed -n 's|.*://\([^:]*\):.*|\1|p')
DB_HOST=$(echo "$DATABASE_URL" | sed -n 's|.*@\([^:]*\):.*|\1|p')
DB_PORT=$(echo "$DATABASE_URL" | sed -n 's|.*:\([0-9]*\)/.*|\1|p')
DB_NAME=$(echo "$DATABASE_URL" | sed -n 's|.*/\([^?]*\).*|\1|p')
DB_PASS=$(echo "$DATABASE_URL" | sed -n 's|.*://[^:]*:\([^@]*\)@.*|\1|p')

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
RESTORE_LOG="$LOG_DIR/restore_${TIMESTAMP}.log"
mkdir -p "$LOG_DIR"

BACKUP_FILENAME=$(basename "$BACKUP_FILE")
CHECKSUM_FILE="${BACKUP_FILE}.sha256"

echo ""
echo -e "${BOLD}${CYAN}════════════════════════════════════════════════════════${RESET}"
echo -e "${BOLD}${CYAN}  A1 CRM — Database Restore Pipeline${RESET}"
echo -e "${BOLD}${CYAN}════════════════════════════════════════════════════════${RESET}"
echo -e "  ${BOLD}Restore File:${RESET}  $BACKUP_FILENAME"
echo -e "  ${BOLD}Target DB:${RESET}     $DB_NAME @ $DB_HOST:$DB_PORT"
echo -e "  ${BOLD}Log:${RESET}           $RESTORE_LOG"
echo ""

# ── Step 1: Verify SHA-256 checksum ──────────────────────────────────────────
echo -e "${YELLOW}[1/4]${RESET} Verifying file integrity (SHA-256)..."
if [[ -f "$CHECKSUM_FILE" ]]; then
  STORED_HASH=$(awk '{print $1}' "$CHECKSUM_FILE")
  CURRENT_HASH=$(shasum -a 256 "$BACKUP_FILE" | awk '{print $1}')
  if [[ "$STORED_HASH" == "$CURRENT_HASH" ]]; then
    echo -e "${GREEN}[✅ 1/4]${RESET} Checksum verified: $CURRENT_HASH"
  else
    echo -e "${RED}[❌ ABORT]${RESET} Checksum mismatch! File may be corrupted."
    echo -e "  Expected: $STORED_HASH"
    echo -e "  Got:      $CURRENT_HASH"
    exit 1
  fi
else
  echo -e "${YELLOW}[⚠️  1/4]${RESET} No checksum file found — skipping integrity check."
fi

# ── Step 2: Safety pre-restore snapshot ───────────────────────────────────────
echo -e "${YELLOW}[2/4]${RESET} Creating safety pre-restore snapshot of current live DB..."
SAFETY_BACKUP="$BACKUP_DIR/a1_crm_PRE_RESTORE_${TIMESTAMP}.sql.gz"
PGPASSWORD="$DB_PASS" pg_dump \
  --host="$DB_HOST" \
  --port="$DB_PORT" \
  --username="$DB_USER" \
  --dbname="$DB_NAME" \
  --format=plain \
  --no-password \
  --schema=public \
  2>>"$RESTORE_LOG" \
| gzip -9 > "$SAFETY_BACKUP"
echo -e "${GREEN}[✅ 2/4]${RESET} Safety snapshot saved: $(basename "$SAFETY_BACKUP")"

# ── Step 3: Confirm destructive restore ───────────────────────────────────────
echo ""
echo -e "${RED}${BOLD}⚠️  WARNING: This will REPLACE all data in '$DB_NAME' on $DB_HOST${RESET}"
echo -e "${RED}${BOLD}   A pre-restore safety snapshot has been saved above.${RESET}"
echo ""
read -r -p "$(echo -e "${YELLOW}Type 'RESTORE' to confirm, or press ENTER to cancel: ${RESET}")" CONFIRM

if [[ "$CONFIRM" != "RESTORE" ]]; then
  echo -e "${YELLOW}[CANCELLED]${RESET} Restore aborted. No changes were made."
  echo -e "  Safety snapshot retained: $(basename "$SAFETY_BACKUP")"
  exit 0
fi

# ── Step 4: Decompress and restore ────────────────────────────────────────────
echo ""
echo -e "${YELLOW}[3/4]${RESET} Decompressing and restoring backup to Supabase..."
START_TIME=$(date +%s)

gunzip -c "$BACKUP_FILE" | PGPASSWORD="$DB_PASS" psql \
  --host="$DB_HOST" \
  --port="$DB_PORT" \
  --username="$DB_USER" \
  --dbname="$DB_NAME" \
  --no-password \
  2>>"$RESTORE_LOG"

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo -e "${GREEN}[✅ 3/4]${RESET} Restore pipeline completed in ${DURATION}s."

# ── Step 5: Log the restore event ─────────────────────────────────────────────
MANIFEST="$BACKUP_DIR/backup_manifest.log"
echo "[$(date '+%Y-%m-%d %H:%M:%S')] RESTORE OK | source=${BACKUP_FILENAME} | safety_snap=$(basename "$SAFETY_BACKUP") | duration=${DURATION}s | host=${DB_HOST} | db=${DB_NAME}" >> "$MANIFEST"
echo -e "${GREEN}[✅ 4/4]${RESET} Restore event logged to manifest."

echo ""
echo -e "${BOLD}${GREEN}════════════════════════════════════════════════════════${RESET}"
echo -e "${BOLD}${GREEN}  ✅ DATABASE RESTORE SUCCESSFUL${RESET}"
echo -e "${BOLD}${GREEN}════════════════════════════════════════════════════════${RESET}"
echo -e "  ${BOLD}Source:${RESET}         $BACKUP_FILENAME"
echo -e "  ${BOLD}Duration:${RESET}       ${DURATION}s"
echo -e "  ${BOLD}Safety Backup:${RESET}  $(basename "$SAFETY_BACKUP")"
echo -e "  ${BOLD}Restore Log:${RESET}    $RESTORE_LOG"
echo ""
echo -e "  Next steps:"
echo -e "  ${CYAN}npm run db:generate${RESET}   → Regenerate Prisma client"
echo -e "  ${CYAN}npm run dev${RESET}            → Verify CRM data is intact"
echo -e "${BOLD}${GREEN}════════════════════════════════════════════════════════${RESET}"
echo ""
