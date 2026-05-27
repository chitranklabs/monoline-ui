# monoline/ui

Monoline is a workspace with two products:

- `apps/playground`: a Next.js docs and playground site deployed to Vercel.
- `packages/monoline-ui`: the React design library published to npm and JSR.

The playground consumes the local package through `workspace:*`. Playground-only
UI stays inside the app. Shared UI moves into `packages/monoline-ui` only after
it is needed by the library or repeated across package consumers.

## Commands

```bash
pnpm install
pnpm dev              # Next.js playground
pnpm build            # npm library build only
pnpm build:playground # Vercel playground build
pnpm test
pnpm lint
```

## Structure

```txt
apps/playground/
  app/
    page.tsx
    installation/page.tsx
    foundations/
    components/

packages/monoline-ui/
  src/foundations/theme.css
  src/components/footer.tsx
```

The package owns design foundations and components. The playground owns docs,
navigation, search, preview canvas, and any layout chrome needed to inspect the
library.
