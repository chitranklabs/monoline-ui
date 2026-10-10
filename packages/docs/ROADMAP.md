# Monoline Docs roadmap

Monoline Docs builds static documentation for libraries, SDKs and API products.
The initial release focuses on Markdown/MDX authoring, navigation, local search,
OpenAPI reference pages and Markdown/AI exports. Docs and Monoline UI release
independently.

## Before the first release

- [ ] Complete manual screen-reader and real iOS keyboard/safe-area checks.
- [ ] Verify root and subpath deployments on a real static host.
- [ ] Confirm npm ownership, publishing credentials, GitHub bot permissions and
      provenance/attestation in the hosted release workflow.
- [ ] Review the prepared version and changelog, then authorize publication.

Local package, packed-consumer and browser checks pass. Run the relevant checks
again against the prepared release candidate; local results do not establish
hosted publication or manual device acceptance.

Use the [Docs release and recovery guide](../../docs/docs-release.md) and
[deployment guide](../../docs/docs-deployment.md) for these gates.

## Next priorities

- Validate adoption using representative existing documentation sites before
  promising migration parity with other documentation platforms.

## Later, when needed

- Multiple locales, language fallback and right-to-left layouts.
- Versioned documentation and version navigation.
- Migration helpers for other documentation frameworks.
- A search backend for substantially larger documentation sites.

Hosted analytics, AI chat backends, interactive API consoles, AsyncAPI and a theme
marketplace are outside the initial release. Revisit them only for demonstrated
consumer needs.

## Engineering references

Read the [Docs guidelines](AGENTS.md) before implementation, then
the [release and recovery guide](../../docs/docs-release.md) for publishing changes or
[performance checks and budgets](../../docs/docs-performance.md) for client and build
changes. Keep this roadmap focused on remaining work; verification belongs in
tests and review notes rather than a growing audit ledger.
