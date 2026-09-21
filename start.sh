#!/usr/bin/env bash

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}   Starting Task Portal Application      ${NC}"
echo -e "${BLUE}=========================================${NC}"

# 1. Environment Files Setup
echo -e "\n${YELLOW}[1/5] Checking environment files...${NC}"

ensure_env_file() {
  local target_file="$1"
  local example_file="$2"

  if [ ! -f "$target_file" ]; then
    if [ -f "$example_file" ]; then
      cp "$example_file" "$target_file"
      echo -e "${GREEN}  ✓ Created $target_file from $example_file${NC}"
    else
      echo -e "${RED}  ✗ Warning: $example_file does not exist!${NC}"
    fi
  else
    echo -e "  ✓ $target_file already exists"
  fi
}

ensure_env_file ".env" ".env.example"
ensure_env_file "backend/.env" "backend/.env.example"
ensure_env_file "frontend/.env" "frontend/.env.example"

# Load root .env variables for the script
if [ -f .env ]; then
  set -a
  source .env
  set +a
fi

# 2. Dependency Installation
echo -e "\n${YELLOW}[2/5] Installing dependencies...${NC}"

echo -e "  → Installing backend dependencies..."
(cd "$ROOT_DIR/backend" && npm install)

echo -e "  → Installing frontend dependencies..."
(cd "$ROOT_DIR/frontend" && npm install)

# 3. Database Container Startup
echo -e "\n${YELLOW}[3/5] Starting PostgreSQL container...${NC}"
if ! command -v docker >/dev/null 2>&1; then
  echo -e "${RED}Error: docker is not installed or not in PATH.${NC}"
  exit 1
fi

docker compose up -d db

echo -e "  → Waiting for database to be healthy..."
MAX_TRIES=30
TRIES=0
DB_HEALTHY=false

while [ $TRIES -lt $MAX_TRIES ]; do
  HEALTH=$(docker inspect --format='{{json .State.Health.Status}}' taskportal-db 2>/dev/null || echo "")
  if [ "$HEALTH" = "\"healthy\"" ]; then
    DB_HEALTHY=true
    break
  fi
  sleep 1
  TRIES=$((TRIES + 1))
done

if [ "$DB_HEALTHY" = true ]; then
  echo -e "${GREEN}  ✓ PostgreSQL is ready and healthy!${NC}"
else
  echo -e "${YELLOW}  ⚠ Healthcheck timed out, verifying connection directly via pg_isready...${NC}"
  docker compose exec -T db pg_isready -U "${POSTGRES_USER:-postgres}" -d "${POSTGRES_DB:-taskportal}" || {
    echo -e "${RED}Error: Database container failed to become ready.${NC}"
    exit 1
  }
fi

# 4. Database Migrations
echo -e "\n${YELLOW}[4/5] Running Drizzle database migrations...${NC}"
(cd "$ROOT_DIR/backend" && npm run db:migrate)
echo ""
echo -e "${GREEN}  ✓ Migrations applied successfully!${NC}"

# 5. Run Server and Client Concurrently
echo -e "\n${YELLOW}[5/5] Launching Client and Server...${NC}"

BACKEND_PID=""
FRONTEND_PID=""

cleanup() {
  echo -e "\n${YELLOW}Shutting down processes...${NC}"
  if [ -n "$BACKEND_PID" ] && kill -0 "$BACKEND_PID" 2>/dev/null; then
    kill "$BACKEND_PID" 2>/dev/null || true
  fi
  if [ -n "$FRONTEND_PID" ] && kill -0 "$FRONTEND_PID" 2>/dev/null; then
    kill "$FRONTEND_PID" 2>/dev/null || true
  fi
  wait "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true
  echo -e "${GREEN}Services stopped cleanly.${NC}"
  exit 0
}

trap cleanup INT TERM EXIT

# Start backend
(cd "$ROOT_DIR/backend" && npm run dev) &
BACKEND_PID=$!

# Start frontend
(cd "$ROOT_DIR/frontend" && npm run dev) &
FRONTEND_PID=$!

echo -e "\n${GREEN}=========================================${NC}"
echo -e "${GREEN}   Application is running!               ${NC}"
echo -e "${GREEN}   • Frontend: http://localhost:${FRONTEND_PORT:-5173}     ${NC}"
echo -e "${GREEN}   • Backend:  http://localhost:${PORT:-3000}     ${NC}"
echo -e "${GREEN}   • API:      ${VITE_API_URL:-http://localhost:${PORT:-3000}/api} ${NC}"
echo -e "${GREEN}=========================================${NC}"
echo -e "Press [Ctrl+C] to stop all services.\n"

# Wait for both background processes
wait "$BACKEND_PID" "$FRONTEND_PID"
