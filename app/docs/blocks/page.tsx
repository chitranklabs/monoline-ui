import type { Metadata } from "next"
import Link from "next/link"

import { Button } from "@chitrank2050/monoline-ui/button"
import { Card } from "@chitrank2050/monoline-ui/card"

import JsonLd, {
	createBreadcrumbJsonLd,
	createCollectionPageJsonLd,
} from "../../_components/json-ld"
import { blockPath, blocks } from "../../lib/blocks"
import { createPageMetadata } from "../../lib/metadata"
import { routes } from "../../lib/routes"

const description =
	"Install complete portfolio sections from the Monoline GitHub registry. Each block uses typed components, semantic tokens, and responsive light and dark themes."

export const metadata: Metadata = createPageMetadata({
	title: "Installable React Portfolio Blocks | monoline/ui Docs",
	description,
	path: routes.docs.blocks.root,
})

export default function BlocksPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@graph": [
			createCollectionPageJsonLd({
				title: "Portfolio blocks",
				description,
				path: routes.docs.blocks.root,
				items: blocks.map((block) => ({
					name: block.title,
					path: blockPath(block.name),
				})),
			}),
			createBreadcrumbJsonLd([
				{ name: "Monoline UI", path: routes.home },
				{ name: "Docs", path: routes.docs.root },
				{ name: "Blocks", path: routes.docs.blocks.root },
			]),
		],
	}

	return (
		<main id="main-content" tabIndex={-1} className="docs-page">
			<JsonLd data={jsonLd} />
			<header className="docs-page__head">
				<p className="ml-eyebrow">GitHub registry</p>
				<h1>Portfolio blocks</h1>
				<p>{description}</p>
			</header>
			<section className="docs-section" aria-labelledby="available-title">
				<div className="docs-subhead">
					<h2 id="available-title">Available blocks</h2>
					<p>
						Install the composition you need, then edit the copied source in
						your application.
					</p>
				</div>
				<div className="grid grid-cols-1 gap-ml-4 md:grid-cols-2">
					{blocks.map((block) => (
						<Card key={block.name} asChild>
							<Link href={blockPath(block.name)}>
								<Card.Body>
									<Card.Eyebrow>{block.categories.join(" · ")}</Card.Eyebrow>
									<Card.Title>{block.title}</Card.Title>
									<Card.Description>{block.description}</Card.Description>
								</Card.Body>
								<Card.Action>
									<Card.Arrow />
								</Card.Action>
							</Link>
						</Card>
					))}
				</div>
			</section>
			<section className="docs-section" aria-labelledby="request-title">
				<div className="docs-subhead">
					<h2 id="request-title">Request the next block</h2>
					<p>
						New blocks start with a real page or workflow. Share the content,
						responsive behavior, and project where you plan to use it.
					</p>
				</div>
				<Button asChild variant="secondary">
					<a href="https://github.com/chitranklabs/monoline-ui/issues/new?template=registry_request.md">
						Request a registry block
					</a>
				</Button>
			</section>
		</main>
	)
}
