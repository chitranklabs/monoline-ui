# @chitrank2050/monoline-docs

## 0.2.0

### Minor Changes

- 642a179: Publish additional local documentation directories with `contentMounts`, preserving their source files while sharing navigation, search, exports and preview watching. Reject conflicting routes and output overlap, and avoid duplicate matching title headings in mounted pages.

## 0.1.4

### Patch Changes

- a4b2642: Include the page name in structured data and document configuring SEO, social sharing, sitemap generation and staging indexation. Update the bundled authoring skill with publishing and SEO verification guidance.

## 0.1.3

### Patch Changes

- 3124ea4: Add website structured data linked to documentation pages and complete social title, description and site-name metadata. Identify documentation homepages as web pages rather than articles.

## 0.1.2

### Patch Changes

- 2845162: Skip initial anchor lookup when the page URL has no fragment, avoiding Firefox's empty element ID warning while preserving heading alignment.

## 0.1.1

### Patch Changes

- 5bda098: Update installation guides and the authoring skill for the published npm package, fix the npm README skill link and component guidance, add documentation discovery keywords, and preserve configuration and preview API details in the consumer guides. Use source-relative guide links so README readers can navigate on GitHub as well as the generated site.

## 0.1.0

### Minor Changes

- e9eb04b: Release the first Monoline Docs package with Markdown and MDX builds, static
  search, accessible themes and navigation, authoring components, React islands,
  clean URL support, safe starter initialization, local OpenAPI reference generation,
  Markdown page exports that preserve code examples and document structure,
  `llms.txt` and `llms-full.txt` indexes, and a maintained Monoline Docs authoring
  skill for AI agents. Includes validated appearance controls, root/subpath deployment
  templates, installed-package YAML editor completion, and URL migration guidance.
  Builds stage and validate output before promotion, preserving last-good output and
  unrelated files. npm is the first release target; JSR is not supported.
