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
import { routes } from "../lib/routes"

const displayTitle = "Introduction"
const pageDescription =
	"Use monoline/ui to build React portfolios, documentation, and editorial interfaces with typed components, direct exports, and Tailwind CSS v4 theme tokens."

export const metadata: Metadata = createPageMetadata({
	title: "Introduction to Monoline UI React Design System | Docs",
	description: pageDescription,
	path: routes.docs.root,
})

const importCode = `import { Card } from "@chitrank2050/monoline-ui/card"
import { Popover } from "@chitrank2050/monoline-ui/popover"`

const packageParts = [
	{
		title: "React components",
		description:
			"The package exposes 47 typed components for navigation, forms, overlays, content, feedback, and page structure.",
	},
	{
		title: "Theme stylesheet",
		description:
			"One CSS import provides Tailwind CSS v4 source registration, semantic variables, component styles, and light and dark themes.",
	},
	{
		title: "Direct subpath exports",
		description:
			"Each component has a direct package entry, so application code can import only the component it uses.",
	},
	{
		title: "Explicit client boundaries",
		description:
			"Static components can stay in a React Server Component. Interactive entries declare their own client boundary.",
	},
] as const

export default function DocsIntroductionPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@graph": [
			createTechArticleJsonLd({
				title: displayTitle,
				description: pageDescription,
				path: routes.docs.root,
			}),
			createBreadcrumbJsonLd([
				{ name: "Monoline UI", path: routes.home },
				{ name: displayTitle, path: routes.docs.root },
			]),
		],
	}

	return (
		<main id="main-content" tabIndex={-1} className="docs-page">
			<JsonLd data={jsonLd} />
			<header className="docs-page__head">
				<p className="ml-eyebrow">Documentation</p>
				<h1>{displayTitle}</h1>
				<p>
					Monoline UI is a React component library for portfolios,
					documentation, and editorial product interfaces. It combines typed
					package exports with a Tailwind CSS v4 theme built from semantic CSS
					variables.
				</p>
			</header>

			<section className="docs-section" aria-labelledby="package-title">
				<div className="docs-subhead">
					<h2 id="package-title">What the package provides</h2>
					<p>
						Components, styles, and TypeScript declarations ship together. The
						documentation site uses the published component API in its examples.
					</p>
				</div>
				<div className="grid grid-cols-1 gap-ml-4 sm:grid-cols-2">
					{packageParts.map((part) => (
						<Card key={part.title}>
							<Card.Body>
								<Card.Title>{part.title}</Card.Title>
								<Card.Description lines={4}>
									{part.description}
								</Card.Description>
							</Card.Body>
						</Card>
					))}
				</div>
			</section>

			<section className="docs-section" aria-labelledby="imports-title">
				<div className="docs-subhead">
					<h2 id="imports-title">How imports work</h2>
					<p>
						Use a component&apos;s direct subpath in application code. Static
						entries do not add a Monoline client boundary; components that own
						browser state or overlay behavior are client entries.
					</p>
				</div>
				<CodeBlock
					filename="component-imports.tsx"
					language="tsx"
					code={importCode}
				/>
			</section>

			<section className="docs-section" aria-labelledby="theme-title">
				<div className="docs-subhead">
					<h2 id="theme-title">How styling works</h2>
					<p>
						Import <code>@chitrank2050/monoline-ui/theme.css</code> once in your
						root stylesheet. Components then read semantic color, type, spacing,
						radius, and motion variables from the active theme.
					</p>
				</div>
				<Callout variant="note" label="Accessibility depends on context">
					Monoline provides component-level keyboard and semantic behavior. Your
					application still owns accessible names, document structure, content,
					contrast after token overrides, and end-to-end testing.
				</Callout>
			</section>

			<section className="docs-section" aria-labelledby="next-title">
				<div className="docs-subhead">
					<h2 id="next-title">Choose your next step</h2>
					<p>
						Install the package first, browse the component API, or review the
						theme tokens before adapting the visual system.
					</p>
				</div>
				<div className="flex flex-wrap items-center gap-ml-3">
					<Button asChild size="md">
						<Link href={routes.docs.installation}>Install monoline/ui</Link>
					</Button>
					<Button asChild variant="secondary" size="md">
						<Link href={routes.docs.components.root}>Browse components</Link>
					</Button>
					<Button asChild variant="ghost" size="md">
						<Link href={routes.docs.foundations.root}>Review foundations</Link>
					</Button>
				</div>
			</section>
		</main>
	)
}
