#!/bin/sh
# Missing deployment history must allow a build in shallow Vercel checkouts.
previous=${VERCEL_GIT_PREVIOUS_SHA:-HEAD^}
git rev-parse --verify "${previous}^{commit}" >/dev/null 2>&1 || exit 1
git diff --quiet "$previous" HEAD -- \
  ':(top)apps/website' ':(top)packages/ui' ':(top)scripts' \
  ':(top)pnpm-lock.yaml' ':(top)pnpm-workspace.yaml' \
  ':(top)package.json' ':(top)tsconfig*.json' || exit 1
