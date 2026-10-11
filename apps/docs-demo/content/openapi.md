---
title: OpenAPI documentation
description: Generate static API documentation from a local specification.
---

## See the generated result

This demo includes an illustrative Notes API. Explore its [overview](/example-api), [paginated list operation](/example-api/operations/listnotes), [create operation](/example-api/operations/createnote) and [Note schema](/example-api/schemas/note). The generated pages demonstrate query parameters, required request bodies, success and validation-error responses, JSON examples and linked schemas. The demo does not run a backend or send API requests.

## Configure generation

Generate static API pages from a local JSON or YAML OpenAPI 3.0.x or 3.1.x file:

```yaml
openapi:
  file: ./api.yml
  route: /example-api
```

The file path resolves relative to the configuration file. Keep an authored
`content/index.md` or `index.mdx` homepage. The API overview lives at `/example-api`,
operations at `/example-api/operations/<identifier>`, and component schemas at
`/example-api/schemas/<name>`. Identifiers use `operationId`, falling back to the
method and path. Route segments become lowercase and replace punctuation with
hyphens. Duplicate operation IDs, normalized routes and authored route collisions
fail the build with the specification path.

Without explicit `navigation`, operations group by their first tag, and schemas
get a separate navigation group. Explicit navigation stays authoritative; include
the generated routes in its groups or sections. All generated pages join the same
manifest used for search, links and sitemap output. Deployment `base` and
`cleanUrls` apply to these pages too. Preview watches the specification file.

Parameters, request bodies, response media types, schemas and inline examples
render as static text. Named component schemas link to their own pages; other
local references expand to a maximum of six levels. Recursive schemas stop at a
link or an expansion-limit note. Additional nesting and object limits protect
builds from pathological documents. Descriptions are escaped text rather than
executable MDX or raw HTML. This is a documentation renderer, not a full OpenAPI
conformance validator; it validates the structures it consumes.

Only local JSON-pointer references beginning with `#/` are accepted. External
files, remote URLs and anchor references fail explicitly. OpenAPI 2.x, 3.2.x,
AsyncAPI, webhooks and interactive API requests are outside this renderer's scope.

Request examples use `<BASE_URL>`, path/value/body placeholders and credential
placeholders appropriate to the declared security scheme. No server URL or
credential is copied into the request command. Bearer, basic, API-key and mutual
TLS requirements are supported; the first security alternative is used, unless
an empty requirement permits anonymous access. Replace placeholders before
running a command. Supplied schema and response examples are published verbatim
as escaped code: use fictitious data and never include credentials in examples.

For an SDK reference, use [PackageInstall and PackageReference](components/package-reference.mdx)
with `layout: reference` frontmatter and explicit compatibility declarations.

## Minimal specification

```yaml
openapi: 3.0.3
info:
  title: Notes API
  version: 1.0.0
paths:
  /notes:
    get:
      operationId: listNotes
      summary: List notes
      responses:
        "200":
          description: Notes returned successfully.
```

Use fictitious data in examples. The generated pages share your site's navigation, search and appearance.
