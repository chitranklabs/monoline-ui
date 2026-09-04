# Release intent

For a user-visible library change, run `pnpm changeset` and select
`@chitrank2050/monoline-ui`. Choose the appropriate bump and describe the impact
on consumers. Commit the generated Markdown file with the change.

Website, CI, and test-only changes need no library bump. Use
`pnpm changeset --empty` when you want to record an explicit no-release decision.
The private website and workspace root are not versioned or published.

Run `pnpm release:status` to inspect pending releases. The Prepare workflow
consumes release intent and creates a reviewable release PR; merging it starts
the verified publication workflow. Do not run `changeset publish` directly:
this repository publishes both npm and JSR through its existing release jobs.
