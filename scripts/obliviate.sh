#!/bin/bash

set -euo pipefail
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd -- "$SCRIPT_DIR/.."
test -f pnpm-workspace.yaml && test -f packages/ui/package.json && test -f apps/website/package.json

# Define total steps
TOTAL_STEPS=3

echo "🪄  Initiating obliviate protocols..."

# Step 1: Build artifacts
echo "[1/$TOTAL_STEPS] 🗑️  Removing build artifacts (.next, dist, test outputs)..."
rm -rf .next
rm -rf dist
rm -rf apps/website/.next apps/docs-demo/dist apps/docs-demo/.astro packages/ui/dist packages/docs/dist
rm -rf coverage playwright-report test-results
rm -f tsconfig.tsbuildinfo apps/website/tsconfig.tsbuildinfo packages/ui/tsconfig.tsbuildinfo packages/docs/tsconfig.tsbuildinfo apps/docs-demo/tsconfig.tsbuildinfo

# Step 2: Dependencies
echo "[2/$TOTAL_STEPS] 💥 Removing dependencies (node_modules)..."
rm -rf node_modules
rm -rf apps/website/node_modules apps/docs-demo/node_modules packages/ui/node_modules packages/docs/node_modules

# Keep the tracked lockfile so clean installs reproduce the same dependencies.
# Step 3: Caches
echo "[3/$TOTAL_STEPS] 🧹 Clearing internal caches..."
rm -rf .turbo
rm -rf .eslintcache

echo "✨  Obliviate complete. Project is now a blank slate."
