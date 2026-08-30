import type { Metadata } from "next"
import Link from "next/link"

import { Card } from "@chitrank2050/monoline-ui/card"

import JsonLd, {
	createBreadcrumbJsonLd,
	createCollectionPageJsonLd,
} from "../_components/json-ld"
import { componentNavGroups } from "../lib/docs-nav"
import { createPageMetadata } from "../lib/metadata"

const pageTitle = "React Component Catalog for Editorial UI | monoline/ui"
const pageDescription =
	"Browse 37 React components for developer portfolios, documentation, and editorial interfaces, with live previews, typed APIs, tokens, and source examples."

export const metadata: Metadata = createPageMetadata({
	title: pageTitle,
	description: pageDescription,
	path: "/components",
})

const componentItems = componentNavGroups.flatMap((group) =>
	group.items.flatMap((item) =>
		item.href ? [{ name: item.label, path: item.href }] : []
	)
)

export default function ComponentsPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@graph": [
			createCollectionPageJsonLd({
				title: pageTitle,
				description: pageDescription,
				path: "/components",
				items: componentItems,
			}),
			createBreadcrumbJsonLd([
				{ name: "Monoline UI", path: "/" },
				{ name: "React components", path: "/components" },
			]),
		],
	}

	return (
		<main id="main-content" tabIndex={-1} className="docs-page">
			<JsonLd data={jsonLd} />
			<header className="docs-page__head">
				<p className="ml-eyebrow">37 typed primitives</p>
				<h1>React component catalog</h1>
				<p>
					Explore every Monoline UI component by purpose. Each reference
					includes a live responsive preview, installation path, typed API,
					design tokens, accessibility guidance, edge cases, and implementation
					source.
				</p>
			</header>

			{componentNavGroups.map((group) => (
				<section key={group.label} className="docs-section">
					<div className="docs-subhead">
						<h2>{group.label}</h2>
						<p>Components designed to compose within this interface layer.</p>
					</div>
					<div className="grid grid-cols-1 gap-ml-4 md:grid-cols-2">
						{group.items.map((item) => (
							<Card key={item.href} asChild>
								<Link href={item.href ?? "/components"}>
									<Card.Body>
										<h3>{item.label} React component</h3>
										<p>
											Open the interactive reference and integration contract.
										</p>
									</Card.Body>
									<Card.Arrow />
								</Link>
							</Card>
						))}
					</div>
				</section>
			))}
		</main>
	)
}
