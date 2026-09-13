---
title: Assets and appearance
description: Add local files and choose how your documentation looks.
order: 2
---

## Local images

Put images in the configured assets directory, then reference `/assets/` in your
Markdown. The build checks that the file exists and adds your deployment base.

![Monoline Docs wordmark](/assets/wordmark.svg)

```markdown
![Monoline Docs wordmark](/assets/wordmark.svg)
```

Downloads work the same way. Images, fonts, CSS, PDF, text, and JSON files are
copied without changing their contents. Child symlinks are rejected.

## Fonts and custom CSS

Set `stylesheet: "/assets/site.css"` in the shared configuration to load your
own stylesheet after the default styles. For example, put `body.woff2` in the
assets folder's `fonts` directory and use a relative URL:

```css
@font-face {
	font-family: "Docs Body";
	src: url("fonts/body.woff2") format("woff2");
	font-display: swap;
}

body {
	font-family: "Docs Body", system-ui, sans-serif;
}
```

The build validates Markdown asset links, but does not rewrite or validate URLs
inside custom CSS. Relative URLs keep font loading independent of the site base.

## Theme selection

Set `defaultMode` in the configuration to `light`, `dark`, or `system`.
The default applies before JavaScript runs; a saved visitor preference takes
precedence. This demo uses `system`.

Use the header's theme selector to choose light, dark, or system. Your explicit
choice is remembered when browser storage is available. System follows your
device preference, including changes made while a page is open.

## Customizing the design

The demo loads `assets/custom.css` after Monoline's defaults. Override variables
instead of depending on internal HTML classes:

```css
:root {
	--background: light-dark(#fff, #171717);
	--foreground: light-dark(#202020, #f5f5f5);
	--accent: light-dark(#185abd, #9ac5ff);
	--radius: 0.375rem;
	--content-width: 70ch;
}
```

`light-dark()` selects the appropriate value for the current color mode.
Typography uses `--font-body`, `--font-code`, and `--line-height`. Layout uses
`--page-width`, `--sidebar-width`, `--content-width`, and `--content-padding`.
Other color variables are `--muted-foreground`, `--border`, and `--surface`.
Check contrast and mobile layout after making changes.

Monoline currently has one design, not a collection of theme presets.

## Code blocks

Code is highlighted during the build. Use the copy button below each block to
copy its source text without markup. If clipboard access fails, a message tells
you to select and copy the code manually.

```typescript
const configuration = {
	title: "Team handbook",
	base: "/handbook/",
}
```
