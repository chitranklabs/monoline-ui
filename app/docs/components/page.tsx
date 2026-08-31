import type { Metadata } from "next"

import { Card } from "@chitrank2050/monoline-ui/card"

import metadataJson from "../../../src/metadata.json"
import JsonLd, {
	createBreadcrumbJsonLd,
	createCollectionPageJsonLd,
} from "../../_components/json-ld"
import { componentNavGroups } from "../../lib/docs-nav"
import { createPageMetadata } from "../../lib/metadata"
import { routes } from "../../lib/routes"

const displayTitle = "Component catalog"
const seoTitle = "React Component Catalog for Editorial UI | monoline/ui"
const pageDescription = `Browse ${metadataJson.count} React components for developer portfolios, documentation, and editorial interfaces, with live previews, typed APIs, tokens, and source examples.`

export const metadata: Metadata = createPageMetadata({
	title: seoTitle,
	description: pageDescription,
	path: routes.docs.components.root,
})

const componentItems = componentNavGroups
	.filter((group) => group.label !== "Components")
	.flatMap((group) =>
		group.items.flatMap((item) =>
			item.href ? [{ name: item.label, path: item.href }] : []
		)
	)

export default function ComponentsPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@graph": [
			createCollectionPageJsonLd({
				title: displayTitle,
				description: pageDescription,
				path: routes.docs.components.root,
				items: componentItems,
			}),
			createBreadcrumbJsonLd([
				{ name: "Monoline UI", path: routes.home },
				{ name: "React components", path: routes.docs.components.root },
			]),
		],
	}

	return (
		<main id="main-content" tabIndex={-1} className="docs-page">
			<JsonLd data={jsonLd} />
			<header className="docs-page__head">
				<p className="ml-eyebrow">{metadataJson.count} typed primitives</p>
				<h1>{displayTitle}</h1>
				<p>
					Browse the components by what they help you build. Each page has a
					live preview, install command, API details, accessibility notes, and
					the source behind the example.
				</p>
			</header>

			{componentNavGroups
				.filter((group) => group.label !== "Components")
				.map((group) => (
					<section key={group.label} className="docs-section">
						<div className="docs-subhead">
							<h2>{group.label}</h2>
							<p>{group.description}</p>
						</div>
						<div className="grid grid-cols-1 gap-ml-4 md:grid-cols-2">
							{group.items.map((item) => (
								<Card
									key={item.href}
									href={item.href ?? routes.docs.components.root}
								>
									<Card.Body>
										<Card.Title>{item.label}</Card.Title>
										<Card.Description>{item.description}</Card.Description>
									</Card.Body>
								</Card>
							))}
						</div>
					</section>
				))}
		</main>
	)
}
