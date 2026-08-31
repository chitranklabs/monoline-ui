import type { Metadata } from "next"
import Link from "next/link"

import { Button } from "@chitrank2050/monoline-ui/button"
import { Callout } from "@chitrank2050/monoline-ui/callout"
import { Card } from "@chitrank2050/monoline-ui/card"
import { CodeBlock } from "@chitrank2050/monoline-ui/code-block"

import JsonLd, {
	createBreadcrumbJsonLd,
	createTechArticleJsonLd,
} from "../_components/json-ld"
import { createPageMetadata } from "../lib/metadata"

const displayTitle = "Introduction"
const pageDescription =
	"Explore Monoline UI, a modern React 19 design system built on OKLCH CSS tokens, hairline borders, and Tailwind CSS v4 for developer products and dashboards."

export const metadata: Metadata = createPageMetadata({
	title: "Introduction to Monoline UI React Design System | Docs",
	description: pageDescription,
	path: "/docs",
})

export default function DocsIntroductionPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@graph": [
			createTechArticleJsonLd({
				title: displayTitle,
				description: pageDescription,
				path: "/docs",
			}),
			createBreadcrumbJsonLd([
				{ name: "Monoline UI", path: "/" },
				{ name: displayTitle, path: "/docs" },
			]),
		],
	}

	return (
		<main id="main-content" tabIndex={-1} className="docs-page">
			<JsonLd data={jsonLd} />
			<div className="flex flex-col gap-ml-8">
				{/* Page Header */}
				<header className="docs-page__head mb-0">
					<p className="ml-eyebrow">Documentation</p>
					<h1>{displayTitle}</h1>
					<p>
						Monoline UI is a modern, high-precision React design system built
						for production web applications. Designed from the ground up for
						React 19, Tailwind CSS v4, and semantic OKLCH design tokens.
					</p>
				</header>

				{/* Highlight Callout */}
				<Callout variant="tip" label="Tailwind CSS v4 & OKLCH Native">
					Monoline UI components have zero JavaScript runtime styling overhead.
					All colors, spacings, radii, and transitions resolve through standard
					CSS custom properties.
				</Callout>

				{/* Quick Start Code */}
				<div className="flex flex-col gap-ml-3">
					<h2 className="text-xl font-semibold text-text">Quick Start</h2>
					<p className="text-sm text-text-secondary leading-relaxed">
						Install the package and import the stylesheet in your root layout:
					</p>
					<CodeBlock
						description="Install with your preferred package manager"
						filename="Terminal"
						language="bash"
						code="pnpm add @chitrank2050/monoline-ui"
					/>
					<CodeBlock
						description="Import theme tokens in your globals.css or root layout"
						filename="src/app/globals.css"
						language="css"
						code={`@import "tailwindcss";\n@import "@chitrank2050/monoline-ui/theme.css";`}
					/>
				</div>

				{/* Design Principles Cards */}
				<div className="flex flex-col gap-ml-4">
					<h2 className="text-xl font-semibold text-text">Design Principles</h2>
					<div className="grid grid-cols-1 gap-ml-4 sm:grid-cols-2">
						<Card className="p-ml-5">
							<Card.Body className="p-0 gap-ml-2">
								<span className="font-mono text-3xs font-semibold uppercase tracking-eyebrow text-accent">
									01 • Precision
								</span>
								<h3 className="text-base font-semibold text-text">
									Hairline Aesthetics
								</h3>
								<p className="text-xs text-text-secondary leading-relaxed">
									Razor-sharp 1px border lines, subtle surface shifts, and clean
									monochrome typography engineered for dense dashboards and
									editorial tools.
								</p>
							</Card.Body>
						</Card>

						<Card className="p-ml-5">
							<Card.Body className="p-0 gap-ml-2">
								<span className="font-mono text-3xs font-semibold uppercase tracking-eyebrow text-accent">
									02 • Tokens
								</span>
								<h3 className="text-base font-semibold text-text">
									Perceptually Uniform
								</h3>
								<p className="text-xs text-text-secondary leading-relaxed">
									Color palettes configured in OKLCH space guarantee uniform
									contrast across light and dark themes with zero runtime
									CSS-in-JS penalties.
								</p>
							</Card.Body>
						</Card>

						<Card className="p-ml-5">
							<Card.Body className="p-0 gap-ml-2">
								<span className="font-mono text-3xs font-semibold uppercase tracking-eyebrow text-accent">
									03 • A11y
								</span>
								<h3 className="text-base font-semibold text-text">
									Accessible by Default
								</h3>
								<p className="text-xs text-text-secondary leading-relaxed">
									Full keyboard roving focus, WAI-ARIA compliance, screen-reader
									labels, and automated contrast ratios built into every
									primitive.
								</p>
							</Card.Body>
						</Card>

						<Card className="p-ml-5">
							<Card.Body className="p-0 gap-ml-2">
								<span className="font-mono text-3xs font-semibold uppercase tracking-eyebrow text-accent">
									04 • Flexibility
								</span>
								<h3 className="text-base font-semibold text-text">
									Compound Primitives
								</h3>
								<p className="text-xs text-text-secondary leading-relaxed">
									Slot-driven compound components support seamless composition,
									custom wrappers, and the standard React 19 `asChild` pattern.
								</p>
							</Card.Body>
						</Card>
					</div>
				</div>

				{/* Navigation Cards */}
				<div className="flex flex-col gap-ml-4 pt-ml-4 border-t border-border">
					<h2 className="text-xl font-semibold text-text">Explore Guides</h2>
					<div className="flex flex-wrap items-center gap-ml-3">
						<Button asChild size="md">
							<Link href="/docs/installation">Installation Guide →</Link>
						</Button>
						<Button asChild variant="secondary" size="md">
							<Link href="/docs/components">Browse 47 Components →</Link>
						</Button>
						<Button asChild variant="ghost" size="md">
							<Link href="/docs/foundations/colors">Design Tokens →</Link>
						</Button>
					</div>
				</div>
			</div>
		</main>
	)
}
