#!/bin/bash
# ═══════════════════════════════════════════════════════════════
#  CounselorReady — Promote Main → Stable
#  Verifies production health before merging to backup branch
# ═══════════════════════════════════════════════════════════════

set -e

# ── Config ────────────────────────────────────────────────────
PROD_URL="https://counselorready.com"
API_URL="https://api.counselorready.com"
BRANCH_SOURCE="main"
BRANCH_TARGET="stable"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BOLD='\033[1m'
NC='\033[0m'

pass() { echo -e "  ${GREEN}✓${NC} $1"; }
fail() { echo -e "  ${RED}✗${NC} $1"; }
warn() { echo -e "  ${YELLOW}!${NC} $1"; }

CHECKS_PASSED=0
CHECKS_FAILED=0

check() {
  local label="$1"
  local url="$2"
  local status
  status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$url" 2>/dev/null || echo "000")
  if [ "$status" -ge 200 ] && [ "$status" -lt 400 ]; then
    pass "$label → $status"
    CHECKS_PASSED=$((CHECKS_PASSED + 1))
  else
    fail "$label → $status"
    CHECKS_FAILED=$((CHECKS_FAILED + 1))
  fi
}

# ── Step 1: Health Checks ────────────────────────────────────
echo ""
echo -e "${BOLD}═══ CounselorReady: Promote to Stable ═══${NC}"
echo ""
echo -e "${BOLD}Step 1: Verifying production health...${NC}"
echo ""

check "Frontend loads"           "$PROD_URL"
check "API reachable"            "$API_URL"
check "API health endpoint"      "$API_URL/health"
check "Auth endpoint"            "$API_URL/api/auth/me"
check "Course catalog"           "$API_URL/api/interactive-courses/catalog"
check "Static HTML (settings)"   "$PROD_URL/settings.html"

echo ""
echo -e "  Results: ${GREEN}${CHECKS_PASSED} passed${NC}, ${RED}${CHECKS_FAILED} failed${NC}"
echo ""

# ── Step 2: Gate ─────────────────────────────────────────────
if [ "$CHECKS_FAILED" -gt 0 ]; then
  echo -e "${RED}${BOLD}BLOCKED:${NC} $CHECKS_FAILED check(s) failed."
  echo "  Fix production first, then re-run this script."
  echo ""
  exit 1
fi

# ── Step 3: Optional manual verification ─────────────────────
echo -e "${YELLOW}Quick manual checks before promoting:${NC}"
echo "  • Can you log in?"
echo "  • Does a course load and play?"
echo "  • Does Stripe checkout page appear?"
echo ""
read -p "$(echo -e ${BOLD})Promote ${BRANCH_SOURCE} → ${BRANCH_TARGET}? [y/N] $(echo -e ${NC})" confirm

if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
  echo "Aborted."
  exit 0
fi

# ── Step 4: Git merge ────────────────────────────────────────
echo ""
echo -e "${BOLD}Step 4: Merging ${BRANCH_SOURCE} → ${BRANCH_TARGET}...${NC}"
echo ""

# Stash any uncommitted work
STASHED=false
if ! git diff --quiet 2>/dev/null || ! git diff --cached --quiet 2>/dev/null; then
  warn "Stashing uncommitted changes..."
  git stash push -m "promote-to-stable auto-stash $(date +%Y%m%d-%H%M%S)"
  STASHED=true
fi

# Fetch latest
git fetch origin

# Checkout and fast-forward main
git checkout "$BRANCH_SOURCE"
git pull origin "$BRANCH_SOURCE"

# Checkout stable and merge
git checkout "$BRANCH_TARGET" 2>/dev/null || git checkout -b "$BRANCH_TARGET"
git merge "$BRANCH_SOURCE" --no-edit

# Push
git push origin "$BRANCH_TARGET"

# Return to main
git checkout "$BRANCH_SOURCE"

# Restore stash if we stashed
if [ "$STASHED" = true ]; then
  warn "Restoring stashed changes..."
  git stash pop
fi

echo ""
echo -e "${GREEN}${BOLD}═══ Done! ═══${NC}"
echo -e "  ${GREEN}✓${NC} ${BRANCH_TARGET} branch updated and pushed"
echo -e "  ${GREEN}✓${NC} Render backup services will auto-deploy"
echo -e "  ${GREEN}✓${NC} You're back on ${BRANCH_SOURCE}"
echo ""
echo -e "  Backup site: https://backup.counselorready.com"
echo ""
