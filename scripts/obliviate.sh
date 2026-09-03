#!/bin/bash

set -euo pipefail
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd -- "$SCRIPT_DIR/.."
test -f pnpm-workspace.yaml && test -f packages/ui/package.json && test -f apps/website/package.json

# Define total steps
TOTAL_STEPS=4

echo "🪄  Initiating obliviate protocols..."

# Step 1: Build artifacts
echo "[1/$TOTAL_STEPS] 🗑️  Removing build artifacts (.next, dist)..."
rm -rf .next
rm -rf dist
rm -rf apps/website/.next packages/ui/dist

# Step 2: Dependencies
echo "[2/$TOTAL_STEPS] 💥 Removing dependencies (node_modules)..."
rm -rf node_modules
rm -rf apps/website/node_modules packages/ui/node_modules

# Step 3: Lockfiles
echo "[3/$TOTAL_STEPS] 🔓 Removing lockfiles..."
rm -f pnpm-lock.yaml

# Clean up others just in case
rm -f package-lock.json
rm -f yarn.lock
rm -f bun.lockb

# Step 4: Caches
echo "[4/$TOTAL_STEPS] 🧹 Clearing internal caches..."
rm -rf .turbo
rm -rf .eslintcache

echo "✨  Obliviate complete. Project is now a blank slate."
