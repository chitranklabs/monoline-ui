import type { Metadata } from "next"

import { Card } from "@chitrank2050/monoline-ui/card"

import JsonLd, {
	createBreadcrumbJsonLd,
	createCollectionPageJsonLd,
} from "../../_components/json-ld"
import { foundationsNav } from "../../lib/docs-nav"
import { createPageMetadata } from "../../lib/metadata"

const displayTitle = "Design-token foundations"
const seoTitle = "Tailwind CSS v4 Design Token Foundations | monoline/ui"
const pageDescription =
	"Monoline UI uses Tailwind CSS v4 tokens for color, typography, spacing, radius, and motion, with the same semantic roles across light and dark React interfaces."

export const metadata: Metadata = createPageMetadata({
	title: seoTitle,
	description: pageDescription,
	path: "/docs/foundations",
})

const foundationDescriptions: Record<string, string> = {
	Colors:
		"Semantic surface, text, border, and accent variables for two themes.",
	Typography:
		"Font families, fluid type scales, weights, and editorial rhythm.",
	Spacing: "A bounded spacing scale shared by components and page layouts.",
	Radius: "Purposeful corner tokens matched to controls, cards, and surfaces.",
	Motion: "Durations, easing curves, and reduced-motion behavior.",
}

const foundationItems = foundationsNav
	.filter((item) => item.href && item.href !== "/docs/foundations")
	.flatMap((item) => [{ name: item.label, path: item.href! }])

export default function FoundationsPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@graph": [
			createCollectionPageJsonLd({
				title: displayTitle,
				description: pageDescription,
				path: "/docs/foundations",
				items: foundationItems,
			}),
			createBreadcrumbJsonLd([
				{ name: "Monoline UI", path: "/" },
				{ name: "Design-token foundations", path: "/docs/foundations" },
			]),
		],
	}

	return (
		<main id="main-content" tabIndex={-1} className="docs-page">
			<JsonLd data={jsonLd} />
			<header className="docs-page__head">
				<p className="ml-eyebrow">Tailwind CSS v4 · CSS variables</p>
				<h1>{displayTitle}</h1>
				<p>
					Start here if you want to understand how Monoline UI looks and feels,
					or if you plan to adapt it to your own brand. These tokens control
					color, type, spacing, corners, and motion across the library.
				</p>
			</header>

			<section className="docs-section">
				<div className="docs-subhead">
					<h2>Token reference</h2>
					<p>See what each token controls and how to override it safely.</p>
				</div>
				<div className="grid grid-cols-1 gap-ml-4 md:grid-cols-2">
					{foundationsNav
						.filter((item) => item.href !== "/docs/foundations")
						.map((item) => (
							<Card key={item.href} href={item.href ?? "/docs/foundations"}>
								<Card.Body>
									<Card.Title>{item.label}</Card.Title>
									<Card.Description>
										{foundationDescriptions[item.label]}
									</Card.Description>
								</Card.Body>
							</Card>
						))}
				</div>
			</section>
		</main>
	)
}
