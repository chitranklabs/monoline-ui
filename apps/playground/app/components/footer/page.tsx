import { Footer } from "@chitrank2050/monoline-ui"

const footerColumns = [
	{
		title: "Navigate",
		links: [
			{ href: "#", label: "Projects" },
			{ href: "#", label: "Blog" },
			{ href: "#", label: "About" },
			{ href: "#", label: "Now" },
		],
	},
	{
		title: "Elsewhere",
		links: [
			{ href: "https://linkedin.com", label: "LinkedIn", external: true },
			{ href: "https://github.com", label: "GitHub", external: true },
			{ href: "https://x.com", label: "X / Twitter", external: true },
			{ href: "mailto:hello@example.com", label: "Email", external: true },
		],
	},
]

const propsRows = [
	[
		"brand",
		"ReactNode",
		"Brand block - usually a wordmark + tagline + status pill",
	],
	[
		"columns",
		"Column[]",
		"Array of { title, links } - auto-laid into 2/3/4 cols",
	],
	[
		"subscribe",
		"ReactNode?",
		"Optional subscribe form slot - adds a 4th column",
	],
	["meta", "ReactNode?", "Left-aligned text in the bottom bar"],
	["attribution", "ReactNode?", "Right-aligned text in the bottom bar"],
] as const

export default function FooterPage() {
	return (
		<main className="docs-page">
			<header className="docs-page__head docs-page__head--component">
				<p className="ml-eyebrow">Component</p>
				<div className="component-headline">
					<h1>Footer</h1>
					<span>stable · v0.2.0</span>
					<span>2.1 kb gzipped</span>
				</div>
				<p>
					Inspect the footer at real viewport widths, switch component size,
					render all sizes together, and zoom the canvas without losing the
					package&apos;s actual Tailwind/theme styling.
				</p>
			</header>

			<section className="playground-controls">
				<div className="playground-controls__group">
					<label>Render</label>
					<div className="playground-segmented">
						<button type="button" aria-pressed="true">
							Single
						</button>
						<button type="button">All sizes</button>
					</div>
				</div>
				<div className="playground-controls__group">
					<label>Size</label>
					<div className="playground-segmented">
						<button type="button">SM</button>
						<button type="button" aria-pressed="true">
							MD
						</button>
						<button type="button">LG</button>
					</div>
				</div>
				<div className="playground-controls__group">
					<label>Viewport</label>
					<div className="playground-segmented">
						<button type="button">Mobile</button>
						<button type="button">Tablet</button>
						<button type="button" aria-pressed="true">
							Desktop
						</button>
						<button type="button">Wide</button>
					</div>
				</div>
				<div className="playground-controls__group">
					<label>Theme</label>
					<div className="playground-segmented">
						<button type="button" aria-pressed="true">
							Light
						</button>
						<button type="button">Dark</button>
					</div>
				</div>
				<div className="playground-controls__group">
					<label>Zoom</label>
					<div className="playground-zoom">75%</div>
				</div>
			</section>

			<section className="playground-canvas">
				<div className="playground-canvas__meta">
					<span>MD · 75%</span>
					<span>Desktop · 1280px · 75%</span>
				</div>
				<div className="playground-canvas__viewport">
					<div className="playground-canvas__frame">
						<Footer
							size="md"
							columns={[...footerColumns]}
							meta="© 2026 · Built by Chitrank Agnihotri · v3.2.0"
							attribution="Next 15 · Sanity · Tailwind 4"
						/>
					</div>
				</div>
			</section>

			<section className="playground-detail">
				<div className="playground-detail__tabs">
					<button type="button" aria-pressed="true">
						Usage
					</button>
					<button type="button">Props</button>
					<button type="button">Tokens</button>
					<button type="button">Source</button>
				</div>
				<div className="playground-detail__body">
					<h3>Import</h3>
					<pre>{`import { Footer } from "monoline-ui/Footer"`}</pre>

					<h3>Basic usage</h3>
					<pre>{`<Footer
  brand={<Brand />}
  status={<Footer.Status>Open to work</Footer.Status>}
  columns={[
    { title: "Navigate", links: [
      { label: "Projects", href: "/projects" },
      { label: "Blog", href: "/blog" },
    ]},
    { title: "Elsewhere", links: [
      { label: "LinkedIn", href: "...", external: true },
    ]},
  ]}
  subscribe={<Footer.Subscribe />}
  meta="© 2026 · v3.2.0"
  attribution="Next 15 · Sanity · Tailwind 4"
/>`}</pre>

					<h3>Props at a glance</h3>
					<div className="props-table">
						{propsRows.map(([name, type, description], index) => (
							<div
								key={name}
								className="props-table__row"
								data-odd={index % 2 === 1}
							>
								<span>{name}</span>
								<span>{type}</span>
								<span>{description}</span>
							</div>
						))}
					</div>
				</div>
			</section>
		</main>
	)
}
