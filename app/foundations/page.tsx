import type { Metadata } from "next"
import Link from "next/link"

import { Card } from "@chitrank2050/monoline-ui/card"

import JsonLd, {
	createBreadcrumbJsonLd,
	createCollectionPageJsonLd,
} from "../_components/json-ld"
import { foundationsNav } from "../lib/docs-nav"
import { createPageMetadata } from "../lib/metadata"

const pageTitle = "Tailwind CSS v4 Design Token Foundations | monoline/ui"
const pageDescription =
	"Learn the Monoline UI Tailwind CSS v4 design-token system for color, typography, spacing, radius, and motion across accessible light and dark React interfaces."

export const metadata: Metadata = createPageMetadata({
	title: pageTitle,
	description: pageDescription,
	path: "/foundations",
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

const foundationItems = foundationsNav.flatMap((item) =>
	item.href ? [{ name: item.label, path: item.href }] : []
)

export default function FoundationsPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@graph": [
			createCollectionPageJsonLd({
				title: pageTitle,
				description: pageDescription,
				path: "/foundations",
				items: foundationItems,
			}),
			createBreadcrumbJsonLd([
				{ name: "Monoline UI", path: "/" },
				{ name: "Design-token foundations", path: "/foundations" },
			]),
		],
	}

	return (
		<main id="main-content" tabIndex={-1} className="docs-page">
			<JsonLd data={jsonLd} />
			<header className="docs-page__head">
				<p className="ml-eyebrow">Tailwind CSS v4 · CSS variables</p>
				<h1>Design-token foundations</h1>
				<p>
					Understand the shared color, type, spacing, radius, and motion
					contracts before composing Monoline UI React components or replacing
					the brand layer.
				</p>
			</header>

			<section className="docs-section">
				<div className="docs-subhead">
					<h2>Token reference</h2>
					<p>One source of truth for every component and responsive layout.</p>
				</div>
				<div className="grid grid-cols-1 gap-ml-4 md:grid-cols-2">
					{foundationsNav.map((item) => (
						<Card key={item.href} asChild>
							<Link href={item.href ?? "/foundations"}>
								<Card.Body>
									<h3>{item.label} design tokens</h3>
									<p>{foundationDescriptions[item.label]}</p>
								</Card.Body>
								<Card.Arrow />
							</Link>
						</Card>
					))}
				</div>
			</section>
		</main>
	)
}
