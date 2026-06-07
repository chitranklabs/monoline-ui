# @chitrank2050/monoline-ui

React design library for the Monoline UI playground and downstream portfolio
interfaces.

## Install

```bash
pnpm add @chitrank2050/monoline-ui
```

## Theme

Import the theme once from your app-level CSS entry. Tailwind v4 needs the
package source so it can see component classes during compilation.

```css
@import "tailwindcss";
@source "./node_modules/@chitrank2050/monoline-ui/dist/**/*.{js,mjs}";
@import "@chitrank2050/monoline-ui/theme.css";
```

## Components

Use component subpaths for feature code. This keeps imports scalable as the
library grows.

```tsx
import { Footer } from "@chitrank2050/monoline-ui/components/footer"

export function PageFooter() {
	return (
		<Footer
			size="md"
			status={<Footer.Status>Open to work</Footer.Status>}
			columns={[
				{
					title: "Navigate",
					links: [
						{ href: "/projects", label: "Projects" },
						{ href: "/blog", label: "Blog" },
					],
				},
				{
					title: "Elsewhere",
					links: [
						{ href: "https://github.com", label: "GitHub", external: true },
						{
							href: "mailto:hello@example.com",
							label: "Email",
							external: true,
						},
					],
				},
			]}
			subscribe={<Footer.Subscribe />}
			meta="© 2026 · Built by Chitrank Agnihotri · v3.2.0"
			attribution="Next 15 · Sanity · Tailwind 4"
		/>
	)
}
```

The package root remains a curated convenience barrel for small apps and quick
prototypes:

```tsx
import { Footer } from "@chitrank2050/monoline-ui"
```

## Foundations

Foundation utilities use the same subpath pattern.

```tsx
import { monolineBreakpoints } from "@chitrank2050/monoline-ui/foundations/breakpoints"
```
