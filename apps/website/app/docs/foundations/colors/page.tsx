import type { Metadata } from "next"

import { DocsArticleJsonLd } from "../../../_components/docs-article-json-ld"
import { createPageMetadata } from "../../../lib/metadata"
import { routes } from "../../../lib/routes"

const displayTitle = "Colors"
const pageDescription =
	"Monoline UI maps light and dark themes to semantic color tokens for surfaces, text, borders, accents, status, and interactive states in React interfaces."

export const metadata: Metadata = createPageMetadata({
	title: "Color Design Tokens and UI Themes | monoline/ui Docs",
	description: pageDescription,
	path: routes.docs.foundations.colors,
})

const colorGroups = [
	{
		title: "Surfaces",
		blurb:
			"Backgrounds move from page to card to nested surfaces. Use the least prominent token that works.",
		badge: "6 tokens",
		tokens: [
			["bg", "oklch(0.145 0 0)", "oklch(0.98 0.005 80)", "#101010", "#f7f5ee"],
			["card", "oklch(0.205 0 0)", "oklch(1 0 0)", "#232323", "#ffffff"],
			["surface", "oklch(0.18 0 0)", "oklch(1 0 0)", "#1a1a1a", "#ffffff"],
			[
				"surface-2",
				"oklch(0.17 0 0)",
				"oklch(0.975 0.003 80)",
				"#191919",
				"#f7f5f0",
			],
			[
				"surface-3",
				"oklch(0.16 0 0)",
				"oklch(0.955 0.004 80)",
				"#171717",
				"#efede8",
			],
			["button", "oklch(0.22 0 0)", "oklch(0.96 0 0)", "#262626", "#efefef"],
		],
	},
	{
		title: "Text",
		blurb:
			"Use primary for headings, secondary for body copy, and muted for metadata.",
		badge: "5 tokens",
		tokens: [
			["primary", "oklch(0.985 0 0)", "oklch(0.18 0 0)", "#ffffff", "#1f1f1f"],
			["secondary", "oklch(0.87 0 0)", "oklch(0.32 0 0)", "#d5d5d5", "#4b4b4b"],
			["muted", "oklch(0.62 0 0)", "oklch(0.50 0 0)", "#919191", "#7a7a7a"],
			["body", "oklch(0.91 0 0)", "oklch(0.22 0 0)", "#e6e6e6", "#262626"],
			["code-text", "oklch(0.86 0 0)", "oklch(0.28 0 0)", "#dbdbdb", "#343434"],
		],
	},
	{
		title: "Borders",
		blurb:
			"Use border for quiet containers and border-strong for visible controls.",
		badge: "2 tokens",
		tokens: [
			[
				"border",
				"rgba(255,255,255,0.10)",
				"rgba(10,10,10,0.08)",
				"#323232",
				"#efefef",
			],
			[
				"border-strong",
				"rgba(255,255,255,0.18)",
				"rgba(10,10,10,0.18)",
				"#505050",
				"#d1d1d1",
			],
		],
	},
	{
		title: "Brand",
		blurb:
			"Use the accent for active filters, live states, and high-signal hover feedback.",
		badge: "2 tokens",
		tokens: [
			[
				"accent",
				"oklch(0.78 0.09 60)",
				"oklch(0.55 0.13 40)",
				"#e4ae75",
				"#bc5c32",
			],
			[
				"accent-soft",
				"oklch(0.78 0.09 60 / 0.14)",
				"oklch(0.55 0.13 40 / 0.10)",
				"#3d3126",
				"#f4e3da",
			],
		],
	},
] as const

export default function ColorsPage() {
	return (
		<main id="main-content" tabIndex={-1} className="docs-page">
			<DocsArticleJsonLd
				title={displayTitle}
				description={pageDescription}
				path={routes.docs.foundations.colors}
				section="Foundations"
				sectionPath={routes.docs.foundations.root}
			/>
			<header className="docs-page__head">
				<p className="ml-eyebrow">Foundations · Colors</p>
				<h1>{displayTitle}</h1>
				<p>
					Every color resolves through a CSS custom property. Change
					<code> data-theme</code> on <code>&lt;html&gt;</code> and components
					keep the same token names in both modes.
				</p>
			</header>

			<section className="theme-preview" data-toc-exclude>
				<div
					className="theme-preview__panel theme-preview__panel--dark"
					data-theme="dark"
				>
					<p className="ml-eyebrow">Dark preview</p>
					<h2>Dark mode sample</h2>
					<p>
						This panel resolves surface, text, border, and accent variables from
						the dark theme.
					</p>
					<span className="theme-preview__badge theme-preview__badge--dark">
						<span /> Accent
					</span>
				</div>
				<div
					className="theme-preview__panel theme-preview__panel--light"
					data-theme="light"
				>
					<p className="ml-eyebrow">Light preview</p>
					<h2>Light mode sample</h2>
					<p>
						This panel resolves the same semantic variables from the light
						theme.
					</p>
					<span className="theme-preview__badge">
						<span /> Accent
					</span>
				</div>
			</section>

			<div className="docs-stack">
				{colorGroups.map((group) => (
					<section key={group.title} className="color-section">
						<div className="color-section__head">
							<h2>{group.title}</h2>
							<span>{group.badge}</span>
						</div>
						<p>{group.blurb}</p>
						<div className="color-grid">
							{group.tokens.map(
								([name, dark, light, darkSwatch, lightSwatch]) => (
									<article key={name} className="color-row">
										<div className="color-row__swatches">
											<div style={{ background: darkSwatch }} />
											<div style={{ background: lightSwatch }} />
										</div>
										<div className="color-row__body">
											<h3>--{name}</h3>
											<div className="color-row__meta">
												<span>Dark</span>
												<span>{dark}</span>
												<span>Light</span>
												<span>{light}</span>
											</div>
										</div>
									</article>
								)
							)}
						</div>
					</section>
				))}
			</div>
		</main>
	)
}
