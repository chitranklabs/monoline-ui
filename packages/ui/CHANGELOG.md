# Monoline UI changelog

## 0.5.0

### Minor Changes

- 5ac4546: feat(workspace): convert repository to monorepo and update website docs shell

  - Refactored repository into pnpm workspaces separating `@chitrank2050/monoline-ui` (`packages/ui`) and website (`apps/website`).
  - Standardized UI component package export boundaries and sync-exports contract.
  - Modernized documentation routes under `/docs` with updated sidebar, TOC, and landing page gallery.
  - Updated website changelog release cards and timeline styling.
  - Added repository CODEOWNERS and updated install script contracts.

New library releases are recorded here by Changesets.

The historical, mixed library/website changelog through `v0.4.0` remains
[archived at the repository root](https://github.com/chitranklabs/monoline-ui/blob/main/CHANGELOG.md).
Existing tags and website history are preserved rather than reclassified.
