import type { Metadata } from "next"
import Link from "next/link"

import { Button } from "@chitrank2050/monoline-ui/button"
import { Card } from "@chitrank2050/monoline-ui/card"
import metadataJson from "@chitrank2050/monoline-ui/metadata.json"

import { CliBadge } from "./_components/cli-badge"
import { CodeBlock } from "./_components/component-playground"
import { createPageMetadata } from "./lib/metadata"

export const metadata: Metadata = createPageMetadata({
	title: "monoline/ui - Token-first React component library",
	description:
		"Responsive React components for personal sites, portfolios, and documentation built on Tailwind CSS v4 design tokens.",
	path: "/",
})

const stats = [
	[String(metadataJson.count), "Components"],
	["2", "Themes"],
	["12kb", "Gzipped"],
	["MIT", "License"],
]

const builtFor = [
	["Personal portfolios", "Editorial layout, long-form posts"],
	["Developer docs", "Code blocks, callouts, TOC"],
	["Product sites", "Hero, feature, and footer sections"],
	["Internal tools", "Cards, tables, status chips"],
]

const components = [
	["Card", "Linked, static, or button-backed content cards"],
	["SectionHead", "Eyebrow, title, and lede block"],
	["Container", "Max-width content wrapper"],
	["ActionRail", "Compact action groups"],
	["Navbar", "Responsive site header"],
	["Footer", "Brand, links, subscribe, and meta rows"],
	["Rail", "Vertical secondary navigation"],
	["Toc", "Table of contents with active tracking"],
	["Button", "Actions, links, icons, and loading state"],
	["Input", "Text fields with prefix and suffix slots"],
	["Toggle", "Accessible switch control"],
	["SegmentedControl", "Single-select control groups"],
	["Tag", "Filter pills and metadata chips"],
]

const rules = [
	[
		"01",
		"Two themes, one source of truth",
		'Set data-theme="light" or data-theme="dark" on <html>. Components read the same tokens in both modes.',
	],
	[
		"02",
		"CSS tokens, not Tailwind config",
		"Colors, fonts, radii, spacing, and motion live in theme.css. Swap the token layer to rebrand.",
	],
	[
		"03",
		"No icon set baked in",
		"Bring lucide, react-icons, SVGs, or your own glyphs. Components expose slots instead of icon opinions.",
	],
]

function PreviewCard() {
	return (
		<div className="intro-preview" aria-label="Component preview">
			<div className="intro-preview__bar">
				<div>
					<span style={{ backgroundColor: "var(--mac-red)" }} />
					<span style={{ backgroundColor: "var(--mac-amber)" }} />
					<span style={{ backgroundColor: "var(--mac-green)" }} />
				</div>
				<p>card.tsx</p>
			</div>
			<div className="intro-preview__body">
				<div className="intro-preview__actions">
					<Button size="sm">Contact me</Button>
					<Button size="sm" variant="secondary">
						Resume
					</Button>
				</div>
				<Card
					size="sm"
					href="/components/card"
					className="intro-preview__article"
				>
					<Card.Body>
						<p>Engineering · 9 min</p>
						<h2>Designing a type-safe BFF</h2>
					</Card.Body>
					<Card.Footer>
						<small>May 12, 2026</small>
						<Card.Arrow />
					</Card.Footer>
				</Card>
				<CodeBlock
					code={`<Card href="/blog/designing-a-type-safe-bff">
  <CardBody>
    <Eyebrow>Engineering</Eyebrow>
    <h3>Designing a type-safe BFF</h3>
  </CardBody>
</Card>`}
				/>
			</div>
		</div>
	)
}

export default function HomePage() {
	return (
		<main id="main-content" tabIndex={-1} className="intro-page">
			<section className="intro-hero">
				<div className="intro-hero__copy">
					<div className="intro-pills">
						<span className="intro-pill intro-pill--accent">
							• Now in public beta
						</span>
						<span className="intro-pill">v0.2.0</span>
					</div>
					<h1>
						A component library
						<br />
						<span>with a point of view.</span>
					</h1>
					<p>
						{metadataJson.count} components for personal sites, portfolios, and
						developer docs. Monochrome by default, one warm accent, two themes.
						Drop in the package, change the brand color, and ship.
					</p>
					<div className="intro-actions">
						<Button asChild>
							<Link href="/installation">
								Get started
								<Button.Arrow />
							</Link>
						</Button>
						<Button asChild variant="secondary">
							<Link href="/components/footer">Browse components</Link>
						</Button>
						<CliBadge />
					</div>
				</div>
				<PreviewCard />
			</section>

			<section className="intro-stats" aria-label="Project stats">
				{stats.map(([value, label]) => (
					<div key={label}>
						<strong>{value}</strong>
						<span>{label}</span>
					</div>
				))}
			</section>

			<section className="intro-band">
				<p className="ml-eyebrow">Built for</p>
				<div className="intro-band__grid">
					{builtFor.map(([title, description]) => (
						<div key={title}>
							<h2>{title}</h2>
							<p>{description}</p>
						</div>
					))}
				</div>
			</section>

			<section className="intro-section">
				<div className="intro-section__head">
					<div>
						<p className="ml-eyebrow">
							Inside the box · {metadataJson.count} components
						</p>
						<h2>Components for editorial products.</h2>
					</div>
					<Link href="/components/footer" className="ml-interaction-color">
						All components →
					</Link>
				</div>
				<div className="intro-components">
					{components.map(([title, description]) => (
						<article key={title}>
							<h3>{title}</h3>
							<p>{description}</p>
						</article>
					))}
				</div>
			</section>

			<section className="intro-section intro-section--rules">
				<p className="ml-eyebrow">Three rules · why this exists</p>
				<h2>Opinionated defaults, practical escape hatches.</h2>
				<div className="intro-rules">
					{rules.map(([number, title, description]) => (
						<article key={number}>
							<span>{number}</span>
							<h3>{title}</h3>
							<p>{description}</p>
						</article>
					))}
				</div>
			</section>
		</main>
	)
}
