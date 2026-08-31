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

const displayTitle = "Accessibility"
const pageDescription =
	"Learn how monoline/ui handles keyboard input, focus, reduced motion, semantic roles, and accessible states—and what your application still needs to provide."

export const metadata: Metadata = createPageMetadata({
	title: "Accessible React Components | monoline/ui Guidelines",
	description: pageDescription,
	path: "/docs/accessibility",
})

const behaviorRows = [
	{
		label: "Dialog / Popover",
		title: "Managed overlay focus",
		description:
			"Dialog contains focus and makes the page inert; both primitives handle Escape, outside interaction, portals, and focus restoration.",
	},
	{
		label: "Button",
		title: "Native button or delegated link semantics",
		description:
			"Loading sets aria-busy and an unavailable state. Icon-only buttons still need an aria-label from the caller.",
	},
	{
		label: "Toggle",
		title: "Switch semantics",
		description:
			"Exposes role=switch and aria-checked while retaining keyboard activation through a native button.",
	},
	{
		label: "SegmentedControl",
		title: "Single-choice keyboard model",
		description:
			"Uses a radiogroup with radio items and supports arrow-key movement between enabled options.",
	},
	{
		label: "Select / DropdownMenu",
		title: "Listbox and menu keyboard models",
		description:
			"The controls expose their expanded state, active choice, arrow-key movement, typeahead, selection, dismissal, and focus return.",
	},
	{
		label: "Checkbox / RadioGroup",
		title: "Native choice semantics",
		description:
			"Checked and selected state stays available to assistive technology while labels remain clickable and keyboard navigation follows the expected pattern.",
	},
	{
		label: "Toast / Progress",
		title: "Status is exposed without relying on color",
		description:
			"Toast uses a status region. Progress publishes its range and current value when progress is determinate.",
	},
] as const

const labelledControlCode = `import { Button } from "@chitrank2050/monoline-ui/button"

export function CopyLinkButton() {
  return (
    <Button variant="secondary" icon aria-label="Copy page link">
      <CopyIcon aria-hidden="true" />
    </Button>
  )
}`

export default function AccessibilityPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@graph": [
			createTechArticleJsonLd({
				title: displayTitle,
				description: pageDescription,
				path: "/docs/accessibility",
			}),
			createBreadcrumbJsonLd([
				{ name: "Monoline UI", path: "/" },
				{ name: displayTitle, path: "/docs/accessibility" },
			]),
		],
	}

	return (
		<main id="main-content" tabIndex={-1} className="docs-page">
			<JsonLd data={jsonLd} />
			<header className="docs-page__head">
				<p className="ml-eyebrow">Product guide · Accessibility</p>
				<h1>{displayTitle}</h1>
				<p>
					Monoline supplies accessible component mechanics where the library
					owns them. Your product still owns names, content, page structure,
					contrast after customization, and end-to-end testing.
				</p>
			</header>

			<div className="docs-section">
				<Callout variant="note" label="Scope, not certification">
					This page documents implemented behavior. It is not a claim that every
					interface assembled with Monoline automatically conforms to WCAG.
				</Callout>
			</div>

			<section className="docs-section" aria-labelledby="built-in-title">
				<div className="docs-subhead">
					<h2 id="built-in-title">Behavior built into the library</h2>
					<p>
						The component determines the interaction model; the application
						supplies context-specific copy and wiring.
					</p>
				</div>
				<DataList items={[...behaviorRows]} />
			</section>

			<section className="docs-section" aria-labelledby="defaults-title">
				<div className="docs-subhead">
					<h2 id="defaults-title">Shared accessibility defaults</h2>
				</div>
				<div className="grid grid-cols-1 gap-ml-4 md:grid-cols-2">
					<Card>
						<Card.Body>
							<Card.Eyebrow>Focus</Card.Eyebrow>
							<Card.Title>Visible keyboard focus</Card.Title>
							<Card.Description lines={4}>
								The theme applies one token-backed focus ring to links, buttons,
								inputs, selects, textareas, and explicit tabindex targets.
							</Card.Description>
						</Card.Body>
					</Card>
					<Card>
						<Card.Body>
							<Card.Eyebrow>Motion</Card.Eyebrow>
							<Card.Title>Reduced-motion fallback</Card.Title>
							<Card.Description lines={4}>
								When reduced motion is requested, theme utilities shorten
								animations and transitions and remove card image transforms.
							</Card.Description>
						</Card.Body>
					</Card>
				</div>
			</section>

			<section className="docs-section" aria-labelledby="consumer-title">
				<div className="docs-subhead">
					<h2 id="consumer-title">What your application must provide</h2>
					<p>
						A reusable component cannot infer the meaning of an icon or validate
						the quality of your content.
					</p>
				</div>
				<ul className="guide-page__checklist">
					<li>Give icon-only controls a concise accessible name.</li>
					<li>
						Associate every form control with a visible label or aria-label.
					</li>
					<li>
						Keep headings in document order and use landmarks for page regions.
					</li>
					<li>Recheck contrast after overriding semantic color tokens.</li>
					<li>
						Test real flows with a keyboard and at least one screen reader.
					</li>
				</ul>
				<div className="guide-page__code">
					<CodeBlock
						filename="copy-link-button.tsx"
						language="tsx"
						code={labelledControlCode}
					/>
				</div>
			</section>
		</main>
	)
}
