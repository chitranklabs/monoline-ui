# Monoline UI SEO and Library Growth Report

## Executive summary

The technical SEO work now covers all 47 public pages. They can be crawled, have distinct metadata, and link to the relevant documentation. More metadata changes are unlikely to produce meaningful growth on their own. Monoline UI now needs useful examples, independent mentions, and search demand around the problems it solves.

The library has a narrower focus than a general-purpose component kit: monochrome React components for portfolios, documentation, and editorial sites. Static components can stay server-rendered, interactive components have explicit client boundaries, and the theme is built with Tailwind CSS v4 tokens.

People can discover that work in a few different places:

- Searchable documentation and technical guides on the canonical subdomain.
- Package and API pages on npm and JSR.
- Working examples and direct documentation links from GitHub, release notes, integrations, and sites that use the library.

## Technical readiness delivered

- All 47 public pages are discoverable through crawlable navigation and the native sitemap.
- `/components`, `/foundations`, and `/changelog` give crawlers and readers a clear route into the documentation.
- Each component reference has its own H1, metadata, canonical URL, `TechArticle` and breadcrumb data, runtime and accessibility notes, trade-offs, and related links.
- Foundation and installation pages have query-oriented H1s and page-specific article/breadcrumb schemas.
- Homepage entities describe the website, package, source repository, npm listing, JSR listing, and author.
- Query-string variants and Vercel preview hosts return `noindex, follow`; the `www` host redirects to the canonical subdomain.
- The custom 404 is non-indexable and does not claim the homepage canonical.
- The package has a local author-identity fallback when the canonical identity endpoint is unavailable.
- The sitemap route set is derived from the filesystem, preventing silent omissions as documentation grows.
- Production verification enforces route parity, metadata lengths and uniqueness, schemas, canonical URLs, internal links, redirects, security headers, manifest and social assets, 404 behavior, and a changelog payload budget.
- Changelog HTML fell from roughly 774 KB in the live audit to 105.6 KB in the verified build.
- Homepage font preloads fell from seven to two, and command search is loaded only when opened.
- Vercel Speed Insights measures production Core Web Vitals; Analytics records successful install-command copies.
- npm package archives now retain the README assets, license, changelog, contribution guide, code of conduct, and security policy.
- `llms.txt` gives AI retrieval systems a concise map of authoritative documentation and package URLs. This is discovery support, not a Google ranking claim.

## What still limits growth

Established libraries already dominate broad searches such as "React component library." Monoline UI has a better chance of being found through narrower problems that match how it is built:

- React component libraries for developer portfolios.
- Editorial and documentation UI components.
- Tailwind CSS v4 design-token architecture.
- Server-safe static React primitives and explicit client boundaries.
- Accessible monochrome interfaces.

The missing evidence is outside the metadata: deployed examples, users, links to individual documentation pages, thorough package docs, and engineering articles based on work done in the library.

## 90-day execution plan

### Month 1: measure the baseline and publish an example

- Add a dedicated Google Search Console URL-prefix property for `https://monolineui.chitrankagnihotri.com/` and submit `/sitemap.xml`.
- Record a 28-day baseline for impressions, clicks, non-brand queries, indexed pages, landing pages receiving impressions, and average position bands.
- Publish a developer-portfolio example with a real deployed URL, repository, measured browser JavaScript, and direct links to the exact components used.
- Raise the JSR score from its audit baseline toward at least 90% by expanding public-symbol JSDoc and package documentation.
- Add accurate GitHub topics covering the niche: `react`, `react-components`, `react-server-components`, `tailwindcss`, `tailwindcss-v4`, `design-system`, `developer-portfolio`, `documentation`, `editorial-design`, and `accessibility`.

### Month 2: publish practical guides

Publish two guides based on work already completed in Monoline UI. Include the code that was tested, what failed, a measured result, and links to the relevant component pages. Add a diagram or example repository when it genuinely helps explain the implementation.

Recommended first guides:

1. Building a React Server Component design system with explicit client boundaries.
2. Publishing a Tailwind CSS v4 React component library to npm and JSR.

Ship a second example: a developer-documentation site using navigation, search, TOC, code blocks, callouts, and changelog components. Link from the example README to the exact component reference URLs, not only the homepage.

### Month 3: publish more examples and distribute them

Publish two more guides:

1. Measuring zero-hydration static UI primitives in Next.js App Router.
2. Designing an accessible monochrome editorial interface with CSS variables.

Ship an editorial-blog example and a migration guide from hand-written portfolio UI to Monoline components.

Earn two to four legitimate deep-link placements per month through:

- Example and starter READMEs.
- npm and JSR package pages.
- GitHub release notes and discussions.
- Relevant framework showcases and community resource lists.
- Real consuming projects that link to the exact component or guide used.

Paid links, bulk directory submissions, and generic articles would add noise without showing why someone should use the library.

## Content backlog after the first 90 days

Choose topics for which the repository can provide working code or a measurable result:

- CSS variable theming without duplicated dark-mode utility classes.
- An accessible command palette for Next.js documentation.
- A responsive table of contents with active-section tracking.
- Building a component playground separately from the published library.
- Tree-shaking subpath exports in an ESM React package.
- Testing server/client boundaries in a React component library.
- Designing changelog pages from git-cliff JSON without shipping release data to the client.
- Accessible portfolio navigation, cards, metrics, testimonials, and resource panels.

## Measurement model

Start with install-command copies as the first conversion signal. Add npm, JSR, GitHub, and example-repository clicks when those events are available in production.

Review every 28 days:

| Layer        | Metric                                           | Decision it supports                                 |
| :----------- | :----------------------------------------------- | :--------------------------------------------------- |
| Discovery    | Non-brand impressions and query count            | Whether the niche topics are entering search results |
| Relevance    | Queries and pages in positions 4–20              | Which pages deserve content expansion and links      |
| Engagement   | Install copies and package outbound clicks       | Whether documentation creates adoption intent        |
| Distribution | New deep-linking domains and linked target pages | Whether authority reaches reference and guide pages  |
| Adoption     | npm/JSR downloads and dependent/example projects | Whether interest becomes usage                       |
| Quality      | Field LCP, INP, and CLS                          | Whether production experience remains healthy        |

Set the growth target after collecting the first 28-day baseline. A 300% increase means four times the starting value; reaching 300% of the baseline means three times the starting value. Use one definition consistently in dashboards and reports.

The working targets are:

- Publish two evidence-backed guides per month.
- Launch three real examples in 90 days.
- Earn two to four legitimate deep links per month.
- Move JSR score toward 90% or higher.
- Target a threefold increase in non-brand impressions over a comparable period, then evaluate clicks and adoption separately.

## Deployment checklist

1. Deploy the current production build.
2. Confirm the canonical subdomain serves `/robots.txt`, `/sitemap.xml`, `/llms.txt`, and `/manifest.webmanifest`.
3. Submit the sitemap in the subdomain Search Console property.
4. Inspect the homepage, component hub, one server-safe component, one client component, one foundation, and the changelog.
5. Confirm Vercel Analytics and Speed Insights receive production data.
6. Compare the next complete 28-day period with the baseline; do not judge impact from partial post-deploy data.

## Authoritative guidance

- [Google: creating helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Google: make links crawlable](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)
- [Google: build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google: breadcrumb structured data](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb)
- [Google Search Console property types](https://support.google.com/webmasters/answer/34592)
- [npm package metadata](https://docs.npmjs.com/files/package.json/)
- [GitHub repository topics](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/classifying-your-repository-with-topics)
- [JSR package scoring](https://jsr.io/docs/scoring)
