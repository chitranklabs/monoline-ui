import Link from "next/link"

const stats = [
	["25", "Components"],
	["2", "Themes"],
	["12kb", "Gzipped"],
	["MIT", "Licence"],
]

const builtFor = [
	["Personal portfolios", "Editorial layout, long-form posts"],
	["Developer docs", "Code blocks, callouts, TOC"],
	["Indie product sites", "Hero + features + footer"],
	["Internal tools", "Cards, tables, status chips"],
]

const components = [
	["Card", "Container with hover + interactive variants"],
	["SectionHead", "Eyebrow + title + lede block"],
	["Container", "Max-width content wrapper"],
	["ActionRail", "Icon button column"],
	["Navbar", "Top chrome with active underline"],
	["Footer", "Brand block + link columns + meta bar"],
	["Rail", "Sidebar tag list with counts"],
	["Toc", "Table of contents with scroll-spy"],
	["Button", "5 variants × 4 sizes, icon, asChild"],
	["Input", "Text/search with prefix icon + kbd"],
	["Toggle", "On/off switch with spring thumb"],
	["Tag", "Filter pill with active state"],
]

const rules = [
	[
		"01",
		"Two themes, one source of truth",
		'Toggle data-theme="light" on <html> and every component re-themes — no dark variants in component code.',
	],
	[
		"02",
		"CSS tokens, not Tailwind config",
		"All colours, fonts, radii live in design-tokens.css. Swap one file to rebrand. Tailwind v4 reads them automatically.",
	],
	[
		"03",
		"No icon set baked in",
		"Bring your own lucide, react-icons, svgs. The library exposes slots, not opinions.",
	],
]

function PreviewCard() {
	return (
		<div className="intro-preview" aria-label="Component preview">
			<div className="intro-preview__bar">
				<div>
					<span className="bg-[#ff5f57]" />
					<span className="bg-[#ffbd2e]" />
					<span className="bg-[#28c840]" />
				</div>
				<p>card.tsx</p>
			</div>
			<div className="intro-preview__body">
				<div className="intro-preview__actions">
					<button type="button">Contact me</button>
					<button type="button">Resume</button>
					<span>• Live</span>
				</div>
				<article className="intro-preview__article">
					<p>Engineering · 9 min</p>
					<h2>Designing a type-safe BFF</h2>
					<small>May 12, 2026 · ↗</small>
				</article>
				<pre>{`<Card variant="hover">
  <CardBody>
    <Eyebrow>Engineering</Eyebrow>
    <h3>Designing a type-safe BFF</h3>
  </CardBody>
</Card>`}</pre>
			</div>
		</div>
	)
}

export default function HomePage() {
	return (
		<main className="intro-page">
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
						25 components for personal sites, portfolios, and developer docs.
						Monochrome by default, one warm accent, two themes. Drop in, swap
						the brand colour, ship.
					</p>
					<div className="intro-actions">
						<Link
							href="/installation"
							className="intro-button intro-button--primary"
						>
							Get started <span aria-hidden="true">→</span>
						</Link>
						<Link href="/components/footer" className="intro-button">
							Browse components
						</Link>
						<code>$ npm i monoline-ui ⧉</code>
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
						<p className="ml-eyebrow">Inside the box · 25 components</p>
						<h2>Everything an editorial site needs.</h2>
					</div>
					<Link href="/components/footer">All components →</Link>
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
				<h2>Opinionated where it counts, configurable where you'd want it.</h2>
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
