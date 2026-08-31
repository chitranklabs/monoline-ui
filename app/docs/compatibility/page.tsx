import type { Metadata } from "next"

import { Callout } from "@chitrank2050/monoline-ui/callout"
import { Card } from "@chitrank2050/monoline-ui/card"
import { CodeBlock } from "@chitrank2050/monoline-ui/code-block"
import { DataList } from "@chitrank2050/monoline-ui/data-list"

import JsonLd, {
	createBreadcrumbJsonLd,
	createTechArticleJsonLd,
} from "../../_components/json-ld"
import "../../_styles/guide-pages.css"
import { createPageMetadata } from "../../lib/metadata"

const displayTitle = "Compatibility"
const pageDescription =
	"Check monoline/ui support for React, Next.js Server Components, Tailwind CSS v4, TypeScript, ESM bundlers, and the modern CSS features used by its theme."

export const metadata: Metadata = createPageMetadata({
	title: "React and Tailwind Compatibility | monoline/ui Docs",
	description: pageDescription,
	path: "/docs/compatibility",
})

const compatibilityRows = [
	{
		label: "React",
		title: "18.2 and 19",
		description:
			"The published peer range is ^18.2.0 or ^19.0.0 for both react and react-dom.",
		trailing: "Supported",
	},
	{
		label: "Tailwind CSS",
		title: "Version 4 or newer",
		description:
			"Tailwind is an optional peer for JavaScript resolution, but the full theme and utility contract is written for Tailwind CSS v4.",
		trailing: "v4+",
	},
	{
		label: "Modules",
		title: "ES modules with TypeScript declarations",
		description:
			"The package publishes ESM JavaScript, declaration files, and explicit component subpath exports.",
		trailing: "ESM",
	},
	{
		label: "Next.js",
		title: "App Router and React Server Component imports",
		description:
			"Static component subpaths remain server-safe. Interactive component entries preserve their client boundary.",
		trailing: "Tested",
	},
] as const

const subpathCode = `// Preferred in application code
import { Card } from "@chitrank2050/monoline-ui/card"
import { Container } from "@chitrank2050/monoline-ui/container"

// Also supported for small scripts or quick prototypes
import { Card, Container } from "@chitrank2050/monoline-ui"`

export default function CompatibilityPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@graph": [
			createTechArticleJsonLd({
				title: displayTitle,
				description: pageDescription,
				path: "/docs/compatibility",
			}),
			createBreadcrumbJsonLd([
				{ name: "Monoline UI", path: "/" },
				{ name: displayTitle, path: "/docs/compatibility" },
			]),
		],
	}

	return (
		<main id="main-content" tabIndex={-1} className="docs-page">
			<JsonLd data={jsonLd} />
			<header className="docs-page__head">
				<p className="ml-eyebrow">Product guide · Compatibility</p>
				<h1>{displayTitle}</h1>
				<p>
					Monoline targets modern React environments. This page summarizes
					supported peer dependencies, bundler formats, and modern browser
					features.
				</p>
			</header>

			<section className="docs-section" aria-labelledby="matrix-title">
				<div className="docs-subhead">
					<h2 id="matrix-title">Dependency and platform matrix</h2>
				</div>
				<DataList items={[...compatibilityRows]} />
			</section>

			<section className="docs-section" aria-labelledby="rsc-title">
				<div className="docs-subhead">
					<h2 id="rsc-title">Server and client boundaries</h2>
					<p>
						Importing a static component from its subpath lets a Server
						Component remain on the server. Interactive entries are marked for
						the client.
					</p>
				</div>
				<CodeBlock filename="app/page.tsx" language="tsx" code={subpathCode} />
			</section>

			<section className="docs-section" aria-labelledby="browser-title">
				<div className="docs-subhead">
					<h2 id="browser-title">Browser expectations</h2>
					<p>
						The theme uses CSS custom properties, color-mix(), OKLCH colors,
						modern media queries, and focus-visible.
					</p>
				</div>
				<div className="grid grid-cols-1 gap-ml-4 md:grid-cols-2">
					<Card>
						<Card.Body>
							<Card.Eyebrow>Recommended</Card.Eyebrow>
							<Card.Title>Evergreen browsers</Card.Title>
							<Card.Description lines={4}>
								Use current stable releases in production and include the
								browsers your analytics show in automated visual checks.
							</Card.Description>
						</Card.Body>
					</Card>
					<Card>
						<Card.Body>
							<Card.Eyebrow>Not declared</Card.Eyebrow>
							<Card.Title>Legacy browser support</Card.Title>
							<Card.Description lines={4}>
								Monoline does not publish an Internet Explorer or fixed
								legacy-browser compatibility guarantee.
							</Card.Description>
						</Card.Body>
					</Card>
				</div>
			</section>

			<div className="docs-section">
				<Callout variant="warn" label="Before upgrading">
					Run your application build, typecheck, component tests, and key visual
					flows. A peer range confirms install compatibility; it cannot cover
					every bundler plugin or application override.
				</Callout>
			</div>
		</main>
	)
}
