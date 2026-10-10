# Documentation test fixtures

These sites exercise Monoline Docs independently of the public demo. They stay in
the repository and are excluded from npm by the package's `files` allowlist.
The packed-consumer check also asserts that fixtures and test runners are absent.

- `browser/components.mdx` covers authoring components in the browser and packed
  npm/pnpm consumer checks. Keep it stable when demo guides are reorganized.
- `browser/visual.mdx` supplies the small, stable layout corpus for visual
  comparisons in both themes and viewport sizes. Approved images live in
  `../visual/baselines/`; baseline updates follow the
  [visual regression guide](../../../docs/docs-release.md#visual-regression-checks).
- `ask-widget/` covers a React documentation site, clean subpath routes, generated
  API data and consumer configuration. Its content, data and component files are
  inputs to the packed-consumer checks.

Do not import fixtures from production package code. Add test cases to the
existing fixture that owns the behavior rather than copying the public demo.
