# Foundry UI

Foundry UI is a modular design-system monorepo built to showcase product-thinking, interface craft, and production-ready UI architecture.

## Stack

- Next.js app router for the showcase and documentation app
- Tailwind CSS v4 for utility styling and token-driven theming
- shadcn-style component primitives built on Radix Slot and CVA
- Storybook 9 for isolated component exploration
- Vitest and Playwright for quality gates
- Turborepo, pnpm workspaces, Biome, and Changesets for maintainable scale

## Workspace

- `apps/docs`: public docs and showcase site
- `packages/tokens`: theme tokens, palettes, and foundation metadata
- `packages/ui`: reusable UI primitives and stories

## Getting started

```bash
pnpm install
pnpm dev:docs
```

Run Storybook with:

```bash
pnpm storybook
```
