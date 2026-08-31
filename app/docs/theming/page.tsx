import type { Metadata } from "next"

import { Callout } from "@chitrank2050/monoline-ui/callout"
import { Card } from "@chitrank2050/monoline-ui/card"
import { CodeBlock } from "@chitrank2050/monoline-ui/code-block"

import JsonLd, {
	createBreadcrumbJsonLd,
	createTechArticleJsonLd,
} from "../../_components/json-ld"
import "../../_styles/guide-pages.css"
import { createPageMetadata } from "../../lib/metadata"
import { routes } from "../../lib/routes"

const displayTitle = "Theming"
const pageDescription =
	"Configure monoline/ui light and dark themes, import Tailwind CSS v4 tokens, override semantic variables safely, and avoid a flash during server rendering."

export const metadata: Metadata = createPageMetadata({
	title: "Tailwind CSS v4 Theming | monoline/ui Documentation",
	description: pageDescription,
	path: routes.docs.theming,
})

const importCode = `@import "tailwindcss";
@import "@chitrank2050/monoline-ui/theme.css";`

const rootCode = `<html lang="en" data-theme="dark">
  <body>{children}</body>
</html>`

const overrideCode = `@import "tailwindcss";
@import "@chitrank2050/monoline-ui/theme.css";

/* Load overrides after the package theme. */
[data-theme="light"] {
  --accent: oklch(0.52 0.12 38);
  --accent-soft: oklch(0.52 0.12 38 / 0.1);
}

[data-theme="dark"] {
  --accent: oklch(0.8 0.08 62);
  --accent-soft: oklch(0.8 0.08 62 / 0.14);
}`

const themeGroups = [
	["Surfaces", "--background, --surface, --surface-2, --card, --popover"],
	["Text", "--text, --text-body, --text-secondary, --text-muted"],
	["Interaction", "--accent, --accent-soft, --ring, --focus-ring"],
	["Shape", "--radius-sm through --radius-3xl, plus --radius-pill"],
	["Motion", "--duration-* and --ease-* transition tokens"],
] as const

export default function ThemingPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@graph": [
			createTechArticleJsonLd({
				title: displayTitle,
				description: pageDescription,
				path: routes.docs.theming,
			}),
			createBreadcrumbJsonLd([
				{ name: "Monoline UI", path: routes.home },
				{ name: displayTitle, path: routes.docs.theming },
			]),
		],
	}

	return (
		<main id="main-content" tabIndex={-1} className="docs-page">
			<JsonLd data={jsonLd} />
			<header className="docs-page__head">
				<p className="ml-eyebrow">Product guide · Theming</p>
				<h1>{displayTitle}</h1>
				<p>
					Monoline components consume semantic CSS variables. Set the theme
					once, then change those variables when your product needs a different
					voice.
				</p>
			</header>

			<section className="docs-section" aria-labelledby="setup-title">
				<div className="docs-subhead">
					<h2 id="setup-title">Set up the theme</h2>
					<p>
						Import the complete theme from your root stylesheet. The package
						also registers its compiled component sources with Tailwind.
					</p>
				</div>
				<div className="guide-page__code-stack">
					<CodeBlock
						filename="app/globals.css"
						language="css"
						code={importCode}
					/>
					<CodeBlock filename="app/layout.tsx" language="tsx" code={rootCode} />
				</div>
			</section>

			<div className="docs-section">
				<Callout variant="tip" label="System preference">
					Leave both the data-theme attribute and light/dark classes off the
					root element to use the package&apos;s prefers-color-scheme fallback.
					An explicit theme always wins.
				</Callout>
			</div>

			<section className="docs-section" aria-labelledby="tokens-title">
				<div className="docs-subhead">
					<h2 id="tokens-title">Override roles, not component selectors</h2>
					<p>
						Semantic tokens keep the same purpose in both themes. Override the
						small set your brand needs and let component styles continue to
						reference them.
					</p>
				</div>
				<div className="grid grid-cols-1 gap-ml-4 md:grid-cols-2">
					{themeGroups.map(([title, description]) => (
						<Card key={title}>
							<Card.Body>
								<Card.Title>{title}</Card.Title>
								<Card.Description lines={4}>{description}</Card.Description>
							</Card.Body>
						</Card>
					))}
				</div>
				<div className="guide-page__code">
					<CodeBlock
						filename="app/globals.css"
						language="css"
						code={overrideCode}
					/>
				</div>
			</section>

			<section className="docs-section" aria-labelledby="rendering-title">
				<div className="docs-subhead">
					<h2 id="rendering-title">Avoid a theme flash</h2>
				</div>
				<dl className="guide-page__decision-list">
					<div className="guide-page__decision">
						<dt>Fixed theme</dt>
						<dd>
							Render data-theme on the server. This is the simplest option and
							has no client-side theme decision.
						</dd>
					</div>
					<div className="guide-page__decision">
						<dt>Saved preference</dt>
						<dd>
							Read a cookie on the server, or run a small inline script before
							the application paints. Keep the initial attribute and hydrated
							state equal.
						</dd>
					</div>
					<div className="guide-page__decision">
						<dt>System theme</dt>
						<dd>
							Omit an explicit theme and let CSS resolve prefers-color-scheme
							without waiting for JavaScript.
						</dd>
					</div>
				</dl>
			</section>
		</main>
	)
}
