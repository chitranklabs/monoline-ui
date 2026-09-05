# Monoline UI

React components for developer portfolios, documentation, and editorial interfaces.
The library provides 47 components and a shared Tailwind CSS v4 token layer.

[Documentation](https://monolineui.chitrankagnihotri.com/docs) ·
[Component catalog](https://monolineui.chitrankagnihotri.com/docs/components) ·
[Release history](https://monolineui.chitrankagnihotri.com/docs/changelog)

## Installation

```bash
pnpm add @chitrank2050/monoline-ui
```

Import the stylesheet once in your application's global CSS:

```css
@import "tailwindcss";
@import "@chitrank2050/monoline-ui/theme.css";
```

Import components through their documented subpaths:

```tsx
import { Button } from "@chitrank2050/monoline-ui/button"

export function Example() {
	return <Button>View projects</Button>
}
```

## Technical specification

- React and React DOM: 18.2 or 19.
- Styling: Tailwind CSS v4, with explicit light and dark themes.
- npm output: ESM and TypeScript declarations; CSS is a separate import.
- Server Components: static subpaths stay server-safe; interactive subpaths
  retain their client directives. The mixed root entry is a client boundary.
- JSR: TypeScript source exports under the same package name.

See [installation](https://monolineui.chitrankagnihotri.com/docs/installation)
for framework setup and [compatibility](https://monolineui.chitrankagnihotri.com/docs/compatibility)
for supported environments.

## Contributing

This package lives in `packages/ui`; the documentation website lives in
`apps/website`. Run repository commands from the workspace root. See the
[contributor guide](https://github.com/chitranklabs/monoline-ui/blob/main/CONTRIBUTING.md).

Licensed under MIT.

<p align="center">❤️ Developed by <a href="https://chitrankagnihotri.com">Chitrank Agnihotri</a></p>
