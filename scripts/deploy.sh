#!/usr/bin/env bash
# =============================================================================
# A1 Real Estate CRM — Master Automated Production Deployment Script
# =============================================================================
# Usage:
#   ./scripts/deploy.sh
#   npm run deploy
# =============================================================================

set -euo pipefail

# ── Colors & Formatting ───────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
LOG_DIR="$PROJECT_ROOT/logs"
DIST_DIR="$PROJECT_ROOT/dist"

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DEPLOY_LOG="$LOG_DIR/deploy_${TIMESTAMP}.log"

mkdir -p "$LOG_DIR"
mkdir -p "$DIST_DIR"
mkdir -p "$PROJECT_ROOT/public"

echo ""
echo -e "${BOLD}${CYAN}════════════════════════════════════════════════════════════════════${RESET}"
echo -e "${BOLD}${CYAN}  A1 CRM — Master Automated Production Deployment Pipeline${RESET}"
echo -e "${BOLD}${CYAN}════════════════════════════════════════════════════════════════════${RESET}"
echo -e "  ${BOLD}Timestamp:${RESET}     $(date '+%Y-%m-%d %H:%M:%S %Z')"
echo -e "  ${BOLD}Project Root:${RESET}  $PROJECT_ROOT"
echo -e "  ${BOLD}Deploy Log:${RESET}    $DEPLOY_LOG"
echo ""

START_TIME=$(date +%s)

# ── 1. Pre-flight Environment & Tool Verification ─────────────────────────────
echo -e "${YELLOW}[1/5]${RESET} Pre-flight system check..."

if command -v node >/dev/null 2>&1; then
  echo -e "  ${GREEN}[OK]${RESET} Node.js: $(node -v)"
else
  echo -e "  ${RED}[FAIL]${RESET} Node.js is required."
  exit 1
fi

if [[ -f "$PROJECT_ROOT/.env.local" ]]; then
  echo -e "  ${GREEN}[OK]${RESET} Environment secrets file (.env.local) found"
else
  echo -e "  ${YELLOW}[WARN]${RESET} .env.local missing. Using .env.example fallback"
  cp "$PROJECT_ROOT/.env.example" "$PROJECT_ROOT/.env.local"
fi

# ── 2. Prisma Client Generation ───────────────────────────────────────────────
echo -e "${YELLOW}[2/5]${RESET} Synchronizing Prisma ORM Client..."
npx prisma generate >> "$DEPLOY_LOG" 2>&1
echo -e "  ${GREEN}[OK]${RESET} Prisma Client generated successfully"

# ── 3. TypeScript Type Validation ──────────────────────────────────────────────
echo -e "${YELLOW}[3/5]${RESET} Running strict TypeScript type check (tsc --noEmit)..."
npx tsc --noEmit >> "$DEPLOY_LOG" 2>&1
echo -e "  ${GREEN}[OK]${RESET} Zero TypeScript errors found"

# ── 4. Next.js Production Compilation (Standalone Mode) ──────────────────────
echo -e "${YELLOW}[4/5]${RESET} Compiling Next.js Standalone Production Bundle..."
npm run build >> "$DEPLOY_LOG" 2>&1
echo -e "  ${GREEN}[OK]${RESET} Next.js standalone build compiled successfully"

# ── 5. Docker Image Build or Artifact Packaging ────────────────────────────────
echo -e "${YELLOW}[5/5]${RESET} Building Production Deployment Artifacts..."

IMAGE_TAG="a1-crm:${TIMESTAMP}"
LATEST_TAG="a1-crm:latest"

if command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1; then
  echo -e "  ${CYAN}[Docker Engine Detected]${RESET} Building multi-stage container image: $IMAGE_TAG"
  docker build -t "$IMAGE_TAG" -t "$LATEST_TAG" "$PROJECT_ROOT" >> "$DEPLOY_LOG" 2>&1
  echo -e "  ${GREEN}[OK]${RESET} Container image built successfully: $LATEST_TAG"
else
  echo -e "  ${YELLOW}[Notice]${RESET} Docker engine inactive or unavailable. Creating Standalone Archive Bundle..."
  
  TARBALL_NAME="a1_crm_standalone_${TIMESTAMP}.tar.gz"
  TARBALL_PATH="$DIST_DIR/$TARBALL_NAME"
  
  if [[ -d "$PROJECT_ROOT/.next/standalone" ]]; then
    tar -czf "$TARBALL_PATH" \
      -C "$PROJECT_ROOT" \
      .next/standalone \
      .next/static \
      public \
      prisma \
      package.json >> "$DEPLOY_LOG" 2>&1
    echo -e "  ${GREEN}[OK]${RESET} Standalone production tarball created: dist/$TARBALL_NAME"
  fi
fi

# ── Deployment Manifest & Log ─────────────────────────────────────────────────
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo "[$(date '+%Y-%m-%d %H:%M:%S')] DEPLOYMENT SUCCESS | timestamp=${TIMESTAMP} | duration=${DURATION}s" >> "$LOG_DIR/deploy_manifest.log"

echo ""
echo -e "${BOLD}${GREEN}════════════════════════════════════════════════════════════════════${RESET}"
echo -e "${BOLD}${GREEN}  ✅ PRODUCTION DEPLOYMENT PIPELINE COMPLETE${RESET}"
echo -e "${BOLD}${GREEN}════════════════════════════════════════════════════════════════════${RESET}"
echo -e "  ${BOLD}Total Duration:${RESET}     ${DURATION} seconds"
echo -e "  ${BOLD}Build Output:${RESET}       .next/standalone (Production ready)"
if [[ -f "${TARBALL_PATH:-}" ]]; then
  echo -e "  ${BOLD}Artifact Archive:${RESET}   dist/$TARBALL_NAME ($(du -sh "$TARBALL_PATH" | cut -f1))"
fi
echo -e "  ${BOLD}Log File:${RESET}           $DEPLOY_LOG"
echo ""
echo -e "  ${BOLD}To start in production mode:${RESET}"
echo -e "  ${CYAN}1. Node Standalone:${RESET}  PORT=3000 node .next/standalone/server.js"
echo -e "  ${CYAN}2. Docker Container:${RESET} docker run -p 3000:3000 --env-file .env.local a1-crm:latest"
echo -e "${BOLD}${GREEN}════════════════════════════════════════════════════════════════════${RESET}"
echo ""
