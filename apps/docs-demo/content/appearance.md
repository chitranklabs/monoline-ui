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

Use configuration for local fonts, density and corners without writing CSS:

```yaml
appearance:
  density: compact # comfortable is the default
  radius: 0.375 # rem, from 0 to 1
  accent:
    light: "#753c22"
    dark: "#e9b894"
  fonts:
    body:
      family: Georgia
    code:
      family: Local Code
      src: /assets/code.woff2
branding:
  favicon: /assets/favicon.svg
  logo:
    src: /assets/favicon.svg
    alt: Your documentation logo
    width: 24
    height: 24
```

Font sources must be local WOFF2, WOFF, TTF or OTF files. Monoline resolves them
against `assetsDirectory` and adds your deployment base. Local fonts use
`font-display: optional` to avoid late font swaps; a slow first visit can use
the fallback. A family without `src` selects an installed font, with a system
fallback. Favicon files accept SVG, PNG or ICO. No remote font request is added.

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

Set `appearance.defaultMode` in the configuration to `light`, `dark`, or `system`.
The default applies before JavaScript runs; a saved visitor preference takes
precedence. This demo uses `system`.

Use the header's theme button to toggle between light and dark. Your explicit
choice is remembered when browser storage is available. Until you choose a mode,
the configured `system` default follows your device preference, including changes
made while a page is open.

## Advanced CSS customization

This demo uses the package's default stylesheet without custom CSS. If your project needs additional styling, load your own file with `stylesheet` and override tokens rather than depending on internal HTML classes:

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

Code is highlighted during the build. Use the copy icon in each block to
copy its source text without markup. If clipboard access fails, a message tells
you to select and copy the code manually.

```typescript
const configuration = {
	title: "Team handbook",
	base: "/handbook/",
}
```

## Footer attribution

Sites show a linked “Built with Monoline Docs” credit by default. To hide the credit, set:

```yaml
footer:
  showBranding: false
```

Custom footer text and links remain available independently.
