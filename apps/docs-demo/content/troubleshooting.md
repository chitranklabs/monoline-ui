---
title: Troubleshooting
description: Resolve configuration, content, and deployment errors.
order: 7
---

## Configuration does not load

Run the command from the directory containing your configuration, or use
`--config` with its path. If multiple discovery files exist, choose one explicitly.
For unknown options or invalid values, check the named field against the
[configuration reference](configuration.md#reference).

The preview does not reload configuration changes. Stop it and start it again.

## A page or heading link fails

Read the source filename and target in the build error. Check spelling and case,
confirm the page is not a production draft, and use a Markdown file link or
documentation route. Do not include your deployment base in content links.

For section links, use the heading's generated anchor. Renaming a heading changes
its anchor; update incoming links too. Duplicate routes can occur when both
`guides.md` and `guides/index.md` exist. Keep only one page for that route.

## Frontmatter or home page is missing

Every page needs a YAML block at the very start of the file and a nonempty
`title`. Use a number for `order` and a boolean for `draft`, not quoted strings.
A production site also needs a published `index.md` or `index.mdx` at the content root.

See the [frontmatter example](writing.md#frontmatter).

## Assets or styling are missing

Set `assetsDirectory` and reference local files through `/assets/`. The file
must exist and use a supported name and extension. Child symlinks are rejected.
The configured stylesheet must be a local `/assets/*.css` file.

The builder does not validate URLs inside custom CSS. Check their paths in the
browser; relative URLs resolve from the stylesheet, not the Markdown page.

## The output directory is refused

Use a dedicated, empty output folder for the first build. Subsequent builds
recognize their own `.monoline-generated.json` manifest. Do not delete that
manifest to force a rebuild into an existing folder, and do not mix manually
maintained files with generated output.

Choose a new output path if the current folder belongs to another tool. Content,
assets, and output must not overlap.

## Preview works but the hosted site does not

Check that `base` matches the deployment path and that you uploaded the whole
output directory. The host must serve directory indexes, including direct visits
to nested page URLs. Missing URLs should return HTTP 404 using `404.html`, not
the homepage with a success response.

If search fails, verify that `search-index.json` is reachable under the same base.
If copy fails, use the browser's normal text selection and copy action.

## MDX or React does not build

Use `.mdx` for component imports. React components require React 19, React DOM 19,
and `react: true` in configuration. Add a `client:*` directive only to components
that need browser interaction. Imported local component and data changes are
watched by preview after a successful build.

Raw HTML in `.md` remains escaped. Callout markers must be on the first line of
their own blockquote; see [callouts](writing.md#callouts).

Re-run the [production build](deployment.md#build-the-demo) after fixing an error.
Deploy only a successful build.
